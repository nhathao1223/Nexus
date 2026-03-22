# Hướng dẫn Quản lý User cho Admin

## Chức năng đã thêm:

### 1. **Thay đổi quyền user (Role Management)**
- **Người dùng** → **Quản trị viên**: Cấp quyền admin
- **Quản trị viên** → **Người dùng**: Thu hồi quyền admin
- **Bảo vệ**: Không thể thay đổi quyền của chính mình

### 2. **Khóa/Mở khóa tài khoản (Ban/Unban)**
- **Khóa user**: Ngăn user đăng nhập và sử dụng hệ thống
- **Mở khóa user**: Cho phép user đăng nhập trở lại
- **Bảo vệ**: Không thể khóa chính mình

### 3. **Lọc và tìm kiếm nâng cao**
- Lọc theo **vai trò**: Tất cả, Người dùng, Quản trị viên
- Lọc theo **trạng thái**: Tất cả, Hoạt động, Bị khóa
- Tìm kiếm theo **tên** hoặc **email**

## Cách sử dụng:

### Truy cập trang quản lý:
```
/admin/users
```

### Thay đổi quyền:
1. Click dropdown **"Quyền"** bên cạnh user
2. Chọn **"Người dùng"** hoặc **"Quản trị viên"**
3. Xác nhận thay đổi

### Khóa/Mở khóa user:
1. Click nút **"Khóa"** (đỏ) để khóa user
2. Click nút **"Mở khóa"** (xanh) để mở khóa user
3. Xác nhận hành động

### Lọc danh sách:
1. Chọn **vai trò** từ dropdown
2. Chọn **trạng thái** từ dropdown  
3. Nhập **từ khóa** tìm kiếm
4. Click **"Tìm kiếm"**

## Bảo mật:

### Ngăn chặn tự hại:
- ❌ Không thể thay đổi quyền của chính mình
- ❌ Không thể khóa chính mình
- ✅ Hiển thị "(Bạn)" cho tài khoản hiện tại

### Kiểm tra trạng thái:
- User bị khóa sẽ bị đăng xuất ngay lập tức
- Không thể đăng nhập khi bị khóa
- Hiển thị thông báo "Tài khoản đã bị khóa"

## Giao diện:

### Badges trạng thái:
- 🟢 **Hoạt động**: Badge xanh
- ⚫ **Bị khóa**: Badge xám

### Badges vai trò:
- 🔴 **Quản trị viên**: Badge đỏ
- 🔵 **Người dùng**: Badge xanh

### Nút hành động:
- 👁️ **Xem**: Xem chi tiết user
- ⚙️ **Quyền**: Dropdown thay đổi quyền
- 🚫 **Khóa**: Nút khóa user (đỏ)
- ✅ **Mở khóa**: Nút mở khóa user (xanh)

## API Endpoints:

```
PATCH /admin/users/:id/role
Body: { "role": "admin" | "user" }

PATCH /admin/users/:id/status  
Body: { "action": "ban" | "unban" }
```

## Test thử:
1. Tạo user test
2. Thử thay đổi quyền
3. Thử khóa/mở khóa
4. Kiểm tra user bị khóa không đăng nhập được
5. Thử các filter và search