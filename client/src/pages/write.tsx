import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { renderMarkdown } from "@/lib/markdown";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Eye, Edit } from "lucide-react";
import { Link } from "wouter";
import type { Post } from "@shared/schema";

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt must be less than 500 characters"),
  category: z.string().min(1, "Category is required"),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  authorId: z.number().default(1),
});

type PostFormData = z.infer<typeof postFormSchema>;

export default function Write() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("edit");
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = !!id;

  // Load existing post for editing
  const { data: existingPost } = useQuery<Post>({
    queryKey: ["/api/posts", id],
    enabled: isEditing,
  });

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      coverImage: "",
      published: false,
      authorId: 1,
    },
  });

  // Update form when existing post loads
  useState(() => {
    if (existingPost) {
      form.reset({
        title: existingPost.title,
        content: existingPost.content,
        excerpt: existingPost.excerpt,
        category: existingPost.category,
        coverImage: existingPost.coverImage || "",
        published: existingPost.published ?? false,
        authorId: existingPost.authorId,
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: PostFormData) => apiRequest("POST", "/api/posts", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success!",
        description: "Post created successfully.",
      });
      setLocation("/");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PostFormData) => apiRequest("PUT", `/api/posts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
      toast({
        title: "Success!",
        description: "Post updated successfully.",
      });
      setLocation(`/post/${id}`);
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      
      const { url } = await response.json();
      form.setValue("coverImage", url);
      toast({
        title: "Image uploaded!",
        description: "Cover image has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: PostFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-white/50 hover:scale-105 transform transition-all duration-200">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isEditing ? "Edit Post" : "Write New Post"}
            </h1>
          </div>
        </div>

        <Form {...form}>
          <div className="animate-slide-up">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6 glass-effect p-8 rounded-2xl border-0 shadow-xl">
                  {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter post title..."
                        className="text-3xl font-bold border-none shadow-none p-0 h-auto placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Excerpt */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Write a brief excerpt for your post..."
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content Editor */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit" className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="mt-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Write your post content in Markdown...

# Your Heading Here

Start writing your amazing content. You can use:

- **Bold text**
- *Italic text*
- [Links](https://example.com)
- `code snippets`

## Another Heading

And much more!"
                            className="min-h-96 font-mono text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-4">
                  <Card className="min-h-96">
                    <CardContent className="p-6">
                      {form.watch("content") ? (
                        <div 
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: renderMarkdown(form.watch("content")) 
                          }} 
                        />
                      ) : (
                        <p className="text-muted-foreground">Write some content to see the preview...</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Post Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Productivity">Productivity</SelectItem>
                            <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                            <SelectItem value="Analytics">Analytics</SelectItem>
                            <SelectItem value="Creativity">Creativity</SelectItem>
                            <SelectItem value="Leadership">Leadership</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cover Image */}
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <div className="space-y-2">
                          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors">
                            <div className="text-center">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {isUploading ? "Uploading..." : "Click to upload image"}
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={isUploading}
                            />
                          </label>
                          {field.value && (
                            <img
                              src={field.value}
                              alt="Cover preview"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Publish Status */}
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Publish immediately</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Make this post visible to readers
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending
                    ? "Saving..."
                    : isEditing
                    ? "Update Post"
                    : form.watch("published")
                    ? "Publish Post"
                    : "Save Draft"
                  }
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Form>
      </div>
    </div>
  );
}
