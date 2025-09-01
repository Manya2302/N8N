import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '../../lib/api';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Calendar,
  BookOpen,
  Users
} from 'lucide-react';

export default function Assignments() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'active'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch teacher's classes
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['/api/classes'],
    queryFn: () => apiClient.get('/classes'),
  });

  // Fetch assignments
  const { data: assignments, isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery({
    queryKey: ['/api/assignments'],
    queryFn: () => apiClient.get('/assignments'),
  });

  // Save assignment mutation
  const saveAssignment = useMutation({
    mutationFn: async (assignmentData) => {
      if (editingAssignment) {
        return apiClient.patch(`/assignments/${editingAssignment.id}`, assignmentData);
      } else {
        return apiClient.post('/assignments', {
          ...assignmentData,
          moduleId: selectedClass?.id // Using class as module for simplicity
        });
      }
    },
    onSuccess: (response) => {
      toast({ title: response.message || (editingAssignment ? 'Assignment updated successfully' : 'Assignment created successfully') });
      setIsDialogOpen(false);
      setEditingAssignment(null);
      setAssignmentForm({
        title: '',
        description: '',
        dueDate: '',
        status: 'active'
      });
      refetchAssignments();
    },
    onError: (error) => {
      toast({ 
        title: 'Error saving assignment', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  // Delete assignment mutation
  const deleteAssignment = useMutation({
    mutationFn: async (assignmentId) => {
      return apiClient.delete(`/assignments/${assignmentId}`);
    },
    onSuccess: (response) => {
      toast({ title: response.message || 'Assignment deleted successfully' });
      refetchAssignments();
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting assignment', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const handleSaveAssignment = () => {
    if (!assignmentForm.title.trim() || !assignmentForm.dueDate || !selectedClass) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please fill in all required fields and select a class', 
        variant: 'destructive' 
      });
      return;
    }

    saveAssignment.mutate(assignmentForm);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description || '',
      dueDate: new Date(assignment.dueDate).toISOString().slice(0, 16),
      status: assignment.status
    });
    
    // Find the class for this assignment
    const assignmentClass = classes?.find(c => c.id === assignment.moduleId);
    setSelectedClass(assignmentClass);
    
    setIsDialogOpen(true);
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      deleteAssignment.mutate(assignmentId);
    }
  };

  const openNewAssignmentDialog = () => {
    setEditingAssignment(null);
    setAssignmentForm({
      title: '',
      description: '',
      dueDate: '',
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  // Filter assignments based on search term and status
  const filteredAssignments = assignments?.filter(assignment => {
    const matchesSearch = assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  // Calculate stats
  const stats = {
    total: assignments?.length || 0,
    active: assignments?.filter(a => a.status === 'active').length || 0,
    completed: assignments?.filter(a => a.status === 'completed').length || 0,
    overdue: assignments?.filter(a => a.status === 'active' && isOverdue(a.dueDate)).length || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignment Management</h1>
          <p className="text-muted-foreground">Create and manage assignments for your classes</p>
        </div>
        <Button onClick={openNewAssignmentDialog} data-testid="button-new-assignment">
          <Plus className="w-4 h-4 mr-2" />
          New Assignment
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-assignments">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-active-assignments">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-completed-assignments">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-overdue-assignments">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card data-testid="card-assignment-filters">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-assignments"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40" data-testid="select-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card data-testid="card-assignments-list">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Assignments ({filteredAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignmentsLoading ? (
            <div className="text-center py-8">Loading assignments...</div>
          ) : filteredAssignments && filteredAssignments.length > 0 ? (
            <div className="space-y-4">
              {filteredAssignments.map((assignment, index) => {
                const isAssignmentOverdue = isOverdue(assignment.dueDate);
                return (
                  <div 
                    key={assignment.id} 
                    className={`border rounded-lg p-4 ${isAssignmentOverdue && assignment.status === 'active' ? 'border-red-200 bg-red-50' : ''}`}
                    data-testid={`assignment-${index}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{assignment.title}</h3>
                          <Badge className={getStatusColor(assignment.status)}>
                            {getStatusIcon(assignment.status)}
                            <span className="ml-1">{assignment.status}</span>
                          </Badge>
                          {isAssignmentOverdue && assignment.status === 'active' && (
                            <Badge variant="destructive">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          📅 Due: {new Date(assignment.dueDate).toLocaleString()}
                        </div>
                        {assignment.description && (
                          <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(assignment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAssignment(assignment)}
                          data-testid={`button-edit-assignment-${index}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          disabled={deleteAssignment.isPending}
                          data-testid={`button-delete-assignment-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' ? 'No assignments found matching your filters' : 'No assignments created yet'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editingAssignment && (
              <div>
                <Label htmlFor="assignmentClass">Class *</Label>
                <Select 
                  value={selectedClass?.id || ''} 
                  onValueChange={(value) => {
                    const selected = classes?.find(c => c.id === value);
                    setSelectedClass(selected);
                  }}
                >
                  <SelectTrigger data-testid="select-assignment-class">
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes?.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - {cls.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="assignmentTitle">Assignment Title *</Label>
              <Input
                id="assignmentTitle"
                value={assignmentForm.title}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter assignment title"
                data-testid="input-assignment-title"
              />
            </div>

            <div>
              <Label htmlFor="assignmentDueDate">Due Date & Time *</Label>
              <Input
                id="assignmentDueDate"
                type="datetime-local"
                value={assignmentForm.dueDate}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                data-testid="input-assignment-due-date"
              />
            </div>

            {editingAssignment && (
              <div>
                <Label htmlFor="assignmentStatus">Status</Label>
                <Select 
                  value={assignmentForm.status} 
                  onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger data-testid="select-assignment-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="assignmentDescription">Description</Label>
              <Textarea
                id="assignmentDescription"
                value={assignmentForm.description}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Assignment instructions and details..."
                rows={4}
                data-testid="textarea-assignment-description"
              />
            </div>

            <Button 
              onClick={handleSaveAssignment} 
              disabled={saveAssignment.isPending || !assignmentForm.title.trim() || !assignmentForm.dueDate || (!editingAssignment && !selectedClass)}
              className="w-full"
              data-testid="button-save-assignment"
            >
              <FileText className="w-4 h-4 mr-2" />
              {saveAssignment.isPending ? 'Saving...' : (editingAssignment ? 'Update Assignment' : 'Create Assignment')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}