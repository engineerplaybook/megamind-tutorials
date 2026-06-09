import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  ctaText,
  onCtaClick,
  backgroundImage = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'
}) => {
  return (
    <div 
      className="relative h-[400px] w-full flex items-center justify-center bg-cover bg-center text-white overflow-hidden rounded-2xl shadow-premium my-6 group"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dynamic Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent transition-opacity duration-300" />
      
      {/* Premium Glassmorphic Card Container */}
      <div className="relative z-10 text-center px-6 py-10 max-w-2xl mx-auto glass-panel-dark rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up">
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-4 tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-sm md:text-base mb-8 text-slate-300 leading-relaxed font-light">
          {subtitle}
        </p>
        <button
          onClick={onCtaClick}
          className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-primary-light hover:text-primary font-bold text-xs md:text-sm py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95 group/btn"
        >
          {ctaText}
          <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
