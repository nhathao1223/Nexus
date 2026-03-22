/**
 * Chuẩn hóa URL ảnh cho production: bỏ prefix localhost,
 * trả về placeholder nếu không có URL.
 */
function publicUrl(u) {
  if (u == null || u === '') return '/images/no-image.png';
  const s = String(u).trim();
  if (/^https?:\/\/localhost(:\d+)?/i.test(s)) {
    const pathOnly = s.replace(/^https?:\/\/localhost(:\d+)?/i, '');
    return pathOnly || '/images/no-image.png';
  }
  return s;
}

module.exports = publicUrl;
