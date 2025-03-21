import { XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <div className="flex items-start">
        <XCircle className="h-5 w-5 mr-2" />
        <div>
          <AlertTitle>Error fetching dog images</AlertTitle>
          <AlertDescription className="text-sm mt-1">
            {message || "Please check your connection and try again."}
          </AlertDescription>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="ml-auto" 
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
