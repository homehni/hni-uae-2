import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  propertyType: text("property_type").notNull(), // Apartment, Villa, Townhouse, Penthouse
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
  amenities: text("amenities").array().notNull(),
  featured: boolean("featured").default(false),
  verified: boolean("verified").default(true),
  agentId: varchar("agent_id").notNull(),
  completionStatus: text("completion_status"), // Ready, Off-Plan
  handoverDate: text("handover_date"),
  launchPrice: integer("launch_price"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Agents table
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
export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
});

// Types
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

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
  limit: z.number().optional(),
});

export type PropertyFilter = z.infer<typeof propertyFilterSchema>;
