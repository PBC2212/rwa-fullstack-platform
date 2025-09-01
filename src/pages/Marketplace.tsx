import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface MarketplaceListing {
  id: string;
  tokenSymbol: string;
  assetName: string;
  assetType: string;
  nav: number; // Net Asset Value
  totalSupply: number;
  availableTokens: number;
  price: number;
  change24h: number;
  liquidity: number;
  image?: string;
}

const Marketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [buyingTokenId, setBuyingTokenId] = useState<string | null>(null);
  const [sellAmounts, setSellAmounts] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadMarketplaceListings();
  }, []);

  const loadMarketplaceListings = async () => {
    try {
      setLoading(true);
      const data = await api.getMarketplaceListings();
      setListings(data);
    } catch (error: any) {
      console.error('Error loading marketplace listings:', error);
      toast({
        title: "Failed to load marketplace",
        description: error.message || "Could not load marketplace listings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (tokenId: string, amount: number) => {
    try {
      setBuyingTokenId(tokenId);
      await api.buyToken(tokenId, amount);
      
      toast({
        title: "Purchase successful",
        description: `Successfully bought ${amount} tokens.`,
      });
      
      loadMarketplaceListings();
    } catch (error: any) {
      console.error('Error buying tokens:', error);
      toast({
        title: "Purchase failed",
        description: error.message || "Could not complete the purchase.",
        variant: "destructive",
      });
    } finally {
      setBuyingTokenId(null);
    }
  };

  const handleSell = async (tokenId: string) => {
    const amount = parseFloat(sellAmounts[tokenId] || '0');
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to sell.",
        variant: "destructive",
      });
      return;
    }

    try {
      const listing = listings.find(l => l.id === tokenId);
      await api.sellToken(tokenId, amount, listing?.price || 0);
      
      toast({
        title: "Sell order placed",
        description: `Successfully placed sell order for ${amount} tokens.`,
      });
      
      setSellAmounts(prev => ({ ...prev, [tokenId]: '' }));
      loadMarketplaceListings();
    } catch (error: any) {
      console.error('Error selling tokens:', error);
      toast({
        title: "Sell order failed",
        description: error.message || "Could not place sell order.",
        variant: "destructive",
      });
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || listing.assetType.toLowerCase() === selectedType;
    return matchesSearch && matchesType;
  });

  const assetTypes = [...new Set(listings.map(l => l.assetType))];

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
          <h1 className="text-3xl font-bold tracking-tight">Token Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Trade tokenized real-world assets with instant liquidity
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assets or token symbols..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('all')}
                  size="sm"
                >
                  All
                </Button>
                {assetTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type.toLowerCase() ? 'default' : 'outline'}
                    onClick={() => setSelectedType(type.toLowerCase())}
                    size="sm"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Grid */}
        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No assets found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || selectedType !== 'all' 
                  ? "Try adjusting your search or filter criteria"
                  : "The marketplace is currently empty"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{listing.assetName}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline">{listing.tokenSymbol}</Badge>
                        <Badge variant="secondary">{listing.assetType}</Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {listing.change24h >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          listing.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {listing.change24h >= 0 ? '+' : ''}{listing.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">NAV</p>
                      <p className="font-semibold">${listing.nav.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-semibold">${listing.price.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-semibold">{listing.availableTokens.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Liquidity</p>
                      <p className="font-semibold">${listing.liquidity.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleBuy(listing.id, 1)}
                        disabled={buyingTokenId === listing.id}
                        className="flex-1"
                      >
                        {buyingTokenId === listing.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Buying...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Amount to sell"
                        type="number"
                        value={sellAmounts[listing.id] || ''}
                        onChange={(e) => setSellAmounts(prev => ({ 
                          ...prev, 
                          [listing.id]: e.target.value 
                        }))}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => handleSell(listing.id)}
                      >
                        Sell
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;