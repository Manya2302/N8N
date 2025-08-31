import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Edit, Calendar, Clock, Users, Search, Filter } from 'lucide-react';

export default function Assignments() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data
  const assignments = [
    {
      id: 1,
      title: 'Algebra Practice Problems',
      subject: 'Mathematics',
      class: 'Grade 10-A',
      dueDate: '2024-03-15',
      status: 'active',
      submitted: 18,
      total: 25,
      description: 'Complete problems 1-20 from Chapter 5. Show all work and include explanations for each step.'
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      subject: 'Physics',
      class: 'Grade 11-B',
      dueDate: '2024-03-18',
      status: 'active',
      submitted: 15,
      total: 22,
      description: 'Write a comprehensive lab report on the pendulum experiment conducted last week.'
    },
    {
      id: 3,
      title: 'Chemical Reactions Worksheet',
      subject: 'Chemistry',
      class: 'Grade 12-A',
      dueDate: '2024-03-12',
      status: 'overdue',
      submitted: 25,
      total: 28,
      description: 'Balance the chemical equations and identify the reaction types.'
    },
    {
      id: 4,
      title: 'Geometry Proof Assignment',
      subject: 'Mathematics',
      class: 'Grade 9-B',
      dueDate: '2024-03-20',
      status: 'draft',
      submitted: 0,
      total: 24,
      description: 'Prove the given geometric theorems using the methods discussed in class.'
    }
  ];

  const classes = [
    { id: 'grade-9b', name: 'Grade 9-B' },
    { id: 'grade-10a', name: 'Grade 10-A' },
    { id: 'grade-11b', name: 'Grade 11-B' },
    { id: 'grade-12a', name: 'Grade 12-A' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700';
      case 'overdue': return 'bg-red-50 text-red-700';
      case 'draft': return 'bg-gray-50 text-gray-700';
      case 'completed': return 'bg-blue-50 text-blue-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getProgressColor = (submitted, total) => {
    const percentage = (submitted / total) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesClass = classFilter === 'all' || assignment.class === classFilter;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    overdue: assignments.filter(a => a.status === 'overdue').length,
    draft: assignments.filter(a => a.status === 'draft').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">Create and manage assignments for your classes</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Assignment
        </Button>
      </div>

      {/* Assignment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Assignments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Edit className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
                <p className="text-sm text-muted-foreground">Draft</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Assignment Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Assignment Title</label>
                <Input placeholder="Enter assignment title" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Class</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Due Date</label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea placeholder="Enter assignment description and instructions" rows={4} />
            </div>
            <div className="flex items-center gap-2">
              <Button>Create Assignment</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
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
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {assignment.subject}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {assignment.class}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {assignment.dueDate}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Submission Progress */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      Submissions: {assignment.submitted}/{assignment.total}
                    </span>
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(assignment.submitted, assignment.total)}`}
                        style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((assignment.submitted / assignment.total) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">View Submissions</Button>
                    <Button size="sm">Grade</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}