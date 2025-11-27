import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { GlassIcons } from "@/components/reactbits/GlassIcons";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export function Footer() {
  return (
    <footer className="border-t mt-20 relative overflow-hidden">
      <ChromaGrid className="opacity-10 absolute inset-0" cellSize={45} />
      <FluidGlass className="bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* About */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-xl mb-4 text-primary">HomeHNI</h3>
            <p className="text-sm text-muted-foreground mb-4">
              UAE's trusted real estate platform connecting buyers, sellers, and renters with 
              verified listings and professional agents. Find your dream home with HomeHNI.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+971 4 123 4567</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Mail className="h-4 w-4" />
              <span>info@homehni.ae</span>
            </div>
            <GlassIcons
              icons={[
                { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
                { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
                { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
                { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
              ]}
            />
          </div>

          {/* Popular Searches */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Searches</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?city=Dubai">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block" data-testid="link-footer-dubai">
                    Properties in Dubai
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/properties?location=Dubai Marina">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block" data-testid="link-footer-marina">
                    Dubai Marina
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/properties?location=Downtown Dubai">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block" data-testid="link-footer-downtown">
                    Downtown Dubai
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Abu Dhabi">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block" data-testid="link-footer-abudhabi">
                    Properties in Abu Dhabi
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/properties?completionStatus=Off-Plan">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block">
                    New Projects
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/agents">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block">
                    Find Agents
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/area-guides">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block">
                    Area Guides
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/mortgage-calculator">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block">
                    Mortgage Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block">
                    Home Services
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block">
                    Contact Us
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest property listings and market insights delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Your email" type="email" data-testid="input-newsletter" />
              <Button data-testid="button-subscribe">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>
            © 2024 HomeHNI. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy">
              <span className="hover:text-foreground cursor-pointer" data-testid="link-privacy">
                Privacy Policy
              </span>
            </Link>
            <Link href="/terms">
              <span className="hover:text-foreground cursor-pointer" data-testid="link-terms">
                Terms of Use
              </span>
            </Link>
            <Link href="/contact">
              <span className="hover:text-foreground cursor-pointer" data-testid="link-contact">
                Contact Us
              </span>
            </Link>
          </div>
        </div>
        </div>
      </FluidGlass>
    </footer>
  );
}
