import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '../../lib/api';
import { Plus, Pencil, Save, GraduationCap, TrendingUp, Target, Award } from 'lucide-react';

export default function Grades() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradeForm, setGradeForm] = useState({
    subject: '',
    examType: '',
    examDate: '',
    marksObtained: '',
    totalMarks: '',
    notes: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch teacher's classes
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['/api/classes'],
    queryFn: () => apiClient.get('/classes'),
  });

  // Fetch students for selected class
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/students', selectedClass?.id],
    queryFn: () => apiClient.get(`/students?classId=${selectedClass.id}`),
    enabled: !!selectedClass?.id,
  });

  // Fetch grades for selected student
  const { data: grades, isLoading: gradesLoading, refetch: refetchGrades } = useQuery({
    queryKey: ['/api/grades/student', selectedStudent?.id],
    queryFn: () => apiClient.get(`/grades/student/${selectedStudent.id}`),
    enabled: !!selectedStudent?.id,
  });

  // Save grade mutation
  const saveGrade = useMutation({
    mutationFn: async (gradeData) => {
      if (editingGrade) {
        return apiClient.patch(`/grades/${editingGrade.id}`, gradeData);
      } else {
        return apiClient.post('/grades', {
          ...gradeData,
          studentId: selectedStudent.id
        });
      }
    },
    onSuccess: () => {
      toast({ title: editingGrade ? 'Grade updated successfully' : 'Grade added successfully' });
      setIsDialogOpen(false);
      setEditingGrade(null);
      setGradeForm({
        subject: '',
        examType: '',
        examDate: '',
        marksObtained: '',
        totalMarks: '',
        notes: ''
      });
      refetchGrades();
    },
    onError: (error) => {
      toast({ 
        title: 'Error saving grade', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const handleSaveGrade = () => {
    if (!gradeForm.subject || !gradeForm.examType || !gradeForm.marksObtained || !gradeForm.totalMarks) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please fill in all required fields', 
        variant: 'destructive' 
      });
      return;
    }

    saveGrade.mutate(gradeForm);
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setGradeForm({
      subject: grade.subject,
      examType: grade.examType,
      examDate: grade.examDate.split('T')[0],
      marksObtained: grade.marksObtained.toString(),
      totalMarks: grade.totalMarks.toString(),
      notes: grade.notes || ''
    });
    setIsDialogOpen(true);
  };

  // Calculate student's overall performance
  const calculatePerformance = () => {
    if (!grades || grades.length === 0) return null;
    
    const totalMarks = grades.reduce((sum, grade) => sum + parseFloat(grade.marksObtained), 0);
    const totalPossible = grades.reduce((sum, grade) => sum + parseFloat(grade.totalMarks), 0);
    const percentage = (totalMarks / totalPossible) * 100;
    
    return {
      totalMarks,
      totalPossible,
      percentage: percentage.toFixed(2),
      gradeCount: grades.length
    };
  };

  const performance = calculatePerformance();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grades & Progress</h1>
          <p className="text-muted-foreground">Enter and manage student exam grades and performance</p>
        </div>
      </div>

      {/* Class and Student Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card data-testid="card-class-selection">
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedClass?.id || ''} onValueChange={(value) => {
              const selected = classes?.find(c => c.id === value);
              setSelectedClass(selected);
              setSelectedStudent(null);
            }}>
              <SelectTrigger data-testid="select-grade-class">
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
          </CardContent>
        </Card>

        <Card data-testid="card-student-selection">
          <CardHeader>
            <CardTitle>Select Student</CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedStudent?.id || ''} 
              onValueChange={(value) => {
                const selected = students?.find(s => s.id === value);
                setSelectedStudent(selected);
              }}
              disabled={!selectedClass}
            >
              <SelectTrigger data-testid="select-grade-student">
                <SelectValue placeholder={selectedClass ? "Choose a student" : "Select class first"} />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} (Roll: {student.rollNo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      {selectedStudent && performance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card data-testid="card-total-exams">
            <CardContent className="p-6">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Exams</p>
                  <p className="text-2xl font-bold text-blue-600">{performance.gradeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-total-marks">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Marks</p>
                  <p className="text-2xl font-bold text-green-600">{performance.totalMarks}/{performance.totalPossible}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-percentage">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Percentage</p>
                  <p className="text-2xl font-bold text-purple-600">{performance.percentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-grade-status">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className={`h-8 w-8 ${performance.percentage >= 75 ? 'text-green-600' : performance.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Grade</p>
                  <p className={`text-2xl font-bold ${performance.percentage >= 75 ? 'text-green-600' : performance.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {performance.percentage >= 75 ? 'A' : performance.percentage >= 60 ? 'B' : 'C'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grades List */}
      {selectedStudent && (
        <Card data-testid="card-grades-list">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Exam Grades for {selectedStudent.name}</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-grade">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Grade
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingGrade ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={gradeForm.subject}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="e.g., Mathematics"
                        data-testid="input-grade-subject"
                      />
                    </div>
                    <div>
                      <Label htmlFor="examType">Exam Type</Label>
                      <Select 
                        value={gradeForm.examType} 
                        onValueChange={(value) => setGradeForm(prev => ({ ...prev, examType: value }))}
                      >
                        <SelectTrigger data-testid="select-exam-type">
                          <SelectValue placeholder="Select exam type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly Test</SelectItem>
                          <SelectItem value="monthly">Monthly Exam</SelectItem>
                          <SelectItem value="midterm">Mid-term Exam</SelectItem>
                          <SelectItem value="final">Final Exam</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="examDate">Exam Date</Label>
                    <Input
                      id="examDate"
                      type="date"
                      value={gradeForm.examDate}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, examDate: e.target.value }))}
                      data-testid="input-exam-date"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="marksObtained">Marks Obtained</Label>
                      <Input
                        id="marksObtained"
                        type="number"
                        value={gradeForm.marksObtained}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, marksObtained: e.target.value }))}
                        placeholder="85"
                        data-testid="input-marks-obtained"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalMarks">Total Marks</Label>
                      <Input
                        id="totalMarks"
                        type="number"
                        value={gradeForm.totalMarks}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, totalMarks: e.target.value }))}
                        placeholder="100"
                        data-testid="input-total-marks"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      value={gradeForm.notes}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional comments..."
                      data-testid="input-grade-notes"
                    />
                  </div>

                  <Button 
                    onClick={handleSaveGrade} 
                    disabled={saveGrade.isPending}
                    className="w-full"
                    data-testid="button-save-grade"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saveGrade.isPending ? 'Saving...' : (editingGrade ? 'Update Grade' : 'Save Grade')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {gradesLoading ? (
              <div className="text-center py-8">Loading grades...</div>
            ) : grades && grades.length > 0 ? (
              <div className="space-y-4">
                {grades.map((grade, index) => (
                  <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`grade-row-${index}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{grade.subject}</p>
                          <p className="text-sm text-muted-foreground">{grade.examType} - {new Date(grade.examDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-lg font-bold">
                          {grade.marksObtained}/{grade.totalMarks}
                          <span className="text-sm font-normal text-muted-foreground ml-2">
                            ({((grade.marksObtained / grade.totalMarks) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      {grade.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{grade.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditGrade(grade)}
                      data-testid={`button-edit-grade-${index}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No grades found. Add the first grade for this student.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedClass && (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Class to Start</h3>
            <p className="text-muted-foreground">Choose a class from above to view and manage student grades</p>
          </CardContent>
        </Card>
      )}

      {selectedClass && !selectedStudent && (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Student</h3>
            <p className="text-muted-foreground">Choose a student to view and manage their grades</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}