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
import { CarouselBanner } from "@/components/ui/carousel-banner";
import { ProductShowcase } from "@/components/ui/product-showcase";
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
  MessageSquare
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
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

const PRICES = {
  normal: 20,
  metallic: 50,
};

const DISCOUNT_THRESHOLD = 10;
const DISCOUNT_RATE = 0.3;

// Banner slides data
const bannerSlides = [
  {
    id: 1,
    title: "Premium UV Etiketler",
    subtitle: "Profesyonel Kalite Garantisi",
    description: "UV dayanıklı, su geçirmez ve uzun ömürlü etiketler",
    image: "🏷️",
    buttonText: "Hemen Sipariş Ver",
    buttonAction: () => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' }),
    gradient: "from-blue-600 to-purple-600"
  },
  {
    id: 2,
    title: "Metalik Baskı",
    subtitle: "Şık ve Göz Alıcı Tasarımlar",
    description: "Gold, silver, rose ve daha fazla metalik renk seçeneği",
    image: "✨",
    buttonText: "Metalik Seçenekleri Gör",
    buttonAction: () => document.getElementById('metallic-options')?.scrollIntoView({ behavior: 'smooth' }),
    gradient: "from-amber-500 to-orange-600"
  },
  {
    id: 3,
    title: "Toplu Siparişte İndirim",
    subtitle: "10+ Metretül %30 İndirim",
    description: "Büyük siparişlerde özel fiyatlar ve hızlı teslimat",
    image: "🎯",
    buttonText: "İndirim Hesapla",
    buttonAction: () => document.getElementById('quantity-input')?.scrollIntoView({ behavior: 'smooth' }),
    gradient: "from-green-500 to-teal-600"
  }
];

