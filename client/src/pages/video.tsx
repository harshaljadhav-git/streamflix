import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Eye, Clock, Tag } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCard from "@/components/video-card";
import Navigation from "@/components/navigation";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Video } from "@shared/schema";

export default function VideoPage() {
  const { id } = useParams<{ id: string }>();
  const videoId = parseInt(id || "0");

  const { data: video, isLoading } = useQuery<Video>({
    queryKey: [`/api/videos/${videoId}`],
    enabled: !!videoId,
  });

  const { data: relatedVideos = [] } = useQuery<Video[]>({
    queryKey: [video ? `/api/videos/category/${video.category}` : ''],
    enabled: !!video,
  });

  const incrementViewsMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/videos/${videoId}/view`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}`] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-96 rounded-lg mb-4" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex space-x-3">
                    <Skeleton className="h-20 w-32 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">Video Not Found</h1>
            <p className="text-gray-400 mb-6">The video you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter out current video from related videos
  const filteredRelatedVideos = relatedVideos.filter(v => v.id !== video.id).slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-secondary rounded-lg overflow-hidden mb-6">
              <iframe
                src={video.embedUrl}
                width="100%"
                height="480"
                frameBorder="0"
                marginWidth="0"
                marginHeight="0"
                scrolling="no"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen"
                className="border-0"
                title={video.title}
                onLoad={() => {
                  // Increment views when video loads
                  incrementViewsMutation.mutate();
                }}
              />
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {video.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatViews(video.views)} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Uploaded {formatDate(new Date(video.createdAt))}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>{video.category}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-purple-primary bg-opacity-30 text-purple-300 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Related Videos</h2>
            
            {filteredRelatedVideos.length === 0 ? (
              <p className="text-gray-400">No related videos found.</p>
            ) : (
              <div className="space-y-4">
                {filteredRelatedVideos.map((relatedVideo) => (
                  <Link key={relatedVideo.id} href={`/video/${relatedVideo.id}`}>
                    <div className="flex space-x-3 bg-secondary rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        className="h-20 w-32 object-cover rounded flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=250&fit=crop";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white line-clamp-2 mb-1">
                          {relatedVideo.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-1">
                          {formatViews(relatedVideo.views)} views
                        </p>
                        <span className="text-xs bg-purple-primary bg-opacity-30 text-purple-300 px-2 py-1 rounded">
                          {relatedVideo.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
