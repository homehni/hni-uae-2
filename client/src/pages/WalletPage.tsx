import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowLeft, 
  Wallet, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  History
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Wallet as WalletType, Transaction } from '@shared/schema';

const creditPacks = [
  { amount: 10, price: 99, popular: false },
  { amount: 25, price: 199, popular: true },
  { amount: 50, price: 349, popular: false },
  { amount: 100, price: 599, popular: false },
];

export default function WalletPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState<typeof creditPacks[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/login');
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (token) {
      fetchWalletData();
    }
  }, [token]);

  const fetchWalletData = async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        fetch('/api/wallet', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/wallet/transactions', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWallet(walletData);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyCredits = async () => {
    if (!selectedPack) return;

    try {
      const response = await fetch('/api/wallet/add-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: selectedPack.amount }),
      });

      if (response.ok) {
        toast({
          title: 'Credits Added!',
          description: `${selectedPack.amount} credits have been added to your wallet.`,
        });
        fetchWalletData();
        setIsDialogOpen(false);
        setSelectedPack(null);
      } else {
        throw new Error('Failed to add credits');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add credits. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Wallet & Credits</h1>
            <p className="text-muted-foreground">Manage your lead credits</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Buy Credits
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Buy Lead Credits</DialogTitle>
                <DialogDescription>
                  Select a credit pack to purchase. Credits are used to unlock lead contact details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                {creditPacks.map((pack) => (
                  <Card
                    key={pack.amount}
                    className={`cursor-pointer transition-all ${
                      selectedPack?.amount === pack.amount
                        ? 'ring-2 ring-primary'
                        : 'hover:border-primary'
                    } ${pack.popular ? 'relative' : ''}`}
                    onClick={() => setSelectedPack(pack)}
                  >
                    {pack.popular && (
                      <Badge className="absolute -top-2 -right-2">Popular</Badge>
                    )}
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{pack.amount}</div>
                      <div className="text-sm text-muted-foreground">Credits</div>
                      <div className="text-lg font-semibold mt-2">₹{pack.price}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <DialogFooter>
                <Button
                  onClick={handleBuyCredits}
                  disabled={!selectedPack}
                  className="w-full"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹{selectedPack?.price || 0}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Balance Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <div className="flex items-center gap-2">
                  <Wallet className="h-8 w-8 text-primary" />
                  <span className="text-4xl font-bold">{wallet?.balance ?? 0}</span>
                  <span className="text-lg text-muted-foreground">Credits</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      Total Earned
                    </p>
                    <p className="text-xl font-semibold">{wallet?.totalCreditsEarned ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                      Total Spent
                    </p>
                    <p className="text-xl font-semibold">{wallet?.totalCreditsSpent ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Your recent credit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet. Buy credits to get started!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {tx.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.description || '-'}</TableCell>
                      <TableCell className="text-right">
                        <span className={tx.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
