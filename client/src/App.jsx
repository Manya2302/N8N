import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";
import Login from "@/pages/Login";
import TeacherRegister from "@/pages/TeacherRegister";
import AdminDashboard from "@/pages/AdminDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminOverview from "@/pages/admin/Overview";
import TeacherManagement from "@/pages/admin/TeacherManagement";
import Analytics from "@/pages/admin/Analytics";
import Announcements from "@/pages/admin/Announcements";
import FeeManagement from "@/pages/admin/FeeManagement";
import Transport from "@/pages/admin/Transport";
import DigitalLibrary from "@/pages/admin/DigitalLibrary";
import SystemSettings from "@/pages/admin/SystemSettings";

// Teacher Pages
import TeacherOverview from "@/pages/teacher/Overview";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/register-teacher" component={TeacherRegister} />
      
      {/* Admin Dashboard Routes */}
      <Route path="/admin-dashboard" exact>
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard><AdminOverview /></AdminDashboard>
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard/teachers">
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard><TeacherManagement /></AdminDashboard>
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard/analytics">
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard><Analytics /></AdminDashboard>
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard/announcements">
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard><Announcements /></AdminDashboard>
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard/finance">
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard><FeeManagement /></AdminDashboard>
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard/transport">
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard><Transport /></AdminDashboard>
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard/library">
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard><DigitalLibrary /></AdminDashboard>
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard/settings">
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard><SystemSettings /></AdminDashboard>
        </ProtectedRoute>
      </Route>
      
      <Route path="/teacher-dashboard" exact>
        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
          <TeacherDashboard><TeacherOverview /></TeacherDashboard>
        </ProtectedRoute>
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
