import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

const menuItems = [
  { href: '/products', label: 'Ürünler' },
  { href: '/orders', label: 'Siparişlerim' },
  { href: '#about', label: 'Hakkımızda' },
  { href: '#contact', label: 'İletişim' },
  { href: '#support', label: 'Destek' },
];

export function EnterpriseHeader() {
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="backdrop-blur bg-gradient-to-r from-white/80 to-blue-50/80 shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-8">
        {/* Logo & Marka */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/baec-logo.gif" alt="BAEC Logo" className="h-10 w-10 object-contain rounded-full border border-primary shadow" />
          <span className="text-2xl font-extrabold text-primary tracking-tight font-sans">BAEC UV</span>
        </Link>

        {/* Menü */}
        <nav className="hidden md:flex items-center gap-6 text-base font-semibold">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-2 py-1 transition-colors duration-200 rounded-md
                ${location === item.href ? 'text-primary after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-primary after:rounded' : 'text-gray-700 hover:text-primary hover:bg-primary/10'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sağ Alan: Sepet ve Kullanıcı */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative group">
            <ShoppingCart className="w-7 h-7 text-gray-700 group-hover:text-primary transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow animate-bounce">{cartCount}</span>
            )}
          </Link>
          <button className="rounded-full bg-gray-100 border border-gray-300 p-1.5 hover:bg-primary/10 transition-colors">
            <User className="w-7 h-7 text-gray-500" />
          </button>
          {/* Hamburger Menü */}
          <button className="md:hidden ml-2 p-2 rounded hover:bg-primary/10 transition" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-7 h-7 text-gray-700" />
          </button>
        </div>
      </div>
      {/* Mobil Menü */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 shadow-lg border-b border-primary animate-fade-in-down">
          <nav className="flex flex-col gap-2 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded text-lg font-semibold transition-colors ${location === item.href ? 'bg-primary/10 text-primary' : 'hover:bg-primary/10 hover:text-primary text-gray-700'}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
} 