import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface CarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (!autoPlay) return;

    const slideInterval = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(slideInterval);
  }, [currentIndex, autoPlay, interval]);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 relative group">
      {/* Frame wrapper */}
      <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-premium border border-borderColor/60 bg-slate-900">
        
        {/* Slides */}
        <div 
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
          className="w-full h-full bg-center bg-cover duration-500 transition-all transform scale-100 group-hover:scale-[1.01]"
        >
          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </div>
        
        {/* Left Arrow (Glassmorphism) */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 active:scale-90"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        
        {/* Right Arrow (Glassmorphism) */}
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 active:scale-90"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Caption Overlay */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-[11px] font-semibold">
          <ImageIcon size={14} className="text-primary-light" />
          <span>Slide {currentIndex + 1} of {images.length}</span>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center py-4 space-x-2.5">
        {images.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === slideIndex 
                ? 'w-6 bg-primary shadow-sm' 
                : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
