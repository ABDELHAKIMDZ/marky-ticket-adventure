
import { Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Destination } from "@/types/app";

interface DestinationCardProps {
  destination: Destination;
  isFavorite: boolean;
  onSelect: (destination: string) => void;
  onToggleFavorite: (location: string) => void;
  onReviewClick: (destination: Destination) => void;
}

export const DestinationCard = ({ 
  destination, 
  isFavorite, 
  onSelect, 
  onToggleFavorite,
  onReviewClick
}: DestinationCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img
          src={destination.image}
          alt={destination.title}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full"
          onClick={() => onToggleFavorite(destination.location)}
        >
          <Heart
            className={`${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
            size={18}
          />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{destination.title}</h3>
          <div className="flex items-center">
            <Star className="text-yellow-500 w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{destination.rating}</span>
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-gray-600 text-sm">{destination.location}</span>
          <Badge variant="outline" className="text-primary">
            {destination.price}
          </Badge>
        </div>
        {destination.distance && destination.travelTime && (
          <div className="flex justify-between text-xs text-gray-500 mb-3">
            <span>Distance: {destination.distance}</span>
            <span>Travel time: {destination.travelTime}</span>
          </div>
        )}
        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReviewClick(destination)}
          >
            Reviews ({destination.reviews.length})
          </Button>
          <Button
            size="sm"
            onClick={() => onSelect(destination.location)}
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
