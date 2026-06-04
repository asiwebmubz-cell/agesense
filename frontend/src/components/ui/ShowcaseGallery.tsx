"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface ShowcaseGalleryProps {
  images: string[];
  title: string;
}

// Cloudinary optimization utility
const getOptimizedUrl = (url: string, width: number, isThumbnail = false) => {
  if (!url) return "";
  if (url.includes("res.cloudinary.com")) {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex !== -1) {
      const insertPos = uploadIndex + 8; // length of "/upload/"
      const params = isThumbnail 
        ? `f_auto,q_auto,w_${width},h_120,c_fill/` 
        : `f_auto,q_auto,w_${width}/`;
      return url.slice(0, insertPos) + params + url.slice(insertPos);
    }
  }
  return url;
};

export default function ShowcaseGallery({ images, title }: ShowcaseGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);

  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const initialTouchDistance = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    setProgress(0);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    setProgress(0);
  }, [images.length]);

  // Autoplay pause handler
  const triggerManualPause = useCallback(() => {
    setIsAutoplayPaused(true);
    setProgress(0);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoplayPaused(false);
    }, 10000); // Resume autoplay after 10 seconds of inactivity
  }, []);

  const handleManualNext = useCallback(() => {
    handleNext();
    triggerManualPause();
  }, [handleNext, triggerManualPause]);

  const handleManualPrev = useCallback(() => {
    handlePrev();
    triggerManualPause();
  }, [handlePrev, triggerManualPause]);

  // Keyboard navigation & Esc/Close listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "ArrowRight") {
        handleManualNext();
      }
      if (e.key === "ArrowLeft") {
        handleManualPrev();
      }
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
        setZoomScale(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handleManualNext, handleManualPrev]);

  // Autoplay loop + Progress Bar synchronization
  useEffect(() => {
    if (isHovered || isLightboxOpen || isAutoplayPaused || images.length <= 1) {
      setProgress(0);
      return;
    }

    const step = 50; // ms
    const duration = 5000; // ms total
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (step / duration) * 100;
      });
    }, step);

    return () => clearInterval(timer);
  }, [isHovered, isLightboxOpen, isAutoplayPaused, images.length, handleNext]);

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

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isLightboxOpen) {
      // Calculate pinch-to-zoom start distance
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialTouchDistance.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialTouchDistance.current !== null && isLightboxOpen) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.hypot(dx, dy);
      const factor = distance / initialTouchDistance.current;
      setZoomScale(Math.min(Math.max(factor, 1), 3)); // scale between 1 and 3
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && initialTouchDistance.current === null) {
      const diffX = touchStartX.current - e.changedTouches[0].clientX;
      const threshold = 50;
      if (Math.abs(diffX) > threshold && zoomScale === 1) {
        if (diffX > 0) {
          handleManualNext();
        } else {
          handleManualPrev();
        }
      }
    }
    touchStartX.current = null;
    initialTouchDistance.current = null;
  };

  // Zoom management
  const toggleZoom = () => {
    setZoomScale((prev) => (prev === 1 ? 2.5 : 1));
  };

  if (!images || images.length === 0) return null;

  const currentFormatted = String(activeIndex + 1).padStart(2, "0");
  const totalFormatted = String(images.length).padStart(2, "0");

  return (
    <div 
      className="w-full space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Image Gallery"
    >
      {/* Large Showcase Image */}
      <div 
        className="relative w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-[16/9] overflow-hidden rounded-2xl bg-surface-container-highest shadow-md group touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ambient Blurred Background (Matches color space of active image) */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <Image
            src={getOptimizedUrl(images[activeIndex], 800)}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-2xl opacity-40 scale-105 pointer-events-none"
          />
        </div>

        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute inset-0 w-full h-full text-left z-10"
          aria-label={`View enlarged image ${activeIndex + 1} of ${images.length}`}
        >
          <Image
            src={getOptimizedUrl(images[activeIndex], 1200)}
            alt={`${title} - image ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            priority={activeIndex === 0}
            className="object-contain transition-transform duration-700 group-hover:scale-[1.01]"
          />
        </button>

        {/* Manual navigation chevrons on main showcase card */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handleManualPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all hover:scale-105 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 outline-none focus:ring-2 focus:ring-primary z-20"
              aria-label="Previous Image"
            >
              <span className="material-symbols-outlined text-2xl flex">chevron_left</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleManualNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all hover:scale-105 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 outline-none focus:ring-2 focus:ring-primary z-20"
              aria-label="Next Image"
            >
              <span className="material-symbols-outlined text-2xl flex">chevron_right</span>
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute top-4 right-4 bg-black/65 text-white backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold shadow z-20 flex items-center gap-1.5 font-mono">
          <span className="material-symbols-outlined text-[16px]">photo_library</span>
          {currentFormatted} / {totalFormatted}
        </div>

        {/* Autoplay Progress Bar */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-20">
            <div 
              className="h-full bg-primary transition-all duration-50 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-2 py-1" aria-label="Slideshow indicators">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveIndex(idx); triggerManualPause(); }}
              className={`h-2 rounded-full transition-all duration-300 outline-none focus:ring-2 focus:ring-primary
                ${activeIndex === idx ? "bg-primary w-5" : "bg-outline-variant hover:bg-outline w-2"}
              `}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={activeIndex === idx ? "true" : "false"}
            />
          ))}
        </div>
      )}

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
                onClick={() => { setActiveIndex(idx); triggerManualPause(); }}
                className={`relative flex-shrink-0 snap-center overflow-hidden rounded-xl transition-all duration-300 w-20 h-16 sm:w-28 sm:h-20 md:w-32 md:h-24 outline-none focus:ring-4 focus:ring-primary
                  ${activeIndex === idx 
                    ? 'ring-4 ring-primary scale-[1.02] opacity-100 shadow-sm z-10' 
                    : 'opacity-60 hover:opacity-100 hover:scale-[1.02]'
                  }
                `}
                aria-label={`Select thumbnail ${idx + 1}`}
              >
                <Image
                  src={getOptimizedUrl(img, 240, true)}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 80px, 128px"
                  loading="lazy"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm touch-none"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox view"
        >
          {/* Top Info Bar */}
          <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-50">
            <h3 className="text-white text-base md:text-lg font-bold max-w-xl truncate">{title}</h3>
            <div className="flex items-center gap-4">
              <span className="text-white/80 font-mono text-sm">{currentFormatted} / {totalFormatted}</span>
              <button 
                onClick={() => { setIsLightboxOpen(false); setZoomScale(1); }}
                className="text-white/80 hover:text-white bg-white/15 hover:bg-white/25 p-2 rounded-full transition-colors outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close Lightbox (Esc)"
              >
                <span className="material-symbols-outlined text-2xl flex">close</span>
              </button>
            </div>
          </div>

          {/* Lightbox Prev Button */}
          {images.length > 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleManualPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-105 outline-none focus:ring-2 focus:ring-primary z-50"
              aria-label="Previous image"
            >
              <span className="material-symbols-outlined text-3xl flex">chevron_left</span>
            </button>
          )}

          {/* Main Lightbox Viewport */}
          <div 
            className="relative w-full h-full max-w-5xl max-h-[80vh] mx-auto px-4 md:px-12 flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={toggleZoom}
            onClick={() => { setIsLightboxOpen(false); setZoomScale(1); }}
          >
            <div 
              className="relative w-full h-full transition-transform duration-200 ease-out cursor-zoom-in"
              style={{ transform: `scale(${zoomScale})` }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getOptimizedUrl(images[activeIndex], 1600)}
                alt={`${title} - enlarged view`}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain pointer-events-none select-none"
              />
            </div>
          </div>

          {/* Lightbox Next Button */}
          {images.length > 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleManualNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-105 outline-none focus:ring-2 focus:ring-primary z-50"
              aria-label="Next image"
            >
              <span className="material-symbols-outlined text-3xl flex">chevron_right</span>
            </button>
          )}

          {/* Hint Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs text-white/90 font-medium select-none pointer-events-none z-10 text-center flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">zoom_in</span>
            Double-click or pinch to zoom. Esc to exit.
          </div>
        </div>
      )}

      {/* Lightweight adjacent image prefetching in DOM background */}
      {images.length > 1 && (
        <div className="hidden" aria-hidden="true">
          <Image 
            src={getOptimizedUrl(images[(activeIndex + 1) % images.length], 1200)}
            alt="" 
            width={1} 
            height={1} 
            priority
          />
          <Image 
            src={getOptimizedUrl(images[(activeIndex - 1 + images.length) % images.length], 1200)}
            alt="" 
            width={1} 
            height={1} 
            priority
          />
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
