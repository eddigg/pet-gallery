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

export default function Home() {
  const [count, setCount] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [allImages, setAllImages] = useState<DogImage[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  
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
    queryClient.invalidateQueries({ queryKey: [`/api/dogs?count=${count}&page=1`] });
  };
  
  const loadMoreImages = useCallback(() => {
    if (!isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      queryClient.invalidateQueries({ queryKey: [`/api/dogs?count=${count}&page=${nextPage}`] });
    }
  }, [count, page, isLoading, isLoadingMore]);
  
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
