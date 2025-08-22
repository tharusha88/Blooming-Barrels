import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const HeroCarousel = forwardRef(({ slides = [], interval = 5000 }, ref) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, interval]);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useImperativeHandle(ref, () => ({
    goToNext,
    goToPrevious,
    goToSlide,
    currentSlide
  }));

  if (!slides.length) return null;

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => {
        let slideClass = 'carousel-slide';
        if (index === currentSlide) {
          slideClass += ' active';
        } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
          slideClass += ' prev';
        }
        return (
          <div
            key={index}
            className={slideClass}
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <div className="slide-content">
              <img src={slide.image} alt={slide.alt} />
            </div>
          </div>
        );
      })}
      {/* Carousel indicators removed as per user request */}
    </div>
  );
});

export default HeroCarousel;
