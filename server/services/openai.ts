import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function analyzeWebsiteWithAI(websiteContent: string, url: string) {
  try {
    const prompt = `Analyze the following website content and provide a JSON response with business information:

Website URL: ${url}
Website Content: ${websiteContent}

Please analyze this website and respond with JSON in this exact format:
{
  "domain": "example.com",
  "business_type": "Technology Company / E-commerce / Service Provider / etc.",
  "services": ["service1", "service2", "service3"],
  "description": "Brief description of the business",
  "contact_info": {
    "email": "email if found",
    "phone": "phone if found",
    "address": "address if found"
  },
  "key_features": ["feature1", "feature2", "feature3"]
}

Focus on extracting factual information from the website content. If certain information is not available, use null for missing fields.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a website analyst that extracts business information from website content. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const analysisResult = JSON.parse(response.choices[0].message.content || "{}");
    return analysisResult;
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to analyze website with AI");
  }
}

export async function generateChatResponse(
  message: string, 
  websiteData: any, 
  conversationHistory: string[] = []
) {
  try {
    const contextPrompt = `You are a helpful AI assistant representing a website analysis chatbot. You have analyzed the following website:

Website: ${websiteData.domain}
Business Type: ${websiteData.business_type}
Services: ${websiteData.services?.join(", ") || "Unknown"}
Description: ${websiteData.description || "No description available"}
Contact Info: ${JSON.stringify(websiteData.contact_info || {})}
Key Features: ${websiteData.key_features?.join(", ") || "Unknown"}

Previous conversation context:
${conversationHistory.slice(-6).join("\n")}

User's current question: ${message}

Please provide a helpful, informative response about this website/business. Keep responses concise but informative. If the user asks about something not covered in the website data, be honest about limitations while still being helpful.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable AI assistant helping users learn about websites and businesses. Provide accurate, helpful responses based on the website analysis data provided."
        },
        {
          role: "user",
          content: contextPrompt
        }
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI chat error:", error);
    throw new Error("Failed to generate chat response");
  }
}
