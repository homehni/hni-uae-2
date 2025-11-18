import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/PropertyCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import type { Property, PropertyFilter } from "@shared/schema";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export default function PropertyListings() {
  const searchParams = useSearch();
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [sortBy, setSortBy] = useState<string>("featured");

  // Parse URL params into filters
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const newFilters: PropertyFilter = {};

    const listingType = params.get("listingType");
    if (listingType === "Sale" || listingType === "Rent") {
      newFilters.listingType = listingType;
    }

    const city = params.get("city");
    if (city) newFilters.city = city;

    const location = params.get("location");
    if (location) newFilters.location = location;

    const propertyType = params.getAll("propertyType");
    if (propertyType.length > 0) newFilters.propertyType = propertyType;

    const minPrice = params.get("minPrice");
    if (minPrice) newFilters.minPrice = Number(minPrice);

    const maxPrice = params.get("maxPrice");
    if (maxPrice) newFilters.maxPrice = Number(maxPrice);

    const featured = params.get("featured");
    if (featured === "true") newFilters.featured = true;

    const completionStatus = params.get("completionStatus");
    if (completionStatus) newFilters.completionStatus = completionStatus;

    setFilters(newFilters);
  }, [searchParams]);

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", filters],
  });

  const handleFilterChange = (newFilters: PropertyFilter) => {
    const params = new URLSearchParams();

    if (newFilters.listingType) params.set("listingType", newFilters.listingType);
    if (newFilters.city) params.set("city", newFilters.city);
    if (newFilters.location) params.set("location", newFilters.location);
    if (newFilters.propertyType) {
      newFilters.propertyType.forEach((type) => params.append("propertyType", type));
    }
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.featured) params.set("featured", "true");
    if (newFilters.completionStatus) params.set("completionStatus", newFilters.completionStatus);

    setLocation(`/properties?${params.toString()}`);
  };

  const sortedProperties = properties ? [...properties].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return 0;
  }) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />
        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <ScrollReveal direction="up" delay={0.1}>
            <FluidGlass className="rounded-lg p-6 mb-6" intensity={0.2}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">
                    {filters.listingType === "Rent" ? "Properties for Rent" : "Properties for Sale"}
                    {filters.city && ` in ${filters.city}`}
                  </h1>
                  <p className="text-white/80">
                    {isLoading ? "Loading..." : `${sortedProperties.length} properties found`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" data-testid="button-open-filters">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClose={() => {}}
                  />
                </SheetContent>
              </Sheet>
                </div>
              </div>
            </FluidGlass>
          </ScrollReveal>

          {/* Content */}
          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-80 flex-shrink-0">
              <div className="sticky top-20">
                <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </aside>

            {/* Properties Grid */}
            <div className="flex-1">
              {isLoading ? (
                <FluidGlass className="rounded-lg p-6" intensity={0.1}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="aspect-[4/3] w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ))}
                  </div>
                </FluidGlass>
              ) : sortedProperties.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProperties.map((property, index) => (
                    <ScrollReveal key={property.id} direction="up" delay={index * 0.05}>
                      <PropertyCard property={property} />
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <FluidGlass className="rounded-lg p-12" intensity={0.15}>
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-2 text-white">No properties found</h3>
                    <p className="text-white/80 mb-6">
                      Try adjusting your filters or search criteria
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => handleFilterChange({})}
                      data-testid="button-clear-all-filters"
                      className="bg-background/80"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </FluidGlass>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
