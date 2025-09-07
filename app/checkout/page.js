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
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId
      });
    } catch (err) {
      setStatus('Error: ' + err.message);
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Cashfree Payment Checkout</h2>
      <form onSubmit={handlePay} className="space-y-4">
        <input type="text" className="w-full border rounded px-3 py-2" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="Order ID" required />
        <input type="number" className="w-full border rounded px-3 py-2" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required />
        <input type="text" className="w-full border rounded px-3 py-2" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer Name" required />
        <input type="email" className="w-full border rounded px-3 py-2" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="Customer Email" required />
        <input type="tel" className="w-full border rounded px-3 py-2" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Customer Phone" required />
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
      {status && (
        <div className="mt-4 text-center text-lg font-semibold text-green-600">{status}</div>
      )}
    </div>
  );
}
