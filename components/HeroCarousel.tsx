
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

// Example product images (swap for real ones later)
const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=512&q=80",
    alt: "Model smiling with serum",
  },
  {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=facearea&w=512&q=80",
    alt: "Healthy skin with bottle",
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=512&q=80",
    alt: "Beautiful glow",
  },
  {
    src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=facearea&w=512&q=80",
    alt: "Avocado serum",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = React.useState(0);

  // Sync carousel indicators
  const handleSlideChange = React.useCallback((api: any) => {
    if (api && typeof api.selectedScrollSnap === "function") {
      setCurrent(api.selectedScrollSnap());
    }
  }, []);

  return (
    <div className="w-full max-w-xs md:max-w-sm flex flex-col items-center gap-4 relative">
      <Carousel
        opts={{
          loop: true,
        }}
        className="w-full"
        setApi={handleSlideChange}
      >
        <CarouselContent>
          {IMAGES.map((img, i) => (
            <CarouselItem key={i}>
              <div className="rounded-2xl bg-white/70 shadow-lg flex items-center justify-center p-4 transition-all h-64 md:h-80">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="object-cover rounded-xl h-full w-full transition-all"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 z-40" />
        <CarouselNext className="right-3 top-1/2 -translate-y-1/2 z-40" />
      </Carousel>
      {/* Dots indicator: similar to screenshot */}
      <div className="flex justify-center gap-2 mt-1 absolute bottom-1 left-1/2 -translate-x-1/2 z-30">
        {IMAGES.map((_, i) => (
          <span
            key={i}
            className={`block w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-[#23ae60] scale-125" : "bg-green-200 opacity-70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
