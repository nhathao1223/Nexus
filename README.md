# E-Commerce Website - NodeJS

Website thương mại điện tử hoàn chỉnh sử dụng NodeJS theo mô hình MVC.

## Tính năng

### Phía người dùng (Client Side)
- ✅ Đăng ký, đăng nhập, đăng xuất
- ✅ Xem danh sách sản phẩm với phân trang
- ✅ Tìm kiếm, lọc, sắp xếp sản phẩm
- ✅ Xem chi tiết sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Quản lý giỏ hàng
- ⏳ Thanh toán (mô phỏng)

### Phía quản trị (Admin Panel)
- ✅ Dashboard với thống kê tổng quan
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Upload hình ảnh sản phẩm
- ✅ Thay đổi trạng thái sản phẩm
- ✅ Soft delete (xóa mềm)
- ⏳ Quản lý danh mục
- ⏳ Quản lý đơn hàng
- ⏳ Quản lý người dùng
- ⏳ Phân quyền quản trị viên

## Công nghệ sử dụng

- **Backend**: NodeJS, ExpressJS
- **Database**: MongoDB, Mongoose
- **Frontend**: EJS, Bootstrap 5
- **Authentication**: Session-based
- **Upload**: Multer
- **Validation**: Express-validator
- **Editor**: TinyMCE

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd ecommerce-nodejs
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:
```bash
copy .env.example .env
```

4. Cấu hình MongoDB trong file `.env`:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
SESSION_SECRET=your_session_secret_here
```

5. Chạy ứng dụng:
```bash
npm run dev
```

6. Truy cập:
- Client: http://localhost:3000
- Admin: http://localhost:3000/admin/dashboard

## Cấu trúc thư mục

```
├── config/          # Cấu hình database
├── controllers/     # Controllers (MVC)
├── middleware/      # Middleware (auth, upload, validation)
├── models/          # Models (Mongoose schemas)
├── public/          # Static files (CSS, JS, images)
├── routes/          # Routes
├── uploads/         # Uploaded files
├── views/           # Views (EJS templates)
│   ├── admin/       # Admin views
│   └── client/      # Client views
└── server.js        # Entry point
```

## Tài khoản mặc định

Sau khi cài đặt, bạn cần tạo tài khoản admin thủ công trong MongoDB hoặc đăng ký tài khoản mới và thay đổi role thành 'admin'.

## License

MIT
