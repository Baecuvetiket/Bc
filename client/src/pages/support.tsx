import React from 'react';

export default function SupportPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-primary mb-4">Destek</h1>
      <p className="text-lg text-gray-700 mb-6">
        Her türlü soru, öneri veya teknik destek için bize ulaşabilirsiniz. Müşteri memnuniyeti bizim için önceliklidir!
      </p>
      <div className="bg-gradient-to-r from-primary/10 to-blue-100/10 rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Sıkça Sorulan Sorular</h2>
        <ul className="text-gray-700 space-y-1 list-disc pl-6">
          <li>Ürünleriniz garantili mi?</li>
          <li>Ne kadar sürede teslimat yapıyorsunuz?</li>
          <li>Toplu siparişlerde indirim var mı?</li>
          <li>Teknik destek nasıl alabilirim?</li>
        </ul>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-bold text-primary mb-2">Destek Talebi Oluştur</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Ad Soyad" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="email" placeholder="E-posta" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea placeholder="Destek talebiniz" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]" />
          <button type="submit" className="w-full bg-primary text-white font-semibold py-2 rounded hover:bg-blue-700 transition">Gönder</button>
        </form>
      </div>
    </div>
  );
} 