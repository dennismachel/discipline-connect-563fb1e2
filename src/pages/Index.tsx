import { useState } from "react";
import { Header } from "@/components/Header";
import { OffenseForm, OffenseRecord } from "@/components/OffenseForm";
import { OffenseHistory } from "@/components/OffenseHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, History, BookOpen } from "lucide-react";

const Index = () => {
  const [offenses, setOffenses] = useState<OffenseRecord[]>([]);

  const handleAddOffense = (offense: OffenseRecord) => {
    setOffenses(prev => [...prev, offense]);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pb-12">
        <Tabs defaultValue="record" className="w-full">
          <TabsList className="clay-card grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="record" className="clay-primary data-[state=active]:clay-primary">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Record Offense
            </TabsTrigger>
            <TabsTrigger value="history" className="clay-secondary data-[state=active]:clay-accent">
              <History className="w-4 h-4 mr-2" />
              View History
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
                  Use this form to record daily disciplinary offenses. All entries are automatically timestamped and stored for review.
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
                  <span className="text-lg font-semibold">Offense History & Analytics</span>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Review recorded offenses and track disciplinary trends across different grades and offense types.
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
