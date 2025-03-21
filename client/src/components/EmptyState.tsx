import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <SearchX className="h-16 w-16 text-gray-300" />
      <h3 className="text-xl font-medium mt-4">No images found</h3>
      <p className="text-muted-foreground mt-2 text-center max-w-md">
        We couldn't find any dog images. Please try again or check your connection.
      </p>
    </div>
  );
}
