import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Search, 
  Shield, 
  Coins, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const LearnHowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      title: "Asset Acquisition",
      description: "We identify and acquire high-value real-world assets through rigorous market analysis and strategic partnerships.",
      color: "text-accent-gold"
    },
    {
      icon: Shield,
      title: "Due Diligence & Compliance",
      description: "Rigorous legal checks, KYC/AML procedures, and full regulatory adherence ensure complete transparency.",
      color: "text-success"
    },
    {
      icon: Coins,
      title: "Tokenization",
      description: "Assets are converted into secure blockchain tokens, enabling fractional ownership and digital trading.",
      color: "text-accent-teal"
    },
    {
      icon: TrendingUp,
      title: "Investment & Trading",
      description: "Investors purchase and trade tokens seamlessly, receiving proportional returns from asset performance.",
      color: "text-accent-gold"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary-light to-accent-teal text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How Tokenization Works
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              From real-world assets to digital investment opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              The Complete Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined approach ensures secure, compliant, and profitable asset tokenization
            </p>
          </div>

          {/* Timeline Visual */}
          <div className="relative mb-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-accent-gold via-success to-accent-teal rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="relative">
                    <Card className="hover-lift bg-card border-border h-full">
                      <CardContent className="p-6 text-center">
                        {/* Step Number */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm z-10">
                          {index + 1}
                        </div>
                        
                        {/* Icon */}
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center`}>
                          <IconComponent className={`w-8 h-8 ${step.color}`} />
                        </div>
                        
                        {/* Content */}
                        <h3 className="text-xl font-bold text-foreground mb-3">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-muted rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Why Choose Our Platform?
              </h3>
              <p className="text-lg text-muted-foreground">
                Built for security, designed for growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Regulatory Compliant
                </h4>
                <p className="text-muted-foreground">
                  Full compliance with financial regulations and legal frameworks
                </p>
              </div>
              
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-accent-teal mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Blockchain Security
                </h4>
                <p className="text-muted-foreground">
                  Advanced blockchain technology ensures transparent and secure transactions
                </p>
              </div>
              
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-accent-gold mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Fractional Access
                </h4>
                <p className="text-muted-foreground">
                  Invest in premium assets with minimal capital requirements
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent-teal text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of investors who are already benefiting from tokenized assets
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="xl" 
                className="group"
                onClick={() => navigate('/start-tokenization')}
              >
                Start Tokenization
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="glass" 
                size="xl"
                onClick={() => navigate('/assets')}
              >
                View Assets
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearnHowItWorks;