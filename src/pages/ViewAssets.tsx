import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, MapPin, Users, DollarSign, Filter, Building, Gem, BarChart3, Clock, Shield, AlertCircle } from "lucide-react";
import { useAssets } from "@/hooks/useAssets";
import realEstateImage from "@/assets/real-estate-token.jpg";
import commoditiesImage from "@/assets/commodities-token.jpg";

const ViewAssets = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");
  
  const { data: assets, isLoading, error } = useAssets(selectedFilter);

  // Helper function to format asset data for display
  const formatAsset = (asset: any) => ({
    id: asset.id,
    name: asset.name,
    type: asset.type,
    image: asset.type === "Real Estate" ? realEstateImage : commoditiesImage,
    value: `$${(asset.value_amount / 1000000).toFixed(1)}M`,
    tokenized: `${asset.tokenized_percentage}%`,
    roi: `+${asset.roi_percentage}%`,
    location: asset.location,
    status: asset.status,
    investors: asset.investors_count,
    totalTokens: asset.total_tokens.toLocaleString(),
    availableTokens: asset.available_tokens.toLocaleString(),
    tokenPrice: `$${asset.token_price.toLocaleString()}`,
    minimumInvestment: `$${asset.minimum_investment.toLocaleString()}`,
    description: asset.description,
    highlights: asset.highlights
  });

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

  // Calculate metrics from live data
  const totalValue = assets ? assets.reduce((sum, asset) => sum + (asset.value_amount / 1000000), 0) : 0;
  const averageROI = assets ? assets.reduce((sum, asset) => sum + asset.roi_percentage, 0) / assets.length : 0;
  const totalInvestors = assets ? assets.reduce((sum, asset) => sum + asset.investors_count, 0) : 0;

  // Format assets for display
  const formattedAssets = assets ? assets.map(formatAsset) : [];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 gold-gradient">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Tokenized Asset <span className="text-black">Marketplace</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover premium real-world assets that have been tokenized for fractional ownership. 
              Invest in real estate and commodities with full transparency and liquidity.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">${totalValue.toFixed(1)}M</div>
                <div className="text-white/80">Total Asset Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{averageROI.toFixed(1)}%</div>
                <div className="text-white/80">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalInvestors.toLocaleString()}</div>
                <div className="text-white/80">Active Investors</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-bold text-foreground">Available Assets</h2>
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <div className="flex gap-2">
                  {["All", "Real Estate", "Commodities"].map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedFilter === filter ? "hero" : "outline"}
                      onClick={() => setSelectedFilter(filter)}
                      className="min-w-[100px]"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Assets Grid */}
        <section className="pb-20 bg-background">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                      <div className="flex gap-3">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Failed to load assets</h3>
                <p className="text-muted-foreground mb-4">{error.message}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {formattedAssets.map((asset) => (
                <Card key={asset.id} className="hover-lift overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                  {/* Asset Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={asset.image} 
                      alt={asset.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-background/90 text-foreground">
                        {asset.type === "Real Estate" ? (
                          <><Building className="w-3 h-3 mr-1" />{asset.type}</>
                        ) : (
                          <><Gem className="w-3 h-3 mr-1" />{asset.type}</>
                        )}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-foreground">{asset.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{asset.value}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {asset.location}
                      </div>
                      <div className="flex items-center text-success">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-medium">{asset.roi} ROI</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {asset.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {asset.highlights.slice(0, 2).map((highlight) => (
                        <Badge key={highlight} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground">{asset.tokenized}</div>
                        <div className="text-xs text-muted-foreground">Tokenized</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground">{asset.investors}</div>
                        <div className="text-xs text-muted-foreground">Investors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground">{asset.tokenPrice}</div>
                        <div className="text-xs text-muted-foreground">Token Price</div>
                      </div>
                    </div>

                    {/* Investment Details */}
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available Tokens:</span>
                        <span className="font-medium">{asset.availableTokens}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min. Investment:</span>
                        <span className="font-medium">{asset.minimumInvestment}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => asset.id === 1 && navigate(`/asset/${asset.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="hero" 
                        className="flex-1"
                        disabled={asset.availableTokens === "0"}
                      >
                        {asset.availableTokens === "0" ? "Sold Out" : "Invest Now"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Market Overview */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Market Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center p-6">
                <DollarSign className="w-12 h-12 text-accent-teal mx-auto mb-4" />
                <div className="text-2xl font-bold text-foreground mb-2">${totalValue.toFixed(1)}M</div>
                <div className="text-muted-foreground">Total Asset Value</div>
              </Card>
              <Card className="text-center p-6">
                <BarChart3 className="w-12 h-12 text-success mx-auto mb-4" />
                <div className="text-2xl font-bold text-foreground mb-2">{averageROI.toFixed(1)}%</div>
                <div className="text-muted-foreground">Average Returns</div>
              </Card>
              <Card className="text-center p-6">
                <Users className="w-12 h-12 text-accent-gold mx-auto mb-4" />
                <div className="text-2xl font-bold text-foreground mb-2">{totalInvestors.toLocaleString()}</div>
                <div className="text-muted-foreground">Active Investors</div>
              </Card>
              <Card className="text-center p-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-2xl font-bold text-foreground mb-2">100%</div>
                <div className="text-muted-foreground">Verified Assets</div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ViewAssets;