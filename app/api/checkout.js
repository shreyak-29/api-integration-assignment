// pages/checkout.js
// Frontend checkout page using Cashfree Drop-in Checkout

import { useState } from 'react';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('order_' + Date.now());
  const [amount, setAmount] = useState('100');
  const[customerId, setCustomerId] = useState('user_123');  
  const [customerName, setCustomerName] = useState('Test User');
  const [customerEmail, setCustomerEmail] = useState('test@example.com');
  const [customerPhone, setCustomerPhone] = useState('9999999999');

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount, customerId, customerName, customerEmail, customerPhone })
      });
      const data = await res.json();
      if (!data.cftoken) throw new Error('Failed to get cftoken');

      // Cashfree Drop-in Checkout
      window.Cashfree.launch({
        mode: 'sandbox',
        orderToken: data.cftoken,
        orderId: orderId,
        orderAmount: amount,
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        notifyUrl: '',
        onSuccess: function(data) {
          console.log('Payment Success:', data);
        },
        onFailure: function(data) {
          console.log('Payment Failure:', data);
        }
      });
    } catch (err) {
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
    </div>
  );
}
