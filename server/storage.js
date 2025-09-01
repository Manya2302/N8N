import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { eq, and, desc, count, sql } from "drizzle-orm";
import {
  users,
  students,
  modules,
  auditLogs,
  attendance,
  grades,
  assignments,
  announcements,
  refreshTokens,
} from "@shared/schema";


class PostgresStorage {
  client;
  db;

  constructor() {
    const DATABASE_URL = "postgresql://postgres.qzfbphcntjynkudctpuo:CRMN8N@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";
    this.client = new Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    this.db = drizzle(this.client);
    console.log('🔗 Connected to database: Supabase');
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  // User methods
  async getUser(id) {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email) {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user) {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id, updates) {
    const result = await this.db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id) {
    const result = await this.db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getTeachers() {
    return await this.db.select().from(users).where(eq(users.role, "teacher"));
  }

  // Student methods
  async getStudents(teacherId) {
    if (teacherId) {
      return await this.db.select().from(students).where(eq(students.teacherId, teacherId));
    }
    return await this.db.select().from(students);
  }

  async getStudent(id) {
    const result = await this.db.select().from(students).where(eq(students.id, id)).limit(1);
    return result[0];
  }

  async createStudent(student) {
    const result = await this.db.insert(students).values(student).returning();
    return result[0];
  }

  async updateStudent(id, updates) {
    const result = await this.db
      .update(students)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return result[0];
  }

  async deleteStudent(id) {
    const result = await this.db.delete(students).where(eq(students.id, id));
    return result.rowCount > 0;
  }

  async getStudentsByTeacher(teacherId) {
    return await this.db.select().from(students).where(eq(students.teacherId, teacherId));
  }

  // Module methods
  async getModules(teacherId) {
    if (teacherId) {
      return await this.db.select().from(modules).where(eq(modules.teacherId, teacherId));
    }
    return await this.db.select().from(modules);
  }

  async getModule(id) {
    const result = await this.db.select().from(modules).where(eq(modules.id, id)).limit(1);
    return result[0];
  }

  async createModule(module) {
    const result = await this.db.insert(modules).values(module).returning();
    return result[0];
  }

  async updateModule(id, updates) {
    const result = await this.db
      .update(modules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(modules.id, id))
      .returning();
    return result[0];
  }

  async deleteModule(id) {
    const result = await this.db.delete(modules).where(eq(modules.id, id));
    return result.rowCount > 0;
  }

  // Attendance methods
  async getAttendance(filters = {}) {
    let query = this.db.select().from(attendance);
    
    if (filters.studentId) {
      query = query.where(eq(attendance.studentId, filters.studentId));
    }
    if (filters.teacherId) {
      query = query.where(eq(attendance.teacherId, filters.teacherId));
    }
    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      query = query.where(and(
        sql`${attendance.date} >= ${startOfDay}`,
        sql`${attendance.date} <= ${endOfDay}`
      ));
    }
    
    return await query.orderBy(desc(attendance.date));
  }

  async createAttendance(attendanceData) {
    const result = await this.db.insert(attendance).values(attendanceData).returning();
    return result[0];
  }

  async updateAttendance(id, updates) {
    const result = await this.db
      .update(attendance)
      .set(updates)
      .where(eq(attendance.id, id))
      .returning();
    return result[0];
  }

  // Grade methods
  async getGrades(filters = {}) {
    let query = this.db.select().from(grades);
    
    if (filters.studentId) {
      query = query.where(eq(grades.studentId, filters.studentId));
    }
    if (filters.teacherId) {
      query = query.where(eq(grades.teacherId, filters.teacherId));
    }
    if (filters.moduleId) {
      query = query.where(eq(grades.moduleId, filters.moduleId));
    }
    
    return await query.orderBy(desc(grades.examDate));
  }

  async createGrade(grade) {
    const result = await this.db.insert(grades).values(grade).returning();
    return result[0];
  }

  async updateGrade(id, updates) {
    const result = await this.db
      .update(grades)
      .set(updates)
      .where(eq(grades.id, id))
      .returning();
    return result[0];
  }

  // Assignment methods
  async getAssignments(teacherId) {
    if (teacherId) {
      return await this.db.select().from(assignments).where(eq(assignments.teacherId, teacherId)).orderBy(desc(assignments.dueDate));
    }
    return await this.db.select().from(assignments).orderBy(desc(assignments.dueDate));
  }

  async createAssignment(assignment) {
    const result = await this.db.insert(assignments).values(assignment).returning();
    return result[0];
  }

  async updateAssignment(id, updates) {
    const result = await this.db
      .update(assignments)
      .set(updates)
      .where(eq(assignments.id, id))
      .returning();
    return result[0];
  }

  async deleteAssignment(id) {
    const result = await this.db.delete(assignments).where(eq(assignments.id, id));
    return result.rowCount > 0;
  }

  // Announcement methods
  async getAnnouncements() {
    return await this.db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement) {
    const result = await this.db.insert(announcements).values(announcement).returning();
    return result[0];
  }

  async updateAnnouncement(id, updates) {
    const result = await this.db
      .update(announcements)
      .set(updates)
      .where(eq(announcements.id, id))
      .returning();
    return result[0];
  }

  async deleteAnnouncement(id) {
    const result = await this.db.update(announcements).set({ isActive: false }).where(eq(announcements.id, id));
    return result.rowCount > 0;
  }

  // Refresh token methods
  async createRefreshToken(userId, tokenHash, expiresAt) {
    await this.db.insert(refreshTokens).values({ userId, tokenHash, expiresAt });
  }

  async getRefreshToken(tokenHash) {
    const result = await this.db
      .select({ userId: refreshTokens.userId })
      .from(refreshTokens)
      .where(and(eq(refreshTokens.tokenHash, tokenHash), sql`${refreshTokens.expiresAt} > now()`))
      .limit(1);
    return result[0];
  }

  async deleteRefreshToken(tokenHash) {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash));
  }

  async deleteAllRefreshTokens(userId) {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  // Audit methods
  async createAuditLog(userId, action, meta, ipAddress) {
    await this.db.insert(auditLogs).values({ userId, action, meta, ipAddress });
  }

  async getAuditLogs(limit = 100) {
    return await this.db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }

  // Dashboard stats
  async getDashboardStats(userId, role) {
    if (role === "teacher") {
      const totalStudents = await this.db
        .select({ count: count() })
        .from(students)
        .where(eq(students.teacherId, userId));

      const todayAttendance = await this.db
        .select({ count: count() })
        .from(attendance)
        .where(and(
          eq(attendance.teacherId, userId),
          eq(attendance.status, "present"),
          sql`DATE(${attendance.date}) = CURRENT_DATE`
        ));

      const pendingAssignments = await this.db
        .select({ count: count() })
        .from(assignments)
        .where(and(
          eq(assignments.teacherId, userId),
          eq(assignments.status, "active"),
          sql`${assignments.dueDate} > now()`
        ));

      return {
        totalStudents: totalStudents[0]?.count || 0,
        presentToday: todayAttendance[0]?.count || 0,
        pendingAssignments: pendingAssignments[0]?.count || 0,
        todayClasses: 6, // This would come from a schedule table
      };
    } else {
      // Admin stats
      const totalTeachers = await this.db
        .select({ count: count() })
        .from(users)
        .where(eq(users.role, "teacher"));

      const totalStudents = await this.db
        .select({ count: count() })
        .from(students);

      const activeAnnouncements = await this.db
        .select({ count: count() })
        .from(announcements)
        .where(eq(announcements.isActive, true));

      return {
        totalTeachers: totalTeachers[0]?.count || 0,
        totalStudents: totalStudents[0]?.count || 0,
        activeAnnouncements: activeAnnouncements[0]?.count || 0,
        systemHealth: "Good",
      };
    }
  }

  // Fee Management methods
  async getFeeOverview() {
    const categories = await this.db.select().from(feeCategories);
    
    // Calculate totals and stats from the fee categories
    const totalFees = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const avgFee = categories.length > 0 ? totalFees / categories.length : 0;
    
    return {
      totalCollected: totalFees,
      pending: Math.floor(totalFees * 0.15), // Mock pending amount
      overdue: Math.floor(totalFees * 0.05), // Mock overdue amount
      categories
    };
  }

  async getStudentFees() {
    // Mock student fee data matching the UI structure
    return [
      { id: 1, studentName: "Alice Johnson", studentId: "ST001", class: "10A", totalAmount: 125400, paidAmount: 125400, status: "Paid", dueDate: "2024-01-15" },
      { id: 2, studentName: "Bob Smith", studentId: "ST002", class: "10B", totalAmount: 125400, paidAmount: 75000, status: "Partial", dueDate: "2024-01-15" },
      { id: 3, studentName: "Carol Brown", studentId: "ST003", class: "9A", totalAmount: 125400, paidAmount: 0, status: "Pending", dueDate: "2024-01-15" }
    ];
  }

  // Transport Management methods
  async getTransportStats() {
    const totalBuses = await this.db.select({ count: count() }).from(buses);
    const activeBuses = await this.db.select({ count: count() }).from(buses).where(eq(buses.status, 'active'));
    const totalRoutes = await this.db.select({ count: count() }).from(routes);
    const totalDrivers = await this.db.select({ count: count() }).from(drivers);

    return {
      totalBuses: totalBuses[0]?.count || 0,
      activeBuses: activeBuses[0]?.count || 0,
      totalRoutes: totalRoutes[0]?.count || 0,
      totalDrivers: totalDrivers[0]?.count || 0,
      studentsUsingTransport: 42 // Mock data
    };
  }

  async getTransportRoutes() {
    return await this.db
      .select({
        id: routes.id,
        routeName: routes.routeName,
        busNumber: buses.busNumber,
        driverName: drivers.name,
        status: routes.status,
        stops: routes.stops,
        startPoint: routes.startPoint,
        endPoint: routes.endPoint
      })
      .from(routes)
      .leftJoin(buses, eq(routes.busId, buses.id))
      .leftJoin(drivers, eq(routes.driverId, drivers.id));
  }

  async getTransportSchedule() {
    return await this.db
      .select({
        id: transportSchedule.id,
        routeName: routes.routeName,
        scheduledTime: transportSchedule.scheduledTime,
        location: transportSchedule.location,
        status: transportSchedule.status
      })
      .from(transportSchedule)
      .leftJoin(routes, eq(transportSchedule.routeId, routes.id));
  }

  async getDrivers() {
    return await this.db.select().from(drivers);
  }

  // Digital Library methods
  async getLibraryStats() {
    try {
      // Import books table dynamically to avoid circular dependency issues
      const { books } = await import("@shared/schema");
      
      const totalBooks = await this.db.select({ count: count() }).from(books);
      const borrowedCount = await this.db
        .select({ count: count() })
        .from(books)
        .where(sql`${books.totalCopies} > ${books.availableCopies}`);
      
      const ebooksCount = await this.db
        .select({ count: count() })
        .from(books)
        .where(eq(books.isEbook, true));
        
      const audiobooksCount = await this.db
        .select({ count: count() })
        .from(books)
        .where(eq(books.isAudiobook, true));
        
      const categoriesCount = await this.db
        .select({ count: sql`COUNT(DISTINCT ${books.category})` })
        .from(books);

      return {
        totalBooks: totalBooks[0]?.count || 0,
        borrowed: borrowedCount[0]?.count || 0,
        ebooks: ebooksCount[0]?.count || 0,
        audiobooks: audiobooksCount[0]?.count || 0,
        categories: categoriesCount[0]?.count || 0
      };
    } catch (error) {
      console.error('Error fetching library stats:', error);
      // Return fallback data if database query fails
      return {
        totalBooks: 0,
        borrowed: 0,
        ebooks: 0,
        audiobooks: 0,
        categories: 0
      };
    }
  }

  async getBooks() {
    try {
      const { books } = await import("@shared/schema");
      return await this.db.select().from(books).orderBy(desc(books.createdAt));
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  async createBook(book) {
    const { books } = await import("@shared/schema");
    const result = await this.db.insert(books).values(book).returning();
    return result[0];
  }

  async updateBook(id, updates) {
    const { books } = await import("@shared/schema");
    const result = await this.db
      .update(books)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(books.id, id))
      .returning();
    return result[0];
  }

  async deleteBook(id) {
    const { books } = await import("@shared/schema");
    const result = await this.db.delete(books).where(eq(books.id, id)).returning();
    return result.length > 0;
  }

  async createAnnouncement(announcement) {
    const result = await this.db.insert(announcements).values(announcement).returning();
    return result[0];
  }

  async updateAnnouncement(id, updates) {
    const result = await this.db
      .update(announcements)
      .set(updates)
      .where(eq(announcements.id, id))
      .returning();
    return result[0];
  }

  async deleteAnnouncement(id) {
    const result = await this.db.delete(announcements).where(eq(announcements.id, id)).returning();
    return result.length > 0;
  }

  // Analytics methods
  async getAnalyticsOverview() {
    const schoolStatsData = await this.db.select().from(schoolStats).limit(1);
    const stats = schoolStatsData[0] || {
      totalStudents: 295,
      totalTeachers: 2,
      totalBooks: 36,
      totalBuses: 3,
      attendanceRate: 94
    };

    return {
      totalStudents: stats.totalStudents,
      totalTeachers: stats.totalTeachers,
      attendanceRate: stats.attendanceRate,
      academicPerformance: 87, // Mock data
      monthlyStats: {
        students: [295, 300, 285, 290, 295],
        attendance: [92, 94, 89, 91, 94],
        performance: [85, 87, 83, 86, 87]
      }
    };
  }
}

export const storage = new PostgresStorage();
