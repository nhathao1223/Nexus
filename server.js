require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const logger = require('./config/logger');
const { morganMiddleware, errorLogger, requestLogger } = require('./middleware/logger');
const { sanitizeInput, rateLimitCheck, globalErrorHandler, notFoundHandler } = require('./middleware/validation');
const publicUrl = require('./utils/publicUrl');

const app = express();

// Ảnh upload: production lưu /tmp/uploads (multer), dev dùng ./uploads
const uploadStaticRoot =
  process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join(__dirname, 'uploads');

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error(`MongoDB connection error: ${err.message}`));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Logging middleware
app.use(morganMiddleware);
app.use(requestLogger);

// Security & Rate limiting
app.use(rateLimitCheck);
app.use(sanitizeInput);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(flash());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use('/uploads', express.static(uploadStaticRoot));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;
  res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
  res.locals.publicUrl = publicUrl;
  next();
});

// Routes
app.use('/', require('./routes/client'));
app.use('/admin', require('./routes/admin'));
app.use('/admin/flashsale', require('./routes/flashsale'));
app.use('/api/address', require('./routes/address'));

// Error logging middleware
app.use(errorLogger);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
