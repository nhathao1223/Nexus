# Hướng dẫn cấu hình Cloudinary cho lưu trữ hình ảnh

## Vấn đề:
- Render không hỗ trợ persistent file storage
- Hình ảnh upload bị mất khi server restart
- Cần cloud storage để lưu trữ hình ảnh

## Giải pháp: Sử dụng Cloudinary

### Bước 1: Tạo tài khoản Cloudinary
1. Truy cập: https://cloudinary.com/
2. Đăng ký tài khoản miễn phí
3. Lấy thông tin API từ Dashboard

### Bước 2: Thêm Environment Variables trên Render
Truy cập Render Dashboard > Your App > Environment, thêm:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key  
CLOUDINARY_API_SECRET=your-api-secret
```

### Bước 3: Deploy lại app
- Code đã được cập nhật để hỗ trợ Cloudinary
- Khi deploy, app sẽ tự động sử dụng Cloudinary cho production

## Cách hoạt động:

### Development (Local):
- Lưu file trong thư mục `uploads/products/`
- Sử dụng local storage

### Production (Render):
- Upload trực tiếp lên Cloudinary
- Nhận URL từ Cloudinary
- Không lưu file trên server

## Lợi ích:
- ✅ Hình ảnh không bị mất khi restart
- ✅ CDN tốc độ cao
- ✅ Tự động optimize hình ảnh
- ✅ Miễn phí 25GB/tháng
- ✅ Resize và transform tự động

## Kiểm tra:
1. Thêm Environment Variables
2. Deploy app
3. Upload sản phẩm mới với hình ảnh
4. Kiểm tra hình ảnh hiển thị đúng
5. Restart app và kiểm tra hình ảnh vẫn còn

## Cloudinary Dashboard:
- Xem tất cả hình ảnh đã upload
- Quản lý storage usage
- Xem statistics và analytics

## Backup plan:
Nếu không muốn dùng Cloudinary, có thể:
1. Sử dụng AWS S3
2. Sử dụng Google Cloud Storage  
3. Sử dụng external image hosting service