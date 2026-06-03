"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface ShowcaseGalleryProps {
  images: string[];
  title: string;
}

export default function ShowcaseGallery({ images, title }: ShowcaseGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation & Autoplay
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  useEffect(() => {
    if (isHovered || isLightboxOpen || images.length <= 1) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [isHovered, isLightboxOpen, images.length, handleNext]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[activeIndex] as HTMLElement;
      if (activeThumb) {
        const container = thumbnailsRef.current;
        const scrollLeft = activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="w-full space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Large Hero Image */}
      <div 
        className="relative w-full aspect-video md:aspect-[21/9] lg:aspect-[2.5/1] overflow-hidden rounded-2xl bg-surface-container-highest cursor-pointer group shadow-md"
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={images[activeIndex]}
          alt={`${title} - Image ${activeIndex + 1}`}
          fill
          unoptimized
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Counter */}
        <div className="absolute top-4 right-4 bg-black/60 text-white backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold shadow-lg z-10 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">photo_library</span>
          Image {activeIndex + 1} of {images.length}
        </div>

        {/* Expand Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white">
            <span className="material-symbols-outlined text-4xl">fullscreen</span>
          </div>
        </div>
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="relative group/carousel">
          <div 
            ref={thumbnailsRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar py-2 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex-shrink-0 snap-center overflow-hidden rounded-xl transition-all duration-300 w-24 h-24 sm:w-32 sm:h-24 md:w-40 md:h-28
                  ${activeIndex === idx 
                    ? 'ring-4 ring-primary scale-105 opacity-100 shadow-md z-10' 
                    : 'opacity-60 hover:opacity-100 hover:scale-105 blur-[1px] hover:blur-none grayscale-[20%]'
                  }
                `}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          
          {/* Scroll fade masks */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-surface to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent pointer-events-none z-10" />
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm touch-none">
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-50">
            <h3 className="text-white text-xl font-bold max-w-2xl truncate">{title}</h3>
            <div className="flex items-center gap-6">
              <span className="text-white/80 font-medium">Image {activeIndex + 1} of {images.length}</span>
              <button 
                onClick={() => setIsLightboxOpen(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                title="Close (Esc)"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
          </div>

          {/* Previous Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 z-50"
            title="Previous (Arrow Left)"
          >
            <span className="material-symbols-outlined text-3xl">chevron_left</span>
          </button>

          {/* Main Lightbox Image */}
          <div 
            className="relative w-full h-full max-w-7xl max-h-[85vh] mx-auto px-4 sm:px-16"
            onClick={() => setIsLightboxOpen(false)}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} - Image ${activeIndex + 1}`}
              fill
              unoptimized
              className="object-contain"
            />
          </div>

          {/* Next Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 z-50"
            title="Next (Arrow Right)"
          >
            <span className="material-symbols-outlined text-3xl">chevron_right</span>
          </button>

        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
