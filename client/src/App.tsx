import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/HomePage";
import PropertyListings from "@/pages/PropertyListings";
import PropertyDetail from "@/pages/PropertyDetail";
import NotFound from "@/pages/not-found";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/properties" component={PropertyListings} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative min-h-screen">
          <ChromaGrid className="fixed inset-0 opacity-5 pointer-events-none z-0" cellSize={80} />
          <div className="relative z-10">
            <Toaster />
            <Router />
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
