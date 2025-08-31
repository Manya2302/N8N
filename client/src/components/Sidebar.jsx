import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../lib/auth';
import { Button } from '@/components/ui/button';
import { 
  BookOpen,
  LayoutDashboard,
  Calendar,
  CheckCircle,
  BarChart3,
  MessageSquare,
  FileText,
  Users,
  GraduationCap,
  Megaphone,
  DollarSign,
  Bus,
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const teacherNavItems = [
    { path: '/teacher-dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/teacher-dashboard/schedule', label: 'Class Schedule', icon: Calendar },
    { path: '/teacher-dashboard/attendance', label: 'Attendance', icon: CheckCircle },
    { path: '/teacher-dashboard/grades', label: 'Grades & Progress', icon: BarChart3 },
    { path: '/teacher-dashboard/communication', label: 'Parent Communication', icon: MessageSquare },
    { path: '/teacher-dashboard/assignments', label: 'Assignments', icon: FileText },
    { path: '/teacher-dashboard/students', label: 'Student Profiles', icon: Users },
  ];

  const adminNavItems = [
    { path: '/admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin-dashboard/teachers', label: 'Teacher Management', icon: GraduationCap },
    { path: '/admin-dashboard/analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { path: '/admin-dashboard/announcements', label: 'Announcements', icon: Megaphone },
    { path: '/admin-dashboard/finance', label: 'Fee Management', icon: DollarSign },
    { path: '/admin-dashboard/transport', label: 'Transport', icon: Bus },
    { path: '/admin-dashboard/library', label: 'Digital Library', icon: BookOpen },
    { path: '/admin-dashboard/settings', label: 'System Settings', icon: Settings },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : teacherNavItems;
  const dashboardTitle = user?.role === 'admin' ? 'Admin Dashboard' : 'Teacher Dashboard';

  const handleNavClick = (path) => {
    console.log(`Navigate to: ${path}`);
    setLocation(path);
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  return (
    <aside className={`bg-card border-r border-border shadow-sm transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`} data-testid="sidebar">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold">EduManage</h1>
              <p className="text-xs text-muted-foreground">School Management</p>
            </div>
          )}
        </div>
      </div>

      <nav className="px-4 pb-4">
        <div className="mb-4">
          {!collapsed && (
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {dashboardTitle}
            </p>
          )}
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.path || 
                (item.path !== '/teacher-dashboard' && item.path !== '/admin-dashboard' && location.startsWith(item.path));
              
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className={`nav-link flex items-center px-3 py-2 text-sm font-medium w-full text-left transition-colors ${
                      isActive ? 'active bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User info and logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="border-t border-border pt-4">
          {!collapsed && user && (
            <div className="px-3 mb-3">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-3" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Collapse toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-20 -right-3 bg-background border border-border rounded-full w-6 h-6 p-0 hover:bg-accent"
        data-testid="button-toggle-sidebar"
      >
        <div className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </Button>
    </aside>
  );
}
