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
import LeadsPage from "@/pages/LeadsPage";
import WalletPage from "@/pages/WalletPage";
import MyPropertiesPage from "@/pages/MyPropertiesPage";
import PropertyFormPage from "@/pages/PropertyFormPage";
import AgentsPage from "@/pages/AgentsPage";
import AgentProfilePage from "@/pages/AgentProfilePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import MortgageCalculatorPage from "@/pages/MortgageCalculatorPage";
import AreaGuidesPage from "@/pages/AreaGuidesPage";
import ServicesPage from "@/pages/ServicesPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import NotFound from "@/pages/not-found";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/properties" component={PropertyListings} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/agents" component={AgentsPage} />
      <Route path="/agent/:id" component={AgentProfilePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/mortgage-calculator" component={MortgageCalculatorPage} />
      <Route path="/area-guides" component={AreaGuidesPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/terms" component={TermsOfServicePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/leads" component={LeadsPage} />
      <Route path="/wallet" component={WalletPage} />
      <Route path="/my-properties" component={MyPropertiesPage} />
      <Route path="/properties/new" component={PropertyFormPage} />
      <Route path="/properties/:id/edit" component={PropertyFormPage} />
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
