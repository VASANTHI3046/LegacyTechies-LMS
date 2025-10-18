import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, FileText, GraduationCap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    pendingAssignments: 0,
    avgGrade: 0,
    forumPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [enrollments, assignments, grades, posts] = await Promise.all([
        supabase.from("enrollments").select("*").eq("student_id", user.id),
        supabase.from("submissions").select("*").eq("student_id", user.id),
        supabase.from("grades").select("points, submission:submissions!inner(student_id)").eq("submission.student_id", user.id),
        supabase.from("forum_posts").select("*").eq("author_id", user.id),
      ]);

      const avgPoints = grades.data && grades.data.length > 0
        ? grades.data.reduce((sum, g) => sum + (g.points || 0), 0) / grades.data.length
        : 0;

      setStats({
        enrolledCourses: enrollments.data?.length || 0,
        pendingAssignments: Math.max(0, (assignments.data?.length || 0)),
        avgGrade: Math.round(avgPoints),
        forumPosts: posts.data?.length || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Enrolled Courses",
      value: stats.enrolledCourses,
      icon: BookOpen,
      color: "text-primary",
      link: "/student/courses",
    },
    {
      title: "Assignments",
      value: stats.pendingAssignments,
      icon: FileText,
      color: "text-warning",
      link: "/student/assignments",
    },
    {
      title: "Average Grade",
      value: `${stats.avgGrade}%`,
      icon: GraduationCap,
      color: "text-success",
      link: "/student/grades",
    },
    {
      title: "Forum Posts",
      value: stats.forumPosts,
      icon: MessageSquare,
      color: "text-accent",
      link: "/student/forum",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="student" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's your learning progress</p>
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
              <CardDescription>Navigate to key features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/student/courses">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Courses
                </Button>
              </Link>
              <Link to="/student/assignments">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  View Assignments
                </Button>
              </Link>
              <Link to="/student/materials">
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Study Materials
                </Button>
              </Link>
              <Link to="/student/forum">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Join Discussion
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card gradient-card">
            <CardHeader>
              <CardTitle>Learning Tip</CardTitle>
              <CardDescription>Today's motivation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">
                "The beautiful thing about learning is that no one can take it away from you."
              </p>
              <p className="text-xs text-muted-foreground mt-2">- B.B. King</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
