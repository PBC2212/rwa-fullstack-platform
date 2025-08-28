import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileCheck, UserCheck, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StartTokenization = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    investorType: "",
    document: null as File | null,
    additionalInfo: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, document: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.country || !formData.investorType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    toast({
      title: "Application Submitted",
      description: "Your tokenization application has been received. Our compliance team will review your information within 24-48 hours.",
    });
    
    // For now, we'll just show success and could redirect
    console.log("Form submitted:", formData);
  };

  const complianceFeatures = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is protected with 256-bit encryption and stored in secure, compliant facilities."
    },
    {
      icon: UserCheck,
      title: "KYC/AML Compliance",
      description: "We follow strict Know Your Customer and Anti-Money Laundering procedures as required by law."
    },
    {
      icon: FileCheck,
      title: "Regulatory Compliance",
      description: "Our processes meet SEC requirements and international financial regulations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-teal to-accent-teal/80 bg-clip-text text-transparent">
              Start Your Tokenization Journey
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Begin the secure onboarding process to tokenize your assets. Our compliance team will guide you through each step to ensure regulatory requirements are met.
            </p>
          </div>
        </section>

        {/* Compliance Features */}
        <section className="py-16 px-4 bg-card/20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Secure & Compliant Process</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {complianceFeatures.map((feature, index) => (
                <Card key={index} className="bg-card/50 border-border/50">
                  <CardHeader className="text-center">
                    <feature.icon className="w-12 h-12 mx-auto mb-4 text-accent-teal" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Tokenization Application</CardTitle>
                <CardDescription>
                  Please provide the following information to begin your secure onboarding process. All information is encrypted and handled according to financial industry standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Enter your full legal name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country of Residence *</Label>
                    <Input
                      id="country"
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      placeholder="Enter your country of residence"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investorType">Type of Investor *</Label>
                    <Select onValueChange={(value) => handleInputChange("investorType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select investor type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail Investor</SelectItem>
                        <SelectItem value="accredited">Accredited Investor</SelectItem>
                        <SelectItem value="institutional">Institutional Investor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document">Upload ID Document</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent-teal/50 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <input
                        id="document"
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      <label htmlFor="document" className="cursor-pointer">
                        <span className="text-sm text-muted-foreground">
                          {formData.document ? formData.document.name : "Click to upload passport, driver's license, or ID card"}
                        </span>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                      placeholder="Any additional information about your investment goals or specific requirements"
                      rows={4}
                    />
                  </div>

                  <div className="pt-6">
                    <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-accent-teal to-accent-teal/80 hover:from-accent-teal/90 hover:to-accent-teal/70">
                      Continue Application
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      By submitting this form, you agree to our privacy policy and consent to the processing of your personal data for compliance purposes.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <section className="py-16 px-4 bg-card/20">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-8">What Happens Next?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-accent-teal/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-accent-teal font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold">Review & Verification</h3>
                <p className="text-muted-foreground">Our compliance team reviews your application and verifies your documents within 24-48 hours.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-accent-teal/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-accent-teal font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold">Approval & Setup</h3>
                <p className="text-muted-foreground">Once approved, we'll set up your secure account and guide you through the tokenization process.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-accent-teal/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-accent-teal font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold">Start Tokenizing</h3>
                <p className="text-muted-foreground">Begin tokenizing your assets with full regulatory compliance and our expert support.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StartTokenization;