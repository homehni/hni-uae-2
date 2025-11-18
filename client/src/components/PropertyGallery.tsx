import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Carousel } from "@/components/reactbits/Carousel";
import { FluidGlass } from "@/components/reactbits/FluidGlass";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  const carouselItems = images.map((image, index) => (
    <div
      key={index}
      className="relative w-full h-[400px] md:h-[500px] rounded-md overflow-hidden cursor-pointer bg-muted"
      onClick={() => openLightbox(index)}
      data-testid={`image-carousel-${index}`}
    >
      <img
        src={image || `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(title)}`}
        alt={`${title} - ${index + 1}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(title)}`;
        }}
      />
    </div>
  ));

  return (
    <>
      {/* Main Gallery with Carousel */}
      <FluidGlass className="rounded-md overflow-hidden" intensity={0.15}>
        <Carousel
          items={carouselItems}
          autoPlay={true}
          interval={4000}
          showControls={true}
          showIndicators={true}
          className="h-[400px] md:h-[500px]"
        />
      </FluidGlass>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl h-[90vh] p-0" data-testid="dialog-lightbox">
          <div className="relative w-full h-full flex items-center justify-center bg-background">
            <img
              src={images[currentIndex] || `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(title)}`}
              alt={`${title} - ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              data-testid="image-lightbox-current"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(title)}`;
              }}
            />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                  data-testid="button-lightbox-prev"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                  data-testid="button-lightbox-next"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-md">
              <span className="text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            {/* Close Button */}
            <DialogClose asChild>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4"
                data-testid="button-lightbox-close"
              >
                <X className="h-6 w-6" />
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
