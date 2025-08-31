import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Coins, TrendingUp } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    const scrollElements = document.querySelectorAll(".scroll-reveal");
    scrollElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(56, 178, 172, 0.6)), url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-gold/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-accent-teal/20 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="scroll-reveal text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Turning Real Assets Into{" "}
            <span className="gold-gradient bg-clip-text text-transparent">
              Digital Opportunities
            </span>
          </h1>

          {/* Subheadline */}
          <p className="scroll-reveal text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Tokenize real-world assets and unlock new investment possibilities through secure blockchain technology. 
            Access fractional ownership of premium assets like never before.
          </p>

          {/* Trust Indicators */}
          <div className="scroll-reveal flex justify-center items-center space-x-8 mb-10 text-white/80">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Regulatory Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-accent-gold" />
              <span className="text-sm font-medium">Blockchain Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-accent-teal" />
              <span className="text-sm font-medium">Premium Assets</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="scroll-reveal flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="xl" 
              className="group"
              onClick={() => navigate('/start-tokenization')}
            >
              Start Tokenizing
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="glass" 
              size="xl"
              onClick={() => navigate('/learn-how-it-works')}
            >
              Learn How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">$2.4B+</div>
              <div className="text-white/70">Assets Tokenized</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/70">Active Investors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/70">Platform Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;