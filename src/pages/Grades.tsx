import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, BookOpen } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function Grades() {
  const mockGrades = [
    { course: 'Web Development', assignment: 'HTML Basics', points: 95, maxPoints: 100, date: '2024-01-15' },
    { course: 'Web Development', assignment: 'CSS Styling', points: 88, maxPoints: 100, date: '2024-01-20' },
    { course: 'Data Structures', assignment: 'Arrays & Lists', points: 92, maxPoints: 100, date: '2024-01-18' },
    { course: 'Database Design', assignment: 'ER Diagrams', points: 85, maxPoints: 100, date: '2024-01-22' },
  ];

  const averageGrade = Math.round(
    mockGrades.reduce((acc, g) => acc + (g.points / g.maxPoints) * 100, 0) / mockGrades.length
  );

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-500">A</Badge>;
    if (percentage >= 80) return <Badge className="bg-blue-500">B</Badge>;
    if (percentage >= 70) return <Badge className="bg-yellow-500">C</Badge>;
    return <Badge variant="destructive">D</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Grades</h1>
          <p className="text-muted-foreground text-lg">Track your academic performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-elegant border-0 hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Average
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageGrade}%</div>
              <p className="text-sm text-muted-foreground mt-1">Grade: A-</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 hover:shadow-secondary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Assignments Graded
              </CardTitle>
              <Award className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockGrades.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Out of 15 total</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 hover:shadow-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Courses
              </CardTitle>
              <BookOpen className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-sm text-muted-foreground mt-1">Active courses</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle>Grade History</CardTitle>
            <CardDescription>Your recent assignment grades</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockGrades.map((grade, index) => {
                  const percentage = Math.round((grade.points / grade.maxPoints) * 100);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{grade.course}</TableCell>
                      <TableCell>{grade.assignment}</TableCell>
                      <TableCell>
                        {grade.points}/{grade.maxPoints} ({percentage}%)
                      </TableCell>
                      <TableCell>{getGradeBadge(percentage)}</TableCell>
                      <TableCell>{grade.date}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}