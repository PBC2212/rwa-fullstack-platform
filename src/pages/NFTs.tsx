import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Image, Lock, Unlock, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isLocked: boolean;
  collateralValue?: number;
  loanId?: string;
}

const NFTs = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [mintDialogOpen, setMintDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [mintForm, setMintForm] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    try {
      const data = await api.getNFTs();
      setNfts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load NFTs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMintNFT = async () => {
    if (!mintForm.name || !mintForm.description) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setActionLoading({ ...actionLoading, mint: true });
    try {
      const result = await api.mintNFT(mintForm);
      toast({
        title: "NFT Minted Successfully",
        description: `Created NFT: ${mintForm.name} (ID: ${result.id})`,
      });
      setMintForm({ name: '', description: '', imageUrl: '' });
      setMintDialogOpen(false);
      loadNFTs();
    } catch (error: any) {
      toast({
        title: "Minting Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading({ ...actionLoading, mint: false });
    }
  };

  const handleLockCollateral = async (nftId: string) => {
    setActionLoading({ ...actionLoading, [`lock-${nftId}`]: true });
    try {
      const result = await api.lockCollateral(nftId);
      toast({
        title: "Collateral Locked",
        description: `NFT locked as collateral (ID: ${result.collateralId})`,
      });
      loadNFTs();
    } catch (error: any) {
      toast({
        title: "Lock Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading({ ...actionLoading, [`lock-${nftId}`]: false });
    }
  };

  const handleUnlockCollateral = async (nftId: string) => {
    setActionLoading({ ...actionLoading, [`unlock-${nftId}`]: true });
    try {
      await api.unlockCollateral(nftId);
      toast({
        title: "Collateral Unlocked",
        description: "NFT has been unlocked and returned to your wallet",
      });
      loadNFTs();
    } catch (error: any) {
      toast({
        title: "Unlock Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading({ ...actionLoading, [`unlock-${nftId}`]: false });
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">NFT Collateral</h1>
              <p className="text-muted-foreground mt-2">
                Mint, manage, and use NFTs as collateral for borrowing
              </p>
            </div>
            
            <Dialog open={mintDialogOpen} onOpenChange={setMintDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Mint NFT
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mint New NFT</DialogTitle>
                  <DialogDescription>
                    Create a new NFT that can be used as collateral for borrowing
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={mintForm.name}
                      onChange={(e) => setMintForm({ ...mintForm, name: e.target.value })}
                      placeholder="NFT Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={mintForm.description}
                      onChange={(e) => setMintForm({ ...mintForm, description: e.target.value })}
                      placeholder="NFT Description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={mintForm.imageUrl}
                      onChange={(e) => setMintForm({ ...mintForm, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <Button 
                    onClick={handleMintNFT} 
                    disabled={actionLoading.mint}
                    className="w-full"
                  >
                    {actionLoading.mint ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Mint NFT
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <Card key={nft.id} className="overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {nft.imageUrl ? (
                    <img 
                      src={nft.imageUrl} 
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{nft.name}</CardTitle>
                    <Badge variant={nft.isLocked ? "destructive" : "secondary"}>
                      {nft.isLocked ? "Locked" : "Available"}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {nft.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {nft.collateralValue && (
                    <div className="text-sm text-muted-foreground mb-3">
                      Collateral Value: ${nft.collateralValue.toLocaleString()}
                    </div>
                  )}
                  
                  {nft.isLocked ? (
                    <Button 
                      variant="outline" 
                      onClick={() => handleUnlockCollateral(nft.id)}
                      disabled={actionLoading[`unlock-${nft.id}`]}
                      className="w-full"
                    >
                      {actionLoading[`unlock-${nft.id}`] ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Unlock className="w-4 h-4 mr-2" />
                      )}
                      Unlock Collateral
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleLockCollateral(nft.id)}
                      disabled={actionLoading[`lock-${nft.id}`]}
                      className="w-full"
                    >
                      {actionLoading[`lock-${nft.id}`] ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Lock className="w-4 h-4 mr-2" />
                      )}
                      Lock as Collateral
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {nfts.length === 0 && (
            <Card className="p-8 text-center">
              <CardTitle className="mb-2">No NFTs Found</CardTitle>
              <CardDescription>
                You don't have any NFTs yet. Mint your first NFT to get started with collateral-based borrowing.
              </CardDescription>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NFTs;