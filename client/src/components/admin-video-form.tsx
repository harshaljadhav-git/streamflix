import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { insertVideoSchema, categories, type InsertVideo, type Video } from "@shared/schema";
import { z } from "zod";

const formSchema = insertVideoSchema.extend({
  tagsInput: z.string().min(1, "At least one tag is required"),
});

type FormData = z.infer<typeof formSchema>;

interface AdminVideoFormProps {
  video?: Video;
  onSuccess?: () => void;
}

export default function AdminVideoForm({ video, onSuccess }: AdminVideoFormProps) {
  const { toast } = useToast();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: video?.title || "",
      embedUrl: video?.embedUrl || "",
      thumbnail: video?.thumbnail || "",
      category: video?.category || "",
      tagsInput: video?.tags.join(", ") || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertVideo) => apiRequest('POST', '/api/videos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/videos/popular/list'] });
      queryClient.invalidateQueries({ queryKey: ['/api/videos/latest/list'] });
      toast({
        title: "Success",
        description: "Video added successfully!",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add video",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertVideo) => apiRequest('PUT', `/api/videos/${video!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${video!.id}`] });
      toast({
        title: "Success", 
        description: "Video updated successfully!",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update video",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const tags = data.tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    const videoData: InsertVideo = {
      title: data.title,
      embedUrl: data.embedUrl,
      thumbnail: data.thumbnail,
      category: data.category,
      tags,
    };

    if (video) {
      updateMutation.mutate(videoData);
    } else {
      createMutation.mutate(videoData);
    }
  };

  const watchedValues = form.watch();

  return (
    <Card className="bg-secondary border-gray-700">
      <CardHeader>
        <CardTitle className="text-purple-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>{video ? 'Edit Video' : 'Add New Video'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter video title"
                        className="bg-gray-700 border-gray-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="embedUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Embed URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://streamtape.com/e/AbcXYZ123456/"
                      className="bg-gray-700 border-gray-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://cdn.example.com/thumb.jpg"
                      className="bg-gray-700 border-gray-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagsInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="JAV, teacher, sub, busty"
                      className="bg-gray-700 border-gray-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-4">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-purple-primary hover:bg-purple-600"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {video ? 'Update Video' : 'Add Video'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                {isPreviewMode ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
          </form>
        </Form>

        {/* Preview */}
        {isPreviewMode && watchedValues.thumbnail && (
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Preview</h3>
            <div className="bg-gray-800 rounded-lg p-4 max-w-sm">
              <img
                src={watchedValues.thumbnail}
                alt="Preview"
                className="w-full h-32 object-cover rounded mb-3"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=250&fit=crop";
                }}
              />
              <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">
                {watchedValues.title || "Video Title"}
              </h4>
              <div className="flex flex-wrap gap-1">
                {watchedValues.category && (
                  <span className="bg-purple-primary bg-opacity-30 text-purple-300 px-2 py-1 rounded text-xs">
                    {watchedValues.category}
                  </span>
                )}
                {watchedValues.tagsInput && watchedValues.tagsInput.split(',').slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-pink-accent bg-opacity-30 text-pink-300 px-2 py-1 rounded text-xs"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
