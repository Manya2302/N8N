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
}

export const storage = new PostgresStorage();
