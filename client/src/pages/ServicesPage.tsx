import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Truck,
  Paintbrush,
  Sparkles,
  Scale,
  Camera,
  Wrench,
  FileText,
  Star,
  Phone,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Link } from "wouter";
import type { Service } from "@shared/schema";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

const serviceCategories = [
  { id: "all", label: "All Services", icon: <Sparkles className="h-5 w-5" /> },
  { id: "packers_movers", label: "Packers & Movers", icon: <Truck className="h-5 w-5" /> },
  { id: "interior_design", label: "Interior Design", icon: <Paintbrush className="h-5 w-5" /> },
  { id: "cleaning", label: "Cleaning", icon: <Sparkles className="h-5 w-5" /> },
  { id: "legal", label: "Legal Services", icon: <Scale className="h-5 w-5" /> },
  { id: "valuation", label: "Valuation", icon: <FileText className="h-5 w-5" /> },
  { id: "home_maintenance", label: "Home Maintenance", icon: <Wrench className="h-5 w-5" /> },
  { id: "photography", label: "Photography", icon: <Camera className="h-5 w-5" /> },
];

// Mock services data
const mockServices = [
  {
    id: "1",
    name: "Premium Packers & Movers",
    category: "packers_movers",
    description: "Professional packing and moving services for homes and offices across UAE.",
    providerId: "1",
    serviceLocations: ["Dubai", "Abu Dhabi", "Sharjah"],
    pricingType: "on_inspection",
    priceMin: 500,
    priceMax: 5000,
    rating: "4.8",
    reviewCount: 125,
    portfolioImages: [],
    isActive: true,
  },
  {
    id: "2",
    name: "Luxury Interior Design Studio",
    category: "interior_design",
    description: "Transform your space with our award-winning interior design team.",
    providerId: "2",
    serviceLocations: ["Dubai", "Abu Dhabi"],
    pricingType: "range",
    priceMin: 10000,
    priceMax: 100000,
    rating: "4.9",
    reviewCount: 89,
    portfolioImages: [],
    isActive: true,
  },
  {
    id: "3",
    name: "Deep Clean Pro",
    category: "cleaning",
    description: "Professional deep cleaning services for residential and commercial properties.",
    providerId: "3",
    serviceLocations: ["Dubai", "Sharjah", "Ajman"],
    pricingType: "fixed",
    priceMin: 200,
    priceMax: 1500,
    rating: "4.7",
    reviewCount: 234,
    portfolioImages: [],
    isActive: true,
  },
  {
    id: "4",
    name: "Legal Property Services",
    category: "legal",
    description: "Expert legal assistance for property transactions, contracts, and disputes.",
    providerId: "4",
    serviceLocations: ["Dubai", "Abu Dhabi"],
    pricingType: "on_inspection",
    priceMin: 1000,
    priceMax: 10000,
    rating: "4.9",
    reviewCount: 67,
    portfolioImages: [],
    isActive: true,
  },
  {
    id: "5",
    name: "RERA Property Valuation",
    category: "valuation",
    description: "Certified property valuation services compliant with RERA standards.",
    providerId: "5",
    serviceLocations: ["Dubai", "Abu Dhabi", "Sharjah"],
    pricingType: "fixed",
    priceMin: 2000,
    priceMax: 5000,
    rating: "4.8",
    reviewCount: 156,
    portfolioImages: [],
    isActive: true,
  },
  {
    id: "6",
    name: "Home Fix UAE",
    category: "home_maintenance",
    description: "All-in-one home maintenance and repair services - AC, plumbing, electrical.",
    providerId: "6",
    serviceLocations: ["Dubai", "Sharjah", "Ajman"],
    pricingType: "on_inspection",
    priceMin: 100,
    priceMax: 2000,
    rating: "4.6",
    reviewCount: 312,
    portfolioImages: [],
    isActive: true,
  },
  {
    id: "7",
    name: "Real Estate Photography Pro",
    category: "photography",
    description: "Professional real estate photography and virtual tours for property listings.",
    providerId: "7",
    serviceLocations: ["Dubai", "Abu Dhabi"],
    pricingType: "fixed",
    priceMin: 500,
    priceMax: 3000,
    rating: "4.9",
    reviewCount: 98,
    portfolioImages: [],
    isActive: true,
  },
  {
    id: "8",
    name: "Express Movers Dubai",
    category: "packers_movers",
    description: "Fast and reliable moving services with same-day options available.",
    providerId: "8",
    serviceLocations: ["Dubai"],
    pricingType: "range",
    priceMin: 300,
    priceMax: 3000,
    rating: "4.5",
    reviewCount: 178,
    portfolioImages: [],
    isActive: true,
  },
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  const filteredServices = useMemo(() => {
    return mockServices.filter((service) => {
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === "all" || service.serviceLocations?.includes(selectedCity);
      return matchesCategory && matchesSearch && matchesCity;
    });
  }, [selectedCategory, searchQuery, selectedCity]);

  const getCategoryIcon = (categoryId: string) => {
    const cat = serviceCategories.find((c) => c.id === categoryId);
    return cat?.icon || <Sparkles className="h-5 w-5" />;
  };

  const getCategoryLabel = (categoryId: string) => {
    const cat = serviceCategories.find((c) => c.id === categoryId);
    return cat?.label || categoryId;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />

        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <ScrollReveal direction="up" delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Home Services</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Find trusted service providers for all your property needs - from movers and 
                interior designers to cleaning and legal services.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <FluidGlass className="rounded-lg p-6 max-w-3xl mx-auto" intensity={0.2}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="Sharjah">Sharjah</SelectItem>
                      <SelectItem value="Ajman">Ajman</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </FluidGlass>
            </ScrollReveal>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {serviceCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex-shrink-0"
                  >
                    {category.icon}
                    <span className="ml-2">{category.label}</span>
                  </Button>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-8" intensity={0.15}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {filteredServices.length} Services Found
                  </h2>
                  <Select defaultValue="rating">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FluidGlass>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <ScrollReveal key={service.id} direction="up" delay={0.05 + index * 0.05}>
                  <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                    <Card className="h-full bg-card/80 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary">
                              {getCategoryIcon(service.category)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                              <Badge variant="secondary" className="mt-1">
                                {getCategoryLabel(service.category)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{service.description}</p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{service.rating}</span>
                            <span className="text-muted-foreground">({service.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{service.serviceLocations?.join(", ")}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div>
                            <div className="text-sm text-muted-foreground">Starting from</div>
                            <div className="font-semibold text-primary">
                              AED {service.priceMin?.toLocaleString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <SiWhatsapp className="h-4 w-4" />
                            </Button>
                            <Button size="sm">Get Quote</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <FluidGlass className="rounded-lg p-12 text-center" intensity={0.15}>
                <h3 className="text-xl font-semibold mb-2">No services found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedCity("all"); }}>
                  Clear Filters
                </Button>
              </FluidGlass>
            )}
          </div>
        </section>

        {/* Why Choose Our Services */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">Why Choose HomeHNI Services?</h2>
              </FluidGlass>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: <CheckCircle2 className="h-8 w-8" />, title: "Verified Providers", description: "All service providers are vetted and verified" },
                { icon: <Star className="h-8 w-8" />, title: "Quality Assured", description: "Rated and reviewed by real customers" },
                { icon: <Phone className="h-8 w-8" />, title: "Easy Booking", description: "Quick quotes and instant booking" },
                { icon: <Scale className="h-8 w-8" />, title: "Fair Pricing", description: "Transparent and competitive pricing" },
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

        {/* Become a Provider CTA */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-12 text-center" intensity={0.3}>
                <h2 className="text-3xl font-bold mb-4">Are You a Service Provider?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join HomeHNI and connect with thousands of property owners looking for your services.
                </p>
                <Link href="/register">
                  <Button size="lg">Register as Service Provider</Button>
                </Link>
              </FluidGlass>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
