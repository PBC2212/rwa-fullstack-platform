import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isLocked: boolean;
}

interface BorrowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poolId: string;
  poolName: string;
}

const BorrowDialog = ({ open, onOpenChange, poolId, poolName }: BorrowDialogProps) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNftId, setSelectedNftId] = useState<string>('');
  const [borrowAmount, setBorrowAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'DAI' | 'USDC'>('DAI');
  const [loading, setLoading] = useState(false);
  const [nftsLoading, setNftsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadAvailableNFTs();
    }
  }, [open]);

  const loadAvailableNFTs = async () => {
    try {
      const data = await api.getNFTs();
      setNfts(data.filter((nft: NFT) => !nft.isLocked));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load available NFTs",
        variant: "destructive",
      });
    } finally {
      setNftsLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!selectedNftId || !borrowAmount || parseFloat(borrowAmount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please select an NFT and enter a valid borrow amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First lock the NFT as collateral
      const lockResult = await api.lockCollateral(selectedNftId);
      
      // Then create the borrow request
      const borrowResult = await api.borrow(lockResult.collateralId, parseFloat(borrowAmount), currency);
      
      toast({
        title: "Borrow Successful",
        description: `Borrowed ${borrowAmount} ${currency} (Loan ID: ${borrowResult.loanId})`,
      });
      
      onOpenChange(false);
      setSelectedNftId('');
      setBorrowAmount('');
    } catch (error: any) {
      toast({
        title: "Borrow Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedNft = nfts.find(nft => nft.id === selectedNftId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Borrow from {poolName}</DialogTitle>
          <DialogDescription>
            Select an NFT as collateral and specify the amount you want to borrow
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* NFT Selection */}
          <div className="space-y-3">
            <Label>Select NFT Collateral</Label>
            {nftsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : nfts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No available NFTs for collateral. Mint an NFT first.
              </div>
            ) : (
              <Select value={selectedNftId} onValueChange={setSelectedNftId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an NFT" />
                </SelectTrigger>
                <SelectContent>
                  {nfts.map((nft) => (
                    <SelectItem key={nft.id} value={nft.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                          {nft.imageUrl ? (
                            <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover rounded" />
                          ) : (
                            <ImageIcon className="w-3 h-3" />
                          )}
                        </div>
                        <span>{nft.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Selected NFT Preview */}
            {selectedNft && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-background rounded flex items-center justify-center">
                    {selectedNft.imageUrl ? (
                      <img src={selectedNft.imageUrl} alt={selectedNft.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <ImageIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{selectedNft.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{selectedNft.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Currency Selection */}
          <div className="space-y-3">
            <Label>Currency</Label>
            <Select value={currency} onValueChange={(value: 'DAI' | 'USDC') => setCurrency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAI">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">DAI</Badge>
                    <span>DAI Stablecoin</span>
                  </div>
                </SelectItem>
                <SelectItem value="USDC">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">USDC</Badge>
                    <span>USD Coin</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Borrow Amount */}
          <div className="space-y-3">
            <Label>Borrow Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Maximum borrowable amount depends on your NFT's collateral value and the pool's LTV ratio
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleBorrow} 
              disabled={loading || !selectedNftId || !borrowAmount}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Borrow {currency}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowDialog;