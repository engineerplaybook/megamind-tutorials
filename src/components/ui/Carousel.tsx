import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
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
    <div className="max-w-[1400px] h-[600px] w-full m-auto py-8 px-4 relative group">
      <div
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
        className="w-full h-full rounded-2xl bg-center bg-cover duration-500 shadow-2xl"
      ></div>
      
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-all">
        <ChevronLeft onClick={prevSlide} size={30} />
      </div>
      
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-all">
        <ChevronRight onClick={nextSlide} size={30} />
      </div>

      <div className="flex top-4 justify-center py-2 space-x-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`text-2xl cursor-pointer transition-all duration-300 transform hover:scale-125 ${
              currentIndex === slideIndex ? 'text-indigo-600 scale-125' : 'text-gray-400'
            }`}
          >
            •
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
