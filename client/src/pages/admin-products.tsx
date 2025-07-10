import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  category?: string;
  stock?: number;
}

const emptyForm = { name: '', description: '', price: '', imageUrl: '', category: '', stock: 0 };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProducts = () => {
    fetch('/api/products')
      .then((res) => res.json())
      .then(setProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('İşlem başarısız');
      toast({ title: editingId ? 'Ürün güncellendi' : 'Ürün eklendi' });
      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();
    } catch (e) {
      toast({ title: 'Hata', description: 'İşlem sırasında hata oluştu', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setEditingId(product.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Silinemedi');
      toast({ title: 'Ürün silindi' });
      fetchProducts();
    } catch (e) {
      toast({ title: 'Hata', description: 'Silme sırasında hata oluştu', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div>
              <Label>Ürün Adı</Label>
              <Input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label>Kategori</Label>
              <Input name="category" value={form.category} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <Label>Açıklama</Label>
              <Input name="description" value={form.description} onChange={handleChange} />
            </div>
            <div>
              <Label>Fiyat</Label>
              <Input name="price" type="number" value={form.price} onChange={handleChange} required />
            </div>
            <div>
              <Label>Stok</Label>
              <Input name="stock" type="number" value={form.stock} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <Label>Görsel URL</Label>
              <Input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
            </div>
            <div className="md:col-span-2 flex gap-2 mt-2">
              <Button type="submit" disabled={loading}>
                {editingId ? 'Güncelle' : 'Ekle'}
              </Button>
              {editingId && (
                <Button type="button" variant="secondary" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
                  Vazgeç
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ürünler</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center text-gray-500">Hiç ürün yok.</div>
          ) : (
            <div className="divide-y">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 py-4">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-gray-500">₺{Number(product.price).toFixed(2)}</div>
                    <div className="text-xs text-gray-400">Kategori: {product.category || '-'}</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                    Düzenle
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                    Sil
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 