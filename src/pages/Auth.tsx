import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, GraduationCap, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { user, signInWithGoogle, signInWithEmail, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(`Sign in failed: ${error.message}`);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    const { error } = isSignUp 
      ? await signUp(email, password)
      : await signInWithEmail(email, password);
    
    setLoading(false);
    
    if (error) {
      toast.error(`${isSignUp ? 'Sign up' : 'Sign in'} failed: ${error.message}`);
    } else if (isSignUp) {
      toast.success('Check your email for the confirmation link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="clay-card p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto clay-card flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/67e9bac0-4394-4ea3-9670-69726047b2de.png" 
                alt="Denbigh High School Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              Denbigh High School
            </h1>
            <p className="text-muted-foreground">
              Disciplinary Management System
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-sm text-primary font-semibold">#AQUAPRIDE</span>
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Authentication */}
          <div className="space-y-6">
            {/* Google OAuth */}
            <div className="clay-card p-4">
              <div className="flex items-center gap-2 text-primary mb-3">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Quick Access</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in with your Google account (personal or business).
              </p>
              
              <Button 
                onClick={handleGoogleSignIn}
                className="w-full clay-primary"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Business Email Login */}
            <div className="clay-card p-4">
              <div className="flex items-center gap-2 text-primary mb-3">
                <Mail className="w-5 h-5" />
                <span className="font-semibold">Business Email Access</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Use your Google Workspace or business email credentials.
              </p>
              
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full clay-primary" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-primary hover:underline"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                  </button>
                </div>
              </form>
            </div>

            <div className="text-xs text-muted-foreground">
              By signing in, you agree to use this system responsibly and in accordance with school policies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;