import argon2 from "argon2";
import crypto from "crypto";

export async function hashPassword(password) {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 # thoughts

This is a comprehensive educational management system with Teacher and Admin dashboards. I need to implement a full-stack application using the provided Supabase database URL with session-based authentication, role-based access control, and multiple integrations. The design reference shows a professional dashboard interface with sidebar navigation, stats cards, and various management sections.

Key requirements:
1. Convert the HTML design to React components using JSX (no TypeScript)
2. Implement session-based authentication with Argon2 password hashing and JWT tokens
3. Use the provided Supabase PostgreSQL database with pg driver
4. Create Teacher and Admin dashboards with specific functionality
5. Integrate with WhatsApp (AiSensy), Google Workspace, HubSpot, and OpenAI
6. Implement proper security middleware and RBAC

I'll need to create a comprehensive database schema, authentication system, API routes, and React components that match the design reference exactly.

# useful_guidelines_from_blueprints

From the JavaScript OpenAI blueprint:
- Use OpenAI's newest model "gpt-5" (released August 7, 2025) for any AI-powered features like report summaries
- Use response_format: { type: "json_object" } for structured responses
- Implement proper error handling for AI features

From the JavaScript Supabase blueprint:
- Connect directly to PostgreSQL using Drizzle, not @supabase/supabase-js package
- Use the provided DATABASE_URL for connection

From the fullstack_js guidelines:
- Put most functionality in frontend, backend only for data persistence and API calls
- Generate data model first in shared/schema.js
- Use session-based storage and thin API routes
- Use wouter for routing and react-query for data fetching

# directory_structure

```json
[
    {"path": "shared/schema.js", "status": "overwritten"},
    {"path": "server/storage.js", "status": "overwritten"},
    {"path": "server/routes.js", "status": "overwritten"},
    {"path": "server/auth.js", "status": "new"},
    {"path": "server/middleware.js", "status": "new"},
    {"path": "client/index.html", "status": "overwritten"},
    {"path": "client/src/main.jsx", "status": "overwritten"},
    {"path": "client/src/App.jsx", "status": "overwritten"},
    {"path": "client/src/index.css", "status": "overwritten"},
    {"path": "client/src/lib/api.js", "status": "new"},
    {"path": "client/src/lib/auth.js", "status": "new"},
    {"path": "client/src/pages/Login.jsx", "status": "new"},
    {"path": "client/src/pages/TeacherDashboard.jsx", "status": "new"},
    {"path": "client/src/pages/AdminDashboard.jsx", "status": "new"},
    {"path": "client/src/components/Layout.jsx", "status": "new"},
    {"path": "client/src/components/Sidebar.jsx", "status": "new"},
    {"path": "client/src/components/Header.jsx", "status": "new"},
    {"path": "client/src/components/StatsCard.jsx", "status": "new"},
    {"path": "client/src/components/StudentTable.jsx", "status": "new"},
    {"path": "client/src/components/StudentForm.jsx", "status": "new"},
    {"path": "client/src/components/ModuleForm.jsx", "status": "new"},
    {"path": "client/src/components/ProtectedRoute.jsx", "status": "new"},
    {"path": ".env.example", "status": "new"},
    {"path": "README.md", "status": "new"}
]
