// Script để reset tất cả sản phẩm flashSale về false
// Chạy: node scripts/resetFlashSale.js

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function resetFlashSale() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Product.updateMany(
      { flashSale: true },
      { 
        $set: { 
          flashSale: false,
          flashSaleStartDate: null,
          flashSaleEndDate: null
        } 
      }
    );

    console.log(`✅ Đã reset ${result.modifiedCount} sản phẩm flashSale về false`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

resetFlashSale();
