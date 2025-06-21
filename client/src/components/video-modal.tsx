import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Video } from "@shared/schema";

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  useEffect(() => {
    if (isOpen && video) {
      // Increment view count when modal opens
      fetch(`/api/videos/${video.id}/view`, {
        method: 'POST',
        credentials: 'include'
      }).catch(console.error);
    }
  }, [isOpen, video]);

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] bg-secondary border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            {video.title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 mb-4">
            <iframe
              src={video.embedUrl}
              width="100%"
              height="100%"
              allowFullScreen
              className="rounded border-0"
              title={video.title}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{video.views} views</span>
              <span>Category: {video.category}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-primary bg-opacity-30 text-purple-300 px-3 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
