const mongoose = require('mongoose');

const specificationFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'number', 'select', 'textarea'],
    default: 'text'
  },
  options: [{
    type: String
  }], // For select type
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  group: {
    type: String,
    default: 'general'
  }
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  image: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  specificationFields: [specificationFieldSchema],
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
