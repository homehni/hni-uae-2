import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, MapPin, User, Menu, Home, Users, Building2, LayoutDashboard, LogOut } from "lucide-react";
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
          <nav className="hidden md:flex items-center gap-4 flex-1 justify-center">
            <PillNav
              items={[
                { label: "Buy", value: "Sale", icon: <Home className="w-4 h-4" /> },
                { label: "Rent", value: "Rent", icon: <Home className="w-4 h-4" /> },
              ]}
              defaultValue={listingType}
              onChange={(value) => setListingType(value as "Sale" | "Rent")}
            />
            <Link href="/properties">
              <Button variant="ghost" size="sm" data-testid="link-find-agent">
                <Users className="w-4 h-4 mr-2" />
                Find Agent
              </Button>
            </Link>
            <Link href="/properties?featured=true">
              <Button variant="ghost" size="sm" data-testid="link-new-projects">
                <Building2 className="w-4 h-4 mr-2" />
                New Projects
              </Button>
            </Link>
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
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/properties?listingType=Sale">
                    <Button variant="ghost" className="w-full justify-start" data-testid="link-mobile-buy">
                      Buy Properties
                    </Button>
                  </Link>
                  <Link href="/properties?listingType=Rent">
                    <Button variant="ghost" className="w-full justify-start" data-testid="link-mobile-rent">
                      Rent Properties
                    </Button>
                  </Link>
                  <Link href="/properties">
                    <Button variant="ghost" className="w-full justify-start" data-testid="link-mobile-agents">
                      Find Agent
                    </Button>
                  </Link>
                  <Link href="/properties?featured=true">
                    <Button variant="ghost" className="w-full justify-start" data-testid="link-mobile-projects">
                      New Projects
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
