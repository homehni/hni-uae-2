import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, Star } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Agent } from "@shared/schema";
import { FluidGlass } from "@/components/reactbits/FluidGlass";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <FluidGlass className="rounded-lg" intensity={0.15}>
      <Card className="hover-elevate bg-card/80 backdrop-blur-sm" data-testid={`card-agent-${agent.id}`}>
        <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={agent.photo ?? undefined} alt={agent.name} />
            <AvatarFallback>{getInitials(agent.name)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg" data-testid={`text-agent-name-${agent.id}`}>
                  {agent.name}
                </h3>
                <p className="text-sm text-muted-foreground">{agent.company}</p>
              </div>
              {agent.verified && (
                <Badge variant="default" className="bg-primary" data-testid={`badge-verified-${agent.id}`}>
                  Verified
                </Badge>
              )}
            </div>

            {/* Rating */}
            {(agent.rating ?? 0) > 0 && (
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < (agent.rating ?? 0)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {agent.properties} properties
                </span>
              </div>
            )}

            {/* Contact Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" data-testid={`button-call-${agent.id}`}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm" data-testid={`button-whatsapp-agent-${agent.id}`}>
                <SiWhatsapp className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="outline" size="sm" data-testid={`button-email-${agent.id}`}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </div>
        </CardContent>
      </Card>
    </FluidGlass>
  );
}
