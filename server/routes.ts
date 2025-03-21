import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { fetchRandomDogImages, DogApiError } from "./api/dogService";
import { DogImage } from "@shared/schema";

// Active WebSocket connections
const clients = new Set<WebSocket>();

// Function to broadcast dog images to all connected clients
function broadcastDogImages(images: DogImage[]) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'newDogs',
        data: images
      }));
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Dog API endpoint to fetch random dog images
  app.get("/api/dogs", async (req, res) => {
    try {
      const count = parseInt(req.query.count as string) || 3;
      const page = parseInt(req.query.page as string) || 1;
      
      // Limit the count to a reasonable range
      const limitedCount = Math.min(Math.max(count, 1), 10);
      
      const dogImages = await fetchRandomDogImages(limitedCount);
      
      // Broadcast the new dog images to all connected WebSocket clients if it's the first page
      if (page === 1) {
        broadcastDogImages(dogImages);
      }
      
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
  
  // Initialize WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    // Add the new client to our set
    clients.add(ws);
    console.log('WebSocket client connected');
    
    // Send a welcome message
    ws.send(JSON.stringify({ 
      type: 'connection', 
      message: 'Connected to Dog Image WebSocket Server' 
    }));
    
    // Handle messages from clients
    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        
        // Handle fetch request from client
        if (parsedMessage.type === 'fetchDogs') {
          const count = parsedMessage.count || 3;
          const limitedCount = Math.min(Math.max(count, 1), 10);
          
          try {
            const newDogs = await fetchRandomDogImages(limitedCount);
            ws.send(JSON.stringify({
              type: 'newDogs',
              data: newDogs
            }));
          } catch (error) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Failed to fetch dog images'
            }));
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle client disconnection
    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });
  });
  
  return httpServer;
}
