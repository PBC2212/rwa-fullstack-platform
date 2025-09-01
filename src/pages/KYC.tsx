import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, FileCheck, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface KYCStatus {
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  documents?: string[];
}

const KYC = () => {
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      setLoading(true);
      const status = await api.getKYCStatus();
      setKycStatus(status);
    } catch (error: any) {
      console.error('Error loading KYC status:', error);
      // If no KYC found, set default state
      setKycStatus({ status: 'pending' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select identity documents to upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      Array.from(selectedFiles).forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });

      await api.uploadKYC(formData);
      
      toast({
        title: "Documents uploaded successfully",
        description: "Your KYC documents have been submitted for review.",
      });

      // Reload status
      loadKYCStatus();
      setSelectedFiles(null);
    } catch (error: any) {
      console.error('Error uploading KYC:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><FileCheck className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
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
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
          <p className="text-muted-foreground mt-2">
            Complete your identity verification to access all platform features
          </p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Your current KYC verification status</CardDescription>
              </div>
              {kycStatus && getStatusBadge(kycStatus.status)}
            </div>
          </CardHeader>
          <CardContent>
            {kycStatus?.status === 'approved' && (
              <div className="text-green-600">
                <p>✓ Your identity has been verified successfully!</p>
                {kycStatus.approvedAt && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Approved on {new Date(kycStatus.approvedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            
            {kycStatus?.status === 'rejected' && (
              <div className="text-red-600">
                <p>✗ Your verification was rejected.</p>
                {kycStatus.rejectionReason && (
                  <p className="text-sm mt-1">Reason: {kycStatus.rejectionReason}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Please upload new documents and try again.
                </p>
              </div>
            )}
            
            {kycStatus?.status === 'pending' && (
              <div className="text-amber-600">
                <p>⏳ Your documents are being reviewed.</p>
                {kycStatus.submittedAt && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Submitted on {new Date(kycStatus.submittedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Documents Card */}
        {(!kycStatus || kycStatus.status !== 'approved') && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Identity Documents</CardTitle>
              <CardDescription>
                Please upload clear photos of your government-issued ID (passport, driver's license, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="documents">Identity Documents</Label>
                <Input
                  id="documents"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Accepted formats: JPG, PNG, PDF. Maximum 5MB per file.
                </p>
              </div>

              {selectedFiles && selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files:</Label>
                  <ul className="text-sm space-y-1">
                    {Array.from(selectedFiles).map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-green-600" />
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button 
                onClick={handleUpload} 
                disabled={!selectedFiles || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documents
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Requirements Card */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                Government-issued photo ID (passport, driver's license, national ID)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                Clear, high-resolution images showing all four corners
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                All text and information must be clearly readable
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                Documents must be current and not expired
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KYC;