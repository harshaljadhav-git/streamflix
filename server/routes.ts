import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, updateVideoSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all videos
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Get video by ID
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }

      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  // Increment video views
  app.post("/api/videos/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }

      await storage.incrementViews(id);
      const video = await storage.getVideo(id);
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  // Get videos by category
  app.get("/api/videos/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const videos = await storage.getVideosByCategory(category);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos by category" });
    }
  });

  // Search videos
  app.get("/api/videos/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const videos = await storage.searchVideos(query);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to search videos" });
    }
  });

  // Get popular videos
  app.get("/api/videos/popular/list", async (req, res) => {
    try {
      const videos = await storage.getPopularVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular videos" });
    }
  });

  // Get latest videos
  app.get("/api/videos/latest/list", async (req, res) => {
    try {
      const videos = await storage.getLatestVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest videos" });
    }
  });

  // Create video (admin)
  app.post("/api/videos", async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  // Update video (admin)
  app.put("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }

      const validatedData = updateVideoSchema.parse(req.body);
      const video = await storage.updateVideo(id, validatedData);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  // Delete video (admin)
  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }

      const deleted = await storage.deleteVideo(id);
      if (!deleted) {
        return res.status(404).json({ message: "Video not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
