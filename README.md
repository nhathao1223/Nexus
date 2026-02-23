# Nexus - E-Commerce Website

A full-stack e-commerce web application built with Node.js, Express.js, and MongoDB. Features a complete MVC architecture with separate client and admin interfaces.

## 🎯 Features

### Authentication & Authorization
- Session-based authentication with secure password hashing (bcryptjs)
- Role-based access control (Admin / User)
- User registration and login with email validation
- Password change functionality
- Soft delete for user accounts

### Product Management
- Full CRUD operations for products and categories
- Product filtering by category, price range, and brand
- Advanced search functionality (case-insensitive)
- Sorting by price and name
- Pagination support (12 items per page for clients, 20 for admin)
- Product status management (active/inactive)
- Featured products support
- Discount percentage support
- Multiple image upload per product (up to 5 images, 5MB each)
- Image format validation (JPEG, JPG, PNG, GIF, WebP)

### Shopping & Checkout
- Session-based shopping cart
- Add/remove/update cart items
- Real-time cart count
- Checkout workflow with shipping address
- Order creation with status tracking
- Support for multiple payment methods (COD, Bank Transfer)

### Order Management
- User order history with pagination
- Order detail view with product information
- Admin order management dashboard
- Order status updates (pending, confirmed, shipping, delivered, cancelled)
- Order search and filtering

### Admin Dashboard
- Dashboard with key statistics:
  - Total products
  - Total orders
  - Total users
  - Total revenue (from delivered orders)
  - Recent orders list
- User management with status control
- Comprehensive product management
- Category management
- Order management and status updates

### Data Management
- Soft delete implementation for products, categories, and users
- MongoDB with Mongoose ODM
- Optimized database queries with proper indexing
- Relationship management (Product → Category, Order → User, Order → Items)
- Virtual fields for calculated values (final price with discount)

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Frontend**: EJS (Embedded JavaScript templating)
- **Styling**: Bootstrap, Custom CSS
- **Authentication**: express-session, bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator
- **Other**: dotenv, flash messages

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/nhathao1223/Nexus.git
cd Nexus
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nexus
SESSION_SECRET=your_session_secret_key
NODE_ENV=development
```

4. **Start the application**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
Nexus/
├── config/
│   └── database.js              # MongoDB connection configuration
├── controllers/
│   ├── adminController.js       # Admin dashboard and management
│   ├── authController.js        # Authentication logic
│   ├── categoryController.js    # Category management
│   └── clientController.js      # Client-side operations
├── middleware/
│   ├── auth.js                  # Authentication & authorization
│   ├── upload.js                # File upload configuration
│   └── validation.js            # Input validation rules
├── models/
│   ├── Category.js              # Category schema
│   ├── Order.js                 # Order schema
│   ├── Product.js               # Product schema
│   └── User.js                  # User schema
├── public/
│   ├── css/                     # Stylesheets
│   ├── js/                      # Client-side scripts
│   └── vendor/                  # Third-party libraries
├── routes/
│   ├── admin.js                 # Admin routes
│   └── client.js                # Client routes
├── scripts/
│   └── seed.js                  # Database seeding script
├── uploads/
│   └── products/                # Product image storage
├── views/
│   ├── admin/                   # Admin templates
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── users/
│   │   └── partials/
│   └── client/                  # Client templates
│       ├── partials/
│       └── [various pages]
├── server.js                    # Application entry point
├── package.json
└── README.md
```

## 🔐 User Roles

### Admin
- Access to admin dashboard at `/admin/dashboard`
- Full product and category management
- User management and status control
- Order management and status updates
- View dashboard statistics

### User
- Browse products with search and filtering
- Add products to cart
- Checkout and place orders
- View order history and details
- Update profile information
- Change password

## 📊 Database Schemas

