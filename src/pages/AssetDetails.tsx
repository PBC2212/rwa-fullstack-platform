import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Shield, 
  Clock, 
  BarChart3,
  ArrowLeft,
  Home,
  Percent
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import realEstateImage from "@/assets/real-estate-token.jpg";

const AssetDetails = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();

  // Mock data for Detroit Complex Apartments
  const assetData = {
    id: 1,
    name: "Detroit Complex Apartments",
    type: "Real Estate",
    image: realEstateImage,
    value: "$45.2M",
    tokenized: "85%",
    roi: "+10.4%",
    location: "Detroit, MI",
    status: "Active Trading",
    investors: 100,
    description: "Luxury commercial real estate in prime Detroit location with stable rental income and significant appreciation potential. This modern apartment complex features 120 units across 15 floors with premium amenities and strategic positioning in Detroit's revitalized downtown district.",
    details: {
      totalUnits: 120,
      floors: 15,
      yearBuilt: 2019,
      occupancyRate: "94%",
      avgRent: "$2,850",
      tokenPrice: "$1,000",
      minInvestment: "$5,000",
      annualDividend: "8.2%",
      propertyManager: "Premier Real Estate Partners",
      lastValuation: "December 2024"
    },
    financials: {
      grossRent: "$4.1M",
      netOperatingIncome: "$2.8M",
      capRate: "6.2%",
      cashOnCash: "10.4%",
      totalReturn: "12.8%",
      appreciation: "4.2%"
    },
    tokenomics: {
      totalTokens: "45,200",
      availableTokens: "6,780",
      soldTokens: "38,420",
      tokenHolders: 100,
      averageHolding: "384"
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 subtle-gradient">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mb-4 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Assets
              </Button>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-background/90 text-foreground">
                  {assetData.type}
                </Badge>
                <Badge className="bg-success text-success-foreground">
                  {assetData.status}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {assetData.name}
              </h1>
              
              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{assetData.location}</span>
              </div>
              
              <p className="text-xl text-muted-foreground max-w-4xl leading-relaxed">
                {assetData.description}
              </p>
            </div>
          </div>
        </section>

        {/* Asset Image */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <img 
                src={assetData.image} 
                alt={assetData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap gap-4 text-white">
                  <div className="bg-background/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">{assetData.value}</div>
                    <div className="text-sm opacity-90">Total Value</div>
                  </div>
                  <div className="bg-background/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold text-success">{assetData.roi}</div>
                    <div className="text-sm opacity-90">12M ROI</div>
                  </div>
                  <div className="bg-background/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">{assetData.tokenized}</div>
                    <div className="text-sm opacity-90">Tokenized</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Investment Overview */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent-teal" />
                    Investment Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{assetData.details.totalUnits}</div>
                      <div className="text-muted-foreground">Total Units</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{assetData.details.floors}</div>
                      <div className="text-muted-foreground">Floors</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{assetData.details.yearBuilt}</div>
                      <div className="text-muted-foreground">Year Built</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{assetData.details.occupancyRate}</div>
                      <div className="text-muted-foreground">Occupancy Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{assetData.details.avgRent}</div>
                      <div className="text-muted-foreground">Avg Monthly Rent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{assetData.details.annualDividend}</div>
                      <div className="text-muted-foreground">Annual Dividend</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Action */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-accent-gold" />
                    Invest Now
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Token Price</div>
                    <div className="text-2xl font-bold text-foreground">{assetData.details.tokenPrice}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Minimum Investment</div>
                    <div className="text-lg font-semibold text-foreground">{assetData.details.minInvestment}</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground">Available Tokens</div>
                    <div className="text-lg font-semibold text-foreground">{assetData.tokenomics.availableTokens}</div>
                  </div>
                  <Button variant="hero" className="w-full" size="lg">
                    Invest Now
                  </Button>
                  <Button variant="outline-teal" className="w-full">
                    Download Prospectus
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Financial Performance */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8">Financial Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Rental Income</span>
                      <span className="font-semibold">{assetData.financials.grossRent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net Operating Income</span>
                      <span className="font-semibold">{assetData.financials.netOperatingIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cap Rate</span>
                      <span className="font-semibold">{assetData.financials.capRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Return Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cash-on-Cash Return</span>
                      <span className="font-semibold text-success">{assetData.financials.cashOnCash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Return</span>
                      <span className="font-semibold text-success">{assetData.financials.totalReturn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Appreciation</span>
                      <span className="font-semibold">{assetData.financials.appreciation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tokenomics */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8">Tokenization Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Percent className="w-8 h-8 text-accent-teal mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">{assetData.tokenomics.totalTokens}</div>
                  <div className="text-muted-foreground">Total Tokens</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 text-accent-gold mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">{assetData.tokenomics.tokenHolders}</div>
                  <div className="text-muted-foreground">Token Holders</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Shield className="w-8 h-8 text-success mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">{assetData.tokenomics.soldTokens}</div>
                  <div className="text-muted-foreground">Tokens Sold</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">{assetData.tokenomics.averageHolding}</div>
                  <div className="text-muted-foreground">Avg Holding</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Asset Management */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8">Asset Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Property Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Management Company</div>
                      <div className="font-semibold">{assetData.details.propertyManager}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Valuation</div>
                      <div className="font-semibold">{assetData.details.lastValuation}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Management Fee</div>
                      <div className="font-semibold">2.5% of gross revenue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance & Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-success" />
                      <span>SEC Regulation D Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-success" />
                      <span>KYC/AML Verified Investors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-success" />
                      <span>Smart Contract Audited</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-success" />
                      <span>Insurance Coverage: $50M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AssetDetails;