import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, Lock, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, loginWithOTP, requestOTP } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: 'Login successful', description: 'Welcome back!' });
      setLocation('/dashboard');
    } catch (error) {
      toast({ 
        title: 'Login failed', 
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!phone && !email) {
      toast({ title: 'Error', description: 'Please enter email or phone number', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await requestOTP(email || phone);
      setOtpSent(true);
      toast({ title: 'OTP Sent', description: `OTP sent to ${email || phone}. Check your email/phone.` });
    } catch (error) {
      toast({ 
        title: 'Failed to send OTP', 
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginWithOTP(email || phone, otp);
      toast({ title: 'Login successful', description: 'Welcome back!' });
      setLocation('/dashboard');
    } catch (error) {
      toast({ 
        title: 'Login failed', 
        description: error instanceof Error ? error.message : 'Invalid OTP',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome to HomeHNI</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">OTP Login</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              
              <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-2">Demo Accounts:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>admin@homehni.com / admin123</li>
                  <li>owner@example.com / owner123</li>
                  <li>agent@example.com / agent123</li>
                  <li>builder@example.com / builder123</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="otp">
              <form onSubmit={handleOTPLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Email or Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="text"
                      placeholder="Email or +91..."
                      value={email || phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.includes('@')) {
                          setEmail(val);
                          setPhone('');
                        } else {
                          setPhone(val);
                          setEmail('');
                        }
                      }}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                {!otpSent ? (
                  <Button type="button" onClick={handleRequestOTP} className="w-full" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Request OTP'}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="pl-9"
                          maxLength={6}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Check your email/phone for the OTP</p>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Verifying...' : 'Verify & Login'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => { setOtpSent(false); setOtp(''); }}
                      className="w-full text-primary"
                    >
                      Resend OTP
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
