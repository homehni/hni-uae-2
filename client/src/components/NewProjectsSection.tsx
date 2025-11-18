import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiWhatsapp } from "react-icons/si";
import { MapPin, Home, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { TiltedCard } from "@/components/reactbits/TiltedCard";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

interface NewProjectsSectionProps {
  projects: Property[];
}

export function NewProjectsSection({ projects }: NewProjectsSectionProps) {
  const cities = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];
  const [activeCity, setActiveCity] = useState("Dubai");

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(2)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  const getProjectsByCity = (city: string) => {
    return projects.filter((p) => p.city === city && p.completionStatus === "Off-Plan");
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <ScrollReveal direction="up" delay={0.1}>
          <FluidGlass className="rounded-lg p-4 mb-8" intensity={0.2}>
            <h2 className="text-3xl font-bold text-white">Browse New Projects in the UAE</h2>
          </FluidGlass>
        </ScrollReveal>

        <FluidGlass className="rounded-lg p-4 mb-6" intensity={0.15}>
          <Tabs value={activeCity} onValueChange={setActiveCity}>
            <TabsList className="mb-6 flex-wrap h-auto bg-background/60">
            {cities.map((city) => (
              <TabsTrigger key={city} value={city} data-testid={`tab-city-${city.toLowerCase().replace(/\s+/g, '-')}`}>
                {city}
              </TabsTrigger>
            ))}
          </TabsList>

          {cities.map((city) => (
            <TabsContent key={city} value={city}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getProjectsByCity(city).slice(0, 6).map((project, index) => (
                  <ScrollReveal key={project.id} direction="up" delay={index * 0.1}>
                    <TiltedCard intensity={10} className="h-full">
                      <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                        <Link href={`/property/${project.id}`}>
                          <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full bg-card/80" data-testid={`card-project-${project.id}`}>
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={project.images?.[0] || `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(project.title)}`}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(project.title)}`;
                          }}
                        />
                        {project.featured && (
                          <Badge
                            variant="default"
                            className="absolute top-3 left-3 bg-primary"
                          >
                            New Project
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-1" data-testid={`text-project-title-${project.id}`}>
                          {project.building || project.title}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Home className="h-4 w-4" />
                          <span>{project.propertyType}s</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {project.subarea}, {project.location}, {project.city}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Launch Price</div>
                            <div className="font-semibold">
                              AED {formatPrice(project.launchPrice || project.price)}
                            </div>
                          </div>
                          {project.handoverDate && (
                            <div>
                              <div className="text-muted-foreground">Handover</div>
                              <div className="font-semibold">{project.handoverDate}</div>
                            </div>
                          )}
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          data-testid={`button-whatsapp-project-${project.id}`}
                        >
                          <SiWhatsapp className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                      </CardContent>
                    </Card>
                        </Link>
                      </FluidGlass>
                    </TiltedCard>
                  </ScrollReveal>
                ))}
              </div>

              {getProjectsByCity(city).length > 6 && (
                <FluidGlass className="rounded-lg p-4 mt-8" intensity={0.15}>
                  <div className="text-center">
                    <Link href={`/properties?city=${city}&completionStatus=Off-Plan`}>
                      <Button variant="outline" data-testid={`button-view-all-${city.toLowerCase().replace(/\s+/g, '-')}`}>
                        View all new projects in {city}
                      </Button>
                    </Link>
                  </div>
                </FluidGlass>
              )}
            </TabsContent>
          ))}
          </Tabs>
        </FluidGlass>
      </div>
    </section>
  );
}
