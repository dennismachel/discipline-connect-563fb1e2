import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSetupProps {
  onComplete?: () => void;
}

export const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const { profile, updateProfile, loading } = useProfile();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    school_name: profile?.school_name || '',
    role: profile?.role || 'user'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    setSaving(true);
    const { error } = await updateProfile(formData);
    setSaving(false);

    if (error) {
      toast.error(`Failed to update profile: ${error.message}`);
    } else {
      toast.success('Profile updated successfully');
      onComplete?.();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Card className="clay-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Complete Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school_name">School Name</Label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                id="school_name"
                value={formData.school_name}
                onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                placeholder="Enter your school name"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'admin' | 'user') => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex flex-col">
                    <span>User</span>
                    <span className="text-xs text-muted-foreground">
                      Can add disciplinary offenses and view analytics
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex flex-col">
                    <span>Administrator</span>
                    <span className="text-xs text-muted-foreground">
                      Full access to all features and user management
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full clay-primary" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};