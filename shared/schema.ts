import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(), // 'personality' | 'astrology' | 'relationships'
  tags: text("tags").array(),
  authorId: integer("author_id").references(() => users.id),
  createdAt: text("created_at").notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").references(() => users.id),
  postId: integer("post_id").references(() => blogPosts.id),
  createdAt: text("created_at").notNull(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'deep-dive' | 'quick-read' | 'visual'
  questions: jsonb("questions").notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  quizId: integer("quiz_id").references(() => quizzes.id),
  answers: jsonb("answers").notNull(),
  result: jsonb("result").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const zodiacGames = pgTable("zodiac_games", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sign: text("sign").notNull(),
  matchSign: text("match_sign").notNull(),
  compatibility: integer("compatibility").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  birthDate: text("birth_date").notNull(),
  twitterUsername: text("twitter_username"),
  matchedCharacter: jsonb("matched_character").notNull(),
  compatibility: integer("compatibility").notNull(),
  timestamp: text("timestamp").notNull(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true });
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true });
export const insertQuizResultSchema = createInsertSchema(quizResults).omit({ id: true });
export const insertZodiacGameSchema = createInsertSchema(zodiacGames).omit({ id: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true });

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
export type ZodiacGame = typeof zodiacGames.$inferSelect;
export type Match = typeof matches.$inferSelect;
