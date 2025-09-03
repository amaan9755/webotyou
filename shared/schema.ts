import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const website_analyses = pgTable("website_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  analysis_data: json("analysis_data"),
  created_at: timestamp("created_at").defaultNow(),
});

export const chat_messages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  session_id: varchar("session_id").notNull(),
  message: text("message").notNull(),
  is_bot: text("is_bot").notNull().default("false"),
  website_url: text("website_url"),
  created_at: timestamp("created_at").defaultNow(),
});

export const contact_inquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  website_url: text("website_url"),
  message: text("message").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWebsiteAnalysisSchema = createInsertSchema(website_analyses).pick({
  url: true,
  analysis_data: true,
});

export const insertChatMessageSchema = createInsertSchema(chat_messages).pick({
  session_id: true,
  message: true,
  is_bot: true,
  website_url: true,
});

export const insertContactInquirySchema = createInsertSchema(contact_inquiries).pick({
  name: true,
  email: true,
  website_url: true,
  message: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWebsiteAnalysis = z.infer<typeof insertWebsiteAnalysisSchema>;
export type WebsiteAnalysis = typeof website_analyses.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chat_messages.$inferSelect;

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contact_inquiries.$inferSelect;

// API response types
export type WebsiteAnalysisResponse = {
  domain: string;
  business_type: string;
  services: string[];
  description: string;
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  key_features?: string[];
};

export type ChatResponse = {
  message: string;
  session_id: string;
};
