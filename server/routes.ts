import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { propertyFilterSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all properties with optional filters
  app.get("/api/properties", async (req, res) => {
    try {
      const filters = propertyFilterSchema.parse({
        listingType: req.query.listingType as string | undefined,
        propertyType: req.query.propertyType 
          ? (Array.isArray(req.query.propertyType) 
            ? req.query.propertyType 
            : [req.query.propertyType])
          : undefined,
        city: req.query.city as string | undefined,
        location: req.query.location as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        bedrooms: req.query.bedrooms
          ? (Array.isArray(req.query.bedrooms)
            ? req.query.bedrooms.map(Number)
            : [Number(req.query.bedrooms)])
          : undefined,
        bathrooms: req.query.bathrooms ? Number(req.query.bathrooms) : undefined,
        minArea: req.query.minArea ? Number(req.query.minArea) : undefined,
        maxArea: req.query.maxArea ? Number(req.query.maxArea) : undefined,
        amenities: req.query.amenities
          ? (Array.isArray(req.query.amenities)
            ? req.query.amenities
            : [req.query.amenities])
          : undefined,
        featured: req.query.featured === "true" ? true : undefined,
        completionStatus: req.query.completionStatus as string | undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

      const properties = await storage.getAllProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(400).json({ error: "Invalid filter parameters" });
    }
  });

  // Get single property by ID
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getPropertyById(req.params.id);
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all agents
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get single agent by ID
  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAgentById(req.params.id);
      
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }

      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all locations (cities and their areas)
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getAllLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get areas for a specific city
  app.get("/api/locations/:city", async (req, res) => {
    try {
      const areas = await storage.getLocationsByCity(req.params.city);
      res.json(areas);
    } catch (error) {
      console.error("Error fetching city locations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
