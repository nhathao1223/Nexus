# Hướng dẫn cấu hình MoMo Payment cho Render Deployment

## Vấn đề
Khi deploy trên Render, thanh toán MoMo không hoạt động vì:
1. Thiếu route xử lý IPN (Instant Payment Notification)
2. Thiếu route xử lý return URL
3. Cấu hình URL không đúng cho production

## Giải pháp đã thực hiện

### 1. Thêm routes MoMo payment
- `POST /payment/momo/ipn` - Xử lý callback từ MoMo
- `GET /payment/momo/return` - Xử lý redirect sau thanh toán

### 2. Thêm handlers trong clientController
- `handleMomoIPN()` - Xử lý IPN, cập nhật trạng thái đơn hàng
- `handleMomoReturn()` - Xử lý return URL, hiển thị kết quả

### 3. Cập nhật model Order
Thêm các field để lưu thông tin MoMo:
- `paymentStatus`: 'pending', 'paid', 'failed'
- `momoTransactionId`: ID giao dịch MoMo
- `momoResultCode`: Mã kết quả từ MoMo
- `momoMessage`: Thông báo từ MoMo

## Cấu hình cho Render

### Environment Variables cần thiết:
```
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_REDIRECT_URL=https://your-render-app.onrender.com/payment/momo/return
MOMO_IPN_URL=https://your-render-app.onrender.com/payment/momo/ipn
```

**Lưu ý**: Thay `your-render-app` bằng tên app thực tế trên Render.

### Kiểm tra hoạt động:
1. Localhost: `http://localhost:3000/payment/momo/return`
2. Production: `https://your-app.onrender.com/payment/momo/return`

## Flow thanh toán MoMo

1. User chọn thanh toán MoMo → POST /checkout
2. Server tạo đơn hàng → Gọi MoMo API
3. MoMo trả về `payUrl` → User redirect đến MoMo
4. User thanh toán trên MoMo
5. MoMo gọi IPN → POST /payment/momo/ipn (cập nhật DB)
6. MoMo redirect user → GET /payment/momo/return (hiển thị kết quả)

## Debug
- Check logs cho MoMo IPN và return URL
- Verify signature trong IPN handler
- Đảm bảo URLs accessible từ internet (không localhost)