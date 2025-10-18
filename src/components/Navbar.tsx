import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface NavbarProps {
  role?: "student" | "teacher";
}

export const Navbar = ({ role }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      });
      navigate("/auth");
    }
  };

  const studentLinks = [
    { path: "/student/dashboard", label: "Dashboard" },
    { path: "/student/courses", label: "Courses" },
    { path: "/student/assignments", label: "Assignments" },
    { path: "/student/grades", label: "Grades" },
    { path: "/student/materials", label: "Materials" },
    { path: "/student/forum", label: "Forum" },
  ];

  const teacherLinks = [
    { path: "/teacher/dashboard", label: "Dashboard" },
    { path: "/teacher/courses", label: "Courses" },
    { path: "/teacher/assignments", label: "Assignments" },
    { path: "/teacher/submissions", label: "Submissions" },
    { path: "/teacher/grades", label: "Grades" },
    { path: "/teacher/materials", label: "Materials" },
    { path: "/teacher/forum", label: "Forum" },
  ];

  const links = role === "teacher" ? teacherLinks : studentLinks;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to={role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"} className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-hero">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EduLearn
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant={location.pathname === link.path ? "default" : "ghost"}
                    size="sm"
                    className="transition-all"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userName && (
              <span className="hidden sm:inline-block text-sm text-muted-foreground">
                Welcome, <span className="font-semibold text-foreground">{userName}</span>
              </span>
            )}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
