import { Shield, Lock, FileCheck, Network, Zap, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TokenizationSection = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Multi-Layer Security",
      description: "Advanced encryption, multi-signature wallets, and cold storage protection for all tokenized assets."
    },
    {
      icon: FileCheck,
      title: "Regulatory Compliance",
      description: "Full KYC/AML procedures, SEC compliance, and adherence to international financial regulations."
    },
    {
      icon: Lock,
      title: "Smart Contract Audits",
      description: "Professionally audited smart contracts ensuring transparent and secure asset tokenization."
    }
  ];

  const blockchainFeatures = [
    {
      name: "XRPL",
      description: "Fast, low-cost transactions with enterprise-grade security",
      color: "bg-accent-teal",
      supported: true
    },
    {
      name: "XDC Network",
      description: "Enterprise-ready hybrid blockchain for institutional assets",
      color: "bg-accent-gold",
      supported: true
    },
    {
      name: "Ethereum",
      description: "Proven smart contract platform with extensive DeFi integration",
      color: "bg-primary",
      supported: true
    },
    {
      name: "Polygon",
      description: "Layer 2 scaling solution for faster, cheaper transactions",
      color: "bg-purple-500",
      supported: false
    }
  ];

  const complianceStandards = [
    "SEC Regulation D",
    "KYC/AML Procedures",
    "SOC 2 Type II",
    "ISO 27001",
    "GDPR Compliant",
    "FINRA Guidelines"
  ];

  return (
    <section id="tokenization" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-reveal text-4xl md:text-5xl font-bold text-foreground mb-6">
            Secure <span className="gold-gradient bg-clip-text text-transparent">Tokenization</span>
          </h2>
          <p className="scroll-reveal text-xl text-muted-foreground max-w-3xl mx-auto">
            Our industry-leading tokenization process combines cutting-edge blockchain technology 
            with robust security measures and full regulatory compliance.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="scroll-reveal hover-lift border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full teal-gradient mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Blockchain Integration */}
        <div className="scroll-reveal mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-8">
            Supported Blockchain Networks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blockchainFeatures.map((blockchain, index) => (
              <Card key={index} className="hover-lift border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${blockchain.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{blockchain.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{blockchain.description}</p>
                  {blockchain.supported ? (
                    <Badge variant="default" className="bg-success text-success-foreground">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Coming Soon
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Compliance Section */}
        <div className="scroll-reveal bg-muted/30 rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Regulatory Compliance
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                We maintain the highest standards of compliance, working closely with 
                legal experts to ensure all tokenized assets meet current 
                and evolving compliance requirements.
              </p>
              
              {/* Compliance Standards */}
              <div className="flex flex-wrap gap-3">
                {complianceStandards.map((standard, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Process Steps */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent-teal rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Asset Verification</h4>
                  <p className="text-muted-foreground text-sm">Independent third-party valuation and legal verification of all assets.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Legal Structuring</h4>
                  <p className="text-muted-foreground text-sm">Creation of compliant legal frameworks for token ownership rights.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Token Deployment</h4>
                  <p className="text-muted-foreground text-sm">Secure smart contract deployment with comprehensive testing and audits.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stats */}
        <div className="scroll-reveal mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <Zap className="w-8 h-8 text-accent-teal mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">&lt;3s</div>
            <div className="text-muted-foreground">Transaction Speed</div>
          </div>
          <div>
            <Lock className="w-8 h-8 text-success mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">256-bit</div>
            <div className="text-muted-foreground">Encryption</div>
          </div>
          <div>
            <Globe className="w-8 h-8 text-accent-gold mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
            <div className="text-muted-foreground">Global Access</div>
          </div>
          <div>
            <FileCheck className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">100%</div>
            <div className="text-muted-foreground">Compliance Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenizationSection;