import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users, Calendar, FileText, Trash2, Edit } from "lucide-react";
import { useOffenseRecords, DatabaseOffenseRecord } from "@/hooks/useOffenseRecords";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

export default function StudentRecords() {
  const { isAdmin } = useProfile();
  const { records, loading, deleteRecord } = useOffenseRecords();
  const [filteredRecords, setFilteredRecords] = useState<DatabaseOffenseRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const classes = ["Barbados", "Cuba", "Dominica", "Grenada", "Jamaica", "St. Lucia", "Trinidad & Tobago"];
  const grades = [7, 8, 9, 10, 11];

  // Filter records based on search term, grade, and class
  useEffect(() => {
    filterRecords();
  }, [searchTerm, selectedGrade, selectedClass, records]);

  const handleDeleteRecord = async (id: string) => {
    if (!isAdmin()) {
      toast.error("Only administrators can delete records");
      return;
    }

    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteRecord(id);
        toast.success("Record deleted successfully");
      } catch (error) {
        toast.error("Failed to delete record");
        console.error("Error deleting record:", error);
      }
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

  // Helper function to get badge variant based on offense type
  const getOffenseTypeBadgeVariant = (offenseType: string) => {
    const severeOffenses = ['Fighting', 'Vandalism', 'Academic Dishonesty'];
    const majorOffenses = ['Insubordination', 'Inappropriate Language'];
    
    if (severeOffenses.includes(offenseType)) return 'destructive';
    if (majorOffenses.includes(offenseType)) return 'default';
    return 'secondary';
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
                <FileText className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Student Records</h1>
                  <p className="text-muted-foreground">
                    {isAdmin() 
                      ? "View all disciplinary offense records across the school system"
                      : "View disciplinary offense records for your assigned area"
                    }
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-6">
          <Card className="clay-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                    Search Records
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="Student name or offense type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Grade Filter</Label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Grades" />
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
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Class Filter</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Classes" />
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
                <h2 className="text-xl font-semibold">
                  Disciplinary Records ({filteredRecords.length})
                </h2>
                <div className="text-sm text-muted-foreground">
                  Total: {records.length} records
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedGrade !== "all" || selectedClass !== "all"
                      ? "Try adjusting your search filters"
                      : "No disciplinary records have been created yet"
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Offense Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Recorded By</TableHead>
                        <TableHead>Date</TableHead>
                        {isAdmin() && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.student_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Grade {record.student_grade}</Badge>
                          </TableCell>
                          <TableCell>{record.student_class}</TableCell>
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
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(record.created_at).toLocaleDateString()}
                          </TableCell>
                          {isAdmin() && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteRecord(record.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}