import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageSlider({ images, autoPlay = true, interval = 3000, className }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prev = useCallback(() =>
    setCurrent(c => (c - 1 + images.length) % images.length), [images.length]);

  const next = useCallback(() =>
    setCurrent(c => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!autoPlay || isHovered || images.length <= 1) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [autoPlay, isHovered, interval, next, images.length]);

  if (!images?.length) return null;

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg bg-muted select-none", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images */}
      <div className="relative w-full aspect-[4/3]">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Product image ${i + 1}`}
            className={cn(
              "absolute inset-0 w-full h-full object-contain transition-opacity duration-500",
              i === current ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </div>

      {/* Prev / Next arrows — only if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center shadow-sm hover:bg-background transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center shadow-sm hover:bg-background transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === current
                    ? "w-4 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-foreground/30 hover:bg-foreground/50"
                )}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-2 right-2 bg-background/70 text-foreground text-[0.6rem] font-mono px-2 py-0.5 rounded-full border border-border/50 z-10">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
