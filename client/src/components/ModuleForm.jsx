import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const moduleSchema = z.object({
  moduleName: z.string().min(1, 'Module name is required'),
  status: z.string().min(1, 'Status is required'),
  notes: z.string().optional(),
});

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'completed', label: 'Completed' },
  { value: 'draft', label: 'Draft' },
];

export default function ModuleForm({ module = null, onSuccess, onCancel }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!module;

  const form = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      moduleName: module?.moduleName || '',
      status: module?.status || 'active',
      notes: module?.notes || '',
    },
  });

  // Create module mutation
  const createModuleMutation = useMutation({
    mutationFn: (data) => apiClient.post('/modules', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/modules']);
      toast({
        title: "Module Created",
        description: "Module has been successfully created.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Module",
        description: error.message || "Please check the information and try again.",
        variant: "destructive",
      });
    },
  });

  // Update module mutation
  const updateModuleMutation = useMutation({
    mutationFn: (data) => apiClient.patch(`/modules/${module.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/modules']);
      toast({
        title: "Module Updated",
        description: "Module information has been successfully updated.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Module",
        description: error.message || "Please check the information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...data,
        notes: data.notes || null,
      };

      if (isEditing) {
        updateModuleMutation.mutate(submitData);
      } else {
        createModuleMutation.mutate(submitData);
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

  const isPending = createModuleMutation.isPending || updateModuleMutation.isPending || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="module-form">
        <FormField
          control={form.control}
          name="moduleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Name *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Mathematics - Advanced Calculus" 
                  {...field} 
                  data-testid="input-module-name"
                />
              </FormControl>
              <FormDescription>
                Enter a descriptive name for this module or subject
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-module-status">
                    <SelectValue placeholder="Select module status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Current status of this module
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this module, curriculum details, requirements, etc."
                  className="min-h-[120px]"
                  {...field}
                  data-testid="input-module-notes"
                />
              </FormControl>
              <FormDescription>
                Optional field for module description, curriculum details, prerequisites, or any other relevant information
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
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Module' : 'Create Module')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
