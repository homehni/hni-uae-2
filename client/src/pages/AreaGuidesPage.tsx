import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Building2, TrendingUp, Home, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

interface AreaGuide {
  city: string;
  areas: {
    name: string;
    image: string;
    propertyCount: number;
    avgPrice: string;
    description: string;
    highlights: string[];
  }[];
}

const areaGuides: AreaGuide[] = [
  {
    city: "Dubai",
    areas: [
      {
        name: "Dubai Marina",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
        propertyCount: 2500,
        avgPrice: "AED 1.5M",
        description: "A vibrant waterfront community with stunning views, world-class dining, and luxury living.",
        highlights: ["Marina Walk", "JBR Beach", "Metro Access", "Restaurants & Cafes"],
      },
      {
        name: "Downtown Dubai",
        image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=400&h=300&fit=crop",
        propertyCount: 1800,
        avgPrice: "AED 2.5M",
        description: "Home to Burj Khalifa and Dubai Mall, the heart of modern Dubai living.",
        highlights: ["Burj Khalifa", "Dubai Mall", "Opera District", "Dubai Fountain"],
      },
      {
        name: "Palm Jumeirah",
        image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&h=300&fit=crop",
        propertyCount: 1200,
        avgPrice: "AED 4M",
        description: "The iconic palm-shaped island offering exclusive beachfront living and luxury resorts.",
        highlights: ["Private Beaches", "Atlantis Resort", "Boardwalk", "Celebrity Neighbors"],
      },
      {
        name: "Business Bay",
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop",
        propertyCount: 2000,
        avgPrice: "AED 1.2M",
        description: "A thriving business district with modern apartments and waterfront promenades.",
        highlights: ["Canal Views", "Business Hub", "Restaurants", "Easy Commute"],
      },
      {
        name: "JVC (Jumeirah Village Circle)",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop",
        propertyCount: 3500,
        avgPrice: "AED 750K",
        description: "A family-friendly community offering affordable housing with great amenities.",
        highlights: ["Parks", "Schools", "Affordable", "Community Feel"],
      },
      {
        name: "Dubai Hills",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
        propertyCount: 1500,
        avgPrice: "AED 2M",
        description: "A premium master-planned community with golf course views and lush green spaces.",
        highlights: ["Golf Course", "Dubai Hills Mall", "Parks", "Family Living"],
      },
    ],
  },
  {
    city: "Abu Dhabi",
    areas: [
      {
        name: "Al Reem Island",
        image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400&h=300&fit=crop",
        propertyCount: 1200,
        avgPrice: "AED 1.2M",
        description: "A modern island community with waterfront living and urban conveniences.",
        highlights: ["Waterfront", "Parks", "Retail", "Schools"],
      },
      {
        name: "Saadiyat Island",
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop",
        propertyCount: 800,
        avgPrice: "AED 3M",
        description: "The cultural district of Abu Dhabi with world-class museums and pristine beaches.",
        highlights: ["Louvre Abu Dhabi", "Beaches", "Golf Course", "Cultural District"],
      },
      {
        name: "Yas Island",
        image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop",
        propertyCount: 600,
        avgPrice: "AED 1.5M",
        description: "Entertainment capital with theme parks, beaches, and vibrant community living.",
        highlights: ["Ferrari World", "Yas Marina", "Water Park", "Entertainment"],
      },
    ],
  },
  {
    city: "Sharjah",
    areas: [
      {
        name: "Al Majaz",
        image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&h=300&fit=crop",
        propertyCount: 500,
        avgPrice: "AED 600K",
        description: "A waterfront district known for its stunning lagoon views and family-friendly atmosphere.",
        highlights: ["Majaz Waterfront", "Parks", "Restaurants", "Central Location"],
      },
      {
        name: "Al Khan",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
        propertyCount: 400,
        avgPrice: "AED 500K",
        description: "A coastal community offering affordable beachfront living and easy access to Dubai.",
        highlights: ["Beach Access", "Aquarium", "Affordable", "Dubai Border"],
      },
    ],
  },
];

