const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [{
    type: String
  }],
  primaryImageIndex: {
    type: Number,
    default: 0
  }, // Index của ảnh chính trong mảng images
  videos: [{
    type: {
      type: String,
      enum: ['video', 'youtube'],
      default: 'video'
    },
    url: String,
    videoId: String, // For YouTube videos
    thumbnail: String,
    title: String
  }],
  thumbnail: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  flashSale: {
    type: Boolean,
    default: false
  },
  flashSaleStartDate: {
    type: Date
  },
  flashSaleEndDate: {
    type: Date
  },
  screenSize: {
    type: String,
    default: ''
  },
  storage: {
    type: String,
    default: ''
  },
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

productSchema.virtual('finalPrice').get(function() {
  return this.price - (this.price * this.discountPercentage / 100);
});

module.exports = mongoose.model('Product', productSchema);
