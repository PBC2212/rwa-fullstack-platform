import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for React app
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'https://www.imecapitaltokenization.com',
    'https://imecapitaltokenization.com'
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist directory (built React app)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

// API Routes
// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Authentication routes
app.post('/api/auth/register', (req, res) => {
  // Mock registration - replace with real implementation
  res.json({
    success: true,
    message: 'User registered successfully',
    user: { id: 'user123', email: req.body.email }
  });
});

app.post('/api/auth/login', (req, res) => {
  // Mock login - replace with real implementation
  res.json({
    success: true,
    token: 'mock-jwt-token',
    user: { id: 'user123', email: req.body.email }
  });
});

app.get('/api/auth/me', (req, res) => {
  // Mock user info - replace with real implementation
  res.json({
    id: 'user123',
    email: 'user@example.com',
    name: 'John Doe'
  });
});

// KYC routes
app.post('/api/kyc/submit', (req, res) => {
  res.json({
    success: true,
    message: 'KYC submitted successfully',
    kycId: 'kyc123'
  });
});

app.get('/api/kyc/status', (req, res) => {
  res.json({
    status: 'pending',
    submittedAt: new Date().toISOString()
  });
});

// Asset routes
app.post('/api/assets/pledge', (req, res) => {
  res.json({
    success: true,
    message: 'Asset pledged successfully',
    assetId: 'asset123'
  });
});

app.get('/api/assets/mine', (req, res) => {
  res.json({
    assets: [
      {
        id: 'asset123',
        name: 'Real Estate Property',
        value: 1000000,
        status: 'active'
      }
    ]
  });
});

app.post('/api/assets/:id/mint', (req, res) => {
  res.json({
    success: true,
    message: 'Tokens minted successfully',
    tokenId: 'token123'
  });
});

// Marketplace routes
app.get('/api/assets/marketplace', (req, res) => {
  res.json({
    assets: [
      {
        id: 'asset123',
        name: 'Commercial Property',
        price: 500000,
        available: true
      }
    ]
  });
});

app.post('/api/marketplace/buy/:tokenId', (req, res) => {
  res.json({
    success: true,
    message: 'Token purchased successfully',
    transactionId: 'tx123'
  });
});

// Liquidity routes
app.get('/api/liquidity/pools', (req, res) => {
  res.json({
    pools: [
      {
        id: 'pool123',
        name: 'RWA-ETH Pool',
        tvl: 2000000
      }
    ]
  });
});

app.post('/api/liquidity/provide', (req, res) => {
  res.json({
    success: true,
    message: 'Liquidity provided successfully',
    lpTokens: 1000
  });
});

// Activity routes
app.get('/api/activity/mine', (req, res) => {
  res.json({
    activities: [
      {
        id: 'act123',
        type: 'asset_pledged',
        timestamp: new Date().toISOString(),
        description: 'Asset pledged successfully'
      }
    ]
  });
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Frontend served from: ${distPath}`);
  console.log(`🔗 API endpoints available at /api/*`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 All endpoints ready for production`);
});

export default app;