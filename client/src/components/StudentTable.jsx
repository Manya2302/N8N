import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import StudentForm from './StudentForm';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

export default function StudentTable({ students = [], isAdmin = false }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentNumber && student.studentNumber.includes(searchTerm))
  );

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: (studentId) => apiClient.delete(`/students/${studentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/students']);
      toast({
        title: "Student Deleted",
        description: "Student has been successfully removed from the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (studentId) => {
    deleteStudentMutation.mutate(studentId);
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    queryClient.invalidateQueries(['/api/students']);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingStudent(null);
    queryClient.invalidateQueries(['/api/students']);
  };

  return (
    <div className="space-y-4" data-testid="student-table">
      {/* Header with search and add button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
              data-testid="input-search-students"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
          </span>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-student">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter the student's information below. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <StudentForm
              onSuccess={handleAddSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Students table */}
      {filteredStudents.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Student Number</TableHead>
                <TableHead>Parent Contact 1</TableHead>
                <TableHead>Parent Contact 2</TableHead>
                {isAdmin && <TableHead>Teacher</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={student.id} data-testid={`student-row-${index}`}>
                  <TableCell className="font-medium">{student.rollNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.studentNumber || '-'}</TableCell>
                  <TableCell>{student.parentNumber1 || '-'}</TableCell>
                  <TableCell>{student.parentNumber2 || '-'}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      {student.teacherId ? (
                        <Badge variant="outline">Assigned</Badge>
                      ) : (
                        <Badge variant="secondary">Unassigned</Badge>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(student)}
                        data-testid={`button-edit-student-${index}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-student-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Student</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {student.name}? This action cannot be undone
                              and will remove all associated records including attendance and grades.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(student.id)}
                              className="bg-destructive hover:bg-destructive/90"
                              disabled={deleteStudentMutation.isPending}
                            >
                              {deleteStudentMutation.isPending ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg" data-testid="no-students-message">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm ? 'No students found' : 'No students yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? `No students match "${searchTerm}". Try adjusting your search.`
              : 'Get started by adding your first student to the system.'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Student
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student's information below.
            </DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <StudentForm
              student={editingStudent}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingStudent(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
