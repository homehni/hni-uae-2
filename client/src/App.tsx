import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "@/pages/HomePage";
import PropertyListings from "@/pages/PropertyListings";
import PropertyDetail from "@/pages/PropertyDetail";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/not-found";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/properties" component={PropertyListings} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="relative min-h-screen">
            <ChromaGrid className="fixed inset-0 opacity-5 pointer-events-none z-0" cellSize={80} />
            <div className="relative z-10">
              <Toaster />
              <Router />
            </div>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
