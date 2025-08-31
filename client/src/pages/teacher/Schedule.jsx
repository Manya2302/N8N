import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Plus, Edit, BookOpen } from 'lucide-react';

export default function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Mock schedule data
  const weeklySchedule = [
    {
      day: 'Monday',
      date: '2024-03-11',
      classes: [
        { time: '9:00 AM - 10:30 AM', subject: 'Mathematics', grade: 'Grade 10-A', room: 'Room 101', students: 25 },
        { time: '11:00 AM - 12:30 PM', subject: 'Physics', grade: 'Grade 11-B', room: 'Lab 2', students: 22 },
        { time: '2:00 PM - 3:30 PM', subject: 'Chemistry', grade: 'Grade 12-A', room: 'Lab 1', students: 28 }
      ]
    },
    {
      day: 'Tuesday',
      date: '2024-03-12',
      classes: [
        { time: '8:00 AM - 9:30 AM', subject: 'Mathematics', grade: 'Grade 9-B', room: 'Room 102', students: 24 },
        { time: '10:00 AM - 11:30 AM', subject: 'Physics', grade: 'Grade 10-A', room: 'Lab 2', students: 25 },
        { time: '1:00 PM - 2:30 PM', subject: 'Chemistry', grade: 'Grade 11-A', room: 'Lab 1', students: 26 }
      ]
    },
    {
      day: 'Wednesday',
      date: '2024-03-13',
      classes: [
        { time: '9:00 AM - 10:30 AM', subject: 'Mathematics', grade: 'Grade 12-B', room: 'Room 101', students: 23 },
        { time: '11:00 AM - 12:30 PM', subject: 'Physics', grade: 'Grade 9-A', room: 'Lab 2', students: 27 }
      ]
    },
    {
      day: 'Thursday',
      date: '2024-03-14',
      classes: [
        { time: '8:00 AM - 9:30 AM', subject: 'Chemistry', grade: 'Grade 10-B', room: 'Lab 1', students: 25 },
        { time: '10:00 AM - 11:30 AM', subject: 'Mathematics', grade: 'Grade 11-A', room: 'Room 102', students: 26 },
        { time: '2:00 PM - 3:30 PM', subject: 'Physics', grade: 'Grade 12-A', room: 'Lab 2', students: 28 }
      ]
    },
    {
      day: 'Friday',
      date: '2024-03-15',
      classes: [
        { time: '9:00 AM - 10:30 AM', subject: 'Mathematics', grade: 'Grade 10-A', room: 'Room 101', students: 25 },
        { time: '11:00 AM - 12:30 PM', subject: 'Chemistry', grade: 'Grade 9-B', room: 'Lab 1', students: 24 }
      ]
    }
  ];

  const upcomingEvents = [
    { title: 'Parent-Teacher Conference', time: '2:00 PM', date: 'March 15', type: 'meeting' },
    { title: 'Mid-term Exam - Physics', time: '10:00 AM', date: 'March 20', type: 'exam' },
    { title: 'Staff Meeting', time: '4:00 PM', date: 'March 18', type: 'meeting' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
          <p className="text-muted-foreground">Manage your weekly class schedule and upcoming events</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Class
        </Button>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Schedule
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}>
                Previous Week
              </Button>
              <span className="px-3 py-1 bg-muted rounded-md text-sm font-medium">
                March 11 - March 15, 2024
              </span>
              <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}>
                Next Week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {weeklySchedule.map((day, dayIndex) => (
              <div key={dayIndex} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{day.day}</h3>
                  <span className="text-sm text-muted-foreground">{day.date}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {day.classes.map((classItem, classIndex) => (
                    <div key={classIndex} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-primary">{classItem.subject}</h4>
                          <p className="text-sm text-muted-foreground">{classItem.grade}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{classItem.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{classItem.room}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{classItem.students} students</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'exam' ? 'bg-destructive' : 
                    event.type === 'meeting' ? 'bg-primary' : 'bg-secondary'
                  }`}></div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                  </div>
                </div>
                <Badge variant={event.type === 'exam' ? 'destructive' : 'default'}>
                  {event.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}