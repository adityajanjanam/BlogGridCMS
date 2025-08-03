import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import PostCard from "@/components/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Eye, MessageCircle, Heart, PenTool } from "lucide-react";
import type { Post } from "@shared/schema";

export default function Home() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-48 rounded-xl mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const featuredPost = posts?.[0];
  const recentPosts = posts?.slice(1) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 animate-fade-in">
            Welcome to My Blog
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12 animate-slide-up">
            Sharing thoughts, experiences, and insights on technology, life, and everything in between.
            Join me on this journey of discovery and learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link href="/write">
              <Button size="lg" className="gradient-bg hover:opacity-90 text-white px-8 py-3 text-lg">
                Start Writing
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg hover:bg-white/80">
              Explore Posts
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-20 animate-slide-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Featured Post</h2>
              <div className="w-24 h-1 gradient-bg mx-auto rounded-full"></div>
            </div>
            <Card className="overflow-hidden hover-lift glass-effect border-0 shadow-xl">
              <div className="md:flex">
                {featuredPost.coverImage && (
                  <div className="md:w-1/2 relative overflow-hidden">
                    <img
                      src={featuredPost.coverImage}
                      alt="Featured post cover"
                      className="w-full h-64 md:h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
                  </div>
                )}
                <CardContent className={`${featuredPost.coverImage ? "md:w-1/2" : "w-full"} p-8 md:p-12`}>
                  <div className="flex items-center mb-6">
                    <Badge className="gradient-bg text-white border-0 px-4 py-2">
                      {featuredPost.category}
                    </Badge>
                    <span className="text-muted-foreground text-sm ml-4 font-medium">
                      {new Date(featuredPost.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <Link href={`/post/${featuredPost.id}`}>
                    <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-pointer">
                      {featuredPost.title}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="w-10 h-10 mr-4">
                        <AvatarImage src="" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-primary">John Doe</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {featuredPost.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {featuredPost.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/post/${featuredPost.id}`}>
                      <Button className="gradient-bg text-white hover:opacity-90 px-6 py-3 rounded-full">
                        Read More <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </section>
        )}

        {/* Recent Posts Grid */}
        <section className="animate-slide-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Recent Posts</h2>
            <div className="w-24 h-1 gradient-bg mx-auto rounded-full"></div>
          </div>
          {recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 gradient-bg rounded-full mx-auto mb-6 flex items-center justify-center">
                  <PenTool className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">No posts yet</h3>
                <p className="text-muted-foreground mb-8 text-lg">Start your blogging journey by creating your first post.</p>
                <Link href="/write">
                  <Button size="lg" className="gradient-bg text-white hover:opacity-90 px-8 py-3">
                    Write Your First Post
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