// Featured products data
const featuredProducts = [
  {
    id: 1,
    name: "UV Dayanıklı Normal Etiket",
    price: 20.00,
    originalPrice: 25.00,
    image: "🏷️",
    category: "Normal Baskı",
    rating: 5,
    reviews: 127,
    badge: "En Çok Satan",
    features: ["UV Dayanıklı", "Su Geçirmez", "Uzun Ömürlü"]
  },
  {
    id: 2,
    name: "Metalik Gold Etiket",
    price: 50.00,
    image: "✨",
    category: "Metalik Baskı",
    rating: 5,
    reviews: 89,
    badge: "Premium",
    features: ["Metalik Gold", "Lüks Görünüm", "Özel Tasarım"]
  },
  {
    id: 3,
    name: "Metalik Silver Etiket",
    price: 50.00,
    image: "🌟",
    category: "Metalik Baskı",
    rating: 4,
    reviews: 56,
    features: ["Metalik Silver", "Şık Tasarım", "Profesyonel"]
  },
  {
    id: 4,
    name: "Özel Tasarım Etiket",
    price: 35.00,
    image: "🎨",
    category: "Özel Tasarım",
    rating: 5,
    reviews: 203,
    badge: "Yeni",
    features: ["Kendi Tasarımınız", "Hızlı Üretim", "Özel Boyut"]
  }
];

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
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  
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
      
      if (orderData.customerName) {
        formData.append('customerName', orderData.customerName);
      }
      if (orderData.customerEmail) {
        formData.append('customerEmail', orderData.customerEmail);
      }
      if (orderData.customerPhone) {
        formData.append('customerPhone', orderData.customerPhone);
      }
      
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
      customerName: customerName || undefined,
      customerEmail: customerEmail || undefined,
      customerPhone: customerPhone || undefined,
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
              <a href="#products" className="text-gray-600 hover:text-primary transition-colors">Ürünler</a>
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Özellikler</a>
              <a href="#order-form" className="text-gray-600 hover:text-primary transition-colors">Sipariş</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">İletişim</a>
            </div>
          </div>
        </div>
      </header>

      {/* Banner Carousel */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <CarouselBanner slides={bannerSlides} />
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <ProductShowcase 
            title="Öne Çıkan Ürünler" 
            products={featuredProducts}
            onProductClick={(product) => {
              if (product.category === "Normal Baskı") {
                setPrintType('normal');
              } else if (product.category === "Metalik Baskı") {
                setPrintType('metallic');
              }
              document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden Baec UV Etiket?</h2>
            <p className="text-lg text-gray-600">Profesyonel çözümler, güvenilir kalite</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">UV Dayanıklı</h3>
              <p className="text-gray-600">Güneş ışığına karşı dayanıklı, renk solması olmaz</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Su Geçirmez</h3>
              <p className="text-gray-600">Yağmur ve neme karşı koruma, uzun ömürlü</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">2-3 iş günü içinde kapınızda</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">7/24 Destek</h3>
              <p className="text-gray-600">Uzman ekibimiz her zaman yanınızda</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-16 bg-white">
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-gray-600">Mutlu Müşteri</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">24h</div>
                  <div className="text-sm text-gray-600">Hızlı Üretim</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-sm text-gray-600">Kalite Garantisi</div>
                </Card>
              </div>
            </div>

            {/* Order Form */}
            <Card id="order-form">
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
                          <span className="text-sm text-gray-600">₺20/metretül</span>
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
                          <span className="text-sm text-gray-600">₺50/metretül</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Metallic Color Selection */}
                  {printType === 'metallic' && (
                    <div id="metallic-options">
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
                              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${color.gradient} mb-2 shadow-sm`}></div>
                              <span className="text-xs font-medium">{color.name}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Input */}
                  <div id="quantity-input">
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
                        className="pr-12 text-lg"
                      />
                      <div className="absolute right-3 top-3 text-gray-400">
                        <Ruler className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-500">10 metretül üzeri siparişlerde %30 indirim</p>
                      {quantity >= 10 && (
                        <Badge className="bg-green-100 text-green-800">
                          %30 İndirim Aktif!
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                    <h4 className="font-semibold text-gray-800 mb-3">İletişim Bilgileri</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName" className="text-sm font-medium text-gray-700 mb-2 block">
                          Ad Soyad
                        </Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Adınızı ve soyadınızı girin"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="customerPhone" className="text-sm font-medium text-gray-700 mb-2 block">
                          Telefon
                        </Label>
                        <Input
                          id="customerPhone"
                          name="customerPhone"
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="0555 123 4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="customerEmail" className="text-sm font-medium text-gray-700 mb-2 block">
                        E-posta
                      </Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="ornek@email.com"
                      />
                    </div>
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
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 space-y-4 border border-primary/10">
                    <h4 className="font-semibold text-gray-800 mb-3">Fiyat Özeti</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Birim Fiyat:</span>
                      <span className="font-medium">₺{priceCalculation.unitPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Miktar:</span>
                      <span className="font-medium">{priceCalculation.quantity} metretül</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ara Toplam:</span>
                      <span className="font-medium">₺{priceCalculation.subtotal.toFixed(2)}</span>
                    </div>
                    {priceCalculation.hasDiscount && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>İndirim (%30):</span>
                        <span>-₺{priceCalculation.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Toplam:</span>
                      <span className="text-primary">₺{priceCalculation.total.toFixed(2)}</span>
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

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bizimle İletişime Geçin</h2>
            <p className="text-lg text-gray-600">Sorularınız için 7/24 yanınızdayız</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-primary mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-800">Telefon</h3>
                  <p className="text-gray-600">+90 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-primary mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-800">E-posta</h3>
                  <p className="text-gray-600">info@baecuvetiket.com</p>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-primary mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-800">Adres</h3>
                  <p className="text-gray-600">İstanbul, Türkiye</p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.open('https://wa.me/905551234567?text=Merhaba,%20UV%20etiket%20hakkında%20bilgi%20almak%20istiyorum', '_blank')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp'tan Yazın
              </Button>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Hızlı Mesaj</h3>
              <div className="space-y-4">
                <Input placeholder="Adınız" />
                <Input placeholder="E-posta" type="email" />
                <Input placeholder="Telefon" type="tel" />
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={4}
                  placeholder="Mesajınız..."
                ></textarea>
                <Button className="w-full">
                  Mesaj Gönder
                </Button>
              </div>
            </Card>
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
              <p className="text-gray-400 mb-4">Profesyonel UV etiket çözümleri için güvenilir adresiniz.</p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 border-green-600 text-white"
                  onClick={() => window.open('https://wa.me/905551234567?text=Merhaba,%20UV%20etiket%20hakkında%20bilgi%20almak%20istiyorum', '_blank')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ürünler</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#products" className="hover:text-white transition-colors">UV Etiketler</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Metalik Baskı</a></li>
                <li><a href="#order-form" className="hover:text-white transition-colors">Özel Tasarım</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Özellikler</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gizlilik</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +90 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@baecuvetiket.com
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  İstanbul, Türkiye
                </li>
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
