import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  category?: string;
  stock?: number;
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [match, params] = useRoute('/products/:id');
  const productId = params?.id;
  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
  if (!product) return <div className="p-8 text-center">Ürün bulunamadı.</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-t" />
        )}
        <CardHeader>
          <CardTitle className="text-2xl">{product.name}</CardTitle>
          {product.category && <Badge>{product.category}</Badge>}
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-gray-700 text-base">{product.description}</div>
          <Separator className="my-2" />
          <div className="text-xl font-bold text-primary mb-2">₺{Number(product.price).toFixed(2)}</div>
          {typeof product.stock === 'number' && (
            <div className="text-sm text-gray-500">Stok: {product.stock}</div>
          )}
          <Button className="mt-4 w-full" onClick={() => addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl
          })}>
            Sepete Ekle
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 