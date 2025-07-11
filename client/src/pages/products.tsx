import { ProductShowcase } from "@/components/ui/product-showcase";
import { CategoryCalculator } from "@/components/ui/category-calculator";
import { EnterpriseHeader } from "@/components/ui/enterprise-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tag, 
  Shield, 
  Droplets, 
  Star, 
  Check, 
  Zap,
  Calculator,
  Ruler,
  Package,
  Award
} from "lucide-react";
import baecLogo from '@assets/BAEC-LOGO_1752068685082.gif';

const products = [
  {
    id: 1,
    name: "Opak Etiket",
    price: 50,
    image: "🏷️",
    category: "Opak",
    rating: 5,
    reviews: 12,
    features: ["Opak Yüzey", "Mat Finish", "Yazı Dostu"],
    description: "Mat ve kalın yapıda, üzerine yazılan her şey net görünür. UV dayanıklı ve su geçirmez özellikler.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Şeffaf Etiket",
    price: 50,
    image: "🔍",
    category: "Şeffaf",
    rating: 4,
    reviews: 8,
    features: ["Şeffaf Yüzey", "Arka Plan Görünür", "Profesyonel"],
    description: "Şeffaf yapıda, arka plan görünür kalır. Premium görünüm için ideal seçim.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Kuşe Etiket",
    price: 50,
    image: "✨",
    category: "Kuşe",
    rating: 5,
    reviews: 15,
    features: ["Parlak Yüzey", "Canlı Renkler", "Pürüzsüz"],
    description: "Parlak ve pürüzsüz yüzey, canlı renkler. Göz alıcı tasarımlar için mükemmel.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: 4,
    name: "Soft Touch Etiket",
    price: 50,
    image: "🌟",
    category: "Soft Touch",
    rating: 5,
    reviews: 10,
    features: ["Soft Touch", "Premium Hiss", "Lüks Görünüm"],
    description: "Yumuşak dokunuş hissi, premium görünüm. Lüks ürünler için özel tasarım.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const features = [
  {
    icon: Shield,
    title: "UV Dayanıklı",
    description: "Güneş ışığına karşı dayanıklı, renk solması olmaz",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Droplets,
    title: "Su Geçirmez",
    description: "Yağmur ve neme karşı koruma, uzun ömürlü",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: Ruler,
    title: "32x45 Tabaka",
    description: "Standart tabaka boyutu, optimize edilmiş kesim",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Calculator,
    title: "Otomatik Hesaplama",
    description: "Anında fiyat hesaplama, kolay sipariş süreci",
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <EnterpriseHeader />

      {/* Hero Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <img src={baecLogo} alt="BAEC UV Etiket" className="h-20 w-20 object-contain mr-6" />
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  UV Etiket Çeşitleri
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Profesyonel kalite, otomatik fiyat hesaplama
                </p>
              </div>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              32x45 cm tabaka boyutunda, dört farklı etiket çeşidi ile ihtiyacınıza uygun çözümler. 
              Her ürün için otomatik fiyat hesaplama aracı ile anında teklif alın.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Etiket Çeşitleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Her etiket çeşidinin altında otomatik fiyat hesaplama aracı bulunmaktadır. 
              Ölçü ve adet bilgilerinizi girerek anında fiyat alabilirsiniz.
            </p>
          </div>

          <ProductShowcase title="" products={products} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-lg text-gray-600">
              3 basit adımda fiyatınızı öğrenin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ölçü Girin</h3>
              <p className="text-gray-600">Etiketinizin genişlik ve yükseklik ölçülerini milimetre cinsinden girin</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Adet Belirleyin</h3>
              <p className="text-gray-600">İhtiyacınız olan etiket adedini girin</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fiyat Alın</h3>
              <p className="text-gray-600">Otomatik hesaplama ile anında fiyatınızı öğrenin</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Hemen Sipariş Verin
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Fiyatınızı öğrendikten sonra ana sayfadaki sipariş formunu kullanarak hemen sipariş verebilirsiniz.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.location.href = '/'}
          >
            <Package className="w-5 h-5 mr-2" />
            Ana Sayfaya Git
          </Button>
        </div>
      </section>
    </div>
  );
} 