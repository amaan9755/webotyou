import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  website_url: z.string().url("Valid website URL is required").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

// Replace this with your actual Google Sheets Apps Script URL
const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbzw-aqoqnttNFBuawTxRBPvs-GrW0ZrMbE27jET0V0UA94rTxs_43oDsy7xO17Dcv5dcA/exec";

export default function CallToAction() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    website_url: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      // Send data to Google Sheets
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.warn("Failed to sync with Google Sheets:", error);
      }

      //  Also keep your existing backend logic
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for your inquiry. We'll get back to you soon!",
      });
      setFormData({
        name: "",
        email: "",
        website_url: "",
        message: "",
      });
      setErrors({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit your inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      contactSchema.parse(formData);
      setErrors({});
      submitMutation.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<ContactForm> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as keyof ContactForm] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section
      id="contact"
      className="py-20 gradient-bg"
      data-testid="call-to-action-section"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground">
          Ready to Transform Your Customer Support?
        </h2>
        <p
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
          data-testid="text-cta-intro"
        >
          Join hundreds of businesses that have revolutionized their customer
          experience with our intelligent chatbot solutions.
        </p>

        <Card
          className="max-w-md mx-auto bg-card border-border card-tilt relative"
          data-testid="card-contact-form"
        >
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6">
              Get Your Custom Chatbot
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
                  data-testid="input-contact-name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Business Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
                  data-testid="input-contact-email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  type="url"
                  placeholder="Your Website URL (optional)"
                  value={formData.website_url}
                  onChange={(e) =>
                    handleInputChange("website_url", e.target.value)
                  }
                  className="w-full bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
                  data-testid="input-contact-website"
                />
                {errors.website_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.website_url}
                  </p>
                )}
              </div>

              <div>
                <Textarea
                  placeholder="Tell us about your business needs..."
                  rows={3}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="w-full bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
                  data-testid="textarea-contact-message"
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium btn-micro-animation"
                data-testid="button-submit-contact"
              >
                {submitMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⚡</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Get Started Today
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
