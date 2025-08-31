import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, Coins, TrendingUp, Building, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const mockTokenizationActions = [
    {
      title: "Create New Asset Token",
      description: "Tokenize a new real-world asset using Centrifuge protocol",
      icon: <Coins className="w-5 h-5" />,
      action: () => toast({ title: "Feature Coming Soon", description: "Centrifuge integration in development" }),
      badge: "New"
    },
    {
      title: "View Portfolio",
      description: "Monitor your tokenized asset investments and performance",
      icon: <TrendingUp className="w-5 h-5" />,
      action: () => navigate('/assets'),
      badge: null
    },
    {
      title: "Property Management",
      description: "Manage real estate tokens and rental income distribution",
      icon: <Building className="w-5 h-5" />,
      action: () => toast({ title: "Feature Coming Soon", description: "Property management tools in development" }),
      badge: "Beta"
    },
    {
      title: "Trade Tokens",
      description: "Buy and sell tokenized asset shares on the marketplace",
      icon: <ShoppingCart className="w-5 h-5" />,
      action: () => toast({ title: "Feature Coming Soon", description: "Trading functionality in development" }),
      badge: "Beta"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and authentication status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-sm font-mono">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Created</p>
                  <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email Verified</p>
                  <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                    {user.email_confirmed_at ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tokenization Actions */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">RWA Tokenization Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTokenizationActions.map((action, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {action.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{action.title}</CardTitle>
                          {action.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={action.action} className="w-full">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* JWT Token Info (for development) */}
          {session?.access_token && (
            <Card>
              <CardHeader>
                <CardTitle>Authentication Token</CardTitle>
                <CardDescription>
                  JWT token for backend API integration (truncated for security)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-mono break-all">
                    {session.access_token.substring(0, 50)}...
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Token expires: {new Date(session.expires_at! * 1000).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;