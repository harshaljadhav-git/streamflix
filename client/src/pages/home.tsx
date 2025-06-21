import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import VideoCard from "@/components/video-card";
import VideoModal from "@/components/video-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Video } from "@shared/schema";
import { categories } from "@shared/schema";

export default function Home() {
  const [location] = useLocation();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;

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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, featuredFilter]);

  // Pagination logic for main videos
  const totalPages = Math.ceil(videos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const paginatedVideos = videos.slice(startIndex, startIndex + videosPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded flex items-center justify-between">
              <span>🔍 Search Results for "{searchQuery}"</span>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages} ({videos.length} total)
              </span>
            </div>
            {videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No videos found for your search.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
                  {paginatedVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      size="small"
                      onClick={() => handleVideoClick(video)}
                    />
                  ))}
                </div>
                
                {/* Pagination for Search */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="text-gray-400 hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "ghost"}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 ${
                              currentPage === page 
                                ? "bg-purple-primary text-white" 
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="text-gray-400 hover:text-white"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Category Results */}
        {categoryFilter && (
          <section className="mb-12">
            <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded flex items-center justify-between">
              <span>📁 {categoryFilter.toUpperCase()} Category</span>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages} ({videos.length} total)
              </span>
            </div>
            {videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No videos found in this category.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
                  {paginatedVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      size="small"
                      onClick={() => handleVideoClick(video)}
                    />
                  ))}
                </div>
                
                {/* Pagination for Category */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="text-gray-400 hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "ghost"}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 ${
                              currentPage === page 
                                ? "bg-purple-primary text-white" 
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="text-gray-400 hover:text-white"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
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
                <li><a href="/?category=popular" className="hover:text-white transition-colors">Popular</a></li>
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
