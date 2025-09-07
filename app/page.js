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

  // Payment logic removed. Use /checkout page for payments.

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
            <a
              href="/checkout"
              className="inline-block px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold mb-4 shadow hover:bg-blue-700 transition-colors"
            >
              Go to Payment
            </a>
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