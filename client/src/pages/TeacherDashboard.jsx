import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import { apiClient } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  BookOpen,
  Plus,
  Edit,
  Send,
  GraduationCap,
  Star,
  Phone,
  Mail
} from 'lucide-react';

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => apiClient.get('/dashboard/stats'),
  });

  // Fetch students
  const { data: students } = useQuery({
    queryKey: ['/api/students'],
    queryFn: () => apiClient.get('/students'),
  });

  // Fetch assignments
  const { data: assignments } = useQuery({
    queryKey: ['/api/assignments'],
    queryFn: () => apiClient.get('/assignments'),
  });

  // Mock data for UI (replace with real API calls)
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

  const studentPerformance = [
    { name: "John Smith", initials: "JS", grade: "A", percentage: 95, lastSubmission: "2 days ago" },
    { name: "Emma Miller", initials: "EM", grade: "B+", percentage: 87, lastSubmission: "1 day ago" },
    { name: "Michael Johnson", initials: "MJ", grade: "B", percentage: 82, lastSubmission: "3 days ago" }
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
    },
    {
      title: "Science Fair 2024",
      date: "April 5, 2024 - 10:00 AM",
      description: "Annual science fair showcasing student projects and experiments across all grade levels.",
      type: "Event"
    }
  ];

  const handleQuickAction = (action) => {
    console.log(`Quick action triggered: ${action}`);
    // TODO: Implement specific quick action functionality
  };

  return (
    <Layout title="Teacher Dashboard" subtitle="Welcome back">
      <div className="space-y-6">
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

        {/* Main Teacher Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule" data-testid="tab-schedule">Schedule</TabsTrigger>
            <TabsTrigger value="attendance" data-testid="tab-attendance">Attendance</TabsTrigger>
            <TabsTrigger value="grades" data-testid="tab-grades">Grades</TabsTrigger>
            <TabsTrigger value="communication" data-testid="tab-communication">Communication</TabsTrigger>
            <TabsTrigger value="assignments" data-testid="tab-assignments">Assignments</TabsTrigger>
            <TabsTrigger value="students" data-testid="tab-students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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

            {/* Additional Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Performance Overview */}
              <Card className="dashboard-card" data-testid="card-student-performance">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Student Performance Overview</CardTitle>
                    <select 
                      className="text-sm border border-border rounded px-2 py-1"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      data-testid="select-class"
                    >
                      <option>Grade 10-A</option>
                      <option>Grade 11-B</option>
                      <option>Grade 12-A</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentPerformance.map((student, index) => (
                      <div key={index} className="flex items-center justify-between" data-testid={`student-performance-${index}`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            student.percentage >= 90 ? 'bg-primary' :
                            student.percentage >= 80 ? 'bg-secondary' : 'bg-accent'
                          }`}>
                            <span className="text-xs font-medium text-white">{student.initials}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">Last submission: {student.lastSubmission}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-sm font-medium">{student.grade}</p>
                            <p className="text-xs text-muted-foreground">{student.percentage}%</p>
                          </div>
                          <div className="w-12">
                            <Progress value={student.percentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events & Announcements */}
              <Card className="dashboard-card" data-testid="card-upcoming-events">
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
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card data-testid="card-class-schedule">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Weekly Class Schedule
                  </CardTitle>
                  <Button data-testid="button-edit-schedule">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Schedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, dayIndex) => (
                    <div key={day} className="space-y-2">
                      <h4 className="font-medium text-center">{day}</h4>
                      {[
                        { time: "9:00 AM", subject: "Mathematics", room: "101" },
                        { time: "11:00 AM", subject: "Physics", room: "Lab 2" },
                        { time: "2:00 PM", subject: "Chemistry", room: "Lab 1" }
                      ].map((slot, slotIndex) => (
                        <div key={slotIndex} className="p-2 bg-muted rounded text-sm" data-testid={`schedule-slot-${dayIndex}-${slotIndex}`}>
                          <div className="font-medium">{slot.time}</div>
                          <div>{slot.subject}</div>
                          <div className="text-muted-foreground">{slot.room}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card data-testid="card-attendance-management">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Attendance Management
                  </CardTitle>
                  <div className="flex gap-2">
                    <select className="text-sm border border-border rounded px-2 py-1" data-testid="select-attendance-class">
                      <option>Grade 10-A</option>
                      <option>Grade 11-B</option>
                      <option>Grade 12-A</option>
                    </select>
                    <Button data-testid="button-mark-today-attendance">
                      Mark Today's Attendance
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "John Smith", rollNo: "001", status: "Present" },
                    { name: "Emma Wilson", rollNo: "002", status: "Present" },
                    { name: "Michael Johnson", rollNo: "003", status: "Absent" },
                    { name: "Sarah Davis", rollNo: "004", status: "Late" }
                  ].map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`attendance-student-${index}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{student.rollNo}</span>
                        <span>{student.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={
                          student.status === 'Present' ? 'default' :
                          student.status === 'Late' ? 'secondary' : 'destructive'
                        }>
                          {student.status}
                        </Badge>
                        <Button variant="outline" size="sm" data-testid={`button-edit-attendance-${index}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="space-y-6">
            <Card data-testid="card-grades-management">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Grades & Progress Tracking
                  </CardTitle>
                  <Button data-testid="button-add-grade">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Grade
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { student: "John Smith", subject: "Mathematics", grade: "A", percentage: 95, examType: "Weekly Test" },
                    { student: "Emma Wilson", subject: "Mathematics", grade: "B+", percentage: 87, examType: "Weekly Test" },
                    { student: "Michael Johnson", subject: "Mathematics", grade: "B", percentage: 82, examType: "Weekly Test" }
                  ].map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`grade-entry-${index}`}>
                      <div>
                        <p className="font-medium">{grade.student}</p>
                        <p className="text-sm text-muted-foreground">{grade.subject} • {grade.examType}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-bold text-lg">{grade.grade}</div>
                          <div className="text-sm text-muted-foreground">{grade.percentage}%</div>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-edit-grade-${index}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-parent-communication">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Parent Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full" data-testid="button-send-message-parents">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message to Parents
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-schedule-meeting">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Parent Meeting
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-send-progress-report">
                      <FileText className="w-4 h-4 mr-2" />
                      Send Progress Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-recent-messages">
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { parent: "Mrs. Smith", message: "Thank you for the progress update", time: "2 hours ago" },
                      { parent: "Mr. Wilson", message: "When is the next parent meeting?", time: "1 day ago" },
                      { parent: "Mrs. Johnson", message: "Michael's homework question", time: "2 days ago" }
                    ].map((msg, index) => (
                      <div key={index} className="p-3 border rounded-lg" data-testid={`message-${index}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{msg.parent}</p>
                            <p className="text-sm text-muted-foreground">{msg.message}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card data-testid="card-assignments-management">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Assignment Management
                  </CardTitle>
                  <Button data-testid="button-create-assignment">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Mathematics Chapter 5 Exercise", dueDate: "March 15, 2024", submissions: 25, total: 30, status: "Active" },
                    { title: "Physics Lab Report", dueDate: "March 20, 2024", submissions: 28, total: 30, status: "Active" },
                    { title: "Chemistry Assignment 3", dueDate: "March 10, 2024", submissions: 30, total: 30, status: "Completed" }
                  ].map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`assignment-${index}`}>
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                        <p className="text-sm text-muted-foreground">Submissions: {assignment.submissions}/{assignment.total}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant={assignment.status === 'Completed' ? 'default' : 'secondary'}>
                          {assignment.status}
                        </Badge>
                        <Button variant="outline" size="sm" data-testid={`button-view-assignment-${index}`}>
                          View
                        </Button>
                        <Button variant="outline" size="sm" data-testid={`button-edit-assignment-${index}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card data-testid="card-student-profiles">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Student Profiles
                  </CardTitle>
                  <select className="text-sm border border-border rounded px-2 py-1" data-testid="select-student-class">
                    <option>All Classes</option>
                    <option>Grade 10-A</option>
                    <option>Grade 11-B</option>
                    <option>Grade 12-A</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "John Smith", rollNo: "001", performance: "Excellent", attendance: "95%", parentContact: "+1234567890" },
                    { name: "Emma Wilson", rollNo: "002", performance: "Good", attendance: "89%", parentContact: "+1234567891" },
                    { name: "Michael Johnson", rollNo: "003", performance: "Average", attendance: "82%", parentContact: "+1234567892" },
                    { name: "Sarah Davis", rollNo: "004", performance: "Good", attendance: "91%", parentContact: "+1234567893" }
                  ].map((student, index) => (
                    <Card key={index} className="p-4" data-testid={`student-profile-${index}`}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-white font-medium">{student.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Performance:</span>
                            <Badge variant={student.performance === 'Excellent' ? 'default' : 'secondary'}>
                              {student.performance}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Attendance:</span>
                            <span className="font-medium">{student.attendance}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1" data-testid={`button-contact-parent-${index}`}>
                              <Phone className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-profile-${index}`}>
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}