### User
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  phone: String,
  address: String,
  isActive: Boolean (default: true),
  deleted: Boolean (default: false),
  deletedAt: Date,
  timestamps: true
}
```

### Product
```javascript
{
  title: String (required, unique slug),
  slug: String (required, unique),
  description: String,
  price: Number (required, min: 0),
  discountPercentage: Number (0-100, default: 0),
  stock: Number (required, min: 0),
  category: ObjectId (ref: Category),
  images: [String],
  thumbnail: String,
  status: String (enum: ['active', 'inactive'], default: 'active'),
  featured: Boolean (default: false),
  deleted: Boolean (default: false),
  deletedAt: Date,
  timestamps: true
}
```

### Category
```javascript
{
  name: String (required),
  slug: String (required, unique),
  description: String,
  image: String,
  status: String (enum: ['active', 'inactive'], default: 'active'),
  deleted: Boolean (default: false),
  deletedAt: Date,
  timestamps: true
}
```

### Order
```javascript
{
  user: ObjectId (ref: User, required),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number (required, min: 1),
    price: Number (required)
  }],
  totalAmount: Number (required),
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    district: String
  },
  status: String (enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'], default: 'pending'),
  paymentMethod: String (enum: ['cod', 'bank_transfer'], default: 'cod'),
  note: String,
  timestamps: true
}
```

## 🔗 API Endpoints

### Authentication
- `GET /register` - Registration page
- `POST /register` - Register new user
- `GET /login` - Login page
- `POST /login` - User login
- `GET /logout` - User logout

### Products (Client)
- `GET /` - Home page with featured products
- `GET /products` - Products list with filtering
- `GET /products/:slug` - Product detail page

### Cart
- `GET /cart` - View shopping cart
- `GET /cart/count` - Get cart item count (JSON)
- `POST /cart/add` - Add product to cart (JSON)
- `POST /cart/remove` - Remove product from cart (JSON)
- `POST /cart/update` - Update cart item quantity (JSON)

### Orders (Client)
- `GET /checkout` - Checkout page (requires auth)
- `POST /checkout` - Create order (requires auth)
- `GET /orders` - User orders list (requires auth)
- `GET /orders/:id` - Order detail (requires auth)

### Profile (Client)
- `GET /profile` - User profile page (requires auth)
- `POST /profile` - Update profile (requires auth)
- `POST /profile/change-password` - Change password (requires auth)

### Admin - Products
- `GET /admin/products` - Products list
- `GET /admin/products/create` - Create product form
- `POST /admin/products/create` - Create product
- `GET /admin/products/:id/edit` - Edit product form
- `PUT /admin/products/:id` - Update product
- `PATCH /admin/products/:id/status` - Change product status
- `DELETE /admin/products/:id` - Delete product (soft delete)

### Admin - Categories
- `GET /admin/categories` - Categories list
- `GET /admin/categories/create` - Create category form
- `POST /admin/categories/create` - Create category
- `GET /admin/categories/:id/edit` - Edit category form
- `PUT /admin/categories/:id` - Update category
- `DELETE /admin/categories/:id` - Delete category (soft delete)

### Admin - Orders
- `GET /admin/orders` - Orders list
- `GET /admin/orders/:id` - Order detail
- `PATCH /admin/orders/:id/status` - Update order status

### Admin - Users
- `GET /admin/users` - Users list
- `GET /admin/users/:id` - User detail
- `PATCH /admin/users/:id/status` - Update user status

### Admin - Dashboard
- `GET /admin/dashboard` - Dashboard with statistics

## 🧪 Testing

To seed the database with sample data:
```bash
node scripts/seed.js
```

## 🔒 Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Role-based access control
- Input validation with express-validator
- File upload validation (type and size)
- Soft delete for data preservation
- CSRF protection via session

## 📝 Environment Variables

```
PORT                 # Server port (default: 3000)
MONGODB_URI         # MongoDB connection string
SESSION_SECRET      # Secret key for session encryption
NODE_ENV            # Environment (development/production)
```

## 🚀 Deployment

### Prepare for production:
1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance
3. Set a strong `SESSION_SECRET`
4. Configure proper CORS if needed
5. Use environment-specific configurations

### Deploy to hosting:
- Heroku, Railway, Render, or any Node.js hosting platform
- Ensure MongoDB is accessible from your hosting provider
- Set environment variables on the hosting platform

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [EJS Documentation](https://ejs.co/)

## 👨‍💻 Author

**Nhật Hào** - Backend Developer

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on the GitHub repository.

---

**Last Updated**: February 2026
