import { Link } from "wouter";
import { Play, Eye } from "lucide-react";
import type { Video } from "@shared/schema";

interface VideoCardProps {
  video: Video;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}

export default function VideoCard({ video, size = "medium", onClick }: VideoCardProps) {
  const sizeClasses = {
    small: "h-32",
    medium: "h-40",
    large: "h-48"
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const cardContent = (
    <div className="bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full ${sizeClasses[size]} object-cover group-hover:scale-105 transition-transform duration-300`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=250&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium mb-2 line-clamp-2 text-white">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{formatViews(video.views)} views</span>
          </div>
          <span>{formatDate(new Date(video.createdAt))}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="bg-purple-primary bg-opacity-30 text-purple-300 px-2 py-1 rounded text-xs">
            {video.category}
          </span>
          {video.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-pink-accent bg-opacity-30 text-pink-300 px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{cardContent}</div>;
  }

  return <Link href={`/video/${video.id}`}>{cardContent}</Link>;
}
