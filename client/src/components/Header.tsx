import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, MapPin, User, Menu, Home, Users, Building2, LayoutDashboard, LogOut, Calculator, Compass, Wrench, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LogoLoop } from "@/components/reactbits/LogoLoop";
import { PillNav } from "@/components/reactbits/PillNav";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [location, setLocation] = useLocation();
  const [listingType, setListingType] = useState<"Sale" | "Rent">("Sale");
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b relative overflow-hidden">
      <ChromaGrid className="opacity-20" cellSize={40} />
      <FluidGlass className="bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer" data-testid="link-home">
              <LogoLoop text="HomeHNI" className="text-2xl font-bold text-primary" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            <PillNav
              items={[
                { label: "Buy", value: "Sale", icon: <Home className="w-4 h-4" /> },
                { label: "Rent", value: "Rent", icon: <Home className="w-4 h-4" /> },
              ]}
              defaultValue={listingType}
              onChange={(value) => {
                setListingType(value as "Sale" | "Rent");
                setLocation(`/properties?listingType=${value}`);
              }}
            />
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    <Building2 className="w-4 h-4 mr-2" />
                    Properties
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <Link href="/properties?completionStatus=Off-Plan">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">New Projects</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Explore off-plan properties and new developments
                          </p>
                        </NavigationMenuLink>
                      </Link>
                      <Link href="/properties?propertyType=Villa">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Villas</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Luxury villas across UAE
                          </p>
                        </NavigationMenuLink>
                      </Link>
                      <Link href="/properties?propertyType=Apartment">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Apartments</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Find apartments for sale and rent
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/agents">
                    <Button variant="ghost" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Agents
                    </Button>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    <Compass className="w-4 h-4 mr-2" />
                    Explore
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <Link href="/area-guides">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Area Guides</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Discover neighborhoods across UAE
                          </p>
                        </NavigationMenuLink>
                      </Link>
                      <Link href="/mortgage-calculator">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Mortgage Calculator</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Calculate your mortgage payments
                          </p>
                        </NavigationMenuLink>
                      </Link>
                      <Link href="/services">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Home Services</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Movers, cleaners, interior designers, and more
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex" data-testid="button-search">
              <Search className="h-5 w-5" />
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-user-menu">
                    <User className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">{user?.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-properties" className="flex items-center cursor-pointer">
                      <Building2 className="h-4 w-4 mr-2" />
                      My Properties
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="button-signin">
                    <User className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">Sign In</span>
                  </Button>
                </Link>
                <Link href="/register" className="hidden md:block">
                  <Button size="sm" data-testid="button-register">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" data-testid="button-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/properties?listingType=Sale">
                    <Button variant="ghost" className="w-full justify-start" data-testid="link-mobile-buy">
                      <Home className="h-4 w-4 mr-2" />
                      Buy Properties
                    </Button>
                  </Link>
                  <Link href="/properties?listingType=Rent">
                    <Button variant="ghost" className="w-full justify-start" data-testid="link-mobile-rent">
                      <Home className="h-4 w-4 mr-2" />
                      Rent Properties
                    </Button>
                  </Link>
                  <Link href="/properties?completionStatus=Off-Plan">
                    <Button variant="ghost" className="w-full justify-start">
                      <Building2 className="h-4 w-4 mr-2" />
                      New Projects
                    </Button>
                  </Link>
                  <Link href="/agents">
                    <Button variant="ghost" className="w-full justify-start" data-testid="link-mobile-agents">
                      <Users className="h-4 w-4 mr-2" />
                      Find Agent
                    </Button>
                  </Link>
                  <Link href="/area-guides">
                    <Button variant="ghost" className="w-full justify-start">
                      <Compass className="h-4 w-4 mr-2" />
                      Area Guides
                    </Button>
                  </Link>
                  <Link href="/mortgage-calculator">
                    <Button variant="ghost" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-2" />
                      Mortgage Calculator
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="ghost" className="w-full justify-start">
                      <Wrench className="h-4 w-4 mr-2" />
                      Home Services
                    </Button>
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full">
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        </div>
      </FluidGlass>
    </header>
  );
}
