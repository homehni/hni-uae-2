import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PropertyGallery } from "@/components/PropertyGallery";
import { AgentCard } from "@/components/AgentCard";
import { PropertyCard } from "@/components/PropertyCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bed, Bath, Maximize, MapPin, Heart, Share2, Calendar, Home, MessageSquare, CheckCircle } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";
import { addToRecentlyViewed } from "@/lib/recentlyViewed";
import type { Property, Agent } from "@shared/schema";
import { Stepper } from "@/components/reactbits/Stepper";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export default function PropertyDetail() {
  const [, params] = useRoute("/property/:id");
  const propertyId = params?.id;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [inquiryStep, setInquiryStep] = useState(1);

  const { data: property, isLoading: loadingProperty } = useQuery<Property>({
    queryKey: ["/api/properties", propertyId],
    enabled: !!propertyId,
  });

  useEffect(() => {
    if (propertyId) {
      setIsWishlisted(isInWishlist(propertyId));
      // Track this property as recently viewed
      addToRecentlyViewed(propertyId);
    }
  }, [propertyId]);

  useEffect(() => {
    const handleWishlistUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (propertyId && customEvent.detail.propertyId === propertyId) {
        setIsWishlisted(customEvent.detail.action === "add");
      }
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, [propertyId]);

  const handleWishlistClick = () => {
    if (propertyId) {
      toggleWishlist(propertyId);
    }
  };

  const { data: agent, isLoading: loadingAgent } = useQuery<Agent>({
    queryKey: ["/api/agents", property?.agentId],
    enabled: !!property?.agentId,
  });

  const { data: similarProperties } = useQuery<Property[]>({
    queryKey: ["/api/properties", { 
      city: property?.city, 
      propertyType: property?.propertyType,
      limit: 4 
    }],
    enabled: !!property,
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const formatArea = (area: number) => {
    return area.toLocaleString();
  };

  if (loadingProperty) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Skeleton className="h-8 w-96 mb-6" />
            <Skeleton className="h-[500px] w-full mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-60 w-full" />
              </div>
              <div>
                <Skeleton className="h-80 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Property not found</h1>
            <p className="text-muted-foreground mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <ScrollReveal direction="up" delay={0.1}>
            <FluidGlass className="rounded-lg p-4 mb-6" intensity={0.15}>
              <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" data-testid="breadcrumb-home">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/properties" data-testid="breadcrumb-properties">Properties</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/properties?city=${property.city}`} data-testid="breadcrumb-city">
                  {property.city}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{property.location}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
            </FluidGlass>
          </ScrollReveal>

          {/* Gallery */}
          <ScrollReveal direction="up" delay={0.2}>
            <PropertyGallery images={property.images} title={property.title} />
          </ScrollReveal>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Price */}
              <ScrollReveal direction="up" delay={0.3}>
                <FluidGlass className="rounded-lg p-6" intensity={0.2}>
                  <div>
                    <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2" data-testid="text-property-title">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin className="h-5 w-5" />
                      <span data-testid="text-property-location">
                        {property.building && `${property.building}, `}
                        {property.subarea}, {property.location}, {property.city}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" data-testid="button-share">
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleWishlistClick}
                      data-testid="button-wishlist-detail"
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-end gap-2 mb-6">
                  <div className="text-4xl font-bold text-primary" data-testid="text-property-price">
                    AED {formatPrice(property.price)}
                  </div>
                  {property.listingType === "Rent" && (
                    <div className="text-muted-foreground mb-1">per year</div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="default">{property.listingType}</Badge>
                  <Badge variant="secondary">{property.propertyType}</Badge>
                  {property.featured && <Badge variant="default" className="bg-primary">Featured</Badge>}
                  {property.verified && <Badge variant="secondary">Verified</Badge>}
                  {property.completionStatus && (
                    <Badge variant="outline">{property.completionStatus}</Badge>
                  )}
                </div>

                {/* Specs */}
                <FluidGlass className="rounded-md p-6" intensity={0.15}>
                  <div className="flex flex-wrap gap-6 bg-muted/60 rounded-md">
                    <div className="flex items-center gap-3">
                      <Bed className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <div className="text-2xl font-semibold" data-testid="text-property-beds">
                          {property.bedrooms}
                        </div>
                        <div className="text-sm text-muted-foreground">Bedrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Bath className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <div className="text-2xl font-semibold" data-testid="text-property-baths">
                          {property.bathrooms}
                        </div>
                        <div className="text-sm text-muted-foreground">Bathrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Maximize className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <div className="text-2xl font-semibold" data-testid="text-property-area">
                          {formatArea(property.area)}
                        </div>
                        <div className="text-sm text-muted-foreground">sqft</div>
                      </div>
                    </div>
                    {property.handoverDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <div className="text-2xl font-semibold">{property.handoverDate}</div>
                          <div className="text-sm text-muted-foreground">Handover</div>
                        </div>
                      </div>
                    )}
                  </div>
                </FluidGlass>
                  </div>
                </FluidGlass>
              </ScrollReveal>

              {/* Description */}
              <ScrollReveal direction="up" delay={0.4}>
                <FluidGlass className="rounded-lg" intensity={0.2}>
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed" data-testid="text-property-description">
                        {property.description}
                      </p>
                    </CardContent>
                  </Card>
                </FluidGlass>
              </ScrollReveal>

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <ScrollReveal direction="up" delay={0.5}>
                  <FluidGlass className="rounded-lg" intensity={0.2}>
                    <Card className="bg-card/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Amenities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {property.amenities.map((amenity) => (
                            <div key={amenity} className="flex items-center gap-2" data-testid={`amenity-${amenity.toLowerCase()}`}>
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              )}
            </div>

            {/* Right Column - Agent Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                {loadingAgent ? (
                  <Skeleton className="h-80 w-full" />
                ) : agent ? (
                  <>
                    <AgentCard agent={agent} />
                    <FluidGlass className="rounded-lg mt-4" intensity={0.2}>
                      <Card className="bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <Button className="w-full mb-3" data-testid="button-contact-agent">
                            Contact Agent
                          </Button>
                          <Button variant="outline" className="w-full" data-testid="button-whatsapp-agent">
                            <SiWhatsapp className="h-4 w-4 mr-2" />
                            WhatsApp Agent
                          </Button>
                        </CardContent>
                      </Card>
                    </FluidGlass>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Inquiry Process Stepper */}
          <section className="mt-16 relative overflow-hidden rounded-lg">
            <ChromaGrid className="opacity-5 absolute inset-0 rounded-lg" cellSize={40} />
            <FluidGlass className="rounded-lg relative z-10" intensity={0.15}>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Inquiry Process</CardTitle>
                </CardHeader>
                <CardContent>
                <Stepper
                  steps={[
                    { label: "Contact", description: "Reach out to agent", icon: <MessageSquare className="w-5 h-5" /> },
                    { label: "Schedule", description: "Book a viewing", icon: <Calendar className="w-5 h-5" /> },
                    { label: "Review", description: "Complete inquiry", icon: <CheckCircle className="w-5 h-5" /> },
                  ]}
                  currentStep={inquiryStep}
                />
                <div className="mt-6 flex gap-2">
                  {inquiryStep > 1 && (
                    <Button variant="outline" onClick={() => setInquiryStep(inquiryStep - 1)}>
                      Previous
                    </Button>
                  )}
                  {inquiryStep < 3 && (
                    <Button onClick={() => setInquiryStep(inquiryStep + 1)}>
                      Next Step
                    </Button>
                  )}
                  {inquiryStep === 3 && (
                    <Button onClick={() => setInquiryStep(1)}>
                      Start New Inquiry
                    </Button>
                  )}
                </div>
                </CardContent>
              </Card>
            </FluidGlass>
          </section>

          {/* Similar Properties */}
          {similarProperties && similarProperties.length > 0 && (
            <section className="mt-16 relative overflow-hidden rounded-lg">
              <ChromaGrid className="opacity-5 absolute inset-0 rounded-lg" cellSize={40} />
              <FluidGlass className="rounded-lg p-6 relative z-10" intensity={0.2}>
                <h2 className="text-2xl font-bold mb-6 text-white">Similar Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {similarProperties.filter(p => p.id !== property.id).slice(0, 4).map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              </FluidGlass>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
