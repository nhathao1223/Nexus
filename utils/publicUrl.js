/**
 * Chuẩn hóa URL ảnh cho production:
 * - Bỏ prefix localhost
 * - Luôn dùng đường dẫn tuyệt đối từ gốc site (tránh ghép sai khi URL thiếu "/")
 * - Tên file đơn (vd: abc.webp) → /uploads/products/abc.webp
 */
function publicUrl(u) {
  if (u == null || u === '') return '/images/no-image.svg';
  let s = String(u).trim();
  if (!s) return '/images/no-image.svg';

  // Bỏ origin localhost (dev)
  if (/^https?:\/\/localhost(:\d+)?/i.test(s)) {
    s = s.replace(/^https?:\/\/localhost(:\d+)?/i, '') || '/images/no-image.svg';
  }

  // Ảnh ngoài (CDN, YouTube, …)
  if (/^https?:\/\//i.test(s)) {
    return s;
  }

  // Thiếu "/" đầu → trình duyệt ghép theo route hiện tại → dễ 404 (vd: products/741/...webp)
  if (!s.startsWith('/')) {
    if (s.startsWith('uploads/')) {
      s = `/${s}`;
    } else if (/\.(jpe?g|png|gif|webp|svg)$/i.test(s) && !s.includes('/')) {
      s = `/uploads/products/${s}`;
    } else {
      s = `/${s}`;
    }
  }

  return s;
}

module.exports = publicUrl;
