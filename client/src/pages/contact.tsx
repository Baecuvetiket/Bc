import React from 'react';

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-primary mb-4">İletişim</h1>
      <p className="text-lg text-gray-700 mb-6">
        Bize ulaşmak için aşağıdaki iletişim kanallarını kullanabilirsiniz. Size en kısa sürede dönüş yapacağız!
      </p>
      <div className="bg-gradient-to-r from-primary/10 to-blue-100/10 rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-primary mb-2">İletişim Bilgileri</h2>
        <ul className="text-gray-700 space-y-1">
          <li><b>E-posta:</b> info@baecuv.com</li>
          <li><b>Telefon:</b> 0 (555) 123 45 67</li>
          <li><b>Adres:</b> İstanbul, Türkiye</li>
        </ul>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-bold text-primary mb-2">Bize Mesaj Gönderin</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Ad Soyad" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="email" placeholder="E-posta" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea placeholder="Mesajınız" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]" />
          <button type="submit" className="w-full bg-primary text-white font-semibold py-2 rounded hover:bg-blue-700 transition">Gönder</button>
        </form>
      </div>
    </div>
  );
} 