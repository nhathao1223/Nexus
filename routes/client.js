const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin,
  validateCheckout,
  validateProfile,
  validateChangePassword,
  validateAddToCart,
  validateReview,
  validatePagination,
  validateMongoId,
  handleValidationErrors,
  asyncHandler
} = require('../middleware/validation');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get home page with products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product title
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price-asc, price-desc, name-asc]
 *         description: Sort products
 *     responses:
 *       200:
 *         description: Home page with products
 */
router.get('/', asyncHandler(clientController.getHome));

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: priceRange
 *         schema:
 *           type: string
 *           enum: [0-5, 5-10, 10-20, 20+]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/products', validatePagination, asyncHandler(clientController.getProducts));

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Get product detail by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product detail with related products
 *       404:
 *         description: Product not found
 */
router.get('/products/:slug', asyncHandler(clientController.getProductDetail));

router.post(
  '/products/:slug/reviews',
  requireAuth,
  validateReview,
  handleValidationErrors,
  asyncHandler(clientController.postProductReview)
);

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Get registration page
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Registration form
 */
router.get('/register', authController.getRegister);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *     responses:
 *       302:
 *         description: Redirect to login on success
 *       400:
 *         description: Validation error
 */
router.post('/register', validateRegister, handleValidationErrors, asyncHandler(authController.postRegister));

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Get login page
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login form
 */
router.get('/login', authController.getLogin);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       302:
 *         description: Redirect to dashboard or home on success
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, handleValidationErrors, asyncHandler(authController.postLogin));

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to home
 */
router.get('/logout', authController.logout);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get shopping cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Shopping cart page
 */
router.get('/cart', clientController.getCart);

/**
 * @swagger
 * /cart/count:
 *   get:
 *     summary: Get cart item count
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 */
router.get('/cart/count', clientController.getCartCount);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Product added to cart
 *       404:
 *         description: Product not found
 */
router.post('/cart/add', validateAddToCart, handleValidationErrors, asyncHandler(clientController.addToCart));

/**
 * @swagger
 * /cart/remove:
 *   post:
 *     summary: Remove product from cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 */
router.post('/cart/remove', asyncHandler(clientController.removeFromCart));

/**
 * @swagger
 * /cart/update:
 *   post:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.post('/cart/update', asyncHandler(clientController.updateCart));

/**
 * @swagger
 * /cart/clear:
 *   post:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.post('/cart/clear', asyncHandler(clientController.clearCart));

/**
 * @swagger
 * /checkout:
 *   get:
 *     summary: Get checkout page
 *     tags: [Orders]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Checkout page
 *       401:
 *         description: Unauthorized
 */
router.get('/checkout', requireAuth, clientController.getCheckout);

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Create order
 *     tags: [Orders]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cod, bank_transfer]
 *     responses:
 *       302:
 *         description: Redirect to order detail
 *       401:
 *         description: Unauthorized
 */
router.post('/checkout', requireAuth, validateCheckout, handleValidationErrors, asyncHandler(clientController.postCheckout));

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User orders list
 *       401:
 *         description: Unauthorized
 */
router.get('/orders', requireAuth, validatePagination, asyncHandler(clientController.getUserOrders));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order detail
 *     tags: [Orders]
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get('/orders/:id', requireAuth, validateMongoId, handleValidationErrors, asyncHandler(clientController.getOrder));

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: User profile page
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', requireAuth, clientController.getProfile);

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to profile
 *       401:
 *         description: Unauthorized
 */
router.post('/profile', requireAuth, validateProfile, handleValidationErrors, asyncHandler(clientController.updateProfile));

/**
 * @swagger
 * /profile/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Profile]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       302:
 *         description: Redirect to profile
 *       401:
 *         description: Unauthorized
 */
router.post('/profile/change-password', requireAuth, validateChangePassword, handleValidationErrors, asyncHandler(clientController.changePassword));

// MoMo Payment Routes
/**
 * @swagger
 * /payment/momo/ipn:
 *   post:
 *     summary: MoMo IPN (Instant Payment Notification) callback
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: IPN processed successfully
 */
router.post('/payment/momo/ipn', asyncHandler(clientController.handleMomoIPN));

/**
 * @swagger
 * /payment/momo/return:
 *   get:
 *     summary: MoMo payment return URL
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: partnerCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *       - in: query
 *         name: resultCode
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to order page
 */
router.get('/payment/momo/return', asyncHandler(clientController.handleMomoReturn));

module.exports = router;

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get home page with products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product title
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price-asc, price-desc, name-asc]
 *         description: Sort products
 *     responses:
 *       200:
 *         description: Home page with products
 */
router.get('/', clientController.getHome);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: priceRange
 *         schema:
 *           type: string
 *           enum: [0-5, 5-10, 10-20, 20+]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/products', clientController.getProducts);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Get product detail by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product detail with related products
 *       404:
 *         description: Product not found
 */
router.get('/products/:slug', clientController.getProductDetail);

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Get registration page
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Registration form
 */
router.get('/register', authController.getRegister);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *     responses:
 *       302:
 *         description: Redirect to login on success
 *       400:
 *         description: Validation error
 */
router.post('/register', validateRegister, authController.postRegister);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Get login page
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login form
 */
router.get('/login', authController.getLogin);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       302:
 *         description: Redirect to dashboard or home on success
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, authController.postLogin);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to home
 */
router.get('/logout', authController.logout);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get shopping cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Shopping cart page
 */
router.get('/cart', clientController.getCart);

/**
 * @swagger
 * /cart/count:
 *   get:
 *     summary: Get cart item count
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 */
router.get('/cart/count', clientController.getCartCount);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Product added to cart
 *       404:
 *         description: Product not found
 */
router.post('/cart/add', clientController.addToCart);

/**
 * @swagger
 * /cart/remove:
 *   post:
 *     summary: Remove product from cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 */
router.post('/cart/remove', clientController.removeFromCart);

/**
 * @swagger
 * /cart/update:
 *   post:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.post('/cart/update', clientController.updateCart);

/**
 * @swagger
 * /checkout:
 *   get:
 *     summary: Get checkout page
 *     tags: [Orders]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Checkout page
 *       401:
 *         description: Unauthorized
 */
router.get('/checkout', requireAuth, clientController.getCheckout);

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Create order
 *     tags: [Orders]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cod, bank_transfer]
 *     responses:
 *       302:
 *         description: Redirect to order detail
 *       401:
 *         description: Unauthorized
 */
router.post('/checkout', requireAuth, clientController.postCheckout);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User orders list
 *       401:
 *         description: Unauthorized
 */
router.get('/orders', requireAuth, clientController.getUserOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order detail
 *     tags: [Orders]
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get('/orders/:id', requireAuth, clientController.getOrder);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: User profile page
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', requireAuth, clientController.getProfile);

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to profile
 *       401:
 *         description: Unauthorized
 */
router.post('/profile', requireAuth, clientController.updateProfile);

/**
 * @swagger
 * /profile/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Profile]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       302:
 *         description: Redirect to profile
 *       401:
 *         description: Unauthorized
 */
router.post('/profile/change-password', requireAuth, clientController.changePassword);

module.exports = router;
