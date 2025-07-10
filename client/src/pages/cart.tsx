import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Sepetiniz boş</h2>
        <Link href="/products">
          <Button>Ürünlere Göz At</Button>
        </Link>
      </div>
    );
  }

  const handleOrder = async () => {
    setLoading(true);
    try {
      // Her ürün için ayrı sipariş oluşturulacak (örnek akış)
      for (const item of items) {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            printType: 'normal', // örnek
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
            discount: 0,
            total: item.price * item.quantity,
            fileName: null,
            fileSize: null,
            filePath: null,
            customerName,
            customerEmail,
            customerPhone,
          }),
        });
        if (!res.ok) throw new Error('Sipariş oluşturulamadı');
      }
      toast({ title: 'Siparişiniz alındı!', description: 'Sipariş başarıyla oluşturuldu.' });
      clearCart();
      setCustomerName(''); setCustomerEmail(''); setCustomerPhone('');
    } catch (e) {
      toast({ title: 'Hata', description: 'Sipariş sırasında hata oluştu', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Sepetim</CardTitle>
        </CardHeader>
        <CardContent>
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-b-0">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">₺{item.price.toFixed(2)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</Button>
                  <span>{item.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                </div>
              </div>
              <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>
                Kaldır
              </Button>
            </div>
          ))}
          <Separator className="my-4" />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Toplam:</span>
            <span>₺{total.toFixed(2)}</span>
          </div>
          <Button className="mt-6 w-full" variant="secondary" onClick={clearCart}>
            Sepeti Temizle
          </Button>
          <form className="mt-6 space-y-3" onSubmit={e => { e.preventDefault(); handleOrder(); }}>
            <Label>Ad Soyad</Label>
            <Input value={customerName} onChange={e => setCustomerName(e.target.value)} required />
            <Label>E-posta</Label>
            <Input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required />
            <Label>Telefon</Label>
            <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required />
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Sipariş Veriliyor...' : 'Siparişi Tamamla'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 