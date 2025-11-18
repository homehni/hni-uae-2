import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { storage } from '../server/storage';
import { propertyFilterSchema } from '@shared/schema';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Get all properties with optional filters
app.get('/api/properties', async (req, res) => {
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
      featured: req.query.featured === 'true' ? true : undefined,
      completionStatus: req.query.completionStatus as string | undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    const properties = await storage.getAllProperties(filters);
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get a single property by ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await storage.getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Get all agents
app.get('/api/agents', async (_req, res) => {
  try {
    const agents = await storage.getAllAgents();
    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get agent by ID
app.get('/api/agents/:id', async (req, res) => {
  try {
    const agent = await storage.getAgentById(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Get all locations
app.get('/api/locations', async (_req, res) => {
  try {
    const locations = await storage.getAllLocations();
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get locations by city
app.get('/api/locations/:city', async (req, res) => {
  try {
    const areas = await storage.getLocationsByCity(req.params.city);
    res.json(areas);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  return app(req, res);
}
