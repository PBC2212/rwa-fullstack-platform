import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Building2, ShoppingCart, Droplets, FileCheck, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const Dashboard = () => {
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalValue: 0,
    totalTokens: 0,
    pendingAssets: 0,
    kycStatus: 'pending'
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load dashboard summary data
      const [tokens, pledgedAssets, kycStatus] = await Promise.allSettled([
        api.getMyTokens(),
        api.getPledgedAssets(),
        api.getKYCStatus()
      ]);

      const tokensData = tokens.status === 'fulfilled' ? tokens.value : [];
      const assetsData = pledgedAssets.status === 'fulfilled' ? pledgedAssets.value : [];
      const kyc = kycStatus.status === 'fulfilled' ? kycStatus.value : { status: 'pending' };

      setPortfolioSummary({
        totalValue: tokensData.reduce((sum: number, token: any) => sum + (token.currentValue * token.balance), 0),
        totalTokens: tokensData.length,
        pendingAssets: assetsData.filter((asset: any) => asset.status === 'under_review').length,
        kycStatus: kyc.status
      });
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      // Don't show error toast as some endpoints might not be available yet
    } finally {
      setLoading(false);
    }
  };

  const getKYCBadge = () => {
    switch (portfolioSummary.kycStatus) {
      case 'approved': return { text: 'Verified', variant: 'default' as const };
      case 'rejected': return { text: 'Rejected', variant: 'destructive' as const };
      default: return { text: 'Required', variant: 'secondary' as const };
    }
  };

  const quickActions = [
    {
      title: "Complete KYC",
      description: "Verify your identity to unlock all platform features",
      icon: <FileCheck className="w-5 h-5" />,
      action: () => navigate('/kyc'),
      badge: getKYCBadge(),
      variant: portfolioSummary.kycStatus === 'approved' ? 'outline' as const : 'default' as const,
      buttonText: portfolioSummary.kycStatus === 'approved' ? 'View Status' : 'Complete Now'
    },
    {
      title: "Pledge Asset",
      description: "Submit your real-world assets for tokenization",
      icon: <Building2 className="w-5 h-5" />,
      action: () => navigate('/asset-pledging'),
      badge: portfolioSummary.pendingAssets > 0 ? { text: `${portfolioSummary.pendingAssets} Pending`, variant: 'secondary' as const } : null,
      variant: 'default' as const,
      buttonText: 'Get Started'
    },
    {
      title: "Browse Marketplace",
      description: "Trade tokenized assets with instant liquidity",
      icon: <ShoppingCart className="w-5 h-5" />,
      action: () => navigate('/marketplace'),
      badge: null,
      variant: 'outline' as const,
      buttonText: 'Get Started'
    },
    {
      title: "Add Liquidity",
      description: "Provide liquidity to earn yield on your tokens",
      icon: <Droplets className="w-5 h-5" />,
      action: () => navigate('/pools'),
      badge: null,
      variant: 'outline' as const,
      buttonText: 'Get Started'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Your RWA tokenization platform overview
          </p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${portfolioSummary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total token value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolioSummary.totalTokens}</div>
              <p className="text-xs text-muted-foreground mt-1">
                NFTs & fractional tokens
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolioSummary.pendingAssets}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Under review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                KYC Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={portfolioSummary.kycStatus === 'approved' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {portfolioSummary.kycStatus === 'approved' ? 'Verified' : 'Pending'}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Identity verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
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
                          <Badge 
                            variant={action.badge.variant} 
                            className="ml-2 text-xs"
                          >
                            {action.badge.text}
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
                  <Button 
                    onClick={action.action} 
                    variant={action.variant as any}
                    className="w-full"
                  >
                    {action.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest platform interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start by pledging your first asset or browsing the marketplace</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;