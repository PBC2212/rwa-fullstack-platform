import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Coins, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface MintTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: {
    id: string;
    assetType: string;
    estimatedValue: number;
    description: string;
  };
  onSuccess: () => void;
}

const MintTokenDialog = ({ open, onOpenChange, asset, onSuccess }: MintTokenDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState({
    tokenName: '',
    tokenSymbol: '',
    totalSupply: '',
    fractional: false,
    tokenType: 'ERC-20'
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenData.tokenName || !tokenData.tokenSymbol || !tokenData.totalSupply) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await api.mintToken(asset.id, {
        tokenName: tokenData.tokenName,
        tokenSymbol: tokenData.tokenSymbol,
        totalSupply: parseInt(tokenData.totalSupply),
        fractional: tokenData.fractional,
        tokenType: tokenData.tokenType
      });

      toast({
        title: "Token minted successfully",
        description: `${tokenData.tokenSymbol} tokens have been created for your ${asset.assetType}.`,
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setTokenData({
        tokenName: '',
        tokenSymbol: '',
        totalSupply: '',
        fractional: false,
        tokenType: 'ERC-20'
      });
    } catch (error: any) {
      console.error('Error minting token:', error);
      toast({
        title: "Failed to mint token",
        description: error.message || "Could not create tokens for your asset.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestedValues = () => {
    const assetTypeMap: { [key: string]: string } = {
      'Real Estate': 'RE',
      'Gold': 'GOLD',
      'Silver': 'SLVR',
      'Bonds': 'BOND',
      'Stocks': 'STK',
      'Commodities': 'CMDTY',
      'Art & Collectibles': 'ART',
      'Other': 'AST'
    };

    const suggestedSymbol = assetTypeMap[asset.assetType] || 'TKN';
    const suggestedSupply = tokenData.fractional ? '1000000' : '1';
    
    setTokenData(prev => ({
      ...prev,
      tokenName: `${asset.assetType} Token`,
      tokenSymbol: suggestedSymbol,
      totalSupply: suggestedSupply
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            <DialogTitle>Mint Token</DialogTitle>
          </div>
          <DialogDescription>
            Create blockchain tokens representing your {asset.assetType} worth ${asset.estimatedValue.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Asset Value</p>
                <p className="text-lg font-semibold">${asset.estimatedValue.toLocaleString()}</p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={generateSuggestedValues}
              >
                Auto-fill
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenName">Token Name *</Label>
              <Input
                id="tokenName"
                placeholder="Real Estate Token"
                value={tokenData.tokenName}
                onChange={(e) => setTokenData(prev => ({ ...prev, tokenName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenSymbol">Token Symbol *</Label>
              <Input
                id="tokenSymbol"
                placeholder="REI"
                value={tokenData.tokenSymbol}
                onChange={(e) => setTokenData(prev => ({ ...prev, tokenSymbol: e.target.value.toUpperCase() }))}
                maxLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenType">Token Standard</Label>
              <Select
                value={tokenData.tokenType}
                onValueChange={(value) => setTokenData(prev => ({ ...prev, tokenType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ERC-20">ERC-20 (Fungible)</SelectItem>
                  <SelectItem value="ERC-721">ERC-721 (NFT)</SelectItem>
                  <SelectItem value="ERC-1155">ERC-1155 (Multi-Token)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="fractional">Enable Fractional Ownership</Label>
                <p className="text-xs text-muted-foreground">
                  Allow multiple investors to own portions of this asset
                </p>
              </div>
              <Switch
                id="fractional"
                checked={tokenData.fractional}
                onCheckedChange={(checked) => setTokenData(prev => ({ 
                  ...prev, 
                  fractional: checked,
                  totalSupply: checked ? '1000000' : '1'
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalSupply">Total Supply *</Label>
              <Input
                id="totalSupply"
                type="number"
                placeholder={tokenData.fractional ? "1000000" : "1"}
                value={tokenData.totalSupply}
                onChange={(e) => setTokenData(prev => ({ ...prev, totalSupply: e.target.value }))}
              />
              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  {tokenData.fractional 
                    ? "Higher supply allows more granular ownership (e.g., 1 token = $" + (asset.estimatedValue / parseInt(tokenData.totalSupply || '1000000')).toFixed(2) + ")"
                    : "Single token represents complete ownership of this asset"
                  }
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 mr-2" />
                  Mint Tokens
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MintTokenDialog;