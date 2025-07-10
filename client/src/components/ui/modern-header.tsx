import React from 'react';
import { Button } from './button';

export function ModernHeader() {
  return (
    <header className="glass-effect sticky top-0 z-50 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/attached_assets/BAEC-LOGO_1752068685082.gif"
            alt="BAEC Logo"
            className="h-10 w-auto"
          />
          <h1 className="text-2xl font-bold text-gradient">BAEC Dijital Baskı</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">
            Ana Sayfa
          </a>
          <a href="#products" className="text-gray-700 hover:text-blue-600 transition-colors">
            Ürünler
          </a>
          <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
            Hakkımızda
          </a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
            İletişim
          </a>
        </nav>

      </div>
    </header>
  );
}
