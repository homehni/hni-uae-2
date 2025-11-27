import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const UserRole = {
  OWNER: "owner",
  AGENT: "agent",
  BUILDER: "builder",
  AGENCY: "agency",
  SERVICE_PROVIDER: "service_provider",
  BUYER: "buyer",
  ADMIN: "admin",
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Property status enum
export const PropertyStatus = {
  DRAFT: "draft",
  UNDER_REVIEW: "under_review",
  LIVE: "live",
  REJECTED: "rejected",
  EXPIRED: "expired",
  SOLD: "sold",
  RENTED: "rented",
} as const;

export type PropertyStatusType = typeof PropertyStatus[keyof typeof PropertyStatus];

// Lead status enum
export const LeadStatus = {
  NEW: "new",
  VIEWED: "viewed",
  ACCEPTED: "accepted",
  CONTACTED: "contacted",
  MEETING_FIXED: "meeting_fixed",
  WORK_STARTED: "work_started",
  COMPLETED: "completed",
  CLOSED: "closed",
  LOST: "lost",
} as const;

export type LeadStatusType = typeof LeadStatus[keyof typeof LeadStatus];

// Lead type enum
export const LeadType = {
  PROPERTY: "property",
  SERVICE: "service",
} as const;

export type LeadTypeType = typeof LeadType[keyof typeof LeadType];

// Service category enum
export const ServiceCategory = {
  PACKERS_MOVERS: "packers_movers",
  INTERIOR_DESIGN: "interior_design",
  CLEANING: "cleaning",
  LEGAL: "legal",
  VALUATION: "valuation",
  HOME_MAINTENANCE: "home_maintenance",
  PHOTOGRAPHY: "photography",
  OTHER: "other",
} as const;

export type ServiceCategoryType = typeof ServiceCategory[keyof typeof ServiceCategory];

// KYC status enum
export const KYCStatus = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export type KYCStatusType = typeof KYCStatus[keyof typeof KYCStatus];

// Transaction type enum
export const TransactionType = {
  CREDIT_PURCHASE: "credit_purchase",
  LEAD_UNLOCK: "lead_unlock",
  SUBSCRIPTION: "subscription",
  REFUND: "refund",
  BONUS: "bonus",
} as const;

export type TransactionTypeType = typeof TransactionType[keyof typeof TransactionType];

// Users table - unified user management for all roles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  phone: text("phone").unique(),
  password: text("password"), // hashed password
  name: text("name").notNull(),
  role: text("role").notNull().$type<UserRoleType>(),
  photo: text("photo"),
  company: text("company"),
  gstNumber: text("gst_number"),
  reraNumber: text("rera_number"),
  address: text("address"),
  city: text("city"),
  serviceAreas: text("service_areas").array(), // locations they work in
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  kycStatus: text("kyc_status").$type<KYCStatusType>().default("pending"),
  kycDocuments: jsonb("kyc_documents"), // store document URLs and metadata
  agencyId: varchar("agency_id"), // for agents belonging to an agency - references users.id
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// OTP table for login verification
export const otps = pgTable("otps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  email: text("email"),
  phone: text("phone"),
  otp: text("otp").notNull(),
  type: text("type").notNull(), // login, register, reset_password
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wallet table
export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  balance: integer("balance").default(0), // in credits
  totalCreditsEarned: integer("total_credits_earned").default(0),
  totalCreditsSpent: integer("total_credits_spent").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").notNull().references(() => wallets.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull().$type<TransactionTypeType>(),
  amount: integer("amount").notNull(), // credits (positive for add, negative for deduct)
  description: text("description"),
  referenceId: varchar("reference_id"), // lead_id, plan_id, etc.
  paymentId: varchar("payment_id"), // razorpay/stripe payment id
  status: text("status").default("completed"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// Plans table
export const plans = pgTable("plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  roleType: text("role_type").notNull().$type<UserRoleType>(),
  durationDays: integer("duration_days").notNull(), // 30, 90, 180, 365
  credits: integer("credits").notNull(),
  listingsAllowed: integer("listings_allowed").notNull(),
  citiesAllowed: integer("cities_allowed").default(1),
  visibilityLevel: text("visibility_level").default("normal"), // normal, premium, featured
  price: integer("price").notNull(), // in INR/AED
  features: text("features").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: varchar("plan_id").notNull().references(() => plans.id),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("active"), // active, expired, cancelled
  paymentId: varchar("payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Properties table (enhanced)
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  propertyType: text("property_type").notNull(), // Apartment, Villa, Townhouse, Penthouse, Commercial
  listingType: text("listing_type").notNull(), // Sale, Rent
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: integer("area").notNull(), // in sq ft
  location: text("location").notNull(),
  subarea: text("subarea").notNull(),
  building: text("building"),
  city: text("city").notNull(),
  images: text("images").array().notNull(),
  videos: text("videos").array(),
  amenities: text("amenities").array().notNull(),
  featured: boolean("featured").default(false),
  verified: boolean("verified").default(false),
  ownerId: varchar("owner_id").references(() => users.id), // property owner
  agentId: varchar("agent_id").references(() => users.id), // assigned agent (deprecated - kept for backward compatibility)
  builderId: varchar("builder_id").references(() => users.id), // for builder projects
  status: text("status").$type<PropertyStatusType>().default("draft"),
  rejectionReason: text("rejection_reason"),
  completionStatus: text("completion_status"), // Ready, Off-Plan
  handoverDate: text("handover_date"),
  launchPrice: integer("launch_price"),
  furnishing: text("furnishing"), // Furnished, Unfurnished, Semi-Furnished
  parking: integer("parking").default(0),
  viewsCount: integer("views_count").default(0),
  leadsCount: integer("leads_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  approvedBy: varchar("approved_by").references(() => users.id),
});

// Builder Projects table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  reraNumber: text("rera_number"),
  status: text("status").default("upcoming"), // upcoming, active, completed
  completionDate: text("completion_date"),
  totalUnits: integer("total_units"),
  availableUnits: integer("available_units"),
  unitTypes: text("unit_types").array(), // 1BHK, 2BHK, etc.
  priceRange: text("price_range"),
  images: text("images").array(),
  videos: text("videos").array(),
  brochureUrl: text("brochure_url"),
  amenities: text("amenities").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services table (for service providers)
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull().$type<ServiceCategoryType>(),
  description: text("description").notNull(),
  serviceLocations: text("service_locations").array(),
  pricingType: text("pricing_type").default("on_inspection"), // fixed, range, on_inspection
  priceMin: integer("price_min"),
  priceMax: integer("price_max"),
  portfolioImages: text("portfolio_images").array(),
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leads table
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadType: text("lead_type").notNull().$type<LeadTypeType>(),
  // Customer details
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone").notNull(),
  // Lead details
  propertyId: varchar("property_id").references(() => properties.id),
  serviceId: varchar("service_id").references(() => services.id),
  projectId: varchar("project_id").references(() => projects.id),
  requirement: text("requirement"),
  budget: text("budget"),
  preferredLocation: text("preferred_location"),
  preferredDate: text("preferred_date"),
  // Assignment
  assignedTo: varchar("assigned_to").references(() => users.id),
  assignedToType: text("assigned_to_type").$type<UserRoleType>(),
  source: text("source").default("website"), // website, app, campaign, referral
  // Status tracking
  status: text("status").$type<LeadStatusType>().default("new"),
  creditCost: integer("credit_cost").default(1),
  isUnlocked: boolean("is_unlocked").default(false),
  unlockedAt: timestamp("unlocked_at"),
  unlockedBy: varchar("unlocked_by").references(() => users.id),
  notes: text("notes"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  contactedAt: timestamp("contacted_at"),
  closedAt: timestamp("closed_at"),
});

// Lead Pool - for distributing leads to multiple providers
export const leadPool = pgTable("lead_pool", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: text("status").default("offered"), // offered, accepted, declined, expired
  offeredAt: timestamp("offered_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

// Lead timeline/history
export const leadTimeline = pgTable("lead_timeline", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(), // status_changed, note_added, contacted, etc.
  previousStatus: text("previous_status"),
  newStatus: text("new_status"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // lead, message, payment, system, plan_expiry
  referenceId: varchar("reference_id"),
  referenceType: text("reference_type"), // lead, property, transaction, etc.
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages/Chat table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  leadId: varchar("lead_id").references(() => leads.id),
  propertyId: varchar("property_id").references(() => properties.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
  revieweeId: varchar("reviewee_id").notNull().references(() => users.id),
  serviceId: varchar("service_id").references(() => services.id),
  leadId: varchar("lead_id").references(() => leads.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Agents table (kept for backward compatibility with existing mock data)
export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  company: text("company").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  photo: text("photo"),
  verified: boolean("verified").default(false),
  rating: integer("rating").default(0), // 0-5
  properties: integer("properties").default(0),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type LeadTimeline = typeof leadTimeline.$inferSelect;
export type LeadPoolEntry = typeof leadPool.$inferSelect;
export type OTP = typeof otps.$inferSelect;

// Filter types
export const propertyFilterSchema = z.object({
  listingType: z.enum(["Sale", "Rent"]).optional(),
  propertyType: z.array(z.string()).optional(),
  city: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.array(z.number()).optional(),
  bathrooms: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  completionStatus: z.string().optional(),
  status: z.string().optional(),
  ownerId: z.string().optional(),
  agentId: z.string().optional(),
  builderId: z.string().optional(),
  limit: z.number().optional(),
});

export type PropertyFilter = z.infer<typeof propertyFilterSchema>;

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
  otp: z.string().optional(),
}).refine((data) => data.email || data.phone, {
  message: "Email or phone is required",
});

export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(["owner", "agent", "builder", "agency", "service_provider", "buyer"]),
  company: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// Dashboard stats type
export interface DashboardStats {
  activeLeads: number;
  newLeadsToday: number;
  leadsInProgress: number;
  closedLeads: number;
  walletBalance: number;
  totalProperties: number;
  liveProperties: number;
  totalViews: number;
}
