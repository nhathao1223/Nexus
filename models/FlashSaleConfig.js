const mongoose = require('mongoose');

const flashSaleConfigSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'FLASH SALE MỖI NGÀY'
  }
}, {
  timestamps: true
});

// Chỉ cho phép 1 config duy nhất
flashSaleConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    // Tạo config mặc định nếu chưa có
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    config = await this.create({
      startDate: now,
      endDate: endOfDay,
      isActive: true
    });
  }
  return config;
};

module.exports = mongoose.model('FlashSaleConfig', flashSaleConfigSchema);
