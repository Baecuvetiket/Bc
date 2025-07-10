import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  category?: string;
  stock?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Ürünler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="block">
            <Card className="flex flex-col h-full">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-t" />
              )}
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                {product.category && <Badge>{product.category}</Badge>}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="mb-2 text-gray-700 text-sm min-h-[48px]">{product.description}</div>
                <Separator className="my-2" />
                <div className="text-lg font-bold text-primary">₺{Number(product.price).toFixed(2)}</div>
                {typeof product.stock === 'number' && (
                  <div className="text-xs text-gray-500 mt-1">Stok: {product.stock}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 