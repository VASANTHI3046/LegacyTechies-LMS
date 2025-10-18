import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-hero min-h-screen flex flex-col">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">EduLearn</span>
          </div>
          <Link to="/auth">
            <Button variant="secondary" size="lg">
              Get Started
            </Button>
          </Link>
        </nav>

        <div className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="animate-slide-up space-y-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Transform Your Learning Journey
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              A comprehensive learning management system for students and educators
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Start Learning
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  I'm a Teacher
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "Rich Courses", desc: "Access comprehensive learning materials" },
              { icon: GraduationCap, title: "Track Progress", desc: "Monitor your academic achievements" },
              { icon: Users, title: "Collaborate", desc: "Engage in discussions with peers" },
              { icon: Award, title: "Get Certified", desc: "Earn recognition for your hard work" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <feature.icon className="h-8 w-8 mb-4" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
