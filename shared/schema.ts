import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("teacher"), // 'admin', 'teacher'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const students = pgTable("students", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: uuid("teacher_id").references(() => users.id, { onDelete: "set null" }),
  rollNo: varchar("roll_no", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  studentNumber: varchar("student_number", { length: 20 }),
  parentNumber1: varchar("parent_number1", { length: 20 }),
  parentNumber2: varchar("parent_number2", { length: 20 }),
  extraInfo: jsonb("extra_info"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: uuid("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleName: varchar("module_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 255 }).notNull(),
  meta: jsonb("meta"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  teacherId: uuid("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("present"), // 'present', 'absent', 'late'
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const grades = pgTable("grades", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  teacherId: uuid("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  grade: varchar("grade", { length: 10 }).notNull(),
  percentage: integer("percentage"),
  examType: varchar("exam_type", { length: 50 }).notNull(), // 'weekly', 'midterm', 'final'
  examDate: timestamp("exam_date").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: uuid("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'active', 'completed', 'cancelled'
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("general"), // 'general', 'urgent', 'holiday'
  targetAudience: varchar("target_audience", { length: 50 }).notNull().default("all"), // 'all', 'teachers', 'students', 'parents'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  updatedAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertGradeSchema = createInsertSchema(grades).omit({
  id: true,
  createdAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

// Fee Management Tables
export const feeCategories = pgTable("fee_categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(), // "Tuition Fees", "Library Fees", etc.
  amount: integer("amount").notNull(), // Amount in cents
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const studentFees = pgTable("student_fees", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  feeCategoryId: uuid("fee_category_id").notNull().references(() => feeCategories.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // Amount in cents
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'paid', 'pending', 'overdue'
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Transport Management Tables
export const buses = pgTable("buses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  busNumber: varchar("bus_number", { length: 50 }).notNull().unique(),
  capacity: integer("capacity").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'active', 'maintenance', 'inactive'
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const drivers = pgTable("drivers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  licenseNumber: varchar("license_number", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const routes = pgTable("routes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  routeName: varchar("route_name", { length: 255 }).notNull(), // "Route A - North Zone"
  busId: uuid("bus_id").notNull().references(() => buses.id, { onDelete: "cascade" }),
  driverId: uuid("driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" }),
  stops: jsonb("stops").notNull(), // Array of stop names
  startPoint: varchar("start_point", { length: 255 }).notNull(),
  endPoint: varchar("end_point", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'active', 'inactive'
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const studentTransport = pgTable("student_transport", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  routeId: uuid("route_id").notNull().references(() => routes.id, { onDelete: "cascade" }),
  pickupStop: varchar("pickup_stop", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const transportSchedule = pgTable("transport_schedule", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: uuid("route_id").notNull().references(() => routes.id, { onDelete: "cascade" }),
  scheduledTime: varchar("scheduled_time", { length: 10 }).notNull(), // "7:00 AM"
  location: varchar("location", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("on_time"), // 'on_time', 'delayed', 'maintenance'
  date: timestamp("date").notNull().default(sql`now()`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Digital Library Tables
export const books = pgTable("books", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  isbn: varchar("isbn", { length: 50 }),
  category: varchar("category", { length: 100 }).notNull(),
  totalCopies: integer("total_copies").notNull().default(1),
  availableCopies: integer("available_copies").notNull().default(1),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const bookBorrowings = pgTable("book_borrowings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  bookId: uuid("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  borrowDate: timestamp("borrow_date").notNull().default(sql`now()`),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  status: varchar("status", { length: 20 }).notNull().default("borrowed"), // 'borrowed', 'returned', 'overdue'
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Analytics and Reports Tables
export const schoolStats = pgTable("school_stats", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  totalStudents: integer("total_students").notNull().default(0),
  totalTeachers: integer("total_teachers").notNull().default(0),
  totalBooks: integer("total_books").notNull().default(0),
  totalBuses: integer("total_buses").notNull().default(0),
  attendanceRate: integer("attendance_rate").notNull().default(0), // Percentage
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
});

// Teacher Profiles Table (for teacher management)
export const teacherProfiles = pgTable("teacher_profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 100 }),
  experience: integer("experience"), // Years of experience
  qualification: varchar("qualification", { length: 255 }),
  joinDate: timestamp("join_date").notNull().default(sql`now()`),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert schemas for new tables
export const insertFeeCategorySchema = createInsertSchema(feeCategories).omit({
  id: true,
  createdAt: true,
});

export const insertStudentFeeSchema = createInsertSchema(studentFees).omit({
  id: true,
  createdAt: true,
});

export const insertBusSchema = createInsertSchema(buses).omit({
  id: true,
  createdAt: true,
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  createdAt: true,
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
});

export const insertBookBorrowingSchema = createInsertSchema(bookBorrowings).omit({
  id: true,
  createdAt: true,
});

export const insertTeacherProfileSchema = createInsertSchema(teacherProfiles).omit({
  id: true,
  createdAt: true,
});

// Types
// TypeScript types removed for JavaScript compatibility
