import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '../../lib/api';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  UserPlus,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';

export default function Students() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    rollNo: '',
    studentNumber: '',
    parentNumber1: '',
    parentNumber2: '',
    extraInfo: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch teacher's classes
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['/api/classes'],
    queryFn: () => apiClient.get('/classes'),
  });

  // Fetch students for selected class
  const { data: students, isLoading: studentsLoading, refetch: refetchStudents } = useQuery({
    queryKey: ['/api/students', selectedClass?.id],
    queryFn: () => apiClient.get(`/students?classId=${selectedClass.id}`),
    enabled: !!selectedClass?.id,
  });

  // Save student mutation
  const saveStudent = useMutation({
    mutationFn: async (studentData) => {
      if (editingStudent) {
        return apiClient.patch(`/students/${editingStudent.id}`, studentData);
      } else {
        return apiClient.post('/students', {
          ...studentData,
          classId: selectedClass?.id,
          teacherId: null // Will be set by backend based on auth
        });
      }
    },
    onSuccess: (response) => {
      toast({ title: response.message || (editingStudent ? 'Student updated successfully' : 'Student added successfully') });
      setIsDialogOpen(false);
      setEditingStudent(null);
      setStudentForm({
        name: '',
        rollNo: '',
        studentNumber: '',
        parentNumber1: '',
        parentNumber2: '',
        extraInfo: ''
      });
      refetchStudents();
    },
    onError: (error) => {
      toast({ 
        title: 'Error saving student', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  // Delete student mutation
  const deleteStudent = useMutation({
    mutationFn: async (studentId) => {
      return apiClient.delete(`/students/${studentId}`);
    },
    onSuccess: (response) => {
      toast({ title: response.message || 'Student deleted successfully' });
      refetchStudents();
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting student', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const handleSaveStudent = () => {
    if (!studentForm.name.trim() || !studentForm.rollNo.trim() || !selectedClass) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please fill in name, roll number and select a class', 
        variant: 'destructive' 
      });
      return;
    }

    // Check for duplicate roll number (excluding current student if editing)
    const existingStudent = students?.find(s => 
      s.rollNo === studentForm.rollNo && 
      (!editingStudent || s.id !== editingStudent.id)
    );
    
    if (existingStudent) {
      toast({ 
        title: 'Validation Error', 
        description: 'A student with this roll number already exists in this class', 
        variant: 'destructive' 
      });
      return;
    }

    saveStudent.mutate(studentForm);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      rollNo: student.rollNo,
      studentNumber: student.studentNumber || '',
      parentNumber1: student.parentNumber1 || '',
      parentNumber2: student.parentNumber2 || '',
      extraInfo: student.extraInfo ? JSON.stringify(student.extraInfo) : ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      deleteStudent.mutate(studentId);
    }
  };

  const openNewStudentDialog = () => {
    if (!selectedClass) {
      toast({ 
        title: 'Select Class First', 
        description: 'Please select a class before adding a student', 
        variant: 'destructive' 
      });
      return;
    }
    
    setEditingStudent(null);
    setStudentForm({
      name: '',
      rollNo: '',
      studentNumber: '',
      parentNumber1: '',
      parentNumber2: '',
      extraInfo: ''
    });
    setIsDialogOpen(true);
  };

  // Filter students based on search term
  const filteredStudents = students?.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">Add and manage students in your classes</p>
        </div>
        <Button onClick={openNewStudentDialog} data-testid="button-new-student">
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-total-students">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{students?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-selected-class">
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Selected Class</p>
                <p className="text-lg font-bold text-green-600">
                  {selectedClass ? `${selectedClass.name} - ${selectedClass.subject}` : 'None'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-total-classes">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Your Classes</p>
                <p className="text-2xl font-bold text-purple-600">{classes?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Selection */}
      <Card data-testid="card-class-selection">
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedClass?.id || ''} onValueChange={(value) => {
            const selected = classes?.find(c => c.id === value);
            setSelectedClass(selected);
          }}>
            <SelectTrigger data-testid="select-student-class">
              <SelectValue placeholder="Choose a class to manage students" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} - {cls.subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Students List */}
      {selectedClass && (
        <Card data-testid="card-students-list">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Students in {selectedClass.name} ({filteredStudents.length})
              </span>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                  data-testid="input-search-students"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="text-center py-8">Loading students...</div>
            ) : filteredStudents && filteredStudents.length > 0 ? (
              <div className="space-y-4">
                {filteredStudents.map((student, index) => (
                  <div 
                    key={student.id} 
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    data-testid={`student-card-${index}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white font-medium">
                            {student.name?.substring(0, 2).toUpperCase() || 'UN'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            <Badge variant="outline">Roll: {student.rollNo}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            {student.studentNumber && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                Student: {student.studentNumber}
                              </div>
                            )}
                            {student.parentNumber1 && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                Parent 1: {student.parentNumber1}
                              </div>
                            )}
                            {student.parentNumber2 && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                Parent 2: {student.parentNumber2}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Added: {new Date(student.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {student.extraInfo && typeof student.extraInfo === 'object' && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Additional Info: {JSON.stringify(student.extraInfo)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                          data-testid={`button-edit-student-${index}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                          disabled={deleteStudent.isPending}
                          data-testid={`button-delete-student-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No students found matching your search' : 'No students added to this class yet'}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedClass && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Class to Manage Students</h3>
            <p className="text-muted-foreground">Choose a class from above to view and manage its students</p>
          </CardContent>
        </Card>
      )}

      {/* Student Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter student name"
                  data-testid="input-student-name"
                />
              </div>
              <div>
                <Label htmlFor="rollNo">Roll Number *</Label>
                <Input
                  id="rollNo"
                  value={studentForm.rollNo}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, rollNo: e.target.value }))}
                  placeholder="e.g., 101"
                  data-testid="input-roll-number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="studentNumber">Student Phone</Label>
              <Input
                id="studentNumber"
                value={studentForm.studentNumber}
                onChange={(e) => setStudentForm(prev => ({ ...prev, studentNumber: e.target.value }))}
                placeholder="Student's phone number"
                data-testid="input-student-phone"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentNumber1">Parent Phone 1</Label>
                <Input
                  id="parentNumber1"
                  value={studentForm.parentNumber1}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, parentNumber1: e.target.value }))}
                  placeholder="Primary parent phone"
                  data-testid="input-parent-phone-1"
                />
              </div>
              <div>
                <Label htmlFor="parentNumber2">Parent Phone 2</Label>
                <Input
                  id="parentNumber2"
                  value={studentForm.parentNumber2}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, parentNumber2: e.target.value }))}
                  placeholder="Secondary parent phone"
                  data-testid="input-parent-phone-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="extraInfo">Additional Information</Label>
              <Input
                id="extraInfo"
                value={studentForm.extraInfo}
                onChange={(e) => setStudentForm(prev => ({ ...prev, extraInfo: e.target.value }))}
                placeholder="Any additional notes (optional)"
                data-testid="input-extra-info"
              />
            </div>

            <Button 
              onClick={handleSaveStudent} 
              disabled={saveStudent.isPending || !studentForm.name.trim() || !studentForm.rollNo.trim()}
              className="w-full"
              data-testid="button-save-student"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {saveStudent.isPending ? 'Saving...' : (editingStudent ? 'Update Student' : 'Add Student')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}