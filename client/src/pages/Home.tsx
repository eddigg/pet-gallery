import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ControlPanel from "@/components/ControlPanel";
import DogGallery, { DogImage } from "@/components/DogGallery";
import ErrorBanner from "@/components/ErrorBanner";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import { queryClient } from "@/lib/queryClient";

export default function Home() {
  const [count, setCount] = useState(3);
  const [error, setError] = useState<string | null>(null);

  const { 
    data: images = [], 
    isLoading, 
    isError,
    refetch 
  } = useQuery<DogImage[]>({
    queryKey: [`/api/dogs?count=${count}`],
    staleTime: 0,
  });

  const handleFetchImages = (count: number) => {
    setError(null);
    queryClient.invalidateQueries({ queryKey: [`/api/dogs?count=${count}`] });
  };

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
          isLoading={isLoading} 
        />

        {isLoading ? (
          <DogGallery images={[]} isLoading={true} />
        ) : isError ? (
          <EmptyState />
        ) : images.length === 0 ? (
          <EmptyState />
        ) : (
          <DogGallery images={images} isLoading={false} />
        )}
      </main>

      <Footer />
    </div>
  );
}
