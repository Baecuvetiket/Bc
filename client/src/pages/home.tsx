import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/file-upload';
import { CarouselBanner } from '@/components/ui/carousel-banner';
import { ProductShowcase } from '@/components/ui/product-showcase';
import { CalculatorTool } from '@/components/ui/calculator-tool';
import { MeterCalculator } from '@/components/ui/meter-calculator';
import { CategoryCalculator } from '@/components/ui/category-calculator';
import baecLogo from '@assets/BAEC-LOGO_1752068685082.gif';
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
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Zap,
  Users,
  MessageSquare,
  Calculator,
  Sparkles,
  Target,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { EnterpriseHeader } from '@/components/ui/enterprise-header';

interface PriceCalculation {
  unitPrice: number;
  quantity: number;
  subtotal: number;
  discount: number;
  total: number;
  hasDiscount: boolean;
  unitPriceUSD: number;
  totalUSD: number;
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
  normal: 20, // USD
  metallic: 50, // USD
};

const USD_TO_TRY_RATE = 40; // 1 USD = 40 TL
const DISCOUNT_THRESHOLD = 10;
const DISCOUNT_RATE = 0.3;

// Güncellenmiş Banner slides data
const bannerSlides = [
  {
    id: 1,
    title: 'Premium UV Etiketler',
    subtitle: 'Profesyonel Kalite Garantisi',
    description: 'UV dayanıklı, su geçirmez ve uzun ömürlü etiketler ile markanızı öne çıkarın',
    image: '🏷️',
    buttonText: 'Hemen Sipariş Ver',
    buttonAction: () =>
      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' }),
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'Metalik Baskı Teknolojisi',
    subtitle: 'Şık ve Göz Alıcı Tasarımlar',
    description: 'Gold, silver, rose ve daha fazla metalik renk seçeneği ile lüks görünüm',
    image: '✨',
    buttonText: 'Metalik Seçenekleri Keşfet',
    buttonAction: () =>
      document.getElementById('metallic-options')?.scrollIntoView({ behavior: 'smooth' }),
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    icon: Gem,
  },
  {
    id: 3,
    title: 'Toplu Sipariş Avantajları',
    subtitle: '10+ Metretül %30 İndirim',
    description: 'Büyük siparişlerde özel fiyatlar, hızlı teslimat ve premium hizmet',
    image: '🎯',
    buttonText: 'İndirim Hesapla',
    buttonAction: () =>
      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }),
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    icon: Target,
  },
];

