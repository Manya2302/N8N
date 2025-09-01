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
  Calendar, 
  Users, 
  Clock, 
  Plus, 
  Edit, 
  CheckCircle, 
  XCircle,
  User,
  CalendarDays,
  Search,
  Video,
  MapPin
} from 'lucide-react';

export default function Meetings() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    meetingType: 'parent_teacher',
    status: 'scheduled'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Fetch meetings
  const { data: meetings, isLoading: meetingsLoading, refetch: refetchMeetings } = useQuery({
    queryKey: ['/api/meetings'],
    queryFn: () => apiClient.get('/meetings'),
  });

  // Save meeting mutation
  const saveMeeting = useMutation({
    mutationFn: async (meetingData) => {
      if (editingMeeting) {
        return apiClient.patch(`/meetings/${editingMeeting.id}`, meetingData);
      } else {
        return apiClient.post('/meetings', meetingData);
      }
    },
    onSuccess: (response) => {
      toast({ title: response.message || (editingMeeting ? 'Meeting updated successfully' : 'Meeting arranged successfully') });
      setIsDialogOpen(false);
      setEditingMeeting(null);
      setMeetingForm({
        title: '',
        description: '',
        scheduledAt: '',
        meetingType: 'parent_teacher',
        status: 'scheduled'
      });
      setSelectedStudent(null);
      refetchMeetings();
    },
    onError: (error) => {
      toast({ 
        title: 'Error saving meeting', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const handleSaveMeeting = () => {
    if (!selectedStudent || !meetingForm.title.trim() || !meetingForm.scheduledAt) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please fill in all required fields', 
        variant: 'destructive' 
      });
      return;
    }

    saveMeeting.mutate({
      ...meetingForm,
      studentId: selectedStudent.id
    });
  };

  const handleEditMeeting = (meeting) => {
    setEditingMeeting(meeting);
    setMeetingForm({
      title: meeting.title,
      description: meeting.description || '',
      scheduledAt: new Date(meeting.scheduledAt).toISOString().slice(0, 16),
      meetingType: meeting.meetingType,
      status: meeting.status
    });
    
    // Find the student for this meeting
    const student = students?.find(s => s.id === meeting.studentId);
    setSelectedStudent(student);
    
    setIsDialogOpen(true);
  };

  const openMeetingDialog = (student) => {
    setSelectedStudent(student);
    setMeetingForm({
      title: `Parent-Teacher Meeting for ${student.name}`,
      description: '',
      scheduledAt: '',
      meetingType: 'parent_teacher',
      status: 'scheduled'
    });
    setIsDialogOpen(true);
  };

  // Filter meetings based on search term
  const filteredMeetings = meetings?.filter(meeting => 
    meeting.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'parent_teacher': return <Users className="w-4 h-4" />;
      case 'student_conference': return <User className="w-4 h-4" />;
      case 'online': return <Video className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  // Calculate upcoming meetings
  const upcomingMeetings = meetings?.filter(meeting => 
    new Date(meeting.scheduledAt) > new Date() && meeting.status === 'scheduled'
  ) || [];

  const todayMeetings = meetings?.filter(meeting => 
    new Date(meeting.scheduledAt).toDateString() === new Date().toDateString()
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meeting Management</h1>
          <p className="text-muted-foreground">Arrange and manage parent-teacher meetings</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-meetings">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Meetings</p>
                <p className="text-2xl font-bold text-blue-600">{meetings?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-upcoming-meetings">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarDays className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-green-600">{upcomingMeetings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-today-meetings">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-purple-600">{todayMeetings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-completed-meetings">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {meetings?.filter(m => m.status === 'completed').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Selection for New Meeting */}
        <Card data-testid="card-arrange-meeting">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Arrange New Meeting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Class Selection */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Class</Label>
              <Select value={selectedClass?.id || ''} onValueChange={(value) => {
                const selected = classes?.find(c => c.id === value);
                setSelectedClass(selected);
              }}>
                <SelectTrigger data-testid="select-meeting-class">
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

            {/* Student List */}
            {selectedClass && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Student for Meeting</Label>
                {studentsLoading ? (
                  <div className="text-center py-4">Loading students...</div>
                ) : students && students.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {students.map((student) => (
                      <div 
                        key={student.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                        data-testid={`student-meeting-${student.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs">
                            <span className="text-white font-medium">
                              {student.name?.substring(0, 2).toUpperCase() || 'UN'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Roll: {student.rollNo}
                              {student.parentNumber1 && (
                                <span className="ml-2">📞 {student.parentNumber1}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => openMeetingDialog(student)}
                          data-testid={`button-arrange-meeting-${student.id}`}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Arrange
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No students found in this class
                  </div>
                )}
              </div>
            )}

            {!selectedClass && (
              <div className="text-center py-8 text-muted-foreground">
                Select a class to view students
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meetings List */}
        <Card data-testid="card-meetings-list">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Scheduled Meetings
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
                data-testid="input-search-meetings"
              />
            </div>
          </CardHeader>
          <CardContent>
            {meetingsLoading ? (
              <div className="text-center py-8">Loading meetings...</div>
            ) : filteredMeetings && filteredMeetings.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredMeetings.map((meeting, index) => (
                  <div key={meeting.id} className="border rounded-lg p-4" data-testid={`meeting-${index}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(meeting.meetingType)}
                        <span className="font-medium">{meeting.title}</span>
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMeeting(meeting)}
                        data-testid={`button-edit-meeting-${index}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Student: {meeting.studentName}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      📅 {new Date(meeting.scheduledAt).toLocaleString()}
                    </div>
                    {meeting.description && (
                      <div className="text-sm">
                        {meeting.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No meetings found matching your search' : 'No meetings scheduled yet'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meeting Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMeeting ? 'Edit Meeting' : 'Arrange New Meeting'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStudent && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-medium">
                    {selectedStudent.name?.substring(0, 2).toUpperCase() || 'UN'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">Roll: {selectedStudent.rollNo}</p>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="meetingTitle">Meeting Title *</Label>
              <Input
                id="meetingTitle"
                value={meetingForm.title}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter meeting title"
                data-testid="input-meeting-title"
              />
            </div>

            <div>
              <Label htmlFor="meetingType">Meeting Type</Label>
              <Select 
                value={meetingForm.meetingType} 
                onValueChange={(value) => setMeetingForm(prev => ({ ...prev, meetingType: value }))}
              >
                <SelectTrigger data-testid="select-meeting-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent_teacher">Parent-Teacher Meeting</SelectItem>
                  <SelectItem value="student_conference">Student Conference</SelectItem>
                  <SelectItem value="online">Online Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scheduledAt">Date & Time *</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={meetingForm.scheduledAt}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
                data-testid="input-meeting-datetime"
              />
            </div>

            {editingMeeting && (
              <div>
                <Label htmlFor="meetingStatus">Status</Label>
                <Select 
                  value={meetingForm.status} 
                  onValueChange={(value) => setMeetingForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger data-testid="select-meeting-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="meetingDescription">Description</Label>
              <Textarea
                id="meetingDescription"
                value={meetingForm.description}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Meeting agenda or additional notes..."
                rows={3}
                data-testid="textarea-meeting-description"
              />
            </div>

            <Button 
              onClick={handleSaveMeeting} 
              disabled={saveMeeting.isPending || !meetingForm.title.trim() || !meetingForm.scheduledAt}
              className="w-full"
              data-testid="button-save-meeting"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {saveMeeting.isPending ? 'Saving...' : (editingMeeting ? 'Update Meeting' : 'Arrange Meeting')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}