const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error_msg', 'Vui lòng đăng nhập để tiếp tục');
    return res.redirect('/login');
  }
  next();
};

exports.requireAdmin = async (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('error_msg', 'Bạn không có quyền truy cập');
    return res.redirect('/');
  }
  next();
};

exports.checkAuth = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
};
