import { Bot, Heart } from "lucide-react";
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Custom Chatbots", href: "#" },
        { name: "AI Integration", href: "#" },
        { name: "Support & Maintenance", href: "#" },
        { name: "Analytics Dashboard", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaGithub, href: "#", label: "GitHub" },
    { icon: FaEnvelope, href: "mailto:hello@webotyou.com", label: "Email" },
  ];

  return (
    <footer className="bg-background border-t border-border py-12" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4" data-testid="footer-logo">
              <Bot className="text-primary text-2xl" />
              <span className="text-xl font-bold">WeBotYou</span>
            </div>
            <p className="text-muted-foreground" data-testid="text-footer-description">
              Intelligent chatbot solutions for modern businesses. We've got you covered.
            </p>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-muted-foreground">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="hover:text-foreground transition-colors"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                  data-testid={`social-link-${social.label.toLowerCase()}`}
                >
                  <social.icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p data-testid="text-copyright">
            &copy; {currentYear} WeBotYou. All rights reserved. Made with{" "}
            <Heart className="inline-block w-4 h-4 text-red-500 mx-1" /> for better customer experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}
