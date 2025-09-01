import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Building, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface PledgedAsset {
  id: string;
  assetType: string;
  estimatedValue: number;
  description: string;
  status: 'under_review' | 'approved' | 'rejected' | 'tokenized';
  submittedAt: string;
  documents: string[];
  rejectionReason?: string;
}

const AssetPledging = () => {
  const [pledgedAssets, setPledgedAssets] = useState<PledgedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    assetType: '',
    estimatedValue: '',
    description: '',
    documents: [] as string[]
  });

  const assetTypes = [
    'Real Estate',
    'Gold',
    'Silver',
    'Bonds',
    'Stocks',
    'Commodities',
    'Art & Collectibles',
    'Other'
  ];

  useEffect(() => {
    loadPledgedAssets();
  }, []);

  const loadPledgedAssets = async () => {
    try {
      setLoading(true);
      const assets = await api.getPledgedAssets();
      setPledgedAssets(assets);
    } catch (error: any) {
      console.error('Error loading pledged assets:', error);
      toast({
        title: "Failed to load assets",
        description: error.message || "Could not load your pledged assets.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assetType || !formData.estimatedValue || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await api.pledgeAsset({
        assetType: formData.assetType,
        estimatedValue: parseFloat(formData.estimatedValue),
        description: formData.description,
        documents: formData.documents
      });

      toast({
        title: "Asset pledged successfully",
        description: "Your asset has been submitted for review and tokenization.",
      });

      // Reset form
      setFormData({
        assetType: '',
        estimatedValue: '',
        description: '',
        documents: []
      });
      setShowForm(false);
      
      // Reload assets
      loadPledgedAssets();
    } catch (error: any) {
      console.error('Error pledging asset:', error);
      toast({
        title: "Failed to pledge asset",
        description: error.message || "Could not submit your asset for review.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'tokenized':
        return <Badge className="bg-blue-100 text-blue-800"><TrendingUp className="w-3 h-3 mr-1" />Tokenized</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'tokenized':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset Pledging</h1>
            <p className="text-muted-foreground mt-2">
              Pledge your real-world assets for tokenization and unlock liquidity
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Pledge New Asset
          </Button>
        </div>

        {/* Pledge Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Pledge a Real-World Asset</CardTitle>
              <CardDescription>
                Provide details about your asset to begin the tokenization process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="assetType">Asset Type *</Label>
                    <Select
                      value={formData.assetType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, assetType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedValue">Estimated Value (USD) *</Label>
                    <Input
                      id="estimatedValue"
                      type="number"
                      placeholder="1000000"
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Asset Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about your asset including location, condition, documentation, etc."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Pledge Asset'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Pledged Assets List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Pledged Assets</h2>
          
          {pledgedAssets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No pledged assets yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start by pledging your first real-world asset for tokenization
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Pledge Your First Asset
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pledgedAssets.map((asset) => (
                <Card key={asset.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(asset.status)}
                        <CardTitle className="text-lg">{asset.assetType}</CardTitle>
                      </div>
                      {getStatusBadge(asset.status)}
                    </div>
                    <CardDescription>
                      Submitted {new Date(asset.submittedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estimated Value</p>
                      <p className="text-lg font-semibold">
                        ${asset.estimatedValue.toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                      <p className="text-sm line-clamp-3">{asset.description}</p>
                    </div>

                    {asset.status === 'rejected' && asset.rejectionReason && (
                      <div className="text-red-600 text-sm">
                        <p className="font-medium">Rejection Reason:</p>
                        <p>{asset.rejectionReason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetPledging;