const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ deleted: false });
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ deleted: false, role: 'user' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      title: 'Trang quản trị',
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/error', { title: 'Lỗi', error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    let query = { deleted: false };
    
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const products = await Product.find(query)
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const categories = await Category.find({ deleted: false });

    res.render('admin/products/index', {
      title: 'Quản lý sản phẩm',
      products,
      categories,
      currentPage: page,
      totalPages,
      query: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/error', { title: 'Lỗi', error });
  }
};

exports.getCreateProduct = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false, status: 'active' });
    res.render('admin/products/create', {
      title: 'Thêm sản phẩm',
      categories
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/admin/products');
  }
};

exports.postCreateProduct = async (req, res) => {
  try {
    const { title, description, price, discountPercentage, stock, category, status, featured } = req.body;
    
    const slug = title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
    const thumbnail = images[0] || '';

    const product = new Product({
      title,
      slug,
      description,
      price,
      discountPercentage: discountPercentage || 0,
      stock,
      category,
      images,
      thumbnail,
      status,
      featured: featured === 'on'
    });

    await product.save();

    req.flash('success_msg', 'Thêm sản phẩm thành công');
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/admin/products/create');
  }
};

exports.getEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category');
    const categories = await Category.find({ deleted: false, status: 'active' });
    
    if (!product) {
      req.flash('error_msg', 'Không tìm thấy sản phẩm');
      return res.redirect('/admin/products');
    }

    res.render('admin/products/edit', {
      title: 'Chỉnh sửa sản phẩm',
      product,
      categories
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/admin/products');
  }
};

exports.putEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, discountPercentage, stock, category, status, featured } = req.body;
    
    const slug = title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const updateData = {
      title,
      slug,
      description,
      price,
      discountPercentage: discountPercentage || 0,
      stock,
      category,
      status,
      featured: featured === 'on'
    };

    // Nếu có upload ảnh mới
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => `/uploads/products/${file.filename}`);
      updateData.images = images;
      updateData.thumbnail = images[0];
    }

    await Product.findByIdAndUpdate(id, updateData);

    req.flash('success_msg', 'Cập nhật sản phẩm thành công');
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect(`/admin/products/${req.params.id}/edit`);
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Product.findByIdAndUpdate(id, { status });

    res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndUpdate(id, { 
      deleted: true, 
      deletedAt: new Date() 
    });

    req.flash('success_msg', 'Xóa sản phẩm thành công');
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/admin/products');
  }
};

// Orders Management
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      const users = await User.find({
        $or: [
          { fullName: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }).select('_id');
      
      query.user = { $in: users.map(u => u._id) };
    }

    const orders = await Order.find(query)
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.render('admin/orders/index', {
      title: 'Quản lý đơn hàng',
      orders,
      currentPage: page,
      totalPages,
      query: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/error', { title: 'Lỗi', error });
  }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('user', 'fullName email phone')
      .populate('items.product');

    if (!order) {
      req.flash('error_msg', 'Không tìm thấy đơn hàng');
      return res.redirect('/admin/orders');
    }

    res.render('admin/orders/detail', {
      title: 'Chi tiết đơn hàng',
      order
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/admin/orders');
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Order.findByIdAndUpdate(id, { status });

    res.json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
  }
};

// Users Management
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    let query = { deleted: false };
    
    if (req.query.role) {
      query.role = req.query.role;
    }

    if (req.query.search) {
      query.$or = [
        { fullName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.render('admin/users/index', {
      title: 'Quản lý người dùng',
      users,
      currentPage: page,
      totalPages,
      query: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/error', { title: 'Lỗi', error });
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      req.flash('error_msg', 'Không tìm thấy người dùng');
      return res.redirect('/admin/users');
    }

    const orders = await Order.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.render('admin/users/detail', {
      title: 'Chi tiết người dùng',
      user,
      orders
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/admin/users');
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await User.findByIdAndUpdate(id, { status });

    res.json({ success: true, message: 'Cập nhật trạng thái người dùng thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
  }
};