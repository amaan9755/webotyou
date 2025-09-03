import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#benefits", label: "Benefits" },
    { href: "#demo", label: "Demo" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border" data-testid="navigation">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2" data-testid="logo">
            <Bot className="text-primary text-2xl" />
            <span className="text-xl font-bold">WeBotYou</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`nav-link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                  });
                  // Add highlight effect
                  contactSection.classList.add('animate-pulse');
                  setTimeout(() => contactSection.classList.remove('animate-pulse'), 2000);
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium glow-effect btn-micro-animation"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-card border-border">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
                    data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </button>
                ))}
                <Button
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                      // Add highlight effect
                      contactSection.classList.add('animate-pulse');
                      setTimeout(() => contactSection.classList.remove('animate-pulse'), 2000);
                    }
                    setIsOpen(false); // Close mobile menu
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium mt-4 btn-micro-animation"
                  data-testid="button-mobile-get-started"
                >
                  Get Started
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
