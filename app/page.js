'use client';
import { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(token => {
          fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ token }),
          }).then(res => res.json()).then(data => {
            setUser(data.user);
            setLoading(false);
          });
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert('Google Sign-In Error: ' + error.message);
    }
  };

  const handlePayment = async () => {
    try {
      // Prepare order details
      const orderId = 'order_' + Date.now();
      const amount = 100;
      const customerId = 'user_123'; 
      const customerName = user?.displayName || 'Test User';
      const customerEmail = user?.email || 'test@example.com';
      const customerPhone = '9999999999'; // Replace with actual phone if available

      // Call backend to get cftoken
      const res = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount,customerId, customerName, customerEmail, customerPhone })
      });
      const data = await res.json();
      if (!data.cftoken) throw new Error('Failed to get cftoken');

      // Launch Cashfree Drop-in Checkout
      if (!window.Cashfree) {
        alert('Cashfree SDK not loaded.');
        return;
      }
      window.Cashfree.launch({
        mode: 'sandbox',
        orderToken: data.cftoken,
        orderId: orderId,
        orderAmount: amount,
        customerName,
        customerEmail,
        customerPhone,
        notifyUrl: '',
        onSuccess: function(result) {
          console.log('Payment Success:', result);
          alert('Payment Successful!');
        },
        onFailure: function(result) {
          console.log('Payment Failure:', result);
          alert('Payment Failed.');
        }
      });
    } catch (err) {
      alert('Payment error: ' + err.message);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">API Integration Assignment</h1>
      <div className="mb-8 text-center">
        {user ? (
          <div>
            <p className="mb-4">Welcome, <b>{user.displayName || user.email}</b>!</p>
            {user.hasPurchased ? (
              <p className="text-green-600 font-semibold">Thank you for your purchase!</p>
            ) : (
              <button
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold mb-4 shadow hover:bg-blue-700 transition-colors"
                onClick={handlePayment}
              >
                Pay ₹100
              </button>
            )}
            <br />
            <button
              className="px-5 py-2 rounded-lg bg-neutral-900 text-white font-semibold mb-2 shadow hover:bg-neutral-700 transition-colors"
              onClick={() => auth.signOut()}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="px-5 py-2 rounded-lg bg-neutral-900 text-white font-semibold shadow hover:bg-neutral-700 transition-colors"
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}