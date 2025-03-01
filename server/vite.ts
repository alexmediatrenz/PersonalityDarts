import { 
  User, InsertUser, Quiz, QuizResult, ZodiacGame, Match,
  InsertMatch, InsertQuizResult, InsertZodiacGame,
  BlogPost, Comment, insertBlogPostSchema
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  createBlogPost(post: BlogPost): Promise<BlogPost>;
  getComments(postId: number): Promise<Comment[]>;
  createComment(comment: Comment): Promise<Comment>;

  // Quiz operations
  getQuizzes(): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  saveQuizResult(result: InsertQuizResult): Promise<QuizResult>;

  // Zodiac game operations
  saveZodiacGame(game: InsertZodiacGame): Promise<ZodiacGame>;
  getRecentZodiacGames(limit?: number): Promise<ZodiacGame[]>;

  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesForUser(userId: number): Promise<Match[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private comments: Map<number, Comment>;
  private quizzes: Map<number, Quiz>;
  private quizResults: Map<number, QuizResult>;
  private zodiacGames: Map<number, ZodiacGame>;
  private matches: Map<number, Match>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.comments = new Map();
    this.quizzes = new Map();
    this.quizResults = new Map();
    this.zodiacGames = new Map();
    this.matches = new Map();
    this.currentId = {
      users: 1,
      blogPosts: 1,
      comments: 1,
      quizzes: 1,
      quizResults: 1,
      zodiacGames: 1,
      matches: 1
    };

    // Initialize with sample data
    this.initializeQuizzes();
    this.initializeBlogPosts();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.category === category);
  }

  async createBlogPost(post: BlogPost): Promise<BlogPost> {
    const id = this.currentId.blogPosts++;
    const newPost = { ...post, id };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async getComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId);
  }

  async createComment(comment: Comment): Promise<Comment> {
    const id = this.currentId.comments++;
    const newComment = { ...comment, id };
    this.comments.set(id, newComment);
    return newComment;
  }

  // Quiz operations
  async getQuizzes(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values());
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async saveQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentId.quizResults++;
    const quizResult = { ...result, id };
    this.quizResults.set(id, quizResult);
    return quizResult;
  }

  // Zodiac game operations
  async saveZodiacGame(game: InsertZodiacGame): Promise<ZodiacGame> {
    const id = this.currentId.zodiacGames++;
    const zodiacGame = { ...game, id };
    this.zodiacGames.set(id, zodiacGame);
    return zodiacGame;
  }

  async getRecentZodiacGames(limit = 10): Promise<ZodiacGame[]> {
    return Array.from(this.zodiacGames.values())
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, limit);
  }

  // Match operations
  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.currentId.matches++;
    const newMatch = { ...match, id };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  async getMatchesForUser(userId: number): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter(match => match.userId === userId);
  }

  private initializeQuizzes() {
    const sampleQuizzes: Quiz[] = [
      {
        id: this.currentId.quizzes++,
        title: "Deep Dive: Personality Analysis",
        description: "Discover your core personality traits with this comprehensive assessment",
        type: "deep-dive",
        questions: [
          {
            id: 1,
            text: "How do you typically recharge?",
            options: [
              "Spending time alone",
              "Being around others",
              "Mix of both",
              "Through creative activities"
            ]
          }
        ]
      },
      {
        id: this.currentId.quizzes++,
        title: "Quick Read: Love Language",
        description: "Find out your primary love language in just 5 minutes",
        type: "quick-read",
        questions: [
          {
            id: 1,
            text: "What makes you feel most appreciated?",
            options: [
              "Receiving gifts",
              "Quality time together",
              "Words of affirmation",
              "Physical touch"
            ]
          }
        ]
      }
    ];

    sampleQuizzes.forEach(quiz => this.quizzes.set(quiz.id, quiz));
  }

  private initializeBlogPosts() {
    const samplePosts: BlogPost[] = [
      {
        id: this.currentId.blogPosts++,
        title: "Understanding Your Zodiac Element",
        content: "Deep dive into the four elements of astrology...",
        excerpt: "Learn how your zodiac element influences your personality and relationships.",
        category: "astrology",
        tags: ["zodiac", "elements", "personality"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "The Science Behind Personality Tests",
        content: "Exploring the psychological foundations...",
        excerpt: "Discover how modern personality assessments are developed and validated.",
        category: "personality",
        tags: ["psychology", "research", "self-discovery"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Mercury Retrograde: Dating Do's and Don'ts",
        content: "Navigate relationships during astrological transitions...",
        excerpt: "Your guide to romance during Mercury retrograde periods.",
        category: "astrology",
        tags: ["mercury-retrograde", "dating-advice", "relationships"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Attachment Styles in Modern Dating",
        content: "Understanding secure, anxious, and avoidant patterns...",
        excerpt: "How your attachment style shapes your relationships.",
        category: "relationships",
        tags: ["attachment-theory", "dating", "psychology"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "The Power of Introversion",
        content: "Embracing your quiet strength in a loud world...",
        excerpt: "Why introverts make amazing partners and leaders.",
        category: "personality",
        tags: ["introversion", "self-growth", "relationships"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Venus Signs and Love Languages",
        content: "How your Venus placement affects your romance style...",
        excerpt: "Understanding your cosmic approach to love.",
        category: "astrology",
        tags: ["venus", "love", "compatibility"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "The Enneagram in Relationships",
        content: "How different types connect and grow together...",
        excerpt: "Using the Enneagram to deepen relationship understanding.",
        category: "personality",
        tags: ["enneagram", "relationships", "growth"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Moon Sign Compatibility",
        content: "Emotional resonance in astrological partnerships...",
        excerpt: "Why moon sign matching matters in relationships.",
        category: "astrology",
        tags: ["moon-sign", "emotions", "compatibility"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Digital Dating Red Flags",
        content: "Navigate online dating with confidence...",
        excerpt: "Spot warning signs in the modern dating landscape.",
        category: "relationships",
        tags: ["online-dating", "safety", "red-flags"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "The MBTI Romance Guide",
        content: "Finding love based on personality type...",
        excerpt: "MBTI compatibility insights for better relationships.",
        category: "personality",
        tags: ["mbti", "dating", "compatibility"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Saturn Return & Relationships",
        content: "Navigating love during major life transitions...",
        excerpt: "How Saturn's cycle affects your love life.",
        category: "astrology",
        tags: ["saturn-return", "transitions", "growth"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Conscious Dating Practices",
        content: "Mindful approaches to modern relationships...",
        excerpt: "Building meaningful connections in the digital age.",
        category: "relationships",
        tags: ["mindfulness", "dating", "authenticity"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "The Big Five Personality Traits",
        content: "Scientific insights into personality dimensions...",
        excerpt: "Understanding OCEAN traits in relationships.",
        category: "personality",
        tags: ["big-five", "psychology", "self-awareness"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Synastry Chart Reading Guide",
        content: "Advanced astrological compatibility analysis...",
        excerpt: "Deep dive into relationship astrology.",
        category: "astrology",
        tags: ["synastry", "compatibility", "advanced"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Long-Distance Love Success",
        content: "Making remote relationships work...",
        excerpt: "Tips and strategies for distant connections.",
        category: "relationships",
        tags: ["long-distance", "communication", "commitment"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Empaths in Love",
        content: "Navigating relationships as a sensitive person...",
        excerpt: "Self-care and boundaries for empathic people.",
        category: "personality",
        tags: ["empaths", "boundaries", "self-care"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "North Node Purpose Finding",
        content: "Discovering your life path through astrology...",
        excerpt: "Using your North Node to guide relationship choices.",
        category: "astrology",
        tags: ["north-node", "purpose", "destiny"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "The Psychology of Attraction",
        content: "Scientific insights into romantic chemistry...",
        excerpt: "Understanding what draws people together.",
        category: "relationships",
        tags: ["attraction", "psychology", "chemistry"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Healing Attachment Wounds",
        content: "Moving towards secure attachment...",
        excerpt: "Transform your relationship patterns.",
        category: "personality",
        tags: ["healing", "attachment", "growth"],
        authorId: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: this.currentId.blogPosts++,
        title: "Astrological Houses in Love",
        content: "How the 12 houses influence relationships...",
        excerpt: "Understanding romance through your birth chart.",
        category: "astrology",
        tags: ["houses", "birth-chart", "love"],
        authorId: 1,
        createdAt: new Date().toISOString()
      }
    ];

    samplePosts.forEach(post => this.blogPosts.set(post.id, post));
  }
}

export const storage = new MemStorage();
