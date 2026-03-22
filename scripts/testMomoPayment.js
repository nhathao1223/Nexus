const { createMomoPayment } = require('../services/momoService');

async function testMomoPayment() {
  try {
    console.log('Testing MoMo payment creation...');
    
    const testOrder = {
      amount: 100000, // 100,000 VND
      orderId: 'TEST_' + Date.now(),
      orderInfo: 'Test payment for order #TEST123',
      extraData: 'test_extra_data'
    };

    console.log('Test order:', testOrder);
    
    const response = await createMomoPayment(testOrder);
    
    console.log('MoMo response:', JSON.stringify(response, null, 2));
    
    if (response.resultCode === 0) {
      console.log('✅ MoMo payment URL created successfully!');
      console.log('Payment URL:', response.payUrl);
      console.log('QR Code URL:', response.qrCodeUrl);
    } else {
      console.log('❌ MoMo payment creation failed');
      console.log('Error:', response.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing MoMo payment:', error.message);
  }
}

// Run test if called directly
if (require.main === module) {
  testMomoPayment();
}

module.exports = { testMomoPayment };