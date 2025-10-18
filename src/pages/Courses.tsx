import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, BookOpen, Clock, Users, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Courses() {
  const { user } = useAuth();
  const { isTeacher } = useUserRole();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      if (error) throw error;
      
      // Fetch teacher profiles
      const teacherIds = [...new Set(data.map(c => c.teacher_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', teacherIds);
      
      // Merge profiles with courses
      return data.map(course => ({
        ...course,
        teacher_name: profiles?.find(p => p.id === course.teacher_id)?.full_name || 'Unknown'
      }));
    },
  });

  const { data: enrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', user!.id);
      if (error) throw error;
      return data.map(e => e.course_id);
    },
    enabled: !!user && !isTeacher,
  });

  const createCourseMutation = useMutation({
    mutationFn: async (newCourse: { title: string; description: string; duration: string }) => {
      const { data, error } = await supabase
        .from('courses')
        .insert([{ ...newCourse, teacher_id: user!.id }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully!');
      setOpen(false);
      setTitle('');
      setDescription('');
      setDuration('');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('enrollments')
        .insert([{ student_id: user!.id, course_id: courseId }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      toast.success('Enrolled successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate({ title, description, duration });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">Courses</h1>
            <p className="text-muted-foreground text-lg">
              {isTeacher ? 'Manage your courses' : 'Explore and enroll in courses'}
            </p>
          </div>
          
          {isTeacher && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary gap-2">
                  <Plus className="h-4 w-4" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>Add a new course to your teaching portfolio</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Introduction to Web Development"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Learn the fundamentals of web development..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="8 weeks"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gradient-primary" disabled={createCourseMutation.isPending}>
                    {createCourseMutation.isPending ? 'Creating...' : 'Create Course'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isEnrolled = enrollments?.includes(course.id);
              const isOwnCourse = course.teacher_id === user?.id;
              
              return (
                <Card key={course.id} className="shadow-elegant border-0 hover:shadow-primary transition-all overflow-hidden">
                  <div className="h-48 gradient-primary flex items-center justify-center">
                    <BookOpen className="h-20 w-20 text-white opacity-50" />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                      {isEnrolled && <Badge variant="secondary">Enrolled</Badge>}
                      {isOwnCourse && <Badge className="gradient-primary text-white">Your Course</Badge>}
                    </div>
                    <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <UserCheck className="h-4 w-4" />
                        {course.teacher_name}
                      </div>
                    </div>
                    {!isTeacher && !isEnrolled && (
                      <Button 
                        onClick={() => enrollMutation.mutate(course.id)} 
                        className="w-full gradient-secondary"
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                      </Button>
                    )}
                    {isEnrolled && (
                      <Button variant="outline" className="w-full">
                        View Course
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg mb-4">No courses available yet</p>
            {isTeacher && (
              <Button onClick={() => setOpen(true)} className="gradient-primary">
                Create Your First Course
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}