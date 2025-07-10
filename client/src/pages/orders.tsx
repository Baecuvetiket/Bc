import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Order {
  id: number;
  printType: string;
  metallicColor?: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  discount: string;
  total: string;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Siparişlerim</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center text-gray-500">Hiç siparişiniz yok.</div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order.id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Sipariş #{order.id}</div>
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-gray-600">Adet: {order.quantity} | Tutar: ₺{Number(order.total).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Durum: {order.status}</div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 