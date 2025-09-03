import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, TrendingUp } from "lucide-react";

export default function BrandDescription() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant responses to customer queries, 24/7 availability without any downtime.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with reliable performance you can trust.",
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Detailed insights into customer interactions and behavior patterns.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-card" data-testid="brand-description-section">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground">
            Our <span className="text-primary">Mission</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12" data-testid="text-mission">
            To provide companies and manufacturers their own intelligent chatbot embedded on their website, which helps handle customer queries while they focus on making profit, without worrying about query handling and customer support.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`bg-background border-border card-hover card-tilt relative ${index % 2 === 1 ? 'card-tilt-reverse' : ''}`}
                data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardContent className="p-8 text-center">
                  <feature.icon className="text-primary text-4xl mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
