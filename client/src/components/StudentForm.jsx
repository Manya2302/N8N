import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const studentSchema = z.object({
  rollNo: z.string().min(1, 'Roll number is required'),
  name: z.string().min(1, 'Student name is required'),
  studentNumber: z.string().optional(),
  parentNumber1: z.string().optional(),
  parentNumber2: z.string().optional(),
  extraInfo: z.string().optional(),
});

export default function StudentForm({ student = null, onSuccess, onCancel }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!student;

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      rollNo: student?.rollNo || '',
      name: student?.name || '',
      studentNumber: student?.studentNumber || '',
      parentNumber1: student?.parentNumber1 || '',
      parentNumber2: student?.parentNumber2 || '',
      extraInfo: student?.extraInfo ? JSON.stringify(student.extraInfo, null, 2) : '',
    },
  });

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: (data) => apiClient.post('/students', data),
    onSuccess: () => {
      toast({
        title: "Student Added",
        description: "Student has been successfully added to the system.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Student",
        description: error.message || "Please check the information and try again.",
        variant: "destructive",
      });
    },
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: (data) => apiClient.patch(`/students/${student.id}`, data),
    onSuccess: () => {
      toast({
        title: "Student Updated",
        description: "Student information has been successfully updated.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Student",
        description: error.message || "Please check the information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Parse extraInfo if provided
      let extraInfo = null;
      if (data.extraInfo && data.extraInfo.trim()) {
        try {
          extraInfo = JSON.parse(data.extraInfo);
        } catch (e) {
          // If JSON parsing fails, store as simple object
          extraInfo = { notes: data.extraInfo };
        }
      }

      const submitData = {
        ...data,
        extraInfo,
        // Remove empty strings
        studentNumber: data.studentNumber || null,
        parentNumber1: data.parentNumber1 || null,
        parentNumber2: data.parentNumber2 || null,
      };

      if (isEditing) {
        updateStudentMutation.mutate(submitData);
      } else {
        createStudentMutation.mutate(submitData);
      }
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Please check the form data and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPending = createStudentMutation.isPending || updateStudentMutation.isPending || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="student-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rollNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2024001" {...field} data-testid="input-roll-no" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} data-testid="input-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="studentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., +1234567890" {...field} data-testid="input-student-number" />
                </FormControl>
                <FormDescription>Optional student contact number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentNumber1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Contact 1</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., +1234567890" {...field} data-testid="input-parent-number1" />
                </FormControl>
                <FormDescription>Primary parent/guardian contact</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentNumber2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Contact 2</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., +1234567890" {...field} data-testid="input-parent-number2" />
                </FormControl>
                <FormDescription>Secondary parent/guardian contact</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="extraInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes, medical information, or JSON data..."
                  className="min-h-[100px]"
                  {...field}
                  data-testid="input-extra-info"
                />
              </FormControl>
              <FormDescription>
                Optional field for additional notes, medical information, or structured data (JSON format supported)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            data-testid="button-submit"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending 
              ? (isEditing ? 'Updating...' : 'Adding...') 
              : (isEditing ? 'Update Student' : 'Add Student')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
