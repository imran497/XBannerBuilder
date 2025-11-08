import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const githubUsers = pgTable("github_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  githubId: text("github_id").notNull().unique(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  accessToken: text("access_token").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bannerDesigns = pgTable("banner_designs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  githubUserId: varchar("github_user_id").references(() => githubUsers.id),
  name: text("name").notNull(),
  canvasData: jsonb("canvas_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGithubUserSchema = createInsertSchema(githubUsers).omit({
  id: true,
  createdAt: true,
});

export const insertBannerDesignSchema = createInsertSchema(bannerDesigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GitHubUser = typeof githubUsers.$inferSelect;
export type InsertGitHubUser = z.infer<typeof insertGithubUserSchema>;
export type BannerDesign = typeof bannerDesigns.$inferSelect;
export type InsertBannerDesign = z.infer<typeof insertBannerDesignSchema>;
