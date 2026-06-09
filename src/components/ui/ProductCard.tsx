import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, price, image, category }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-borderColor/60 shadow-premium hover:shadow-premium-hover transition-all duration-300 transform hover:-translate-y-1.5 group flex flex-col premium-card-gradient">
      {/* Image Container with zoom */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-textColor-secondary shadow-sm uppercase tracking-wider border border-white/20">
          {category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base font-heading font-extrabold text-textColor-primary group-hover:text-primary transition-colors duration-200 line-clamp-1 leading-snug mb-1">
            {title}
          </h3>
          <p className="text-[11px] text-textColor-secondary">Standard edition licensing</p>
        </div>
        
        <div className="flex justify-between items-center mt-5 pt-3 border-t border-borderColor/40">
          <span className="text-xl font-mono font-extrabold text-primary">${price}</span>
          <button className="h-9 px-4 rounded-xl bg-textColor-primary hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm">
            <ShoppingCart size={14} /> Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
