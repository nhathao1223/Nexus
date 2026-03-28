require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'nguynhao543@gmail.com';
    const newPassword = 'Admin123';

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }

    user.password = newPassword;
    await user.save(); // bcrypt hash tự động qua pre-save hook

    console.log('Password reset successfully!');
    console.log(`Email: ${email}`);
    console.log(`New Password: ${newPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPassword();
