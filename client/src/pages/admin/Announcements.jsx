import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '../../lib/api';
import { Megaphone, Plus, Edit, Send, Users, Calendar } from 'lucide-react';

export default function Announcements() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['/api/announcements'],
    queryFn: () => apiClient.get('/announcements'),
  });

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
          <Button data-testid="button-create-announcement">
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
                      <Button variant="outline" size="sm" data-testid={`button-edit-${index}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {announcement.status === 'draft' && (
                        <Button size="sm" data-testid={`button-publish-${index}`}>
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
    </div>
  );
}