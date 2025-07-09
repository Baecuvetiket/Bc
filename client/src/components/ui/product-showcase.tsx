import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  features: string[];
}

interface ProductShowcaseProps {
  title: string;
  products: Product[];
  onProductClick?: (product: Product) => void;
}

export function ProductShowcase({ title, products, onProductClick }: ProductShowcaseProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
            onClick={() => onProductClick?.(product)}
          >
            {product.badge && (
              <Badge 
                className="absolute top-2 left-2 z-10 bg-accent text-accent-foreground"
                variant="secondary"
              >
                {product.badge}
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
            >
              <Heart className="h-4 w-4" />
            </Button>
            
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-6xl text-gray-400">
                {product.image}
              </div>
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < product.rating 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">
                      ₺{product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₺{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center">
                      <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <div className="p-4 pt-0">
              <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Sepete Ekle
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}