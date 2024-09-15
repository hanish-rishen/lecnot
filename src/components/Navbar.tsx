"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/signin');
      closeMenu();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-black border-b border-gray-600 shadow-lg relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold flex items-center py-4" onClick={closeMenu}>
          <svg fill="#000000" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
               viewBox="0 0 444.489 444.489" xmlSpace="preserve" className="inline-block mr-2 fill-current text-white">
            <path d="M441.56,25.557L418.933,2.929C417.058,1.054,414.514,0,411.862,0s-5.195,1.054-7.071,2.929l-49.862,49.863l-9.899-9.899
              c-3.906-3.905-10.236-3.905-14.143,0l-21.213,21.213l-7.071-7.071l7.071-7.071c3.905-3.905,3.905-10.237,0-14.142
              c-3.906-3.904-10.236-3.904-14.143,0L190.076,141.277c-3.905,3.905-3.905,10.237,0,14.143c3.906,3.905,10.236,3.905,14.143,0
              l84.242-84.243l7.07,7.071L66.569,307.21c-26.018,26.018-41.083,47.088-46.058,64.416c-3.664,12.763-2.26,23.936,4.312,33.899
              L2.929,427.418c-3.905,3.905-3.905,10.237,0,14.142c1.953,1.953,4.512,2.929,7.071,2.929s5.118-0.977,7.071-2.929l21.893-21.893
              c9.964,6.571,21.134,7.974,33.899,4.312c17.327-4.975,38.398-20.04,64.416-46.058l235.974-235.975c0.02-0.019,0.04-0.039,0.06-0.058
              s0.039-0.04,0.059-0.059l28.226-28.226c1.875-1.875,2.929-4.418,2.929-7.071s-1.054-5.196-2.929-7.071l-9.899-9.899l49.862-49.863
              C445.465,35.793,445.465,29.462,441.56,25.557z M67.345,404.755c-9.037,2.594-15.405,0.964-21.989-5.622
              c-6.586-6.585-8.215-12.956-5.621-21.989c3.544-12.346,14.964-28.683,33.987-48.639l42.262,42.262
              C96.028,389.791,79.691,401.21,67.345,404.755z M130.208,356.708l-42.426-42.426L309.673,92.39l42.426,42.426L130.208,356.708z
              M366.242,120.674l-42.426-42.426l14.142-14.142l32.479,32.479c0.016,0.016,0.032,0.032,0.048,0.048
              c0.017,0.016,0.032,0.032,0.049,0.048l9.851,9.851L366.242,120.674z M377.555,75.419l-8.485-8.485l42.792-42.792l8.485,8.485
              L377.555,75.419z"/>
          </svg>
          <span className="align-middle">lecnot</span>
        </Link>
        <div className="flex items-center">
          <ul className="hidden lg:flex lg:items-center space-x-4">
            <li>
              <Link href="/" className="block text-white hover:text-gray-200 font-bold">Home</Link>
            </li>
            {user && (
              <li>
                <Link href="/dashboard" className="block text-white hover:text-gray-200 font-bold">Dashboard</Link>
              </li>
            )}
            <li>
              <Link href="#about" className="block text-white hover:text-gray-200 font-bold">About</Link>
            </li>
            <li>
              <Link href="#contact" className="block text-white hover:text-gray-200 font-bold">Contact</Link>
            </li>
            {!user && (
              <li>
                <Link href="/signin">
                  <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors font-bold">Sign In</button>
                </Link>
              </li>
            )}
            {user && (
              <li>
                <button onClick={handleSignOut} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors font-bold">Sign Out</button>
              </li>
            )}
          </ul>
          <button
            className="lg:hidden text-white focus:outline-none ml-4"
            onClick={toggleMenu}
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
              ) : (
                <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm"
          >
            <div className="flex flex-col h-full justify-center items-center">
              <button
                onClick={toggleMenu}
                className="absolute top-4 right-4 text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <ul className="text-center">
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <Link href="/" className="text-3xl font-bold text-white hover:text-gray-300 transition-colors" onClick={closeMenu}>Home</Link>
                </motion.li>
                {user && (
                  <motion.li
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <Link href="/dashboard" className="text-3xl font-bold text-white hover:text-gray-300 transition-colors" onClick={closeMenu}>Dashboard</Link>
                  </motion.li>
                )}
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <Link href="#about" className="text-3xl font-bold text-white hover:text-gray-300 transition-colors" onClick={closeMenu}>About</Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <Link href="#contact" className="text-3xl font-bold text-white hover:text-gray-300 transition-colors" onClick={closeMenu}>Contact</Link>
                </motion.li>
                {!user && (
                  <motion.li
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link href="/signin" onClick={closeMenu}>
                      <button className="bg-white text-black px-6 py-3 rounded text-2xl font-bold hover:bg-gray-200 transition-colors">Sign In</button>
                    </Link>
                  </motion.li>
                )}
                {user && (
                  <motion.li
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button onClick={handleSignOut} className="bg-white text-black px-6 py-3 rounded text-2xl font-bold hover:bg-gray-200 transition-colors">Sign Out</button>
                  </motion.li>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
