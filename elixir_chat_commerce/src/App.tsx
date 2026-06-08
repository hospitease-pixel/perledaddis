import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
import { CartProvider, useCart } from '@/lib/cart-context';
import { getProducts, Product } from '@/lib/storage';
import { AdminPanel } from '@/components/AdminPanel';
import { Dialog } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

const Storefront = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { cart, addToCart } = useCart();

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();

    let ctrlMPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        ctrlMPressed = true;
      } else if (ctrlMPressed && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsAdminOpen(true);
        ctrlMPressed = false;
      } else {
        ctrlMPressed = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white text-luxury-black font-sans selection:bg-luxury-gold selection:text-white">
      <Header cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-luxury-cream">
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/bc34a39a-0009-4c4e-86b1-8d93f82dc86f/luxury-perfume-1-00f33e42-1780897334878.webp" 
              alt="Hero" 
              className="w-full h-full object-cover opacity-60"
            />
          </motion.div>
          
          <div className="relative z-10 text-center space-y-8 px-4">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-[10px] md:text-xs tracking-[0.5em] uppercase font-sans text-luxury-black/60"
            >
              Exquisite Fragrances from Addis Ababa
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-5xl md:text-8xl font-serif tracking-tight leading-none"
            >
              The Art of <br /> <span className="italic">Silent Luxury</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <button 
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-8 border border-luxury-black py-4 px-12 text-[10px] tracking-[0.4em] uppercase hover:bg-luxury-black hover:text-white transition-all duration-500"
              >
                Discover Collection
              </button>
            </motion.div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-[1px] h-12 bg-luxury-black/20" />
          </div>
        </section>

        {/* Collection Section */}
        <div id="collection">
          <ProductGrid products={products} onAddToBag={addToCart} />
        </div>

        {/* Footer */}
        <footer className="py-20 border-t border-luxury-cream">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl tracking-widest">LA PERLE</h3>
              <p className="text-xs text-luxury-black/40 leading-relaxed font-sans max-w-xs mx-auto md:mx-0">
                Crafting the most exclusive scents in the heart of Ethiopia. Every bottle tells a story of elegance and tradition.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold">Client Care</h4>
              <ul className="text-xs space-y-3 text-luxury-black/60 font-sans">
                <li><a href="#" className="hover:text-luxury-black transition-colors">Shipping & Delivery</a></li>
                <li><a href="#" className="hover:text-luxury-black transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-luxury-black transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold">Boutique</h4>
              <p className="text-xs text-luxury-black/60 font-sans">
                Bole, Addis Ababa, Ethiopia<br />
                Mon — Sat, 10am — 8pm
              </p>
            </div>
          </div>
          <div className="mt-20 text-center">
            <p className="text-[10px] tracking-widest uppercase text-luxury-black/20 font-sans">
              &copy; {new Date().getFullYear()} LA PERLE d’ADDIS. All Rights Reserved.
            </p>
          </div>
        </footer>
      </main>

      <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
        <AdminPanel onDataChange={loadProducts} />
      </Dialog>
      
      <Toaster position="top-center" />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Storefront />
    </CartProvider>
  );
}

export default App;
