# Hướng dẫn Deploy trên Render và cấu hình MoMo

## Bước 1: Cấu hình Environment Variables trên Render

Truy cập Render Dashboard > Your App > Environment, thêm các biến môi trường sau:

```
PORT=3000
MONGODB_URI=mongodb+srv://nexus_user:Nexus123456@nexus-cluster.lcfisrj.mongodb.net/nexus?retryWrites=true&w=majority&appName=Nexus-Cluster
JWT_SECRET=your_jwt_secret_key_here_change_in_production
SESSION_SECRET=your_session_secret_key_here_change_in_production
NODE_ENV=production
LOG_LEVEL=info

# MoMo Payment Configuration
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_REDIRECT_URL=https://YOUR_RENDER_APP_NAME.onrender.com/payment/momo/return
MOMO_IPN_URL=https://YOUR_RENDER_APP_NAME.onrender.com/payment/momo/ipn
```

**QUAN TRỌNG**: Thay `YOUR_RENDER_APP_NAME` bằng tên app thực tế của bạn trên Render.

## Bước 2: Cấu hình MoMo Test Environment

Các thông tin MoMo hiện tại là cho môi trường test:
- Partner Code: MOMO
- Access Key: F8BBA842ECF85
- Secret Key: K951B6PE1waDMi640xX08PD3vg6EkVlz
- Endpoint: test-payment.momo.vn

## Bước 3: Kiểm tra sau khi deploy

1. Truy cập `https://your-app.onrender.com/checkout`
2. Chọn phương thức thanh toán MoMo
3. Click "Đặt hàng" - sẽ redirect đến trang thanh toán MoMo
4. Sau khi thanh toán, sẽ quay về trang chi tiết đơn hàng

## Bước 4: Debug nếu có lỗi

Kiểm tra logs trên Render Dashboard để xem:
- MoMo payment request
- MoMo IPN callback
- Redirect flow

## Lưu ý quan trọng

1. **URL phải chính xác**: Đảm bảo MOMO_REDIRECT_URL và MOMO_IPN_URL sử dụng đúng domain của Render
2. **HTTPS required**: Render tự động cung cấp HTTPS, MoMo yêu cầu HTTPS cho production
3. **Test environment**: Hiện tại đang dùng test environment của MoMo, cần chuyển sang production khi go-live

## Troubleshooting

Nếu vẫn không redirect được:
1. Kiểm tra logs để xem có lỗi khi call MoMo API không
2. Verify URL trong environment variables
3. Kiểm tra network tab trong browser để xem response từ MoMo