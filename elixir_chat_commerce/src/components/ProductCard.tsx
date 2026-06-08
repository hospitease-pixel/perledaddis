import React from 'react';
import { Product } from '@/lib/storage';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onAddToBag: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToBag }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="aspect-[3/4] overflow-hidden bg-luxury-cream mb-4 relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        <button 
          onClick={() => onAddToBag(product)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-luxury-black py-3 px-8 text-xs tracking-[0.2em] uppercase font-sans opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-luxury-black hover:text-white"
        >
          Add to Bag
        </button>
      </div>
      <div className="text-center space-y-1">
        <p className="text-[10px] tracking-widest uppercase text-luxury-black/40 font-sans">{product.brand}</p>
        <h3 className="font-serif text-lg text-luxury-black">{product.name}</h3>
        <p className="text-xs text-luxury-black/60 font-sans italic">{product.size}</p>
        <p className="text-sm font-sans font-medium mt-2">{product.price.toLocaleString()} ETB</p>
      </div>
    </motion.div>
  );
};
