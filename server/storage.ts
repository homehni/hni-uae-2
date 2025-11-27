import { 
  type Property, type InsertProperty, type Agent, type InsertAgent, type PropertyFilter, PropertyStatus,
  type User, type InsertUser, type Lead, type InsertLead, type Wallet, type Transaction,
  type Plan, type Subscription, type Notification, type InsertNotification, type Service, type InsertService,
  type Project, type InsertProject, type Message, type Review, type OTP,
  UserRole, LeadStatus, LeadType, TransactionType, KYCStatus, ServiceCategory,
  type UserRoleType, type LeadStatusType, type TransactionTypeType,
  type DashboardStats
} from "@shared/schema";
import { randomUUID } from "crypto";
import { createHash } from "crypto";

// Helper function to hash passwords
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export interface Location {
  city: string;
  areas: string[];
}

export interface IStorage {
  // Properties
  getAllProperties(filters?: PropertyFilter): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  
  // Agents (backward compatibility)
  getAllAgents(): Promise<Agent[]>;
  getAgentById(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  
  // Users
  getAllUsers(role?: UserRoleType): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  verifyPassword(user: User, password: string): Promise<boolean>;
  
  // OTP
  createOTP(email: string | undefined, phone: string | undefined, type: string): Promise<string>;
  verifyOTP(email: string | undefined, phone: string | undefined, otp: string, type: string): Promise<boolean>;
  
  // Wallet
  getWalletByUserId(userId: string): Promise<Wallet | undefined>;
  createWallet(userId: string): Promise<Wallet>;
  updateWalletBalance(userId: string, amount: number, type: TransactionTypeType, description?: string): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: string): Promise<Transaction[]>;
  
  // Leads
  getAllLeads(filters?: { assignedTo?: string; status?: LeadStatusType; leadType?: string }): Promise<Lead[]>;
  getLeadById(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead | undefined>;
  unlockLead(leadId: string, userId: string): Promise<Lead | undefined>;
  
  // Plans & Subscriptions
  getAllPlans(roleType?: UserRoleType): Promise<Plan[]>;
  getPlanById(id: string): Promise<Plan | undefined>;
  createSubscription(userId: string, planId: string): Promise<Subscription | undefined>;
  getActiveSubscription(userId: string): Promise<Subscription | undefined>;
  
  // Notifications
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<boolean>;
  
  // Services
  getAllServices(category?: string): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | undefined>;
  getServicesByProviderId(providerId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  // Projects
  getAllProjects(builderId?: string): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Dashboard
  getDashboardStats(userId: string): Promise<DashboardStats>;
  
  // Locations
  getAllLocations(): Promise<Location[]>;
  getLocationsByCity(city: string): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private properties: Map<string, Property>;
  private agents: Map<string, Agent>;
  private locations: Map<string, Location>;
  private users: Map<string, User>;
  private wallets: Map<string, Wallet>;
  private transactions: Map<string, Transaction>;
  private leads: Map<string, Lead>;
  private plans: Map<string, Plan>;
  private subscriptions: Map<string, Subscription>;
  private notifications: Map<string, Notification>;
  private services: Map<string, Service>;
  private projects: Map<string, Project>;
  private messages: Map<string, Message>;
  private reviews: Map<string, Review>;
  private otps: Map<string, OTP>;

  constructor() {
    this.properties = new Map();
    this.agents = new Map();
    this.locations = new Map();
    this.users = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.leads = new Map();
    this.plans = new Map();
    this.subscriptions = new Map();
    this.notifications = new Map();
    this.services = new Map();
    this.projects = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    this.otps = new Map();
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
      const agentData: Agent = { 
        ...agent, 
        id,
        photo: agent.photo ?? null,
        verified: agent.verified ?? false,
        rating: agent.rating ?? 0,
        properties: agent.properties ?? 0,
      };
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
        updatedAt: new Date(),
        building: property.building ?? null,
        featured: property.featured ?? false,
        verified: property.verified ?? true,
        completionStatus: property.completionStatus ?? null,
        handoverDate: property.handoverDate ?? null,
        launchPrice: property.launchPrice ?? null,
        ownerId: null,
        builderId: null,
        status: PropertyStatus.LIVE,
        rejectionReason: null,
        furnishing: null,
        parking: 0,
        viewsCount: 0,
        leadsCount: 0,
        approvedAt: null,
        approvedBy: null,
        videos: null,
        agentId: property.agentId ?? null,
      };
      this.properties.set(id, propertyData);
    });

