import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OffenseRecord } from "./OffenseForm";
import { Calendar, Users, Clock, MessageSquare, TrendingUp } from "lucide-react";

interface OffenseHistoryProps {
  offenses: OffenseRecord[];
}

export function OffenseHistory({ offenses }: OffenseHistoryProps) {
  const getSeverityBadge = (suspensionDays: number) => {
    if (suspensionDays === 0) return "clay-badge clay-badge-success";
    if (suspensionDays <= 3) return "clay-badge clay-badge-warning";
    return "clay-badge clay-badge-danger";
  };

  const getSeverityLabel = (suspensionDays: number) => {
    if (suspensionDays === 0) return "Warning";
    if (suspensionDays <= 3) return "Minor";
    return "Major";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate stats
  const totalOffenses = offenses.length;
  const totalSuspensionDays = offenses.reduce((sum, offense) => sum + offense.suspensionDays, 0);
  const mostCommonOffense = offenses.length > 0 ? 
    offenses.reduce((acc, offense) => {
      acc[offense.offenseType] = (acc[offense.offenseType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) : {};
  
  const topOffense = Object.entries(mostCommonOffense).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="clay-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Offenses</p>
                <p className="text-2xl font-bold text-destructive">{totalOffenses}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="clay-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspension Days</p>
                <p className="text-2xl font-bold text-accent">{totalSuspensionDays}</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="clay-card">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Most Common</p>
              <p className="text-lg font-semibold text-primary truncate">
                {topOffense ? topOffense[0] : "None"}
              </p>
              {topOffense && (
                <p className="text-sm text-muted-foreground">{topOffense[1]} incidents</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offense History */}
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            Recent Offenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {offenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Offenses Recorded</h3>
              <p className="text-muted-foreground">Start by recording the first disciplinary offense.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offenses
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((offense) => (
                  <div
                    key={offense.id}
                    className="clay-card p-4 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge className={getSeverityBadge(offense.suspensionDays)}>
                            {getSeverityLabel(offense.suspensionDays)}
                          </Badge>
                          <span className="font-semibold text-lg">{offense.offenseType}</span>
                        </div>
                        
                         <div className="mb-2">
                           <p className="text-base font-medium text-foreground">{offense.studentName}</p>
                         </div>
                         
                         <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                           <div className="flex items-center gap-1">
                             <Calendar className="w-4 h-4" />
                             {formatDate(offense.date)}
                           </div>
                           <div className="flex items-center gap-1">
                             <Users className="w-4 h-4" />
                             {offense.studentGrade}
                           </div>
                           <div className="flex items-center gap-1">
                             <Users className="w-4 h-4" />
                             {offense.studentClass}
                           </div>
                           {offense.suspensionDays > 0 && (
                             <div className="flex items-center gap-1">
                               <Clock className="w-4 h-4" />
                               {offense.suspensionDays} day{offense.suspensionDays !== 1 ? 's' : ''} suspension
                             </div>
                           )}
                         </div>

                        {offense.comments && (
                          <div className="flex items-start gap-2 mt-3">
                            <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                            <p className="text-sm text-muted-foreground italic">{offense.comments}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}