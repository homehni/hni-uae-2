import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, MessageSquare, Building2, Users, Headphones } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: ["+971 4 123 4567", "+971 4 123 4568"],
      action: { label: "Call Now", href: "tel:+97141234567" },
    },
    {
      icon: <SiWhatsapp className="h-6 w-6" />,
      title: "WhatsApp",
      details: ["+971 50 123 4567"],
      action: { label: "Chat on WhatsApp", href: "https://wa.me/971501234567" },
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["support@homehni.ae", "sales@homehni.ae"],
      action: { label: "Send Email", href: "mailto:support@homehni.ae" },
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Working Hours",
      details: ["Sunday - Thursday: 9AM - 6PM", "Friday - Saturday: 10AM - 4PM"],
    },
  ];

  const departments = [
    { icon: <Building2 className="h-8 w-8" />, name: "Sales", email: "sales@homehni.ae", description: "For property inquiries and listings" },
    { icon: <Users className="h-8 w-8" />, name: "Agent Support", email: "agents@homehni.ae", description: "For registered agents and agencies" },
    { icon: <Headphones className="h-8 w-8" />, name: "Customer Support", email: "support@homehni.ae", description: "For general inquiries and help" },
    { icon: <MessageSquare className="h-8 w-8" />, name: "Feedback", email: "feedback@homehni.ae", description: "Share your suggestions with us" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <ScrollReveal direction="up" delay={0.1}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions or need assistance? Our team is here to help you 
                find your perfect property in the UAE.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <ScrollReveal direction="left" delay={0.1}>
                <FluidGlass className="rounded-lg" intensity={0.2}>
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Send us a Message</CardTitle>
                      <CardDescription>
                        Fill out the form below and we'll get back to you within 24 hours.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+971 50 123 4567"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Select
                              value={formData.subject}
                              onValueChange={(value) => setFormData({ ...formData, subject: value })}
                            >
                              <SelectTrigger id="subject">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="property">Property Inquiry</SelectItem>
                                <SelectItem value="agent">Become an Agent</SelectItem>
                                <SelectItem value="advertise">Advertise with Us</SelectItem>
                                <SelectItem value="support">Technical Support</SelectItem>
                                <SelectItem value="feedback">Feedback</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="How can we help you?"
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </FluidGlass>
              </ScrollReveal>

              {/* Contact Info */}
              <div className="space-y-6">
                <ScrollReveal direction="right" delay={0.1}>
                  <FluidGlass className="rounded-lg p-4 mb-6" intensity={0.2}>
                    <h2 className="text-2xl font-bold">Get in Touch</h2>
                    <p className="text-muted-foreground mt-2">
                      Choose your preferred way to contact us
                    </p>
                  </FluidGlass>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactInfo.map((info, index) => (
                    <ScrollReveal key={index} direction="right" delay={0.1 + index * 0.05}>
                      <FluidGlass className="h-full rounded-lg" intensity={0.15}>
                        <Card className="h-full bg-card/80 backdrop-blur-sm">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-3 text-primary">
                              {info.icon}
                              <h3 className="font-semibold">{info.title}</h3>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground mb-3">
                              {info.details.map((detail, i) => (
                                <p key={i}>{detail}</p>
                              ))}
                            </div>
                            {info.action && (
                              <a href={info.action.href} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="w-full">
                                  {info.action.label}
                                </Button>
                              </a>
                            )}
                          </CardContent>
                        </Card>
                      </FluidGlass>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Departments */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">Our Departments</h2>
                <p className="text-muted-foreground mt-2">
                  Reach out to the right team for faster assistance
                </p>
              </FluidGlass>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept, index) => (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                    <Card className="h-full bg-card/80 backdrop-blur-sm text-center">
                      <CardContent className="pt-6">
                        <div className="flex justify-center mb-4 text-primary">{dept.icon}</div>
                        <h3 className="font-semibold text-lg mb-2">{dept.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
                        <a href={`mailto:${dept.email}`} className="text-primary hover:underline text-sm">
                          {dept.email}
                        </a>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">Visit Our Offices</h2>
                <p className="text-muted-foreground mt-2">
                  Drop by any of our offices across the UAE
                </p>
              </FluidGlass>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  city: "Dubai (Head Office)",
                  address: "Sheikh Zayed Road, Business Bay Tower, Floor 25",
                  phone: "+971 4 123 4567",
                  mapUrl: "https://maps.google.com/?q=Dubai+Business+Bay",
                },
                {
                  city: "Abu Dhabi",
                  address: "Al Maryah Island, ADGM Tower, Floor 15",
                  phone: "+971 2 123 4567",
                  mapUrl: "https://maps.google.com/?q=Abu+Dhabi+Al+Maryah+Island",
                },
                {
                  city: "Sharjah",
                  address: "Al Majaz Waterfront, Tower 1, Floor 10",
                  phone: "+971 6 123 4567",
                  mapUrl: "https://maps.google.com/?q=Sharjah+Al+Majaz",
                },
              ].map((office, index) => (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                    <Card className="h-full bg-card/80 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">{office.city}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">{office.address}</p>
                        <p className="text-primary font-medium mb-4">{office.phone}</p>
                        <a href={office.mapUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="w-full">
                            <MapPin className="h-4 w-4 mr-2" />
                            View on Map
                          </Button>
                        </a>
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
