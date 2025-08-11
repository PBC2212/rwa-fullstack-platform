import { PieChart, TrendingUp, Shield, Banknote, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InvestorsSection = () => {
  const benefits = [
    {
      icon: PieChart,
      title: "Fractional Ownership",
      description: "Own a fraction of high-value assets that were previously inaccessible to individual investors.",
      color: "text-accent-teal"
    },
    {
      icon: TrendingUp,
      title: "Enhanced Liquidity",
      description: "Trade your tokens on secondary markets, providing liquidity for traditionally illiquid assets.",
      color: "text-success"
    },
    {
      icon: Shield,
      title: "Transparent Returns",
      description: "Blockchain-verified returns and real-time tracking of your investment performance.",
      color: "text-accent-gold"
    },
    {
      icon: Banknote,
      title: "Lower Barriers",
      description: "Start investing with as little as $100, democratizing access to premium asset classes.",
      color: "text-primary"
    }
  ];

  const investorTypes = [
    {
      type: "Retail Investors",
      description: "Individual investors seeking portfolio diversification",
      minInvestment: "$100",
      features: ["Fractional ownership", "Easy onboarding", "Mobile app access", "24/7 support"]
    },
    {
      type: "Accredited Investors",
      description: "High-net-worth individuals with larger investment capacity",
      minInvestment: "$10,000",
      features: ["Exclusive assets", "Priority access", "Dedicated advisor", "Advanced analytics"]
    },
    {
      type: "Institutional",
      description: "Corporate entities and investment funds",
      minInvestment: "$1,000,000",
      features: ["Bulk investments", "Custom solutions", "API integration", "White-label options"]
    }
  ];

  const performanceMetrics = [
    { label: "Average Annual Return", value: "12.3%", icon: TrendingUp },
    { label: "Portfolio Diversification", value: "95%", icon: PieChart },
    { label: "Average Hold Time", value: "18 months", icon: Clock },
    { label: "Active Investors", value: "50,000+", icon: Users }
  ];

  return (
    <section id="investors" className="py-20 subtle-gradient">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-reveal text-4xl md:text-5xl font-bold text-foreground mb-6">
            For <span className="teal-gradient bg-clip-text text-transparent">Investors</span>
          </h2>
          <p className="scroll-reveal text-xl text-muted-foreground max-w-3xl mx-auto">
            Unlock new investment opportunities with tokenized real-world assets. 
            Enjoy enhanced liquidity, transparency, and access to premium asset classes.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="scroll-reveal hover-lift border-border/50 bg-card/50 backdrop-blur-sm text-center">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4">
                    <IconComponent className={`w-8 h-8 ${benefit.color}`} />
                  </div>
                  <CardTitle className="text-xl text-foreground">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Investor Types */}
        <div className="scroll-reveal mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">
            Investment Options for Every Investor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {investorTypes.map((type, index) => (
              <Card key={index} className="hover-lift border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-foreground mb-2">{type.type}</CardTitle>
                  <p className="text-muted-foreground">{type.description}</p>
                  <div className="text-3xl font-bold text-accent-teal mt-4">{type.minInvestment}</div>
                  <div className="text-sm text-muted-foreground">Minimum Investment</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-accent-teal rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline-teal" className="w-full mt-6">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="scroll-reveal bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-8">
            Investment Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {performanceMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="text-center">
                  <IconComponent className="w-8 h-8 text-accent-teal mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">{metric.value}</div>
                  <div className="text-muted-foreground text-sm">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="scroll-reveal text-center bg-muted/30 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Ready to Start Investing?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are already building diversified portfolios 
            with tokenized real-world assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              Start Investing Today
            </Button>
            <Button variant="outline-teal" size="lg">
              View Investment Guide
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestorsSection;