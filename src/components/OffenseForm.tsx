import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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

const grades = [7, 8, 9, 10, 11];

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
    studentName: "",
    offenseType: "",
    studentGrade: "",
    studentClass: "",
    offenseDescription: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.offenseType || !formData.studentGrade || !formData.studentName || !formData.studentClass) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to record offenses.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('offense_records')
        .insert({
          student_name: formData.studentName,
          student_grade: parseInt(formData.studentGrade),
          student_class: formData.studentClass,
          offense_type: formData.offenseType,
          offense_description: formData.offenseDescription,
          recorded_by: user.id
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to record offense. Please try again.",
          variant: "destructive"
        });
        console.error("Error inserting record:", error);
        return;
      }

      // Create local record for immediate UI update
      const newOffense: OffenseRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
        studentName: formData.studentName,
        offenseType: formData.offenseType,
        studentGrade: `Grade ${formData.studentGrade}`,
        studentClass: formData.studentClass,
        suspensionDays: 0,
        comments: formData.offenseDescription,
        timestamp: Date.now()
      };

      onAddOffense(newOffense);
      
      // Reset form
      setFormData({
        studentName: "",
        offenseType: "",
        studentGrade: "",
        studentClass: "",
        offenseDescription: ""
      });

      toast({
        title: "Offense Recorded",
        description: "The disciplinary offense has been successfully recorded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
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
                    <SelectItem key={grade} value={grade.toString()}>
                      Grade {grade}
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
            <Label htmlFor="offense-description" className="text-sm font-medium">
              Offense Description
            </Label>
            <Textarea
              id="offense-description"
              value={formData.offenseDescription}
              onChange={(e) => setFormData({ ...formData, offenseDescription: e.target.value })}
              className="clay-input min-h-[100px]"
              placeholder="Provide details about the offense..."
            />
          </div>

          <Button 
            type="submit" 
            className="clay-primary w-full py-3 text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Recording..." : "Record Offense"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}