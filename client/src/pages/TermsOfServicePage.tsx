import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-8 text-center" intensity={0.2}>
                <h1 className="text-4xl font-bold">Terms of Service</h1>
                <p className="text-muted-foreground mt-2">Last updated: January 2024</p>
              </FluidGlass>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <FluidGlass className="rounded-lg" intensity={0.15}>
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardContent className="prose dark:prose-invert max-w-none pt-6">
                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                      <p className="text-muted-foreground">
                        By accessing or using HomeHNI's website and services, you agree to be bound by these 
                        Terms of Service and all applicable laws and regulations. If you do not agree with 
                        any part of these terms, you may not use our services.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
                      <p className="text-muted-foreground mb-4">
                        HomeHNI provides an online real estate platform that connects property buyers, sellers, 
                        renters, landlords, agents, and service providers in the UAE. Our services include:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground">
                        <li>Property listings and search functionality</li>
                        <li>Agent directory and profiles</li>
                        <li>Lead generation and management</li>
                        <li>Home services marketplace</li>
                        <li>Market insights and area guides</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                      <p className="text-muted-foreground mb-4">
                        To access certain features of our platform, you must register for an account. You agree to:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground">
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Notify us immediately of any unauthorized access</li>
                        <li>Be responsible for all activities under your account</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">4. Property Listings</h2>
                      <p className="text-muted-foreground mb-4">
                        Users who list properties on our platform agree to:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground mb-4">
                        <li>Provide accurate property information</li>
                        <li>Have legal authority to list the property</li>
                        <li>Keep listings updated and remove sold/rented properties</li>
                        <li>Not engage in misleading or fraudulent practices</li>
                      </ul>
                      <p className="text-muted-foreground">
                        HomeHNI reserves the right to remove listings that violate these terms or our policies.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">5. Agent and Service Provider Terms</h2>
                      <p className="text-muted-foreground mb-4">
                        Registered agents and service providers must:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground">
                        <li>Hold valid professional licenses as required by UAE law</li>
                        <li>Provide accurate business information</li>
                        <li>Respond to inquiries in a timely and professional manner</li>
                        <li>Comply with all applicable regulations (RERA, etc.)</li>
                        <li>Not engage in spam or unsolicited communications</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">6. Credits and Payments</h2>
                      <p className="text-muted-foreground mb-4">
                        Our platform uses a credit-based system for certain services:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground">
                        <li>Credits are non-refundable unless otherwise specified</li>
                        <li>Credit purchases are subject to applicable taxes</li>
                        <li>Unused credits may expire as per our policies</li>
                        <li>Pricing may change with reasonable notice</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">7. Prohibited Activities</h2>
                      <p className="text-muted-foreground mb-4">Users may not:</p>
                      <ul className="list-disc pl-6 text-muted-foreground">
                        <li>Violate any applicable laws or regulations</li>
                        <li>Post false, misleading, or fraudulent content</li>
                        <li>Infringe on intellectual property rights</li>
                        <li>Harass or abuse other users</li>
                        <li>Attempt to gain unauthorized access to systems</li>
                        <li>Use automated tools to scrape or collect data</li>
                        <li>Engage in money laundering or fraud</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
                      <p className="text-muted-foreground">
                        All content on HomeHNI, including text, graphics, logos, and software, is the property 
                        of HomeHNI or its licensors and is protected by intellectual property laws. Users may 
                        not reproduce, distribute, or create derivative works without our written permission.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
                      <p className="text-muted-foreground">
                        HomeHNI provides its services "as is" without warranties of any kind. We do not guarantee 
                        the accuracy of property listings, the reliability of agents or service providers, or 
                        the availability of our services. We are not responsible for any transactions between 
                        users.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
                      <p className="text-muted-foreground">
                        To the maximum extent permitted by law, HomeHNI shall not be liable for any indirect, 
                        incidental, special, consequential, or punitive damages arising from your use of our 
                        services. Our total liability shall not exceed the amount paid by you in the past 12 months.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
                      <p className="text-muted-foreground">
                        You agree to indemnify and hold harmless HomeHNI, its officers, directors, employees, 
                        and agents from any claims, damages, losses, or expenses arising from your use of our 
                        services or violation of these terms.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
                      <p className="text-muted-foreground">
                        We may suspend or terminate your account at any time for violation of these terms or 
                        for any other reason at our discretion. Upon termination, your right to use our 
                        services will immediately cease.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
                      <p className="text-muted-foreground">
                        These Terms of Service shall be governed by and construed in accordance with the laws 
                        of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction 
                        of the courts of Dubai.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">14. Changes to Terms</h2>
                      <p className="text-muted-foreground">
                        We reserve the right to modify these terms at any time. We will notify users of 
                        significant changes. Continued use of our services after changes constitutes 
                        acceptance of the modified terms.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
                      <p className="text-muted-foreground">
                        For questions about these Terms of Service, please contact us at:
                      </p>
                      <ul className="list-none text-muted-foreground mt-4">
                        <li>Email: legal@homehni.ae</li>
                        <li>Phone: +971 4 123 4567</li>
                        <li>Address: Business Bay Tower, Sheikh Zayed Road, Dubai, UAE</li>
                      </ul>
                    </section>
                  </CardContent>
                </Card>
              </FluidGlass>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
