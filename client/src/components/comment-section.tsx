import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Comment } from "@shared/schema";

const commentFormSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  authorName: z.string().min(1, "Name is required"),
  authorEmail: z.string().email("Valid email is required"),
});

type CommentFormData = z.infer<typeof commentFormSchema>;

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { toast } = useToast();
  
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/posts", postId.toString(), "comments"],
  });

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: "",
      authorName: "",
      authorEmail: "",
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: CommentFormData) => 
      apiRequest("POST", `/api/posts/${postId}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId.toString(), "comments"] });
      form.reset();
      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully.",
      });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: number) => 
      apiRequest("POST", `/api/comments/${commentId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId.toString(), "comments"] });
    },
  });

  const onSubmit = (data: CommentFormData) => {
    createCommentMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-primary">Comments</h3>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8 animate-slide-up">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
          Comments ({comments?.length || 0})
        </h3>
        <div className="w-16 h-1 gradient-bg mx-auto rounded-full"></div>
      </div>
      
      {/* Comment Form */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="your.email@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add a comment..."
                        className="resize-none"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={createCommentMutation.isPending}
                  className="gradient-bg text-white hover:opacity-90 px-8 py-3 rounded-full"
                >
                  {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src="" />
              <AvatarFallback>
                {comment.authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-primary">{comment.authorName}</h4>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-foreground">{comment.content}</p>
              </div>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeCommentMutation.mutate(comment.id)}
                  disabled={likeCommentMutation.isPending}
                  className="h-auto p-0 text-muted-foreground hover:text-red-500"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  {comment.likes}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {comments?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </section>
  );
}
