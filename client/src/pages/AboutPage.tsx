import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Globe, Award, Target, Heart, MapPin, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export default function AboutPage() {
  const stats = [
    { label: "Properties Listed", value: "50,000+", icon: <Building2 className="h-8 w-8" /> },
    { label: "Happy Customers", value: "100,000+", icon: <Users className="h-8 w-8" /> },
    { label: "Cities Covered", value: "7", icon: <MapPin className="h-8 w-8" /> },
    { label: "Years of Experience", value: "10+", icon: <Award className="h-8 w-8" /> },
  ];

  const values = [
    {
      icon: <Target className="h-12 w-12 text-primary" />,
      title: "Our Mission",
      description: "To make property search seamless and transparent for everyone in the UAE, connecting buyers, sellers, and renters with the perfect properties.",
    },
    {
      icon: <Heart className="h-12 w-12 text-primary" />,
      title: "Our Values",
      description: "Trust, transparency, and customer satisfaction are at the core of everything we do. We believe in building lasting relationships.",
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-primary" />,
      title: "Our Vision",
      description: "To be the most trusted real estate platform in the Middle East, empowering millions to find their dream homes.",
    },
  ];

  const team = [
    { name: "Ahmed Al Mansoor", role: "CEO & Founder", image: "https://ui-avatars.com/api/?name=Ahmed+Al+Mansoor&background=22c55e&color=fff" },
    { name: "Sarah Thompson", role: "Chief Operating Officer", image: "https://ui-avatars.com/api/?name=Sarah+Thompson&background=22c55e&color=fff" },
    { name: "Mohammed Hassan", role: "Head of Sales", image: "https://ui-avatars.com/api/?name=Mohammed+Hassan&background=22c55e&color=fff" },
    { name: "Emily Chen", role: "Chief Technology Officer", image: "https://ui-avatars.com/api/?name=Emily+Chen&background=22c55e&color=fff" },
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6">About HomeHNI</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                UAE's leading real estate platform, connecting millions of property seekers 
                with their dream homes since 2014. We're committed to making property search 
                simple, transparent, and enjoyable.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/properties">
                  <Button size="lg">Browse Properties</Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">Contact Us</Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 -mt-8">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.2}>
              <FluidGlass className="rounded-lg p-8" intensity={0.2}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-4 text-primary">{stat.icon}</div>
                      <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </FluidGlass>
            </ScrollReveal>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left" delay={0.1}>
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      HomeHNI was founded in 2014 with a simple mission: to revolutionize 
                      the way people find properties in the UAE. What started as a small 
                      startup has grown into the region's most trusted real estate platform.
                    </p>
                    <p>
                      Our founders recognized the challenges faced by property seekers – 
                      from unreliable listings to lack of transparency. They set out to 
                      create a platform that prioritizes trust, accuracy, and user experience.
                    </p>
                    <p>
                      Today, HomeHNI connects millions of users with thousands of verified 
                      properties across the UAE. Our innovative features like TruCheck™ 
                      verification and comprehensive market insights have set new standards 
                      in the industry.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.2}>
                <FluidGlass className="rounded-lg overflow-hidden" intensity={0.2}>
                  <img
                    src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop"
                    alt="Dubai Skyline"
                    className="w-full h-80 object-cover"
                  />
                </FluidGlass>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Mission, Values, Vision */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">What Drives Us</h2>
              </FluidGlass>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                    <Card className="h-full bg-card/80 backdrop-blur-sm text-center">
                      <CardContent className="pt-8 pb-6">
                        <div className="flex justify-center mb-4">{value.icon}</div>
                        <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">Our Leadership Team</h2>
                <p className="text-muted-foreground mt-2">Meet the people driving HomeHNI's success</p>
              </FluidGlass>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <FluidGlass className="rounded-lg" intensity={0.2}>
                    <Card className="bg-card/80 backdrop-blur-sm text-center">
                      <CardContent className="pt-6 pb-6">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4"
                        />
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">Our Offices</h2>
                <p className="text-muted-foreground mt-2">Find us across the UAE</p>
              </FluidGlass>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { city: "Dubai", address: "Sheikh Zayed Road, Business Bay Tower, Floor 25", phone: "+971 4 123 4567" },
                { city: "Abu Dhabi", address: "Al Maryah Island, ADGM Tower, Floor 15", phone: "+971 2 123 4567" },
                { city: "Sharjah", address: "Al Majaz Waterfront, Tower 1, Floor 10", phone: "+971 6 123 4567" },
              ].map((office, index) => (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <FluidGlass className="rounded-lg" intensity={0.2}>
                    <Card className="bg-card/80 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">{office.city}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">{office.address}</p>
                        <p className="text-primary font-medium">{office.phone}</p>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-12 text-center" intensity={0.3}>
                <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join millions of happy customers who found their perfect home with HomeHNI
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/properties">
                    <Button size="lg">Start Searching</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" variant="outline">Create Account</Button>
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
