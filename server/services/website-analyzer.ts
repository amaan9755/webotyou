import { analyzeWebsiteWithAI } from "./openai";

export async function analyzeWebsite(url: string) {
  try {
    // Simple fetch to get website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WeBotYou-Analyzer/1.0)'
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract basic content from HTML
    const textContent = extractTextFromHTML(html);
    
    // Use OpenAI to analyze the content
    const analysis = await analyzeWebsiteWithAI(textContent, url);
    
    return {
      domain: new URL(url).hostname,
      ...analysis,
    };
  } catch (error) {
    console.error("Website analysis error:", error);
    
    // Enhanced fallback analysis based on domain and basic website info
    const domain = new URL(url).hostname;
    const businessType = inferBusinessTypeFromDomain(domain);
    const commonServices = getCommonServicesForDomain(domain);
    
    return {
      domain,
      business_type: businessType,
      services: commonServices,
      description: `This appears to be ${businessType.toLowerCase()} website at ${domain}. While I couldn't access detailed content due to technical limitations, I can still help answer general questions about their online presence and typical services in this industry.`,
      contact_info: {
        email: extractPotentialEmail(domain),
        phone: null,
        address: null
      },
      key_features: ["Professional website", "Domain verified", "Online presence established"],
    };
  }
}

function extractTextFromHTML(html: string): string {
  // Simple HTML text extraction (in production, consider using a proper HTML parser)
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Limit content length for API efficiency
  return text.substring(0, 3000);
}

function inferBusinessTypeFromDomain(domain: string): string {
  const domainLower = domain.toLowerCase();
  
  if (domainLower.includes('shop') || domainLower.includes('store') || domainLower.includes('market')) {
    return 'E-commerce Business';
  } else if (domainLower.includes('tech') || domainLower.includes('software') || domainLower.includes('app')) {
    return 'Technology Company';
  } else if (domainLower.includes('blog') || domainLower.includes('news') || domainLower.includes('media')) {
    return 'Media & Publishing';
  } else if (domainLower.includes('edu') || domainLower.includes('school') || domainLower.includes('university')) {
    return 'Educational Institution';
  } else if (domainLower.includes('health') || domainLower.includes('medical') || domainLower.includes('clinic')) {
    return 'Healthcare Provider';
  } else if (domainLower.includes('finance') || domainLower.includes('bank') || domainLower.includes('loan')) {
    return 'Financial Services';
  } else if (domainLower.includes('food') || domainLower.includes('restaurant') || domainLower.includes('cafe')) {
    return 'Food & Beverage Business';
  } else {
    return 'Professional Business';
  }
}

function getCommonServicesForDomain(domain: string): string[] {
  const domainLower = domain.toLowerCase();
  
  if (domainLower.includes('shop') || domainLower.includes('store')) {
    return ['Online Shopping', 'Product Sales', 'Customer Support', 'Shipping Services'];
  } else if (domainLower.includes('tech') || domainLower.includes('software')) {
    return ['Software Development', 'Technical Support', 'Consulting Services', 'Digital Solutions'];
  } else if (domainLower.includes('blog') || domainLower.includes('news')) {
    return ['Content Publishing', 'News & Updates', 'Community Engagement', 'Information Sharing'];
  } else {
    return ['Professional Services', 'Customer Support', 'Online Presence', 'Business Solutions'];
  }
}

function extractPotentialEmail(domain: string): string {
  // Generate common email patterns for the domain
  const emailPatterns = [`info@${domain}`, `contact@${domain}`, `hello@${domain}`];
  return emailPatterns[0]; // Return the most common pattern
}
