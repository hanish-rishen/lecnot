"use client";
import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (authStatus !== 'idle') {
      const timer = setTimeout(() => {
        setAuthStatus('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authStatus]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStatus('idle');
    setErrorMessage('');
    try {
      const result = await signInWithEmailAndPassword(email, password);
      if (result) {
        setAuthStatus('success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setAuthStatus('error');
        setErrorMessage('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setAuthStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthStatus('idle');
    setErrorMessage('');
    try {
      const result = await signInWithGoogle();
      if (result) {
        setAuthStatus('success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setAuthStatus('error');
        setErrorMessage('Google sign-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setAuthStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-black text-white">
      <div className="w-full max-w-md relative">
        <div className="relative bg-gray-900 rounded-lg p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-6 text-center text-white">Sign In</h1>
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white transition duration-200"
                required
                style={{
                  WebkitTextFillColor: 'white',
                  WebkitBoxShadow: '0 0 0px 1000px #1f2937 inset',
                  borderColor: '#4a5568',
                  outline: 'none'
                }}
              />
              <AnimatePresence>
                {errorMessage && authStatus === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 mt-2 text-sm"
                  >
                    {errorMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white transition duration-200"
                required
                style={{
                  WebkitTextFillColor: 'white',
                  WebkitBoxShadow: '0 0 0px 1000px #1f2937 inset',
                  borderColor: '#4a5568',
                  outline: 'none'
                }}
              />
            </div>
            <motion.button
              type="submit"
              className="w-full font-bold py-3 px-4 rounded transition duration-300 flex items-center justify-center"
              initial={{ backgroundColor: "#FFFFFF", color: "#000000" }}
              animate={{
                backgroundColor: authStatus === 'success' ? "#4CAF50" : authStatus === 'error' ? "#F44336" : "#FFFFFF",
                color: authStatus === 'idle' ? "#000000" : "#FFFFFF"
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {authStatus === 'success' && (
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {authStatus === 'error' && (
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </motion.button>
          </form>
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-transparent text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center hover:bg-white hover:bg-opacity-10 border border-white"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              {googleLoading ? 'Signing In...' : 'Sign in with Google'}
            </button>
          </div>
          <p className="mt-6 text-center text-sm">
            Don't have an account? <Link href="/signup" className="text-white hover:text-gray-300 transition duration-200 underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </main>
  );
}