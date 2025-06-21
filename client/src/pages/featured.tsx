import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "@/components/navigation";
import VideoCard from "@/components/video-card";
import VideoModal from "@/components/video-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, Crown, Zap } from "lucide-react";
import type { Video } from "@shared/schema";

export default function Featured() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: allVideos = [], isLoading } = useQuery<Video[]>({
    queryKey: ['/api/videos'],
  });

  const { data: popularVideos = [] } = useQuery<Video[]>({
    queryKey: ['/api/videos/popular/list'],
  });

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // Get featured videos (category Featured + top popular)
  const featuredVideos = allVideos.filter(v => v.category === 'Featured');
  const topRated = popularVideos.slice(0, 8);
  const editorsPick = allVideos
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const renderVideoSection = (videos: Video[], title: string, icon: React.ReactNode, badgeColor: string) => {
    if (videos.length === 0) return null;

    return (
      <section className="mb-12">
        <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded flex items-center space-x-2">
          {icon}
          <span>{title}</span>
          <Badge className={`${badgeColor} text-white ml-2`}>
            {videos.length}
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {videos.map((video, index) => (
            <div key={video.id} className="relative">
              <VideoCard
                video={video}
                size="small"
                onClick={() => handleVideoClick(video)}
              />
              {index < 3 && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-500 text-black font-bold">
                    #{index + 1}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Featured Content</h1>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-purple-100">Hand-picked premium videos and top-rated content</p>
        </div>

        {renderVideoSection(
          featuredVideos,
          "Premium Featured",
          <Crown className="h-5 w-5 text-yellow-400" />,
          "bg-yellow-500"
        )}

        {renderVideoSection(
          topRated,
          "Top Rated",
          <Star className="h-5 w-5 text-orange-400" />,
          "bg-orange-500"
        )}

        {renderVideoSection(
          editorsPick,
          "Editor's Choice",
          <Zap className="h-5 w-5 text-purple-400" />,
          "bg-purple-500"
        )}

        {featuredVideos.length === 0 && topRated.length === 0 && editorsPick.length === 0 && (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No Featured Content</h2>
            <p className="text-gray-400">Featured content will appear here when available.</p>
          </div>
        )}
      </main>

      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}