import jwt from "jsonwebtoken";
import { storage } from "../storage.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await storage.getUser(decoded.userId);
      
      if (!user || !user.is_active) {
        return res.status(401).json({ error: "Invalid or inactive user" });
      }

      req.user = user;
      req.userId = user.id;
      next();
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
      }
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
}

export function requireRole(roles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      // For teacher role, get teacher profile
      if (req.user.role === "teacher") {
        const teacher = await storage.getTeacherByUserId(req.user.id);
        if (!teacher) {
          return res.status(404).json({ error: "Teacher profile not found" });
        }
        req.teacher = teacher;
      }

      next();
    } catch (error) {
      console.error("Role middleware error:", error);
      res.status(500).json({ error: "Authorization error" });
    }
  };
}

export function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, type: "refresh" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

export async function refreshAccessToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      
      if (decoded.type !== "refresh") {
        return res.status(401).json({ error: "Invalid token type" });
      }

      // Check if refresh token exists in database
      const crypto = await import("crypto");
      const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
      const storedToken = await storage.getRefreshToken(tokenHash);
      
      if (!storedToken || storedToken.expires_at < new Date()) {
        return res.status(401).json({ error: "Invalid or expired refresh token" });
      }

      const user = await storage.getUser(decoded.userId);
      
      if (!user || !user.is_active) {
        return res.status(401).json({ error: "User not found or inactive" });
      }

      // Generate new access token
      const { accessToken } = generateTokens(user);
      
      res.json({ accessToken });
    } catch (jwtError) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Token refresh error" });
  }
}
