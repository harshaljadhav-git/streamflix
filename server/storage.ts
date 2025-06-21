import { videos, type Video, type InsertVideo, type UpdateVideo } from "@shared/schema";

export interface IStorage {
  getVideos(): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByCategory(category: string): Promise<Video[]>;
  searchVideos(query: string): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: UpdateVideo): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;
  incrementViews(id: number): Promise<void>;
  getPopularVideos(): Promise<Video[]>;
  getLatestVideos(): Promise<Video[]>;
}

export class MemStorage implements IStorage {
  private videos: Map<number, Video>;
  private currentId: number;

  constructor() {
    this.videos = new Map();
    this.currentId = 1;
    this.populateSampleData();
  }

  private populateSampleData() {
    const sampleVideos = [
      {
        title: "Busty JAV Teacher Teaches Hard",
        embedUrl: "https://streamtape.com/e/AbcXYZ123456/",
        thumbnail: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=250&fit=crop",
        tags: ["JAV", "teacher", "busty"],
        category: "JAV"
      },
      {
        title: "Office Lady After Hours",
        embedUrl: "https://streamtape.com/e/DefGHI789012/",
        thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop",
        tags: ["office", "professional", "after-hours"],
        category: "Office"
      },
      {
        title: "Student Study Session",
        embedUrl: "https://streamtape.com/e/JklMNO345678/",
        thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop",
        tags: ["student", "study", "young"],
        category: "Student"
      },
      {
        title: "Amateur Home Video",
        embedUrl: "https://streamtape.com/e/PqrSTU901234/",
        thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=250&fit=crop",
        tags: ["amateur", "home", "real"],
        category: "Amateur"
      },
      {
        title: "Professional Model Photoshoot",
        embedUrl: "https://streamtape.com/e/VwxYZA567890/",
        thumbnail: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=250&fit=crop",
        tags: ["professional", "model", "photoshoot"],
        category: "Professional"
      },
      {
        title: "Featured Content Special",
        embedUrl: "https://streamtape.com/e/BcdEFG123789/",
        thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=250&fit=crop",
        tags: ["featured", "special", "premium"],
        category: "Featured"
      },
      {
        title: "Premium Vidoza Content",
        embedUrl: "https://vidoza.net/embed-jyitcgfvw7l1.html",
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
        tags: ["vidoza", "premium", "hd"],
        category: "Professional"
      }
    ];

    sampleVideos.forEach((videoData, index) => {
      const video: Video = {
        ...videoData,
        id: this.currentId++,
        views: Math.floor(Math.random() * 10000) + 100,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      };
      this.videos.set(video.id, video);
    });
  }

  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideosByCategory(category: string): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter(video => video.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async searchVideos(query: string): Promise<Video[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.videos.values())
      .filter(video => 
        video.title.toLowerCase().includes(lowerQuery) ||
        video.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        video.category.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentId++;
    const video: Video = {
      ...insertVideo,
      id,
      views: 0,
      createdAt: new Date(),
      tags: insertVideo.tags || [],
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideo(id: number, updateVideo: UpdateVideo): Promise<Video | undefined> {
    const existingVideo = this.videos.get(id);
    if (!existingVideo) return undefined;

    const updatedVideo: Video = {
      ...existingVideo,
      ...updateVideo,
    };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    return this.videos.delete(id);
  }

  async incrementViews(id: number): Promise<void> {
    const video = this.videos.get(id);
    if (video) {
      video.views += 1;
      this.videos.set(id, video);
    }
  }

  async getPopularVideos(): Promise<Video[]> {
    return Array.from(this.videos.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 12);
  }

  async getLatestVideos(): Promise<Video[]> {
    return Array.from(this.videos.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }
}

export const storage = new MemStorage();
