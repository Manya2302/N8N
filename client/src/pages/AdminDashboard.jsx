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
  BarChart3
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="teachers" data-testid="tab-teachers">Teachers</TabsTrigger>
            <TabsTrigger value="students" data-testid="tab-students">Students</TabsTrigger>
            <TabsTrigger value="finance" data-testid="tab-finance">Finance</TabsTrigger>
            <TabsTrigger value="system" data-testid="tab-system">System</TabsTrigger>
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

          <TabsContent value="students" className="space-y-6">
            <Card data-testid="card-students-management">
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                {students ? (
                  <StudentTable students={students} isAdmin={true} />
                ) : (
                  <p className="text-center text-muted-foreground py-8" data-testid="text-no-students">
                    Loading students...
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <Card data-testid="card-financial-overview">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Overview
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
