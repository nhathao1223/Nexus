const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false }).sort({ createdAt: -1 });
    
    res.render('admin/categories/index', {
      title: 'Quản lý danh mục',
      categories
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/admin/dashboard');
  }
};

exports.getCreateCategory = (req, res) => {
  res.render('admin/categories/create', {
    title: 'Thêm danh mục'
  });
};

exports.postCreateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    const slug = name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const category = new Category({
      name,
      slug,
      description,
      status
    });

    await category.save();

    req.flash('success_msg', 'Thêm danh mục thành công');
    res.redirect('/admin/categories');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/admin/categories/create');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await Category.findByIdAndUpdate(id, { 
      deleted: true, 
      deletedAt: new Date() 
    });

    req.flash('success_msg', 'Xóa danh mục thành công');
    res.redirect('/admin/categories');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/admin/categories');
  }
};
exports.getEditCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      req.flash('error_msg', 'Không tìm thấy danh mục');
      return res.redirect('/admin/categories');
    }

    res.render('admin/categories/edit', {
      title: 'Chỉnh sửa danh mục',
      category
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/admin/categories');
  }
};

exports.putEditCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    const slug = name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    await Category.findByIdAndUpdate(id, {
      name,
      slug,
      description,
      status
    });

    req.flash('success_msg', 'Cập nhật danh mục thành công');
    res.redirect('/admin/categories');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect(`/admin/categories/${req.params.id}/edit`);
  }
};