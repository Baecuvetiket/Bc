
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { FileUpload } from './file-upload';
import { Badge } from './badge';

export function OrderFormModern() {
  const [printType, setPrintType] = useState('normal');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [designFile, setDesignFile] = useState<File | null>(null);

  const calculatePrice = () => {
    const basePrice = printType === 'metallic' ? 5.0 : 2.5;
    let total = basePrice * quantity;
    
    if (quantity >= 100) total *= 0.85;
    else if (quantity >= 50) total *= 0.9;
    
    return total;
  };

  return (
    <section className="section-modern bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="heading-modern mb-4">Sipariş Oluştur</h2>
          <p className="text-xl text-gray-600">
            Hızlı ve kolay sipariş formu ile tasarımınızı yükleyin
          </p>
        </div>
        
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-2xl text-gradient flex items-center">
              <img 
                src="/attached_assets/BAEC-LOGO_1752068685082.gif" 
                alt="BAEC Logo" 
                className="h-8 w-auto mr-3"
              />
              Sipariş Detayları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Print Type Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800">
                Baskı Türü Seçin
              </Label>
              <RadioGroup 
                value={printType} 
                onValueChange={setPrintType}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="relative">
                  <RadioGroupItem value="normal" id="normal" className="peer sr-only" />
                  <Label 
                    htmlFor="normal"
                    className="flex flex-col items-center p-6 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50"
                  >
                    <div className="text-4xl mb-3">🖨️</div>
                    <span className="text-xl font-semibold">Normal Baskı</span>
                    <span className="text-3xl font-bold text-blue-600 mt-2">₺2.50</span>
                    <span className="text-gray-500">birim fiyat</span>
                  </Label>
                </div>
                
                <div className="relative">
                  <RadioGroupItem value="metallic" id="metallic" className="peer sr-only" />
                  <Label 
                    htmlFor="metallic"
                    className="flex flex-col items-center p-6 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50"
                  >
                    <div className="text-4xl mb-3">✨</div>
                    <span className="text-xl font-semibold">Metalik Baskı</span>
                    <Badge className="mb-2 bg-yellow-100 text-yellow-800">Premium</Badge>
                    <span className="text-3xl font-bold text-blue-600">₺5.00</span>
                    <span className="text-gray-500">birim fiyat</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800">
                Adet
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="input-modern text-lg h-14"
                />
                {quantity >= 50 && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500">
                    {quantity >= 100 ? '%15 İndirim!' : '%10 İndirim!'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Ad Soyad
                  </Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Adınız ve soyadınız"
                    className="input-modern"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Telefon
                  </Label>
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0555 123 45 67"
                    className="input-modern"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  E-posta
                </Label>
                <Input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="input-modern"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800">
                Tasarım Dosyası Yükleyin
              </Label>
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <FileUpload
                  onFileSelect={setDesignFile}
                  selectedFile={designFile}
                />
              </div>
            </div>

            {/* Price Display */}
            <div className="card-modern p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Toplam Tutar:</span>
                <span className="text-3xl font-bold text-gradient">
                  ₺{calculatePrice().toFixed(2)}
                </span>
              </div>
              {quantity >= 50 && (
                <p className="text-green-600 text-sm mt-2">
                  🎉 Toplu sipariş indirimi uygulandı!
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button className="w-full btn-modern text-xl py-6">
              Siparişi Tamamla
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
