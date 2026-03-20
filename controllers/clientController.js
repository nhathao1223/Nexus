const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Order = require('../models/Order');
const FlashSaleConfig = require('../models/FlashSaleConfig');
const Review = require('../models/Review');
const { createMomoPayment } = require('../services/momoService');

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

    const flashSaleProducts = await Product.find({
      deleted: false,
      status: 'active',
      flashSale: true
    })
      .sort({ discountPercentage: -1, createdAt: -1 })
      .limit(15);

    const flashSaleConfig = await FlashSaleConfig.getConfig();

    res.render('client/home', {
      title: 'Trang chủ',
      isHome: true,
      products,
      categories,
      currentPage: page,
      totalPages,
      query: req.query,
      flashSaleProducts,
      flashSaleConfig
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
    }).populate({
      path: 'category',
      select: 'name slug specificationFields'
    });

    if (!product) {
      return res.status(404).render('client/404', { title: 'Không tìm thấy sản phẩm' });
    }

    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      deleted: false,
      status: 'active'
    }).limit(4);

    const reviews = await Review.find({
      product: product._id,
      isHidden: false
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const reviewsCount = await Review.countDocuments({
      product: product._id,
      isHidden: false
    });

    res.render('client/product-detail', {
      title: product.title,
      product,
      relatedProducts,
      reviews,
      reviewsCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('client/error', { title: 'Lỗi', error });
  }
};

exports.postProductReview = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      deleted: false,
      status: 'active'
    });

    if (!product) {
      return res.status(404).render('client/404', { title: 'Không tìm thấy sản phẩm' });
    }

    const rating = parseInt(req.body.rating, 10);
    const comment = (req.body.comment || '').trim();

    // Basic anti-spam: 1 comment / 60s per product per user
    const recent = await Review.findOne({
      product: product._id,
      user: req.user._id,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) }
    }).lean();

    if (recent) {
      req.flash('error_msg', 'Bạn đang bình luận quá nhanh. Vui lòng thử lại sau.');
      return res.redirect(`/products/${product.slug}#reviews`);
    }

    await Review.create({
      product: product._id,
      user: req.user._id,
      userName: req.user.fullName,
      rating,
      comment
    });

    // Update cached average rating + count on product
    const agg = await Review.aggregate([
      { $match: { product: product._id, isHidden: false } },
      { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const avg = agg?.[0]?.avg || 0;
    const count = agg?.[0]?.count || 0;
    product.rating = Math.round(avg * 10) / 10;
    product.reviewsCount = count;
    await product.save();

    req.flash('success_msg', 'Cảm ơn bạn đã đánh giá sản phẩm.');
    return res.redirect(`/products/${product.slug}#reviews`);
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra khi gửi đánh giá.');
    return res.redirect(req.get('Referrer') || '/');
  }
};

exports.getCart = (req, res) => {
  const cart = req.session.cart || [];
  res.render('client/cart', {
    title: 'Giỏ hàng',
    cart
  });
};

exports.getCartCount = (req, res) => {
  const cartCount = req.session.cart ? req.session.cart.length : 0;
  res.json({ count: cartCount });
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, warranty } = req.body;
    const product = await Product.findById(productId);

    if (!product || product.deleted || product.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Create unique key for product + warranty combination
    const cartKey = warranty ? `${productId}_${warranty.price}` : productId;
    const existingItem = req.session.cart.find(item => item.cartKey === cartKey);
    
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      req.session.cart.push({
        cartKey: cartKey,
        productId: product._id.toString(),
        title: product.title,
        price: product.price,
        discountPercentage: product.discountPercentage,
        thumbnail: product.thumbnail,
        quantity: parseInt(quantity),
        warranty: warranty || null
      });
    }

    res.json({ 
      success: true, 
      message: 'Đã thêm vào giỏ hàng', 
      cartCount: req.session.cart.length,
      productTitle: product.title
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
  }
};

exports.removeFromCart = (req, res) => {
  try {
    const { cartKey } = req.body;
    
    if (req.session.cart) {
      req.session.cart = req.session.cart.filter(item => item.cartKey !== cartKey);
    }
    
    res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
  }
};

exports.updateCart = (req, res) => {
  try {
    const { cartKey, quantity } = req.body;
    
    if (req.session.cart) {
      const item = req.session.cart.find(item => item.cartKey === cartKey);
      if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
          req.session.cart = req.session.cart.filter(item => item.cartKey !== cartKey);
        }
      }
    }
    
    res.json({ success: true, message: 'Đã cập nhật giỏ hàng' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
  }
};

exports.clearCart = (req, res) => {
  try {
    req.session.cart = [];
    res.json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng' });
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

    let total = 0;
    const orderItems = cart.map(item => {
      const itemPrice = item.price * (1 - item.discountPercentage / 100);
      total += itemPrice * item.quantity;
      return {
        product: item.productId,
        title: item.title,
        price: itemPrice,
        quantity: item.quantity
      };
    });

    const paymentMethod = req.body.paymentMethod || 'cod';

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: total,
      shippingAddress: {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address,
        provinceCode: parseInt(req.body.provinceCode),
        provinceName: req.body.provinceName,
        districtCode: parseInt(req.body.districtCode),
        districtName: req.body.districtName,
        wardCode: parseInt(req.body.wardCode),
        wardName: req.body.wardName
      },
      paymentMethod,
      status: 'pending'
    });

    await order.save();

    if (paymentMethod === 'momo') {
      try {
        const momoResponse = await createMomoPayment({
          amount: total,
          orderId: order._id.toString(),
          orderInfo: `Thanh toán đơn hàng #${order._id}`,
          extraData: order._id.toString()
        });

        if (momoResponse && momoResponse.payUrl) {
          // Xóa giỏ hàng sau khi tạo đơn và có link thanh toán
          req.session.cart = [];
          return res.redirect(momoResponse.payUrl);
        }

        req.flash('error_msg', 'Không tạo được thanh toán MoMo. Vui lòng thử lại hoặc chọn phương thức khác.');
        return res.redirect('/checkout');
      } catch (err) {
        console.error('MoMo payment error:', err);
        req.flash('error_msg', 'Có lỗi khi kết nối MoMo. Vui lòng thử lại sau.');
        return res.redirect('/checkout');
      }
    }

    // Thanh toán COD hoặc chuyển khoản ngân hàng: điều hướng về chi tiết đơn hàng
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

exports.getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(total / limit);

    res.render('client/orders', {
      title: 'Đơn hàng của tôi',
      orders,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('client/error', { title: 'Lỗi', error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    res.render('client/profile', {
      title: 'Thông tin tài khoản',
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('client/error', { title: 'Lỗi', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      fullName,
      phone
    });

    req.flash('success_msg', 'Cập nhật thông tin thành công');
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/profile');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    if (newPassword !== confirmPassword) {
      req.flash('error_msg', 'Mật khẩu xác nhận không khớp');
      return res.redirect('/profile');
    }

    const user = await User.findById(req.user._id);
    const bcrypt = require('bcrypt');
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Mật khẩu hiện tại không đúng');
      return res.redirect('/profile');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user._id, {
      password: hashedPassword
    });

    req.flash('success_msg', 'Đổi mật khẩu thành công');
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/profile');
  }
};
