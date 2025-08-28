import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Filter, Calendar, GraduationCap, MapPin } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface OffenseRecord {
  id: string;
  student_name: string;
  student_grade: number;
  student_class: string;
  offense_type: string;
  offense_description: string;
  recorded_by: string;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
}

const StudentRecords = () => {
  const [records, setRecords] = useState<OffenseRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<OffenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const { profile, isAdmin } = useProfile();

  const classes = ["Barbados", "Cuba", "Dominica", "Grenada", "Jamaica", "St. Lucia", "Trinidad & Tobago"];
  const grades = [7, 8, 9, 10, 11];

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, selectedGrade, selectedClass]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('offense_records')
        .select(`
          *,
          profiles!recorded_by (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Failed to fetch records");
        console.error("Error fetching records:", error);
        return;
      }

      setRecords((data as any[])?.map(item => ({
        ...item,
        profiles: item.profiles && typeof item.profiles === 'object' && 'full_name' in item.profiles 
          ? item.profiles 
          : null
      })) || []);
    } catch (error) {
      toast.error("Error loading records");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = records;

    // Filter by search term (student name or offense type)
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.offense_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by grade
    if (selectedGrade !== "all") {
      filtered = filtered.filter(record => record.student_grade === parseInt(selectedGrade));
    }

    // Filter by class
    if (selectedClass !== "all") {
      filtered = filtered.filter(record => record.student_class === selectedClass);
    }

    setFilteredRecords(filtered);
  };

  const getOffenseTypeBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'minor':
        return 'secondary';
      case 'major':
        return 'destructive';
      case 'severe':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading student records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pb-12">
        {/* Page Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="clay-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Student Records</CardTitle>
                  <CardDescription>
                    {isAdmin() 
                      ? "View all disciplinary offense records across the school system"
                      : "View disciplinary offense records for your assigned area"
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-6">
          <Card className="clay-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by student name or offense type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="w-32">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      {grades.map(grade => (
                        <SelectItem key={grade} value={grade.toString()}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map(className => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Records Table */}
        <div className="max-w-6xl mx-auto">
          <Card className="clay-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Disciplinary Records ({filteredRecords.length})
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Total records: {records.length}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Offense Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Recorded By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No records found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              {record.student_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-muted-foreground" />
                              Grade {record.student_grade}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              {record.student_class}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getOffenseTypeBadgeVariant(record.offense_type)}>
                              {record.offense_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={record.offense_description || "No description"}>
                              {record.offense_description || "No description"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.profiles?.full_name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(record.created_at), "MMM dd, yyyy")}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentRecords;