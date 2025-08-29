import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { AuthService, generateCSRFToken } from './auth.js';

export function setupSecurityMiddleware(app) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: isDevelopment 
          ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"] 
          : ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: isDevelopment 
          ? ["'self'", "ws:", "wss:"] 
          : ["'self'"]
      }
    }
  }));

  // CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true, // Trust proxy in Replit environment
  });

  app.use('/api/', limiter);

  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // increased limit for auth endpoints including registration
    message: {
      error: 'Too many authentication attempts, please try again later.'
    },
    trustProxy: true, // Trust proxy in Replit environment
  });

  app.use('/api/auth/', authLimiter);
}

export function authMiddleware(storage) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.substring(7);
      const decoded = AuthService.verifyAccessToken(token);
      
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const user = await storage.getUser(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'User not found or inactive' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  };
}

export function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

export function csrfMiddleware(req, res, next) {
  if (req.method === 'GET') {
    return next();
  }

  const token = req.headers['x-csrf-token'];
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
}

export function auditMiddleware(storage) {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the action after response is sent
      setImmediate(async () => {
        try {
          const action = `${req.method} ${req.path}`;
          const meta = {
            params: req.params,
            query: req.query,
            statusCode: res.statusCode,
          };
          
          const userId = req.user?.id || null;
          const ipAddress = req.ip || req.connection.remoteAddress;
          
          await storage.createAuditLog(userId, action, meta, ipAddress);
        } catch (error) {
          console.error('Audit logging error:', error);
        }
      });
      
      return originalSend.call(this, data);
    };
    
    next();
  };
}
