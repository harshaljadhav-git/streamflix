import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "@/components/navigation";
import VideoCard from "@/components/video-card";
import VideoModal from "@/components/video-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Video } from "@shared/schema";

export default function NewReleases() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 12;

  const { data: allVideos = [], isLoading } = useQuery<Video[]>({
    queryKey: ['/api/videos'],
  });

  // Sort by creation date to get newest first
  const sortedVideos = allVideos.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalPages = Math.ceil(sortedVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const videos = sortedVideos.slice(startIndex, startIndex + videosPerPage);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="bg-black text-white py-3 px-4 mb-6 font-semibold rounded flex items-center justify-between">
          <span>📅 New Releases</span>
          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages} ({sortedVideos.length} total)
          </span>
        </div>
        
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No new releases available.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  size="small"
                  onClick={() => handleVideoClick(video)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1">
                {/* Page Numbers */}
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
                          ? "bg-purple-primary text-white font-semibold" 
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      {page}
                    </Button>
                  );
                })}

                {/* Next Button */}
                <Button
                  variant="ghost"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 h-10"
                >
                  Next
                </Button>

                {/* Last Button */}
                <Button
                  variant="ghost"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 h-10"
                >
                  Last
                </Button>
              </div>
            )}
          </>
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