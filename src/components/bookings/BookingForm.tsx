
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { RouteMapProps } from "@/components/RouteMap";

interface BookingFormProps {
  from?: string;
  to?: string;
  date?: Date;
  ticketPrice: number;
  discountedPrice: number;
  selectedTime?: string;
  availableTimes: string[];
  appliedPromo: any;
  multiCityTrip: boolean;
  intermediateStops: string[];
  promoCode: string;
  routeMapProps: Partial<RouteMapProps>;
  promotions: Array<{
    id: string;
    code: string;
    discount: number;
    description: string;
    expiryDate: string;
    minimumPurchase?: number;
  }>;
  onFromChange: (value?: string) => void;
  onToChange: (value?: string) => void;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  onPromoCodeChange: (code: string) => void;
  onApplyPromoCode: () => void;
  onRemovePromoCode: () => void;
  onMultiCityToggle: (value: boolean) => void;
  onAddIntermediateStop: (stop: string) => void;
  onRemoveIntermediateStop: (stop: string) => void;
  onReservation: () => void;
  onResetReservation: () => void;
}

export const BookingForm = ({
  from,
  to,
  date,
  ticketPrice,
  discountedPrice,
  selectedTime,
  availableTimes,
  appliedPromo,
  multiCityTrip,
  intermediateStops,
  promoCode,
  routeMapProps,
  promotions,
  onFromChange,
  onToChange,
  onDateSelect,
  onTimeSelect,
  onPromoCodeChange,
  onApplyPromoCode,
  onRemovePromoCode,
  onMultiCityToggle,
  onAddIntermediateStop,
  onRemoveIntermediateStop,
  onReservation,
  onResetReservation,
}: BookingFormProps) => {
  const [newStop, setNewStop] = useState("");
  
  const possibleStops = [
    "Béjaïa University", 
    "Ihaddaden", 
    "Tichy Beach", 
    "Béjaïa Port", 
    "Soummam Valley", 
    "Aokas Center",
    "Béjaïa Market",
    "Yemma Gouraya Turn",
    "Gouraya National Park",
    "Béjaïa Exit",
    "Oued Ghir",
    "Souk El Tennine Center",
    "El Kseur",
    "Tazmalt"
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <Select value={from} onValueChange={onFromChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select departure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Béjaïa Center">Béjaïa Center</SelectItem>
              <SelectItem value="Béjaïa University">Béjaïa University</SelectItem>
              <SelectItem value="Béjaïa Port">Béjaïa Port</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <Select value={to} onValueChange={onToChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tichy">Tichy</SelectItem>
              <SelectItem value="Aokas">Aokas</SelectItem>
              <SelectItem value="Gouraya">Gouraya</SelectItem>
              <SelectItem value="Souk El Tennine">Souk El Tennine</SelectItem>
              <SelectItem value="Akbou">Akbou</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {from && to && (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onDateSelect}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {date && availableTimes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Time</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="text-sm"
                      onClick={() => onTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4 border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Multi-city trip</h3>
                <p className="text-sm text-gray-500">Add intermediate stops</p>
              </div>
              <Button
                variant={multiCityTrip ? "default" : "outline"}
                onClick={() => onMultiCityToggle(!multiCityTrip)}
              >
                {multiCityTrip ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            {multiCityTrip && (
              <div className="space-y-3">
                {intermediateStops.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Selected Stops</label>
                    <div className="flex flex-wrap gap-2">
                      {intermediateStops.map((stop) => (
                        <Badge key={stop} variant="secondary" className="pl-2 pr-1 py-1.5">
                          {stop}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1 hover:bg-gray-200"
                            onClick={() => onRemoveIntermediateStop(stop)}
                          >
                            <X size={12} />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Select value={newStop} onValueChange={setNewStop}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a stop" />
                    </SelectTrigger>
                    <SelectContent>
                      {possibleStops
                        .filter((stop) => !intermediateStops.includes(stop))
                        .map((stop) => (
                          <SelectItem key={stop} value={stop}>
                            {stop}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => {
                      if (newStop) {
                        onAddIntermediateStop(newStop);
                        setNewStop("");
                      }
                    }}
                    disabled={!newStop}
                  >
                    <Plus size={18} />
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3 border-t pt-4 mt-4">
            <h3 className="font-medium">Ticket Price</h3>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{discountedPrice} DA</span>
            </div>
            
            {ticketPrice !== discountedPrice && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Original price:</span>
                <span className="line-through text-gray-500">{ticketPrice} DA</span>
              </div>
            )}
            
            <div className="pt-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => onPromoCodeChange(e.target.value)}
                  disabled={!!appliedPromo}
                  className="flex-1"
                />
                {!appliedPromo ? (
                  <Button onClick={onApplyPromoCode} disabled={!promoCode}>
                    Apply
                  </Button>
                ) : (
                  <Button variant="outline" onClick={onRemovePromoCode}>
                    <X size={18} className="mr-1" /> Remove
                  </Button>
                )}
              </div>
              
              {appliedPromo && (
                <div className="mt-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {appliedPromo.discount}% discount applied
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onResetReservation}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={onReservation}
              disabled={!from || !to || !date || !selectedTime}
            >
              Book Now
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
