import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, Percent, Droplets, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BorrowDialog from '@/components/BorrowDialog';

interface Pool {
  id: string;
  name: string;
  apr: number;
  availableLiquidity: number;
  totalLiquidity: number;
  collateralRequirement: number;
  currency: string;
}

const Pools = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState<{ [key: string]: string }>({});
  const [withdrawAmount, setWithdrawAmount] = useState<{ [key: string]: string }>({});
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [selectedPoolForBorrow, setSelectedPoolForBorrow] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPools();
  }, []);

  const loadPools = async () => {
    try {
      const data = await api.getPools();
      setPools(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pools",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (poolId: string) => {
    const amount = parseFloat(depositAmount[poolId] || '0');
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    setActionLoading({ ...actionLoading, [`deposit-${poolId}`]: true });
    try {
      await api.depositToPool(poolId, amount);
      toast({
        title: "Deposit Successful",
        description: `Deposited ${amount} to pool`,
      });
      setDepositAmount({ ...depositAmount, [poolId]: '' });
      loadPools();
    } catch (error: any) {
      toast({
        title: "Deposit Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading({ ...actionLoading, [`deposit-${poolId}`]: false });
    }
  };

  const handleBorrow = (poolId: string, poolName: string) => {
    setSelectedPoolForBorrow({ id: poolId, name: poolName });
    setBorrowDialogOpen(true);
  };

  const handleWithdraw = async (poolId: string) => {
    const amount = parseFloat(withdrawAmount[poolId] || '0');
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    setActionLoading({ ...actionLoading, [`withdraw-${poolId}`]: true });
    try {
      await api.withdrawFromPool(poolId, amount);
      toast({
        title: "Withdrawal Successful",
        description: `Withdrew ${amount} from pool`,
      });
      setWithdrawAmount({ ...withdrawAmount, [poolId]: '' });
      loadPools();
    } catch (error: any) {
      toast({
        title: "Withdrawal Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading({ ...actionLoading, [`withdraw-${poolId}`]: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Liquidity Pools</h1>
            <p className="text-muted-foreground mt-2">
              Provide liquidity to earn yield or borrow against your collateral
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pools.map((pool) => (
              <Card key={pool.id} className="p-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="w-5 h-5" />
                      {pool.name}
                    </CardTitle>
                    <Badge variant="secondary">{pool.currency}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Pool Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center text-green-600 mb-1">
                        <Percent className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{pool.apr}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">APR</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center text-blue-600 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">{pool.availableLiquidity.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600 mb-1">
                        {pool.collateralRequirement}%
                      </div>
                      <p className="text-xs text-muted-foreground">Min Collateral</p>
                    </div>
                  </div>

                  {/* Deposit Section */}
                  <div className="space-y-3">
                    <Label>Deposit Liquidity</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={depositAmount[pool.id] || ''}
                        onChange={(e) => setDepositAmount({ ...depositAmount, [pool.id]: e.target.value })}
                      />
                      <Button 
                        onClick={() => handleDeposit(pool.id)}
                        disabled={actionLoading[`deposit-${pool.id}`]}
                      >
                        {actionLoading[`deposit-${pool.id}`] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Deposit'
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Withdraw Section */}
                  <div className="space-y-3">
                    <Label>Withdraw Liquidity</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={withdrawAmount[pool.id] || ''}
                        onChange={(e) => setWithdrawAmount({ ...withdrawAmount, [pool.id]: e.target.value })}
                      />
                      <Button 
                        variant="outline"
                        onClick={() => handleWithdraw(pool.id)}
                        disabled={actionLoading[`withdraw-${pool.id}`]}
                      >
                        {actionLoading[`withdraw-${pool.id}`] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Withdraw'
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Borrow Section */}
                  <div className="pt-3 border-t">
                    <Button 
                      variant="secondary"
                      onClick={() => handleBorrow(pool.id, pool.name)}
                      className="w-full"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Borrow Against Collateral
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pools.length === 0 && (
            <Card className="p-8 text-center">
              <CardTitle className="mb-2">No Pools Available</CardTitle>
              <CardDescription>
                There are currently no liquidity pools available. Check back later.
              </CardDescription>
            </Card>
          )}
        </div>
      </main>

      <Footer />
      
      {/* Borrow Dialog */}
      {selectedPoolForBorrow && (
        <BorrowDialog
          open={borrowDialogOpen}
          onOpenChange={(open) => {
            setBorrowDialogOpen(open);
            if (!open) setSelectedPoolForBorrow(null);
          }}
          poolId={selectedPoolForBorrow.id}
          poolName={selectedPoolForBorrow.name}
        />
      )}
    </div>
  );
};

export default Pools;