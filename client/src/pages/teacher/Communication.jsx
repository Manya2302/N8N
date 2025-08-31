import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Phone, Mail, Clock, Search, Plus, Filter } from 'lucide-react';

export default function Communication() {
  const [messageType, setMessageType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedParent, setSelectedParent] = useState('');

  // Mock data
  const messages = [
    {
      id: 1,
      parent: 'Mrs. Smith',
      student: 'John Smith',
      subject: 'Math Assignment Query',
      message: 'Hi, John is having trouble with the algebra homework. Could you please provide some additional guidance?',
      time: '2 hours ago',
      type: 'received',
      urgent: false,
      read: false
    },
    {
      id: 2,
      parent: 'Mr. Johnson',
      student: 'Emma Johnson',
      subject: 'Parent-Teacher Meeting',
      message: 'I would like to schedule a meeting to discuss Emma\'s progress in Physics.',
      time: '4 hours ago',
      type: 'received',
      urgent: false,
      read: true
    },
    {
      id: 3,
      parent: 'Mrs. Brown',
      student: 'Michael Brown',
      subject: 'Absence Notification',
      message: 'Michael will be absent tomorrow due to a doctor\'s appointment.',
      time: '1 day ago',
      type: 'received',
      urgent: true,
      read: true
    },
    {
      id: 4,
      parent: 'Mr. Davis',
      student: 'Sarah Davis',
      subject: 'Chemistry Lab Performance',
      message: 'Thank you for the update on Sarah\'s excellent performance in the chemistry lab. We appreciate your guidance.',
      time: '2 days ago',
      type: 'sent',
      urgent: false,
      read: true
    }
  ];

  const parents = [
    { id: 1, name: 'Mrs. Smith', student: 'John Smith', phone: '+1 234-567-8901', email: 'smith@email.com' },
    { id: 2, name: 'Mr. Johnson', student: 'Emma Johnson', phone: '+1 234-567-8902', email: 'johnson@email.com' },
    { id: 3, name: 'Mrs. Brown', student: 'Michael Brown', phone: '+1 234-567-8903', email: 'brown@email.com' },
    { id: 4, name: 'Mr. Davis', student: 'Sarah Davis', phone: '+1 234-567-8904', email: 'davis@email.com' }
  ];

  const quickMessages = [
    'Great progress in class today!',
    'Please ensure homework is completed on time.',
    'Your child showed excellent participation today.',
    'Would like to schedule a parent-teacher meeting.',
    'Assignment due date has been extended.',
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.parent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = messageType === 'all' || message.type === messageType;
    return matchesSearch && matchesType;
  });

  const unreadCount = messages.filter(msg => !msg.read && msg.type === 'received').length;
  const urgentCount = messages.filter(msg => msg.urgent && !msg.read).length;

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedParent) {
      console.log('Sending message:', { to: selectedParent, message: newMessage });
      setNewMessage('');
      setSelectedParent('');
    }
  };

  const handleQuickMessage = (template) => {
    setNewMessage(template);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Communication</h1>
          <p className="text-muted-foreground">Manage communication with parents and guardians</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Message
        </Button>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{parents.length}</p>
                <p className="text-sm text-muted-foreground">Parent Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={messageType} onValueChange={setMessageType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Messages</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors ${
                      !message.read && message.type === 'received' ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                          {message.parent.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{message.parent}</p>
                          <p className="text-xs text-muted-foreground">{message.student}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {message.urgent && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                        <Badge variant={message.type === 'sent' ? 'default' : 'secondary'} className="text-xs">
                          {message.type === 'sent' ? 'Sent' : 'Received'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                    </div>
                    <h4 className="font-medium text-sm mb-2">{message.subject}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="outline" size="sm">Reply</Button>
                      <Button variant="ghost" size="sm">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compose Message */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  {parents.map(parent => (
                    <SelectItem key={parent.id} value={parent.name}>
                      {parent.name} ({parent.student})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
              />
              <Button onClick={handleSendMessage} className="w-full flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Quick Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickMessages.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-3 text-xs"
                    onClick={() => handleQuickMessage(template)}
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Parent Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Parent Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parents.slice(0, 4).map(parent => (
                  <div key={parent.id} className="flex items-center justify-between p-2 border border-border rounded">
                    <div>
                      <p className="text-sm font-medium">{parent.name}</p>
                      <p className="text-xs text-muted-foreground">{parent.student}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}