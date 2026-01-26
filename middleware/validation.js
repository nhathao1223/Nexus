const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('fullName').trim().notEmpty().withMessage('Họ tên không được để trống'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Mật khẩu xác nhận không khớp');
    }
    return true;
  })
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống')
];

exports.validateProduct = [
  body('title').trim().notEmpty().withMessage('Tên sản phẩm không được để trống'),
  body('price').isFloat({ min: 0 }).withMessage('Giá phải là số dương'),
  body('stock').isInt({ min: 0 }).withMessage('Số lượng phải là số nguyên dương'),
  body('category').notEmpty().withMessage('Danh mục không được để trống'),
  body('description').trim().notEmpty().withMessage('Mô tả không được để trống')
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error_msg', errors.array()[0].msg);
    return res.redirect('back');
  }
  next();
};
