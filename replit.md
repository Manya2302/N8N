# Educational Management System

## Overview
A comprehensive educational management system with React frontend and Node.js backend, featuring n8n automation integration for school-parent-student communication.

## Project Architecture
- **Frontend**: React with Vite (JavaScript only, no TypeScript)
- **Backend**: Node.js + Express
- **Database**: Supabase PostgreSQL
- **Authentication**: Session-based with JWT tokens and Argon2 password hashing
- **Integration**: n8n AI automation for WhatsApp notifications

## Core Features
1. **Attendance Management** - Track student attendance
2. **Grade Management** - Weekly exam marks and progress tracking
3. **Communication Hub** - Announcements, notices, schedules
4. **Academic Calendar** - Exam schedules, timetables, holidays
5. **Fee Management** - Online payment tracking and receipts
6. **Library System** - Book borrowing and return management
7. **Transport Management** - Bus routes and scheduling
8. **Health Records** - Medical information and checkups
9. **Assignment Portal** - Digital homework submission
10. **Progress Analytics** - Student performance insights

## Dashboard Structure
- **Teacher Dashboard**: Class management, meetings, assignments, student progress
- **Admin Dashboard**: Teacher management, student enrollment, system settings, comprehensive reports

## User Roles
- **Students**: View grades, assignments, attendance, schedules
- **Parents**: Monitor child progress, receive notifications, pay fees
- **Teachers**: Manage classes, grade assignments, schedule meetings
- **Admins**: System administration, user management, reports

## Database Connection
- Using Supabase PostgreSQL with connection string provided
- Parameterized queries only for security
- Environment variables for all sensitive data

## Authentication System
- Session-based authentication (not Replit Auth)
- JWT access + refresh tokens
- Argon2 password hashing
- HttpOnly, Secure cookies for refresh tokens

## Recent Changes
- Initial project setup planned
- Database schema design in progress
- Authentication system architecture defined

## User Preferences
- Use JavaScript only (no TypeScript)
- Session-based authentication preferred
- Integration with n8n automation required
- Teacher and Admin dashboards prioritized