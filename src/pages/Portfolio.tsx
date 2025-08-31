import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Balance {
  currency: string;
  amount: number;
  usdValue: number;
}

interface Loan {
  id: string;
  amount: number;
  currency: string;
  interestRate: number;
  collateralId: string;
  collateralName: string;
  dueDate: string;
  status: 'active' | 'overdue' | 'paid';
}

interface Stake {
  poolId: string;
  poolName: string;
  amount: number;
  currency: string;
  apr: number;
  earnedRewards: number;
}

interface PortfolioData {
  balances: Balance[];
  loans: Loan[];
  stakes: Stake[];
  totalNetWorth: number;
  totalDebt: number;
  totalStaked: number;
}

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await api.getPortfolio();
      setPortfolio(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load portfolio data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Navigation />
        <main className="container mx-auto px-4 py-8 mt-16">
          <Card className="p-8 text-center">
            <CardTitle className="mb-2">Portfolio Unavailable</CardTitle>
            <CardDescription>
              Unable to load portfolio data. Please try again later.
            </CardDescription>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
            <p className="text-muted-foreground mt-2">
              Overview of your balances, loans, and staked assets
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Net Worth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-2xl font-bold text-green-600">
                    ${portfolio.totalNetWorth.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Debt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingDown className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-2xl font-bold text-red-600">
                    ${portfolio.totalDebt.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Staked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-2xl font-bold text-blue-600">
                    ${portfolio.totalStaked.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Wallet className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-2xl font-bold text-purple-600">
                    ${portfolio.balances.reduce((sum, b) => sum + b.usdValue, 0).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Balances */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Balances</CardTitle>
                <CardDescription>Your available token balances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolio.balances.map((balance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{balance.currency}</p>
                        <p className="text-sm text-muted-foreground">
                          ${balance.usdValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{balance.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{balance.currency}</p>
                      </div>
                    </div>
                  ))}
                  {portfolio.balances.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No balances found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Loans */}
            <Card>
              <CardHeader>
                <CardTitle>Active Loans</CardTitle>
                <CardDescription>Your outstanding loan positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolio.loans.map((loan) => (
                    <div key={loan.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Loan #{loan.id.slice(0, 8)}</p>
                        <Badge variant={
                          loan.status === 'active' ? 'default' : 
                          loan.status === 'overdue' ? 'destructive' : 'secondary'
                        }>
                          {loan.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-medium">{loan.amount} {loan.currency}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Interest Rate</p>
                          <p className="font-medium">{loan.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Collateral</p>
                          <p className="font-medium">{loan.collateralName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium">{new Date(loan.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {portfolio.loans.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No active loans</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Staked Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Liquidity Positions</CardTitle>
              <CardDescription>Your staked assets earning yield</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.stakes.map((stake, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{stake.poolName}</h3>
                      <Badge variant="secondary">{stake.currency}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Staked Amount</span>
                        <span className="font-medium">{stake.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">APR</span>
                        <span className="font-medium text-green-600">{stake.apr}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Earned Rewards</span>
                        <span className="font-medium text-green-600">
                          +{stake.earnedRewards.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {portfolio.stakes.length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground py-8">
                    No liquidity positions found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;