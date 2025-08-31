import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Award, Search, Plus, Edit, Download } from 'lucide-react';

export default function Grades() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const classes = [
    { id: 'grade-10a', name: 'Grade 10-A' },
    { id: 'grade-11b', name: 'Grade 11-B' },
    { id: 'grade-12a', name: 'Grade 12-A' }
  ];

  const subjects = [
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' }
  ];

  const gradeData = [
    {
      id: 1,
      student: 'John Smith',
      rollNo: '101',
      class: 'Grade 10-A',
      mathematics: { grade: 'A', percentage: 92, trend: 'up' },
      physics: { grade: 'B+', percentage: 88, trend: 'up' },
      chemistry: { grade: 'A-', percentage: 90, trend: 'stable' },
      overall: 90
    },
    {
      id: 2,
      student: 'Emma Johnson',
      rollNo: '102',
      class: 'Grade 10-A',
      mathematics: { grade: 'A+', percentage: 96, trend: 'up' },
      physics: { grade: 'A', percentage: 94, trend: 'up' },
      chemistry: { grade: 'A+', percentage: 97, trend: 'up' },
      overall: 96
    },
    {
      id: 3,
      student: 'Michael Brown',
      rollNo: '103',
      class: 'Grade 10-A',
      mathematics: { grade: 'B', percentage: 82, trend: 'down' },
      physics: { grade: 'B-', percentage: 78, trend: 'down' },
      chemistry: { grade: 'B+', percentage: 85, trend: 'stable' },
      overall: 82
    },
    {
      id: 4,
      student: 'Sarah Davis',
      rollNo: '104',
      class: 'Grade 10-A',
      mathematics: { grade: 'A-', percentage: 89, trend: 'up' },
      physics: { grade: 'A-', percentage: 87, trend: 'stable' },
      chemistry: { grade: 'A', percentage: 91, trend: 'up' },
      overall: 89
    }
  ];

  const recentExams = [
    { subject: 'Mathematics', type: 'Weekly Test', date: '2024-03-08', class: 'Grade 10-A', avgScore: 85 },
    { subject: 'Physics', type: 'Unit Test', date: '2024-03-06', class: 'Grade 11-B', avgScore: 78 },
    { subject: 'Chemistry', type: 'Lab Assessment', date: '2024-03-05', class: 'Grade 12-A', avgScore: 92 }
  ];

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />;
    return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
  };

  const filteredData = gradeData.filter(student => {
    const matchesSearch = student.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.includes(searchTerm);
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grades & Progress</h1>
          <p className="text-muted-foreground">Track student performance and academic progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Grade
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">87%</p>
                <p className="text-sm text-muted-foreground">Class Average</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-muted-foreground">Improving Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">3</p>
                <p className="text-sm text-muted-foreground">Need Attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">8</p>
                <p className="text-sm text-muted-foreground">Top Performers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Grades */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.map((student) => (
                  <div key={student.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                          {student.student.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{student.student}</p>
                          <p className="text-sm text-muted-foreground">{student.rollNo} • {student.class}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-lg font-bold">{student.overall}%</p>
                          <p className="text-xs text-muted-foreground">Overall</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(student).filter(([key]) => ['mathematics', 'physics', 'chemistry'].includes(key)).map(([subject, data]) => (
                        <div key={subject} className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium capitalize mb-1">{subject}</p>
                          <div className="flex items-center justify-center gap-2">
                            <Badge className={getGradeColor(data.grade)}>
                              {data.grade}
                            </Badge>
                            {getTrendIcon(data.trend)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{data.percentage}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Exams */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentExams.map((exam, index) => (
                  <div key={index} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{exam.subject}</p>
                        <p className="text-xs text-muted-foreground">{exam.type}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{exam.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{exam.class}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold">{exam.avgScore}%</p>
                        <p className="text-xs text-muted-foreground">Class Avg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">A Grades</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div className="w-3/4 bg-green-500 h-2 rounded-full"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">B Grades</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div className="w-1/2 bg-blue-500 h-2 rounded-full"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">20%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">C Grades</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div className="w-1/4 bg-yellow-500 h-2 rounded-full"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}