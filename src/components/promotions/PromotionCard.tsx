
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Promotion {
  id: string;
  code: string;
  discount: number;
  description: string;
  expiryDate: string;
  minimumPurchase?: number;
}

interface PromotionCardProps {
  promotion: Promotion;
  onApplyCode: (code: string) => void;
}

export const PromotionCard = ({ promotion, onApplyCode }: PromotionCardProps) => {
  const isExpired = new Date(promotion.expiryDate) < new Date();
  
  const expiryDistance = formatDistanceToNow(new Date(promotion.expiryDate), {
    addSuffix: true
  });

  return (
    <Card className={`${isExpired ? "opacity-60" : ""}`}>
      <CardHeader className="bg-primary/10 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl flex items-center">
            <Tag className="mr-2 h-5 w-5 text-primary" />
            {promotion.discount}% OFF
          </CardTitle>
          <Badge variant={isExpired ? "destructive" : "outline"}>
            {isExpired ? "Expired" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="bg-gray-100 rounded px-3 py-2 font-mono text-sm">
            {promotion.code}
          </div>
          
          <p className="text-sm">{promotion.description}</p>
          
          {promotion.minimumPurchase && (
            <p className="text-xs text-gray-500">
              Minimum purchase: {promotion.minimumPurchase} DA
            </p>
          )}
          
          <div className="flex items-center text-xs text-gray-500 pt-1">
            <Clock className="h-3 w-3 mr-1" />
            <span>Expires {expiryDistance}</span>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4" 
          disabled={isExpired}
          onClick={() => onApplyCode(promotion.code)}
          variant={isExpired ? "outline" : "default"}
        >
          {isExpired ? "Expired" : "Use Code"}
        </Button>
      </CardContent>
    </Card>
  );
};
