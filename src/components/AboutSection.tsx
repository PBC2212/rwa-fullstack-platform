import { Award, Target, Users, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import teamPhoto from "@/assets/team-photo.jpg";

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Mission",
      description: "To democratize access to high-value real-world assets through innovative blockchain tokenization, making premium investments accessible to everyone."
    },
    {
      icon: Globe,
      title: "Vision",
      description: "To become the world's leading platform for real-world asset tokenization, bridging traditional finance with the digital asset economy."
    },
    {
      icon: Award,
      title: "Values",
      description: "Transparency, security, innovation, and accessibility drive everything we do, ensuring trust and value for all our stakeholders."
    }
  ];

  const achievements = [
    { number: "$2.4B+", label: "Assets Under Management" },
    { number: "50,000+", label: "Active Investors" },
    { number: "18", label: "Tokenized Assets" },
    { number: "99.9%", label: "Platform Uptime" }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Chief Executive Officer",
      bio: "Former Goldman Sachs VP with 15+ years in asset management and fintech innovation."
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Technology Officer",
      bio: "Blockchain architect with experience at JPMorgan and deep expertise in smart contracts."
    },
    {
      name: "David Kim",
      role: "Chief Compliance Officer",
      bio: "Former SEC attorney specializing in securities law and regulatory compliance."
    },
    {
      name: "Lisa Thompson",
      role: "Head of Investor Relations",
      bio: "Investment banking veteran with expertise in alternative investments and client relations."
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-reveal text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="gold-gradient bg-clip-text text-transparent">IME Capital Trust</span>
          </h2>
          <p className="scroll-reveal text-xl text-muted-foreground max-w-3xl mx-auto">
            We're pioneering the future of asset ownership through blockchain technology, 
            making real-world investments more accessible, transparent, and liquid.
          </p>
        </div>

        {/* Company Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Card key={index} className="scroll-reveal hover-lift border-border/50 bg-card/50 backdrop-blur-sm text-center">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full teal-gradient mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Achievements */}
        <div className="scroll-reveal bg-muted/30 rounded-2xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-8">
            Our Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {achievements.map((achievement, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-accent-teal mb-2">{achievement.number}</div>
                <div className="text-muted-foreground">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="scroll-reveal mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">
            Leadership Team
          </h3>
          
          {/* Team Photo */}
          <div className="mb-12">
            <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden">
              <img 
                src={teamPhoto} 
                alt="IME Capital Trust Leadership Team"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-primary/20"></div>
            </div>
          </div>

          {/* Team Bios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="hover-lift border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold text-foreground mb-2">{member.name}</h4>
                  <div className="text-accent-teal font-medium mb-4">{member.role}</div>
                  <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Story */}
        <div className="scroll-reveal bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Our Story
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Founded in 2020 by a team of finance and technology veterans, IME Capital Trust emerged from the vision 
              to democratize access to high-value assets. We recognized that traditional investment barriers 
              were keeping everyday investors from accessing the same opportunities available to institutions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Through innovative blockchain technology and rigorous compliance standards, we've created a 
              platform that bridges the gap between traditional asset management and the digital economy. 
              Our tokenization process transforms illiquid assets into accessible, tradeable digital tokens.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we're proud to serve over 300 investors worldwide, having tokenized billions in 
              real-world assets and maintained industry-leading security and compliance standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;