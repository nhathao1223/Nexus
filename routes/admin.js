const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const { requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateProduct, handleValidationErrors } = require('../middleware/validation');

// Middleware cho tất cả routes admin
router.use(requireAdmin);

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard with statistics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Dashboard with statistics
 *       401:
 *         description: Unauthorized or not admin
 */
router.get('/dashboard', adminController.getDashboard);

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products (admin view)
 *     tags: [Admin - Products]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Products list
 */
router.get('/products', adminController.getProducts);

/**
 * @swagger
 * /admin/products/create:
 *   get:
 *     summary: Get create product form
 *     tags: [Admin - Products]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Create product form
 */
router.get('/products/create', adminController.getCreateProduct);

/**
 * @swagger
 * /admin/products/create:
 *   post:
 *     summary: Create new product
 *     tags: [Admin - Products]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPercentage:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               featured:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - title
 *               - price
 *               - stock
 *               - category
 *     responses:
 *       302:
 *         description: Redirect to products list
 *       400:
 *         description: Validation error
 */
router.post('/products/create', 
  upload.array('images', 5), 
  adminController.postCreateProduct
);

/**
 * @swagger
 * /admin/products/{id}/edit:
 *   get:
 *     summary: Get edit product form
 *     tags: [Admin - Products]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edit product form
 *       404:
 *         description: Product not found
 */
router.get('/products/:id/edit', adminController.getEditProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Admin - Products]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPercentage:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       302:
 *         description: Redirect to products list
 */
router.put('/products/:id', 
  upload.array('images', 5), 
  adminController.putEditProduct
);

/**
 * @swagger
 * /admin/products/{id}/status:
 *   patch:
 *     summary: Change product status
 *     tags: [Admin - Products]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/products/:id/status', adminController.changeStatus);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete product (soft delete)
 *     tags: [Admin - Products]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to products list
 */
router.delete('/products/:id', adminController.deleteProduct);

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Admin - Categories]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Categories list
 */
router.get('/categories', categoryController.getCategories);

/**
 * @swagger
 * /admin/categories/create:
 *   get:
 *     summary: Get create category form
 *     tags: [Admin - Categories]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Create category form
 */
router.get('/categories/create', categoryController.getCreateCategory);

/**
 * @swagger
 * /admin/categories/create:
 *   post:
 *     summary: Create new category
 *     tags: [Admin - Categories]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *             required:
 *               - name
 *     responses:
 *       302:
 *         description: Redirect to categories list
 */
router.post('/categories/create', categoryController.postCreateCategory);

/**
 * @swagger
 * /admin/categories/{id}/edit:
 *   get:
 *     summary: Get edit category form
 *     tags: [Admin - Categories]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edit category form
 */
router.get('/categories/:id/edit', categoryController.getEditCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Admin - Categories]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to categories list
 */
router.put('/categories/:id', categoryController.putEditCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Delete category (soft delete)
 *     tags: [Admin - Categories]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to categories list
 */
router.delete('/categories/:id', categoryController.deleteCategory);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin - Orders]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders list
 */
router.get('/orders', adminController.getOrders);

/**
 * @swagger
 * /admin/orders/{id}:
 *   get:
 *     summary: Get order detail
 *     tags: [Admin - Orders]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order detail
 */
router.get('/orders/:id', adminController.getOrderDetail);

/**
 * @swagger
 * /admin/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Admin - Orders]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipping, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/orders/:id/status', adminController.updateOrderStatus);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin - Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users list
 */
router.get('/users', adminController.getUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user detail
 *     tags: [Admin - Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User detail with orders
 */
router.get('/users/:id', adminController.getUserDetail);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags: [Admin - Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/users/:id/status', adminController.updateUserStatus);

module.exports = router;
