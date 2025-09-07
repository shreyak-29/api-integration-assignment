// app/checkout/page.js
// Cashfree Drop-in Checkout page for Next.js 13+ app directory

'use client';
import { useState } from 'react';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('order_' + Date.now());
  const [amount, setAmount] = useState('100');
  const [customerName, setCustomerName] = useState('Test User');
  const [customerEmail, setCustomerEmail] = useState('test@example.com');
  const [customerPhone, setCustomerPhone] = useState('9999999999');
  const [status, setStatus] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    // Always generate a new unique orderId for each payment attempt
    const newOrderId = 'order_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
    setOrderId(newOrderId);
    try {
      const customerId = 'user_123'; // Use a valid alphanumeric ID
      const res = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: newOrderId, amount: Number(amount), customerId, customerName, customerEmail, customerPhone })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.message || 'Order creation failed');
      }
      if (!data.paymentSessionId) throw new Error('Failed to get payment session id');

      // Ensure Cashfree SDK is loaded and available
      function loadCashfreeSDK() {
        return new Promise((resolve, reject) => {
          if (typeof window !== 'undefined' && window.Cashfree) {
            resolve(true);
            return;
          }
          const existing = document.getElementById('cashfree-sdk');
          if (existing) {
            existing.addEventListener('load', () => resolve(true), { once: true });
            existing.addEventListener('error', () => reject(new Error('Failed to load Cashfree SDK')), { once: true });
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
          script.async = true;
          script.id = 'cashfree-sdk';
          script.onload = () => resolve(true);
          script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
          document.body.appendChild(script);
        });
      }

      function waitForCashfreeSDK(retries = 60) {
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            const available = typeof window !== 'undefined' && typeof window.Cashfree === 'function';
            if (available) {
              clearInterval(interval);
              resolve(true);
            } else if (--retries <= 0) {
              clearInterval(interval);
              reject(new Error('Cashfree SDK not loaded. Please try again in a moment.'));
            }
          }, 250);
        });
      }

      await loadCashfreeSDK();
      await waitForCashfreeSDK();

      // Initialize Cashfree and launch checkout with v3 API
      const cashfree = await window.Cashfree({ mode: 'sandbox' });
      const result = await cashfree.checkout({
        paymentSessionId: data.paymentSessionId
      });

      if (result && (result.order && result.order.status === 'PAID' || result.status === 'SUCCESS')) {
        setStatus('Payment Successful! Redirecting...');
        try { sessionStorage.setItem('paymentSuccess', '1'); } catch (_e) {}
        window.location.href = '/';
        return;
      }
      if (result && (result.order && result.order.status === 'FAILED' || result.status === 'FAILED')) {
        setStatus('Payment Failed.');
        return;
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="wrap">
      <h2 className="title">Cashfree Checkout</h2>
      <form onSubmit={handlePay} className="form">
        <div className="field">
          <label className="label" htmlFor="orderId">Order ID</label>
          <input id="orderId" type="text" className="input" value={orderId} onChange={e => setOrderId(e.target.value)} required />
        </div>
        <div className="field">
          <label className="label" htmlFor="amount">Amount (INR)</label>
          <input id="amount" type="number" min="1" className="input" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div className="field">
          <label className="label" htmlFor="name">Customer Name</label>
          <input id="name" type="text" className="input" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
        </div>
        <div className="field">
          <label className="label" htmlFor="email">Customer Email</label>
          <input id="email" type="email" className="input" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label className="label" htmlFor="phone">Customer Phone</label>
          <input id="phone" type="tel" className="input" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required />
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Processing…' : 'Pay Now'}
        </button>
      </form>
      {status && (
        <div className="status" role="status">{status}</div>
      )}

      <style jsx>{`
        .wrap { max-width: 440px; margin: 40px auto; padding: 20px; background: #ffffff; border: 1px solid #e6e6e6; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .title { margin: 0 0 16px; font-size: 22px; font-weight: 700; text-align: center; color: #111827; }
        .form { display: grid; gap: 12px; }
        .field { display: grid; gap: 6px; }
        .label { font-size: 13px; color: #374151; }
        .input { height: 40px; padding: 0 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; transition: border-color .15s ease, box-shadow .15s ease; }
        .input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
        .button { height: 42px; border: 0; border-radius: 8px; background: #2563eb; color: #fff; font-weight: 600; cursor: pointer; transition: background .15s ease, opacity .15s ease; }
        .button:hover { background: #1e4fcf; }
        .button[disabled] { opacity: .6; cursor: not-allowed; }
        .status { margin-top: 12px; padding: 10px; text-align: center; border-radius: 8px; background: #f0fdf4; color: #166534; font-weight: 600; }
      `}</style>
    </div>
  );
}
