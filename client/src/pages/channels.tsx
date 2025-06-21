import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "@/components/navigation";
import VideoCard from "@/components/video-card";
import VideoModal from "@/components/video-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Video as VideoIcon, Eye } from "lucide-react";
import type { Video } from "@shared/schema";

export default function Channels() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const { data: allVideos = [], isLoading } = useQuery<Video[]>({
    queryKey: ['/api/videos'],
  });

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // Group videos by simulated channels based on category
  const getChannelData = () => {
    const channels = [
      { 
        name: "JAV Studio Premium", 
        category: "JAV", 
        avatar: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100&h=100&fit=crop&crop=face",
        description: "Premium JAV content from top studios"
      },
      { 
        name: "Office Fantasies", 
        category: "Office", 
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
        description: "Professional office scenarios"
      },
      { 
        name: "Campus Life", 
        category: "Student", 
        avatar: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop&crop=face",
        description: "Student life and campus adventures"
      },
      { 
        name: "Real Amateur", 
        category: "Amateur", 
        avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop&crop=face",
        description: "Authentic amateur content"
      },
      { 
        name: "Pro Productions", 
        category: "Professional", 
        avatar: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=100&fit=crop&crop=face",
        description: "High-quality professional productions"
      },
      { 
        name: "Featured Studios", 
        category: "Featured", 
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
        description: "Featured premium content"
      }
    ];

    return channels.map(channel => {
      const videos = allVideos.filter(v => v.category === channel.category);
      const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
      
      return {
        ...channel,
        videoCount: videos.length,
        totalViews,
        videos: videos.slice(0, 6),
        subscribers: Math.floor(totalViews / 100) + Math.floor(Math.random() * 10000)
      };
    }).filter(channel => channel.videoCount > 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const channelData = getChannelData();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded">
          📺 Channels
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {channelData.map((channel) => (
            <Card key={channel.name} className="bg-secondary border-gray-700 hover:border-purple-primary transition-colors">
              <CardHeader className="text-center">
                <div className="flex items-center space-x-4">
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";
                    }}
                  />
                  <div className="flex-1 text-left">
                    <CardTitle className="text-white text-lg">{channel.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{channel.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{formatNumber(channel.subscribers)} subscribers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <VideoIcon className="h-4 w-4" />
                    <span>{channel.videoCount} videos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(channel.totalViews)} views</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => setSelectedChannel(selectedChannel === channel.name ? null : channel.name)}
                  className="w-full bg-purple-primary hover:bg-purple-600 mb-4"
                >
                  {selectedChannel === channel.name ? 'Hide Videos' : 'Show Videos'}
                </Button>

                {selectedChannel === channel.name && channel.videos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {channel.videos.map((video) => (
                      <div key={video.id} onClick={() => handleVideoClick(video)} className="cursor-pointer">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-20 object-cover rounded hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=250&fit=crop";
                          }}
                        />
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{video.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {channelData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No channels available.</p>
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