import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';

export function EnterpriseHeader() {
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="backdrop-blur bg-gradient-to-r from-white/90 via-blue-50/80 to-blue-100/80 shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-8">
        {/* Sol: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="relative">
            <img src="/baec-logo.gif" alt="BAEC Logo" className="h-10 w-10 object-contain rounded-full border-2 border-primary shadow group-hover:scale-105 transition-transform duration-200" />
          </span>
          <span className="text-2xl font-extrabold text-primary tracking-tight font-sans group-hover:text-blue-700 transition-colors">BAEC UV</span>
        </Link>
        {/* Sağ Alan: Ürünler butonu + Sepet ve Kullanıcı */}
        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className={`px-3 py-1 rounded-md font-semibold text-base transition-colors duration-200 hover:text-primary hover:bg-primary/10 ${location === '/products' ? 'text-primary bg-primary/10' : 'text-gray-700'}`}
          >
            Ürünler
          </Link>
          <Link href="/cart" className="relative group">
            <ShoppingCart className="w-7 h-7 text-gray-700 group-hover:text-primary transition-colors duration-200 group-active:scale-110" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow animate-bounce border-2 border-white">{cartCount}</span>
            )}
          </Link>
          {!user ? (
            <>
              <Link href="/login" className="px-3 py-1 rounded font-semibold text-base text-primary border border-primary bg-white hover:bg-primary/10 transition">Giriş Yap</Link>
              <Link href="/register" className="px-3 py-1 rounded font-semibold text-base text-white bg-primary hover:bg-blue-700 transition">Kayıt Ol</Link>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">{user.username}</span>
                <Link href="/profile" className="text-primary hover:text-blue-700 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 