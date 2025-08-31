import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Phone, Mail, MapPin, Calendar, Edit, Eye, Plus } from 'lucide-react';

export default function Students() {
  const [classFilter, setClassFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock data
  const students = [
    {
      id: 1,
      name: 'John Smith',
      rollNo: '101',
      class: 'Grade 10-A',
      email: 'john.smith@school.edu',
      phone: '+1 234-567-8901',
      parentName: 'Mrs. Smith',
      parentPhone: '+1 234-567-8902',
      address: '123 Main St, City, State 12345',
      dateOfBirth: '2008-05-15',
      attendance: 92,
      averageGrade: 'A',
      status: 'active',
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      recentActivity: [
        { type: 'assignment', description: 'Submitted Algebra homework', date: '2024-03-10' },
        { type: 'attendance', description: 'Present in class', date: '2024-03-10' },
        { type: 'grade', description: 'Received A- in Physics quiz', date: '2024-03-08' }
      ]
    },
    {
      id: 2,
      name: 'Emma Johnson',
      rollNo: '102',
      class: 'Grade 10-A',
      email: 'emma.johnson@school.edu',
      phone: '+1 234-567-8903',
      parentName: 'Mr. Johnson',
      parentPhone: '+1 234-567-8904',
      address: '456 Oak Ave, City, State 12345',
      dateOfBirth: '2008-08-22',
      attendance: 98,
      averageGrade: 'A+',
      status: 'active',
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      recentActivity: [
        { type: 'assignment', description: 'Submitted lab report early', date: '2024-03-11' },
        { type: 'attendance', description: 'Present in class', date: '2024-03-11' },
        { type: 'grade', description: 'Received A+ in Chemistry test', date: '2024-03-09' }
      ]
    },
    {
      id: 3,
      name: 'Michael Brown',
      rollNo: '103',
      class: 'Grade 10-A',
      email: 'michael.brown@school.edu',
      phone: '+1 234-567-8905',
      parentName: 'Mrs. Brown',
      parentPhone: '+1 234-567-8906',
      address: '789 Pine St, City, State 12345',
      dateOfBirth: '2008-12-03',
      attendance: 85,
      averageGrade: 'B+',
      status: 'needs_attention',
      subjects: ['Mathematics', 'Physics'],
      recentActivity: [
        { type: 'assignment', description: 'Late submission for Math homework', date: '2024-03-10' },
        { type: 'attendance', description: 'Absent from class', date: '2024-03-09' },
        { type: 'grade', description: 'Received B in Physics quiz', date: '2024-03-07' }
      ]
    },
    {
      id: 4,
      name: 'Sarah Davis',
      rollNo: '104',
      class: 'Grade 10-A',
      email: 'sarah.davis@school.edu',
      phone: '+1 234-567-8907',
      parentName: 'Mr. Davis',
      parentPhone: '+1 234-567-8908',
      address: '321 Elm St, City, State 12345',
      dateOfBirth: '2008-03-18',
      attendance: 95,
      averageGrade: 'A-',
      status: 'active',
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      recentActivity: [
        { type: 'assignment', description: 'Excellent performance in group project', date: '2024-03-11' },
        { type: 'attendance', description: 'Present in class', date: '2024-03-11' },
        { type: 'grade', description: 'Received A in Math test', date: '2024-03-08' }
      ]
    }
  ];

  const classes = [
    { id: 'grade-10a', name: 'Grade 10-A' },
    { id: 'grade-11b', name: 'Grade 11-B' },
    { id: 'grade-12a', name: 'Grade 12-A' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700';
      case 'needs_attention': return 'bg-yellow-50 text-yellow-700';
      case 'inactive': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 95) return 'text-green-600';
    if (attendance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.includes(searchTerm) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    needsAttention: students.filter(s => s.status === 'needs_attention').length,
    averageAttendance: Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Profiles</h1>
          <p className="text-muted-foreground">Manage and track individual student information and progress</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Student Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.needsAttention}</p>
                <p className="text-sm text-muted-foreground">Need Attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.averageAttendance}%</p>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by class" />
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
                placeholder="Search students by name, roll number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Student List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className={`p-4 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                      selectedStudent?.id === student.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Roll No: {student.rollNo} • {student.class}
                          </p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(student.status)}>
                          {student.status.replace('_', ' ').charAt(0).toUpperCase() + student.status.replace('_', ' ').slice(1)}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className={`text-lg font-bold ${getAttendanceColor(student.attendance)}`}>
                          {student.attendance}%
                        </p>
                        <p className="text-xs text-muted-foreground">Attendance</p>
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${getGradeColor(student.averageGrade)}`}>
                          {student.averageGrade}
                        </p>
                        <p className="text-xs text-muted-foreground">Average Grade</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">{student.subjects.length}</p>
                        <p className="text-xs text-muted-foreground">Subjects</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Details */}
        <div>
          {selectedStudent ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Student Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-lg font-medium text-primary mx-auto mb-2">
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="font-semibold">{selectedStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStudent.class}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedStudent.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedStudent.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Born: {selectedStudent.dateOfBirth}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="font-medium mb-2">Parent/Guardian</h4>
                    <p className="text-sm font-medium">{selectedStudent.parentName}</p>
                    <p className="text-sm text-muted-foreground">{selectedStudent.parentPhone}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3">
                    <Button size="sm" className="flex-1">
                      <Phone className="w-3 h-3 mr-1" />
                      Call Parent
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="w-3 h-3 mr-1" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedStudent.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'assignment' ? 'bg-blue-500' :
                          activity.type === 'attendance' ? 'bg-green-500' :
                          activity.type === 'grade' ? 'bg-purple-500' : 'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Student Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a student from the list to view their detailed information and recent activity.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}