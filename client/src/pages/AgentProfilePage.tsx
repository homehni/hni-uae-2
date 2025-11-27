import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Phone,
  Mail,
  MapPin,
  Building2,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Award,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Agent, Property } from "@shared/schema";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export default function AgentProfilePage() {
  const [, params] = useRoute("/agent/:id");
  const agentId = params?.id;

  const { data: agent, isLoading: loadingAgent } = useQuery<Agent>({
    queryKey: ["/api/agents", agentId],
    enabled: !!agentId,
  });

  const { data: properties, isLoading: loadingProperties } = useQuery<Property[]>({
    queryKey: ["/api/properties", { agentId }],
    enabled: !!agentId,
  });

  if (loadingAgent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="h-80 w-full md:w-80" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Agent not found</h1>
            <p className="text-muted-foreground mb-6">
              The agent profile you're looking for doesn't exist.
            </p>
            <Link href="/agents">
              <Button>Browse Agents</Button>
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
      <main className="flex-1 relative overflow-hidden">
        <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />
        
        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          {/* Agent Profile Header */}
          <ScrollReveal direction="up" delay={0.1}>
            <FluidGlass className="rounded-lg p-8 mb-8" intensity={0.2}>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Agent Photo */}
                <div className="relative">
                  <img
                    src={agent.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=22c55e&color=fff&size=200`}
                    alt={agent.name}
                    className="h-48 w-48 rounded-lg object-cover border-4 border-primary/20"
                  />
                  {agent.verified && (
                    <Badge className="absolute -top-2 -right-2 bg-primary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Agent Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{agent.name}</h1>
                      <p className="text-lg text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {agent.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{agent.rating || 0}/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{agent.properties || 0}</div>
                      <div className="text-sm text-muted-foreground">Properties</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{agent.rating || 0}</div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">5+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground">Deals Closed</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Agent
                    </Button>
                    <Button variant="outline">
                      <SiWhatsapp className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </FluidGlass>
          </ScrollReveal>

          {/* Content Tabs */}
          <Tabs defaultValue="listings" className="space-y-6">
            <ScrollReveal direction="up" delay={0.2}>
              <FluidGlass className="rounded-lg p-2" intensity={0.15}>
                <TabsList className="w-full justify-start bg-transparent">
                  <TabsTrigger value="listings">Listings ({properties?.length || 0})</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
              </FluidGlass>
            </ScrollReveal>

            <TabsContent value="listings">
              {loadingProperties ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-80 w-full" />
                  ))}
                </div>
              ) : properties && properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property, index) => (
                    <ScrollReveal key={property.id} direction="up" delay={index * 0.05}>
                      <PropertyCard property={property} />
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <FluidGlass className="rounded-lg p-12 text-center" intensity={0.15}>
                  <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                  <p className="text-muted-foreground">
                    This agent doesn't have any active listings at the moment.
                  </p>
                </FluidGlass>
              )}
            </TabsContent>

            <TabsContent value="about">
              <ScrollReveal direction="up" delay={0.1}>
                <FluidGlass className="rounded-lg" intensity={0.2}>
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>About {agent.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {agent.name} is a verified real estate professional at {agent.company}. 
                        With extensive experience in the UAE property market, they specialize in 
                        helping clients find their perfect home or investment property across Dubai, 
                        Abu Dhabi, and other emirates.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Specializations</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Residential</Badge>
                            <Badge variant="secondary">Luxury Properties</Badge>
                            <Badge variant="secondary">Off-Plan</Badge>
                            <Badge variant="secondary">Investment</Badge>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Areas Covered</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Dubai Marina</Badge>
                            <Badge variant="outline">Downtown Dubai</Badge>
                            <Badge variant="outline">Palm Jumeirah</Badge>
                            <Badge variant="outline">Business Bay</Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Languages</h4>
                        <p className="text-muted-foreground">English, Arabic, Hindi</p>
                      </div>
                    </CardContent>
                  </Card>
                </FluidGlass>
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="reviews">
              <ScrollReveal direction="up" delay={0.1}>
                <FluidGlass className="rounded-lg" intensity={0.2}>
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Client Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        {
                          name: "Ahmed K.",
                          rating: 5,
                          date: "2 weeks ago",
                          comment: "Excellent service! Very professional and helped us find our dream apartment in Dubai Marina."
                        },
                        {
                          name: "Sarah M.",
                          rating: 5,
                          date: "1 month ago",
                          comment: "Highly recommended! Very knowledgeable about the market and responsive to all our queries."
                        },
                        {
                          name: "John D.",
                          rating: 4,
                          date: "2 months ago",
                          comment: "Great experience working with this agent. Made the whole process smooth and hassle-free."
                        }
                      ].map((review, index) => (
                        <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-semibold text-primary">{review.name[0]}</span>
                              </div>
                              <div>
                                <div className="font-semibold">{review.name}</div>
                                <div className="text-sm text-muted-foreground">{review.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </FluidGlass>
              </ScrollReveal>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
