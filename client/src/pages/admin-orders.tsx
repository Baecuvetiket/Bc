import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

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
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

const statusOptions = [
  'pending',
  'processing',
  'completed',
  'cancelled',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = () => {
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Durum güncellenemedi');
      toast({ title: 'Sipariş durumu güncellendi' });
      fetchOrders();
    } catch (e) {
      toast({ title: 'Hata', description: 'Durum güncellenemedi', variant: 'destructive' });
    }
  };

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tüm Siparişler</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center text-gray-500">Hiç sipariş yok.</div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order.id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Sipariş #{order.id}</div>
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-gray-600">Adet: {order.quantity} | Tutar: ₺{Number(order.total).toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mb-1">Durum: 
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className="ml-2 border rounded px-2 py-1 text-xs"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-gray-500">Müşteri: {order.customerName || '-'} | {order.customerEmail || '-'} | {order.customerPhone || '-'}</div>
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