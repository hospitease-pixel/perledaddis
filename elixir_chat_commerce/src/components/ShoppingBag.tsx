import React from 'react';
import { X, Plus, Minus, Send } from 'lucide-react';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { saveOrder } from '@/lib/storage';

export const ShoppingBagSheet: React.FC = () => {
  const { cart, updateQuantity, total, clearCart } = useCart();
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    neighborhood: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCheckout = async () => {
    if (!formData.name || !formData.phone || !formData.neighborhood) {
      toast.error('Please fill in all delivery details.');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your bag is empty.');
      return;
    }

    setIsSubmitting(true);

    // Save order record to Supabase
    const saved = await saveOrder({
      clientName: formData.name,
      phone: formData.phone,
      neighborhood: formData.neighborhood,
      items: cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity })),
      total: total
    });

    if (!saved) {
      setIsSubmitting(false);
      return;
    }

    const itemsText = cart.map(item => `${item.name} (${item.brand}) x ${item.quantity}`).join(', ');
    const message = `*LA PERLE d’ADDIS - New Order*

` +
      `*Client:* ${formData.name}
` +
      `*Phone:* ${formData.phone}
` +
      `*Delivery:* ${formData.neighborhood}

` +
      `*Items:* ${itemsText}
` +
      `*Total:* ${total.toLocaleString()} ETB

` +
      `Payment: Cash/Telebirr on delivery.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/251911223344?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Order recorded. Redirecting to WhatsApp...');
    clearCart();
    setIsSubmitting(false);
  };

  return (
    <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-white border-l border-luxury-cream p-0">
      <SheetHeader className="p-6 border-b border-luxury-cream">
        <SheetTitle className="font-serif text-2xl text-center tracking-tight">Your Shopping Bag</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center">
              <X size={24} className="text-luxury-black/20" />
            </div>
            <p className="font-serif italic text-luxury-black/40">Your bag is currently empty.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              <div className="w-20 h-24 bg-luxury-cream overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h4 className="font-serif text-sm text-luxury-black">{item.name}</h4>
                  <p className="text-[10px] tracking-widest uppercase text-luxury-black/40 font-sans">{item.brand}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-luxury-cream rounded-sm">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-luxury-cream transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-sans">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-luxury-cream transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="text-xs font-sans font-medium">{(item.price * item.quantity).toLocaleString()} ETB</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-6 border-t border-luxury-cream space-y-6 bg-luxury-cream/30">
          <div className="space-y-4">
            <h5 className="text-[10px] tracking-[0.2em] uppercase font-sans text-luxury-black/60">Delivery Details</h5>
            <Input 
              placeholder="Full Name" 
              className="bg-white border-luxury-cream focus:border-luxury-black rounded-none h-12 text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input 
              placeholder="Phone Number (09...)" 
              className="bg-white border-luxury-cream focus:border-luxury-black rounded-none h-12 text-sm"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Select 
              value={formData.neighborhood}
              onValueChange={(val) => setFormData({ ...formData, neighborhood: val })}
            >
              <SelectTrigger className="bg-white border-luxury-cream focus:border-luxury-black rounded-none h-12 text-sm">
                <SelectValue placeholder="Delivery Neighborhood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bole">Bole</SelectItem>
                <SelectItem value="Kazanchis">Kazanchis</SelectItem>
                <SelectItem value="Old Airport">Old Airport</SelectItem>
                <SelectItem value="Sarbet">Sarbet</SelectItem>
                <SelectItem value="Summit">Summit</SelectItem>
                <SelectItem value="Piassa">Piassa</SelectItem>
                <SelectItem value="CMC">CMC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg">Total</span>
              <span className="font-sans font-bold text-xl">{total.toLocaleString()} ETB</span>
            </div>
            <p className="text-[10px] text-center text-luxury-black/40 italic">
              Payment via Cash, Telebirr, or CBE on delivery.
            </p>
            <Button 
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full bg-luxury-black hover:bg-luxury-black/90 text-white h-14 rounded-none text-xs tracking-[0.3em] uppercase font-sans flex gap-2"
            >
              {isSubmitting ? 'Recording Order...' : <><Send size={16} /> Proceed to WhatsApp</>}
            </Button>
          </div>
        </div>
      )}
    </SheetContent>
  );
};
