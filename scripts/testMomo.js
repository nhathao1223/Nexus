require('dotenv').config();
const { createMomoPayment } = require('../services/momoService');

async function testMomoPayment() {
  try {
    console.log('Testing MoMo payment...');
    console.log('Environment variables:');
    console.log('MOMO_PARTNER_CODE:', process.env.MOMO_PARTNER_CODE);
    console.log('MOMO_ACCESS_KEY:', process.env.MOMO_ACCESS_KEY);
    console.log('MOMO_SECRET_KEY:', process.env.MOMO_SECRET_KEY ? 'SET' : 'NOT SET');
    console.log('MOMO_REDIRECT_URL:', process.env.MOMO_REDIRECT_URL);
    console.log('MOMO_IPN_URL:', process.env.MOMO_IPN_URL);
    
    const testPayment = {
      amount: 50000,
      orderId: 'test-' + Date.now(),
      orderInfo: 'Test payment',
      extraData: 'test-data'
    };
    
    console.log('\nCreating test payment:', testPayment);
    
    const response = await createMomoPayment(testPayment);
    
    console.log('\nMoMo response:', response);
    
    if (response.payUrl) {
      console.log('\n✅ SUCCESS: Payment URL created');
      console.log('Payment URL:', response.payUrl);
    } else {
      console.log('\n❌ FAILED: No payment URL in response');
      console.log('Result Code:', response.resultCode);
      console.log('Message:', response.message);
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
  }
}

testMomoPayment();