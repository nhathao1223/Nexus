const Product = require('../models/Product');
const FlashSaleConfig = require('../models/FlashSaleConfig');

// GET /admin/flashsale - Hiển thị trang quản lý flash sale
exports.index = async (req, res) => {
  try {
    const config = await FlashSaleConfig.getConfig();
    
    const flashSaleProducts = await Product.find({ 
      flashSale: true,
      deleted: false 
    }).populate('category');
    
    const allProducts = await Product.find({ 
      deleted: false,
      status: 'active'
    }).populate('category');

    res.render('admin/flashsale/index', {
      title: 'Quản lý Flash Sale',
      config,
      flashSaleProducts,
      allProducts,
      user: req.session.user,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Error loading flashsale page:', error);
    req.flash('error_msg', 'Có lỗi xảy ra khi tải trang');
    res.redirect('/admin/dashboard');
  }
};

// POST /admin/flashsale/add - Thêm sản phẩm vào flash sale
exports.addProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      req.flash('error_msg', 'Vui lòng chọn sản phẩm');
      return res.redirect('/admin/flashsale');
    }

    const product = await Product.findById(productId);

    if (!product) {
      req.flash('error_msg', 'Không tìm thấy sản phẩm');
      return res.redirect('/admin/flashsale');
    }

    if (product.flashSale) {
      req.flash('error_msg', 'Sản phẩm đã có trong Flash Sale');
      return res.redirect('/admin/flashsale');
    }

    product.flashSale = true;
    await product.save();

    req.flash('success_msg', `Đã thêm "${product.title}" vào Flash Sale`);
    res.redirect('/admin/flashsale');
  } catch (error) {
    console.error('Error adding product to flashsale:', error);
    req.flash('error_msg', 'Có lỗi xảy ra khi thêm sản phẩm');
    res.redirect('/admin/flashsale');
  }
};

// POST /admin/flashsale/:id/remove - Xóa sản phẩm khỏi flash sale
exports.removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      req.flash('error_msg', 'Không tìm thấy sản phẩm');
      return res.redirect('/admin/flashsale');
    }

    product.flashSale = false;
    await product.save();

    req.flash('success_msg', `Đã xóa "${product.title}" khỏi Flash Sale`);
    res.redirect('/admin/flashsale');
  } catch (error) {
    console.error('Error removing product from flashsale:', error);
    req.flash('error_msg', 'Có lỗi xảy ra khi xóa sản phẩm');
    res.redirect('/admin/flashsale');
  }
};

// POST /admin/flashsale/update-config - Cập nhật cấu hình flash sale
exports.updateConfig = async (req, res) => {
  try {
    const { startDate, endDate, isActive } = req.body;

    if (!startDate || !endDate) {
      req.flash('error_msg', 'Vui lòng nhập đầy đủ thời gian');
      return res.redirect('/admin/flashsale');
    }

    // Xử lý datetime-local: thêm timezone offset để lưu đúng giờ địa phương
    // Input datetime-local format: "2026-03-09T14:30"
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      req.flash('error_msg', 'Thời gian kết thúc phải sau thời gian bắt đầu');
      return res.redirect('/admin/flashsale');
    }

    let config = await FlashSaleConfig.findOne();
    
    if (!config) {
      config = new FlashSaleConfig();
    }

    config.startDate = start;
    config.endDate = end;
    config.isActive = isActive === 'on';
    await config.save();

    req.flash('success_msg', 'Đã cập nhật cấu hình Flash Sale');
    res.redirect('/admin/flashsale');
  } catch (error) {
    console.error('Error updating flashsale config:', error);
    req.flash('error_msg', 'Có lỗi xảy ra khi cập nhật cấu hình');
    res.redirect('/admin/flashsale');
  }
};
