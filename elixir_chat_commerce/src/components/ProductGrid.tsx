import React from 'react';
import { Product } from '@/lib/storage';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToBag: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToBag }) => {
  const [filter, setFilter] = React.useState<'All' | 'For Her' | 'For Him'>('All');

  const filteredProducts = products.filter(p => {
    if (filter === 'All') return true;
    return p.category === filter;
  });

  const categories: ('All' | 'For Her' | 'For Him')[] = ['All', 'For Her', 'For Him'];

  return (
    <section className="py-20 container mx-auto px-4">
      <div className="flex flex-col items-center mb-16 space-y-8">
        <h2 className="text-3xl md:text-4xl font-serif text-luxury-black text-center tracking-tight">The Curated Collection</h2>
        <div className="flex gap-8 border-b border-luxury-cream pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs tracking-widest uppercase font-sans transition-all relative pb-2 ${
                filter === cat ? 'text-luxury-black' : 'text-luxury-black/30 hover:text-luxury-black'
              }`}
            >
              {cat}
              {filter === cat && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-black animate-in fade-in duration-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToBag={onAddToBag}
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center text-luxury-black/40 font-serif italic">
          No masterpieces found in this category.
        </div>
      )}
    </section>
  );
};
