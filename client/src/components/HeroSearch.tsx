import { useState } from "react";
import { Search, MapPin, Home, DollarSign, Bed, Bath, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation as useWouterLocation } from "wouter";
const heroImage = "/hero-image.png";
import { AnimatedText } from "@/components/reactbits/AnimatedText";
import { FloatingLines } from "@/components/reactbits/FloatingLines";
import { FlowingMenu } from "@/components/reactbits/FlowingMenu";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export function HeroSearch() {
  const [location] = useWouterLocation();
  const [, setLocation] = useWouterLocation();
  const [listingType, setListingType] = useState<"Sale" | "Rent">("Sale");
  const [searchLocation, setSearchLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bedsBaths, setBedsBaths] = useState("");
  const [yearly, setYearly] = useState("");
  const [handoverBy, setHandoverBy] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("");
  const [completionPercent, setCompletionPercent] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "ready" | "offplan" | "agents">("all");
  const [agentLocation, setAgentLocation] = useState("");

  const handleSearch = () => {
    if (viewMode === "agents") {
      const params = new URLSearchParams();
      if (agentLocation) params.set("location", agentLocation);
      setLocation(`/agents?${params.toString()}`);
    } else {
      const params = new URLSearchParams();
      params.set("listingType", listingType);
      if (searchLocation) params.set("location", searchLocation);
      if (propertyType) params.set("propertyType", propertyType);
      if (priceRange) {
        const [min, max] = priceRange.split("-");
        if (min) params.set("minPrice", min);
        if (max) params.set("maxPrice", max);
      }
      if (bedsBaths) {
        const [beds, baths] = bedsBaths.split("-");
        if (beds) params.set("bedrooms", beds);
        if (baths) params.set("bathrooms", baths);
      }
      if (viewMode === "ready") params.set("completionStatus", "Ready");
      if (viewMode === "offplan") params.set("completionStatus", "Off-Plan");
      if (handoverBy) params.set("handoverDate", handoverBy);
      setLocation(`/properties?${params.toString()}`);
    }
  };

  return (
    <section className="relative bg-background overflow-hidden h-[600px] md:h-[700px]">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Dubai Skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        <FloatingLines className="opacity-30" lineCount={8} />
        <ChromaGrid className="opacity-15" cellSize={60} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedText
            text="Find Your Dream Property in UAE"
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            delay={0.1}
          />
          <AnimatedText
            text="Search from thousands of properties for sale and rent across Dubai, Abu Dhabi, and more"
            className="text-lg md:text-xl text-white/90 mb-8"
            delay={0.3}
          />

          {/* Navigation Tabs */}
          <FluidGlass className="rounded-md p-2 mb-4 shadow-lg bg-background/60 w-fit mx-auto">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("all")}
                className={viewMode === "all" ? "bg-primary text-primary-foreground" : ""}
              >
                Properties
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("offplan")}
                className={viewMode === "offplan" ? "bg-primary text-primary-foreground" : ""}
              >
                New Projects
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("agents")}
                className={viewMode === "agents" ? "bg-primary text-primary-foreground" : ""}
              >
                Agents
              </Button>
            </div>
          </FluidGlass>

          {/* Search Card */}
          <FluidGlass className="rounded-md p-6 shadow-lg bg-background/60">
            {/* Buy/Rent Toggle (only shown when not in agents mode) */}
            {viewMode !== "agents" && (
              <div className="flex gap-2 mb-4">
                <Button
                  variant={listingType === "Sale" ? "default" : "outline"}
                  onClick={() => setListingType("Sale")}
                  className="flex-1"
                  data-testid="button-hero-buy"
                >
                  Buy
                </Button>
                <Button
                  variant={listingType === "Rent" ? "default" : "outline"}
                  onClick={() => setListingType("Rent")}
                  className="flex-1"
                  data-testid="button-hero-rent"
                >
                  Rent
                </Button>
              </div>
            )}

            {/* Property Status Toggle (shown when not in Off-Plan or Agents mode) */}
            {viewMode !== "offplan" && viewMode !== "agents" && (
              <div className="flex gap-2 mb-4">
                <Button
                  variant={viewMode === "all" ? "default" : "outline"}
                  onClick={() => setViewMode("all")}
                  size="sm"
                  className="flex-1"
                >
                  All
                </Button>
                <Button
                  variant={viewMode === "ready" ? "default" : "outline"}
                  onClick={() => setViewMode("ready")}
                  size="sm"
                  className="flex-1"
                >
                  Ready
                </Button>
                <Button
                  variant={viewMode === "offplan" ? "default" : "outline"}
                  onClick={() => setViewMode("offplan")}
                  size="sm"
                  className="flex-1"
                >
                  Off-Plan
                </Button>
              </div>
            )}

            {/* Main Search Row */}
            {viewMode === "agents" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter location"
                    value={agentLocation}
                    onChange={(e) => setAgentLocation(e.target.value)}
                    className="pl-10"
                    data-testid="input-agent-location"
                  />
                </div>
                <Button onClick={handleSearch} className="w-full" data-testid="button-search-agents">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-10"
                      data-testid="input-location"
                    />
                  </div>

                  <Button onClick={handleSearch} className="w-full" data-testid="button-search-properties">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Filter Dropdowns Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {listingType === "Rent" ? (
                    <>
                  <Select value={yearly} onValueChange={setYearly}>
                    <SelectTrigger>
                      <SelectValue placeholder="Yearly" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger data-testid="select-property-type">
                      <SelectValue placeholder="Residential" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={bedsBaths} onValueChange={setBedsBaths}>
                    <SelectTrigger data-testid="select-beds-baths">
                      <SelectValue placeholder="Beds & Baths" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-1">1 Bed, 1 Bath</SelectItem>
                      <SelectItem value="2-2">2 Bed, 2 Bath</SelectItem>
                      <SelectItem value="3-3">3 Bed, 3 Bath</SelectItem>
                      <SelectItem value="4-4">4 Bed, 4 Bath</SelectItem>
                      <SelectItem value="5-5">5+ Bed, 5+ Bath</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger data-testid="select-price-range">
                      <SelectValue placeholder="Price (AED)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-500000">Under 500K AED</SelectItem>
                      <SelectItem value="500000-1000000">500K - 1M AED</SelectItem>
                      <SelectItem value="1000000-2000000">1M - 2M AED</SelectItem>
                      <SelectItem value="2000000-5000000">2M - 5M AED</SelectItem>
                      <SelectItem value="5000000-10000000">5M - 10M AED</SelectItem>
                      <SelectItem value="10000000-">Above 10M AED</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : viewMode === "offplan" ? (
                <>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger data-testid="select-property-type">
                      <SelectValue placeholder="Residential" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={handoverBy} onValueChange={setHandoverBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Handover By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={paymentPlan} onValueChange={setPaymentPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10-90">10/90</SelectItem>
                      <SelectItem value="20-80">20/80</SelectItem>
                      <SelectItem value="30-70">30/70</SelectItem>
                      <SelectItem value="40-60">40/60</SelectItem>
                      <SelectItem value="50-50">50/50</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={completionPercent} onValueChange={setCompletionPercent}>
                    <SelectTrigger>
                      <SelectValue placeholder="% Completion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-25">0-25%</SelectItem>
                      <SelectItem value="25-50">25-50%</SelectItem>
                      <SelectItem value="50-75">50-75%</SelectItem>
                      <SelectItem value="75-100">75-100%</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger data-testid="select-property-type">
                      <SelectValue placeholder="Residential" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={bedsBaths} onValueChange={setBedsBaths}>
                    <SelectTrigger data-testid="select-beds-baths">
                      <SelectValue placeholder="Beds & Baths" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-1">1 Bed, 1 Bath</SelectItem>
                      <SelectItem value="2-2">2 Bed, 2 Bath</SelectItem>
                      <SelectItem value="3-3">3 Bed, 3 Bath</SelectItem>
                      <SelectItem value="4-4">4 Bed, 4 Bath</SelectItem>
                      <SelectItem value="5-5">5+ Bed, 5+ Bath</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger data-testid="select-price-range">
                      <SelectValue placeholder="Price (AED)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-500000">Under 500K AED</SelectItem>
                      <SelectItem value="500000-1000000">500K - 1M AED</SelectItem>
                      <SelectItem value="1000000-2000000">1M - 2M AED</SelectItem>
                      <SelectItem value="2000000-5000000">2M - 5M AED</SelectItem>
                      <SelectItem value="5000000-10000000">5M - 10M AED</SelectItem>
                      <SelectItem value="10000000-">Above 10M AED</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
              </>
            )}
          </FluidGlass>
        </div>
      </div>
    </section>
  );
}
