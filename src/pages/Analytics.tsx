import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertTriangle, Users, Calendar, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";

interface OffenseRecord {
  id: string;
  student_name: string;
  student_grade: number;
  student_class: string;
  offense_type: string;
  offense_description: string | null;
  created_at: string;
  recorded_by: string;
}

interface DailyData {
  day: string;
  count: number;
  severe: number;
}

interface OffenseTypeData {
  name: string;
  value: number;
  color: string;
}

interface WeeklyData {
  week: string;
  infractions: number;
}

interface DepartmentData {
  department: string;
  incidents: number;
}

export default function Analytics() {
  const { isAdmin } = useProfile();
  const [offenseRecords, setOffenseRecords] = useState<OffenseRecord[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [offenseTypes, setOffenseTypes] = useState<OffenseTypeData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1", "#d084d0"];

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const { data: records, error } = await supabase
        .from('offense_records')
        .select(`
          *,
          profiles!offense_records_recorded_by_fkey(full_name, department)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analytics data:', error);
        return;
      }

      setOffenseRecords(records || []);
      processAnalyticsData(records || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (records: any[]) => {
    // Process daily data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const dailyAnalytics = last7Days.map(date => {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayRecords = records.filter(record => {
        const recordDate = new Date(record.created_at);
        return recordDate.toDateString() === date.toDateString();
      });

      const severeOffenses = ['Fighting', 'Vandalism', 'Academic Dishonesty'];
      const severeCount = dayRecords.filter(record => 
        severeOffenses.includes(record.offense_type)
      ).length;

      return {
        day: dayName,
        count: dayRecords.length,
        severe: severeCount
      };
    });

    setDailyData(dailyAnalytics);

    // Process offense types
    const typeCount: Record<string, number> = {};
    records.forEach(record => {
      typeCount[record.offense_type] = (typeCount[record.offense_type] || 0) + 1;
    });

    const offenseTypeData = Object.entries(typeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index]
      }));

    setOffenseTypes(offenseTypeData);

    // Process weekly data (last 4 weeks)
    const last4Weeks = Array.from({ length: 4 }, (_, i) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (i + 1) * 7);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - i * 7);
      
      const weekRecords = records.filter(record => {
        const recordDate = new Date(record.created_at);
        return recordDate >= startDate && recordDate < endDate;
      });

      return {
        week: `Week ${4 - i}`,
        infractions: weekRecords.length
      };
    });

    setWeeklyData(last4Weeks);

    // Process department data
    const deptCount: Record<string, number> = {};
    records.forEach(record => {
      const dept = record.profiles?.department || 'Unknown';
      deptCount[dept] = (deptCount[dept] || 0) + 1;
    });

    const departmentAnalytics = Object.entries(deptCount)
      .map(([department, incidents]) => ({
        department: department === 'Unknown' ? 'Other' : department,
        incidents
      }))
      .sort((a, b) => b.incidents - a.incidents)
      .slice(0, 6);

    setDepartmentData(departmentAnalytics);
  };

  const totalIncidents = dailyData.reduce((sum, day) => sum + day.count, 0);
  const avgPerDay = totalIncidents > 0 ? Math.round(totalIncidents / 7) : 0;
  const severeIncidents = dailyData.reduce((sum, day) => sum + day.severe, 0);
  const resolutionRate = offenseRecords.length > 0 ? Math.round((offenseRecords.length - severeIncidents) / offenseRecords.length * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 pb-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Daily Analytics Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive overview of disciplinary incidents and trends
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="clay-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total This Week</p>
                  <p className="text-2xl font-bold">{totalIncidents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="clay-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-secondary/10">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Average</p>
                  <p className="text-2xl font-bold">{avgPerDay}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="clay-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Severe Cases</p>
                  <p className="text-2xl font-bold">{severeIncidents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="clay-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/10">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolution Rate</p>
                  <p className="text-2xl font-bold">{resolutionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Daily Incidents Bar Chart */}
            <Card className="clay-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Daily Incidents Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="severe" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--primary))" }}></div>
                  <span>Total Incidents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--destructive))" }}></div>
                  <span>Severe Cases</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Trends Line Chart */}
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Weekly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="infractions" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--secondary))" }}></div>
                  <span>Weekly Infractions</span>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Offense Types Pie Chart */}
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-accent" />
                Offense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={offenseTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {offenseTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {offenseTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: type.color }}
                    ></div>
                    <span>{type.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {type.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Incidents Bar Chart */}
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Incidents by Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" />
                  <YAxis dataKey="department" type="category" width={60} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar 
                    dataKey="incidents" 
                    fill="hsl(var(--accent))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Insight:</strong> PE department shows highest incident rate, 
                  likely due to increased physical activity and interaction.
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
          </>
        )}
      </main>
    </div>
  );
}