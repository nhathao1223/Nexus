const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getRegister = (req, res) => {
  res.render('client/register', { title: 'Đăng ký' });
};

exports.postRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array()[0].msg);
      return res.redirect('/register');
    }

    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error_msg', 'Email đã được sử dụng');
      return res.redirect('/register');
    }

    const user = new User({ fullName, email, password });
    await user.save();

    req.flash('success_msg', 'Đăng ký thành công! Vui lòng đăng nhập');
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/register');
  }
};

exports.getLogin = (req, res) => {
  res.render('client/login', { title: 'Đăng nhập' });
};

exports.postLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array()[0].msg);
      return res.redirect('/login');
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email, deleted: false, isActive: true });
    if (!user) {
      req.flash('error_msg', 'Email hoặc mật khẩu không đúng');
      return res.redirect('/login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error_msg', 'Email hoặc mật khẩu không đúng');
      return res.redirect('/login');
    }

    req.session.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };

    req.flash('success_msg', 'Đăng nhập thành công!');
    
    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }
    
    res.redirect('/');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Có lỗi xảy ra');
    res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
