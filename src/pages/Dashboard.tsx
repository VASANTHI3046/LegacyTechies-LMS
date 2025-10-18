import { useAuth } from '@/lib/auth';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ClipboardList, Award, Users, TrendingUp, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const { isTeacher } = useUserRole();

  const { data: enrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('student_id', user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user && !isTeacher,
  });

  const { data: myCourses } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user && isTeacher,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">
            Welcome back, {profile?.full_name || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            {isTeacher ? 'Manage your courses and students' : 'Continue your learning journey'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-elegant border-0 hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isTeacher ? 'Total Courses' : 'Enrolled Courses'}
              </CardTitle>
              <BookOpen className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isTeacher ? myCourses?.length || 0 : enrollments?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 hover:shadow-secondary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Assignments
              </CardTitle>
              <ClipboardList className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Grade
              </CardTitle>
              <Award className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">85%</div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 hover:shadow-secondary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isTeacher ? 'Total Students' : 'Study Hours'}
              </CardTitle>
              {isTeacher ? <Users className="h-5 w-5 text-primary" /> : <Clock className="h-5 w-5 text-secondary" />}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isTeacher ? '156' : '42h'}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Completed Module {i}</p>
                      <p className="text-sm text-muted-foreground">Web Development Course</p>
                    </div>
                    <div className="text-sm text-muted-foreground">2h ago</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle>
                {isTeacher ? 'Your Courses' : 'Enrolled Courses'}
              </CardTitle>
              <CardDescription>
                {isTeacher ? 'Manage your teaching materials' : 'Continue where you left off'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isTeacher ? (
                  myCourses && myCourses.length > 0 ? (
                    myCourses.slice(0, 3).map((course) => (
                      <Link key={course.id} to={`/courses/${course.id}`}>
                        <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {course.description}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No courses yet</p>
                      <Link to="/courses">
                        <Button className="gradient-primary">Create Your First Course</Button>
                      </Link>
                    </div>
                  )
                ) : (
                  enrollments && enrollments.length > 0 ? (
                    enrollments.slice(0, 3).map((enrollment) => (
                      <Link key={enrollment.id} to={`/courses/${enrollment.courses.id}`}>
                        <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <h3 className="font-semibold">{enrollment.courses.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {enrollment.courses.description}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No enrollments yet</p>
                      <Link to="/courses">
                        <Button className="gradient-primary">Browse Courses</Button>
                      </Link>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}