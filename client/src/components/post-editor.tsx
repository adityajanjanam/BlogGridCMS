import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { renderMarkdown } from "@/lib/markdown";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Eye, 
  Edit, 
  Bold, 
  Italic, 
  Heading, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code,
  X
} from "lucide-react";
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

interface PostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  existingPost?: Post | null;
}

export default function PostEditor({ isOpen, onClose, existingPost }: PostEditorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("edit");
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = !!existingPost;

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: existingPost?.title || "",
      content: existingPost?.content || "",
      excerpt: existingPost?.excerpt || "",
      category: existingPost?.category || "",
      coverImage: existingPost?.coverImage || "",
      published: existingPost?.published || false,
      authorId: existingPost?.authorId || 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: PostFormData) => apiRequest("POST", "/api/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success!",
        description: "Post created successfully.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PostFormData) => apiRequest("PUT", `/api/posts/${existingPost?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts", existingPost?.id?.toString()] });
      toast({
        title: "Success!",
        description: "Post updated successfully.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
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

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = before + selectedText + after;
    
    const currentContent = form.getValues("content");
    const newContent = currentContent.substring(0, start) + newText + currentContent.substring(end);
    
    form.setValue("content", newContent);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const onSubmit = (data: PostFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary">
              {isEditing ? "Edit Post" : "Write New Post"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Post Title */}
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

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4">
                {/* Post Meta */}
                <div className="flex items-center space-x-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
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

                  <label className="flex items-center cursor-pointer text-muted-foreground hover:text-accent transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    <span>{isUploading ? "Uploading..." : "Upload Cover"}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {/* Cover Image Preview */}
                {form.watch("coverImage") && (
                  <div className="relative">
                    <img
                      src={form.watch("coverImage")}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => form.setValue("coverImage", "")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Excerpt */}
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write a brief excerpt for your post..."
                          className="resize-none"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content Editor */}
                <div className="space-y-4">
                  {/* Editor Toolbar */}
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-t-lg border-b">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("**", "**")}
                      className="text-muted-foreground hover:text-accent"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("*", "*")}
                      className="text-muted-foreground hover:text-accent"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("## ")}
                      className="text-muted-foreground hover:text-accent"
                      title="Heading"
                    >
                      <Heading className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("[", "](url)")}
                      className="text-muted-foreground hover:text-accent"
                      title="Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("![alt](", ")")}
                      className="text-muted-foreground hover:text-accent"
                      title="Image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("`", "`")}
                      className="text-muted-foreground hover:text-accent"
                      title="Code"
                    >
                      <Code className="w-4 h-4" />
                    </Button>
                  </div>

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
                    
                    <TabsContent value="edit" className="mt-0">
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
                                className="min-h-96 font-mono text-sm border-x border-b rounded-b-lg resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="preview" className="mt-0">
                      <div className="min-h-96 p-4 border rounded-b-lg bg-white">
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
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Publish Settings */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-primary mb-4">Publish Settings</h4>
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
                </div>

                {/* Preview */}
                {form.watch("title") && (
                  <div className="p-4 bg-white border rounded-lg">
                    <h4 className="font-semibold text-primary mb-3">Preview</h4>
                    <div className="space-y-2">
                      {form.watch("category") && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {form.watch("category")}
                        </Badge>
                      )}
                      <h5 className="font-semibold text-sm line-clamp-2">
                        {form.watch("title")}
                      </h5>
                      {form.watch("excerpt") && (
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {form.watch("excerpt")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={!field.value}
                        onCheckedChange={(checked) => field.onChange(!checked)}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Save as draft</FormLabel>
                  </FormItem>
                )}
              />
              
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-accent hover:bg-accent/90"
                >
                  {isPending
                    ? "Saving..."
                    : form.watch("published")
                    ? isEditing
                      ? "Update Post"
                      : "Publish Post"
                    : "Save Draft"
                  }
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
