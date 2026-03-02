const { body, validationResult, query, param } = require('express-validator');
const logger = require('../config/logger');

// ============ VALIDATION RULES ============

exports.validateRegister = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Họ tên không được để trống')
    .isLength({ min: 2, max: 100 }).withMessage('Họ tên phải từ 2-100 ký tự')
    .matches(/^[a-zA-Z\s\u0080-\uFFFF]+$/).withMessage('Họ tên chỉ chứa chữ cái'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email quá dài'),
  
  body('password')
    .isLength({ min: 6, max: 50 }).withMessage('Mật khẩu phải từ 6-50 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Mật khẩu phải chứa chữ hoa, chữ thường và số'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }
      return true;
    })
];

exports.validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 }).withMessage('Mật khẩu không hợp lệ')
];

exports.validateProduct = [
  body('title')
    .trim()
    .notEmpty().withMessage('Tên sản phẩm không được để trống')
    .isLength({ min: 3, max: 200 }).withMessage('Tên sản phẩm phải từ 3-200 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Mô tả quá dài (tối đa 5000 ký tự)'),
  
  body('price')
    .notEmpty().withMessage('Giá không được để trống')
    .isFloat({ min: 0, max: 999999999 }).withMessage('Giá phải là số dương hợp lệ'),
  
  body('discountPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Giảm giá phải từ 0-100%'),
  
  body('stock')
    .notEmpty().withMessage('Số lượng không được để trống')
    .isInt({ min: 0, max: 999999 }).withMessage('Số lượng phải là số nguyên dương'),
  
  body('category')
    .notEmpty().withMessage('Danh mục không được để trống')
    .isMongoId().withMessage('Danh mục không hợp lệ'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Trạng thái không hợp lệ'),
  
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured phải là boolean')
];

exports.validateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tên danh mục không được để trống')
    .isLength({ min: 2, max: 100 }).withMessage('Tên danh mục phải từ 2-100 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Mô tả quá dài'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Trạng thái không hợp lệ')
];

exports.validateCheckout = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Họ tên không được để trống')
    .isLength({ min: 2, max: 100 }).withMessage('Họ tên không hợp lệ'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Số điện thoại không được để trống')
    .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại phải từ 10-11 chữ số'),
  
  body('address')
    .trim()
    .notEmpty().withMessage('Địa chỉ chi tiết không được để trống')
    .isLength({ min: 2, max: 255 }).withMessage('Địa chỉ phải từ 2-255 ký tự'),
  
  body('provinceCode')
    .notEmpty().withMessage('Tỉnh/Thành phố không được để trống'),
  
  body('provinceName')
    .trim()
    .notEmpty().withMessage('Tên tỉnh không được để trống'),
  
  body('districtCode')
    .notEmpty().withMessage('Quận/Huyện không được để trống'),
  
  body('districtName')
    .trim()
    .notEmpty().withMessage('Tên quận không được để trống'),
  
  body('wardCode')
    .notEmpty().withMessage('Phường/Xã không được để trống'),
  
  body('wardName')
    .trim()
    .notEmpty().withMessage('Tên phường không được để trống'),
  
  body('paymentMethod')
    .optional()
    .isIn(['cod', 'bank_transfer']).withMessage('Phương thức thanh toán không hợp lệ')
];

exports.validateProfile = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Họ tên không được để trống')
    .isLength({ min: 2, max: 100 }).withMessage('Họ tên không hợp lệ'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại phải từ 10-11 chữ số')
];

exports.validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Mật khẩu hiện tại không được để trống'),
  
  body('newPassword')
    .isLength({ min: 6, max: 50 }).withMessage('Mật khẩu mới phải từ 6-50 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Mật khẩu phải chứa chữ hoa, chữ thường và số'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }
      return true;
    })
];

exports.validateAddToCart = [
  body('productId')
    .notEmpty().withMessage('Product ID không được để trống')
    .isMongoId().withMessage('Product ID không hợp lệ'),
  
  body('quantity')
    .notEmpty().withMessage('Số lượng không được để trống')
    .isInt({ min: 1, max: 1000 }).withMessage('Số lượng phải từ 1-1000')
];

exports.validateUpdateOrderStatus = [
  body('status')
    .notEmpty().withMessage('Trạng thái không được để trống')
    .isIn(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'])
    .withMessage('Trạng thái không hợp lệ')
];

exports.validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Trang phải là số dương')
];

exports.validateMongoId = [
  param('id')
    .isMongoId().withMessage('ID không hợp lệ')
];

// ============ ERROR HANDLING MIDDLEWARE ============

/**
 * Handle validation errors
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    logger.warn(`Validation error: ${JSON.stringify(errorMessages)}`);

    // For API requests
    if (req.accepts('json')) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages
      });
    }

    // For form submissions
    req.flash('error_msg', errorMessages[0].message);
    const referer = req.get('Referrer') || '/';
    return res.redirect(referer);
  }

  next();
};

/**
 * Global error handler
 */
exports.globalErrorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`Error [${status}]: ${message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.session?.user?.email
  });

  // For API requests
  if (req.accepts('json')) {
    return res.status(status).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // For page requests
  res.status(status).render('client/error', {
    title: 'Lỗi',
    error: process.env.NODE_ENV === 'development' ? err : { message }
  });
};

/**
 * Async error wrapper
 */
exports.asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Not found handler
 */
exports.notFoundHandler = (req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  
  if (req.accepts('json')) {
    return res.status(404).json({
      success: false,
      message: 'Resource not found'
    });
  }

  res.status(404).render('client/404', { title: 'Không tìm thấy trang' });
};

/**
 * Sanitize input
 */
exports.sanitizeInput = (req, res, next) => {
  // Remove any script tags or dangerous content
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};

/**
 * Rate limiting check
 */
exports.rateLimitCheck = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!req.app.locals.requestLog) {
    req.app.locals.requestLog = {};
  }

  if (!req.app.locals.requestLog[ip]) {
    req.app.locals.requestLog[ip] = [];
  }

  // Remove old requests (older than 1 minute)
  req.app.locals.requestLog[ip] = req.app.locals.requestLog[ip].filter(
    time => now - time < 60000
  );

  // Check if exceeded limit (100 requests per minute)
  if (req.app.locals.requestLog[ip].length >= 100) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  }

  req.app.locals.requestLog[ip].push(now);
  next();
};
