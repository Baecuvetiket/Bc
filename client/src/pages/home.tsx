import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { 
  Tag, 
  Shield, 
  Droplets, 
  Thermometer, 
  Printer, 
  Gem, 
  Ruler, 
  Star, 
  Truck, 
  Palette,
  Award,
  Clock,
  Headphones,
  Check,
  ShoppingCart
} from "lucide-react";

interface PriceCalculation {
  unitPrice: number;
  quantity: number;
  subtotal: number;
  discount: number;
  total: number;
  hasDiscount: boolean;
}

interface OrderData {
  printType: 'normal' | 'metallic';
  metallicColor?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  total: number;
  designFile?: File;
}

const PRICES = {
  normal: 20,
  metallic: 50,
};

const DISCOUNT_THRESHOLD = 10;
const DISCOUNT_RATE = 0.3;

const METALLIC_COLORS = [
  { id: 'gold', name: 'Gold', gradient: 'from-yellow-400 to-yellow-600' },
  { id: 'silver', name: 'Silver', gradient: 'from-gray-300 to-gray-500' },
  { id: 'rose', name: 'Rose', gradient: 'from-rose-400 to-rose-600' },
  { id: 'red', name: 'Red', gradient: 'from-red-400 to-red-600' },
  { id: 'blue', name: 'Blue', gradient: 'from-blue-400 to-blue-600' },
];

