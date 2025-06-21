import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  embedUrl: text("embed_url").notNull(),
  thumbnail: text("thumbnail").notNull(),
  tags: text("tags").array().notNull().default([]),
  category: text("category").notNull(),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  views: true,
  createdAt: true,
});

export const updateVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
}).partial();

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type UpdateVideo = z.infer<typeof updateVideoSchema>;
export type Video = typeof videos.$inferSelect;

export const categories = [
  "JAV",
  "Amateur", 
  "Professional",
  "Office",
  "Student",
  "Teacher",
  "Fetish",
  "Featured",
  "Trending"
] as const;
