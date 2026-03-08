const https = require('https');
const crypto = require('crypto');

const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const redirectUrl =
  process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/orders';
const ipnUrl =
  process.env.MOMO_IPN_URL || 'http://localhost:3000/payment/momo/ipn';

/**
 * Tạo yêu cầu thanh toán MoMo (AIO v2 - captureWallet)
 * Trả về JSON response từ MoMo (chứa payUrl, deeplink, resultCode, ...)
 */
function createMomoPayment({ amount, orderId, orderInfo, extraData = '' }) {
  return new Promise((resolve, reject) => {
    try {
      if (!partnerCode || !accessKey || !secretKey) {
        throw new Error('Thiếu cấu hình MoMo (MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY)');
      }
      const requestId = `${partnerCode}-${Date.now()}`;
      const requestType = 'captureWallet';
      const amountStr = String(Math.round(amount));

      const rawSignature =
        `accessKey=${accessKey}` +
        `&amount=${amountStr}` +
        `&extraData=${extraData}` +
        `&ipnUrl=${ipnUrl}` +
        `&orderId=${orderId}` +
        `&orderInfo=${orderInfo}` +
        `&partnerCode=${partnerCode}` +
        `&redirectUrl=${redirectUrl}` +
        `&requestId=${requestId}` +
        `&requestType=${requestType}`;

      const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

      const requestBody = JSON.stringify({
        partnerCode,
        accessKey,
        requestId,
        amount: amountStr,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'vi',
      });

      const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
      };

      const req = https.request(options, (res) => {
        const chunks = [];

        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          try {
            const body = Buffer.concat(chunks).toString('utf8');
            const data = JSON.parse(body);
            resolve(data);
          } catch (err) {
            reject(err);
          }
        });
      });

      req.on('error', (err) => reject(err));

      req.write(requestBody);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  createMomoPayment,
};

