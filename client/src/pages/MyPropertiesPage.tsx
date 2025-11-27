import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  MapPin,
  Bed,
  Bath,
  Maximize
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@shared/schema';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500',
  under_review: 'bg-yellow-500',
  live: 'bg-green-500',
  rejected: 'bg-red-500',
  expired: 'bg-orange-500',
  sold: 'bg-blue-500',
  rented: 'bg-purple-500',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  under_review: 'Under Review',
  live: 'Live',
  rejected: 'Rejected',
  expired: 'Expired',
  sold: 'Sold',
  rented: 'Rented',
};

export default function MyPropertiesPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/login');
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (token) {
      fetchProperties();
    }
  }, [token]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/my-properties', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/properties/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: 'Property Deleted',
          description: 'The property has been deleted successfully.',
        });
        fetchProperties();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property.',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const formatPrice = (price: number, listingType: string) => {
    const formatted = new Intl.NumberFormat('en-AE', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price);
    return `AED ${formatted}${listingType === 'Rent' ? '/year' : ''}`;
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">My Properties</h1>
              <p className="text-muted-foreground">Manage your property listings</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/properties/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading properties...</div>
        ) : properties.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                You haven't listed any properties yet.
              </p>
              <Button asChild>
                <Link href="/properties/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-2 left-2 ${statusColors[property.status ?? 'draft']}`}
                  >
                    {statusLabels[property.status ?? 'draft']}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/property/${property.id}`} className="flex items-center cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/properties/${property.id}/edit`} className="flex items-center cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={() => setDeleteId(property.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3" />
                    {property.location}, {property.city}
                  </p>
                  <p className="text-xl font-bold text-primary mb-3">
                    {formatPrice(property.price, property.listingType)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {property.bathrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" />
                      {property.area} sqft
                    </span>
                  </div>
                  {property.status === 'rejected' && property.rejectionReason && (
                    <p className="text-sm text-destructive mt-2">
                      Rejection: {property.rejectionReason}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The property will be permanently removed from your listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
