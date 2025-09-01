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
  MessageSquare, 
  Send, 
  Phone, 
  Clock, 
  User, 
  Users, 
  Search,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Communication() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageForm, setMessageForm] = useState({
    message: '',
    type: 'message',
    parentPhone: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  // Fetch communication history
  const { data: communications, isLoading: communicationsLoading, refetch: refetchCommunications } = useQuery({
    queryKey: ['/api/communications'],
    queryFn: () => apiClient.get('/communications'),
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (messageData) => {
      return apiClient.post('/communications', messageData);
    },
    onSuccess: (response) => {
      toast({ title: response.message || 'Message sent successfully' });
      setIsDialogOpen(false);
      setMessageForm({
        message: '',
        type: 'message',
        parentPhone: ''
      });
      setSelectedStudent(null);
      refetchCommunications();
    },
    onError: (error) => {
      toast({ 
        title: 'Error sending message', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const handleSendMessage = () => {
    if (!selectedStudent || !messageForm.message.trim()) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please select a student and enter a message', 
        variant: 'destructive' 
      });
      return;
    }

    const parentPhone = messageForm.parentPhone || selectedStudent.parentNumber1;
    if (!parentPhone) {
      toast({ 
        title: 'Validation Error', 
        description: 'Parent phone number is required', 
        variant: 'destructive' 
      });
      return;
    }

    sendMessage.mutate({
      studentId: selectedStudent.id,
      parentPhone: parentPhone,
      message: messageForm.message,
      type: messageForm.type
    });
  };

  const openMessageDialog = (student) => {
    setSelectedStudent(student);
    setMessageForm({
      message: '',
      type: 'message',
      parentPhone: student.parentNumber1 || ''
    });
    setIsDialogOpen(true);
  };

  // Filter communications based on search term
  const filteredCommunications = communications?.filter(comm => 
    comm.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.message?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'read': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'meeting_request': return <Calendar className="w-4 h-4" />;
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Communication</h1>
          <p className="text-muted-foreground">Send messages and updates to parents</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-messages">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-blue-600">{communications?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-sent-today">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Sent Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {communications?.filter(c => 
                    new Date(c.createdAt).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-delivered">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-purple-600">
                  {communications?.filter(c => c.status === 'delivered').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-pending">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {communications?.filter(c => c.status === 'sent').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Selection */}
        <Card data-testid="card-student-selection">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Send Message to Parent
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
                <SelectTrigger data-testid="select-communication-class">
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
                <Label className="text-sm font-medium">Select Student</Label>
                {studentsLoading ? (
                  <div className="text-center py-4">Loading students...</div>
                ) : students && students.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {students.map((student) => (
                      <div 
                        key={student.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                        data-testid={`student-communication-${student.id}`}
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
                          onClick={() => openMessageDialog(student)}
                          disabled={!student.parentNumber1}
                          data-testid={`button-message-${student.id}`}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
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

        {/* Communication History */}
        <Card data-testid="card-communication-history">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Communication History
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
                data-testid="input-search-communications"
              />
            </div>
          </CardHeader>
          <CardContent>
            {communicationsLoading ? (
              <div className="text-center py-8">Loading communications...</div>
            ) : filteredCommunications && filteredCommunications.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredCommunications.map((comm, index) => (
                  <div key={comm.id} className="border rounded-lg p-4" data-testid={`communication-${index}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(comm.type)}
                        <span className="font-medium">{comm.studentName}</span>
                        <Badge className={getStatusColor(comm.status)}>
                          {comm.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      To: {comm.parentPhone}
                    </div>
                    <div className="text-sm">
                      {comm.message}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No communications found matching your search' : 'No communications sent yet'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to Parent</DialogTitle>
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
              <Label htmlFor="parentPhone">Parent Phone Number</Label>
              <Input
                id="parentPhone"
                value={messageForm.parentPhone}
                onChange={(e) => setMessageForm(prev => ({ ...prev, parentPhone: e.target.value }))}
                placeholder="Enter parent phone number"
                data-testid="input-parent-phone"
              />
            </div>

            <div>
              <Label htmlFor="messageType">Message Type</Label>
              <Select 
                value={messageForm.type} 
                onValueChange={(value) => setMessageForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger data-testid="select-message-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">General Message</SelectItem>
                  <SelectItem value="urgent">Urgent Notice</SelectItem>
                  <SelectItem value="meeting_request">Meeting Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={messageForm.message}
                onChange={(e) => setMessageForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Type your message here..."
                rows={4}
                data-testid="textarea-message"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {messageForm.message.length}/500 characters
              </div>
            </div>

            <Button 
              onClick={handleSendMessage} 
              disabled={sendMessage.isPending || !messageForm.message.trim()}
              className="w-full"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4 mr-2" />
              {sendMessage.isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}