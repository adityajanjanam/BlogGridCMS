import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Eye } from "lucide-react";
import type { Post } from "@shared/schema";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover-lift glass-effect border-0 shadow-lg group">
      <div className="relative overflow-hidden">
        {post.coverImage ? (
          <>
            <img
              src={post.coverImage}
              alt="Post cover"
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-48 gradient-bg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-semibold">{post.category}</h4>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge 
            className={`px-3 py-1 text-sm font-medium border-0 ${getCategoryColor(post.category)}`}
          >
            {post.category}
          </Badge>
          <span className="text-muted-foreground text-xs font-medium">
            {new Date(post.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
        
        <Link href={`/post/${post.id}`}>
          <h3 className="text-xl font-bold text-primary mb-3 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-pointer line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center hover:text-accent transition-colors cursor-pointer">
              <Eye className="w-4 h-4 mr-1" />
              {post.views}
            </span>
            <span className="flex items-center hover:text-red-500 transition-colors cursor-pointer">
              <Heart className="w-4 h-4 mr-1" />
              {post.likes}
            </span>
          </div>
          <Link href={`/post/${post.id}`}>
            <button className="text-accent hover:text-accent/80 text-sm font-medium transition-colors">
              Read more →
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Technology: "bg-blue-500 text-white",
    Design: "bg-purple-500 text-white",
    Productivity: "bg-green-500 text-white",
    Lifestyle: "bg-pink-500 text-white",
    Analytics: "bg-indigo-500 text-white",
    Creativity: "bg-orange-500 text-white",
    Leadership: "bg-red-500 text-white",
  };
  
  return colors[category] || "bg-gray-500 text-white";
}
