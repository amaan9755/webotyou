import { 
  type User, 
  type InsertUser,
  type WebsiteAnalysis,
  type InsertWebsiteAnalysis,
  type ChatMessage,
  type InsertChatMessage,
  type ContactInquiry,
  type InsertContactInquiry
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWebsiteAnalysisByUrl(url: string): Promise<WebsiteAnalysis | undefined>;
  createWebsiteAnalysis(analysis: InsertWebsiteAnalysis): Promise<WebsiteAnalysis>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionId: string, limit?: number): Promise<ChatMessage[]>;
  
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private websiteAnalyses: Map<string, WebsiteAnalysis>;
  private chatMessages: Map<string, ChatMessage>;
  private contactInquiries: Map<string, ContactInquiry>;

  constructor() {
    this.users = new Map();
    this.websiteAnalyses = new Map();
    this.chatMessages = new Map();
    this.contactInquiries = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWebsiteAnalysisByUrl(url: string): Promise<WebsiteAnalysis | undefined> {
    return Array.from(this.websiteAnalyses.values()).find(
      (analysis) => analysis.url === url
    );
  }

  async createWebsiteAnalysis(insertAnalysis: InsertWebsiteAnalysis): Promise<WebsiteAnalysis> {
    const id = randomUUID();
    const analysis: WebsiteAnalysis = {
      ...insertAnalysis,
      id,
      created_at: new Date(),
      analysis_data: insertAnalysis.analysis_data || null,
    };
    this.websiteAnalyses.set(id, analysis);
    return analysis;
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      created_at: new Date(),
      is_bot: insertMessage.is_bot || "false",
      website_url: insertMessage.website_url || null,
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatHistory(sessionId: string, limit: number = 20): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values())
      .filter(msg => msg.session_id === sessionId)
      .sort((a, b) => (a.created_at?.getTime() || 0) - (b.created_at?.getTime() || 0))
      .slice(-limit);
    
    return messages;
  }

  async createContactInquiry(insertInquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const id = randomUUID();
    const inquiry: ContactInquiry = {
      ...insertInquiry,
      id,
      created_at: new Date(),
      website_url: insertInquiry.website_url || null,
    };
    this.contactInquiries.set(id, inquiry);
    return inquiry;
  }
}

export const storage = new MemStorage();
