import {
  videos,
  type Video,
  type InsertVideo,
  type UpdateVideo,
} from "@shared/schema";
import { pool } from "./db";
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

export class PgStorage implements IStorage {
  async getVideos(): Promise<Video[]> {
    const { rows } = await pool.query(
      "SELECT * FROM videos ORDER BY created_at DESC"
    );
    return rows;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const { rows } = await pool.query("SELECT * FROM videos WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  async getVideosByCategory(category: string): Promise<Video[]> {
    const { rows } = await pool.query(
      "SELECT * FROM videos WHERE LOWER(category) = LOWER($1) ORDER BY created_at DESC",
      [category]
    );
    return rows;
  }

  async searchVideos(query: string): Promise<Video[]> {
    const q = `%${query.toLowerCase()}%`;
    const { rows } = await pool.query(
      `SELECT * FROM videos WHERE 
        LOWER(title) LIKE $1 OR 
        EXISTS (SELECT 1 FROM unnest(tags) tag WHERE LOWER(tag) LIKE $1) OR 
        LOWER(category) LIKE $1
      ORDER BY created_at DESC`,
      [q]
    );
    return rows;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const { rows } = await pool.query(
      `INSERT INTO videos (title, embed_url, thumbnail, tags, category, views, created_at)
       VALUES ($1, $2, $3, $4, $5, 0, NOW())
       RETURNING *`,
      [
        video.title,
        video.embedUrl,
        video.thumbnail,
        video.tags || [],
        video.category,
      ]
    );
    return rows[0];
  }

  async updateVideo(
    id: number,
    video: UpdateVideo
  ): Promise<Video | undefined> {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in video) {
      fields.push(`${key} = $${idx + 1}`);
      values.push((video as any)[key]);
      idx++;
    }
    if (fields.length === 0) {
      const { rows } = await pool.query("SELECT * FROM videos WHERE id = $1", [
        id,
      ]);
      return rows[0];
    }
    const query = `UPDATE videos SET ${fields.join(
      ", "
    )} WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id, ...values]);
    return rows[0];
  }

  async deleteVideo(id: number): Promise<boolean> {
    const { rowCount } = await pool.query("DELETE FROM videos WHERE id = $1", [
      id,
    ]);
    return (rowCount ?? 0) > 0;
  }

  async incrementViews(id: number): Promise<void> {
    await pool.query("UPDATE videos SET views = views + 1 WHERE id = $1", [id]);
  }

  async getPopularVideos(): Promise<Video[]> {
    const { rows } = await pool.query(
      "SELECT * FROM videos ORDER BY views DESC LIMIT 12"
    );
    return rows;
  }

  async getLatestVideos(): Promise<Video[]> {
    const { rows } = await pool.query(
      "SELECT * FROM videos ORDER BY created_at DESC LIMIT 8"
    );
    return rows;
  }
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
        thumbnail:
          "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=250&fit=crop",
        tags: ["JAV", "teacher", "busty"],
        category: "JAV",
      },
      {
        title: "Office Lady After Hours",
        embedUrl: "https://streamtape.com/e/DefGHI789012/",
        thumbnail:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop",
        tags: ["office", "professional", "after-hours"],
        category: "Office",
      },
      {
        title: "Student Study Session",
        embedUrl: "https://streamtape.com/e/JklMNO345678/",
        thumbnail:
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop",
        tags: ["student", "study", "young"],
        category: "Student",
      },
      {
        title: "Amateur Home Video",
        embedUrl: "https://streamtape.com/e/PqrSTU901234/",
        thumbnail:
          "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=250&fit=crop",
        tags: ["amateur", "home", "real"],
        category: "Amateur",
      },
      {
        title: "Professional Model Photoshoot",
        embedUrl: "https://streamtape.com/e/VwxYZA567890/",
        thumbnail:
          "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=250&fit=crop",
        tags: ["professional", "model", "photoshoot"],
        category: "Professional",
      },
      {
        title: "Featured Content Special",
        embedUrl: "https://streamtape.com/e/BcdEFG123789/",
        thumbnail:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=250&fit=crop",
        tags: ["featured", "special", "premium"],
        category: "Featured",
      },
      {
        title: "Premium Vidoza Content",
        embedUrl: "https://vidoza.net/embed-jyitcgfvw7l1.html",
        thumbnail:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
        tags: ["vidoza", "premium", "hd"],
        category: "Professional",
      },
      {
        title: "StreamTape Premium Content",
        embedUrl: "https://streamtape.com/e/8VPYkkpPr4UoRJr/",
        thumbnail:
          "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=250&fit=crop",
        tags: ["streamtape", "premium", "hd"],
        category: "Featured",
      },
      {
        title: "Sample YouTube Video",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail:
          "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=250&fit=crop",
        tags: ["youtube", "test", "working"],
        category: "Amateur",
      },
    ];

    sampleVideos.forEach((videoData, index) => {
      const video: Video = {
        ...videoData,
        id: this.currentId++,
        views: Math.floor(Math.random() * 10000) + 100,
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ), // Random date within last 30 days
      };
      this.videos.set(video.id, video);
    });
  }

  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideosByCategory(category: string): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter(
        (video) => video.category.toLowerCase() === category.toLowerCase()
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async searchVideos(query: string): Promise<Video[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.videos.values())
      .filter(
        (video) =>
          video.title.toLowerCase().includes(lowerQuery) ||
          video.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          video.category.toLowerCase().includes(lowerQuery)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
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

  async updateVideo(
    id: number,
    updateVideo: UpdateVideo
  ): Promise<Video | undefined> {
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
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 8);
  }
}

export const storage = new PgStorage();
