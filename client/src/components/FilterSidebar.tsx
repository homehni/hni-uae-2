import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { PropertyFilter } from "@shared/schema";
import { FluidGlass } from "@/components/reactbits/FluidGlass";

interface FilterSidebarProps {
  filters: PropertyFilter;
  onFilterChange: (filters: PropertyFilter) => void;
  onClose?: () => void;
}

export function FilterSidebar({ filters, onFilterChange, onClose }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<PropertyFilter>(filters);

  const propertyTypes = ["Apartment", "Villa", "Townhouse", "Penthouse"];
  const cities = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];
  const bedroomOptions = [1, 2, 3, 4, 5];
  const amenities = ["Pool", "Gym", "Parking", "Security", "Garden", "Balcony"];

  const updateFilter = (key: keyof PropertyFilter, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const togglePropertyType = (type: string) => {
    const current = localFilters.propertyType || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateFilter("propertyType", updated);
  };

  const toggleBedroom = (beds: number) => {
    const current = localFilters.bedrooms || [];
    const updated = current.includes(beds)
      ? current.filter((b) => b !== beds)
      : [...current, beds];
    updateFilter("bedrooms", updated);
  };

  const toggleAmenity = (amenity: string) => {
    const current = localFilters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    updateFilter("amenities", updated);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    onClose?.();
  };

  const clearFilters = () => {
    const emptyFilters: PropertyFilter = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <FluidGlass className="h-full rounded-lg" intensity={0.15}>
      <div className="h-full flex flex-col bg-background/80 backdrop-blur-sm rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-filters">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4">
        <Accordion type="multiple" defaultValue={["listing", "location", "type", "price", "beds"]} className="w-full">
          {/* Listing Type */}
          <AccordionItem value="listing">
            <AccordionTrigger>Listing Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sale"
                    checked={localFilters.listingType === "Sale"}
                    onCheckedChange={(checked) =>
                      updateFilter("listingType", checked ? "Sale" : undefined)
                    }
                    data-testid="checkbox-sale"
                  />
                  <Label htmlFor="sale" className="cursor-pointer">
                    For Sale
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rent"
                    checked={localFilters.listingType === "Rent"}
                    onCheckedChange={(checked) =>
                      updateFilter("listingType", checked ? "Rent" : undefined)
                    }
                    data-testid="checkbox-rent"
                  />
                  <Label htmlFor="rent" className="cursor-pointer">
                    For Rent
                  </Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* City */}
          <AccordionItem value="location">
            <AccordionTrigger>City</AccordionTrigger>
            <AccordionContent>
              <Select value={localFilters.city} onValueChange={(value) => updateFilter("city", value)}>
                <SelectTrigger data-testid="select-city">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Property Type */}
          <AccordionItem value="type">
            <AccordionTrigger>Property Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {propertyTypes.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={type}
                      checked={(localFilters.propertyType || []).includes(type)}
                      onCheckedChange={() => togglePropertyType(type)}
                      data-testid={`checkbox-type-${type.toLowerCase()}`}
                    />
                    <Label htmlFor={type} className="cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="price">
            <AccordionTrigger>Price Range (AED)</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="minPrice" className="text-sm">
                    Min Price
                  </Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={localFilters.minPrice || ""}
                    onChange={(e) =>
                      updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)
                    }
                    data-testid="input-min-price"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice" className="text-sm">
                    Max Price
                  </Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="10000000"
                    value={localFilters.maxPrice || ""}
                    onChange={(e) =>
                      updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)
                    }
                    data-testid="input-max-price"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Bedrooms */}
          <AccordionItem value="beds">
            <AccordionTrigger>Bedrooms</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {bedroomOptions.map((beds) => (
                  <Button
                    key={beds}
                    variant={(localFilters.bedrooms || []).includes(beds) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleBedroom(beds)}
                    data-testid={`button-beds-${beds}`}
                  >
                    {beds}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Amenities */}
          <AccordionItem value="amenities">
            <AccordionTrigger>Amenities</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Checkbox
                      id={amenity}
                      checked={(localFilters.amenities || []).includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                      data-testid={`checkbox-amenity-${amenity.toLowerCase()}`}
                    />
                    <Label htmlFor={amenity} className="cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Actions */}
      <div className="p-4 border-t space-y-2">
        <Button onClick={applyFilters} className="w-full" data-testid="button-apply-filters">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={clearFilters} className="w-full" data-testid="button-clear-filters">
          Clear All
        </Button>
      </div>
      </div>
    </FluidGlass>
  );
}
