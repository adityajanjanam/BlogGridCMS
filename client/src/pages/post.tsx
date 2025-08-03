import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bookmark, Eye, ArrowLeft } from "lucide-react";
import { Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import CommentSection from "@/components/comment-section";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { renderMarkdown } from "@/lib/markdown";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@shared/schema";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["/api/posts", id],
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/posts/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
      toast({
        title: "Post liked!",
        description: "Thank you for your feedback.",
      });
    },
  });

  const sharePost = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The post link has been copied to your clipboard.",
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-12 bg-muted rounded w-3/4"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Post not found</h1>
        <p className="text-muted-foreground mb-8">The post you're looking for doesn't exist.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-white/50 hover:scale-105 transform transition-all duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Post Header */}
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center mb-6">
            <Badge className="gradient-bg text-white border-0 px-4 py-2">
              {post.category}
            </Badge>
            <span className="text-muted-foreground text-sm ml-4 font-medium">
              {new Date(post.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="w-12 h-12 mr-4">
                <AvatarImage src="" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-primary">John Doe</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {post.views} views
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes} likes
                  </span>
                </div>
              </div>
            </div>
            
            {/* Social Sharing Buttons */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => sharePost("twitter")}
                className="text-gray-400 hover:text-blue-500"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => sharePost("facebook")}
                className="text-gray-400 hover:text-blue-600"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => sharePost("linkedin")}
                className="text-gray-400 hover:text-blue-700"
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => sharePost("copy")}
                className="text-gray-400 hover:text-gray-600"
              >
                <LinkIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative mb-12 animate-scale-in">
            <img
              src={post.coverImage}
              alt="Post cover"
              className="w-full rounded-2xl shadow-2xl max-h-96 object-cover"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
        )}

        {/* Post Content */}
        <article className="prose prose-lg max-w-none mb-12 animate-slide-up glass-effect p-8 md:p-12 rounded-2xl border-0 shadow-xl">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
        </article>

        {/* Post Actions */}
        <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className="text-gray-600 hover:text-red-500"
            >
              <Heart className="w-5 h-5 mr-2" />
              {post.likes} likes
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-accent">
              <Bookmark className="w-5 h-5 mr-2" />
              Save
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">Share:</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => sharePost("twitter")}
              className="text-gray-400 hover:text-blue-500"
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => sharePost("facebook")}
              className="text-gray-400 hover:text-blue-600"
            >
              <Facebook className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => sharePost("linkedin")}
              className="text-gray-400 hover:text-blue-700"
            >
              <Linkedin className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection postId={parseInt(id!)} />
      </div>
    </div>
  );
}
