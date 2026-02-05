const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const { requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateProduct, handleValidationErrors } = require('../middleware/validation');

// Middleware cho tất cả routes admin
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Products
router.get('/products', adminController.getProducts);
router.get('/products/create', adminController.getCreateProduct);
router.post('/products/create', 
  upload.array('images', 5), 
  adminController.postCreateProduct
);
router.get('/products/:id/edit', adminController.getEditProduct);
router.put('/products/:id', 
  upload.array('images', 5), 
  adminController.putEditProduct
);
router.patch('/products/:id/status', adminController.changeStatus);
router.delete('/products/:id', adminController.deleteProduct);

// Categories
router.get('/categories', categoryController.getCategories);
router.get('/categories/create', categoryController.getCreateCategory);
router.post('/categories/create', categoryController.postCreateCategory);
router.get('/categories/:id/edit', categoryController.getEditCategory);
router.put('/categories/:id', categoryController.putEditCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Orders
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderDetail);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// Users
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetail);
router.patch('/users/:id/status', adminController.updateUserStatus);

module.exports = router;
