# Error Handling & Input Validation Documentation

## Overview

The Nexus application implements comprehensive error handling and input validation to ensure data integrity and security.

## Input Validation

### Validation Rules

#### User Registration
```javascript
- fullName: 2-100 characters, letters only
- email: Valid email format, max 255 characters
- password: 6-50 characters, must contain uppercase, lowercase, and numbers
- confirmPassword: Must match password
```

#### User Login
```javascript
- email: Valid email format
- password: 6+ characters
```

#### Product Management
```javascript
- title: 3-200 characters (required)
- description: Max 5000 characters (optional)
- price: 0-999,999,999 (required)
- discountPercentage: 0-100% (optional)
- stock: 0-999,999 (required)
- category: Valid MongoDB ID (required)
- status: 'active' or 'inactive' (optional)
- featured: Boolean (optional)
```

#### Category Management
```javascript
- name: 2-100 characters (required)
- description: Max 1000 characters (optional)
- status: 'active' or 'inactive' (optional)
```

#### Checkout
```javascript
- fullName: 2-100 characters (required)
- phone: 10-11 digits (required)
- address: 5-255 characters (required)
- city: 2-100 characters (required)
- district: 2-100 characters (required)
- paymentMethod: 'cod' or 'bank_transfer' (optional)
```

#### Profile Update
```javascript
- fullName: 2-100 characters (required)
- phone: 10-11 digits (optional)
```

#### Change Password
```javascript
- currentPassword: Required
- newPassword: 6-50 characters, must contain uppercase, lowercase, and numbers
- confirmPassword: Must match newPassword
```

#### Add to Cart
```javascript
- productId: Valid MongoDB ID (required)
- quantity: 1-1000 (required)
```

### Validation Middleware Usage

```javascript
// In routes
router.post('/register', 
  validateRegister,           // Validation rules
  handleValidationErrors,     // Error handler
  asyncHandler(controller)    // Controller
);
```

### Custom Validation

```javascript
// Example: Custom validation for password match
body('confirmPassword').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Passwords do not match');
  }
  return true;
})
```

## Error Handling

### Error Types

#### 1. Validation Errors (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### 2. Authentication Errors (401)
```json
{
  "success": false,
  "message": "Unauthorized - Please login"
}
```

#### 3. Authorization Errors (403)
```json
{
  "success": false,
  "message": "Forbidden - Access denied"
}
```

#### 4. Not Found Errors (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

#### 5. Server Errors (500)
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

#### 6. Rate Limit Errors (429)
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

### Error Handling Middleware

#### Global Error Handler
```javascript
// Catches all errors and formats response
app.use(globalErrorHandler);
```

#### Async Error Wrapper
```javascript
// Wraps async functions to catch errors
router.post('/endpoint', asyncHandler(controller));
```

#### Validation Error Handler
```javascript
// Handles validation errors
router.post('/endpoint', validateRules, handleValidationErrors, controller);
```

### Error Logging

All errors are logged with:
- Timestamp
- Error message
- Stack trace (development only)
- Request details (method, URL, user)
- Response status

```
Error [500]: Database connection failed
Stack: Error: Connection timeout...
URL: /checkout
Method: POST
User: user@example.com
```

## Security Features

### Input Sanitization
```javascript
// Removes dangerous content
- Script tags: <script>alert('xss')</script>
- JavaScript protocols: javascript:alert('xss')
- Event handlers: onclick=alert('xss')
```

### Rate Limiting
```javascript
// Limits requests per IP
- 100 requests per minute
- Returns 429 status when exceeded
- Tracked in memory (use Redis for production)
```

### Password Security
```javascript
// Requirements
- Minimum 6 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Hashed with bcryptjs before storage
```

### Email Validation
```javascript
// Validates and normalizes email
- Checks valid email format
- Converts to lowercase
- Removes whitespace
```

## Usage Examples

### In Controllers

```javascript
const { asyncHandler } = require('../middleware/validation');

// Wrap async functions
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }
  
  res.json(product);
});
```

### Error Throwing

```javascript
// Throw error with status
const error = new Error('Invalid input');
error.status = 400;
throw error;

// Global handler will catch and format
```

### Validation in Routes

```javascript
router.post('/products', 
  validateProduct,           // Validate input
  handleValidationErrors,    // Handle errors
  asyncHandler(controller)   // Execute controller
);
```

## Best Practices

### 1. Always Validate Input
```javascript
// ✓ Good
router.post('/endpoint', validateRules, handleValidationErrors, controller);

// ✗ Bad
router.post('/endpoint', controller);
```

### 2. Use Async Wrapper
```javascript
// ✓ Good
router.get('/endpoint', asyncHandler(controller));

// ✗ Bad
router.get('/endpoint', controller);
```

### 3. Throw Errors with Status
```javascript
// ✓ Good
const error = new Error('Not found');
error.status = 404;
throw error;

// ✗ Bad
throw new Error('Not found');
```

### 4. Log Errors
```javascript
// ✓ Good - Logged automatically
throw new Error('Database error');

// ✗ Bad - No logging
console.log('error');
```

### 5. Sanitize User Input
```javascript
// ✓ Good - Automatically sanitized
const name = req.body.name; // Safe

// ✗ Bad - Potential XSS
const html = req.body.html; // Dangerous
```

## Testing Error Handling

### Test Validation Errors
```bash
# Missing required field
curl -X POST http://localhost:3000/register \
  -d "email=test@example.com&password=123456"

# Invalid email
curl -X POST http://localhost:3000/register \
  -d "fullName=Test&email=invalid&password=Test123&confirmPassword=Test123"

# Password too short
curl -X POST http://localhost:3000/register \
  -d "fullName=Test&email=test@example.com&password=123&confirmPassword=123"
```

### Test Rate Limiting
```bash
# Send 101 requests in quick succession
for i in {1..101}; do
  curl http://localhost:3000/products
done

# 101st request should return 429
```

### Test Error Handling
```bash
# Invalid MongoDB ID
curl http://localhost:3000/orders/invalid-id

# Non-existent resource
curl http://localhost:3000/products/non-existent-slug

# Unauthorized access
curl http://localhost:3000/admin/dashboard
```

## Production Considerations

### 1. Rate Limiting
For production, use Redis-based rate limiting:
```bash
npm install express-rate-limit redis
```

### 2. Error Tracking
Integrate with error tracking service:
```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### 3. Input Sanitization
Use additional sanitization library:
```bash
npm install express-sanitize
```

### 4. CORS
Enable CORS with validation:
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
```

### 5. Helmet
Add security headers:
```bash
npm install helmet
app.use(helmet());
```

## Troubleshooting

### Validation Not Working
1. Check validation rules are applied to route
2. Verify handleValidationErrors middleware is used
3. Check error messages in logs

### Errors Not Logged
1. Verify logger is initialized
2. Check LOG_LEVEL environment variable
3. Ensure logs/ directory exists and is writable

### Rate Limiting Not Working
1. Check rateLimitCheck middleware is applied
2. Verify IP detection is correct
3. Consider using Redis for distributed systems

## References

- [Express Validator](https://express-validator.github.io/docs/)
- [Error Handling Best Practices](https://nodejs.org/en/docs/guides/nodejs-error-handling/)
- [OWASP Input Validation](https://owasp.org/www-community/attacks/xss/)
