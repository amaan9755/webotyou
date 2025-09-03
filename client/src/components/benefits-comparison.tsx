import { Card, CardContent } from "@/components/ui/card";
import { Bot, User, CheckCircle, XCircle } from "lucide-react";

export default function BenefitsComparison() {
  const chatbotBenefits = [
    {
      title: "24/7 Availability",
      description: "Never sleeps, always ready to help customers",
    },
    {
      title: "Cost Effective",
      description: "One-time setup vs recurring salary costs",
    },
    {
      title: "Instant Response",
      description: "Millisecond response times",
    },
    {
      title: "Scalable",
      description: "Handle unlimited concurrent conversations",
    },
    {
      title: "No Human Error",
      description: "Consistent, accurate responses every time",
    },
  ];

  const humanLimitations = [
    {
      title: "Limited Hours",
      description: "Requires breaks, shifts, and time off",
    },
    {
      title: "High Costs",
      description: "Salaries, benefits, training, and overhead",
    },
    {
      title: "Variable Response Time",
      description: "Depends on queue and agent availability",
    },
    {
      title: "Limited Capacity",
      description: "Can only handle one conversation at a time",
    },
    {
      title: "Human Fatigue",
      description: "Performance varies with mood and energy",
    },
  ];

  return (
    <section id="benefits" className="py-20 gradient-bg" data-testid="benefits-comparison-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground">
            Why Choose <span className="text-primary">AI Chatbots</span> Over Human Support?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-benefits-intro">
            Companies don't have to spend much on human support when they have a manageable flow of queries that can be easily handled by intelligent chatbots.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Chatbot Advantages */}
          <Card className="bg-card border-primary/20 card-tilt relative" data-testid="card-chatbot-benefits">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Bot className="text-primary text-5xl mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-primary">AI Chatbot</h3>
              </div>
              
              <div className="space-y-6">
                {chatbotBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4" data-testid={`benefit-chatbot-${index}`}>
                    <CheckCircle className="text-primary text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">{benefit.title}</h4>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Human Support Limitations */}
          <Card className="bg-card border-muted/20 card-tilt card-tilt-reverse relative" data-testid="card-human-limitations">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <User className="text-muted-foreground text-5xl mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-muted-foreground">Human Support</h3>
              </div>
              
              <div className="space-y-6">
                {humanLimitations.map((limitation, index) => (
                  <div key={index} className="flex items-start space-x-4" data-testid={`limitation-human-${index}`}>
                    <XCircle className="text-red-500 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">{limitation.title}</h4>
                      <p className="text-muted-foreground text-sm">{limitation.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
