import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About Bayut</h3>
            <p className="text-sm text-muted-foreground mb-4">
              UAE's leading property portal connecting buyers, sellers, and renters with verified listings and trusted agents.
            </p>
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
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Property Types</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?propertyType=Apartment">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block" data-testid="link-footer-apartments">
                    Apartments
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=Villa">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block" data-testid="link-footer-villas">
                    Villas
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=Townhouse">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block" data-testid="link-footer-townhouses">
                    Townhouses
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=Penthouse">
                  <span className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md -ml-2 cursor-pointer inline-block" data-testid="link-footer-penthouses">
                    Penthouses
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest property listings and market insights.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Your email" type="email" data-testid="input-newsletter" />
              <Button data-testid="button-subscribe">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>
            © 2024 Bayut UAE. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground" data-testid="link-privacy">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground" data-testid="link-terms">
              Terms of Use
            </a>
            <a href="#" className="hover:text-foreground" data-testid="link-contact">
              Contact Us
            </a>
          </div>
        </div>
        </div>
      </FluidGlass>
    </footer>
  );
}
