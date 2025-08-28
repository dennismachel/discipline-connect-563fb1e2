import { useState } from "react";
import { Header } from "@/components/Header";
import { OffenseForm, OffenseRecord } from "@/components/OffenseForm";
import { OffenseHistory } from "@/components/OffenseHistory";
import { ProfileSetup } from "@/components/ProfileSetup";
import { useProfile } from "@/hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, History, BookOpen, Shield, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [offenses, setOffenses] = useState<OffenseRecord[]>([]);
  const { profile, loading, isAdmin, isUser } = useProfile();

  const handleAddOffense = (offense: OffenseRecord) => {
    setOffenses(prev => [...prev, offense]);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show profile setup if no profile data
  if (!profile?.full_name) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <ProfileSetup />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pb-12">
        {/* Role-based welcome message */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="clay-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                {isAdmin() ? (
                  <>
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-lg font-semibold">Administrator Access</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 text-secondary" />
                    <span className="text-lg font-semibold">User Access</span>
                  </>
                )}
              </div>
              <p className="text-muted-foreground">
                {isAdmin() 
                  ? "Welcome back! You have full access to all system features including user management, offense records, and analytics."
                  : "Welcome! You can add disciplinary offenses and view analytics for your assigned area."
                }
              </p>
              {profile.department && (
                <p className="text-sm text-primary mt-2 font-medium">
                  {profile.department}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="record" className="w-full">
          <TabsList className="clay-card grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="record" className="clay-primary data-[state=active]:clay-primary">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Record Offense
            </TabsTrigger>
            <TabsTrigger value="history" className="clay-secondary data-[state=active]:clay-accent">
              <History className="w-4 h-4 mr-2" />
              View Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="mt-0">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="clay-card inline-flex items-center gap-3 px-6 py-3 mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold">Daily Offense Entry</span>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {isAdmin() 
                    ? "Record disciplinary offenses for any student in the system. All entries are automatically timestamped and stored for review."
                    : "Record disciplinary offenses for students in your assigned area. All entries are automatically timestamped and stored for review."
                  }
                </p>
              </div>
              
              <OffenseForm onAddOffense={handleAddOffense} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="clay-card inline-flex items-center gap-3 px-6 py-3 mb-4">
                  <History className="w-6 h-6 text-accent" />
                  <span className="text-lg font-semibold">
                    {isAdmin() ? 'System Analytics & History' : 'Analytics Dashboard'}
                  </span>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {isAdmin() 
                    ? "Review all recorded offenses and track disciplinary trends across the entire school system."
                    : "View analytics and trends for offenses in your assigned area and grade levels."
                  }
                </p>
              </div>
              
              <OffenseHistory offenses={offenses} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