// Güncellenmiş Product categories data
const productCategories = [
  {
    id: 1,
    name: 'Opak Etiket',
    description: 'Mat ve kalın yapıda, üzerine yazılan her şey net görünür',
    image: '🏷️',
    sheetPrice: 50,
    features: ['Opak Yüzey', 'Mat Finish', 'Yazı Dostu'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    name: 'Şeffaf Etiket',
    description: 'Şeffaf yapıda, arka plan görünür kalır',
    image: '🔍',
    sheetPrice: 50,
    features: ['Şeffaf Yüzey', 'Arka Plan Görünür', 'Profesyonel'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    name: 'Kuşe Etiket',
    description: 'Parlak ve pürüzsüz yüzey, canlı renkler',
    image: '✨',
    sheetPrice: 50,
    features: ['Parlak Yüzey', 'Canlı Renkler', 'Pürüzsüz'],
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 4,
    name: 'Soft Touch Etiket',
    description: 'Yumuşak dokunuş hissi, premium görünüm',
    image: '🌟',
    sheetPrice: 50,
    features: ['Soft Touch', 'Premium Hiss', 'Lüks Görünüm'],
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const METALLIC_COLORS = [
  { id: 'gold', name: 'Gold', gradient: 'from-yellow-400 to-yellow-600' },
  { id: 'silver', name: 'Silver', gradient: 'from-gray-300 to-gray-500' },
  { id: 'rose', name: 'Rose', gradient: 'from-rose-400 to-rose-600' },
  { id: 'red', name: 'Red', gradient: 'from-red-400 to-red-600' },
  { id: 'blue', name: 'Blue', gradient: 'from-blue-400 to-blue-600' },
];

// Yeni özellikler verisi
const features = [
  {
    icon: Shield,
    title: 'UV Dayanıklı',
    description: 'Güneş ışığına karşı dayanıklı, renk solması olmaz',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Droplets,
    title: 'Su Geçirmez',
    description: 'Yağmur ve neme karşı koruma, uzun ömürlü',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Truck,
    title: 'Hızlı Teslimat',
    description: '2-3 iş günü içinde kapınızda',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: Headphones,
    title: '7/24 Destek',
    description: 'Uzman ekibimiz her zaman yanınızda',
    gradient: 'from-purple-500 to-pink-500',
  },
];

// İstatistikler verisi
const stats = [
  { number: '1000+', label: 'Mutlu Müşteri', icon: Heart },
  { number: '50K+', label: 'Tamamlanan Sipariş', icon: Check },
  { number: '99%', label: 'Müşteri Memnuniyeti', icon: Star },
  { number: '24/7', label: 'Destek Hizmeti', icon: Headphones },
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
    const unitPriceUSD = PRICES[printType];
    const subtotalUSD = unitPriceUSD * quantity;
    const hasDiscount = quantity >= DISCOUNT_THRESHOLD;
    const discountUSD = hasDiscount ? subtotalUSD * DISCOUNT_RATE : 0;
    const totalUSD = subtotalUSD - discountUSD;

    // Convert to TRY for display
    const unitPrice = unitPriceUSD * USD_TO_TRY_RATE;
    const subtotal = subtotalUSD * USD_TO_TRY_RATE;
    const discount = discountUSD * USD_TO_TRY_RATE;
    const total = totalUSD * USD_TO_TRY_RATE;

    return {
      unitPrice,
      quantity,
      subtotal,
      discount,
      total,
      hasDiscount,
      unitPriceUSD,
      totalUSD,
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
        title: 'Sipariş Alındı!',
        description: 'Siparişiniz başarıyla oluşturuldu.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Hata',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (printType === 'metallic' && !metallicColor) {
      toast({
        title: 'Hata',
        description: 'Metalik baskı için renk seçimi zorunludur.',
        variant: 'destructive',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <EnterpriseHeader />

      {/* Hero Banner Carousel */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <CarouselBanner slides={bannerSlides} />
        </div>
      </section>

      {/* Sipariş Formu Bölümü - En Üstte */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Hemen Sipariş Verin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesyonel UV etiket çözümleriniz için hızlı ve kolay sipariş süreci
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card id="order-form" className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8">
                <div className="flex items-center justify-center mb-6">
                  <img
                    src={baecLogo}
                    alt="BAEC UV Etiket"
                    className="h-16 w-16 object-contain mr-4"
                  />
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    3D UV TRANSFER ETİKET SİPARİŞ
                  </CardTitle>
                </div>
                <p className="text-gray-600 text-lg">
                  Kaliteli ve dayanıklı etiketler için hemen sipariş verin
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8 p-8">
                  {/* Print Type Selection */}
                  <div>
                    <Label className="text-lg font-semibold text-gray-800 mb-6 block">
                      Baskı Türü Seçin
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
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
                          className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-2xl cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 peer-checked:border-primary peer-checked:bg-gradient-to-br peer-checked:from-primary/5 peer-checked:to-accent/5 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Printer className="w-8 h-8 text-white" />
                          </div>
                          <span className="text-xl font-bold text-gray-800 mb-2">Normal Baskı</span>
                          <span className="text-lg text-gray-600 mb-2">$20/metretül</span>
                          <span className="text-sm text-gray-500 text-center">Standart kalite, uygun fiyat</span>
                        </label>
                      </div>
                      <div className="relative group">
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
                          className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-2xl cursor-pointer hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 peer-checked:border-primary peer-checked:bg-gradient-to-br peer-checked:from-primary/5 peer-checked:to-accent/5 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Gem className="w-8 h-8 text-white" />
                          </div>
                          <span className="text-xl font-bold text-gray-800 mb-2">Metalik Baskı</span>
                          <span className="text-lg text-gray-600 mb-2">$50/metretül</span>
                          <span className="text-sm text-gray-500 text-center">Premium kalite, lüks görünüm</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Metallic Color Selection */}
                  {printType === 'metallic' && (
                    <div id="metallic-options" className="space-y-6">
                      <Label className="text-lg font-semibold text-gray-800 mb-6 block">
                        Metalik Renk Seçin
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {METALLIC_COLORS.map((color) => (
                          <div key={color.id} className="relative group">
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
                              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 peer-checked:border-primary peer-checked:bg-gradient-to-br peer-checked:from-primary/5 peer-checked:to-accent/5 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
                            >
                              <div
                                className={`w-12 h-12 rounded-full bg-gradient-to-br ${color.gradient} mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                              ></div>
                              <span className="text-sm font-semibold text-gray-800">{color.name}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metretül Hesaplama */}
                  <div id="quantity-input" className="space-y-6">
                    <Label className="text-lg font-semibold text-gray-800 mb-6 block">
                      Miktar Hesaplama
                    </Label>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <MeterCalculator
                        onCalculationComplete={(meters) => {
                          setQuantity(meters);
                        }}
                      />
                    </div>

                    <div className="mt-6">
                      <Label
                        htmlFor="quantity"
                        className="text-lg font-semibold text-gray-800 mb-4 block"
                      >
                        Toplam Miktar (Metretül)
                      </Label>
                      <div className="relative">
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          min="1"
                          step="0.1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                          className="pr-24 text-lg py-4 border-2 border-gray-200 focus:border-primary rounded-xl"
                          placeholder="Miktar giriniz"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg font-medium text-gray-500">
                          metretül
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-6">
                    <Label className="text-lg font-semibold text-gray-800 mb-6 block">
                      Tasarım Dosyası Yükleyin
                    </Label>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                      <FileUpload
                        onFileSelect={setDesignFile}
                        accept=".png,.jpg,.jpeg,.pdf"
                        maxSize={10 * 1024 * 1024} // 10MB
                        selectedFile={designFile}
                      />
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 space-y-6 border-2 border-primary/20 shadow-lg">
                    <div className="flex items-center justify-center mb-6">
                      <Calculator className="w-8 h-8 text-primary mr-3" />
                      <h4 className="text-2xl font-bold text-gray-800">Fiyat Özeti</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-lg text-gray-700">Birim Fiyat:</span>
                        <span className="text-lg font-semibold">
                          ${priceCalculation.unitPriceUSD.toFixed(2)} (₺
                          {priceCalculation.unitPrice.toFixed(2)})
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-lg text-gray-700">Miktar:</span>
                        <span className="text-lg font-semibold">{priceCalculation.quantity} metretül</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-lg text-gray-700">Ara Toplam:</span>
                        <span className="text-lg font-semibold">₺{priceCalculation.subtotal.toFixed(2)}</span>
                      </div>
                      {priceCalculation.hasDiscount && (
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 text-green-600">
                          <span className="text-lg">İndirim (%30):</span>
                          <span className="text-lg font-semibold">-₺{priceCalculation.discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-800">Toplam:</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          ₺{priceCalculation.total.toFixed(2)}
                        </div>
                        <div className="text-lg text-gray-600">
                          ${priceCalculation.totalUSD.toFixed(2)} USD
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 text-center mt-4 p-3 bg-white/50 rounded-lg">
                      * Döviz kuru: 1 USD = {USD_TO_TRY_RATE} TL
                    </div>
                  </div>

                  {/* Order Button */}
                  <Button
                    type="submit"
                    className="w-full mt-8 text-xl py-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                    size="lg"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Sipariş Oluşturuluyor...
                      </div>
                    ) : (
                      <>
                        <ShoppingCart className="w-6 h-6 mr-3" />
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

      {/* İstatistikler Bölümü */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Geliştirilmiş Özellikler */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <img src={baecLogo} alt="BAEC UV Etiket" className="h-20 w-20 object-contain mr-6" />
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Neden BAEC UV Etiket?
                </h2>
                <p className="text-xl text-gray-600 mt-2">Profesyonel çözümler, güvenilir kalite</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ürün Kategorileri */}
      {/* KALDIRILDI */}


      {/* Neden BAEC UV Etiket? */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <img src={baecLogo} alt="BAEC UV Etiket" className="h-20 w-20 object-contain mr-6" />
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Neden BAEC UV Etiket?
                </h2>
                <p className="text-xl text-gray-600 mt-2">
                  Profesyonel etiket çözümleriniz için güvenilir partner
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Kalite Garantisi</h3>
                <p className="text-gray-600 leading-relaxed">UV dayanıklı, su geçirmez ve uzun ömürlü etiketler ile markanızı koruyun</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Hızlı Teslimat</h3>
                <p className="text-gray-600 leading-relaxed">2-3 iş günü içinde kapınızda, zamanında teslimat garantisi</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Headphones className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">7/24 Destek</h3>
                <p className="text-gray-600 leading-relaxed">Uzman ekibimiz her zaman yanınızda, sorularınız için hazırız</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* İletişim Bölümü */}
      <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <img src={baecLogo} alt="BAEC UV Etiket" className="h-20 w-20 object-contain mr-6" />
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Bizimle İletişime Geçin
                </h2>
                <p className="text-xl text-gray-600 mt-2">Sorularınız için 7/24 yanınızdayız</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">İletişim Bilgileri</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Telefon</h4>
                      <p className="text-gray-600 text-lg">+90 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">E-posta</h4>
                      <p className="text-gray-600 text-lg">info@baecuvetiket.com</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Adres</h4>
                      <p className="text-gray-600 text-lg">İstanbul, Türkiye</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() =>
                    window.open(
                      'https://wa.me/905551234567?text=Merhaba,%20UV%20etiket%20hakkında%20bilgi%20almak%20istiyorum',
                      '_blank'
                    )
                  }
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  WhatsApp'tan Yazın
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Hızlı Mesaj</h3>
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Adınız</Label>
                    <Input 
                      placeholder="Adınızı giriniz" 
                      className="py-3 border-2 border-gray-200 focus:border-primary rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">E-posta</Label>
                    <Input 
                      placeholder="E-posta adresinizi giriniz" 
                      type="email" 
                      className="py-3 border-2 border-gray-200 focus:border-primary rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Telefon</Label>
                    <Input 
                      placeholder="Telefon numaranızı giriniz" 
                      type="tel" 
                      className="py-3 border-2 border-gray-200 focus:border-primary rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Mesajınız</Label>
                    <textarea
                      className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-primary"
                      rows={4}
                      placeholder="Mesajınızı buraya yazın..."
                    ></textarea>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Mesaj Gönder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <img
                  src={baecLogo}
                  alt="BAEC UV Etiket"
                  className="h-20 w-20 object-contain mr-4"
                />
                <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  BAEC UV Etiket
                </div>
              </div>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                Profesyonel UV etiket çözümleri için güvenilir adresiniz. Kalite ve güvenilirlik odaklı hizmet anlayışımızla yanınızdayız.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-green-500 text-white font-bold"
                  onClick={() =>
                    window.open(
                      'https://wa.me/905551234567?text=Merhaba,%20UV%20etiket%20hakkında%20bilgi%20almak%20istiyorum',
                      '_blank'
                    )
                  }
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Ürünler</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#products" className="hover:text-white transition-colors text-lg">
                    UV Etiketler
                  </a>
                </li>
                <li>
                  <a href="#products" className="hover:text-white transition-colors text-lg">
                    Metalik Baskı
                  </a>
                </li>
                <li>
                  <a href="#order-form" className="hover:text-white transition-colors text-lg">
                    Özel Tasarım
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors text-lg">
                    Özellikler
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Şirket</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors text-lg">
                    Hakkımızda
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors text-lg">
                    İletişim
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Gizlilik
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Kullanım Koşulları
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">İletişim</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center text-lg">
                  <Phone className="w-5 h-5 mr-3 text-primary" />
                  +90 (555) 123-4567
                </li>
                <li className="flex items-center text-lg">
                  <Mail className="w-5 h-5 mr-3 text-primary" />
                  info@baecuvetiket.com
                </li>
                <li className="flex items-center text-lg">
                  <MapPin className="w-5 h-5 mr-3 text-primary" />
                  İstanbul, Türkiye
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-lg">&copy; 2024 Baec UV Etiket. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Order Success Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-lg border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <DialogHeader className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check className="w-12 h-12 text-white" />
            </div>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Sipariş Alındı!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed">
              Siparişiniz başarıyla alındı. En kısa sürede size ulaşacağız.
            </p>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Sipariş No:</span>
                <span className="font-bold text-primary">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Tahmini Teslimat:</span>
                <span className="font-bold text-green-600">2-3 İş Günü</span>
              </div>
            </div>
            <Button 
              onClick={() => setShowOrderModal(false)} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Tamam
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
