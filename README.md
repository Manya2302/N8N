# EduManage - School Management System

A comprehensive educational management platform with structured Teacher and Admin dashboards, integrating WhatsApp automation, Google Workspace, and HubSpot for complete school administration.

## 🎯 Features

### 👨‍🏫 Teacher Dashboard
- **Class Scheduling & Meetings** - Arrange sessions and manage timetable display
- **Student Attendance Management** - Daily attendance tracking with automated WhatsApp notifications
- **Marks & Progress Tracking** - Enter weekly exam marks and update progress reports
- **Parent Communication Tools** - WhatsApp reminders via AiSensy integration with GPT-powered report summaries
- **Assignments & Exams** - Create and manage assignments with automated notifications
- **Student Profile Access** - View and update assigned students' academic records

### 🛠️ Admin Dashboard
- **Teacher Management** - Add/edit teacher profiles and performance oversight
- **Complete Oversight** - Access to all teacher dashboards and system-wide monitoring
- **System-Wide Announcements** - Publish school-wide notices and event notifications
- **User Role Management** - Manage admin and teacher accounts
- **School-Wide Reports & Analytics** - Integration with Google Sheets + Data Studio
- **Fee Management Oversight** - Track payments and automated reminders
- **Transport Management** - School bus tracking and route information
- **Digital Library & Resources** - Manage eBooks and study materials

## 🚀 Tech Stack

### Frontend
- **React** with Vite
- **JavaScript/JSX** (no TypeScript)
- **Tailwind CSS** + **shadcn/ui** components
- **Wouter** for routing
- **TanStack React Query** for data fetching
- **React Hook Form** + **Zod** for form validation

### Backend
- **Node.js** + **Express**
- **PostgreSQL** with **Drizzle ORM** (Supabase hosted)
- **Argon2** for password hashing
- **JWT** for authentication
- **Express-session** for session management
- **Helmet** for security headers
- **Rate limiting** and **CSRF protection**

### Integrations
- **AiSensy** WhatsApp API for automated messaging
- **Google Sheets API v4** for data synchronization
- **Google Calendar API** for scheduling
- **HubSpot CRM API** for lead management
- **OpenAI GPT-5** for report summaries
- **Pabbly Connect** for workflow automation

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase account recommended)
- API keys for integrations (WhatsApp, Google Workspace, HubSpot, OpenAI)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edumanage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   - Database URL from Supabase
   - API keys for all integrations
   - JWT and session secrets
   - Security configuration

4. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🔐 Authentication & Security

### First-Time Setup
1. Access the application at `http://localhost:5000`
2. Use the **Admin Setup** tab to create your first admin account
3. Login with admin credentials to access the admin dashboard
4. Create teacher accounts through the Teacher Management section

### Security Features
- **Argon2** password hashing
- **JWT** access tokens with refresh token rotation
- **CSRF** protection with double-submit cookies
- **Rate limiting** for API endpoints
- **Session-based** authentication with secure cookies
- **Audit logging** for all sensitive operations
- **Role-based access control** (Admin/Teacher)
- **Security headers** via Helmet

## 📊 Database Schema

### Core Tables
- **users** - Admin and teacher accounts
- **students** - Student information and parent contacts
- **modules** - Subject/course management
- **attendance** - Daily attendance records
- **grades** - Exam results and progress tracking
- **assignments** - Homework and project management
- **announcements** - School-wide communications
- **audit_logs** - System activity tracking

### Relationships
- Teachers can manage multiple students
- Students belong to specific teachers (or unassigned for admin)
- Modules are owned by teachers
- Attendance and grades are linked to students and teachers

## 🔗 API Integration Guide

### WhatsApp Automation (AiSensy)
```javascript
// Automated attendance notifications
POST /api/attendance → triggers WhatsApp message to parents
