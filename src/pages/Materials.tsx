import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, File, FileVideo, FileImage } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Materials() {
  const mockMaterials = [
    { title: 'Introduction to HTML', type: 'pdf', course: 'Web Development', size: '2.5 MB', date: '2024-01-10' },
    { title: 'CSS Fundamentals', type: 'pdf', course: 'Web Development', size: '3.1 MB', date: '2024-01-12' },
    { title: 'JavaScript Basics Video', type: 'video', course: 'Web Development', size: '45 MB', date: '2024-01-15' },
    { title: 'Database Schema Design', type: 'pdf', course: 'Database Design', size: '1.8 MB', date: '2024-01-18' },
    { title: 'SQL Cheat Sheet', type: 'pdf', course: 'Database Design', size: '500 KB', date: '2024-01-20' },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'video':
        return <FileVideo className="h-8 w-8 text-blue-500" />;
      case 'image':
        return <FileImage className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Course Materials</h1>
          <p className="text-muted-foreground text-lg">Access your learning resources</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMaterials.map((material, index) => (
            <Card key={index} className="shadow-elegant border-0 hover:shadow-primary transition-all">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    {getFileIcon(material.type)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base line-clamp-2 mb-2">{material.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {material.course}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{material.size}</span>
                  <span>{material.date}</span>
                </div>
                <Button className="w-full gradient-secondary gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}