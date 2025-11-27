import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, TrendingUp, DollarSign, Calendar, Percent, Info, Home, PiggyBank } from "lucide-react";
import { Link } from "wouter";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export default function MortgageCalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(25);
  const [loanTerm, setLoanTerm] = useState(25);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanType, setLoanType] = useState("conventional");

  const calculations = useMemo(() => {
    const principal = propertyPrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly payment using the mortgage formula
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    return {
      loanAmount: principal,
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalPayment: isNaN(totalPayment) ? 0 : totalPayment,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      downPaymentAmount: propertyPrice * (downPayment / 100),
    };
  }, [propertyPrice, downPayment, loanTerm, interestRate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const banks = [
    { name: "Emirates NBD", rate: "4.25%", logo: "ENBD" },
    { name: "Abu Dhabi Commercial Bank", rate: "4.35%", logo: "ADCB" },
    { name: "Mashreq Bank", rate: "4.50%", logo: "MSQ" },
    { name: "Dubai Islamic Bank", rate: "4.75%", logo: "DIB" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />

        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <ScrollReveal direction="up" delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Mortgage Calculator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Calculate your monthly mortgage payments and plan your property purchase in the UAE.
                Get an estimate of your loan amount, interest, and total cost.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calculator Inputs */}
              <div className="lg:col-span-2">
                <ScrollReveal direction="left" delay={0.1}>
                  <FluidGlass className="rounded-lg" intensity={0.2}>
                    <Card className="bg-card/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calculator className="h-6 w-6 text-primary" />
                          Calculate Your Mortgage
                        </CardTitle>
                        <CardDescription>
                          Adjust the values below to see your estimated monthly payment
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {/* Property Price */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-base">Property Price</Label>
                            <span className="text-2xl font-bold text-primary">
                              {formatCurrency(propertyPrice)}
                            </span>
                          </div>
                          <Slider
                            value={[propertyPrice]}
                            onValueChange={(value) => setPropertyPrice(value[0])}
                            min={200000}
                            max={20000000}
                            step={50000}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>AED 200,000</span>
                            <span>AED 20,000,000</span>
                          </div>
                        </div>

                        {/* Down Payment */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-base">Down Payment</Label>
                            <span className="text-xl font-bold">
                              {downPayment}% ({formatCurrency(calculations.downPaymentAmount)})
                            </span>
                          </div>
                          <Slider
                            value={[downPayment]}
                            onValueChange={(value) => setDownPayment(value[0])}
                            min={15}
                            max={50}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>15%</span>
                            <span>50%</span>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            UAE residents require minimum 20% down payment, non-residents 25%
                          </p>
                        </div>

                        {/* Loan Term */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-base">Loan Term</Label>
                            <span className="text-xl font-bold">{loanTerm} years</span>
                          </div>
                          <Slider
                            value={[loanTerm]}
                            onValueChange={(value) => setLoanTerm(value[0])}
                            min={5}
                            max={25}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>5 years</span>
                            <span>25 years</span>
                          </div>
                        </div>

                        {/* Interest Rate */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-base">Interest Rate</Label>
                            <span className="text-xl font-bold">{interestRate.toFixed(2)}%</span>
                          </div>
                          <Slider
                            value={[interestRate]}
                            onValueChange={(value) => setInterestRate(value[0])}
                            min={3}
                            max={8}
                            step={0.25}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>3%</span>
                            <span>8%</span>
                          </div>
                        </div>

                        {/* Loan Type */}
                        <div className="space-y-2">
                          <Label className="text-base">Loan Type</Label>
                          <Select value={loanType} onValueChange={setLoanType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="conventional">Conventional Mortgage</SelectItem>
                              <SelectItem value="islamic">Islamic Finance (Ijara)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              </div>

              {/* Results Panel */}
              <div className="space-y-6">
                <ScrollReveal direction="right" delay={0.2}>
                  <FluidGlass className="rounded-lg" intensity={0.25}>
                    <Card className="bg-primary text-primary-foreground">
                      <CardHeader>
                        <CardTitle className="text-center">Monthly Payment</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-5xl font-bold mb-2">
                          {formatCurrency(calculations.monthlyPayment)}
                        </div>
                        <p className="text-primary-foreground/80">per month</p>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={0.3}>
                  <FluidGlass className="rounded-lg" intensity={0.2}>
                    <Card className="bg-card/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Loan Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Loan Amount
                          </span>
                          <span className="font-semibold">{formatCurrency(calculations.loanAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <PiggyBank className="h-4 w-4" />
                            Down Payment
                          </span>
                          <span className="font-semibold">{formatCurrency(calculations.downPaymentAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            Total Interest
                          </span>
                          <span className="font-semibold text-orange-500">
                            {formatCurrency(calculations.totalInterest)}
                          </span>
                        </div>
                        <div className="border-t pt-4 flex justify-between items-center">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Total Payment
                          </span>
                          <span className="font-bold text-lg">{formatCurrency(calculations.totalPayment)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={0.4}>
                  <FluidGlass className="rounded-lg" intensity={0.2}>
                    <Card className="bg-card/80 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-4">
                          Ready to find your dream property? Browse our listings and apply for a mortgage.
                        </p>
                        <Link href="/properties">
                          <Button className="w-full">Browse Properties</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Bank Rates */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">Current Bank Rates</h2>
                <p className="text-muted-foreground mt-2">
                  Compare mortgage rates from leading UAE banks
                </p>
              </FluidGlass>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {banks.map((bank, index) => (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                    <Card className="h-full bg-card/80 backdrop-blur-sm text-center">
                      <CardContent className="pt-6">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <span className="font-bold text-primary">{bank.logo}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{bank.name}</h3>
                        <div className="text-2xl font-bold text-primary">{bank.rate}</div>
                        <p className="text-sm text-muted-foreground mt-1">Starting rate</p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </FluidGlass>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-12 text-center" intensity={0.2}>
                <h2 className="text-3xl font-bold">Mortgage Tips for UAE Buyers</h2>
              </FluidGlass>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <TrendingUp className="h-12 w-12 text-primary" />,
                  title: "Check Your Eligibility",
                  description: "Most banks require a minimum monthly income of AED 15,000 for mortgage approval. Ensure your debt-to-income ratio is within acceptable limits.",
                },
                {
                  icon: <DollarSign className="h-12 w-12 text-primary" />,
                  title: "Save for Down Payment",
                  description: "UAE residents need at least 20% down payment, while non-residents require 25%. Start saving early to get better loan terms.",
                },
                {
                  icon: <Calendar className="h-12 w-12 text-primary" />,
                  title: "Consider Loan Term",
                  description: "Longer loan terms mean lower monthly payments but more interest paid. Choose a term that balances affordability with total cost.",
                },
              ].map((tip, index) => (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <FluidGlass className="h-full rounded-lg" intensity={0.2}>
                    <Card className="h-full bg-card/80 backdrop-blur-sm text-center">
                      <CardContent className="pt-8 pb-6">
                        <div className="flex justify-center mb-4">{tip.icon}</div>
                        <h3 className="text-xl font-semibold mb-3">{tip.title}</h3>
                        <p className="text-muted-foreground">{tip.description}</p>
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
