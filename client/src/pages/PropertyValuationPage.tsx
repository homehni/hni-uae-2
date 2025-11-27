import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Calendar,
  CheckCircle,
  Home,
  ArrowRight,
  Info,
  DollarSign,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";
import { Progress } from "@/components/ui/progress";

// Simulated valuation data based on location and property type
const valuationData: Record<string, Record<string, { avgPrice: number; pricePerSqft: number; trend: number }>> = {
  "Dubai Marina": {
    "Apartment": { avgPrice: 1800000, pricePerSqft: 1450, trend: 5.2 },
    "Villa": { avgPrice: 4500000, pricePerSqft: 1200, trend: 4.8 },
    "Townhouse": { avgPrice: 3200000, pricePerSqft: 1100, trend: 4.5 },
    "Penthouse": { avgPrice: 8500000, pricePerSqft: 2200, trend: 6.1 },
  },
  "Downtown Dubai": {
    "Apartment": { avgPrice: 2500000, pricePerSqft: 2100, trend: 6.5 },
    "Villa": { avgPrice: 6000000, pricePerSqft: 1800, trend: 5.8 },
    "Townhouse": { avgPrice: 4500000, pricePerSqft: 1500, trend: 5.2 },
    "Penthouse": { avgPrice: 15000000, pricePerSqft: 3500, trend: 7.2 },
  },
  "Palm Jumeirah": {
    "Apartment": { avgPrice: 3500000, pricePerSqft: 2500, trend: 8.1 },
    "Villa": { avgPrice: 25000000, pricePerSqft: 3200, trend: 9.5 },
    "Townhouse": { avgPrice: 8000000, pricePerSqft: 2800, trend: 7.8 },
    "Penthouse": { avgPrice: 35000000, pricePerSqft: 4500, trend: 10.2 },
  },
  "JVC": {
    "Apartment": { avgPrice: 750000, pricePerSqft: 850, trend: 3.5 },
    "Villa": { avgPrice: 2800000, pricePerSqft: 750, trend: 3.2 },
    "Townhouse": { avgPrice: 1800000, pricePerSqft: 700, trend: 3.0 },
    "Penthouse": { avgPrice: 1500000, pricePerSqft: 950, trend: 3.8 },
  },
  "Business Bay": {
    "Apartment": { avgPrice: 1200000, pricePerSqft: 1350, trend: 4.5 },
    "Villa": { avgPrice: 3500000, pricePerSqft: 1100, trend: 4.0 },
    "Townhouse": { avgPrice: 2500000, pricePerSqft: 950, trend: 3.8 },
    "Penthouse": { avgPrice: 5500000, pricePerSqft: 1800, trend: 5.2 },
  },
  "Dubai Hills": {
    "Apartment": { avgPrice: 1500000, pricePerSqft: 1250, trend: 5.8 },
    "Villa": { avgPrice: 5500000, pricePerSqft: 1100, trend: 6.2 },
    "Townhouse": { avgPrice: 3800000, pricePerSqft: 1050, trend: 5.5 },
    "Penthouse": { avgPrice: 4500000, pricePerSqft: 1600, trend: 6.0 },
  },
};

const locations = Object.keys(valuationData);
const propertyTypes = ["Apartment", "Villa", "Townhouse", "Penthouse"];

