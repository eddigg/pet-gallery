import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ControlPanel from "@/components/ControlPanel";
import DogGallery, { DogImage } from "@/components/DogGallery";
import ErrorBanner from "@/components/ErrorBanner";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import { queryClient } from "@/lib/queryClient";
import { Spinner } from "@/components/ui/spinner";
import { useWebSocket } from "@/hooks/use-websocket";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [count, setCount] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [allImages, setAllImages] = useState<DogImage[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNewImages, setHasNewImages] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initialize WebSocket connection
  const { 
    status: wsStatus, 
    newDogs, 
    fetchDogsViaWebSocket, 
    clearNewDogs 
  } = useWebSocket();
  
  // Watch for new dog images via WebSocket
  useEffect(() => {
    if (newDogs.length > 0) {
      if (page === 1) {
        // Automatically update if we're on the first page
        setAllImages(newDogs);
        clearNewDogs();
        toast({
          title: "New dogs arrived!",
          description: `${newDogs.length} new dog images have been loaded.`,
        });
      } else {
        // Otherwise notify user that there are new images
        setHasNewImages(true);
      }
    }
  }, [newDogs, page, clearNewDogs, toast]);
  
  const { 
    data: images = [], 
    isLoading, 
    isError,
    refetch 
  } = useQuery<DogImage[]>({
    queryKey: [`/api/dogs?count=${count}&page=${page}`],
    staleTime: 0,
  });
  
  // Update allImages when new images are fetched
  useEffect(() => {
    if (images.length > 0) {
      if (page === 1) {
        setAllImages(images);
      } else {
        setAllImages(prev => [...prev, ...images]);
      }
      setIsLoadingMore(false);
    }
  }, [images, page]);

  const handleFetchImages = (count: number) => {
    setError(null);
    setPage(1);
    setHasNewImages(false);
    
    if (wsStatus === 'open') {
      // If WebSocket is available, use it
      fetchDogsViaWebSocket(count);
    } else {
      // Otherwise fall back to REST API
      queryClient.invalidateQueries({ queryKey: [`/api/dogs?count=${count}&page=1`] });
    }
  };
  
  const loadMoreImages = useCallback(() => {
    if (!isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      queryClient.invalidateQueries({ queryKey: [`/api/dogs?count=${count}&page=${nextPage}`] });
    }
  }, [count, page, isLoading, isLoadingMore]);
  
  // Handle "Load newest" button
  const handleLoadNewest = () => {
    setPage(1);
    setHasNewImages(false);
    if (newDogs.length > 0) {
      setAllImages(newDogs);
      clearNewDogs();
    } else {
      queryClient.invalidateQueries({ queryKey: [`/api/dogs?count=${count}&page=1`] });
    }
  };
  
  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      { threshold: 1.0 }
    );
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreImages]);

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-6 flex-grow">
        {error && <ErrorBanner message={error} onDismiss={handleDismissError} />}
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {wsStatus === 'open' ? (
              <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-600">
                <Check size={14} />
                <span>Connected</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 text-gray-500 border-gray-500">
                <WifiOff size={14} />
                <span>Offline</span>
              </Badge>
            )}
          </div>
          
          {hasNewImages && (
            <button 
              onClick={handleLoadNewest}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              <Bell size={16} />
              <span>Load newest dogs</span>
            </button>
          )}
        </div>

        <ControlPanel 
          onFetch={handleFetchImages} 
          count={count} 
          setCount={setCount}
          isLoading={isLoading && page === 1} 
        />

        {isLoading && page === 1 ? (
          <DogGallery images={[]} isLoading={true} />
        ) : isError ? (
          <EmptyState />
        ) : allImages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <DogGallery images={allImages} isLoading={false} />
            <div ref={loaderRef} className="flex justify-center my-8">
              {isLoadingMore && <Spinner size="md" />}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
