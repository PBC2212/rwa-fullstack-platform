import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Input validation helper
const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/(?=.*\d)/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: "Name must be at least 2 characters long" 
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid email address" 
      });
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ 
        success: false, 
        message: passwordError 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = new User({ 
      name: name.trim(), 
      email: email.toLowerCase(), 
      passwordHash 
    });
    
    await newUser.save();

    return res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        kycStatus: newUser.kycStatus
      }
    });

  } catch (err: any) {
    console.error("Registration error:", err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: "Registration failed. Please try again." 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    if (!JWT_SECRET || JWT_SECRET === "supersecret") {
      console.warn("WARNING: Using default JWT secret. Set JWT_SECRET environment variable!");
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: "24h" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        kycStatus: user.kycStatus,
      },
    });

  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Login failed. Please try again." 
    });
  }
};

// Get current user (requires authentication)
export const getMe = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await User.findById(decoded.id).select('-passwordHash');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid token" 
        });
      }

      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          kycStatus: user.kycStatus,
        },
      });

    } catch (tokenError) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

  } catch (err: any) {
    console.error("Get me error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to get user information" 
    });
  }
};