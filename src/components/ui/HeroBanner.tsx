import React from 'react';

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
      className="relative h-[500px] w-full flex items-center justify-center bg-cover bg-center text-white overflow-hidden rounded-xl shadow-2xl my-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          {subtitle}
        </p>
        <button
          onClick={onCtaClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
