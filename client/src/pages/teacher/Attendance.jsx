import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, Search, Filter, Calendar, Users, Download } from 'lucide-react';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock attendance data
  const classes = [
    { id: 'grade-10a', name: 'Grade 10-A', subject: 'Mathematics', total: 25 },
    { id: 'grade-11b', name: 'Grade 11-B', subject: 'Physics', total: 22 },
    { id: 'grade-12a', name: 'Grade 12-A', subject: 'Chemistry', total: 28 }
  ];

  const attendanceData = [
    { id: 1, name: 'John Smith', rollNo: '101', class: 'Grade 10-A', status: 'present', time: '9:15 AM' },
    { id: 2, name: 'Emma Johnson', rollNo: '102', class: 'Grade 10-A', status: 'present', time: '9:12 AM' },
    { id: 3, name: 'Michael Brown', rollNo: '103', class: 'Grade 10-A', status: 'absent', time: '-' },
    { id: 4, name: 'Sarah Davis', rollNo: '104', class: 'Grade 10-A', status: 'late', time: '9:25 AM' },
    { id: 5, name: 'James Wilson', rollNo: '105', class: 'Grade 10-A', status: 'present', time: '9:08 AM' },
    { id: 6, name: 'Lisa Anderson', rollNo: '106', class: 'Grade 10-A', status: 'present', time: '9:10 AM' },
    { id: 7, name: 'David Miller', rollNo: '107', class: 'Grade 10-A', status: 'absent', time: '-' },
    { id: 8, name: 'Jennifer Taylor', rollNo: '108', class: 'Grade 10-A', status: 'present', time: '9:18 AM' }
  ];

  const attendanceStats = {
    present: attendanceData.filter(s => s.status === 'present').length,
    absent: attendanceData.filter(s => s.status === 'absent').length,
    late: attendanceData.filter(s => s.status === 'late').length,
    total: attendanceData.length
  };

  const filteredData = attendanceData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.includes(searchTerm);
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleStatusChange = (studentId, newStatus) => {
    console.log(`Updating attendance for student ${studentId} to ${newStatus}`);
    // Here you would update the attendance in your database
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50';
      case 'absent': return 'text-red-600 bg-red-50';
      case 'late': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'absent': return <XCircle className="w-4 h-4" />;
      case 'late': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage student attendance for your classes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Mark All Present
          </Button>
        </div>
      </div>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
                <p className="text-sm text-muted-foreground">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                <p className="text-sm text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
                <p className="text-sm text-muted-foreground">Late</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{attendanceStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance - {selectedDate}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredData.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Roll No: {student.rollNo} • {student.class}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Check-in: {student.time}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(student.id, 'present')}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Present
                    </Button>
                    <Button
                      variant={student.status === 'late' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(student.id, 'late')}
                      className="flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      Late
                    </Button>
                    <Button
                      variant={student.status === 'absent' ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      className="flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" />
                      Absent
                    </Button>
                  </div>
                  <Badge 
                    className={`${getStatusColor(student.status)} flex items-center gap-1`}
                  >
                    {getStatusIcon(student.status)}
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
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