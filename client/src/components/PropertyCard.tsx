import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Bed, Bath, Maximize, MapPin, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Property } from "@shared/schema";
import { useState, useEffect } from "react";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";
import { FluidGlass } from "@/components/reactbits";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(() => isInWishlist(property.id));

  useEffect(() => {
    const handleWishlistUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.propertyId === property.id) {
        setIsWishlisted(customEvent.detail.action === "add");
      }
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, [property.id]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(2)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  const formatArea = (area: number) => {
    return area.toLocaleString();
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(property.id);
  };

  return (
    <Link href={`/property/${property.id}`}>
      <FluidGlass className="overflow-hidden cursor-pointer h-full rounded-xl shadow-lg bg-background/60" intensity={0.3}>
        <div className="overflow-hidden cursor-pointer h-full border border-border/50 bg-background/40 backdrop-blur-sm" data-testid={`card-property-${property.id}`}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={property.images?.[0] || `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(property.title)}`}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(property.title)}`;
            }}
          />
          
          {/* Badges & Wishlist */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              {property.featured && (
                <Badge variant="default" className="bg-primary" data-testid={`badge-featured-${property.id}`}>
                  Featured
                </Badge>
              )}
              {property.verified && (
                <Badge variant="secondary" data-testid={`badge-verified-${property.id}`}>
                  Verified
                </Badge>
              )}
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm"
              onClick={handleWishlistClick}
              data-testid={`button-wishlist-${property.id}`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
            </Button>
          </div>

          {/* Image Count */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {property.images.length} photos
            </Badge>
          </div>
        </div>

        <div className="p-4">
          {/* Price */}
          <div className="mb-3">
            <div className="text-2xl font-bold text-foreground" data-testid={`text-price-${property.id}`}>
              AED {formatPrice(property.price)}
            </div>
            <div className="text-sm text-muted-foreground">
              {property.listingType === "Rent" ? "per year" : ""}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-2" data-testid={`text-title-${property.id}`}>
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-2 mb-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1" data-testid={`text-location-${property.id}`}>
              {property.building && `${property.building}, `}
              {property.subarea}, {property.location}, {property.city}
            </span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1" data-testid={`text-beds-${property.id}`}>
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1" data-testid={`text-baths-${property.id}`}>
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1" data-testid={`text-area-${property.id}`}>
              <Maximize className="h-4 w-4" />
              <span>{formatArea(property.area)} sqft</span>
            </div>
          </div>

          {/* WhatsApp Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            data-testid={`button-whatsapp-${property.id}`}
          >
            <SiWhatsapp className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </div>
        </div>
      </FluidGlass>
    </Link>
  );
}
