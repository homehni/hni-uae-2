import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { storage } from '../server/storage';
import { propertyFilterSchema, loginSchema, registerSchema, insertLeadSchema, insertPropertySchema, type UserRoleType } from '@shared/schema';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple session-based auth (for demo - in production use proper session store)
interface AuthSession {
  userId: string;
  role: UserRoleType;
}

const sessions = new Map<string, AuthSession>();

// Simple in-memory rate limiter for auth endpoints
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 attempts per window

function getClientIP(req: Request): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
         req.socket.remoteAddress || 
         'unknown';
}

function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientIP = getClientIP(req);
  const now = Date.now();
  
  const entry = rateLimitStore.get(clientIP);
  
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    res.set('Retry-After', retryAfter.toString());
    return res.status(429).json({ error: 'Too many requests. Please try again later.', retryAfter });
  }
  
  entry.count++;
  rateLimitStore.set(clientIP, entry);
  next();
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  (req as any).session = sessions.get(token);
  next();
}

function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token && sessions.has(token)) {
    (req as any).session = sessions.get(token);
  }
  next();
}

// ============================================
// AUTH ROUTES (with rate limiting)
// ============================================

app.post('/api/auth/register', rateLimitMiddleware, async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    const user = await storage.createUser({
      email: data.email,
      phone: data.phone,
      password: data.password,
      name: data.name,
      role: data.role,
      company: data.company,
    });
    const token = generateSessionToken();
    sessions.set(token, { userId: user.id, role: user.role as UserRoleType });
    res.json({ user: { ...user, password: undefined }, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: "Invalid registration data" });
  }
});

app.post('/api/auth/login', rateLimitMiddleware, async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    let user;
    if (data.email) {
      user = await storage.getUserByEmail(data.email);
    } else if (data.phone) {
      user = await storage.getUserByPhone(data.phone);
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (data.otp) {
      const isValid = await storage.verifyOTP(data.email, data.phone, data.otp, "login");
      if (!isValid) {
        return res.status(401).json({ error: "Invalid or expired OTP" });
      }
    } else if (data.password) {
      const isValid = await storage.verifyPassword(user, data.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid password" });
      }
    } else {
      return res.status(400).json({ error: "Password or OTP required" });
    }
    const token = generateSessionToken();
    sessions.set(token, { userId: user.id, role: user.role as UserRoleType });
    res.json({ user: { ...user, password: undefined }, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: "Invalid login data" });
  }
});

app.post('/api/auth/request-otp', rateLimitMiddleware, async (req, res) => {
  try {
    const { email, phone, type = "login" } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone required" });
    }
    const otp = await storage.createOTP(email, phone, type);
    // In production, send OTP via SMS/email service
    console.log(`[DEV] OTP for ${email || phone}: ${otp}`);
    res.json({ message: "OTP sent successfully. Please check your email/phone." });
  } catch (error) {
    console.error("OTP request error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.post('/api/auth/logout', authMiddleware, async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) sessions.delete(token);
  res.json({ message: "Logged out successfully" });
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).session;
    const user = await storage.getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ ...user, password: undefined });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// DASHBOARD & WALLET ROUTES
// ============================================

