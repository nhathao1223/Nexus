const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getHome = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    let query = { deleted: false, status: 'active' };
    
    // Lọc theo danh mục
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Lọc theo hãng (brand)
    if (req.query.brand) {
      query.title = { $regex: req.query.brand, $options: 'i' };
    }

    // Tìm kiếm
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Lọc theo khoảng giá
    if (req.query.priceRange) {
      const priceRange = req.query.priceRange;
      if (priceRange === '0-5') {
        query.price = { $lt: 5000000 };
      } else if (priceRange === '5-10') {
        query.price = { $gte: 5000000, $lt: 10000000 };
      } else if (priceRange === '10-20') {
        query.price = { $gte: 10000000, $lt: 20000000 };
      } else if (priceRange === '20+') {
        query.price = { $gte: 20000000 };
      }
    }

    // Sắp xếp
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    if (req.query.sort === 'price-desc') sort = { price: -1 };
    if (req.query.sort === 'name-asc') sort = { title: 1 };

    const products = await Product.find(query)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const categories = await Category.find({ deleted: false, status: 'active' });

    res.render('client/home', {
      title: 'Trang chủ',
      products,
      categories,
      currentPage: page,
      totalPages,
      query: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('client/error', { title: 'Lỗi', error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    let query = { deleted: false, status: 'active' };
    
    // Lọc theo danh mục
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Lọc theo hãng (brand)
    if (req.query.brand) {
      query.title = { $regex: req.query.brand, $options: 'i' };
    }

    // Tìm kiếm
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Lọc theo khoảng giá
    if (req.query.priceRange) {
      const priceRange = req.query.priceRange;
      if (priceRange === '0-5') {
        query.price = { $lt: 5000000 };
      } else if (priceRange === '5-10') {
        query.price = { $gte: 5000000, $lt: 10000000 };
      } else if (priceRange === '10-20') {
        query.price = { $gte: 10000000, $lt: 20000000 };
      } else if (priceRange === '20+') {
        query.price = { $gte: 20000000 };
      }
    }

    // Lọc theo giá tùy chỉnh (giữ lại cho backward compatibility)
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Sắp xếp
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    if (req.query.sort === 'price-desc') sort = { price: -1 };
    if (req.query.sort === 'name-asc') sort = { title: 1 };

    const products = await Product.find(query)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const categories = await Category.find({ deleted: false, status: 'active' });

    res.render('client/products', {
      title: 'Sản phẩm',
      products,
      categories,
      currentPage: page,
      totalPages,
      query: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('client/error', { title: 'Lỗi', error });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug, 
      deleted: false,
      status: 'active'
    }).populate('category');

    if (!product) {
      return res.status(404).render('client/404', { title: 'Không tìm thấy sản phẩm' });
    }

    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      deleted: false,
      status: 'active'
    }).limit(4);

    res.render('client/product-detail', {
      title: product.title,
      product,
      relatedProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('client/error', { title: 'Lỗi', error });
  }
};

exports.getCart = (req, res) => {
  const cart = req.session.cart || [];
  res.render('client/cart', {
    title: 'Giỏ hàng',
    cart
  });
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product || product.deleted || product.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const existingItem = req.session.cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      req.session.cart.push({
        productId: product._id.toString(),
        title: product.title,
        price: product.price,
        discountPercentage: product.discountPercentage,
        thumbnail: product.thumbnail,
        quantity: parseInt(quantity)
      });
    }

    res.json({ success: true, message: 'Đã thêm vào giỏ hàng', cartCount: req.session.cart.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
  }
};

exports.removeFromCart = (req, res) => {
  try {
    const { productId } = req.body;
    
    if (req.session.cart) {
      req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    }
    
    res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
  }
};

exports.updateCart = (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (req.session.cart) {
      const item = req.session.cart.find(item => item.productId === productId);
      if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
          req.session.cart = req.session.cart.filter(item => item.productId !== productId);
        }
      }
    }
    
    res.json({ success: true, message: 'Đã cập nhật giỏ hàng' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
  }
};

exports.getCheckout = (req, res) => {
  const cart = req.session.cart || [];
  
  if (cart.length === 0) {
    return res.redirect('/cart');
  }
  
  let total = 0;
  cart.forEach(item => {
    const itemPrice = item.price * (1 - item.discountPercentage/100);
    total += itemPrice * item.quantity;
  });
  
  res.render('client/checkout', {
    title: 'Thanh toán',
    cart,
    total,
    user: req.user
  });
};

exports.postCheckout = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    
    if (cart.length === 0) {
      return res.redirect('/cart');
    }
    
    // Tạo đơn hàng mới
    const Order = require('../models/Order');
    
    let total = 0;
    const orderItems = cart.map(item => {
      const itemPrice = item.price * (1 - item.discountPercentage/100);
      total += itemPrice * item.quantity;
      return {
        product: item.productId,
        title: item.title,
        price: itemPrice,
        quantity: item.quantity
      };
    });
    
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: total,
      shippingAddress: {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        district: req.body.district
      },
      paymentMethod: req.body.paymentMethod || 'cod',
      status: 'pending'
    });
    
    await order.save();
    
    // Xóa giỏ hàng
    req.session.cart = [];
    
    res.redirect('/orders/' + order._id);
  } catch (error) {
    console.error(error);
    res.status(500).render('client/error', { title: 'Lỗi', error });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product');
    
    if (!order) {
      return res.status(404).render('client/404', { title: 'Không tìm thấy đơn hàng' });
    }
    
    res.render('client/order-detail', {
      title: 'Chi tiết đơn hàng',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('client/error', { title: 'Lỗi', error });
  }
};
