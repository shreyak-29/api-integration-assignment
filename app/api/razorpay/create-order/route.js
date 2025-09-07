import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { orderId, amount, customerName, customerEmail, customerPhone } =
    await req.json();

  // Cashfree sandbox credentials from environment variables
  const appId = process.env.CASHFREE_SANDBOX_APP_ID;
  const secretKey = process.env.CASHFREE_SANDBOX_SECRET_KEY;

  if (!appId || !secretKey) {
    return NextResponse.json(
      { error: "Cashfree credentials not set" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: customerEmail.replace(/[^a-zA-Z0-9_-]/g, "_"),
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
      },
      {
        headers: {
          "x-api-version": "2022-09-01",
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "Content-Type": "application/json",
        },
      }
    );

    // Return cftoken and order info
    return NextResponse.json({
      cftoken: response.data.cftoken,
      orderId,
      amount,
    });
  } catch (error) {
    console.error("Cashfree order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Could not create Cashfree order",
        error: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
