import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, FileText, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    students: 0,
    submissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [courses, assignments, enrollments, submissions] = await Promise.all([
        supabase.from("courses").select("*").eq("teacher_id", user.id),
        supabase.from("assignments").select("*, course:courses!inner(teacher_id)").eq("course.teacher_id", user.id),
        supabase.from("enrollments").select("*, course:courses!inner(teacher_id)").eq("course.teacher_id", user.id),
        supabase.from("submissions").select("*, assignment:assignments!inner(*, course:courses!inner(teacher_id))").eq("assignment.course.teacher_id", user.id),
      ]);

      setStats({
        courses: courses.data?.length || 0,
        assignments: assignments.data?.length || 0,
        students: enrollments.data?.length || 0,
        submissions: submissions.data?.length || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "My Courses",
      value: stats.courses,
      icon: BookOpen,
      color: "text-primary",
      link: "/teacher/courses",
    },
    {
      title: "Assignments",
      value: stats.assignments,
      icon: FileText,
      color: "text-warning",
      link: "/teacher/assignments",
    },
    {
      title: "Total Students",
      value: stats.students,
      icon: Users,
      color: "text-success",
      link: "/teacher/courses",
    },
    {
      title: "Pending Submissions",
      value: stats.submissions,
      icon: MessageSquare,
      color: "text-accent",
      link: "/teacher/submissions",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="teacher" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your courses and track student progress</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat, index) => (
            <Card
              key={stat.title}
              className="shadow-card hover:shadow-hover transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{loading ? "..." : stat.value}</div>
                <Link to={stat.link}>
                  <Button variant="ghost" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your teaching resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/teacher/courses">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Courses
                </Button>
              </Link>
              <Link to="/teacher/assignments">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              </Link>
              <Link to="/teacher/submissions">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Grade Submissions
                </Button>
              </Link>
              <Link to="/teacher/materials">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Upload Materials
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card gradient-card">
            <CardHeader>
              <CardTitle>Teaching Tip</CardTitle>
              <CardDescription>Inspiration for educators</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">
                "Education is the most powerful weapon which you can use to change the world."
              </p>
              <p className="text-xs text-muted-foreground mt-2">- Nelson Mandela</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
