import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MapPin, Calendar, DollarSign } from "lucide-react";
import realEstateImage from "@/assets/real-estate-token.jpg";
import commoditiesImage from "@/assets/commodities-token.jpg";

const AssetsSection = () => {
  const assets = [
    {
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
      description: "Luxury commercial real estate in prime Manhattan location with stable rental income and appreciation potential."
    },
    {
      id: 2,
      name: "Ruby Structured Deal",
      type: "Commodities",
      image: commoditiesImage,
      value: "$28.7M",
      tokenized: "92%",
      roi: "+8.9%",
      location: "Swiss Vault",
      status: "Fully Tokenized",
      investors: 20,
      description: "Certified ruby stored in secure Swiss vaults, providing hedge against inflation and market volatility."
    },
    {
      id: 3,
      name: "Industrial Complex Dallas",
      type: "Real Estate",
      image: realEstateImage,
      value: "$32.1M",
      tokenized: "67%",
      roi: "+15.2%",
      location: "Dallas, TX",
      status: "Tokenizing",
      investors: 634,
      description: "State-of-the-art industrial facility with long-term corporate leases and expansion opportunities."
    },
    {
      id: 4,
      name: "Precious Metals Collection",
      type: "Commodities",
      image: commoditiesImage,
      value: "$19.8M",
      tokenized: "100%",
      roi: "+11.7%",
      location: "London Vault",
      status: "Complete",
      investors: 567,
      description: "Diversified portfolio of precious metals including platinum, silver, and rare earth elements."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active Trading":
        return "bg-success text-success-foreground";
      case "Fully Tokenized":
        return "bg-accent-teal text-accent-teal-foreground";
      case "Tokenizing":
        return "bg-accent-gold text-accent-gold-foreground";
      case "Complete":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="assets" className="py-20 subtle-gradient">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-reveal text-4xl md:text-5xl font-bold text-foreground mb-6">
            Tokenized <span className="gold-gradient bg-clip-text text-transparent">Assets</span>
          </h2>
          <p className="scroll-reveal text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of carefully selected and tokenized real-world assets, 
            each offering unique investment opportunities and verified returns.
          </p>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {assets.map((asset, index) => (
            <Card key={asset.id} className="scroll-reveal hover-lift overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              {/* Asset Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={asset.image} 
                  alt={asset.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/90 text-foreground">
                    {asset.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{asset.name}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{asset.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{asset.value}</div>
                    <div className="flex items-center text-success">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{asset.roi}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {asset.description}
                </p>

                {/* Asset Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{asset.tokenized}</div>
                    <div className="text-xs text-muted-foreground">Tokenized</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{asset.investors}</div>
                    <div className="text-xs text-muted-foreground">Investors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{asset.roi}</div>
                    <div className="text-xs text-muted-foreground">12M ROI</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="hero" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline-teal" className="flex-1">
                    Invest Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Assets */}
        <div className="scroll-reveal text-center">
          <Button variant="outline-teal" size="lg">
            View All Assets
          </Button>
        </div>

        {/* Portfolio Summary */}
        <div className="scroll-reveal mt-16 bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <DollarSign className="w-8 h-8 text-accent-teal mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">$125.8M</div>
              <div className="text-muted-foreground">Total Asset Value</div>
            </div>
            <div>
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">12.1%</div>
              <div className="text-muted-foreground">Average ROI</div>
            </div>
            <div>
              <Calendar className="w-8 h-8 text-accent-gold mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">18</div>
              <div className="text-muted-foreground">Active Assets</div>
            </div>
            <div>
              <Badge className="w-8 h-8 text-primary mx-auto mb-3 flex items-center justify-center">
                <span className="text-xs">98%</span>
              </Badge>
              <div className="text-3xl font-bold text-foreground mb-2">98%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssetsSection;