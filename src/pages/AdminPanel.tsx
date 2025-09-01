import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Clock, Building, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface PendingAsset {
  id: string;
  assetType: string;
  estimatedValue: number;
  description: string;
  submittedAt: string;
  submittedBy: string;
  submitterEmail: string;
  documents: string[];
  status: 'under_review' | 'approved' | 'rejected';
}

const AdminPanel = () => {
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingAssets, setProcessingAssets] = useState<Set<string>>(new Set());
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadPendingAssets();
  }, []);

  const loadPendingAssets = async () => {
    try {
      setLoading(true);
      const assets = await api.getPendingAssets();
      setPendingAssets(assets);
    } catch (error: any) {
      console.error('Error loading pending assets:', error);
      toast({
        title: "Failed to load pending assets",
        description: error.message || "Could not load assets pending review.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (assetId: string) => {
    try {
      setProcessingAssets(prev => new Set(prev).add(assetId));
      
      await api.approveAsset(assetId);
      
      toast({
        title: "Asset approved",
        description: "The asset has been approved for tokenization.",
      });
      
      loadPendingAssets();
    } catch (error: any) {
      console.error('Error approving asset:', error);
      toast({
        title: "Approval failed",
        description: error.message || "Could not approve the asset.",
        variant: "destructive",
      });
    } finally {
      setProcessingAssets(prev => {
        const newSet = new Set(prev);
        newSet.delete(assetId);
        return newSet;
      });
    }
  };

  const handleReject = async (assetId: string) => {
    const reason = rejectionReasons[assetId];
    if (!reason?.trim()) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejecting this asset.",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingAssets(prev => new Set(prev).add(assetId));
      
      await api.rejectAsset(assetId, reason);
      
      toast({
        title: "Asset rejected",
        description: "The asset has been rejected with the provided reason.",
      });
      
      setRejectionReasons(prev => ({ ...prev, [assetId]: '' }));
      loadPendingAssets();
    } catch (error: any) {
      console.error('Error rejecting asset:', error);
      toast({
        title: "Rejection failed",
        description: error.message || "Could not reject the asset.",
        variant: "destructive",
      });
    } finally {
      setProcessingAssets(prev => {
        const newSet = new Set(prev);
        newSet.delete(assetId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
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
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">
              Review and approve asset pledging requests for tokenization
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingAssets.filter(a => a.status === 'under_review').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Value Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${pendingAssets
                  .filter(a => a.status === 'under_review')
                  .reduce((sum, a) => sum + a.estimatedValue, 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Asset Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${pendingAssets.length > 0 
                  ? Math.round(pendingAssets.reduce((sum, a) => sum + a.estimatedValue, 0) / pendingAssets.length).toLocaleString()
                  : '0'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Assets */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Assets Pending Review</h2>
          
          {pendingAssets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending assets</h3>
                <p className="text-muted-foreground text-center">
                  All assets have been reviewed. New submissions will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingAssets.map((asset) => (
                <Card key={asset.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{asset.assetType}</CardTitle>
                        <CardDescription>
                          Submitted by {asset.submitterEmail} on {new Date(asset.submittedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {getStatusBadge(asset.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Asset Details</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span> {asset.assetType}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Estimated Value:</span> ${asset.estimatedValue.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Submitter:</span> {asset.submitterEmail}
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {asset.description}
                        </p>
                      </div>
                    </div>

                    {asset.documents && asset.documents.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Documents</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {asset.documents.map((doc, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(doc, '_blank')}
                            >
                              Document {index + 1}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {asset.status === 'under_review' && (
                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-4">Review Actions</h4>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`rejection-reason-${asset.id}`}>
                              Rejection Reason (if rejecting)
                            </Label>
                            <Textarea
                              id={`rejection-reason-${asset.id}`}
                              placeholder="Provide a detailed reason for rejection..."
                              value={rejectionReasons[asset.id] || ''}
                              onChange={(e) => setRejectionReasons(prev => ({
                                ...prev,
                                [asset.id]: e.target.value
                              }))}
                              className="mt-1"
                            />
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleApprove(asset.id)}
                              disabled={processingAssets.has(asset.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {processingAssets.has(asset.id) ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve Asset
                                </>
                              )}
                            </Button>

                            <Button
                              variant="destructive"
                              onClick={() => handleReject(asset.id)}
                              disabled={processingAssets.has(asset.id) || !rejectionReasons[asset.id]?.trim()}
                            >
                              {processingAssets.has(asset.id) ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject Asset
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
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

export default AdminPanel;