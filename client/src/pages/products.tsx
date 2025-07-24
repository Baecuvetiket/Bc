import { ProductShowcase } from "@/components/ui/product-showcase";
import { CategoryCalculator } from "@/components/ui/category-calculator";
import { EnterpriseHeader } from "@/components/ui/enterprise-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Droplets,
  Ruler,
  Calculator,
  Sparkles,
  Star,
  Check,
  Zap,
  Users,
  Clock,
  Package,
  TrendingUp,
  Award,
  Heart,
  ArrowRight,
  Target,
  Info,
  Smile,
  ThumbsUp,
  Truck
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
    features: [
      { text: "Opak Yüzey", icon: Shield },
      { text: "Mat Finish", icon: Droplets },
      { text: "Yazı Dostu", icon: Ruler }
    ],
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
    features: [
      { text: "Şeffaf Yüzey", icon: Droplets },
      { text: "Arka Plan Görünür", icon: Info },
      { text: "Profesyonel", icon: Star }
    ],
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
    features: [
      { text: "Parlak Yüzey", icon: Sparkles },
      { text: "Canlı Renkler", icon: Star },
      { text: "Pürüzsüz", icon: Ruler }
    ],
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
    features: [
      { text: "Soft Touch", icon: Heart },
      { text: "Premium Hiss", icon: Smile },
      { text: "Lüks Görünüm", icon: ThumbsUp }
    ],
    description: "Yumuşak dokunuş hissi, premium görünüm. Lüks ürünler için özel tasarım.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const advantages = [
  {
    icon: Award,
    title: "Kalite Garantisi",
    desc: "Tüm ürünlerimizde yüksek kalite ve uzun ömür garantisi."
  },
  {
    icon: Heart,
    title: "Müşteri Memnuniyeti",
    desc: "%99 müşteri memnuniyeti ve 7/24 destek."
  },
  {
    icon: TrendingUp,
    title: "Hızlı Teslimat",
    desc: "Siparişleriniz 2-3 iş günü içinde kapınızda."
  },
  {
    icon: Zap,
    title: "Anında Fiyat",
    desc: "Otomatik hesaplama ile anında fiyat öğrenin."
  },
];

const testimonials = [
  {
    name: "Ahmet Yılmaz",
    text: "Gerçekten çok kaliteli ve hızlı teslimat. Fiyat hesaplama aracı çok pratik!",
    avatar: "A",
    company: "Yılmaz Ajans"
  },
  {
    name: "Elif Kaya",
    text: "Etiketler tam istediğim gibi geldi, müşteri hizmetleri harika!",
    avatar: "E",
    company: "Kaya Reklam"
  },
  {
    name: "Murat Demir",
    text: "Sipariş süreci çok kolay ve fiyatlar çok uygun. Herkese tavsiye ederim.",
    avatar: "M",
    company: "Demir Matbaa"
  }
];

