import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, AlertTriangle, Users, Clock } from "lucide-react";

export interface OffenseRecord {
  id: string;
  date: string;
  studentName: string;
  offenseType: string;
  studentGrade: string;
  studentClass: string;
  suspensionDays: number;
  comments: string;
  timestamp: number;
}

interface OffenseFormProps {
  onAddOffense: (offense: OffenseRecord) => void;
}

const offenseTypes = [
  "Disruptive Behavior",
  "Fighting",
  "Insubordination",
  "Tardiness",
  "Truancy",
  "Academic Dishonesty",
  "Vandalism",
  "Inappropriate Language",
  "Dress Code Violation",
  "Technology Misuse",
  "Other"
];

const grades = [
  "7th Grade", 
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade"
];

const studentClasses = [
  "Barbados",
  "Cuba", 
  "Dominica",
  "Grenada",
  "Jamaica",
  "St. Lucia",
  "Trinidad & Tobago"
];

export function OffenseForm({ onAddOffense }: OffenseFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    studentName: "",
    offenseType: "",
    studentGrade: "",
    studentClass: "",
    suspensionDays: 0,
    comments: ""
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.offenseType || !formData.studentGrade || !formData.studentName || !formData.studentClass) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newOffense: OffenseRecord = {
      id: crypto.randomUUID(),
      date: formData.date,
      studentName: formData.studentName,
      offenseType: formData.offenseType,
      studentGrade: formData.studentGrade,
      studentClass: formData.studentClass,
      suspensionDays: formData.suspensionDays,
      comments: formData.comments,
      timestamp: Date.now()
    };

    onAddOffense(newOffense);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      studentName: "",
      offenseType: "",
      studentGrade: "",
      studentClass: "",
      suspensionDays: 0,
      comments: ""
    });

    toast({
      title: "Offense Recorded",
      description: "The disciplinary offense has been successfully recorded.",
    });
  };

  return (
    <Card className="clay-card max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
          <AlertTriangle className="w-8 h-8 text-primary" />
          Record Disciplinary Offense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Date of Offense
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="clay-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName" className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4" />
                Student Name
              </Label>
              <Input
                id="studentName"
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="clay-input"
                placeholder="Enter student name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="grade" className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4" />
                Student Grade
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, studentGrade: value })}>
                <SelectTrigger className="clay-input">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentClass" className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4" />
                Student Class
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, studentClass: value })}>
                <SelectTrigger className="clay-input">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {studentClasses.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="offense-type" className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              Type of Offense
            </Label>
            <Select onValueChange={(value) => setFormData({ ...formData, offenseType: value })}>
              <SelectTrigger className="clay-input">
                <SelectValue placeholder="Select offense type" />
              </SelectTrigger>
              <SelectContent>
                {offenseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suspension-days" className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4" />
              Suspension Days
            </Label>
            <Input
              id="suspension-days"
              type="number"
              min="0"
              max="30"
              value={formData.suspensionDays}
              onChange={(e) => setFormData({ ...formData, suspensionDays: parseInt(e.target.value) || 0 })}
              className="clay-input"
              placeholder="Enter number of suspension days"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium">
              Comments
            </Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="clay-input min-h-[100px]"
              placeholder="Additional details about the offense..."
            />
          </div>

          <Button type="submit" className="clay-primary w-full py-3 text-lg font-semibold">
            Record Offense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}