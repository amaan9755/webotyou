import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeWebsite } from "./services/website-analyzer";
import { generateChatResponse } from "./services/openai";
import { insertWebsiteAnalysisSchema, insertChatMessageSchema, insertContactInquirySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Website Analysis Endpoint
  app.post("/api/analyze-website", async (req, res) => {
    try {
      const { url } = z.object({ url: z.string().url() }).parse(req.body);
      
      // Check if we have a recent analysis for this URL
      const existingAnalysis = await storage.getWebsiteAnalysisByUrl(url);
      if (existingAnalysis && isRecentAnalysis(existingAnalysis.created_at)) {
        return res.json(existingAnalysis.analysis_data);
      }

      // Perform new analysis
      const analysisData = await analyzeWebsite(url);
      
      // Store the analysis
      await storage.createWebsiteAnalysis({
        url,
        analysis_data: analysisData,
      });

      res.json(analysisData);
    } catch (error) {
      console.error("Website analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze website" 
      });
    }
  });

  // Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, session_id, website_url } = insertChatMessageSchema.extend({
        website_url: z.string().optional(),
      }).parse(req.body);

      // Store user message
      await storage.createChatMessage({
        session_id,
        message,
        is_bot: "false",
        website_url,
      });

      // Get website data if provided
      let websiteData = null;
      if (website_url) {
        const analysis = await storage.getWebsiteAnalysisByUrl(`https://${website_url}`) || 
                         await storage.getWebsiteAnalysisByUrl(`http://${website_url}`);
        websiteData = analysis?.analysis_data;
      }

      // Get conversation history
      const conversationHistory = await storage.getChatHistory(session_id);
      const historyText = conversationHistory.map(msg => 
        `${msg.is_bot === "true" ? "Bot" : "User"}: ${msg.message}`
      );

      // Generate AI response
      let botResponse: string;
      if (websiteData) {
        try {
          botResponse = await generateChatResponse(message, websiteData, historyText);
        } catch (error) {
          // Fallback to rule-based responses when AI is unavailable
          botResponse = generateFallbackResponse(message, websiteData);
        }
      } else {
        botResponse = "I'd be happy to help you! 😊 Please first analyze a website using the 'Bot It!' button above, then I can answer any questions you have about that specific business. I'm here to assist you every step of the way!";
      }

      // Store bot response
      await storage.createChatMessage({
        session_id,
        message: botResponse,
        is_bot: "true",
        website_url,
      });

      res.json({
        message: botResponse,
        session_id,
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process chat message" 
      });
    }
  });

  // Contact Form Endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactInquirySchema.parse(req.body);
      
      await storage.createContactInquiry(contactData);
      
      res.json({ 
        message: "Contact inquiry submitted successfully" 
      });
    } catch (error) {
      console.error("Contact submission error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to submit contact inquiry" 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function isRecentAnalysis(createdAt: Date | null): boolean {
  if (!createdAt) return false;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return createdAt > oneHourAgo;
}

function generateFallbackResponse(message: string, websiteData: any): string {
  const messageLower = message.toLowerCase();
  const domain = websiteData.domain || 'this business';
  const businessType = websiteData.business_type || 'business';
  const services = websiteData.services || [];
  
  // Customer service responses based on common questions
  if (messageLower.includes('what') && (messageLower.includes('do') || messageLower.includes('service'))) {
    return `Great question! Based on my analysis, ${domain} appears to be a ${businessType.toLowerCase()}. Their main services include: ${services.join(', ')}. ${websiteData.description || 'They maintain a professional online presence to serve their customers.'} Is there anything specific about their services you'd like to know more about?`;
  }
  
  if (messageLower.includes('contact') || messageLower.includes('reach') || messageLower.includes('phone') || messageLower.includes('email')) {
    const contactInfo = websiteData.contact_info;
    let response = `I'd be happy to help you get in touch with ${domain}! `;
    if (contactInfo?.email) {
      response += `You can reach them via email at ${contactInfo.email}. `;
    }
    if (contactInfo?.phone) {
      response += `Their phone number is ${contactInfo.phone}. `;
    }
    if (!contactInfo?.email && !contactInfo?.phone) {
      response += `While I don't have their direct contact information from my analysis, I recommend visiting their website at ${domain} where you should find their contact details in the header, footer, or contact page. `;
    }
    response += `Most businesses also respond to inquiries through their website's contact form. How else can I assist you?`;
    return response;
  }
  
  if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('how much')) {
    return `That's a great question about pricing! Unfortunately, I don't have access to ${domain}'s current pricing information from my website analysis. I'd recommend visiting their website directly or contacting them for the most accurate and up-to-date pricing details. Most businesses are happy to provide quotes or pricing information when you reach out to them. Is there anything else about their business I can help you with?`;
  }
  
  if (messageLower.includes('hour') || messageLower.includes('open') || messageLower.includes('when')) {
    return `I don't have the specific operating hours for ${domain} from my analysis. For the most accurate information about their business hours, I'd suggest checking their website directly or giving them a call. Many businesses also list their hours on their contact page or in their website footer. Is there anything else about their business I can help you with?`;
  }
  
  if (messageLower.includes('location') || messageLower.includes('where') || messageLower.includes('address')) {
    const address = websiteData.contact_info?.address;
    if (address) {
      return `According to my analysis, ${domain} is located at ${address}. For the most current location information and directions, I'd recommend checking their website or contacting them directly. How else can I assist you today?`;
    } else {
      return `I don't have the specific location information for ${domain} from my analysis. You can typically find this information on their website's contact page or footer. Many businesses also provide location details and maps on their "About Us" or "Contact" pages. Is there anything else I can help you with?`;
    }
  }
  
  // Generic helpful response
  return `Thank you for your question about ${domain}! While I'd love to provide more specific details, my analysis shows they're a ${businessType.toLowerCase()} offering services like ${services.slice(0, 2).join(' and ')}. For the most detailed and current information, I recommend visiting their website directly or contacting them. They'll be the best source for specific questions about their business. Is there anything else I can help you with? 😊`;
}
