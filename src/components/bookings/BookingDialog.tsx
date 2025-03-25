
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BookingForm } from "@/components/bookings/BookingForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RouteMap } from "@/components/RouteMap";
import { Promotion } from "@/types/app";

interface BookingDialogProps {
  from?: string;
  to?: string;
  date?: Date;
  ticketPrice: number;
  discountedPrice: number;
  selectedTime?: string;
  availableTimes: string[];
  appliedPromo: Promotion | null;
  multiCityTrip: boolean;
  intermediateStops: string[];
  promoCode: string;
  tripStops: string[];
  routeMapProps: {
    from: string;
    to: string;
    intermediateStops: string[];
  };
  promotions: Promotion[];
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
  onCancel: () => void;
}

export const BookingDialog = ({
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
  tripStops,
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
  onCancel,
}: BookingDialogProps) => {
  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Book Your Trip</DialogTitle>
        <DialogDescription>
          Complete your booking details for the trip from {from} to {to}.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        <Card className="p-4">
          <BookingForm
            from={from}
            to={to}
            date={date}
            ticketPrice={ticketPrice}
            discountedPrice={discountedPrice}
            selectedTime={selectedTime}
            availableTimes={availableTimes}
            appliedPromo={appliedPromo}
            multiCityTrip={multiCityTrip}
            intermediateStops={intermediateStops}
            promoCode={promoCode}
            routeMapProps={routeMapProps}
            promotions={promotions}
            onFromChange={onFromChange}
            onToChange={onToChange}
            onDateSelect={onDateSelect}
            onTimeSelect={onTimeSelect}
            onPromoCodeChange={onPromoCodeChange}
            onApplyPromoCode={onApplyPromoCode}
            onRemovePromoCode={onRemovePromoCode}
            onMultiCityToggle={onMultiCityToggle}
            onAddIntermediateStop={onAddIntermediateStop}
            onRemoveIntermediateStop={onRemoveIntermediateStop}
            onReservation={onReservation}
            onResetReservation={onCancel}
          />
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Route Map</h3>
          <div className="h-80 border rounded">
            <RouteMap {...routeMapProps} />
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Route Information</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {tripStops.map((stop, index) => (
                <li key={index}>{stop}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onReservation} disabled={!from || !to || !date || !selectedTime}>
          Complete Booking
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
