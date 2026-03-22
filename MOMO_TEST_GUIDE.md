# Hướng dẫn Test MoMo Payment trên Render

## Bước 1: Cập nhật Environment Variables trên Render

Truy cập Render Dashboard > Your App > Environment, đảm bảo có các biến sau:

```
NODE_ENV=production
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_REDIRECT_URL=https://nexus-t4sk.onrender.com/payment/momo/return
MOMO_IPN_URL=https://nexus-t4sk.onrender.com/payment/momo/ipn
```

## Bước 2: Test với trang test đơn giản

1. Truy cập: `https://nexus-t4sk.onrender.com/test-momo`
2. Đăng nhập nếu chưa đăng nhập
3. Click "Test MoMo Payment"
4. Sẽ redirect đến trang thanh toán MoMo

## Bước 3: Test với checkout thực tế

1. Thêm sản phẩm vào giỏ hàng
2. Truy cập `/checkout`
3. Điền đầy đủ thông tin (quan trọng: phải chọn đủ tỉnh/quận/phường)
4. Chọn "Ví MoMo"
5. Click "Hoàn tất đặt hàng"

## Bước 4: Kiểm tra logs

Truy cập Render Dashboard > Your App > Logs để xem:

```
=== CHECKOUT DEBUG ===
Request body: { ... }
Creating MoMo payment for order: ...
MoMo response: { payUrl: "https://test-payment.momo.vn/..." }
Redirecting to MoMo payUrl: ...
```

## Các vấn đề có thể gặp:

### 1. Không redirect được
- Kiểm tra logs xem có lỗi gì
- Đảm bảo form có đầy đủ dữ liệu

### 2. Validation error
- Đảm bảo chọn đủ tỉnh/quận/phường
- Kiểm tra JavaScript console có lỗi không

### 3. MoMo API error
- Kiểm tra environment variables
- Xem logs để debug

## Debug Commands

Chạy local để test:
```bash
node scripts/testMomo.js
node scripts/testCheckout.js
```

## Thành công khi:
- Click "Hoàn tất đặt hàng" → redirect đến trang MoMo
- Trang MoMo hiển thị QR code và thông tin thanh toán
- Sau thanh toán → redirect về `/orders/{orderId}`