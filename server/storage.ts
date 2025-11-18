import { type Property, type InsertProperty, type Agent, type InsertAgent, type PropertyFilter } from "@shared/schema";
import { randomUUID } from "crypto";

export interface Location {
  city: string;
  areas: string[];
}

export interface IStorage {
  // Properties
  getAllProperties(filters?: PropertyFilter): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Agents
  getAllAgents(): Promise<Agent[]>;
  getAgentById(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  
  // Locations
  getAllLocations(): Promise<Location[]>;
  getLocationsByCity(city: string): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private properties: Map<string, Property>;
  private agents: Map<string, Agent>;
  private locations: Map<string, Location>;

  constructor() {
    this.properties = new Map();
    this.agents = new Map();
    this.locations = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock agents
    const agents: InsertAgent[] = [
      {
        name: "Ahmed Al Mansouri",
        company: "Premium Properties UAE",
        phone: "+971 50 123 4567",
        whatsapp: "+971 50 123 4567",
        email: "ahmed@premiumproperties.ae",
        verified: true,
        rating: 5,
        properties: 45,
      },
      {
        name: "Sarah Williams",
        company: "Dubai Luxury Estates",
        phone: "+971 55 987 6543",
        whatsapp: "+971 55 987 6543",
        email: "sarah@dubailuxury.ae",
        verified: true,
        rating: 5,
        properties: 38,
      },
      {
        name: "Mohammed Khan",
        company: "Emirates Real Estate",
        phone: "+971 52 456 7890",
        whatsapp: "+971 52 456 7890",
        email: "mohammed@emiratesre.ae",
        verified: true,
        rating: 4,
        properties: 32,
      },
      {
        name: "Emily Thompson",
        company: "Abu Dhabi Properties",
        phone: "+971 56 234 5678",
        whatsapp: "+971 56 234 5678",
        email: "emily@abudhabiproperties.ae",
        verified: true,
        rating: 5,
        properties: 28,
      },
    ];

    const createdAgents = agents.map((agent) => {
      const id = randomUUID();
      const agentData: Agent = { ...agent, id };
      this.agents.set(id, agentData);
      return agentData;
    });

    // Create mock properties
    const properties: InsertProperty[] = [
      // Dubai Marina - Apartments
      {
        title: "Luxurious 2BR Apartment with Full Marina View",
        description: "Stunning 2-bedroom apartment in the heart of Dubai Marina with breathtaking full marina views. This fully furnished residence features floor-to-ceiling windows, modern kitchen appliances, premium finishes throughout, and access to world-class amenities including swimming pool, gym, and 24/7 security. Located within walking distance to Marina Walk, JBR Beach, and Dubai Metro.",
        propertyType: "Apartment",
        listingType: "Sale",
        price: 2500000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1250,
        location: "Dubai Marina",
        subarea: "Marina Promenade",
        building: "Marina Gate",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security", "Balcony"],
        featured: true,
        verified: true,
        agentId: createdAgents[0].id,
        completionStatus: "Ready",
      },
      {
        title: "Spacious 3BR Apartment | Sea View | Premium Location",
        description: "Experience luxury living in this spacious 3-bedroom apartment with stunning sea views. Features include a modern open-plan kitchen, large living area, master bedroom with en-suite bathroom, built-in wardrobes, and a generous balcony perfect for entertaining. The building offers residents access to state-of-the-art facilities.",
        propertyType: "Apartment",
        listingType: "Rent",
        price: 180000,
        bedrooms: 3,
        bathrooms: 3,
        area: 1850,
        location: "Dubai Marina",
        subarea: "Marina Walk",
        building: "Princess Tower",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security", "Balcony", "Garden"],
        featured: false,
        verified: true,
        agentId: createdAgents[0].id,
        completionStatus: "Ready",
      },
      // Downtown Dubai - Penthouses
      {
        title: "Ultra-Luxury Penthouse | Burj Khalifa View | 4BR",
        description: "Exceptional 4-bedroom penthouse in the prestigious Downtown Dubai with unobstructed views of Burj Khalifa. This rare offering features high-end Italian finishes, smart home automation, private elevator access, expansive terraces, and a private pool. Residents enjoy access to premium amenities and direct access to Dubai Mall.",
        propertyType: "Penthouse",
        listingType: "Sale",
        price: 15000000,
        bedrooms: 4,
        bathrooms: 5,
        area: 4500,
        location: "Downtown Dubai",
        subarea: "Burj Khalifa District",
        building: "The Address Downtown",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security", "Balcony", "Garden"],
        featured: true,
        verified: true,
        agentId: createdAgents[1].id,
        completionStatus: "Ready",
      },
      {
        title: "Modern 1BR Apartment | Fountain View | Fully Furnished",
        description: "Stylish 1-bedroom apartment with mesmerizing fountain views in the heart of Downtown Dubai. This fully furnished unit features contemporary design, premium appliances, and access to world-class amenities. Perfect for professionals or investors seeking prime location with high rental yields.",
        propertyType: "Apartment",
        listingType: "Sale",
        price: 1800000,
        bedrooms: 1,
        bathrooms: 1,
        area: 850,
        location: "Downtown Dubai",
        subarea: "The Old Town",
        building: "Burj Views",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security"],
        featured: false,
        verified: true,
        agentId: createdAgents[1].id,
        completionStatus: "Ready",
      },
      // Villas
      {
        title: "Exclusive 5BR Villa | Private Pool | Arabian Ranches",
        description: "Magnificent 5-bedroom villa in the sought-after Arabian Ranches community. This stunning property features a private swimming pool, landscaped garden, maid's room, covered parking for 2 cars, and spacious living areas perfect for family living. Located near golf course with access to community amenities including polo club, retail center, and international schools.",
        propertyType: "Villa",
        listingType: "Sale",
        price: 6800000,
        bedrooms: 5,
        bathrooms: 6,
        area: 5200,
        location: "Arabian Ranches",
        subarea: "Mirador",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security", "Garden"],
        featured: true,
        verified: true,
        agentId: createdAgents[2].id,
        completionStatus: "Ready",
      },
      {
        title: "Contemporary 4BR Villa | Palm Jumeirah | Beach Access",
        description: "Stunning contemporary villa on the iconic Palm Jumeirah with direct beach access. Features include 4 spacious bedrooms, modern kitchen, private pool, lush garden, and breathtaking sea views. This unique property offers the perfect blend of luxury and lifestyle in one of Dubai's most prestigious locations.",
        propertyType: "Villa",
        listingType: "Rent",
        price: 450000,
        bedrooms: 4,
        bathrooms: 5,
        area: 4800,
        location: "Palm Jumeirah",
        subarea: "Frond M",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Parking", "Security", "Garden", "Balcony"],
        featured: true,
        verified: true,
        agentId: createdAgents[2].id,
        completionStatus: "Ready",
      },
      // Townhouses
      {
        title: "Brand New 3BR Townhouse | Reem Community",
        description: "Move-in ready 3-bedroom townhouse in the family-friendly Reem community. This modern townhouse features contemporary design, open-plan living, private garden, covered parking, and access to community amenities including parks, pools, and retail outlets. Ideal for growing families seeking quality and convenience.",
        propertyType: "Townhouse",
        listingType: "Sale",
        price: 2200000,
        bedrooms: 3,
        bathrooms: 4,
        area: 2100,
        location: "Arabian Ranches 2",
        subarea: "Reem",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        ],
        amenities: ["Parking", "Security", "Garden"],
        featured: false,
        verified: true,
        agentId: createdAgents[1].id,
        completionStatus: "Ready",
      },
      // Off-Plan Projects - Dubai
      {
        title: "Luxurious 2BR Apartment | The Valley by Emaar | Q4 2025",
        description: "Brand new off-plan development offering 2-bedroom apartments in The Valley by Emaar. Features include modern design, premium finishes, smart home technology, and access to community facilities including pools, parks, and retail. Flexible payment plans available.",
        propertyType: "Apartment",
        listingType: "Sale",
        price: 1530000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        location: "The Valley by Emaar",
        subarea: "Orania",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security", "Garden"],
        featured: true,
        verified: true,
        agentId: createdAgents[0].id,
        completionStatus: "Off-Plan",
        handoverDate: "Q4 2025",
        launchPrice: 1530000,
      },
      {
        title: "Modern 1BR | Dubai Maritime City | Q4 2026",
        description: "New waterfront development in Dubai Maritime City. 1-bedroom apartments with modern finishes, balconies with marina views, and comprehensive amenities. Perfect for first-time buyers and investors.",
        propertyType: "Apartment",
        listingType: "Sale",
        price: 1400000,
        bedrooms: 1,
        bathrooms: 1,
        area: 750,
        location: "Dubai Maritime City",
        subarea: "The Pier Residence",
        building: "The Pier Residence",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security", "Balcony"],
        featured: false,
        verified: true,
        agentId: createdAgents[0].id,
        completionStatus: "Off-Plan",
        handoverDate: "Q4 2026",
        launchPrice: 1400000,
      },
      {
        title: "Luxury 4BR Villa | Grand Polo Club | Q2 2029",
        description: "Exclusive villa development in Grand Polo Club Resort. These 4-bedroom villas feature contemporary architecture, private pools, landscaped gardens, and access to polo club facilities. Limited units available.",
        propertyType: "Villa",
        listingType: "Sale",
        price: 6200000,
        bedrooms: 4,
        bathrooms: 5,
        area: 4200,
        location: "Dubai Investment Park (DIP)",
        subarea: "Grand Polo Club & Resort",
        building: "Selvara",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security", "Garden"],
        featured: true,
        verified: true,
        agentId: createdAgents[2].id,
        completionStatus: "Off-Plan",
        handoverDate: "Q2 2029",
        launchPrice: 6200000,
      },
      // Abu Dhabi Properties
      {
        title: "Waterfront 3BR Apartment | Yas Island | Marina View",
        description: "Premium 3-bedroom apartment on Yas Island with stunning marina views. Features include modern finishes, spacious living areas, high-quality appliances, and access to island amenities including beaches, theme parks, and golf courses.",
        propertyType: "Apartment",
        listingType: "Sale",
        price: 2100000,
        bedrooms: 3,
        bathrooms: 3,
        area: 1650,
        location: "Yas Island",
        subarea: "Yas Bay",
        city: "Abu Dhabi",
        images: [
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security", "Balcony"],
        featured: false,
        verified: true,
        agentId: createdAgents[3].id,
        completionStatus: "Ready",
      },
      {
        title: "Spacious 2BR | Saadiyat Island | Beach Access",
        description: "Beautiful 2-bedroom apartment on Saadiyat Island with direct beach access. This property offers resort-style living with world-class cultural attractions nearby including Louvre Abu Dhabi. Features include modern design, premium finishes, and comprehensive amenities.",
        propertyType: "Apartment",
        listingType: "Rent",
        price: 135000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1300,
        location: "Saadiyat Island",
        subarea: "Saadiyat Beach",
        city: "Abu Dhabi",
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security", "Balcony", "Garden"],
        featured: false,
        verified: true,
        agentId: createdAgents[3].id,
        completionStatus: "Ready",
      },
      {
        title: "Modern 4BR Villa | Al Reef | Private Garden",
        description: "Elegant 4-bedroom villa in Al Reef community. This single-row villa features spacious living areas, modern kitchen, private garden, covered parking, and maid's room. Located in a family-friendly community with schools, mosques, and retail nearby.",
        propertyType: "Villa",
        listingType: "Sale",
        price: 3200000,
        bedrooms: 4,
        bathrooms: 5,
        area: 3200,
        location: "Al Reef",
        subarea: "Al Reef Villas",
        city: "Abu Dhabi",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        ],
        amenities: ["Parking", "Security", "Garden"],
        featured: false,
        verified: true,
        agentId: createdAgents[3].id,
        completionStatus: "Ready",
      },
      // Sharjah Properties
      {
        title: "Affordable 2BR Townhouse | Masaar | Family Community",
        description: "Well-designed 2-bedroom townhouse in Masaar, Sharjah's premier family community. Features include modern finishes, private garden, covered parking, and access to community amenities including parks, pools, and retail.",
        propertyType: "Townhouse",
        listingType: "Sale",
        price: 1100000,
        bedrooms: 2,
        bathrooms: 3,
        area: 1450,
        location: "Tilal City",
        subarea: "Masaar",
        building: "Saro",
        city: "Sharjah",
        images: [
          "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        ],
        amenities: ["Parking", "Security", "Garden"],
        featured: false,
        verified: true,
        agentId: createdAgents[2].id,
        completionStatus: "Ready",
      },
      {
        title: "Studio Apartment | Sharjah Waterfront | Sea View",
        description: "Compact studio apartment on Sharjah Waterfront with beautiful sea views. Perfect for singles or investors, this unit features modern design, built-in appliances, and access to waterfront amenities.",
        propertyType: "Apartment",
        listingType: "Rent",
        price: 32000,
        bedrooms: 0,
        bathrooms: 1,
        area: 450,
        location: "Sharjah Waterfront City",
        subarea: "Blue Waves",
        city: "Sharjah",
        images: [
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security"],
        featured: false,
        verified: true,
        agentId: createdAgents[2].id,
        completionStatus: "Ready",
      },
      // Additional properties for variety
      {
        title: "Elegant 2BR | Business Bay | Canal View",
        description: "Sophisticated 2-bedroom apartment in Business Bay with stunning canal views. This residence features high-end finishes, modern appliances, and floor-to-ceiling windows. Walking distance to Dubai Mall and metro station.",
        propertyType: "Apartment",
        listingType: "Sale",
        price: 1950000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1150,
        location: "Business Bay",
        subarea: "Canal District",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        ],
        amenities: ["Pool", "Gym", "Parking", "Security", "Balcony"],
        featured: false,
        verified: true,
        agentId: createdAgents[1].id,
        completionStatus: "Ready",
      },
      {
        title: "Family 3BR Townhouse | Dubai Hills Estate",
        description: "Spacious 3-bedroom townhouse in Dubai Hills Estate, one of Dubai's most sought-after communities. Features include contemporary design, private garden, covered parking, and access to golf course, parks, and international schools.",
        propertyType: "Townhouse",
        listingType: "Sale",
        price: 3400000,
        bedrooms: 3,
        bathrooms: 4,
        area: 2300,
        location: "Dubai Hills Estate",
        subarea: "Maple",
        city: "Dubai",
        images: [
          "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607688969-a5fcd52667cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        ],
        amenities: ["Gym", "Parking", "Security", "Garden"],
        featured: false,
        verified: true,
        agentId: createdAgents[1].id,
        completionStatus: "Ready",
      },
    ];

    properties.forEach((property) => {
      const id = randomUUID();
      const propertyData: Property = {
        ...property,
        id,
        createdAt: new Date(),
      };
      this.properties.set(id, propertyData);
    });

    // Initialize locations after properties are created
    this.initializeLocations();
  }

  // Property methods
  async getAllProperties(filters?: PropertyFilter): Promise<Property[]> {
    let properties = Array.from(this.properties.values());

    if (!filters) {
      return properties;
    }

    // Apply filters
    if (filters.listingType) {
      properties = properties.filter((p) => p.listingType === filters.listingType);
    }

    if (filters.city) {
      properties = properties.filter((p) => p.city === filters.city);
    }

    if (filters.location) {
      properties = properties.filter((p) =>
        p.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.propertyType && filters.propertyType.length > 0) {
      properties = properties.filter((p) =>
        filters.propertyType!.includes(p.propertyType)
      );
    }

    if (filters.minPrice !== undefined) {
      properties = properties.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      properties = properties.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.bedrooms && filters.bedrooms.length > 0) {
      properties = properties.filter((p) =>
        filters.bedrooms!.includes(p.bedrooms)
      );
    }

    if (filters.bathrooms !== undefined) {
      properties = properties.filter((p) => p.bathrooms >= filters.bathrooms!);
    }

    if (filters.minArea !== undefined) {
      properties = properties.filter((p) => p.area >= filters.minArea!);
    }

    if (filters.maxArea !== undefined) {
      properties = properties.filter((p) => p.area <= filters.maxArea!);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      properties = properties.filter((p) =>
        filters.amenities!.every((amenity) => p.amenities.includes(amenity))
      );
    }

    if (filters.featured !== undefined) {
      properties = properties.filter((p) => p.featured === filters.featured);
    }

    if (filters.completionStatus) {
      properties = properties.filter(
        (p) => p.completionStatus === filters.completionStatus
      );
    }

    // Apply limit if specified
    if (filters.limit !== undefined && filters.limit > 0) {
      properties = properties.slice(0, filters.limit);
    }

    return properties;
  }

  async getPropertyById(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property: Property = {
      ...insertProperty,
      id,
      createdAt: new Date(),
    };
    this.properties.set(id, property);
    return property;
  }

  // Agent methods
  async getAllAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgentById(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const agent: Agent = { ...insertAgent, id };
    this.agents.set(id, agent);
    return agent;
  }

  // Location methods
  private initializeLocations() {
    // Extract unique locations from properties
    const locationMap = new Map<string, Set<string>>();

    this.properties.forEach((property) => {
      if (!locationMap.has(property.city)) {
        locationMap.set(property.city, new Set());
      }
      locationMap.get(property.city)!.add(property.location);
    });

    locationMap.forEach((areas, city) => {
      this.locations.set(city, {
        city,
        areas: Array.from(areas).sort(),
      });
    });
  }

  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocationsByCity(city: string): Promise<string[]> {
    const location = this.locations.get(city);
    return location ? location.areas : [];
  }
}

export const storage = new MemStorage();
