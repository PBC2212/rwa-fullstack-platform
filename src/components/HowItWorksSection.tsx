import { Building2, Shield, Coins, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Building2,
      title: "Asset Acquisition",
      description: "We identify and acquire high-value real-world assets including real estate, commodities, and other tangible investments.",
      color: "text-accent-teal"
    },
    {
      icon: Shield,
      title: "Due Diligence & Compliance",
      description: "Rigorous verification, legal compliance, and KYC/AML procedures ensure security and regulatory adherence.",
      color: "text-accent-gold"
    },
    {
      icon: Coins,
      title: "Tokenization",
      description: "Assets are digitized into blockchain tokens, enabling fractional ownership and seamless trading on our platform.",
      color: "text-success"
    },
    {
      icon: ArrowRight,
      title: "Investment & Trading",
      description: "Investors can purchase tokens, trade on secondary markets, and receive proportional returns from the underlying assets.",
      color: "text-primary"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-reveal text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It <span className="teal-gradient bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="scroll-reveal text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process transforms traditional assets into digital investment opportunities through cutting-edge blockchain technology.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="scroll-reveal hover-lift border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full teal-gradient text-white font-bold text-lg mb-6">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-6">
                    <IconComponent className={`w-16 h-16 mx-auto ${step.color}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Process Flow Visual */}
        <div className="hidden lg:flex justify-center items-center mt-12 space-x-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center">
              <div className="w-8 h-1 bg-accent-teal rounded-full"></div>
              <ArrowRight className="w-6 h-6 text-accent-teal mx-2" />
            </div>
          ))}
          <div className="w-8 h-1 bg-accent-teal rounded-full"></div>
        </div>

        {/* Additional Info */}
        <div className="scroll-reveal mt-16 text-center">
          <div className="bg-muted/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              End-to-End Security & Transparency
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Every step of our process is designed with security, compliance, and transparency at its core. 
              From initial asset acquisition to final token distribution, we maintain the highest standards 
              of due diligence and regulatory compliance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;