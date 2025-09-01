import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '../../lib/api';
import { CheckCircle, X, Clock, TrendingUp, Users, AlertCircle, Save } from 'lucide-react';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch teacher's classes
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['/api/classes'],
    queryFn: () => apiClient.get('/classes'),
  });

  // Fetch attendance for selected class and date
  const { data: attendanceRecords, isLoading: attendanceLoading, refetch: refetchAttendance } = useQuery({
    queryKey: ['/api/attendance', selectedClass?.id, selectedDate.toISOString().split('T')[0]],
    queryFn: () => apiClient.get(`/attendance/${selectedClass.id}?date=${selectedDate.toISOString().split('T')[0]}`),
    enabled: !!selectedClass?.id,
  });

  // Initialize attendance data when records are loaded
  useEffect(() => {
    if (attendanceRecords) {
      const newAttendanceData = {};
      attendanceRecords.forEach(record => {
        newAttendanceData[record.studentId] = record.status || 'present';
      });
      setAttendanceData(newAttendanceData);
    }
  }, [attendanceRecords]);

  // Save attendance mutation
  const saveAttendance = useMutation({
    mutationFn: async (attendanceList) => {
      const promises = attendanceList.map(attendance => {
        const existingRecord = attendanceRecords?.find(r => r.studentId === attendance.studentId);
        if (existingRecord && existingRecord.id) {
          return apiClient.patch(`/attendance/${existingRecord.id}`, { status: attendance.status });
        } else {
          return apiClient.post('/attendance', attendance);
        }
      });
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast({ title: 'Attendance saved successfully' });
      refetchAttendance();
    },
    onError: (error) => {
      toast({ title: 'Error saving attendance', description: error.message, variant: 'destructive' });
    },
  });

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    if (!selectedClass || !attendanceRecords) return;
    
    const attendanceList = attendanceRecords.map(record => ({
      studentId: record.studentId,
      date: selectedDate.toISOString(),
      status: attendanceData[record.studentId] || 'present'
    }));
    
    saveAttendance.mutate(attendanceList);
  };

  // Calculate stats
  const attendanceStats = {
    present: Object.values(attendanceData).filter(status => status === 'present').length,
    absent: Object.values(attendanceData).filter(status => status === 'absent').length,
    late: Object.values(attendanceData).filter(status => status === 'late').length,
    total: attendanceRecords?.length || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage student attendance for your classes</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card data-testid="card-present-count">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-absent-count">
          <CardContent className="p-6">
            <div className="flex items-center">
              <X className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-late-count">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-total-count">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{attendanceStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Selection and Calendar */}
        <Card data-testid="card-attendance-calendar">
          <CardHeader>
            <CardTitle>Select Class & Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Class</label>
              <Select value={selectedClass?.id || ''} onValueChange={(value) => {
                const selected = classes?.find(c => c.id === value);
                setSelectedClass(selected);
              }}>
                <SelectTrigger data-testid="select-class">
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
            <Input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full"
              data-testid="input-attendance-date"
            />
          </CardContent>
        </Card>

        {/* Student Attendance List */}
        <Card className="lg:col-span-2" data-testid="card-attendance-list">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mark Attendance - {selectedDate.toDateString()}</CardTitle>
            {selectedClass && (
              <Button 
                onClick={handleSaveAttendance} 
                disabled={saveAttendance.isPending || !attendanceRecords?.length}
                data-testid="button-save-attendance"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveAttendance.isPending ? 'Saving...' : 'Save Attendance'}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!selectedClass ? (
              <div className="text-center py-8 text-muted-foreground">
                Please select a class to mark attendance
              </div>
            ) : attendanceLoading ? (
              <div className="text-center py-8">Loading students...</div>
            ) : (
              <div className="space-y-4">
                {/* Excel-like Header */}
                <div className="grid grid-cols-5 gap-4 p-3 bg-muted rounded-lg font-medium text-sm">
                  <div>Student</div>
                  <div>Roll No</div>
                  <div>Present</div>
                  <div>Absent</div>
                  <div>Late</div>
                </div>
                
                {/* Student Rows */}
                {attendanceRecords?.map((record, index) => (
                  <div key={record.studentId} className="grid grid-cols-5 gap-4 p-3 border rounded-lg items-center" data-testid={`attendance-row-${index}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs">
                        <span className="text-white font-medium">
                          {record.studentName?.substring(0, 2).toUpperCase() || 'UN'}
                        </span>
                      </div>
                      <span className="font-medium">{record.studentName}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{record.rollNo}</div>
                    <div>
                      <Button
                        variant={attendanceData[record.studentId] === 'present' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(record.studentId, 'present')}
                        data-testid={`button-present-${index}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant={attendanceData[record.studentId] === 'absent' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(record.studentId, 'absent')}
                        data-testid={`button-absent-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant={attendanceData[record.studentId] === 'late' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(record.studentId, 'late')}
                        data-testid={`button-late-${index}`}
                      >
                        <Clock className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {(!attendanceRecords || attendanceRecords.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No students found for this class. Please add students to the class first.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}