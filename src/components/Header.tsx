import { Shield, GraduationCap, LogOut, User, Settings, BarChart3, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const { user, signOut } = useAuth();
  const { profile, isAdmin } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(`Sign out failed: ${error.message}`);
    } else {
      toast.success("Signed out successfully");
    }
  };

  return (
    <header className="relative overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5"></div>
      
      <div className="relative clay-card mx-4 md:mx-8 mt-6 mb-8">
        <div className="px-6 md:px-12 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 clay-card flex items-center justify-center float-animation">
                  <img 
                    src="/lovable-uploads/35358004-8298-45c7-8627-ce6281d9e738.png" 
                    alt="Denbigh High School Logo" 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  />
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Denbigh High School
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-1 font-medium">
                  Disciplinary Management System
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <span className="text-sm text-primary font-semibold">#AQUAPRIDE</span>
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant={location.pathname === "/" ? "default" : "outline"}
                size="sm"
                onClick={() => navigate("/")}
                className="text-xs"
              >
                Dashboard
              </Button>
              <Button
                variant={location.pathname === "/analytics" ? "default" : "outline"}
                size="sm"
                onClick={() => navigate("/analytics")}
                className="text-xs"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Analytics
              </Button>
              <Button
                variant={location.pathname === "/student-records" ? "default" : "outline"}
                size="sm"
                onClick={() => navigate("/student-records")}
                className="text-xs"
              >
                <Users className="w-3 h-3 mr-1" />
                Records
              </Button>
            </div>

            <div className="clay-card p-4 text-center">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">
                  {isAdmin() ? 'Administrator Portal' : 'User Portal'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              {user && profile && (
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <p className="text-xs text-muted-foreground">
                      {profile.full_name || user.email}
                    </p>
                    <Badge variant={isAdmin() ? "default" : "secondary"} className="text-xs">
                      {isAdmin() ? 'Admin' : 'User'}
                    </Badge>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="clay-card text-xs h-7"
                      >
                        <User className="w-3 h-3 mr-1" />
                        Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="text-xs">
                        <Settings className="w-3 h-3 mr-2" />
                        Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="text-xs text-destructive focus:text-destructive"
                      >
                        <LogOut className="w-3 h-3 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}