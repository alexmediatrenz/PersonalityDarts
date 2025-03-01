import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertQuizResultSchema, insertZodiacGameSchema, insertMatchSchema, insertBlogPostSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Blog routes
  app.get("/api/blog-posts", async (req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    const post = await storage.getBlogPost(parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(post);
  });

  app.get("/api/blog-posts/category/:category", async (req, res) => {
    const posts = await storage.getBlogPostsByCategory(req.params.category);
    res.json(posts);
  });

  app.post("/api/blog-posts", async (req, res) => {
    const post = insertBlogPostSchema.parse(req.body);
    const savedPost = await storage.createBlogPost(post);
    res.json(savedPost);
  });

  app.get("/api/blog-posts/:postId/comments", async (req, res) => {
    const comments = await storage.getComments(parseInt(req.params.postId));
    res.json(comments);
  });

  app.post("/api/blog-posts/:postId/comments", async (req, res) => {
    const comment = insertCommentSchema.parse(req.body);
    const savedComment = await storage.createComment(comment);
    res.json(savedComment);
  });

  // Quiz routes
  app.get("/api/quizzes", async (req, res) => {
    const quizzes = await storage.getQuizzes();
    res.json(quizzes);
  });

  app.get("/api/quizzes/:id", async (req, res) => {
    const quiz = await storage.getQuiz(parseInt(req.params.id));
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  });

  app.post("/api/quiz-results", async (req, res) => {
    const result = insertQuizResultSchema.parse(req.body);
    const savedResult = await storage.saveQuizResult(result);
    res.json(savedResult);
  });

  // Zodiac game routes
  app.post("/api/zodiac-games", async (req, res) => {
    const game = insertZodiacGameSchema.parse(req.body);
    const savedGame = await storage.saveZodiacGame(game);
    res.json(savedGame);
  });

  app.get("/api/zodiac-games/recent", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const games = await storage.getRecentZodiacGames(limit);
    res.json(games);
  });

  // Match generator routes
  app.post("/api/matches", async (req, res) => {
    const match = insertMatchSchema.parse(req.body);
    const savedMatch = await storage.createMatch(match);
    res.json(savedMatch);
  });

  app.get("/api/matches/user/:userId", async (req, res) => {
    const matches = await storage.getMatchesForUser(parseInt(req.params.userId));
    res.json(matches);
  });

  const httpServer = createServer(app);
  return httpServer;
}
