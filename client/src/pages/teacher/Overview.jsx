import { useQuery } from '@tanstack/react-query';
import StatsCard from '../../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '../../lib/api';
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  MessageSquare,
  FileText,
  BookOpen
} from 'lucide-react';

export default function Overview() {
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => apiClient.get('/dashboard/stats'),
  });

  // Mock data for teacher overview
  const todaySchedule = [
    { subject: "Mathematics", grade: "Grade 10-A", time: "9:00 AM", room: "Room 101" },
    { subject: "Physics", grade: "Grade 11-B", time: "11:30 AM", room: "Lab 2" },
    { subject: "Chemistry", grade: "Grade 12-A", time: "2:00 PM", room: "Lab 1" }
  ];

  const recentActivity = [
    { description: "Assignment submitted by John Smith", timestamp: "2 hours ago", type: "submission" },
    { description: "Attendance marked for Grade 10-A", timestamp: "3 hours ago", type: "attendance" },
    { description: "Parent message received", timestamp: "5 hours ago", type: "message" },
    { description: "Exam scheduled for next week", timestamp: "1 day ago", type: "exam" }
  ];

  const upcomingEvents = [
    {
      title: "Parent-Teacher Conference",
      date: "March 15, 2024 - 2:00 PM",
      description: "Individual meetings scheduled with parents to discuss student progress and academic performance.",
      type: "Meeting"
    },
    {
      title: "Mid-term Examinations",
      date: "March 20-25, 2024",
      description: "Mid-term examination schedule for all grades. Exam timetables have been shared with students.",
      type: "Exam"
    }
  ];

  const handleQuickAction = (action) => {
    console.log(`Quick action triggered: ${action}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening in your classes today.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          color="primary"
          data-testid="stat-total-students"
        />
        <StatsCard
          title="Present Today"
          value={stats?.presentToday || 0}
          icon={CheckCircle}
          color="secondary"
          data-testid="stat-present-today"
        />
        <StatsCard
          title="Pending Assignments"
          value={stats?.pendingAssignments || 0}
          icon={AlertCircle}
          color="destructive"
          data-testid="stat-pending-assignments"
        />
        <StatsCard
          title="Today's Classes"
          value={stats?.todayClasses || 0}
          icon={Calendar}
          color="accent"
          data-testid="stat-today-classes"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="dashboard-card" data-testid="card-today-schedule">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Schedule</CardTitle>
              <Button variant="ghost" size="sm" data-testid="button-view-all-schedule">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid={`schedule-item-${index}`}>
                  <div>
                    <p className="font-medium">{classItem.subject}</p>
                    <p className="text-sm text-muted-foreground">{classItem.grade}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Clock className="w-3 h-3" />
                      {classItem.time}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {classItem.room}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="dashboard-card" data-testid="card-recent-activity">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" data-testid="button-view-all-activity">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3" data-testid={`activity-item-${index}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'submission' ? 'bg-primary' :
                    activity.type === 'attendance' ? 'bg-secondary' :
                    activity.type === 'message' ? 'bg-destructive' : 'bg-accent'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="dashboard-card" data-testid="card-quick-actions">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent transition-colors"
                onClick={() => handleQuickAction("Mark Attendance")}
                data-testid="button-mark-attendance"
              >
                <CheckCircle className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Mark Attendance</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent transition-colors"
                onClick={() => handleQuickAction("Create Assignment")}
                data-testid="button-create-assignment"
              >
                <FileText className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Create Assignment</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent transition-colors"
                onClick={() => handleQuickAction("Send Message")}
                data-testid="button-send-message"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Send Message</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent transition-colors"
                onClick={() => handleQuickAction("Grade Students")}
                data-testid="button-grade-students"
              >
                <TrendingUp className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Grade Students</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card data-testid="card-upcoming-events">
        <CardHeader>
          <CardTitle>Upcoming Events & Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="border border-border rounded-lg p-4" data-testid={`event-item-${index}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">{event.date}</p>
                    <p className="text-xs">{event.description}</p>
                  </div>
                  <Badge 
                    variant={
                      event.type === 'Meeting' ? 'default' :
                      event.type === 'Exam' ? 'destructive' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {event.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}