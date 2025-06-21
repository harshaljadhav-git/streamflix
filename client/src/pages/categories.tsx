import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import VideoCard from "@/components/video-card";
import VideoModal from "@/components/video-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { categories } from "@shared/schema";
import type { Video } from "@shared/schema";

export default function Categories() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const getCategoryData = () => {
    return categories.map(category => ({
      name: category,
      count: allVideos.filter(v => v.category === category).length,
      videos: allVideos.filter(v => v.category === category).slice(0, 6),
      emoji: category === 'JAV' ? '👩‍🏫' : 
             category === 'Office' ? '👩‍💼' :
             category === 'Student' ? '👩‍🎓' :
             category === 'Amateur' ? '🏠' :
             category === 'Professional' ? '🎬' :
             category === 'Teacher' ? '📚' :
             category === 'Fetish' ? '🔗' :
             category === 'Featured' ? '⭐' :
             category === 'Trending' ? '🔥' : '📹'
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const categoryData = getCategoryData();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded">
          📁 Browse Categories
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {categoryData.map((category) => (
            <Button
              key={category.name}
              variant="secondary"
              className="bg-secondary rounded-lg p-4 h-auto flex flex-col items-center text-center hover:bg-gray-700 transition-colors"
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
            >
              <div className="text-3xl mb-2">{category.emoji}</div>
              <h3 className="font-medium text-white">{category.name}</h3>
              <p className="text-sm text-gray-400">{category.count} videos</p>
            </Button>
          ))}
        </div>

        {/* Category Videos */}
        {categoryData.map((category) => (
          <div key={category.name} className={`mb-12 ${selectedCategory && selectedCategory !== category.name ? 'hidden' : ''}`}>
            {category.videos.length > 0 && (
              <>
                <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded flex items-center justify-between">
                  <span>{category.emoji} {category.name}</span>
                  <Link href={`/?category=${category.name.toLowerCase()}`}>
                    <Button variant="ghost" size="sm" className="text-purple-primary hover:text-purple-400">
                      View All ({category.count})
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {category.videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      size="small"
                      onClick={() => handleVideoClick(video)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        {selectedCategory && categoryData.find(c => c.name === selectedCategory)?.videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No videos in this category yet.</p>
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