export default function Home() {
  const [printType, setPrintType] = useState<'normal' | 'metallic'>('normal');
  const [metallicColor, setMetallicColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  
  const { toast } = useToast();

  const calculatePrice = (): PriceCalculation => {
    const unitPrice = PRICES[printType];
    const subtotal = unitPrice * quantity;
    const hasDiscount = quantity >= DISCOUNT_THRESHOLD;
    const discount = hasDiscount ? subtotal * DISCOUNT_RATE : 0;
    const total = subtotal - discount;

    return {
      unitPrice,
      quantity,
      subtotal,
      discount,
      total,
      hasDiscount,
    };
  };

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: OrderData) => {
      const formData = new FormData();
      formData.append('printType', orderData.printType);
      if (orderData.metallicColor) {
        formData.append('metallicColor', orderData.metallicColor);
      }
      formData.append('quantity', orderData.quantity.toString());
      formData.append('unitPrice', orderData.unitPrice.toString());
      formData.append('subtotal', orderData.subtotal.toString());
      formData.append('discount', orderData.discount.toString());
      formData.append('total', orderData.total.toString());
      
      if (orderData.designFile) {
        formData.append('designFile', orderData.designFile);
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Sipariş oluşturulurken bir hata oluştu');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setOrderNumber(`UV-2024-${String(data.order.id).padStart(3, '0')}`);
      setShowOrderModal(true);
      toast({
        title: "Sipariş Alındı!",
        description: "Siparişiniz başarıyla oluşturuldu.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (printType === 'metallic' && !metallicColor) {
      toast({
        title: "Hata",
        description: "Metalik baskı için renk seçimi zorunludur.",
        variant: "destructive",
      });
      return;
    }

    const calculation = calculatePrice();
    
    createOrderMutation.mutate({
      printType,
      metallicColor: printType === 'metallic' ? metallicColor : undefined,
      quantity,
      unitPrice: calculation.unitPrice,
      subtotal: calculation.subtotal,
      discount: calculation.discount,
      total: calculation.total,
      designFile: designFile || undefined,
    });
  };

  const priceCalculation = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-primary">
                <Tag className="inline mr-2" />
                Baec UV Etiket
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Ürünler</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Hakkımızda</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">İletişim</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-foreground text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Profesyonel UV Etiket Çözümleri
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              57x100 cm UV dayanıklı etiketler, normal ve metalik baskı seçenekleri
            </p>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md">
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    UV Dayanıklı
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Su Geçirmez
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Yüksek Kalite
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image & Info */}
            <div className="space-y-6">
              <Card>
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center">
                  <div className="text-center">
                    <Tag className="w-24 h-24 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">57x100 cm UV Etiket</h3>
                    <p className="text-gray-600 mt-2">Profesyonel kalitede UV dayanıklı etiketler</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    57x100 cm UV Etiket
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Ruler className="w-4 h-4 text-primary mr-2" />
                      <span>Boyut: 57x100 cm</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-primary mr-2" />
                      <span>UV Dayanıklı</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="w-4 h-4 text-primary mr-2" />
                      <span>Su Geçirmez</span>
                    </div>
                    <div className="flex items-center">
                      <Thermometer className="w-4 h-4 text-primary mr-2" />
                      <span>Sıcaklık Dayanıklı</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Özellikler</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Star className="w-5 h-5 text-accent mr-3 mt-1" />
                      <div>
                        <p className="font-medium">Premium Kalite</p>
                        <p className="text-sm text-gray-600">Yüksek kaliteli malzeme ve baskı</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Truck className="w-5 h-5 text-accent mr-3 mt-1" />
                      <div>
                        <p className="font-medium">Hızlı Teslimat</p>
                        <p className="text-sm text-gray-600">2-3 iş günü içinde kargoda</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Palette className="w-5 h-5 text-accent mr-3 mt-1" />
                      <div>
                        <p className="font-medium">Özel Tasarım</p>
                        <p className="text-sm text-gray-600">Kendi tasarımınızı yükleyin</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Siparişinizi Oluşturun</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Print Type Selection */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Baskı Türü Seçin
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="radio"
                          id="normal"
                          name="printType"
                          value="normal"
                          checked={printType === 'normal'}
                          onChange={(e) => setPrintType(e.target.value as 'normal' | 'metallic')}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor="normal"
                          className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all"
                        >
                          <Printer className="w-6 h-6 text-gray-600 peer-checked:text-primary mb-2" />
                          <span className="font-medium text-gray-800">Normal Baskı</span>
                          <span className="text-sm text-gray-600">$20/metretül</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="radio"
                          id="metallic"
                          name="printType"
                          value="metallic"
                          checked={printType === 'metallic'}
                          onChange={(e) => setPrintType(e.target.value as 'normal' | 'metallic')}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor="metallic"
                          className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all"
                        >
                          <Gem className="w-6 h-6 text-gray-600 peer-checked:text-primary mb-2" />
                          <span className="font-medium text-gray-800">Metalik Baskı</span>
                          <span className="text-sm text-gray-600">$50/metretül</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Metallic Color Selection */}
                  {printType === 'metallic' && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Metalik Renk Seçin
                      </Label>
                      <div className="grid grid-cols-5 gap-3">
                        {METALLIC_COLORS.map((color) => (
                          <div key={color.id} className="relative">
                            <input
                              type="radio"
                              id={color.id}
                              name="metallicColor"
                              value={color.id}
                              checked={metallicColor === color.id}
                              onChange={(e) => setMetallicColor(e.target.value)}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={color.id}
                              className="flex flex-col items-center justify-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all"
                            >
                              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${color.gradient} mb-2`}></div>
                              <span className="text-xs font-medium">{color.name}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Input */}
                  <div>
                    <Label htmlFor="quantity" className="text-sm font-medium text-gray-700 mb-3 block">
                      Miktar (Metretül)
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="pr-12"
                      />
                      <div className="absolute right-3 top-3 text-gray-400">
                        <Ruler className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">10 metretül üzeri siparişlerde %30 indirim</p>
                  </div>

                  {/* File Upload */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Tasarım Dosyası Yükleyin
                    </Label>
                    <FileUpload
                      onFileSelect={setDesignFile}
                      accept=".png,.jpg,.jpeg,.pdf"
                      maxSize={10 * 1024 * 1024} // 10MB
                      selectedFile={designFile}
                    />
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Birim Fiyat:</span>
                      <span className="font-medium">${priceCalculation.unitPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Miktar:</span>
                      <span className="font-medium">{priceCalculation.quantity} metretül</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ara Toplam:</span>
                      <span className="font-medium">${priceCalculation.subtotal.toFixed(2)}</span>
                    </div>
                    {priceCalculation.hasDiscount && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>İndirim (%30):</span>
                        <span>-${priceCalculation.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Toplam:</span>
                      <span className="text-primary">${priceCalculation.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? (
                      "Sipariş Oluşturuluyor..."
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Siparişi Tamamla
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Neden Baec UV Etiket?</h2>
            <p className="text-lg text-gray-600">Profesyonel etiket çözümleriniz için güvenilir partner</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Kalite Garantisi</h3>
              <p className="text-gray-600">UV dayanıklı, su geçirmez ve uzun ömürlü etiketler</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">2-3 iş günü içinde kapınızda</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">7/24 Destek</h3>
              <p className="text-gray-600">Sorularınız için her zaman yanınızdayız</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <Tag className="inline mr-2" />
                Baec UV Etiket
              </div>
              <p className="text-gray-400">Profesyonel UV etiket çözümleri için güvenilir adresiniz.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ürünler</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">UV Etiketler</a></li>
                <li><a href="#" className="hover:text-white">Metalik Baskı</a></li>
                <li><a href="#" className="hover:text-white">Özel Tasarım</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white">İletişim</a></li>
                <li><a href="#" className="hover:text-white">Gizlilik</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +90 (555) 123-4567</li>
                <li>✉️ info@baecuvetiket.com</li>
                <li>📍 İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Baec UV Etiket. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Order Success Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">Sipariş Alındı!</DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <p className="text-gray-600 mb-6">Siparişiniz başarıyla alındı. En kısa sürede size ulaşacağız.</p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>Sipariş No: <span className="font-medium">{orderNumber}</span></p>
              <p>Tahmini Teslimat: <span className="font-medium">2-3 İş Günü</span></p>
            </div>
            <Button 
              onClick={() => setShowOrderModal(false)}
              className="w-full"
            >
              Tamam
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
