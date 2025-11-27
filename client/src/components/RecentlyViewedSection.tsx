import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { History, X } from "lucide-react";
import { getRecentlyViewedIds, clearRecentlyViewed } from "@/lib/recentlyViewed";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { Carousel } from "@/components/reactbits/Carousel";
import type { Property } from "@shared/schema";

export function RecentlyViewedSection() {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    // Load recently viewed on mount
    setRecentIds(getRecentlyViewedIds());

    // Listen for updates
    const handleUpdate = () => {
      setRecentIds(getRecentlyViewedIds());
    };

    window.addEventListener("recently-viewed-updated", handleUpdate);
    return () => window.removeEventListener("recently-viewed-updated", handleUpdate);
  }, []);

  // Fetch properties by IDs
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { ids: recentIds }],
    enabled: recentIds.length > 0,
  });

  const handleClear = () => {
    clearRecentlyViewed();
  };

  // Don't render if no recently viewed properties
  if (recentIds.length === 0) {
    return null;
  }

  // Filter and sort properties to match the order of recentIds
  const sortedProperties = properties
    ? recentIds
        .map(id => properties.find(p => p.id === id))
        .filter((p): p is Property => p !== undefined)
    : [];

  if (sortedProperties.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal direction="up" delay={0.1}>
          <FluidGlass className="rounded-lg p-6 shadow-lg bg-background/60" intensity={0.3}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Recently Viewed</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>

            {isLoading ? (
              <div className="flex gap-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[280px] h-[360px] bg-muted/30 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : sortedProperties.length > 0 ? (
              <>
                {/* Desktop Grid */}
                <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sortedProperties.slice(0, 4).map((property, index) => (
                    <ScrollReveal key={property.id} direction="up" delay={index * 0.05}>
                      <PropertyCard property={property} />
                    </ScrollReveal>
                  ))}
                </div>
                {/* Mobile/Tablet Carousel */}
                <div className="lg:hidden">
                  <Carousel
                    items={sortedProperties.slice(0, 4).map((property) => (
                      <div key={property.id} className="px-2">
                        <PropertyCard property={property} />
                      </div>
                    ))}
                    autoPlay={false}
                    showControls={true}
                    showIndicators={true}
                  />
                </div>
              </>
            ) : null}
          </FluidGlass>
        </ScrollReveal>
      </div>
    </section>
  );
}
