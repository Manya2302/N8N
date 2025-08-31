import { useQuery } from '@tanstack/react-query';
import StatsCard from '../../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '../../lib/api';
import { 
  Users, 
  GraduationCap, 
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Plus
} from 'lucide-react';

export default function Overview() {
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => apiClient.get('/dashboard/stats'),
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['/api/audit'],
    queryFn: () => apiClient.get('/audit'),
  });

  // Mock quick stats for better UI
  const quickStats = [
    { label: "Today's Attendance", value: "94%", trend: "+2%", color: "text-green-600" },
    { label: "Pending Fees", value: "$12,450", trend: "-8%", color: "text-orange-600" },
    { label: "New Enrollments", value: "23", trend: "+15%", color: "text-blue-600" },
    { label: "Active Teachers", value: stats?.totalTeachers || "24", trend: "0%", color: "text-purple-600" }
  ];

  const recentAnnouncements = [
    { title: "Mid-term Exam Schedule Released", time: "2 hours ago", priority: "high" },
    { title: "Parent-Teacher Conference", time: "1 day ago", priority: "medium" },
    { title: "Science Fair Registration Open", time: "3 days ago", priority: "low" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at your school today.</p>
        </div>
        <Button data-testid="button-quick-action">
          <Plus className="w-4 h-4 mr-2" />
          Quick Action
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          color="primary"
          data-testid="stat-total-students"
        />
        <StatsCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          icon={GraduationCap}
          color="secondary"
          data-testid="stat-total-teachers"
        />
        <StatsCard
          title="Active Classes"
          value={stats?.activeClasses || 18}
          icon={Calendar}
          color="accent"
          data-testid="stat-active-classes"
        />
        <StatsCard
          title="This Month Revenue"
          value={stats?.monthlyRevenue || "$25,400"}
          icon={TrendingUp}
          color="destructive"
          data-testid="stat-monthly-revenue"
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} data-testid={`quick-stat-${index}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <span className={`text-sm font-medium ${stat.color}`}>
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card data-testid="card-recent-activity">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity?.slice(0, 5).map((activity, index) => (
                <div key={activity.id} className="flex justify-between items-center" data-testid={`activity-${index}`}>
                  <div>
                    <p className="font-medium text-sm capitalize">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    System
                  </Badge>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card data-testid="card-recent-announcements">
          <CardHeader>
            <CardTitle>Latest Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAnnouncements.map((announcement, index) => (
                <div key={index} className="flex justify-between items-start" data-testid={`announcement-${index}`}>
                  <div>
                    <p className="font-medium text-sm">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground">{announcement.time}</p>
                  </div>
                  <Badge variant={
                    announcement.priority === 'high' ? 'destructive' :
                    announcement.priority === 'medium' ? 'default' : 'secondary'
                  } className="text-xs">
                    {announcement.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-add-student">
              <Users className="w-6 h-6" />
              <span className="text-sm">Add Student</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-create-announcement">
              <AlertCircle className="w-6 h-6" />
              <span className="text-sm">Create Announcement</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-schedule-meeting">
              <Calendar className="w-6 h-6" />
              <span className="text-sm">Schedule Meeting</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-generate-report">
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}