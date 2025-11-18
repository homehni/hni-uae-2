import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { HeroSearch } from "@/components/HeroSearch";
import { PropertyCard } from "@/components/PropertyCard";
import { NewProjectsSection } from "@/components/NewProjectsSection";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Property } from "@shared/schema";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { Carousel } from "@/components/reactbits/Carousel";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export default function HomePage() {
  const { data: featuredProperties, isLoading: loadingFeatured } = useQuery<Property[]>({
    queryKey: ["/api/properties", { featured: true, limit: 8 }],
  });

  const { data: newProjects, isLoading: loadingProjects } = useQuery<Property[]>({
    queryKey: ["/api/properties", { completionStatus: "Off-Plan", limit: 18 }],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSearch />

        {/* Featured Properties */}
        <section className="py-16 relative overflow-hidden">
          <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <FluidGlass className="rounded-lg p-6 shadow-lg bg-background/60" intensity={0.3}>
              <ScrollReveal direction="up" delay={0.1}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">Featured Properties</h2>
                  <Link href="/properties?featured=true">
                    <Button variant="outline" data-testid="link-view-all-featured" className="bg-background/80">
                      View All
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>

              {loadingFeatured ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-[4/3] w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : featuredProperties && featuredProperties.length > 0 ? (
                <>
                  {/* Desktop Grid */}
                  <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProperties.map((property, index) => (
                      <ScrollReveal key={property.id} direction="up" delay={index * 0.1}>
                        <PropertyCard property={property} />
                      </ScrollReveal>
                    ))}
                  </div>
                  {/* Mobile/Tablet Carousel */}
                  <div className="lg:hidden">
                    <Carousel
                      items={featuredProperties.slice(0, 4).map((property) => (
                        <div key={property.id} className="px-2">
                          <PropertyCard property={property} />
                        </div>
                      ))}
                      autoPlay={true}
                      interval={5000}
                      showControls={true}
                      showIndicators={true}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center text-white/80 py-12">
                  No featured properties available at the moment.
                </div>
              )}
            </FluidGlass>
          </div>
        </section>

        {/* New Projects */}
        {!loadingProjects && newProjects && newProjects.length > 0 && (
          <NewProjectsSection projects={newProjects} />
        )}

        {/* Popular Searches */}
        <section className="py-16 relative overflow-hidden">
          <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-8" intensity={0.2}>
                <h2 className="text-3xl font-bold text-white">Popular Real Estate Searches</h2>
              </FluidGlass>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScrollReveal direction="left" delay={0.2}>
                <FluidGlass className="rounded-md" intensity={0.2}>
                  <Link href="/properties?city=Dubai&listingType=Sale">
                    <div className="p-6 border rounded-md hover-elevate active-elevate-2 cursor-pointer bg-background/60" data-testid="link-popular-dubai-sale">
                      <h3 className="font-semibold text-lg mb-2">Properties for Sale in Dubai</h3>
                      <p className="text-sm text-muted-foreground">
                        Browse apartments, villas, and townhouses for sale
                      </p>
                    </div>
                  </Link>
                </FluidGlass>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.3}>
                <FluidGlass className="rounded-md" intensity={0.2}>
                  <Link href="/properties?city=Abu Dhabi&listingType=Rent">
                    <div className="p-6 border rounded-md hover-elevate active-elevate-2 cursor-pointer bg-background/60" data-testid="link-popular-abudhabi-rent">
                      <h3 className="font-semibold text-lg mb-2">Properties for Rent in Abu Dhabi</h3>
                      <p className="text-sm text-muted-foreground">
                        Find rental properties in the capital city
                      </p>
                    </div>
                  </Link>
                </FluidGlass>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.4}>
                <FluidGlass className="rounded-md" intensity={0.2}>
                  <Link href="/properties?propertyType=Villa">
                    <div className="p-6 border rounded-md hover-elevate active-elevate-2 cursor-pointer bg-background/60" data-testid="link-popular-villas">
                      <h3 className="font-semibold text-lg mb-2">Luxury Villas</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore premium villa communities across UAE
                      </p>
                    </div>
                  </Link>
                </FluidGlass>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
