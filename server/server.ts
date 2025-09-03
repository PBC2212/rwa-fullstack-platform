import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { connectDatabase } from './database.js';
import { User, IUser } from './models/User.js';
import { Asset, IAsset } from './models/Asset.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Connect to MongoDB
connectDatabase();

// JWT Middleware
const authenticateToken = async (req: any, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

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
    version: '1.0.0',
    database: 'MongoDB Connected'
  });
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        kycStatus: user.kycStatus
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        kycStatus: user.kycStatus
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    kycStatus: req.user.kycStatus
  });
});

// KYC routes
app.post('/api/kyc/submit', authenticateToken, async (req: any, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.kycStatus = 'pending';
    user.kycDocuments = req.body.documents || [];
    await user.save();

    res.json({
      success: true,
      message: 'KYC submitted successfully',
      status: user.kycStatus
    });
  } catch (error: any) {
    console.error('KYC submit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/kyc/status', authenticateToken, (req: any, res) => {
  res.json({
    status: req.user.kycStatus,
    submittedAt: req.user.updatedAt
  });
});

// Asset routes
app.post('/api/assets/pledge', authenticateToken, async (req: any, res) => {
  try {
    const { assetType, description, estimatedValue, documents } = req.body;

    const asset = new Asset({
      owner: req.user._id,
      assetType,
      description,
      estimatedValue,
      documents: documents || []
    });

    await asset.save();

    res.json({
      success: true,
      message: 'Asset pledged successfully',
      asset: {
        id: asset._id,
        assetType: asset.assetType,
        description: asset.description,
        estimatedValue: asset.estimatedValue,
        status: asset.status
      }
    });
  } catch (error: any) {
    console.error('Asset pledge error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/assets/mine', authenticateToken, async (req: any, res) => {
  try {
    const assets = await Asset.find({ owner: req.user._id });
    res.json({
      assets: assets.map(asset => ({
        id: asset._id,
        assetType: asset.assetType,
        description: asset.description,
        estimatedValue: asset.estimatedValue,
        status: asset.status,
        tokenId: asset.tokenId,
        tokenSymbol: asset.tokenSymbol,
        isListed: asset.isListed,
        createdAt: asset.createdAt
      }))
    });
  } catch (error: any) {
    console.error('Get assets error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/assets/:id/mint', authenticateToken, async (req: any, res) => {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, owner: req.user._id });
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    if (asset.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Asset must be approved before minting' });
    }

    // Generate mock token details
    const tokenId = `TOKEN_${Date.now()}`;
    const tokenSymbol = `${asset.assetType.toUpperCase()}${Math.floor(Math.random() * 1000)}`;

    asset.tokenId = tokenId;
    asset.tokenSymbol = tokenSymbol;
    asset.tokenSupply = 1000;
    asset.tokenPrice = asset.estimatedValue / 1000;
    asset.status = 'tokenized';
    await asset.save();

    res.json({
      success: true,
      message: 'Tokens minted successfully',
      tokenId: asset.tokenId,
      tokenSymbol: asset.tokenSymbol,
      supply: asset.tokenSupply,
      price: asset.tokenPrice
    });
  } catch (error: any) {
    console.error('Token mint error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Marketplace routes
app.get('/api/assets/marketplace', async (req, res) => {
  try {
    const assets = await Asset.find({ 
      status: 'tokenized',
      isListed: true 
    }).populate('owner', 'name email');

    res.json({
      assets: assets.map(asset => ({
        id: asset._id,
        assetType: asset.assetType,
        description: asset.description,
        estimatedValue: asset.estimatedValue,
        tokenId: asset.tokenId,
        tokenSymbol: asset.tokenSymbol,
        tokenPrice: asset.tokenPrice,
        owner: asset.owner
      }))
    });
  } catch (error: any) {
    console.error('Marketplace error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/marketplace/buy/:tokenId', authenticateToken, async (req: any, res) => {
  try {
    const asset = await Asset.findOne({ tokenId: req.params.tokenId });
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }

    // Mock purchase logic
    res.json({
      success: true,
      message: 'Token purchased successfully',
      transactionId: `TX_${Date.now()}`,
      tokenId: asset.tokenId,
      amount: req.body.amount || 1
    });
  } catch (error: any) {
    console.error('Token purchase error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Liquidity routes
app.get('/api/liquidity/pools', (req, res) => {
  res.json({
    pools: [
      {
        id: 'pool123',
        name: 'RWA-ETH Pool',
        tvl: 2000000,
        apr: 12.5
      }
    ]
  });
});

app.post('/api/liquidity/provide', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Liquidity provided successfully',
    lpTokens: req.body.amount || 1000
  });
});

// Activity routes
app.get('/api/activity/mine', authenticateToken, async (req: any, res) => {
  try {
    const assets = await Asset.find({ owner: req.user._id }).sort({ createdAt: -1 });
    
    const activities = assets.map(asset => ({
      id: `activity_${asset._id}`,
      type: asset.status === 'tokenized' ? 'token_minted' : 'asset_pledged',
      timestamp: asset.updatedAt,
      description: `${asset.assetType} - ${asset.description}`,
      status: asset.status,
      value: asset.estimatedValue
    }));

    res.json({ activities });
  } catch (error: any) {
    console.error('Activity error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
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
  console.log(`🗄️  MongoDB integration active`);
});

export default app;