app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).session;
    const stats = await storage.getDashboardStats(userId);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/wallet', authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).session;
    const wallet = await storage.getWalletByUserId(userId);
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json(wallet);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/wallet/transactions', authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).session;
    const transactions = await storage.getTransactionsByUserId(userId);
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/wallet/add-credits', authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).session;
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    const transaction = await storage.updateWalletBalance(userId, amount, "credit_purchase", `Purchased ${amount} credits`);
    if (!transaction) return res.status(500).json({ error: "Failed to add credits" });
    const wallet = await storage.getWalletByUserId(userId);
    res.json({ transaction, wallet });
  } catch (error) {
    console.error("Error adding credits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// LEADS ROUTES
// ============================================

app.get('/api/leads', authMiddleware, async (req, res) => {
  try {
    const { userId, role } = (req as any).session;
    const filters: any = {};
    if (role !== "admin") filters.assignedTo = userId;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.leadType) filters.leadType = req.query.leadType;
    const leads = await storage.getAllLeads(filters);
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/leads/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await storage.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/leads', optionalAuthMiddleware, async (req, res) => {
  try {
    const leadData = insertLeadSchema.parse(req.body);
    const lead = await storage.createLead(leadData);
    res.json(lead);
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(400).json({ error: "Invalid lead data" });
  }
});

app.patch('/api/leads/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await storage.updateLead(req.params.id, req.body);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/leads/:id/unlock', authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).session;
    const lead = await storage.unlockLead(req.params.id, userId);
    if (!lead) return res.status(400).json({ error: "Failed to unlock lead" });
    res.json(lead);
  } catch (error) {
    console.error("Error unlocking lead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// NOTIFICATIONS ROUTES
// ============================================

app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).session;
    const notifications = await storage.getNotificationsByUserId(userId);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const success = await storage.markNotificationAsRead(req.params.id);
    if (!success) return res.status(404).json({ error: "Notification not found" });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// PLANS & SUBSCRIPTIONS
// ============================================

app.get('/api/plans', async (req, res) => {
  try {
    const roleType = req.query.role as UserRoleType | undefined;
    const plans = await storage.getAllPlans(roleType);
    res.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/subscriptions/active', authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).session;
    const subscription = await storage.getActiveSubscription(userId);
    res.json(subscription || null);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/subscriptions', authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).session;
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ error: "Plan ID required" });
    const subscription = await storage.createSubscription(userId, planId);
    if (!subscription) return res.status(400).json({ error: "Failed to create subscription" });
    res.json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// SERVICES & PROJECTS
// ============================================

app.get('/api/services', async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const services = await storage.getAllServices(category);
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const builderId = req.query.builderId as string | undefined;
    const projects = await storage.getAllProjects(builderId);
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// PROPERTY ROUTES
// ============================================

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
      status: req.query.status as string | undefined,
      ownerId: req.query.ownerId as string | undefined,
      agentId: req.query.agentId as string | undefined,
      builderId: req.query.builderId as string | undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    const properties = await storage.getAllProperties(filters);
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/my-properties', authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).session;
    const properties = await storage.getAllProperties({ ownerId: userId });
    res.json(properties);
  } catch (error) {
    console.error("Error fetching my properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

app.post('/api/properties', authMiddleware, async (req, res) => {
  try {
    const { userId, role } = (req as any).session;
    if (!["owner", "agent", "builder", "admin"].includes(role)) {
      return res.status(403).json({ error: "Not authorized to create properties" });
    }
    const propertyData = insertPropertySchema.parse({
      ...req.body,
      ownerId: role === "owner" ? userId : req.body.ownerId,
      agentId: role === "agent" ? userId : req.body.agentId,
      builderId: role === "builder" ? userId : req.body.builderId,
    });
    const property = await storage.createProperty(propertyData);
    res.json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(400).json({ error: "Invalid property data" });
  }
});

app.patch('/api/properties/:id', authMiddleware, async (req, res) => {
  try {
    const { userId, role } = (req as any).session;
    const property = await storage.getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    const isOwner = property.ownerId === userId || property.agentId === userId || property.builderId === userId;
    if (!isOwner && role !== "admin") {
      return res.status(403).json({ error: "Not authorized to update this property" });
    }
    const updatedProperty = await storage.updateProperty(req.params.id, req.body);
    res.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete('/api/properties/:id', authMiddleware, async (req, res) => {
  try {
    const { userId, role } = (req as any).session;
    const property = await storage.getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    const isOwner = property.ownerId === userId || property.agentId === userId || property.builderId === userId;
    if (!isOwner && role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this property" });
    }
    await storage.deleteProperty(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// AGENTS & LOCATIONS (backward compat)
// ============================================

app.get('/api/agents', async (_req, res) => {
  try {
    const agents = await storage.getAllAgents();
    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

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

app.get('/api/locations', async (_req, res) => {
  try {
    const locations = await storage.getAllLocations();
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

app.get('/api/locations/:city', async (req, res) => {
  try {
    const areas = await storage.getLocationsByCity(req.params.city);
    res.json(areas);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const { role } = (req as any).session;
    if (role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const roleFilter = req.query.role as UserRoleType | undefined;
    const users = await storage.getAllUsers(roleFilter);
    res.json(users.map(u => ({ ...u, password: undefined })));
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  return app(req, res);
}
