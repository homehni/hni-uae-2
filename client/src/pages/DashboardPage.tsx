import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Bell, 
  Wallet, 
  TrendingUp, 
  Plus, 
  Eye,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  Briefcase,
  FileText,
  CreditCard
} from 'lucide-react';
import type { DashboardStats, Notification } from '@shared/schema';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  href: string;
  roles: string[];
}

const quickActions: QuickAction[] = [
  { icon: <Plus className="h-4 w-4" />, label: 'Add Property', href: '/properties/new', roles: ['owner', 'agent', 'builder', 'admin'] },
  { icon: <Eye className="h-4 w-4" />, label: 'View Leads', href: '/leads', roles: ['owner', 'agent', 'builder', 'agency', 'service_provider', 'admin'] },
  { icon: <Wallet className="h-4 w-4" />, label: 'Buy Credits', href: '/wallet', roles: ['agent', 'builder', 'agency', 'service_provider'] },
  { icon: <Building2 className="h-4 w-4" />, label: 'My Properties', href: '/my-properties', roles: ['owner', 'agent', 'builder', 'admin'] },
  { icon: <Briefcase className="h-4 w-4" />, label: 'Add Service', href: '/services/new', roles: ['service_provider'] },
  { icon: <Users className="h-4 w-4" />, label: 'Manage Agents', href: '/agents', roles: ['agency', 'admin'] },
];

export default function DashboardPage() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/login');
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, notificationsRes] = await Promise.all([
        fetch('/api/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  const roleLabel = {
    owner: 'Property Owner',
    agent: 'Real Estate Agent',
    builder: 'Builder / Developer',
    agency: 'Agency',
    service_provider: 'Service Provider',
    buyer: 'Buyer / Tenant',
    admin: 'Administrator',
  }[user.role] || user.role;

  const filteredQuickActions = quickActions.filter(action => 
    action.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">HomeHNI</span>
            </Link>
            <Badge variant="secondary">{roleLabel}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeLeads ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.newLeadsToday ?? 0} new today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.leadsInProgress ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.closedLeads ?? 0} closed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.walletBalance ?? 0} Credits</div>
              <Link href="/wallet" className="text-xs text-primary hover:underline">
                Buy more credits
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.liveProperties ?? 0} Live</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalProperties ?? 0} total
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {filteredQuickActions.map((action) => (
                  <Button key={action.href} variant="outline" className="justify-start" asChild>
                    <Link href={action.href}>
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Stay updated on your activity</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3">
                      <Bell className={`h-4 w-4 mt-1 ${notification.isRead ? 'text-muted-foreground' : 'text-primary'}`} />
                      <div className="flex-1">
                        <p className={`text-sm ${notification.isRead ? '' : 'font-medium'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="p-0 h-auto text-primary" asChild>
                    <Link href="/notifications">View all notifications</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Role-specific sections */}
        {user.role === 'admin' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>Manage platform resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" asChild>
                  <Link href="/admin/users">
                    <Users className="h-4 w-4 mr-2" />
                    Users
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/properties">
                    <Building2 className="h-4 w-4 mr-2" />
                    Properties
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/plans">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Plans
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/reports">
                    <FileText className="h-4 w-4 mr-2" />
                    Reports
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
