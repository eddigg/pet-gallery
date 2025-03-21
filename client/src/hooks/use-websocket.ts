import { useState, useEffect, useCallback, useRef } from 'react';
import { DogImage } from '@/components/DogGallery';

type WebSocketMessage = {
  type: string;
  message?: string;
  data?: DogImage[];
};

type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error';

export function useWebSocket() {
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [newDogs, setNewDogs] = useState<DogImage[]>([]);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Create WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    setStatus('connecting');
    
    socket.onopen = () => {
      setStatus('open');
      console.log('WebSocket connection established');
    };
    
    socket.onclose = () => {
      setStatus('closed');
      console.log('WebSocket connection closed');
    };
    
    socket.onerror = (error) => {
      setStatus('error');
      console.error('WebSocket error:', error);
    };
    
    socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        setLastMessage(message);
        
        if (message.type === 'newDogs' && message.data) {
          setNewDogs(message.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    // Clean up on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);
  
  // Function to fetch dogs via WebSocket
  const fetchDogsViaWebSocket = useCallback((count: number) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'fetchDogs',
        count
      }));
    } else {
      console.warn('WebSocket not connected, cannot fetch dogs');
    }
  }, []);
  
  // Reset the newDogs state after consumption
  const clearNewDogs = useCallback(() => {
    setNewDogs([]);
  }, []);
  
  return {
    status,
    newDogs,
    lastMessage,
    fetchDogsViaWebSocket,
    clearNewDogs
  };
}