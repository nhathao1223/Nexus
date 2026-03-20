const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categorySpecifications = {
  'dien-thoai': {
    name: 'Điện thoại',
    specificationFields: [
      // Cấu hình & Bộ nhớ
      { name: 'os', label: 'Hệ điều hành', type: 'text', group: 'general', placeholder: 'VD: iOS 18, Android 14' },
      { name: 'cpu', label: 'Chip xử lý (CPU)', type: 'text', group: 'general', placeholder: 'VD: Apple A18 Pro, Snapdragon 8 Gen 3' },
      { name: 'ram', label: 'RAM', type: 'select', group: 'general', options: ['4GB', '6GB', '8GB', '12GB', '16GB'] },
      { name: 'storage', label: 'Bộ nhớ trong', type: 'select', group: 'general', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
      
      // Màn hình
      { name: 'screenSize', label: 'Kích thước màn hình', type: 'text', group: 'display', placeholder: 'VD: 6.7 inch' },
      { name: 'screenTech', label: 'Công nghệ màn hình', type: 'text', group: 'display', placeholder: 'VD: Super Retina XDR OLED' },
      { name: 'resolution', label: 'Độ phân giải', type: 'text', group: 'display', placeholder: 'VD: 2796 x 1290 pixels' },
      
      // Camera
      { name: 'rearCamera', label: 'Camera sau', type: 'text', group: 'camera', placeholder: 'VD: Chính 48MP, Phụ 12MP' },
      { name: 'frontCamera', label: 'Camera trước', type: 'text', group: 'camera', placeholder: 'VD: 12MP' },
      { name: 'videoRecording', label: 'Quay phim', type: 'text', group: 'camera', placeholder: 'VD: 4K@60fps' },
      
      // Pin & Sạc
      { name: 'batteryCapacity', label: 'Dung lượng pin', type: 'text', group: 'battery', placeholder: 'VD: 4685 mAh' },
      { name: 'chargingSpeed', label: 'Tốc độ sạc', type: 'text', group: 'battery', placeholder: 'VD: 45W' },
      
      // Kết nối
      { name: 'network', label: 'Mạng di động', type: 'select', group: 'connectivity', options: ['3G', '4G', '5G'] },
      { name: 'wifi', label: 'WiFi', type: 'text', group: 'connectivity', placeholder: 'VD: Wi-Fi 7 (802.11be)' },
      { name: 'bluetooth', label: 'Bluetooth', type: 'text', group: 'connectivity', placeholder: 'VD: v5.3' },
      { name: 'port', label: 'Cổng kết nối', type: 'select', group: 'connectivity', options: ['Lightning', 'Type-C', 'Micro USB'] }
    ]
  },
  
  'laptop': {
    name: 'Laptop',
    specificationFields: [
      // Cấu hình
      { name: 'cpu', label: 'Bộ xử lý', type: 'text', group: 'general', placeholder: 'VD: Intel Core i7-13700H' },
      { name: 'ram', label: 'RAM', type: 'select', group: 'general', options: ['8GB', '16GB', '32GB', '64GB'] },
      { name: 'storage', label: 'Ổ cứng', type: 'text', group: 'general', placeholder: 'VD: 512GB SSD NVMe' },
      { name: 'gpu', label: 'Card đồ họa', type: 'text', group: 'general', placeholder: 'VD: NVIDIA RTX 4060' },
      
      // Màn hình
      { name: 'screenSize', label: 'Kích thước màn hình', type: 'select', group: 'display', options: ['13.3 inch', '14 inch', '15.6 inch', '16 inch', '17.3 inch'] },
      { name: 'resolution', label: 'Độ phân giải', type: 'select', group: 'display', options: ['HD (1366x768)', 'Full HD (1920x1080)', '2K (2560x1440)', '4K (3840x2160)'] },
      { name: 'refreshRate', label: 'Tần số quét', type: 'select', group: 'display', options: ['60Hz', '120Hz', '144Hz', '165Hz', '240Hz'] },
      
      // Pin & Kết nối
      { name: 'batteryLife', label: 'Thời lượng pin', type: 'text', group: 'battery', placeholder: 'VD: 8-10 giờ' },
      { name: 'weight', label: 'Trọng lượng', type: 'text', group: 'general', placeholder: 'VD: 1.8kg' },
      { name: 'ports', label: 'Cổng kết nối', type: 'textarea', group: 'connectivity', placeholder: 'VD: 2x USB-A, 2x USB-C, HDMI, Jack 3.5mm' },
      { name: 'wifi', label: 'WiFi', type: 'text', group: 'connectivity', placeholder: 'VD: Wi-Fi 6E' },
      { name: 'bluetooth', label: 'Bluetooth', type: 'text', group: 'connectivity', placeholder: 'VD: v5.2' }
    ]
  },
  
  'tablet': {
    name: 'Tablet',
    specificationFields: [
      // Cấu hình
      { name: 'os', label: 'Hệ điều hành', type: 'select', group: 'general', options: ['iPadOS', 'Android', 'Windows'] },
      { name: 'cpu', label: 'Chip xử lý', type: 'text', group: 'general', placeholder: 'VD: Apple M2, Snapdragon 8 Gen 2' },
      { name: 'ram', label: 'RAM', type: 'select', group: 'general', options: ['4GB', '6GB', '8GB', '16GB'] },
      { name: 'storage', label: 'Bộ nhớ trong', type: 'select', group: 'general', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
      
      // Màn hình
      { name: 'screenSize', label: 'Kích thước màn hình', type: 'select', group: 'display', options: ['8 inch', '10.1 inch', '10.9 inch', '11 inch', '12.9 inch'] },
      { name: 'resolution', label: 'Độ phân giải', type: 'text', group: 'display', placeholder: 'VD: 2732 x 2048 pixels' },
      { name: 'screenTech', label: 'Công nghệ màn hình', type: 'text', group: 'display', placeholder: 'VD: Liquid Retina, AMOLED' },
      
      // Camera
      { name: 'rearCamera', label: 'Camera sau', type: 'text', group: 'camera', placeholder: 'VD: 12MP' },
      { name: 'frontCamera', label: 'Camera trước', type: 'text', group: 'camera', placeholder: 'VD: 12MP Ultra Wide' },
      
      // Pin & Kết nối
      { name: 'batteryLife', label: 'Thời lượng pin', type: 'text', group: 'battery', placeholder: 'VD: 10 giờ' },
      { name: 'cellular', label: 'Kết nối di động', type: 'select', group: 'connectivity', options: ['WiFi only', 'WiFi + Cellular'] },
      { name: 'wifi', label: 'WiFi', type: 'text', group: 'connectivity', placeholder: 'VD: Wi-Fi 6E' },
      { name: 'bluetooth', label: 'Bluetooth', type: 'text', group: 'connectivity', placeholder: 'VD: v5.3' }
    ]
  }
};

async function seedCategorySpecs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const [slug, categoryData] of Object.entries(categorySpecifications)) {
      const existingCategory = await Category.findOne({ slug });
      
      if (existingCategory) {
        // Update existing category with specification fields
        existingCategory.specificationFields = categoryData.specificationFields;
        await existingCategory.save();
        console.log(`Updated category: ${categoryData.name}`);
      } else {
        // Create new category
        const newCategory = new Category({
          name: categoryData.name,
          slug,
          specificationFields: categoryData.specificationFields,
          status: 'active'
        });
        await newCategory.save();
        console.log(`Created category: ${categoryData.name}`);
      }
    }

    console.log('Category specifications seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding category specifications:', error);
    process.exit(1);
  }
}

seedCategorySpecs();