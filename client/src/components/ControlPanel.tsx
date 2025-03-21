import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ControlPanelProps {
  onFetch: (count: number) => void;
  count: number;
  setCount: (count: number) => void;
  isLoading: boolean;
}

export default function ControlPanel({ onFetch, count, setCount, isLoading }: ControlPanelProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row items-center justify-between bg-card p-4 rounded-lg shadow-md">
      <div className="mb-4 sm:mb-0">
        <h2 className="text-lg font-medium">Browse Dog Images</h2>
        <p className="text-muted-foreground text-sm">Click the button to fetch random dog images</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center">
          <Label htmlFor="count-select" className="mr-2 text-sm font-medium">Images:</Label>
          <Select
            value={count.toString()}
            onValueChange={(value) => setCount(parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="9">9</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={() => onFetch(count)}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full flex items-center shadow-md transition-colors duration-300"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          <span>Fetch Dogs</span>
        </Button>
      </div>
    </div>
  );
}
