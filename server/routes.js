import express from "express";
import { createServer } from "http";
import session from "express-session";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertStudentSchema, 
  insertModuleSchema,
  insertAttendanceSchema,
  insertGradeSchema,
  insertAssignmentSchema,
  insertAnnouncementSchema 
} from "@shared/schema.js";
import { storage } from "./storage.js";
import { AuthService, generateCSRFToken } from "./auth.js";
import { 
  setupSecurityMiddleware, 
  authMiddleware, 
  roleMiddleware, 
  csrfMiddleware, 
  auditMiddleware 
} from "./middleware.js";

export async function registerRoutes(app) {
  // Connect to database
  await storage.connect();

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    }
  }));

  // Setup security middleware
  setupSecurityMiddleware(app);

  // Apply audit logging to all routes
  app.use('/api', auditMiddleware(storage));

  // CSRF token endpoint
  app.get('/api/csrf-token', (req, res) => {
    const token = generateCSRFToken();
    req.session.csrfToken = token;
    res.json({ csrfToken: token });
  });

  // Authentication routes
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  app.post('/api/auth/register-admin', csrfMiddleware, async (req, res) => {
    try {
      // Check if any admin exists
      const existingUsers = await storage.getTeachers();
      const adminExists = existingUsers.some(user => user.role === 'admin');
      
      if (adminExists) {
        return res.status(400).json({ error: 'Admin already exists' });
      }

      const { email, password } = loginSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const passwordHash = await AuthService.hashPassword(password);
      const user = await storage.createUser({
        email,
        passwordHash,
        role: 'admin',
        isActive: true,
      });

      await storage.createAuditLog(user.id, 'admin_registered', { email }, req.ip);

      res.status(201).json({ 
        message: 'Admin created successfully',
        user: { id: user.id, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Register admin error:', error);
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', csrfMiddleware, async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await AuthService.verifyPassword(user.passwordHash, password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate tokens
      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken();
      const refreshTokenHash = await AuthService.hashRefreshToken(refreshToken);
      const expiresAt = AuthService.getRefreshTokenExpiry();

      // Store refresh token
      await storage.createRefreshToken(user.id, refreshTokenHash, expiresAt);

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      await storage.createAuditLog(user.id, 'login', { email }, req.ip);

      res.json({
        accessToken,
        user: { id: user.id, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ error: error.message || 'Login failed' });
    }
  });

  app.post('/api/auth/refresh', async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token' });
      }

      const refreshTokenHash = await AuthService.hashRefreshToken(refreshToken);
      const tokenData = await storage.getRefreshToken(refreshTokenHash);
      if (!tokenData) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      const user = await storage.getUser(tokenData.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'User not found' });
      }

      const newAccessToken = AuthService.generateAccessToken(user);
      
      res.json({
        accessToken: newAccessToken,
        user: { id: user.id, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({ error: 'Token refresh failed' });
    }
  });

  app.post('/api/auth/logout', authMiddleware(storage), async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        const refreshTokenHash = await AuthService.hashRefreshToken(refreshToken);
        await storage.deleteRefreshToken(refreshTokenHash);
      }

      res.clearCookie('refreshToken');
      await storage.createAuditLog(req.user.id, 'logout', {}, req.ip);
      
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  // User routes
  app.get('/api/users/me', authMiddleware(storage), async (req, res) => {
    res.json({ user: { id: req.user.id, email: req.user.email, role: req.user.role } });
  });

  // Teacher management routes (Admin only)
  app.get('/api/teachers', authMiddleware(storage), roleMiddleware(['admin']), async (req, res) => {
    try {
      const teachers = await storage.getTeachers();
      res.json(teachers.map(t => ({ id: t.id, email: t.email, isActive: t.isActive, createdAt: t.createdAt })));
    } catch (error) {
      console.error('Get teachers error:', error);
      res.status(500).json({ error: 'Failed to fetch teachers' });
    }
  });

  app.post('/api/teachers', authMiddleware(storage), roleMiddleware(['admin']), csrfMiddleware, async (req, res) => {
    try {
      const data = insertUserSchema.extend({ role: z.literal('teacher') }).parse(req.body);
      
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: 'Teacher already exists' });
      }

      const passwordHash = await AuthService.hashPassword(data.password);
      const teacher = await storage.createUser({
        ...data,
        passwordHash,
        role: 'teacher',
      });

      res.status(201).json({ 
        id: teacher.id, 
        email: teacher.email, 
        isActive: teacher.isActive, 
        createdAt: teacher.createdAt 
      });
    } catch (error) {
      console.error('Create teacher error:', error);
      res.status(400).json({ error: error.message || 'Failed to create teacher' });
    }
  });

  app.patch('/api/teachers/:id', authMiddleware(storage), roleMiddleware(['admin']), csrfMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const teacher = await storage.updateUser(id, updates);
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      res.json({ id: teacher.id, email: teacher.email, isActive: teacher.isActive });
    } catch (error) {
      console.error('Update teacher error:', error);
      res.status(400).json({ error: 'Failed to update teacher' });
    }
  });

  app.delete('/api/teachers/:id', authMiddleware(storage), roleMiddleware(['admin']), csrfMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
      console.error('Delete teacher error:', error);
      res.status(500).json({ error: 'Failed to delete teacher' });
    }
  });

  // Student routes
  app.get('/api/students', authMiddleware(storage), async (req, res) => {
    try {
      const teacherId = req.user.role === 'teacher' ? req.user.id : undefined;
      const students = await storage.getStudents(teacherId);
      res.json(students);
    } catch (error) {
      console.error('Get students error:', error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });

  app.post('/api/students', authMiddleware(storage), csrfMiddleware, async (req, res) => {
    try {
      const data = insertStudentSchema.parse(req.body);
      
      // If teacher, set teacherId to current user
      if (req.user.role === 'teacher') {
        data.teacherId = req.user.id;
      }

      const student = await storage.createStudent(data);
      res.status(201).json(student);
    } catch (error) {
      console.error('Create student error:', error);
      res.status(400).json({ error: error.message || 'Failed to create student' });
    }
  });

  app.patch('/api/students/:id', authMiddleware(storage), csrfMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // If teacher, ensure they can only update their own students
      if (req.user.role === 'teacher') {
        const existingStudent = await storage.getStudent(id);
        if (!existingStudent || existingStudent.teacherId !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      const student = await storage.updateStudent(id, updates);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      console.error('Update student error:', error);
      res.status(400).json({ error: 'Failed to update student' });
    }
  });

  app.delete('/api/students/:id', authMiddleware(storage), csrfMiddleware, async (req, res) => {
    try {
      const { id } = req.params;

      // If teacher, ensure they can only delete their own students
      if (req.user.role === 'teacher') {
        const existingStudent = await storage.getStudent(id);
        if (!existingStudent || existingStudent.teacherId !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      const success = await storage.deleteStudent(id);
      if (!success) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Delete student error:', error);
      res.status(500).json({ error: 'Failed to delete student' });
    }
  });

  // Module routes
  app.get('/api/modules', authMiddleware(storage), async (req, res) => {
    try {
      const teacherId = req.user.role === 'teacher' ? req.user.id : undefined;
      const modules = await storage.getModules(teacherId);
      res.json(modules);
    } catch (error) {
      console.error('Get modules error:', error);
      res.status(500).json({ error: 'Failed to fetch modules' });
    }
  });

  app.post('/api/modules', authMiddleware(storage), roleMiddleware(['teacher']), csrfMiddleware, async (req, res) => {
    try {
      const data = insertModuleSchema.parse({ ...req.body, teacherId: req.user.id });
      const module = await storage.createModule(data);
      res.status(201).json(module);
    } catch (error) {
      console.error('Create module error:', error);
      res.status(400).json({ error: error.message || 'Failed to create module' });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', authMiddleware(storage), async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(req.user.id, req.user.role);
      res.json(stats);
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });

  // Audit logs (Admin only)
  app.get('/api/audit', authMiddleware(storage), roleMiddleware(['admin']), async (req, res) => {
    try {
      const logs = await storage.getAuditLogs(100);
      res.json(logs);
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  });

  // Attendance routes
  app.get('/api/attendance', authMiddleware(storage), async (req, res) => {
    try {
      const { studentId, date } = req.query;
      const filters = {
        teacherId: req.user.role === 'teacher' ? req.user.id : undefined,
        studentId: studentId,
        date: date ? new Date(date) : undefined,
      };
      
      const attendance = await storage.getAttendance(filters);
      res.json(attendance);
    } catch (error) {
      console.error('Get attendance error:', error);
      res.status(500).json({ error: 'Failed to fetch attendance' });
    }
  });

  app.post('/api/attendance', authMiddleware(storage), roleMiddleware(['teacher']), csrfMiddleware, async (req, res) => {
    try {
      const data = insertAttendanceSchema.parse({ ...req.body, teacherId: req.user.id });
      const attendance = await storage.createAttendance(data);
      res.status(201).json(attendance);
    } catch (error) {
      console.error('Create attendance error:', error);
      res.status(400).json({ error: error.message || 'Failed to record attendance' });
    }
  });

  // Assignment routes
  app.get('/api/assignments', authMiddleware(storage), async (req, res) => {
    try {
      const teacherId = req.user.role === 'teacher' ? req.user.id : undefined;
      const assignments = await storage.getAssignments(teacherId);
      res.json(assignments);
    } catch (error) {
      console.error('Get assignments error:', error);
      res.status(500).json({ error: 'Failed to fetch assignments' });
    }
  });

  app.post('/api/assignments', authMiddleware(storage), roleMiddleware(['teacher']), csrfMiddleware, async (req, res) => {
    try {
      const data = insertAssignmentSchema.parse({ ...req.body, teacherId: req.user.id });
      const assignment = await storage.createAssignment(data);
      res.status(201).json(assignment);
    } catch (error) {
      console.error('Create assignment error:', error);
      res.status(400).json({ error: error.message || 'Failed to create assignment' });
    }
  });

  // Announcement routes
  app.get('/api/announcements', authMiddleware(storage), async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error('Get announcements error:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  app.post('/api/announcements', authMiddleware(storage), roleMiddleware(['admin']), csrfMiddleware, async (req, res) => {
    try {
      const data = insertAnnouncementSchema.parse({ ...req.body, userId: req.user.id });
      const announcement = await storage.createAnnouncement(data);
      res.status(201).json(announcement);
    } catch (error) {
      console.error('Create announcement error:', error);
      res.status(400).json({ error: error.message || 'Failed to create announcement' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