    // Initialize locations after properties are created
    this.initializeLocations();
    
    // Initialize plans and sample users
    this.initializePlansAndUsers();
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
      updatedAt: new Date(),
      building: insertProperty.building ?? null,
      featured: insertProperty.featured ?? false,
      verified: insertProperty.verified ?? true,
      completionStatus: insertProperty.completionStatus ?? null,
      handoverDate: insertProperty.handoverDate ?? null,
      launchPrice: insertProperty.launchPrice ?? null,
      ownerId: insertProperty.ownerId ?? null,
      builderId: insertProperty.builderId ?? null,
      status: (insertProperty.status as typeof PropertyStatus.DRAFT) ?? PropertyStatus.DRAFT,
      rejectionReason: insertProperty.rejectionReason ?? null,
      furnishing: insertProperty.furnishing ?? null,
      parking: insertProperty.parking ?? 0,
      viewsCount: insertProperty.viewsCount ?? 0,
      leadsCount: insertProperty.leadsCount ?? 0,
      approvedAt: null,
      approvedBy: insertProperty.approvedBy ?? null,
      videos: insertProperty.videos ?? null,
      agentId: insertProperty.agentId ?? null,
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
    const agent: Agent = { 
      ...insertAgent, 
      id,
      photo: insertAgent.photo ?? null,
      verified: insertAgent.verified ?? false,
      rating: insertAgent.rating ?? 0,
      properties: insertAgent.properties ?? 0,
    };
    this.agents.set(id, agent);
    return agent;
  }

  // Property update & delete methods
  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty: Property = {
      ...property,
      ...updates,
      updatedAt: new Date(),
    } as Property;
    
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.properties.delete(id);
  }

  // User methods
  async getAllUsers(role?: UserRoleType): Promise<User[]> {
    let users = Array.from(this.users.values());
    if (role) {
      users = users.filter(u => u.role === role);
    }
    return users;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.phone === phone);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      email: insertUser.email,
      phone: insertUser.phone ?? null,
      password: insertUser.password ? hashPassword(insertUser.password) : null,
      name: insertUser.name,
      role: insertUser.role as UserRoleType,
      photo: insertUser.photo ?? null,
      company: insertUser.company ?? null,
      gstNumber: insertUser.gstNumber ?? null,
      reraNumber: insertUser.reraNumber ?? null,
      address: insertUser.address ?? null,
      city: insertUser.city ?? null,
      serviceAreas: insertUser.serviceAreas ?? null,
      isActive: insertUser.isActive ?? true,
      isVerified: insertUser.isVerified ?? false,
      kycStatus: (insertUser.kycStatus as typeof KYCStatus.PENDING) ?? KYCStatus.PENDING,
      kycDocuments: insertUser.kycDocuments ?? null,
      agencyId: insertUser.agencyId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    
    // Create wallet for the user
    await this.createWallet(id);
    
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    } as User;
    
    if (updates.password) {
      updatedUser.password = hashPassword(updates.password);
    }
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password) return false;
    return user.password === hashPassword(password);
  }

  // OTP methods
  async createOTP(email: string | undefined, phone: string | undefined, type: string): Promise<string> {
    const id = randomUUID();
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    const otpRecord: OTP = {
      id,
      userId: null,
      email: email ?? null,
      phone: phone ?? null,
      otp,
      type,
      expiresAt,
      isUsed: false,
      createdAt: new Date(),
    };
    
    this.otps.set(id, otpRecord);
    return otp;
  }

  async verifyOTP(email: string | undefined, phone: string | undefined, otp: string, type: string): Promise<boolean> {
    const otpRecord = Array.from(this.otps.values()).find(o => 
      (email ? o.email === email : o.phone === phone) &&
      o.otp === otp &&
      o.type === type &&
      !o.isUsed &&
      o.expiresAt > new Date()
    );
    
    if (otpRecord) {
      otpRecord.isUsed = true;
      this.otps.set(otpRecord.id, otpRecord);
      return true;
    }
    return false;
  }

  // Wallet methods
  async getWalletByUserId(userId: string): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(w => w.userId === userId);
  }

  async createWallet(userId: string): Promise<Wallet> {
    const id = randomUUID();
    const wallet: Wallet = {
      id,
      userId,
      balance: 0,
      totalCreditsEarned: 0,
      totalCreditsSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.wallets.set(id, wallet);
    return wallet;
  }

  async updateWalletBalance(userId: string, amount: number, type: TransactionTypeType, description?: string): Promise<Transaction | undefined> {
    const wallet = await this.getWalletByUserId(userId);
    if (!wallet) return undefined;
    
    // Update wallet balance
    wallet.balance = (wallet.balance ?? 0) + amount;
    if (amount > 0) {
      wallet.totalCreditsEarned = (wallet.totalCreditsEarned ?? 0) + amount;
    } else {
      wallet.totalCreditsSpent = (wallet.totalCreditsSpent ?? 0) + Math.abs(amount);
    }
    wallet.updatedAt = new Date();
    this.wallets.set(wallet.id, wallet);
    
    // Create transaction
    const transactionId = randomUUID();
    const transaction: Transaction = {
      id: transactionId,
      walletId: wallet.id,
      userId,
      type,
      amount,
      description: description ?? null,
      referenceId: null,
      paymentId: null,
      status: "completed",
      createdAt: new Date(),
    };
    this.transactions.set(transactionId, transaction);
    
    return transaction;
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => t.userId === userId);
  }

  // Lead methods
  async getAllLeads(filters?: { assignedTo?: string; status?: LeadStatusType; leadType?: string }): Promise<Lead[]> {
    let leads = Array.from(this.leads.values());
    
    if (filters?.assignedTo) {
      leads = leads.filter(l => l.assignedTo === filters.assignedTo);
    }
    if (filters?.status) {
      leads = leads.filter(l => l.status === filters.status);
    }
    if (filters?.leadType) {
      leads = leads.filter(l => l.leadType === filters.leadType);
    }
    
    return leads.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = {
      id,
      leadType: insertLead.leadType as typeof LeadType.PROPERTY,
      customerName: insertLead.customerName,
      customerEmail: insertLead.customerEmail ?? null,
      customerPhone: insertLead.customerPhone,
      propertyId: insertLead.propertyId ?? null,
      serviceId: insertLead.serviceId ?? null,
      projectId: insertLead.projectId ?? null,
      requirement: insertLead.requirement ?? null,
      budget: insertLead.budget ?? null,
      preferredLocation: insertLead.preferredLocation ?? null,
      preferredDate: insertLead.preferredDate ?? null,
      assignedTo: insertLead.assignedTo ?? null,
      assignedToType: insertLead.assignedToType as UserRoleType ?? null,
      source: insertLead.source ?? "website",
      status: (insertLead.status as LeadStatusType) ?? LeadStatus.NEW,
      creditCost: insertLead.creditCost ?? 1,
      isUnlocked: insertLead.isUnlocked ?? false,
      unlockedAt: null,
      unlockedBy: insertLead.unlockedBy ?? null,
      notes: insertLead.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      contactedAt: null,
      closedAt: null,
    };
    this.leads.set(id, lead);
    
    // Create notification for assigned user
    if (lead.assignedTo) {
      await this.createNotification({
        userId: lead.assignedTo,
        title: "New Lead Assigned",
        message: `You have a new ${lead.leadType} lead from ${lead.customerName}`,
        type: "lead",
        referenceId: lead.id,
        referenceType: "lead",
      });
    }
    
    return lead;
  }

  async updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    
    const updatedLead: Lead = {
      ...lead,
      ...updates,
      updatedAt: new Date(),
    } as Lead;
    
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  async unlockLead(leadId: string, userId: string): Promise<Lead | undefined> {
    const lead = this.leads.get(leadId);
    if (!lead) return undefined;
    
    // Deduct credits from wallet
    const wallet = await this.getWalletByUserId(userId);
    if (!wallet || (wallet.balance ?? 0) < (lead.creditCost ?? 1)) {
      return undefined; // Insufficient balance
    }
    
    await this.updateWalletBalance(userId, -(lead.creditCost ?? 1), TransactionType.LEAD_UNLOCK, `Unlocked lead ${leadId}`);
    
    lead.isUnlocked = true;
    lead.unlockedAt = new Date();
    lead.unlockedBy = userId;
    lead.status = LeadStatus.VIEWED;
    lead.updatedAt = new Date();
    
    this.leads.set(leadId, lead);
    return lead;
  }

  // Plans & Subscriptions methods
  async getAllPlans(roleType?: UserRoleType): Promise<Plan[]> {
    let plans = Array.from(this.plans.values()).filter(p => p.isActive);
    if (roleType) {
      plans = plans.filter(p => p.roleType === roleType);
    }
    return plans;
  }

  async getPlanById(id: string): Promise<Plan | undefined> {
    return this.plans.get(id);
  }

  async createSubscription(userId: string, planId: string): Promise<Subscription | undefined> {
    const plan = this.plans.get(planId);
    if (!plan) return undefined;
    
    const id = randomUUID();
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (plan.durationDays * 24 * 60 * 60 * 1000));
    
    const subscription: Subscription = {
      id,
      userId,
      planId,
      startDate,
      endDate,
      status: "active",
      paymentId: null,
      createdAt: new Date(),
    };
    this.subscriptions.set(id, subscription);
    
    // Add credits to wallet
    await this.updateWalletBalance(userId, plan.credits, TransactionType.SUBSCRIPTION, `Subscription: ${plan.name}`);
    
    return subscription;
  }

  async getActiveSubscription(userId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(s => 
      s.userId === userId && 
      s.status === "active" && 
      s.endDate > new Date()
    );
  }

  // Notification methods
  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const newNotification: Notification = {
      id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      referenceId: notification.referenceId ?? null,
      referenceType: notification.referenceType ?? null,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }

  // Service methods
  async getAllServices(category?: string): Promise<Service[]> {
    let services = Array.from(this.services.values()).filter(s => s.isActive);
    if (category) {
      services = services.filter(s => s.category === category);
    }
    return services;
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServicesByProviderId(providerId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(s => s.providerId === providerId);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = {
      id,
      providerId: insertService.providerId,
      name: insertService.name,
      category: insertService.category as typeof ServiceCategory.OTHER,
      description: insertService.description,
      serviceLocations: insertService.serviceLocations ?? null,
      pricingType: insertService.pricingType ?? "on_inspection",
      priceMin: insertService.priceMin ?? null,
      priceMax: insertService.priceMax ?? null,
      portfolioImages: insertService.portfolioImages ?? null,
      isActive: insertService.isActive ?? true,
      rating: insertService.rating ?? "0",
      reviewCount: insertService.reviewCount ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.services.set(id, service);
    return service;
  }

  // Project methods
  async getAllProjects(builderId?: string): Promise<Project[]> {
    let projects = Array.from(this.projects.values());
    if (builderId) {
      projects = projects.filter(p => p.builderId === builderId);
    }
    return projects;
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      id,
      builderId: insertProject.builderId,
      name: insertProject.name,
      description: insertProject.description,
      location: insertProject.location,
      city: insertProject.city,
      reraNumber: insertProject.reraNumber ?? null,
      status: insertProject.status ?? "upcoming",
      completionDate: insertProject.completionDate ?? null,
      totalUnits: insertProject.totalUnits ?? null,
      availableUnits: insertProject.availableUnits ?? null,
      unitTypes: insertProject.unitTypes ?? null,
      priceRange: insertProject.priceRange ?? null,
      images: insertProject.images ?? null,
      videos: insertProject.videos ?? null,
      brochureUrl: insertProject.brochureUrl ?? null,
      amenities: insertProject.amenities ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const leads = await this.getAllLeads({ assignedTo: userId });
    const wallet = await this.getWalletByUserId(userId);
    const properties = Array.from(this.properties.values()).filter(
      p => p.ownerId === userId || p.agentId === userId || p.builderId === userId
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      activeLeads: leads.filter(l => !["closed", "lost", "completed"].includes(l.status ?? "")).length,
      newLeadsToday: leads.filter(l => l.createdAt && l.createdAt >= today).length,
      leadsInProgress: leads.filter(l => ["contacted", "meeting_fixed", "work_started"].includes(l.status ?? "")).length,
      closedLeads: leads.filter(l => ["closed", "completed"].includes(l.status ?? "")).length,
      walletBalance: wallet?.balance ?? 0,
      totalProperties: properties.length,
      liveProperties: properties.filter(p => p.status === "live").length,
      totalViews: properties.reduce((sum, p) => sum + (p.viewsCount ?? 0), 0),
    };
  }

  // Initialize mock plans and sample users
  private initializePlansAndUsers() {
    // Create plans
    const plans = [
      { name: "Agent Basic", roleType: UserRole.AGENT, durationDays: 30, credits: 10, listingsAllowed: 5, price: 999, citiesAllowed: 1, visibilityLevel: "normal" },
      { name: "Agent Pro", roleType: UserRole.AGENT, durationDays: 90, credits: 50, listingsAllowed: 20, price: 2499, citiesAllowed: 3, visibilityLevel: "premium" },
      { name: "Agent Enterprise", roleType: UserRole.AGENT, durationDays: 365, credits: 200, listingsAllowed: -1, price: 7999, citiesAllowed: -1, visibilityLevel: "featured" },
      { name: "Service Starter", roleType: UserRole.SERVICE_PROVIDER, durationDays: 30, credits: 20, listingsAllowed: 3, price: 499, citiesAllowed: 1, visibilityLevel: "normal" },
      { name: "Service Growth", roleType: UserRole.SERVICE_PROVIDER, durationDays: 90, credits: 50, listingsAllowed: 10, price: 1299, citiesAllowed: 3, visibilityLevel: "premium" },
      { name: "Builder Basic", roleType: UserRole.BUILDER, durationDays: 30, credits: 30, listingsAllowed: 1, price: 2999, citiesAllowed: 1, visibilityLevel: "normal" },
      { name: "Builder Plus", roleType: UserRole.BUILDER, durationDays: 90, credits: 100, listingsAllowed: 5, price: 7999, citiesAllowed: 3, visibilityLevel: "premium" },
    ];

    plans.forEach(plan => {
      const id = randomUUID();
      const planData: Plan = {
        id,
        name: plan.name,
        roleType: plan.roleType,
        durationDays: plan.durationDays,
        credits: plan.credits,
        listingsAllowed: plan.listingsAllowed,
        citiesAllowed: plan.citiesAllowed,
        visibilityLevel: plan.visibilityLevel,
        price: plan.price,
        features: null,
        isActive: true,
        createdAt: new Date(),
      };
      this.plans.set(id, planData);
    });

    // Create sample users
    const sampleUsers = [
      { email: "admin@homehni.com", name: "Admin User", role: UserRole.ADMIN, password: "admin123" },
      { email: "owner@example.com", name: "Property Owner", role: UserRole.OWNER, password: "owner123" },
      { email: "agent@example.com", name: "Real Estate Agent", role: UserRole.AGENT, password: "agent123", company: "Premium Properties" },
      { email: "builder@example.com", name: "Construction Builder", role: UserRole.BUILDER, password: "builder123", company: "Builder Corp" },
      { email: "agency@example.com", name: "Real Estate Agency", role: UserRole.AGENCY, password: "agency123", company: "Top Agency" },
      { email: "provider@example.com", name: "Service Provider", role: UserRole.SERVICE_PROVIDER, password: "provider123", company: "Home Services" },
      { email: "buyer@example.com", name: "Property Buyer", role: UserRole.BUYER, password: "buyer123" },
    ];

    sampleUsers.forEach(async (userData) => {
      const id = randomUUID();
      const user: User = {
        id,
        email: userData.email,
        phone: null,
        password: hashPassword(userData.password),
        name: userData.name,
        role: userData.role,
        photo: null,
        company: (userData as any).company ?? null,
        gstNumber: null,
        reraNumber: null,
        address: null,
        city: "Dubai",
        serviceAreas: null,
        isActive: true,
        isVerified: true,
        kycStatus: KYCStatus.VERIFIED,
        kycDocuments: null,
        agencyId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(id, user);
      
      // Create wallet
      const walletId = randomUUID();
      const wallet: Wallet = {
        id: walletId,
        userId: id,
        balance: 50, // Start with some credits
        totalCreditsEarned: 50,
        totalCreditsSpent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.wallets.set(walletId, wallet);
    });
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
