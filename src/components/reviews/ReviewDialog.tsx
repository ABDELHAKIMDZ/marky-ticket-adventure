
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Destination } from "@/types/app";

interface ReviewDialogProps {
  destination: Destination | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmitReview: () => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  currentRating: number;
  setCurrentRating: (rating: number) => void;
}

export const ReviewDialog = ({
  destination,
  open,
  setOpen,
  onSubmitReview,
  reviewText,
  setReviewText,
  currentRating,
  setCurrentRating
}: ReviewDialogProps) => {
  if (!destination) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your experience at {destination.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setCurrentRating(rating)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    rating <= currentRating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Share your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmitReview}
            disabled={currentRating === 0}
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
