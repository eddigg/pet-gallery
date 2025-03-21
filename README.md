# Dog Gallery

A web application that displays random dog images fetched from the Dog API.

## Features

- Fetch random dog images from the Dog API
- Control the number of images displayed (1, 3, 6, 9)
- Responsive design that works on all devices
- Infinite scrolling for seamless browsing experience
- Real-time updates via WebSocket for immediate notification of new dog images
- Connection status indicator showing WebSocket connection state
- "Load newest" button to quickly fetch the latest images

## Technologies Used

- Frontend: React, TypeScript, TailwindCSS, shadcn/ui
- Backend: Node.js, Express
- State Management: React Query
- Real-time Communication: WebSockets (ws library)
- Styling: TailwindCSS with custom theme

## Running Locally

1. Clone the repository
   ```
   git clone https://github.com/eddigg/pet-gallery.git
   cd pet-gallery
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## How It Works

- The application fetches random dog images from the Dog API
- Images are displayed in a responsive grid layout
- Users can control how many images to fetch at once
- As users scroll down, more images are automatically loaded
- WebSocket connection provides real-time updates when new images are available

## License

MIT