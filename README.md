# Nexus - E-Commerce Platform

A modern, full-stack e-commerce web application built with Node.js, Express.js, and MongoDB. Features a complete MVC architecture with separate client and admin interfaces, integrated payment gateway, and comprehensive product management system.

## 🌟 Live Demo

**🔗 [Visit Nexus E-Commerce](https://nexus-t4sk.onrender.com)**

## ✨ Key Features

### 🔐 Authentication & Security
- Session-based authentication with bcryptjs password hashing
- Role-based access control (Admin/User)
- Input validation and sanitization with express-validator
- Rate limiting and XSS protection
- Comprehensive logging system with Winston

### 🛍️ E-Commerce Core
- **Product Management**: Full CRUD with categories, filtering, search, and sorting
- **Shopping Cart**: Session-based cart with real-time updates
- **Order Processing**: Complete checkout workflow with status tracking
- **Payment Integration**: MoMo Payment Gateway (UAT) with HMAC-SHA256 signature verification
- **Flash Sales**: Time-based promotions with discount management
- **Product Reviews**: Rating system with anti-spam measures

### 📱 User Experience
- Responsive design with Bootstrap
- Advanced product search and filtering
- Pagination for optimal performance
- Real-time cart count updates
- Address management with Vietnam API integration

### 🎛️ Admin Dashboard
- Comprehensive analytics and statistics
- Product and category management
- Order processing and status updates
- User management with role control
- Revenue tracking and reporting

### 🖼️ Media Management
- Cloudinary integration for scalable image storage
- Multiple image upload with primary image selection
- Automatic image optimization and validation

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: express-session, bcryptjs
- **Validation**: express-validator
- **Logging**: Winston, Morgan
- **File Upload**: Multer, Cloudinary
- **Payment**: MoMo Payment API (UAT)
- **Documentation**: Swagger/OpenAPI 3.0

### Frontend
- **Template Engine**: EJS
- **Styling**: Bootstrap, Custom CSS
- **JavaScript**: Vanilla JS for interactivity

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/nhathao1223/Nexus.git
cd Nexus
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Configure your `.env` file:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/nexus

# Session
SESSION_SECRET=your_super_secret_session_key

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# MoMo Payment (UAT)
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_REDIRECT_URL=http://localhost:3000/payment/momo/return
MOMO_IPN_URL=http://localhost:3000/payment/momo/ipn

# Logging
LOG_LEVEL=debug
```

4. **Seed Database (Optional)**
```bash
npm run seed
```

5. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Architecture

```
Nexus/
├── 📁 config/           # Configuration files
│   ├── database.js      # MongoDB connection
│   ├── logger.js        # Winston logging setup
│   └── swagger.js       # API documentation
├── 📁 controllers/      # Business logic
│   ├── adminController.js
│   ├── authController.js
│   ├── clientController.js
│   └── flashsaleController.js
├── 📁 middleware/       # Custom middleware
│   ├── auth.js          # Authentication middleware
│   ├── logger.js        # Request logging
│   ├── upload.js        # File upload handling
│   └── validation.js    # Input validation & security
├── 📁 models/           # Database schemas
│   ├── Category.js
│   ├── FlashSaleConfig.js
│   ├── Order.js
│   ├── Product.js
│   ├── Review.js
│   └── User.js
├── 📁 routes/           # API routes
│   ├── admin.js
│   ├── client.js
│   ├── flashsale.js
│   └── payment.js
├── 📁 services/         # External services
│   └── momoService.js   # Payment integration
├── 📁 views/            # EJS templates
│   ├── admin/           # Admin interface
│   └── client/          # Client interface
├── 📁 public/           # Static assets
├── 📁 scripts/          # Utility scripts
└── 📁 logs/             # Application logs
```

## 🔌 API Documentation

Interactive API documentation is available at `/api-docs` when running the application.

### Key Endpoints

#### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout

#### Products
- `GET /products` - List products with filtering
- `GET /products/:slug` - Product details
- `POST /cart/add` - Add to cart
- `POST /checkout` - Process order

#### Admin
- `GET /admin/dashboard` - Admin dashboard
- `POST /admin/products` - Create product
- `PATCH /admin/orders/:id/status` - Update order status

## 🎯 User Roles & Permissions

### 👤 Customer
- Browse and search products
- Manage shopping cart
- Place and track orders
- Write product reviews
- Update profile information

### 👨‍💼 Admin
- Full dashboard access with analytics
- Product and category management
- Order processing and fulfillment
- User management and role assignment
- Flash sale configuration

## 💳 Payment Integration

The application integrates with **MoMo Payment Gateway** (UAT environment) featuring:
- Secure HMAC-SHA256 signature verification
- Real-time payment processing
- Webhook handling for payment confirmation
- Support for multiple payment methods (MoMo, COD, Bank Transfer)

## 📊 Database Schema

### Core Models
- **User**: Authentication, profile, and role management
- **Product**: Catalog with categories, pricing, and inventory
- **Order**: Transaction records with items and shipping
- **Category**: Product organization and specifications
- **Review**: Customer feedback and ratings
- **FlashSaleConfig**: Promotional campaign management

## 🔒 Security Features

- **Authentication**: Secure session management with bcryptjs
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive sanitization and validation
- **Rate Limiting**: Protection against abuse
- **CSRF Protection**: Session-based security
- **File Upload Security**: Type and size validation
- **Logging**: Comprehensive audit trail

## 🧪 Development

### Available Scripts
```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm run seed       # Seed database with sample data
npm run build      # Build for production
```

### Testing
```bash
# Seed sample data
npm run seed

# Test MoMo integration
node scripts/testMomo.js
```

## 🚀 Deployment

The application is deployed on **Render** with:
- Automatic deployments from GitHub
- Environment variable management
- MongoDB Atlas integration
- Cloudinary for media storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nhật Hào** - Full Stack Developer
- GitHub: [@nhathao1223](https://github.com/nhathao1223)
- Email: [your-email@example.com]

## 🙏 Acknowledgments

- Express.js team for the robust framework
- MongoDB team for the flexible database
- Bootstrap team for the responsive UI components
- MoMo for payment gateway integration
- Cloudinary for media management solutions

---

⭐ **Star this repository if you found it helpful!**
