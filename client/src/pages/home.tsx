import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import VideoCard from "@/components/video-card";
import VideoModal from "@/components/video-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Video } from "@shared/schema";
import { categories } from "@shared/schema";

export default function Home() {
  const [location] = useLocation();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const searchQuery = urlParams.get('search');
  const categoryFilter = urlParams.get('category');
  const featuredFilter = urlParams.get('featured');

  // Query for videos based on filters
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: [
      searchQuery ? `/api/videos/search/${encodeURIComponent(searchQuery)}` :
      categoryFilter ? `/api/videos/category/${categoryFilter}` :
      '/api/videos'
    ],
  });

  const { data: popularVideos = [] } = useQuery<Video[]>({
    queryKey: ['/api/videos/popular/list'],
  });

  const { data: latestVideos = [] } = useQuery<Video[]>({
    queryKey: ['/api/videos/latest/list'],
  });

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const renderVideoGrid = (videos: Video[], title: string, showAll = false) => {
    if (videos.length === 0) return null;

    const displayVideos = showAll ? videos : videos.slice(0, 12);

    return (
      <section className="mb-12">
        <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded">
          {title}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {displayVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              size="small"
              onClick={() => handleVideoClick(video)}
            />
          ))}
        </div>
      </section>
    );
  };

  const renderLatestGrid = (videos: Video[]) => {
    if (videos.length === 0) return null;

    return (
      <section className="mb-12">
        <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded">
          ⚡ Latest Videos
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              size="large"
              onClick={() => handleVideoClick(video)}
            />
          ))}
        </div>
      </section>
    );
  };

  const renderCategories = () => {
    const categoryData = categories.map(category => ({
      name: category,
      count: videos.filter(v => v.category === category).length,
      emoji: category === 'JAV' ? '👩‍🏫' : 
             category === 'Office' ? '👩‍💼' :
             category === 'Student' ? '👩‍🎓' :
             category === 'Amateur' ? '🏠' :
             category === 'Featured' ? '⭐' :
             category === 'Trending' ? '🔥' : '📹'
    }));

    return (
      <section className="mb-12">
        <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded">
          📁 Browse Categories
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categoryData.map((category) => (
            <Button
              key={category.name}
              variant="secondary"
              className="bg-secondary rounded-lg p-4 h-auto flex flex-col items-center text-center hover:bg-gray-700 transition-colors"
              onClick={() => window.location.href = `/?category=${category.name.toLowerCase()}`}
            >
              <div className="text-3xl mb-2">{category.emoji}</div>
              <h3 className="font-medium text-white">{category.name}</h3>
              <p className="text-sm text-gray-400">{category.count} videos</p>
            </Button>
          ))}
        </div>
      </section>
    );
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">


        {/* Search Results */}
        {searchQuery && (
          <section className="mb-12">
            <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded">
              🔍 Search Results for "{searchQuery}"
            </div>
            {videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No videos found for your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    size="small"
                    onClick={() => handleVideoClick(video)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Category Results */}
        {categoryFilter && (
          <section className="mb-12">
            <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded">
              📁 {categoryFilter.toUpperCase()} Category
            </div>
            {videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No videos found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    size="small"
                    onClick={() => handleVideoClick(video)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Default Home Content */}
        {!searchQuery && !categoryFilter && (
          <>
            {renderVideoGrid(popularVideos, "🔥 Popular This Week")}
            {renderLatestGrid(latestVideos)}
            {renderCategories()}
          </>
        )}

        {/* Empty State */}
        {videos.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">No Videos Available</h2>
            <p className="text-gray-400 mb-6">Start by adding some videos through the admin panel.</p>
            <Button asChild>
              <a href="/admin">Go to Admin Panel</a>
            </Button>
          </div>
        )}
      </main>

      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-purple-primary px-3 py-1 rounded font-bold text-lg">
                  JAV<span className="bg-orange-500 px-2 py-1 ml-1 rounded">STREAM</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Premium adult entertainment platform with embedded content from trusted sources.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Categories</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                {categories.slice(0, 4).map(category => (
                  <li key={category}>
                    <a href={`/?category=${category.toLowerCase()}`} className="hover:text-white transition-colors">
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Browse</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/?category=trending" className="hover:text-white transition-colors">Trending</a></li>
                <li><a href="/?category=featured" className="hover:text-white transition-colors">Featured</a></li>
                <li><a href="/admin" className="hover:text-white transition-colors">Admin Panel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Search</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 JAV Stream. All rights reserved. | This platform embeds content from third-party sources.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
