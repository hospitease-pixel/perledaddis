import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/storage';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit2, Trash2, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface AdminPanelProps {
  onDataChange: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onDataChange }) => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadAdminProducts();
    }
  }, [session]);

  const loadAdminProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed in successfully.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out.');
      setProducts([]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const productData = {
      brand: formData.get('brand') as string,
      name: formData.get('name') as string,
      size: formData.get('size') as string,
      category: formData.get('category') as any,
      price: Number(formData.get('price')),
      imageUrl: formData.get('imageUrl') as string,
    };

    if (editingProduct?.id) {
      const success = await updateProduct({ ...productData, id: editingProduct.id } as Product);
      if (success) toast.success('Product updated.');
    } else {
      const data = await addProduct(productData);
      if (data) toast.success('Product added.');
    }

    setEditingProduct(null);
    await loadAdminProducts();
    onDataChange();
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this masterpiece?')) {
      const success = await deleteProduct(id);
      if (success) {
        await loadAdminProducts();
        onDataChange();
        toast.success('Product removed.');
      }
    }
  };

  if (!session) {
    return (
      <DialogContent className="sm:max-w-md bg-white border-luxury-cream">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">Admin Boutique Access</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@laperle.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-none border-luxury-cream focus:border-luxury-black"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none border-luxury-cream focus:border-luxury-black"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-luxury-black hover:bg-luxury-black/90 text-white rounded-none">
            {loading ? 'Authenticating...' : <><LogIn className="mr-2 h-4 w-4" /> Sign In</>}
          </Button>
          <p className="text-[10px] text-center text-luxury-black/40 italic">
            Authorized personnel only.
          </p>
        </form>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-luxury-cream p-4 sm:p-6">
      <DialogHeader className="flex flex-row items-center justify-between mb-8">
        <DialogTitle className="font-serif text-3xl">Boutique Management</DialogTitle>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-luxury-black/60 hover:text-luxury-black">
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </DialogHeader>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-sm tracking-[0.2em] uppercase font-sans font-semibold border-b border-luxury-cream pb-2">
            {editingProduct ? 'Edit Masterpiece' : 'Add New Masterpiece'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input name="brand" defaultValue={editingProduct?.brand} required className="rounded-none" />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input name="name" defaultValue={editingProduct?.name} required className="rounded-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size</Label>
                <Input name="size" defaultValue={editingProduct?.size} placeholder="100ml" required className="rounded-none" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select name="category" defaultValue={editingProduct?.category || 'Unisex'}>
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="For Her">For Her</SelectItem>
                    <SelectItem value="For Him">For Him</SelectItem>
                    <SelectItem value="Unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Price (ETB)</Label>
              <Input name="price" type="number" defaultValue={editingProduct?.price} required className="rounded-none" />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input name="imageUrl" defaultValue={editingProduct?.imageUrl} required className="rounded-none" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1 bg-luxury-black hover:bg-luxury-black/90 text-white rounded-none">
                {editingProduct ? 'Update Masterpiece' : 'Save to Storefront'}
              </Button>
              {editingProduct && (
                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)} className="rounded-none">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <h3 className="text-sm tracking-[0.2em] uppercase font-sans font-semibold border-b border-luxury-cream pb-2">
            Existing Inventory
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-luxury-cream rounded-sm overflow-hidden">
                        <img src={p.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold">{p.name}</p>
                        <p className="text-luxury-black/40">{p.brand}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{p.price.toLocaleString()} ETB</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditingProduct(p)} className="h-8 w-8">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="h-8 w-8 text-destructive">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DialogContent>
  );
};
