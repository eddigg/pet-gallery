import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { memo } from "react";

export interface DogImage {
  url: string;
  id?: string;
  breeds: {
    name: string;
    breed_group?: string;
  }[];
}

interface DogGalleryProps {
  images: DogImage[];
  isLoading: boolean;
}

function DogGallery({ images, isLoading }: DogGalleryProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => (
        <Card 
          key={`${image.id || image.url}-${index}`} 
          className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="relative pb-[75%] bg-gray-100">
            <img 
              src={image.url} 
              alt="Random dog" 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">
                  {image.breeds && image.breeds.length > 0 
                    ? image.breeds[0].name 
                    : "Unknown Breed"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {image.breeds && image.breeds.length > 0 && image.breeds[0].breed_group
                    ? image.breeds[0].breed_group
                    : "Unknown"}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-primary">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(DogGallery);
