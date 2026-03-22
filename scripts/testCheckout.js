require('dotenv').config();
const express = require('express');
const { createMomoPayment } = require('../services/momoService');

// Test checkout flow
async function testCheckoutFlow() {
  console.log('=== TESTING CHECKOUT FLOW ===');
  
  // Mock request data
  const mockOrderData = {
    amount: 85000,
    orderId: 'test-order-' + Date.now(),
    orderInfo: 'Test checkout order',
    extraData: 'test-checkout'
  };
  
  console.log('Mock order data:', mockOrderData);
  
  try {
    console.log('\n1. Creating MoMo payment...');
    const momoResponse = await createMomoPayment(mockOrderData);
    
    console.log('2. MoMo response:', momoResponse);
    
    if (momoResponse && momoResponse.payUrl) {
      console.log('\n✅ SUCCESS: MoMo payment created');
      console.log('Payment URL:', momoResponse.payUrl);
      console.log('\nNext steps:');
      console.log('- User should be redirected to:', momoResponse.payUrl);
      console.log('- After payment, MoMo will redirect to:', process.env.MOMO_REDIRECT_URL);
      console.log('- MoMo will send IPN to:', process.env.MOMO_IPN_URL);
    } else {
      console.log('\n❌ FAILED: No payment URL');
      console.log('Result code:', momoResponse.resultCode);
      console.log('Message:', momoResponse.message);
    }
    
  } catch (error) {
    console.error('\n❌ ERROR in checkout flow:', error);
  }
}

testCheckoutFlow();