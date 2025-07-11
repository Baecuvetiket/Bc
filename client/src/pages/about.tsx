import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-primary mb-4">Hakkımızda</h1>
      <p className="text-lg text-gray-700 mb-6">
        <b>BAEC UV Etiket</b> olarak, sektörde yenilikçi ve kaliteli çözümler sunmak için çalışıyoruz. Modern üretim teknolojilerimiz ve uzman ekibimizle, müşterilerimize en iyi UV transfer etiketleri ve baskı hizmetlerini sunuyoruz.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-primary mb-2">Misyonumuz</h2>
          <p className="text-gray-600">Müşterilerimize hızlı, güvenilir ve yüksek kaliteli baskı çözümleri sunmak; her zaman müşteri memnuniyetini ön planda tutmak.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-primary mb-2">Vizyonumuz</h2>
          <p className="text-gray-600">Türkiye'nin ve bölgenin lider dijital baskı ve etiket üreticisi olmak; yenilikçi teknolojilerle sektöre yön vermek.</p>
        </div>
      </div>
      <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-blue-100/10 rounded shadow">
        <h3 className="text-lg font-bold text-primary mb-2">Neden BAEC?</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Yüksek kalite ve dayanıklılık</li>
          <li>Hızlı üretim ve teslimat</li>
          <li>Uygun fiyat ve şeffaflık</li>
          <li>7/24 müşteri desteği</li>
        </ul>
      </div>
    </div>
  );
} 