const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Home & Products
router.get('/', clientController.getHome);
router.get('/products', clientController.getProducts);
router.get('/products/:slug', clientController.getProductDetail);

// Auth
router.get('/register', authController.getRegister);
router.post('/register', validateRegister, authController.postRegister);
router.get('/login', authController.getLogin);
router.post('/login', validateLogin, authController.postLogin);
router.get('/logout', authController.logout);

// Cart
router.get('/cart', clientController.getCart);
router.post('/cart/add', clientController.addToCart);
router.post('/cart/remove', clientController.removeFromCart);
router.post('/cart/update', clientController.updateCart);

// Checkout
router.get('/checkout', requireAuth, clientController.getCheckout);
router.post('/checkout', requireAuth, clientController.postCheckout);

// Orders
router.get('/orders/:id', requireAuth, clientController.getOrder);

module.exports = router;
