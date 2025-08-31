import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowUpRight, ArrowDownLeft, RefreshCw, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'borrow' | 'repay' | 'mint' | 'lock' | 'unlock';
  amount?: number;
  currency?: string;
  poolName?: string;
  nftName?: string;
  collateralId?: string;
  loanId?: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  txHash?: string;
  fee?: number;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load transaction history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'repay':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'withdraw':
      case 'borrow':
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
      case 'mint':
        return <RefreshCw className="w-4 h-4 text-purple-600" />;
      case 'lock':
      case 'unlock':
        return <Lock className="w-4 h-4 text-orange-600" />;
      default:
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  const getTransactionDescription = (tx: Transaction) => {
    switch (tx.type) {
      case 'deposit':
        return `Deposited ${tx.amount} ${tx.currency} to ${tx.poolName}`;
      case 'withdraw':
        return `Withdrew ${tx.amount} ${tx.currency} from ${tx.poolName}`;
      case 'borrow':
        return `Borrowed ${tx.amount} ${tx.currency} (Loan: ${tx.loanId?.slice(0, 8)})`;
      case 'repay':
        return `Repaid ${tx.amount} ${tx.currency} (Loan: ${tx.loanId?.slice(0, 8)})`;
      case 'mint':
        return `Minted NFT: ${tx.nftName}`;
      case 'lock':
        return `Locked ${tx.nftName} as collateral`;
      case 'unlock':
        return `Unlocked ${tx.nftName} collateral`;
      default:
        return 'Unknown transaction';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const matchesSearch = search === '' || 
      getTransactionDescription(tx).toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

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
            <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
            <p className="text-muted-foreground mt-2">
              View all your DeFi protocol interactions and their status
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Transaction Type</Label>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdraw">Withdrawals</SelectItem>
                      <SelectItem value="borrow">Borrows</SelectItem>
                      <SelectItem value="repay">Repayments</SelectItem>
                      <SelectItem value="mint">NFT Mints</SelectItem>
                      <SelectItem value="lock">Collateral Locks</SelectItem>
                      <SelectItem value="unlock">Collateral Unlocks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Search</Label>
                  <Input
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
              <CardDescription>
                {filteredTransactions.length === 0 && transactions.length > 0 
                  ? "No transactions match your filters"
                  : "All your protocol interactions"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-background rounded-full">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium">{getTransactionDescription(tx)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                          {tx.fee && (
                            <span className="text-xs text-muted-foreground">
                              • Fee: ${tx.fee}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {tx.amount && (
                        <div className="text-right">
                          <p className="font-semibold">
                            {['deposit', 'repay'].includes(tx.type) ? '-' : '+'}
                            {tx.amount.toLocaleString()} {tx.currency}
                          </p>
                        </div>
                      )}
                      <Badge variant={
                        tx.status === 'success' ? 'default' :
                        tx.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="mb-2">No Transactions Found</CardTitle>
                    <CardDescription>
                      {transactions.length === 0 
                        ? "You haven't made any transactions yet. Start by depositing liquidity or minting an NFT."
                        : "No transactions match your current filters. Try adjusting your search criteria."
                      }
                    </CardDescription>
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

export default Transactions;