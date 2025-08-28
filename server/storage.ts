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
  type User,
  type InsertUser,
  type Student,
  type InsertStudent,
  type Module,
  type InsertModule,
  type Attendance,
  type InsertAttendance,
  type Grade,
  type InsertGrade,
  type Assignment,
  type InsertAssignment,
  type Announcement,
  type InsertAnnouncement,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getTeachers(): Promise<User[]>;

  // Student methods
  getStudents(teacherId?: string): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, updates: Partial<Student>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;
  getStudentsByTeacher(teacherId: string): Promise<Student[]>;

  // Module methods
  getModules(teacherId?: string): Promise<Module[]>;
  getModule(id: string): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: string, updates: Partial<Module>): Promise<Module | undefined>;
  deleteModule(id: string): Promise<boolean>;

  // Attendance methods
  getAttendance(filters?: { studentId?: string; teacherId?: string; date?: Date }): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, updates: Partial<Attendance>): Promise<Attendance | undefined>;

  // Grade methods
  getGrades(filters?: { studentId?: string; teacherId?: string; moduleId?: string }): Promise<Grade[]>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  updateGrade(id: string, updates: Partial<Grade>): Promise<Grade | undefined>;

  // Assignment methods
  getAssignments(teacherId?: string): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: string): Promise<boolean>;

  // Announcement methods
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<boolean>;

  // Refresh token methods
  createRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  getRefreshToken(tokenHash: string): Promise<{ userId: string } | undefined>;
  deleteRefreshToken(tokenHash: string): Promise<void>;
  deleteAllRefreshTokens(userId: string): Promise<void>;

  // Audit methods
  createAuditLog(userId: string | null, action: string, meta?: any, ipAddress?: string): Promise<void>;
  getAuditLogs(limit?: number): Promise<any[]>;

  // Dashboard stats
  getDashboardStats(userId: string, role: string): Promise<any>;
}

class PostgresStorage implements IStorage {
  private client: Client;
  private db: any;

  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
    this.db = drizzle(this.client);
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await this.db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getTeachers(): Promise<User[]> {
    return await this.db.select().from(users).where(eq(users.role, "teacher"));
  }

  // Student methods
  async getStudents(teacherId?: string): Promise<Student[]> {
    if (teacherId) {
      return await this.db.select().from(students).where(eq(students.teacherId, teacherId));
    }
    return await this.db.select().from(students);
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const result = await this.db.select().from(students).where(eq(students.id, id)).limit(1);
    return result[0];
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const result = await this.db.insert(students).values(student).returning();
    return result[0];
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student | undefined> {
    const result = await this.db
      .update(students)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return result[0];
  }

  async deleteStudent(id: string): Promise<boolean> {
    const result = await this.db.delete(students).where(eq(students.id, id));
    return result.rowCount > 0;
  }

  async getStudentsByTeacher(teacherId: string): Promise<Student[]> {
    return await this.db.select().from(students).where(eq(students.teacherId, teacherId));
  }

  // Module methods
  async getModules(teacherId?: string): Promise<Module[]> {
    if (teacherId) {
      return await this.db.select().from(modules).where(eq(modules.teacherId, teacherId));
    }
    return await this.db.select().from(modules);
  }

  async getModule(id: string): Promise<Module | undefined> {
    const result = await this.db.select().from(modules).where(eq(modules.id, id)).limit(1);
    return result[0];
  }

  async createModule(module: InsertModule): Promise<Module> {
    const result = await this.db.insert(modules).values(module).returning();
    return result[0];
  }

  async updateModule(id: string, updates: Partial<Module>): Promise<Module | undefined> {
    const result = await this.db
      .update(modules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(modules.id, id))
      .returning();
    return result[0];
  }

  async deleteModule(id: string): Promise<boolean> {
    const result = await this.db.delete(modules).where(eq(modules.id, id));
    return result.rowCount > 0;
  }

  // Attendance methods
  async getAttendance(filters: { studentId?: string; teacherId?: string; date?: Date } = {}): Promise<Attendance[]> {
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

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const result = await this.db.insert(attendance).values(attendanceData).returning();
    return result[0];
  }

  async updateAttendance(id: string, updates: Partial<Attendance>): Promise<Attendance | undefined> {
    const result = await this.db
      .update(attendance)
      .set(updates)
      .where(eq(attendance.id, id))
      .returning();
    return result[0];
  }

  // Grade methods
  async getGrades(filters: { studentId?: string; teacherId?: string; moduleId?: string } = {}): Promise<Grade[]> {
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

  async createGrade(grade: InsertGrade): Promise<Grade> {
    const result = await this.db.insert(grades).values(grade).returning();
    return result[0];
  }

  async updateGrade(id: string, updates: Partial<Grade>): Promise<Grade | undefined> {
    const result = await this.db
      .update(grades)
      .set(updates)
      .where(eq(grades.id, id))
      .returning();
    return result[0];
  }

  // Assignment methods
  async getAssignments(teacherId?: string): Promise<Assignment[]> {
    if (teacherId) {
      return await this.db.select().from(assignments).where(eq(assignments.teacherId, teacherId)).orderBy(desc(assignments.dueDate));
    }
    return await this.db.select().from(assignments).orderBy(desc(assignments.dueDate));
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const result = await this.db.insert(assignments).values(assignment).returning();
    return result[0];
  }

  async updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment | undefined> {
    const result = await this.db
      .update(assignments)
      .set(updates)
      .where(eq(assignments.id, id))
      .returning();
    return result[0];
  }

  async deleteAssignment(id: string): Promise<boolean> {
    const result = await this.db.delete(assignments).where(eq(assignments.id, id));
    return result.rowCount > 0;
  }

  // Announcement methods
  async getAnnouncements(): Promise<Announcement[]> {
    return await this.db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const result = await this.db.insert(announcements).values(announcement).returning();
    return result[0];
  }

  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement | undefined> {
    const result = await this.db
      .update(announcements)
      .set(updates)
      .where(eq(announcements.id, id))
      .returning();
    return result[0];
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    const result = await this.db.update(announcements).set({ isActive: false }).where(eq(announcements.id, id));
    return result.rowCount > 0;
  }

  // Refresh token methods
  async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.db.insert(refreshTokens).values({ userId, tokenHash, expiresAt });
  }

  async getRefreshToken(tokenHash: string): Promise<{ userId: string } | undefined> {
    const result = await this.db
      .select({ userId: refreshTokens.userId })
      .from(refreshTokens)
      .where(and(eq(refreshTokens.tokenHash, tokenHash), sql`${refreshTokens.expiresAt} > now()`))
      .limit(1);
    return result[0];
  }

  async deleteRefreshToken(tokenHash: string): Promise<void> {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash));
  }

  async deleteAllRefreshTokens(userId: string): Promise<void> {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  // Audit methods
  async createAuditLog(userId: string | null, action: string, meta?: any, ipAddress?: string): Promise<void> {
    await this.db.insert(auditLogs).values({ userId, action, meta, ipAddress });
  }

  async getAuditLogs(limit: number = 100): Promise<any[]> {
    return await this.db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }

  // Dashboard stats
  async getDashboardStats(userId: string, role: string): Promise<any> {
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
