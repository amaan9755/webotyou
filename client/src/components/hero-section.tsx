import { Button } from "@/components/ui/button";
import { useGreeting } from "@/hooks/use-greeting";
import { Rocket, Play, MessageCircle, Brain } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroSection() {
  const greeting = useGreeting();
  const heroRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const starburstRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!brandRef.current || !starburstRef.current) return;

      // Set initial states
      gsap.set(brandRef.current, { opacity: 1 });
      gsap.set(".js-animated-brand", { display: "inline-block" });
      
      // Split text animation (simulate letter-by-letter appearance)
      const chars = brandRef.current.querySelectorAll(".js-char");
      
      if (chars.length === 0) return;
      
      gsap.set(chars, { opacity: 0, y: 50, rotateX: -90 });
      
      // Create timeline for brand animation
      const timeline = gsap.timeline({ delay: 0.5 });
      
      timeline.to(chars, {
        duration: 0.1,
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.08,
        ease: "back.out(1.7)"
      });
      
      // Color wave effect
      timeline.to(chars, {
        duration: 0.5,
        color: "#1db954", // Spotify green
        stagger: 0.05,
      }, "-=0.3");
      
      timeline.to(chars, {
        color: "#1ed760", // Lighter green
        stagger: 0.025,
        duration: 0.25
      }, ">-25%");
      
      timeline.to(chars, {
        color: "hsl(141 76% 48%)", // Use actual primary color
        stagger: 0.025,
        duration: 0.25,
      }, ">-25%");

      // Animate specific letters with special effects
      const flipLetter = brandRef.current.querySelector(".js-flip-letter");
      const swingLetter = brandRef.current.querySelector(".js-swing-letter");
      
      if (flipLetter) {
        timeline.to(flipLetter, {
          rotateY: 360,
          duration: 1,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 3,
          yoyo: true
        }, "-=1");
      }

      if (swingLetter) {
        timeline.to(swingLetter, {
          rotationZ: -15,
          duration: 0.8,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          repeatDelay: 2
        }, "-=1");
      }

      // Starburst animation
      if (starburstRef.current) {
        timeline.to(starburstRef.current, {
          scale: 1.2,
          rotate: 180,
          duration: 1,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          repeatDelay: 4
        }, "-=2");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden pt-20"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            <span data-testid="text-greeting">{greeting}</span>!
          </h1>
          <h2 
            ref={brandRef}
            className="text-3xl md:text-6xl font-bold mb-8 text-primary js-animated-brand"
            data-testid="animated-brand"
          >
            Welcome to{" "}
            <span className="js-char">W</span>
            <span className="js-char">e</span>
            <span className="js-char js-flip-letter">B</span>
            <span className="js-char">o</span>
            <span className="js-char">t</span>
            <span className="js-char js-swing-letter">Y</span>
            <span className="js-char">o</span>
            <span className="js-char">u</span>
            <svg 
              ref={starburstRef}
              className="inline-block w-6 h-6 md:w-8 md:h-8 ml-2 mb-1" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 25 25"
            >
              <circle 
                cx="12.61" 
                cy="12.8" 
                r="7" 
                fill="currentColor"
                className="js-starburst-circle"
              />
            </svg>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Transform your customer support with intelligent chatbots. We've got you covered with cutting-edge AI solutions that handle queries while you focus on growing your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 btn-micro-animation glow-effect rounded-full px-8 py-4 text-lg font-medium"
              data-testid="button-start-journey"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
            <Button
              onClick={() => {
                // TODO: Replace with actual video modal/player integration
                alert('Demo video coming soon! This will open a video showcasing our chatbot capabilities.');
              }}
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-card btn-micro-animation rounded-full px-8 py-4 text-lg font-medium"
              data-testid="button-watch-demo"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-pulse-slow">
        <MessageCircle className="text-primary text-4xl" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-pulse-slow">
        <Brain className="text-primary text-4xl" />
      </div>
    </section>
  );
}
