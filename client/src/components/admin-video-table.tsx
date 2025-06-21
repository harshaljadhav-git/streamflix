import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Edit, Trash2, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import AdminVideoForm from "./admin-video-form";
import type { Video } from "@shared/schema";

interface AdminVideoTableProps {
  videos: Video[];
}

export default function AdminVideoTable({ videos }: AdminVideoTableProps) {
  const { toast } = useToast();
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/videos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/videos/popular/list'] });
      queryClient.invalidateQueries({ queryKey: ['/api/videos/latest/list'] });
      toast({
        title: "Success",
        description: "Video deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete video",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingVideo(null);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-lg">No videos found.</p>
        <p className="text-gray-500 text-sm mt-2">Add your first video using the form above.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800">
              <TableHead className="text-gray-300">Thumbnail</TableHead>
              <TableHead className="text-gray-300">Title</TableHead>
              <TableHead className="text-gray-300">Category</TableHead>
              <TableHead className="text-gray-300">Views</TableHead>
              <TableHead className="text-gray-300">Created</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id} className="border-gray-700 hover:bg-gray-800">
                <TableCell>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-12 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=250&fit=crop";
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="text-white font-medium line-clamp-2">{video.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-purple-primary bg-opacity-30 text-purple-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {video.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                          +{video.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-pink-accent bg-opacity-30 text-pink-300">
                    {video.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{formatViews(video.views)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {formatDate(new Date(video.createdAt))}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/video/${video.id}`, '_blank')}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(video)}
                      className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-secondary border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Delete Video</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete "{video.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-600 text-gray-300 hover:text-white">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(video.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-secondary border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Video</DialogTitle>
          </DialogHeader>
          {editingVideo && (
            <AdminVideoForm
              video={editingVideo}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
