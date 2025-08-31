import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '../../lib/api';
import { GraduationCap, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

export default function TeacherManagement() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const queryClient = useQueryClient();

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['/api/teachers'],
    queryFn: () => apiClient.get('/teachers'),
  });

  const activateTeacher = useMutation({
    mutationFn: (teacherId) => apiClient.patch(`/teachers/${teacherId}/activate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
    },
  });

  const deactivateTeacher = useMutation({
    mutationFn: (teacherId) => apiClient.patch(`/teachers/${teacherId}/deactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teacher Management</h1>
            <p className="text-muted-foreground">Manage teacher accounts and permissions</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg"></div>
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
            <GraduationCap className="w-8 h-8" />
            Teacher Management
          </h1>
          <p className="text-muted-foreground">Manage teacher accounts and permissions</p>
        </div>
        <Button data-testid="button-add-teacher">
          <Plus className="w-4 h-4 mr-2" />
          Add New Teacher
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher Stats */}
        <Card data-testid="card-teacher-stats">
          <CardHeader>
            <CardTitle>Teacher Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Teachers:</span>
                <span className="font-bold">{teachers?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Teachers:</span>
                <span className="font-bold text-green-600">
                  {teachers?.filter(t => t.isActive).length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Inactive Teachers:</span>
                <span className="font-bold text-red-600">
                  {teachers?.filter(t => !t.isActive).length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher List */}
        <Card className="lg:col-span-2" data-testid="card-teacher-list">
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teachers?.map((teacher, index) => (
                <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`teacher-${index}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white font-medium">
                        {teacher.email.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{teacher.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined: {new Date(teacher.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={teacher.isActive ? 'default' : 'destructive'}>
                      {teacher.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {teacher.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deactivateTeacher.mutate(teacher.id)}
                        disabled={deactivateTeacher.isPending}
                        data-testid={`button-deactivate-${index}`}
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => activateTeacher.mutate(teacher.id)}
                        disabled={activateTeacher.isPending}
                        data-testid={`button-activate-${index}`}
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" data-testid={`button-edit-${index}`}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!teachers || teachers.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No teachers found. Add your first teacher to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}