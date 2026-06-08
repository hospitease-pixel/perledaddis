import React from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingBagSheet } from './ShoppingBag';

interface HeaderProps {
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-luxury-cream">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="text-xl md:text-2xl font-serif tracking-[0.2em] font-medium text-luxury-black">
            LA PERLE d’ADDIS
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-luxury-black/60 font-sans">
            <a href="#" className="hover:text-luxury-black transition-colors">Collection</a>
            <a href="#" className="hover:text-luxury-black transition-colors">For Her</a>
            <a href="#" className="hover:text-luxury-black transition-colors">For Him</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="relative group p-2">
                <ShoppingBag size={20} className="text-luxury-black group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-luxury-black text-white text-[10px] flex items-center justify-center rounded-full font-sans">
                    {cartCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <ShoppingBagSheet />
          </Sheet>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-luxury-cream p-6 flex flex-col gap-6 text-xs tracking-widest uppercase font-sans animate-in slide-in-from-top duration-300">
          <a href="#" onClick={() => setIsMenuOpen(false)}>Collection</a>
          <a href="#" onClick={() => setIsMenuOpen(false)}>For Her</a>
          <a href="#" onClick={() => setIsMenuOpen(false)}>For Him</a>
        </div>
      )}
    </header>
  );
};