const faqs = [
  {
    q: "Siparişlerim ne kadar sürede teslim edilir?",
    a: "Genellikle 2-3 iş günü içinde kargoya veriyoruz."
  },
  {
    q: "Minimum sipariş adedi nedir?",
    a: "Tüm ürünlerde minimum 100 adet sipariş verebilirsiniz."
  },
  {
    q: "Fiyatlar sabit mi?",
    a: "Evet, tabaka başı fiyatlarımız sabittir. Hesaplama aracı ile toplam tutarı görebilirsiniz."
  },
  {
    q: "Tasarım dosyası göndermek zorunda mıyım?",
    a: "Sipariş sırasında tasarım dosyanızı yüklemeniz gerekmektedir."
  }
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* <EnterpriseHeader /> */}
      {/* Üst Başlık */}
      {/* <section className="py-14 bg-gradient-to-br from-white via-blue-50 to-blue-100 border-b border-gray-200 relative"> */}
      {/*   <div className="container mx-auto px-4"> */}
      {/*     <div className="text-center mb-8"> */}
      {/*       <div className="flex items-center justify-center gap-4 mb-4"> */}
      {/*         <img src={baecLogo} alt="BAEC UV Etiket" className="h-12 w-12 object-contain" /> */}
      {/*         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"> */}
      {/*           Ürün Kategorilerimiz */}
      {/*         </h1> */}
      {/*         <Shield className="w-8 h-8 text-blue-600" /> */}
      {/*       </div> */}
      {/*       <div className="w-24 h-1 bg-blue-600 rounded-full mx-auto mb-4"></div> */}
      {/*       <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2"> */}
      {/*         BAEC UV Etiket olarak, dört ana kategoride yüksek kalite ve güvenilirlik sunuyoruz.<br/> */}
      {/*         <span className="text-blue-700 font-semibold">Kurumsal çözümler, hızlı üretim, şeffaf fiyatlandırma.</span> */}
      {/*       </p> */}
      {/*       <div className="flex items-center justify-center gap-6 text-sm text-gray-500"> */}
      {/*         <div className="flex items-center gap-2"> */}
      {/*           <Shield className="w-4 h-4 text-green-600" /> */}
      {/*           <span>ISO 9001 Kalite Belgesi</span> */}
      {/*         </div> */}
      {/*         <div className="flex items-center gap-2"> */}
      {/*           <Truck className="w-4 h-4 text-blue-600" /> */}
      {/*           <span>2-3 İş Günü Teslimat</span> */}
      {/*         </div> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </section> */}

      {/* Avantajlar Bölümü */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, i) => (
              <Card key={i} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <adv.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{adv.title}</h3>
                  <p className="text-gray-600 text-sm">{adv.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ürünler Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <Card key={product.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-blue-100 hover:border-blue-300 transition-all duration-300 group flex flex-col h-full overflow-hidden relative">
                {/* Premium Etiketi */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                    Premium
                  </div>
                </div>
                
                {/* Kategoriye özel üst şerit */}
                <div className={`h-2 w-full ${product.gradient}`}></div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                <CardContent className="flex flex-col items-center text-center p-8 flex-1 relative z-10">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg border-2 border-blue-50 ${product.gradient} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                    {product.image}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                    {product.name}
                  </h2>
                  {product.name === 'Opak Etiket' && (
                    <span className="inline-flex items-center gap-1 text-xs text-white bg-blue-600 rounded-full px-3 py-1 font-semibold mb-2 shadow-sm">
                      <Star className="w-3 h-3" />
                      En çok tercih edilen
                    </span>
                  )}
                  <div className="flex flex-wrap gap-2 justify-center mb-3">
                    {product.features.map((f, i) => (
                      <Badge key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 flex items-center">
                        <f.icon className="w-3 h-3 mr-1" /> {f.text}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-gray-700 text-base mb-6 font-medium min-h-[56px] leading-relaxed">{product.description}</p>
                  
                  <div className="w-full mt-auto">
                    <div className="rounded-xl border border-blue-50 bg-blue-50/60 p-4 mb-3">
                      <CategoryCalculator categoryName={product.name} sheetPrice={product.price} />
                      <div className="text-xs text-gray-400 text-center mt-2">Fiyatlar KDV dahil, tabaka başı fiyatlandırma</div>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors shadow-none hover:shadow-md">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Sepete Ekle
                    </Button>
                    <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 text-sm py-1 rounded-lg transition-colors">
                      <Info className="w-3 h-3 mr-1" />
                      Detaylı Bilgi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Müşteri Yorumları */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Müşteri Yorumları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-lg font-bold text-white mb-4 mx-auto">
                  {t.avatar}
                </div>
                <p className="text-gray-700 text-center mb-4 text-sm">"{t.text}"</p>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="py-16 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shine">Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl shadow-md p-6 cursor-pointer animate-fade-in">
                <summary className="font-bold text-blue-700 flex items-center gap-2 text-lg group-open:text-purple-700 transition-colors">
                  <Info className="w-5 h-5" /> {faq.q}
                </summary>
                <div className="mt-2 text-gray-700 text-base">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight animate-fade-in">
            Hemen Sipariş Verin
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto animate-fade-in">
            Fiyatınızı öğrendikten sonra ana sayfadaki sipariş formunu kullanarak hemen sipariş verebilirsiniz. Profesyonel kalite ve hızlı teslimat garantisi ile hizmetinizdeyiz.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-700 hover:bg-gray-100 font-black text-lg px-10 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 animate-fade-in"
            onClick={() => window.location.href = '/'}
          >
            <Package className="w-6 h-6 mr-3 animate-bounce-right" />
            Ana Sayfaya Git
          </Button>
        </div>
      </section>
    </div>
  );
}

