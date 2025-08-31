import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '../../lib/api';
import { BarChart3, TrendingUp, Users, BookOpen, Calendar, Award } from 'lucide-react';

export default function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => apiClient.get('/dashboard/stats'),
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['/api/audit'],
    queryFn: () => apiClient.get('/audit'),
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics/overview'],
  });

  // Mock analytics data (replace with real API calls)
  const analyticsData = {
    studentPerformance: [
      { grade: "Grade 10", avgScore: 85, totalStudents: 120, trend: "+5%" },
      { grade: "Grade 11", avgScore: 78, totalStudents: 95, trend: "+2%" },
      { grade: "Grade 12", avgScore: 82, totalStudents: 80, trend: "-1%" }
    ],
    attendanceStats: {
      overall: 92,
      thisWeek: 94,
      lastWeek: 89,
      trend: "+3%"
    },
    teacherPerformance: [
      { name: "Math Department", score: 4.8, classes: 12, students: 180 },
      { name: "Science Department", score: 4.6, classes: 10, students: 150 },
      { name: "English Department", score: 4.7, classes: 8, students: 120 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground">School performance insights and detailed reports</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="card-total-students">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 295}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-attendance">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.attendanceStats.overall}%</div>
            <p className="text-xs text-muted-foreground">{analyticsData.attendanceStats.trend} from last week</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-teachers">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTeachers || 24}</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-courses">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Across all grades</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Performance by Grade */}
        <Card data-testid="card-grade-performance">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Student Performance by Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.studentPerformance.map((grade, index) => (
                <div key={index} className="space-y-2" data-testid={`grade-performance-${index}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{grade.grade}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{grade.avgScore}%</span>
                      <Badge variant={grade.trend.startsWith('+') ? 'default' : 'destructive'}>
                        {grade.trend}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={grade.avgScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">{grade.totalStudents} students</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Department Performance */}
        <Card data-testid="card-department-performance">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.teacherPerformance.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`department-${index}`}>
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {dept.classes} classes • {dept.students} students
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{dept.score}/5.0</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card data-testid="card-recent-activity">
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs?.slice(0, 10).map((log, index) => (
              <div key={log.id} className="flex justify-between items-center text-sm" data-testid={`audit-log-${index}`}>
                <div>
                  <span className="font-medium">{log.action}</span>
                  <span className="text-muted-foreground ml-2">
                    {log.details ? JSON.stringify(log.details) : 'No details'}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            )) || (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}