const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Payment routes working!', timestamp: new Date() });
});

// MoMo IPN callback handler
router.post('/momo/ipn', async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;

    console.log('MoMo IPN received:', req.body);

    // Verify signature
    const secretKey = process.env.MOMO_SECRET_KEY;
    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid MoMo signature');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Find and update order
    const order = await Order.findById(orderId);
    if (!order) {
      console.error('Order not found:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }

    if (resultCode === 0) {
      // Payment successful
      order.status = 'confirmed';
      order.paymentStatus = 'paid';
      order.transactionId = transId;
      await order.save();
      console.log('Order payment confirmed:', orderId);
    } else {
      // Payment failed
      order.status = 'cancelled';
      order.paymentStatus = 'failed';
      await order.save();
      console.log('Order payment failed:', orderId, message);
    }

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('MoMo IPN error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// MoMo return URL handler (when user returns from MoMo)
router.get('/momo/return', async (req, res) => {
  try {
    const { orderId, resultCode, message } = req.query;
    
    if (resultCode === '0') {
      req.flash('success_msg', 'Thanh toán thành công!');
    } else {
      req.flash('error_msg', `Thanh toán thất bại: ${message}`);
    }
    
    res.redirect(`/orders/${orderId}`);
  } catch (error) {
    console.error('MoMo return error:', error);
    req.flash('error_msg', 'Có lỗi xảy ra khi xử lý thanh toán');
    res.redirect('/orders');
  }
});

module.exports = router;