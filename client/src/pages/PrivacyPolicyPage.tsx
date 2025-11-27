import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { FluidGlass } from "@/components/reactbits/FluidGlass";
import { ChromaGrid } from "@/components/reactbits/ChromaGrid";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <ChromaGrid className="opacity-5 absolute inset-0" cellSize={50} />

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <ScrollReveal direction="up" delay={0.1}>
              <FluidGlass className="rounded-lg p-4 mb-8 text-center" intensity={0.2}>
                <h1 className="text-4xl font-bold">Privacy Policy</h1>
                <p className="text-muted-foreground mt-2">Last updated: January 2024</p>
              </FluidGlass>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <FluidGlass className="rounded-lg" intensity={0.15}>
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardContent className="prose dark:prose-invert max-w-none pt-6">
                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                      <p className="text-muted-foreground mb-4">
                        HomeHNI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
                        explains how we collect, use, disclose, and safeguard your information when you visit our 
                        website www.homehni.ae and use our services.
                      </p>
                      <p className="text-muted-foreground">
                        By using our services, you agree to the collection and use of information in accordance 
                        with this policy.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                      <h3 className="text-xl font-medium mb-3">Personal Information</h3>
                      <p className="text-muted-foreground mb-4">
                        We may collect personally identifiable information that you provide to us, including but not limited to:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground mb-4">
                        <li>Name and contact information (email, phone number)</li>
                        <li>Account credentials</li>
                        <li>Property preferences and search history</li>
                        <li>Communication records with agents and service providers</li>
                        <li>Payment information</li>
                      </ul>

                      <h3 className="text-xl font-medium mb-3">Automatically Collected Information</h3>
                      <p className="text-muted-foreground">
                        When you access our website, we may automatically collect certain information about your 
                        device and usage patterns, including IP address, browser type, operating system, and 
                        pages visited.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                      <p className="text-muted-foreground mb-4">We use the collected information to:</p>
                      <ul className="list-disc pl-6 text-muted-foreground">
                        <li>Provide and maintain our services</li>
                        <li>Personalize your experience</li>
                        <li>Connect you with agents and service providers</li>
                        <li>Send you relevant property alerts and updates</li>
                        <li>Process transactions and payments</li>
                        <li>Improve our website and services</li>
                        <li>Comply with legal obligations</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
                      <p className="text-muted-foreground mb-4">
                        We may share your information with:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground">
                        <li>Real estate agents and agencies (with your consent)</li>
                        <li>Service providers who assist in our operations</li>
                        <li>Legal authorities when required by law</li>
                        <li>Third parties in connection with business transfers</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                      <p className="text-muted-foreground">
                        We implement appropriate technical and organizational measures to protect your personal 
                        information against unauthorized access, alteration, disclosure, or destruction. However, 
                        no method of transmission over the Internet is 100% secure.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
                      <p className="text-muted-foreground">
                        We use cookies and similar tracking technologies to enhance your experience on our website. 
                        You can control cookie settings through your browser preferences. Disabling cookies may 
                        limit some functionality of our services.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
                      <p className="text-muted-foreground mb-4">You have the right to:</p>
                      <ul className="list-disc pl-6 text-muted-foreground">
                        <li>Access your personal information</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Withdraw consent for data processing</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
                      <p className="text-muted-foreground">
                        Our services are not intended for individuals under 18 years of age. We do not knowingly 
                        collect personal information from children.
                      </p>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
                      <p className="text-muted-foreground">
                        We may update this Privacy Policy from time to time. We will notify you of any changes 
                        by posting the new policy on this page and updating the "Last updated" date.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                      <p className="text-muted-foreground">
                        If you have any questions about this Privacy Policy, please contact us at:
                      </p>
                      <ul className="list-none text-muted-foreground mt-4">
                        <li>Email: privacy@homehni.ae</li>
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