export default function PropertyValuationPage() {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [area, setArea] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const valuation = useMemo(() => {
    if (!location || !propertyType || !area) return null;
    
    const areaNum = parseInt(area);
    if (isNaN(areaNum) || areaNum <= 0) return null;

    const locData = valuationData[location]?.[propertyType];
    if (!locData) return null;

    // Calculate estimated value based on area and price per sqft
    const baseValue = areaNum * locData.pricePerSqft;
    
    // Bedroom adjustment (+5% per bedroom over 1)
    const bedroomNum = parseInt(bedrooms) || 1;
    const bedroomAdjustment = 1 + (Math.max(0, bedroomNum - 1) * 0.05);
    
    // Calculate range (±10%)
    const estimatedValue = baseValue * bedroomAdjustment;
    const lowEstimate = estimatedValue * 0.9;
    const highEstimate = estimatedValue * 1.1;

    return {
      estimatedValue: Math.round(estimatedValue),
      lowEstimate: Math.round(lowEstimate),
      highEstimate: Math.round(highEstimate),
      pricePerSqft: locData.pricePerSqft,
      trend: locData.trend,
      avgPrice: locData.avgPrice,
    };
  }, [location, propertyType, bedrooms, area]);

  const handleCalculate = () => {
    if (!location || !propertyType || !area) return;
    
    setIsCalculating(true);
    // Simulate API call
    setTimeout(() => {
      setShowResult(true);
      setIsCalculating(false);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `AED ${(amount / 1000000).toFixed(2)}M`;
    }
    return `AED ${amount.toLocaleString()}`;
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
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
                <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  HomeHNI Valuation
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get Your Property's <span className="text-primary">True Value</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered valuation tool provides instant, accurate property value estimates 
                based on real market data from across the UAE.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Valuation Form */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <ScrollReveal direction="left" delay={0.1}>
                  <FluidGlass className="rounded-lg" intensity={0.2}>
                    <Card className="bg-card/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-6 w-6 text-primary" />
                          Property Details
                        </CardTitle>
                        <CardDescription>
                          Enter your property information to get an instant valuation
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Location */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Location
                          </Label>
                          <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((loc) => (
                                <SelectItem key={loc} value={loc}>
                                  {loc}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Property Type */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            Property Type
                          </Label>
                          <Select value={propertyType} onValueChange={setPropertyType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              {propertyTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Bedrooms */}
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Bed className="h-4 w-4 text-muted-foreground" />
                              Bedrooms
                            </Label>
                            <Select value={bedrooms} onValueChange={setBedrooms}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bedrooms" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="studio">Studio</SelectItem>
                                <SelectItem value="1">1 Bedroom</SelectItem>
                                <SelectItem value="2">2 Bedrooms</SelectItem>
                                <SelectItem value="3">3 Bedrooms</SelectItem>
                                <SelectItem value="4">4 Bedrooms</SelectItem>
                                <SelectItem value="5">5+ Bedrooms</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Area */}
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Maximize className="h-4 w-4 text-muted-foreground" />
                              Area (sqft)
                            </Label>
                            <Input
                              type="number"
                              placeholder="Enter area in sqft"
                              value={area}
                              onChange={(e) => setArea(e.target.value)}
                            />
                          </div>
                        </div>

                        <Button 
                          onClick={handleCalculate}
                          className="w-full"
                          size="lg"
                          disabled={!location || !propertyType || !area || isCalculating}
                        >
                          {isCalculating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Calculating...
                            </>
                          ) : (
                            <>
                              <BarChart3 className="h-5 w-5 mr-2" />
                              Get Valuation
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              </div>

              {/* Results Panel */}
              <div className="space-y-6">
                {showResult && valuation ? (
                  <>
                    <ScrollReveal direction="right" delay={0.2}>
                      <FluidGlass className="rounded-lg" intensity={0.25}>
                        <Card className="bg-primary text-primary-foreground">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-center text-lg">Estimated Value</CardTitle>
                          </CardHeader>
                          <CardContent className="text-center">
                            <div className="text-4xl font-bold mb-2">
                              {formatCurrency(valuation.estimatedValue)}
                            </div>
                            <p className="text-primary-foreground/80 text-sm">
                              Range: {formatCurrency(valuation.lowEstimate)} - {formatCurrency(valuation.highEstimate)}
                            </p>
                          </CardContent>
                        </Card>
                      </FluidGlass>
                    </ScrollReveal>

                    <ScrollReveal direction="right" delay={0.3}>
                      <FluidGlass className="rounded-lg" intensity={0.2}>
                        <Card className="bg-card/80 backdrop-blur-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Market Insights</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Price/sqft
                              </span>
                              <span className="font-semibold">
                                AED {valuation.pricePerSqft.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Avg. in Area
                              </span>
                              <span className="font-semibold">
                                {formatCurrency(valuation.avgPrice)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                YoY Trend
                              </span>
                              <span className="font-semibold text-green-500">
                                +{valuation.trend}%
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </FluidGlass>
                    </ScrollReveal>

                    <ScrollReveal direction="right" delay={0.4}>
                      <FluidGlass className="rounded-lg" intensity={0.2}>
                        <Card className="bg-card/80 backdrop-blur-sm">
                          <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4">
                              Ready to list your property? Connect with verified agents in your area.
                            </p>
                            <Link href="/agents">
                              <Button className="w-full" variant="outline">
                                Find an Agent
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </FluidGlass>
                    </ScrollReveal>
                  </>
                ) : (
                  <ScrollReveal direction="right" delay={0.2}>
                    <FluidGlass className="rounded-lg" intensity={0.2}>
                      <Card className="bg-card/80 backdrop-blur-sm">
                        <CardContent className="pt-6 text-center">
                          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                          <h3 className="font-semibold mb-2">Enter Property Details</h3>
                          <p className="text-sm text-muted-foreground">
                            Fill in the form to get an instant property valuation based on current market data.
                          </p>
                        </CardContent>
                      </Card>
                    </FluidGlass>
                  </ScrollReveal>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">How HomeHNI Valuation Works</h2>
              </FluidGlass>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { 
                  icon: <Building2 className="h-8 w-8" />, 
                  step: "1",
                  title: "Enter Details", 
                  description: "Provide your property location, type, and size" 
                },
                { 
                  icon: <BarChart3 className="h-8 w-8" />, 
                  step: "2",
                  title: "AI Analysis", 
                  description: "Our algorithm analyzes thousands of recent transactions" 
                },
                { 
                  icon: <TrendingUp className="h-8 w-8" />, 
                  step: "3",
                  title: "Market Comparison", 
                  description: "Compare with similar properties in your area" 
                },
                { 
                  icon: <CheckCircle className="h-8 w-8" />, 
                  step: "4",
                  title: "Get Estimate", 
                  description: "Receive your property's estimated market value" 
                },
              ].map((item, index) => (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                    <Card className="h-full bg-card/80 backdrop-blur-sm text-center">
                      <CardContent className="pt-6">
                        <div className="relative inline-block mb-4">
                          <div className="flex justify-center text-primary">{item.icon}</div>
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold">
                            {item.step}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-6" intensity={0.15}>
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Important Disclaimer</h3>
                    <p className="text-sm text-muted-foreground">
                      The HomeHNI Valuation tool provides an estimated market value based on 
                      publicly available data and comparable properties. This estimate is for 
                      informational purposes only and should not be considered as professional 
                      appraisal advice. For accurate property valuation, please consult with 
                      a RERA-certified valuer. Actual sale prices may vary based on property 
                      condition, market conditions, and negotiation.
                    </p>
                  </div>
                </div>
              </FluidGlass>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-12 text-center" intensity={0.3}>
                <h2 className="text-3xl font-bold mb-4">Ready to Sell or Rent Your Property?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  List your property with HomeHNI and reach thousands of potential buyers and tenants.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/properties/new">
                    <Button size="lg">
                      List Your Property
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/agents">
                    <Button size="lg" variant="outline">
                      Find an Agent
                    </Button>
                  </Link>
                </div>
              </FluidGlass>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
