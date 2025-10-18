import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Calendar, Award, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { format } from 'date-fns';

export default function Assignments() {
  const { user } = useAuth();
  const { isTeacher } = useUserRole();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*, courses(title)');
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Assignments</h1>
          <p className="text-muted-foreground text-lg">
            {isTeacher ? 'Manage course assignments' : 'View and submit your assignments'}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading assignments...</p>
          </div>
        ) : assignments && assignments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assignments.map((assignment) => {
              const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
              const isOverdue = dueDate && dueDate < new Date();
              
              return (
                <Card key={assignment.id} className="shadow-elegant border-0 hover:shadow-primary transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {assignment.title}
                      </CardTitle>
                      {isOverdue ? (
                        <Badge variant="destructive">Overdue</Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">{assignment.courses?.title}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{assignment.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                      {dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {format(dueDate, 'MMM dd, yyyy')}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {assignment.max_points} points
                      </div>
                    </div>

                    <Button className="w-full gradient-primary">
                      {isTeacher ? 'View Submissions' : 'Submit Assignment'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ClipboardList className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">No assignments available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}