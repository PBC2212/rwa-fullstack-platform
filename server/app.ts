import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Application = express();

// CORS configuration for your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Add limit for file uploads if needed
app.use(express.urlencoded({ extended: true }));

// Basic health check
app.get("/", (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: "RWA Platform Backend Running 🚀",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    status: "healthy", 
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ 
    success: false, 
    message: "Endpoint not found" 
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

export default app;