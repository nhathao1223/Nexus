require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { categorySpecifications } = require('./categorySpecifications');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared old data');

    // Tạo admin user
    const admin = new User({
      fullName: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Created admin user');

    // Tạo danh mục
    const categories = [
      { name: 'Điện thoại', slug: 'dien-thoai', status: 'active' },
      { name: 'Laptop', slug: 'laptop', status: 'active' },
      { name: 'Tablet', slug: 'tablet', status: 'active' },
      { name: 'Phụ kiện', slug: 'phu-kien', status: 'active' }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Created categories');

    // Gắn thông số kỹ thuật theo slug (để form admin hiển thị đúng)
    for (const cat of createdCategories) {
      const spec = categorySpecifications[cat.slug];
      if (spec && spec.specificationFields && spec.specificationFields.length) {
        await Category.findByIdAndUpdate(cat._id, {
          specificationFields: spec.specificationFields
        });
      }
    }
    console.log('Linked category specification fields');

    // Tạo sản phẩm mẫu
    const products = [
      {
        title: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ',
        price: 29990000,
        discountPercentage: 10,
        stock: 50,
        category: createdCategories[0]._id,
        status: 'active'
      },
      {
        title: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Samsung Galaxy S24 Ultra với bút S Pen',
        price: 27990000,
        discountPercentage: 5,
        stock: 30,
        category: createdCategories[0]._id,
        status: 'active'
      },
      {
        title: 'MacBook Pro M3',
        slug: 'macbook-pro-m3',
        description: 'MacBook Pro với chip M3 mạnh mẽ',
        price: 45990000,
        discountPercentage: 0,
        stock: 20,
        category: createdCategories[1]._id,
        status: 'active'
      },
      {
        title: 'Dell XPS 15',
        slug: 'dell-xps-15',
        description: 'Dell XPS 15 với màn hình 4K tuyệt đẹp',
        price: 35990000,
        discountPercentage: 15,
        stock: 15,
        category: createdCategories[1]._id,
        status: 'active'
      },
      {
        title: 'iPad Pro 12.9',
        slug: 'ipad-pro-12-9',
        description: 'iPad Pro 12.9 inch với chip M2',
        price: 25990000,
        discountPercentage: 8,
        stock: 25,
        category: createdCategories[2]._id,
        status: 'active'
      }
    ];

    await Product.insertMany(products);
    console.log('Created products');

    console.log('\n=== Seed Data Complete ===');
    console.log('Admin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
