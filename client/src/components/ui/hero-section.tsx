
import React from 'react';
import { Button } from './button';
import { Badge } from './badge';

export function HeroSection() {
  return (
    <section className="section-modern bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <Badge className="mb-6 bg-blue-100 text-blue-700 px-4 py-2">
          🚀 Profesyonel Dijital Baskı Hizmetleri
        </Badge>
        
        <h1 className="heading-modern mb-6 leading-tight">
          Tasarımlarınızı Hayata Geçirin
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          En kaliteli malzemeler ve son teknoloji baskı makineleri ile 
          tasarımlarınızı mükemmel sonuçlarla gerçekleştiriyoruz.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button className="btn-modern text-lg px-8 py-4">
            Hemen Sipariş Ver
          </Button>
          <Button variant="outline" className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4">
            Ürünleri İncele
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="card-modern p-6 text-center">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Hızlı Teslimat</h3>
            <p className="text-gray-600">24 saat içinde üretim ve hızlı kargo</p>
          </div>
          
          <div className="card-modern p-6 text-center">
            <div className="w-16 h-16 accent-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Kalite</h3>
            <p className="text-gray-600">UV dayanıklı ve suya karşı dirençli</p>
          </div>
          
          <div className="card-modern p-6 text-center">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Özel Tasarım</h3>
            <p className="text-gray-600">İstediğiniz her tasarımı gerçekleştiriyoruz</p>
          </div>
        </div>
      </div>
    </section>
  );
}
