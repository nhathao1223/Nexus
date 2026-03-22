const mongoose = require('mongoose');
const Category = require('../models/Category');
const { categorySpecifications } = require('./categorySpecifications');
require('dotenv').config();

async function seedCategorySpecs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const [slug, categoryData] of Object.entries(categorySpecifications)) {
      const existingCategory = await Category.findOne({ slug });

      if (existingCategory) {
        existingCategory.specificationFields = categoryData.specificationFields;
        await existingCategory.save();
        console.log(`Updated category: ${categoryData.name}`);
      } else {
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
