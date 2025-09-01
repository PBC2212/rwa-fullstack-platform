import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins, ExternalLink, TrendingUp, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Token {
  id: string;
  tokenSymbol: string;
  assetName: string;
  assetType: string;
  type: 'nft' | 'fractional';
  balance: number;
  collateralValue: number;
  currentValue: number;
  change24h: number;
  blockchainExplorerLink: string;
  metadata?: {
    description: string;
    imageUrl?: string;
  };
}

const MyTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMyTokens();
  }, []);

  const loadMyTokens = async () => {
    try {
      setLoading(true);
      const data = await api.getMyTokens();
      setTokens(data);
    } catch (error: any) {
      console.error('Error loading tokens:', error);
      toast({
        title: "Failed to load tokens",
        description: error.message || "Could not load your token portfolio.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotalValue = () => {
    return tokens.reduce((sum, token) => sum + token.currentValue * token.balance, 0);
  };

  const getTotalGainLoss = () => {
    return tokens.reduce((sum, token) => {
      const gainLoss = (token.currentValue - token.collateralValue) * token.balance;
      return sum + gainLoss;
    }, 0);
  };

  const getTokenTypeIcon = (type: string) => {
    return type === 'nft' ? <Building className="w-4 h-4" /> : <Coins className="w-4 h-4" />;
  };

  const getTokenTypeBadge = (type: string) => {
    return (
      <Badge 
        variant={type === 'nft' ? 'default' : 'secondary'}
        className="text-xs"
      >
        {type === 'nft' ? 'NFT' : 'Fractional'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const totalValue = getTotalValue();
  const totalGainLoss = getTotalGainLoss();
  const gainLossPercentage = totalValue > 0 ? (totalGainLoss / totalValue) * 100 : 0;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tokens</h1>
          <p className="text-muted-foreground mt-2">
            Your portfolio of tokenized real-world assets
          </p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gain/Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-sm ${gainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tokens.length}</div>
              <div className="text-sm text-muted-foreground">
                {tokens.filter(t => t.type === 'nft').length} NFTs, {tokens.filter(t => t.type === 'fractional').length} Fractional
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tokens Grid */}
        {tokens.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Coins className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tokens yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start by pledging your real-world assets for tokenization
              </p>
              <Button onClick={() => window.location.href = '/asset-pledging'}>
                <Building className="w-4 h-4 mr-2" />
                Pledge Your First Asset
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Your Token Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((token) => {
                const gainLoss = (token.currentValue - token.collateralValue) * token.balance;
                const gainLossPercentage = token.collateralValue > 0 
                  ? ((token.currentValue - token.collateralValue) / token.collateralValue) * 100 
                  : 0;

                return (
                  <Card key={token.id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTokenTypeIcon(token.type)}
                          <CardTitle className="text-lg">{token.assetName}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          {getTokenTypeBadge(token.type)}
                          <Badge variant="outline">{token.tokenSymbol}</Badge>
                        </div>
                      </div>
                      <CardDescription>
                        {token.assetType} • Balance: {token.balance.toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {token.metadata?.imageUrl && (
                        <img 
                          src={token.metadata.imageUrl} 
                          alt={token.assetName}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Current Value</p>
                          <p className="font-semibold">${token.currentValue.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Value</p>
                          <p className="font-semibold">
                            ${(token.currentValue * token.balance).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Collateral Value</p>
                          <p className="font-semibold">${token.collateralValue.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">24h Change</p>
                          <div className="flex items-center gap-1">
                            {token.change24h >= 0 ? (
                              <TrendingUp className="w-3 h-3 text-green-600" />
                            ) : (
                              <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />
                            )}
                            <span className={`text-xs font-medium ${
                              token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Gain/Loss */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Gain/Loss</span>
                          <div className="text-right">
                            <div className={`font-semibold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {gainLoss >= 0 ? '+' : ''}${gainLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className={`text-xs ${gainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(token.blockchainExplorerLink, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Explorer
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.location.href = '/marketplace'}
                        >
                          Trade
                        </Button>
                      </div>

                      {token.metadata?.description && (
                        <div className="border-t pt-4">
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {token.metadata.description}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTokens;