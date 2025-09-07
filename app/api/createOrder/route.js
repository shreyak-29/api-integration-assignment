import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  const { orderId, amount, customerId, customerName, customerEmail, customerPhone } = await req.json();

  // Cashfree sandbox credentials from environment variables
  const appId = process.env.CASHFREE_SANDBOX_APP_ID;
  const secretKey = process.env.CASHFREE_SANDBOX_SECRET_KEY;

  if (!appId || !secretKey) {
    return NextResponse.json({ error: 'Cashfree credentials not set' }, { status: 500 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (req.headers.get('origin') || 'http://localhost:3000');
    const returnUrl = `${baseUrl}/?cf_id={order_id}&cf_status={order_status}`;
    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone
      },
      order_meta: {
        return_url: returnUrl
      }
    };
    console.log('Cashfree request payload:', payload);

    const response = await axios.post(
      'https://sandbox.cashfree.com/pg/orders',
      payload,
      {
        headers: {
          'x-api-version': '2022-09-01',
          'x-client-id': appId,
          'x-client-secret': secretKey,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log full response for debugging
    console.log('Cashfree API response:', response.data);

    // Return cftoken and order info if available
    if (response.data.payment_session_id) {
      return NextResponse.json({
        paymentSessionId: response.data.payment_session_id,
        orderId,
        amount,
        cashfreeResponse: response.data
      });
    } else {
      return NextResponse.json({
        error: 'No payment_session_id returned',
        cashfreeResponse: response.data
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Cashfree order creation error:', error.message);
    if (error.response) {
      console.error('Cashfree error response:', error.response.data);
    }
    return NextResponse.json({
      success: false,
      message: 'Could not create Cashfree order',
      error: error.response?.data || error.message,
      requestPayload: error.config?.data
    }, { status: 500 });
  }
}
