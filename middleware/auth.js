const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.requireAuth = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  
  try {
    // Lấy thông tin user mới nhất từ database
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.redirect('/login');
  }
};

exports.requireAdmin = async (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/');
  }
  
  try {
    // Lấy thông tin user mới nhất từ database
    const user = await User.findById(req.session.user._id);
    if (!user || user.role !== 'admin') {
      req.session.destroy();
      return res.redirect('/');
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.redirect('/');
  }
};

exports.checkAuth = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
};
