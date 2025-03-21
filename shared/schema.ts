import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Dog images schema
export const dogImages = pgTable("dog_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  breeds: jsonb("breeds").$type<Array<{ name: string; breed_group?: string }>>(),
});

export const insertDogImageSchema = createInsertSchema(dogImages).pick({
  url: true,
  breeds: true,
});

export type InsertDogImage = z.infer<typeof insertDogImageSchema>;
export type DogImage = typeof dogImages.$inferSelect;

// Keep the original users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
