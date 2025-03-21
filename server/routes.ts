import type { Express } from "express";
import { createServer, type Server } from "http";
import { fetchRandomDogImages, DogApiError } from "./api/dogService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dog API endpoint to fetch random dog images
  app.get("/api/dogs", async (req, res) => {
    try {
      const count = parseInt(req.query.count as string) || 3;
      const page = parseInt(req.query.page as string) || 1;
      
      // Limit the count to a reasonable range
      const limitedCount = Math.min(Math.max(count, 1), 10);
      
      const dogImages = await fetchRandomDogImages(limitedCount);
      res.json(dogImages);
    } catch (error) {
      console.error("Error fetching dog images:", error);
      
      if (error instanceof DogApiError) {
        res.status(error.statusCode).json({ 
          message: error.message 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to fetch dog images. Please try again later." 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
