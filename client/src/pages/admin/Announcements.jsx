import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '../../lib/api';
import { Megaphone, Plus, Edit, Send, Users, Calendar, Trash2 } from 'lucide-react';

export default function Announcements() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    targetAudience: 'all',
    isActive: true
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['/api/announcements'],
    queryFn: () => apiClient.get('/announcements'),
  });

  const createAnnouncement = useMutation({
    mutationFn: (data) => apiClient.post('/announcements', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Announcement created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error creating announcement', description: error.message, variant: 'destructive' });
    },
  });

  const updateAnnouncement = useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(`/announcements/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Announcement updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error updating announcement', description: error.message, variant: 'destructive' });
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: (id) => apiClient.delete(`/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: 'Announcement deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting announcement', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      targetAudience: 'all',
      isActive: true
    });
    setIsEditing(false);
    setSelectedAnnouncement(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (announcement) => {
    setIsEditing(true);
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title || '',
      content: announcement.content || '',
      type: announcement.type || 'general',
      targetAudience: announcement.targetAudience || 'all',
      isActive: announcement.isActive ?? true
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateAnnouncement.mutate({ id: selectedAnnouncement.id, data: formData });
    } else {
      createAnnouncement.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      deleteAnnouncement.mutate(id);
    }
  };

  const handlePublish = (announcement) => {
    updateAnnouncement.mutate({ id: announcement.id, data: { ...announcement, isActive: true } });
  };

  // Mock data for announcements with more details
  const mockAnnouncements = [
    {
      id: 1,
      title: "Mid-term Examination Schedule Released",
      content: "The mid-term examination schedule for all grades has been finalized and is now available. Please check your respective class schedules.",
      targetAudience: "all",
      priority: "high",
      createdAt: "2024-03-10T09:00:00Z",
      author: "Admin",
      status: "published"
    },
    {
      id: 2,
      title: "Parent-Teacher Conference",
      content: "Annual parent-teacher conferences will be held from March 15-17. Please schedule your appointments through the parent portal.",
      targetAudience: "parents",
      priority: "medium",
      createdAt: "2024-03-08T14:30:00Z",
      author: "Admin",
      status: "published"
    },
    {
      id: 3,
      title: "Science Fair 2024",
      content: "Students are invited to participate in the annual science fair. Submission deadline is March 25th.",
      targetAudience: "students",
      priority: "medium",
      createdAt: "2024-03-05T11:15:00Z",
      author: "Admin",
      status: "draft"
    }
  ];

  const displayAnnouncements = announcements?.length > 0 ? announcements : mockAnnouncements;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground">Manage school-wide communications</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Megaphone className="w-8 h-8" />
            Announcements
          </h1>
          <p className="text-muted-foreground">Manage school-wide communications and notices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-send-notification">
            <Send className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
          <Button onClick={handleCreate} data-testid="button-create-announcement">
            <Plus className="w-4 h-4 mr-2" />
            Create Announcement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <Card data-testid="card-announcement-stats">
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Total Announcements:</span>
                <span className="font-bold">{displayAnnouncements.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Published:</span>
                <span className="font-bold text-green-600">
                  {displayAnnouncements.filter(a => a.status === 'published').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Drafts:</span>
                <span className="font-bold text-yellow-600">
                  {displayAnnouncements.filter(a => a.status === 'draft').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">High Priority:</span>
                <span className="font-bold text-red-600">
                  {displayAnnouncements.filter(a => a.priority === 'high').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <Card className="lg:col-span-3" data-testid="card-announcements-list">
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayAnnouncements.map((announcement, index) => (
                <div key={announcement.id} className="border rounded-lg p-4 space-y-3" data-testid={`announcement-${index}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <p className="text-muted-foreground mt-1">{announcement.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge variant={announcement.priority === 'high' ? 'destructive' : 'secondary'}>
                        {announcement.priority}
                      </Badge>
                      <Badge variant={announcement.status === 'published' ? 'default' : 'outline'}>
                        {announcement.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="capitalize">{announcement.targetAudience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span>By: {announcement.author}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(announcement)}
                        data-testid={`button-edit-${index}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(announcement.id)}
                        disabled={deleteAnnouncement.isPending}
                        data-testid={`button-delete-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {(!announcement.isActive || announcement.status === 'draft') && (
                        <Button 
                          size="sm" 
                          onClick={() => handlePublish(announcement)}
                          disabled={updateAnnouncement.isPending}
                          data-testid={`button-publish-${index}`}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {displayAnnouncements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No announcements found. Create your first announcement to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Announcement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Announcement title"
                data-testid="input-announcement-title"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your announcement content here..."
                rows={4}
                data-testid="textarea-announcement-content"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger data-testid="select-announcement-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}>
                  <SelectTrigger data-testid="select-announcement-audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                    <SelectItem value="teachers">Teachers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              data-testid="button-cancel-announcement"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createAnnouncement.isPending || updateAnnouncement.isPending || !formData.title || !formData.content}
              data-testid="button-save-announcement"
            >
              {createAnnouncement.isPending || updateAnnouncement.isPending ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}