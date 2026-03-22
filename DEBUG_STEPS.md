# Debug Steps cho MoMo Payment

## Bước 1: Test route payment
Truy cập: `https://nexus-t4sk.onrender.com/payment/test`
- Nếu thấy JSON response → Route payment hoạt động
- Nếu 404 → Route payment chưa được load

## Bước 2: Test MoMo API trực tiếp
Truy cập: `https://nexus-t4sk.onrender.com/direct-momo-test`
- Đăng nhập trước
- Sẽ test MoMo API trực tiếp và redirect
- Nếu thành công → MoMo API hoạt động
- Nếu lỗi → Xem JSON response để debug

## Bước 3: Test với form đơn giản
Truy cập: `https://nexus-t4sk.onrender.com/test-momo`
- Điền form và submit
- Xem logs trên Render Dashboard

## Bước 4: Test checkout thực tế
1. Thêm sản phẩm vào giỏ
2. Truy cập `/checkout`
3. Chọn MoMo và submit
4. Xem logs chi tiết

## Kiểm tra logs trên Render:
Tìm các dòng log sau:
```
=== CHECKOUT DEBUG ===
=== MOMO PAYMENT PROCESS ===
MoMo config: { ... }
MoMo request body: { ... }
MoMo API response: { ... }
SUCCESS: Redirecting to MoMo payUrl: ...
```

## Các lỗi có thể gặp:

### 1. Route 404
- Route `/payment` chưa được load
- Server chưa restart

### 2. MoMo API lỗi
- Environment variables sai
- Network issue

### 3. Validation lỗi
- Form thiếu dữ liệu
- JavaScript lỗi

### 4. Session lỗi
- User chưa đăng nhập
- Cart rỗng

## Test theo thứ tự:
1. `/payment/test` → Kiểm tra route
2. `/direct-momo-test` → Kiểm tra MoMo API
3. `/test-momo` → Kiểm tra form
4. `/checkout` → Test thực tế