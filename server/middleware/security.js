import rateLimit from "express-rate-limit";
import helmet from "helmet";
import crypto from "crypto";

// CSRF Protection
export function csrfProtection(req, res, next) {
  if (req.method === "GET") {
    // Generate CSRF token for GET requests
    const token = crypto.randomBytes(32).toString("hex");
    res.cookie("csrfToken", token, { 
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    res.locals.csrfToken = token;
    return next();
  }

  // Validate CSRF token for state-changing requests
  const tokenFromHeader = req.headers["x-csrf-token"];
  const tokenFromCookie = req.cookies.csrfToken;

  if (!tokenFromHeader || !tokenFromCookie || tokenFromHeader !== tokenFromCookie) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  next();
}

// Rate limiting
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers
export function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  });
}

// Audit logging middleware
export function auditLogger(action) {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const { storage } = require("../storage.ts");
        
        // Extract resource info from request
        let resource = req.route?.path || req.path;
        let resourceId = req.params.id || req.body.id;
        
        storage.createAuditLog({
          user_id: req.user?.id,
          action,
          resource,
          resource_id: resourceId,
          meta: {
            method: req.method,
            userAgent: req.get("User-Agent"),
            statusCode: res.statusCode
          },
          ip_address: req.ip
        }).catch(err => console.error("Audit log error:", err));
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
}
