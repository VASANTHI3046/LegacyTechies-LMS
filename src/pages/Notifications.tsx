import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Check, BookOpen, Award, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Notifications() {
  const mockNotifications = [
    { 
      id: 1, 
      title: 'New Assignment Posted', 
      message: 'CSS Styling assignment has been posted in Web Development',
      type: 'assignment',
      read: false,
      time: '2 hours ago'
    },
    { 
      id: 2, 
      title: 'Grade Released', 
      message: 'Your submission for HTML Basics has been graded',
      type: 'grade',
      read: false,
      time: '5 hours ago'
    },
    { 
      id: 3, 
      title: 'New Forum Post', 
      message: 'Instructor replied to your question in Database Design forum',
      type: 'forum',
      read: false,
      time: '1 day ago'
    },
    { 
      id: 4, 
      title: 'Course Material Added', 
      message: 'New study material uploaded for Data Structures',
      type: 'material',
      read: true,
      time: '2 days ago'
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'grade':
        return <Award className="h-5 w-5 text-secondary" />;
      case 'forum':
        return <MessageSquare className="h-5 w-5 text-accent" />;
      case 'material':
        return <BookOpen className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground text-lg">Stay updated with your courses</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`shadow-elegant border-0 hover:shadow-primary transition-all ${
                !notification.read ? 'bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    !notification.read ? 'gradient-primary' : 'bg-muted'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{notification.title}</h3>
                      {!notification.read && (
                        <Badge className="gradient-primary text-white">New</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">{notification.message}</p>
                    <p className="text-sm text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}