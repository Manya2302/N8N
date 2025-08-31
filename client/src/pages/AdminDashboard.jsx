import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import StudentTable from '../components/StudentTable';
import { apiClient } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  GraduationCap, 
  Megaphone, 
  Shield,
  TrendingUp,
  DollarSign,
  Bus,
  BookOpen,
  Calendar,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings2,
  Building,
  CreditCard,
  MapPin,
  Clock,
  UserCheck,
  Target
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => apiClient.get('/dashboard/stats'),
  });

  // Fetch teachers
  const { data: teachers } = useQuery({
    queryKey: ['/api/teachers'],
    queryFn: () => apiClient.get('/teachers'),
  });

  // Fetch all students (admin can see all)
  const { data: students } = useQuery({
    queryKey: ['/api/students'],
    queryFn: () => apiClient.get('/students'),
  });

  // Fetch audit logs
  const { data: auditLogs } = useQuery({
    queryKey: ['/api/audit'],
    queryFn: () => apiClient.get('/audit'),
  });

  // Fetch announcements
  const { data: announcements } = useQuery({
    queryKey: ['/api/announcements'],
    queryFn: () => apiClient.get('/announcements'),
  });

  // Mock data for additional features
  const systemHealth = {
    uptime: "99.8%",
    performance: "Excellent",
    storage: "78% used",
    activeSessions: 142
  };

  const recentActivities = [
    { action: "New teacher registered", user: "admin@school.edu", timestamp: "2 hours ago", type: "user" },
    { action: "Student data updated", user: "teacher@school.edu", timestamp: "3 hours ago", type: "data" },
    { action: "System backup completed", user: "system", timestamp: "6 hours ago", type: "system" },
    { action: "Announcement published", user: "admin@school.edu", timestamp: "1 day ago", type: "content" }
  ];

  const financialOverview = [
    { category: "Tuition Fees", amount: "$125,400", status: "collected", percentage: 85 },
    { category: "Transport Fees", amount: "$18,600", status: "pending", percentage: 65 },
    { category: "Library Fees", amount: "$4,200", status: "collected", percentage: 92 },
    { category: "Exam Fees", amount: "$8,400", status: "pending", percentage: 78 }
  ];

  return (
    <Layout title="Admin Dashboard" subtitle="System Overview & Management">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Teachers"
            value={stats?.totalTeachers || 0}
            icon={GraduationCap}
            color="primary"
            data-testid="stat-total-teachers"
          />
          <StatsCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={Users}
            color="secondary"
            data-testid="stat-total-students"
          />
          <StatsCard
            title="Active Announcements"
            value={stats?.activeAnnouncements || 0}
            icon={Megaphone}
            color="accent"
            data-testid="stat-active-announcements"
          />
          <StatsCard
            title="System Health"
            value={stats?.systemHealth || "Good"}
            icon={Shield}
            color="success"
            isString={true}
            data-testid="stat-system-health"
          />
        </div>

        {/* Main Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="teachers" data-testid="tab-teachers">Teachers</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="announcements" data-testid="tab-announcements">Announcements</TabsTrigger>
            <TabsTrigger value="finance" data-testid="tab-finance">Finance</TabsTrigger>
            <TabsTrigger value="transport" data-testid="tab-transport">Transport</TabsTrigger>
            <TabsTrigger value="library" data-testid="tab-library">Library</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <Card className="dashboard-card" data-testid="card-system-health">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Uptime</span>
                      <Badge variant="secondary">{systemHealth.uptime}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Performance</span>
                      <Badge variant="default">{systemHealth.performance}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage</span>
                      <Badge variant="outline">{systemHealth.storage}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Sessions</span>
                      <Badge variant="secondary">{systemHealth.activeSessions}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="dashboard-card" data-testid="card-recent-activities">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3" data-testid={`activity-${index}`}>
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'user' ? 'bg-primary' :
                          activity.type === 'data' ? 'bg-secondary' :
                          activity.type === 'system' ? 'bg-accent' : 'bg-destructive'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user} • {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Admin Actions */}
            <Card className="dashboard-card" data-testid="card-admin-actions">
              <CardHeader>
                <CardTitle>Quick Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2" data-testid="button-manage-teachers">
                    <GraduationCap className="w-6 h-6" />
                    <span className="text-sm">Manage Teachers</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" data-testid="button-system-reports">
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-sm">System Reports</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" data-testid="button-announcements">
                    <Megaphone className="w-6 h-6" />
                    <span className="text-sm">Announcements</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" data-testid="button-fee-management">
                    <DollarSign className="w-6 h-6" />
                    <span className="text-sm">Fee Management</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            <Card data-testid="card-teachers-management">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Teacher Management</CardTitle>
                  <Button data-testid="button-add-teacher">Add New Teacher</Button>
                </div>
              </CardHeader>
              <CardContent>
                {teachers && teachers.length > 0 ? (
                  <div className="space-y-4">
                    {teachers.map((teacher, index) => (
                      <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`teacher-${index}`}>
                        <div>
                          <p className="font-medium">{teacher.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Status: {teacher.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-teacher-${index}`}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" data-testid={`button-delete-teacher-${index}`}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8" data-testid="text-no-teachers">
                    No teachers found. Add your first teacher to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-student-analytics">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Student Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Overall Performance</span>
                      <Badge variant="default">85% Average</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Attendance Rate</span>
                      <Badge variant="secondary">92%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Assignment Completion</span>
                      <Badge variant="outline">78%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-attendance-trends">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Attendance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">92%</div>
                      <div className="text-sm text-muted-foreground">This Month</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Monday</span>
                        <span>95%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tuesday</span>
                        <span>89%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Wednesday</span>
                        <span>91%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <Card data-testid="card-announcements-management">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5" />
                    Announcements Management
                  </CardTitle>
                  <Button data-testid="button-create-announcement">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "School Holiday Notice", date: "March 15, 2024", type: "Holiday", audience: "All" },
                    { title: "Parent-Teacher Meeting", date: "March 20, 2024", type: "Meeting", audience: "Parents" },
                    { title: "Exam Schedule Update", date: "March 10, 2024", type: "Exam", audience: "Students" }
                  ].map((announcement, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`announcement-${index}`}>
                      <div>
                        <p className="font-medium">{announcement.title}</p>
                        <p className="text-sm text-muted-foreground">{announcement.date} • {announcement.audience}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={announcement.type === 'Holiday' ? 'secondary' : 'default'}>
                          {announcement.type}
                        </Badge>
                        <Button variant="outline" size="sm" data-testid={`button-edit-announcement-${index}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" data-testid={`button-delete-announcement-${index}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-financial-overview">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Fee Collection Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialOverview.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`finance-item-${index}`}>
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-muted-foreground">{item.percentage}% collection rate</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{item.amount}</p>
                          <Badge variant={item.status === 'collected' ? 'default' : 'outline'}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-fee-management">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Fee Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full" data-testid="button-generate-receipts">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Receipts
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-payment-reminders">
                      <Megaphone className="w-4 h-4 mr-2" />
                      Send Payment Reminders
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-fee-structure">
                      <Settings2 className="w-4 h-4 mr-2" />
                      Manage Fee Structure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transport" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-bus-routes">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="w-5 h-5" />
                    Bus Routes Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { route: "Route A", driver: "John Smith", students: 25, status: "Active" },
                      { route: "Route B", driver: "Emma Wilson", students: 30, status: "Active" },
                      { route: "Route C", driver: "Mike Johnson", students: 22, status: "Maintenance" }
                    ].map((route, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`route-${index}`}>
                        <div>
                          <p className="font-medium">{route.route}</p>
                          <p className="text-sm text-muted-foreground">Driver: {route.driver}</p>
                          <p className="text-sm text-muted-foreground">{route.students} students</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Badge variant={route.status === 'Active' ? 'default' : 'destructive'}>
                            {route.status}
                          </Badge>
                          <Button variant="outline" size="sm" data-testid={`button-edit-route-${index}`}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-transport-schedule">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Transport Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full" data-testid="button-add-route">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Route
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-student-allocation">
                      <Users className="w-4 h-4 mr-2" />
                      Student Allocation
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-schedule-maintenance">
                      <Settings2 className="w-4 h-4 mr-2" />
                      Schedule Maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-digital-library">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Digital Library Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">1,245</div>
                        <div className="text-sm text-muted-foreground">Total Books</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-secondary">89</div>
                        <div className="text-sm text-muted-foreground">Borrowed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">156</div>
                        <div className="text-sm text-muted-foreground">E-books</div>
                      </div>
                    </div>
                    <Button className="w-full" data-testid="button-upload-book">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Book
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-manage-categories">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Manage Categories
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-borrowing-activity">
                <CardHeader>
                  <CardTitle>Recent Borrowing Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { student: "John Smith", book: "Mathematics Grade 10", date: "Today" },
                      { student: "Emma Wilson", book: "Physics Concepts", date: "Yesterday" },
                      { student: "Mike Johnson", book: "Chemistry Lab Manual", date: "2 days ago" }
                    ].map((activity, index) => (
                      <div key={index} className="flex justify-between items-center text-sm" data-testid={`library-activity-${index}`}>
                        <div>
                          <p className="font-medium">{activity.student}</p>
                          <p className="text-muted-foreground">{activity.book}</p>
                        </div>
                        <span className="text-muted-foreground">{activity.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-system-settings">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-school-info">
                      <Building className="w-4 h-4 mr-2" />
                      School Information
                    </Button>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-user-roles">
                      <Users className="w-4 h-4 mr-2" />
                      User Roles & Permissions
                    </Button>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-academic-year">
                      <Calendar className="w-4 h-4 mr-2" />
                      Academic Year Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-notifications">
                      <Megaphone className="w-4 h-4 mr-2" />
                      Notification Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-backup-security">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Backup & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full" data-testid="button-create-backup">
                      <Download className="w-4 h-4 mr-2" />
                      Create System Backup
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-security-audit">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Audit
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-access-logs">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Access Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Audit Logs */}
              <Card data-testid="card-audit-logs">
                <CardHeader>
                  <CardTitle>Recent Audit Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  {auditLogs && auditLogs.length > 0 ? (
                    <div className="space-y-3">
                      {auditLogs.slice(0, 10).map((log, index) => (
                        <div key={log.id} className="text-sm border-b pb-2" data-testid={`audit-log-${index}`}>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8" data-testid="text-no-audit-logs">
                      No audit logs available.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* System Management */}
              <Card data-testid="card-system-management">
                <CardHeader>
                  <CardTitle>System Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-backup-data">
                      <Shield className="w-4 h-4 mr-2" />
                      Backup Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-export-reports">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Export Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-system-settings">
                      <Shield className="w-4 h-4 mr-2" />
                      System Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-user-permissions">
                      <Users className="w-4 h-4 mr-2" />
                      User Permissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
