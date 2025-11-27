import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Search,
  Filter,
  Eye,
  Lock,
  Unlock
} from 'lucide-react';
import type { Lead, LeadStatusType } from '@shared/schema';

const statusColors: Record<string, string> = {
  new: 'bg-blue-500',
  viewed: 'bg-yellow-500',
  accepted: 'bg-green-500',
  contacted: 'bg-purple-500',
  meeting_fixed: 'bg-indigo-500',
  work_started: 'bg-orange-500',
  completed: 'bg-emerald-500',
  closed: 'bg-gray-500',
  lost: 'bg-red-500',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  viewed: 'Viewed',
  accepted: 'Accepted',
  contacted: 'Contacted',
  meeting_fixed: 'Meeting Fixed',
  work_started: 'Work Started',
  completed: 'Completed',
  closed: 'Closed',
  lost: 'Lost',
};

export default function LeadsPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/login');
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token, statusFilter, typeFilter]);

  const fetchLeads = async () => {
    try {
      let url = '/api/leads';
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('leadType', typeFilter);
      if (params.toString()) url += '?' + params.toString();

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockLead = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/unlock`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error('Error unlocking lead:', error);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.requirement?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div>
            <h1 className="text-3xl font-bold">Leads Center</h1>
            <p className="text-muted-foreground">Manage and track your leads</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="meeting_fixed">Meeting Fixed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Leads ({filteredLeads.length})</CardTitle>
            <CardDescription>Click on a lead to view details and update status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No leads found. Leads will appear here when customers inquire about your properties or services.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.customerName}</p>
                          {lead.isUnlocked ? (
                            <div className="text-sm text-muted-foreground">
                              <p className="flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {lead.customerPhone}
                              </p>
                              {lead.customerEmail && (
                                <p className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" /> {lead.customerEmail}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Lock className="h-3 w-3" /> Contact hidden
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {lead.leadType}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {lead.requirement || '-'}
                        {lead.preferredLocation && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {lead.preferredLocation}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status ?? 'new'}
                          onValueChange={(value) => handleStatusChange(lead.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${statusColors[lead.status ?? 'new']}`} />
                              <span>{statusLabels[lead.status ?? 'new']}</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${statusColors[value]}`} />
                                  {label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!lead.isUnlocked && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnlockLead(lead.id)}
                            >
                              <Unlock className="h-4 w-4 mr-1" />
                              Unlock ({lead.creditCost} credits)
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/leads/${lead.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
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