export default function AreaGuidesPage() {
  const [selectedCity, setSelectedCity] = useState("Dubai");

  const currentCityData = useMemo(() => {
    return areaGuides.find((g) => g.city === selectedCity);
  }, [selectedCity]);

  const totalProperties = useMemo(() => {
    return currentCityData?.areas.reduce((acc, a) => acc + a.propertyCount, 0).toLocaleString() || "0";
  }, [currentCityData]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />

        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <ScrollReveal direction="up" delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">UAE Area Guides</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the best neighborhoods across the UAE. Learn about communities, 
                amenities, and property trends to find your perfect location.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* City Tabs */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.2}>
              <FluidGlass className="rounded-lg p-2" intensity={0.15}>
                <Tabs value={selectedCity} onValueChange={setSelectedCity}>
                  <TabsList className="w-full justify-start bg-transparent flex-wrap h-auto">
                    {areaGuides.map((guide) => (
                      <TabsTrigger key={guide.city} value={guide.city} className="text-lg">
                        {guide.city}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </FluidGlass>
            </ScrollReveal>
          </div>
        </section>

        {/* Areas Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-8" intensity={0.2}>
                <h2 className="text-2xl font-bold">Popular Areas in {selectedCity}</h2>
                <p className="text-muted-foreground mt-1">
                  Explore {currentCityData?.areas.length || 0} neighborhoods
                </p>
              </FluidGlass>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentCityData?.areas.map((area, index) => (
                <ScrollReveal key={area.name} direction="up" delay={0.1 + index * 0.05}>
                  <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                    <Card className="h-full bg-card/80 backdrop-blur-sm overflow-hidden">
                      <div className="relative h-48">
                        <img
                          src={area.image}
                          alt={area.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold">{area.name}</h3>
                          <p className="text-sm text-white/80">{selectedCity}</p>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <p className="text-muted-foreground text-sm mb-4">{area.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <Building2 className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <div className="font-semibold">{area.propertyCount.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Properties</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <div className="font-semibold">{area.avgPrice}</div>
                            <div className="text-xs text-muted-foreground">Avg. Price</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Highlights</h4>
                          <div className="flex flex-wrap gap-2">
                            {area.highlights.map((highlight) => (
                              <Badge key={highlight} variant="secondary" className="text-xs">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Link href={`/properties?location=${encodeURIComponent(area.name)}&city=${selectedCity}`}>
                          <Button variant="outline" className="w-full">
                            View Properties
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* City Overview */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-8" intensity={0.2}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Living in {selectedCity}</h2>
                    <p className="text-muted-foreground mb-6">
                      {selectedCity === "Dubai" &&
                        "Dubai is the most populous city in the UAE and a global hub for business, tourism, and luxury living. From iconic skyscrapers to pristine beaches, Dubai offers an unparalleled lifestyle for residents."}
                      {selectedCity === "Abu Dhabi" &&
                        "Abu Dhabi, the capital of the UAE, blends tradition with modernity. Known for its cultural landmarks, beautiful islands, and family-friendly communities, it's an ideal place to call home."}
                      {selectedCity === "Sharjah" &&
                        "Sharjah, the cultural capital of the UAE, offers affordable housing options with a rich heritage. It's perfect for families seeking a balanced lifestyle close to Dubai."}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {totalProperties}+
                        </div>
                        <div className="text-sm text-muted-foreground">Properties</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{currentCityData?.areas.length}</div>
                        <div className="text-sm text-muted-foreground">Areas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">500+</div>
                        <div className="text-sm text-muted-foreground">Agents</div>
                      </div>
                    </div>
                    <Link href={`/properties?city=${selectedCity}`}>
                      <Button>
                        Explore All Properties in {selectedCity}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {currentCityData?.areas.slice(0, 4).map((area) => (
                      <div key={area.name} className="relative h-32 rounded-lg overflow-hidden">
                        <img src={area.image} alt={area.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{area.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FluidGlass>
            </ScrollReveal>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">Why Use Our Area Guides?</h2>
              </FluidGlass>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: <MapPin className="h-8 w-8" />, title: "Local Insights", description: "Detailed information about each neighborhood" },
                { icon: <TrendingUp className="h-8 w-8" />, title: "Market Data", description: "Real-time pricing and trends" },
                { icon: <Home className="h-8 w-8" />, title: "Property Listings", description: "Direct access to available properties" },
                { icon: <Users className="h-8 w-8" />, title: "Community Info", description: "Amenities, schools, and lifestyle" },
              ].map((feature, index) => (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                    <Card className="h-full bg-card/80 backdrop-blur-sm text-center">
                      <CardContent className="pt-6">
                        <div className="flex justify-center mb-4 text-primary">{feature.icon}</div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
