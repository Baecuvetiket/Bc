import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonAction: () => void;
  gradient: string;
}

interface CarouselBannerProps {
  slides: BannerSlide[];
}

export function CarouselBanner({ slides }: CarouselBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide
              ? 'translate-x-0'
              : index < currentSlide
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          <div
            className={`w-full h-full bg-gradient-to-br ${slide.gradient} flex items-center justify-between text-white p-8`}
          >
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">{slide.title}</h2>
              <p className="text-xl md:text-2xl text-white/90">{slide.subtitle}</p>
              <p className="text-white/80">{slide.description}</p>
              <Button
                onClick={slide.buttonAction}
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                {slide.buttonText}
              </Button>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <div className="text-8xl opacity-20">{slide.image}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 border-white/20 hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4 text-white" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 border-white/20 hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4 text-white" />
      </Button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
