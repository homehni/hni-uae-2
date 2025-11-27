import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Star, Phone, Building2, CheckCircle2 } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Link } from "wouter";
import type { Agent } from "@shared/schema";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const cities = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];

  const filteredAgents = agents?.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />
        
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Trusted Real Estate Agents</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Connect with verified real estate professionals across the UAE. 
                  Our agents are here to help you find your perfect property.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <FluidGlass className="rounded-lg p-6 max-w-3xl mx-auto" intensity={0.2}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by agent name or company..."
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
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
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

        {/* Agents Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-8" intensity={0.15}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {isLoading ? "Loading agents..." : `${filteredAgents.length} Agents Found`}
                  </h2>
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="properties">Most Properties</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FluidGlass>
            </ScrollReveal>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent, index) => (
                  <ScrollReveal key={agent.id} direction="up" delay={index * 0.05}>
                    <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                      <Card className="h-full bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <img
                                src={agent.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=22c55e&color=fff&size=80`}
                                alt={agent.name}
                                className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
                              />
                              {agent.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1">
                                  <CheckCircle2 className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg truncate">{agent.name}</h3>
                                {agent.verified && (
                                  <Badge variant="default" className="bg-primary text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                                <Building2 className="h-3 w-3" />
                                {agent.company}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {agent.rating || 0}/5
                                </span>
                                <span>{agent.properties || 0} Properties</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <SiWhatsapp className="h-4 w-4 mr-2" />
                              WhatsApp
                            </Button>
                            <Link href={`/agent/${agent.id}`}>
                              <Button size="sm">View Profile</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </FluidGlass>
                  </ScrollReveal>
                ))}
              </div>
            )}

            {!isLoading && filteredAgents.length === 0 && (
              <FluidGlass className="rounded-lg p-12" intensity={0.15}>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2">No agents found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search criteria
                  </p>
                  <Button onClick={() => { setSearchQuery(""); setSelectedCity("all"); }}>
                    Clear Filters
                  </Button>
                </div>
              </FluidGlass>
            )}
          </div>
        </section>

        {/* Why Choose Our Agents */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">Why Choose HomeHNI Agents?</h2>
              </FluidGlass>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <CheckCircle2 className="h-12 w-12 text-primary" />,
                  title: "Verified Professionals",
                  description: "All our agents are thoroughly vetted and verified to ensure you work with trusted professionals."
                },
                {
                  icon: <Star className="h-12 w-12 text-primary" />,
                  title: "Top-Rated Service",
                  description: "Our agents consistently receive high ratings from clients for their exceptional service."
                },
                {
                  icon: <MapPin className="h-12 w-12 text-primary" />,
                  title: "Local Expertise",
                  description: "Deep knowledge of UAE real estate markets to help you make informed decisions."
                }
              ].map((feature, index) => (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <FluidGlass className="rounded-lg" intensity={0.2}>
                    <Card className="bg-card/80 backdrop-blur-sm text-center">
                      <CardContent className="pt-8 pb-6">
                        <div className="flex justify-center mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
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
