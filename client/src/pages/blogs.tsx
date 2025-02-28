import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  const postsByCategory = posts?.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    acc[post.category].push(post);
    return acc;
  }, {} as Record<string, BlogPost[]>);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="astrology">Astrology</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-6">
            {posts?.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        {Object.entries(postsByCategory || {}).map(([category, categoryPosts]) => (
          <TabsContent key={category} value={category}>
            <div className="space-y-6">
              {categoryPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.id}`}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm uppercase text-primary">
              {post.category}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>{post.excerpt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
