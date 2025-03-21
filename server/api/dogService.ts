import { DogImage } from "@shared/schema";

export class DogApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "DogApiError";
  }
}

export async function fetchRandomDogImages(count: number): Promise<DogImage[]> {
  try {
    const response = await fetch(`https://api.thedogapi.com/v1/images/search?limit=${count}&has_breeds=1`);
    
    if (!response.ok) {
      throw new DogApiError(
        `The Dog API returned an error: ${response.statusText}`, 
        response.status
      );
    }
    
    const data = await response.json();
    
    // Transform the API response to match our schema
    return data.map((item: any) => ({
      id: item.id,
      url: item.url,
      breeds: item.breeds || []
    }));
  } catch (error) {
    if (error instanceof DogApiError) {
      throw error;
    }
    
    // Handle network errors or other issues
    throw new DogApiError(
      "Failed to connect to the Dog API. Please check your internet connection.",
      503
    );
  }
}
