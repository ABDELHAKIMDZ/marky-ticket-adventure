
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BookingForm } from "@/components/bookings/BookingForm";
import { RouteMap } from "@/components/RouteMap";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Promotion, Ticket } from "@/types/app";
import { BottomNav } from "@/components/BottomNav";

const BookingPage = () => {
  const [from, setFrom] = useState<string>("Béjaïa Center");
  const [to, setTo] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [multiCityTrip, setMultiCityTrip] = useState(false);
  const [intermediateStops, setIntermediateStops] = useState<string[]>([]);
  const [tripStops, setTripStops] = useState<string[]>([]);

  const promotions: Promotion[] = [
    {
      id: "1",
      code: "SUMMER30",
      discount: 30,
      description: "Summer special 30% off",
      expiryDate: "2024-07-30",
    },
    {
      id: "2",
      code: "WELCOME15",
      discount: 15,
      description: "New user discount",
      expiryDate: "2024-12-31",
      minimumPurchase: 200
    }
  ];

  const generateStops = (start: string, end: string) => {
    const routeStops: {[key: string]: string[]} = {
      "Tichy": ["Béjaïa University", "Ihaddaden", "Tichy Beach"],
      "Aokas": ["Béjaïa Port", "Soummam Valley", "Aokas Center"],
      "Gouraya": ["Béjaïa Market", "Yemma Gouraya Turn", "Gouraya National Park"],
      "Souk El Tennine": ["Béjaïa Exit", "Oued Ghir", "Souk El Tennine Center"],
      "Akbou": ["Béjaïa South", "El Kseur", "Tazmalt", "Akbou Terminal"]
    };
    
    setTripStops(routeStops[end] || []);
  };

  const fetchAvailableTimes = (from: string, to: string, date: Date) => {
    const times: string[] = [];
    const startHour = 6;
    const endHour = 22;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      if (Math.random() > 0.5) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
      }
      if (Math.random() > 0.5) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    
    return times.sort();
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      if (from && to) {
        const times = fetchAvailableTimes(from, to, newDate);
        setAvailableTimes(times);
        setSelectedTime(undefined);
      }
    }
  };

  const handleDestinationSelect = (destination: string) => {
    setTo(destination);
    
    const prices: {[key: string]: number} = {
      "Tichy": 150,
      "Aokas": 180,
      "Gouraya": 200,
      "Souk El Tennine": 250,
      "Akbou": 300
    };
    
    const price = prices[destination] || 150;
    setTicketPrice(price);
    setDiscountedPrice(price);
    
    generateStops(from, destination);
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a promo code",
        variant: "destructive",
      });
      return;
    }
    
    const promo = promotions.find(p => p.code === promoCode.trim().toUpperCase());
    
    if (!promo) {
      toast({
        title: "Invalid Code",
        description: "The promo code you entered is invalid",
        variant: "destructive",
      });
      return;
    }
    
    if (new Date(promo.expiryDate) < new Date()) {
      toast({
        title: "Expired Code",
        description: "This promo code has expired",
        variant: "destructive",
      });
      return;
    }
    
    if (promo.minimumPurchase && ticketPrice < promo.minimumPurchase) {
      toast({
        title: "Minimum Purchase Required",
        description: `This code requires a minimum purchase of ${promo.minimumPurchase} DA`,
        variant: "destructive",
      });
      return;
    }
    
    const discount = (ticketPrice * promo.discount) / 100;
    setDiscountedPrice(ticketPrice - discount);
    setAppliedPromo(promo);
    
    toast({
      title: "Promo Applied!",
      description: `${promo.discount}% discount applied to your ticket`,
    });
  };

  const removePromoCode = () => {
    setDiscountedPrice(ticketPrice);
    setAppliedPromo(null);
    setPromoCode("");
    
    toast({
      description: "Promo code removed",
      duration: 2000,
    });
  };

  const handleAddIntermediateStop = (stop: string) => {
    if (intermediateStops.includes(stop)) {
      toast({
        title: "Stop already added",
        description: "This stop is already in your route",
        variant: "destructive",
      });
      return;
    }
    
    setIntermediateStops([...intermediateStops, stop]);
    setTicketPrice(prevPrice => {
      const newPrice = prevPrice + 50;
      setDiscountedPrice(appliedPromo ? 
        newPrice - (newPrice * appliedPromo.discount / 100) : 
        newPrice
      );
      return newPrice;
    });
    
    toast({
      description: `Added ${stop} to your route`,
      duration: 2000,
    });
  };

  const handleRemoveIntermediateStop = (stop: string) => {
    setIntermediateStops(intermediateStops.filter(s => s !== stop));
    setTicketPrice(prevPrice => {
      const newPrice = prevPrice - 50;
      setDiscountedPrice(appliedPromo ? 
        newPrice - (newPrice * appliedPromo.discount / 100) : 
        newPrice
      );
      return newPrice;
    });
    
    toast({
      description: `Removed ${stop} from your route`,
      duration: 2000,
    });
  };

  const routeMapProps = {
    from,
    to: to || "",
    intermediateStops
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Book Your Trip</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onFromChange={setFrom}
              onToChange={handleDestinationSelect}
              onDateSelect={handleDateSelect}
              onTimeSelect={setSelectedTime}
              onPromoCodeChange={setPromoCode}
              onApplyPromoCode={applyPromoCode}
              onRemovePromoCode={removePromoCode}
              onMultiCityToggle={setMultiCityTrip}
              onAddIntermediateStop={handleAddIntermediateStop}
              onRemoveIntermediateStop={handleRemoveIntermediateStop}
              onReservation={() => {}}
              onResetReservation={() => {
                setFrom("Béjaïa Center");
                setTo(undefined);
                setDate(undefined);
                setSelectedTime(undefined);
                setPromoCode("");
                setAppliedPromo(null);
                setMultiCityTrip(false);
                setIntermediateStops([]);
              }}
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
      </main>
      <BottomNav />
    </div>
  );
};

export default BookingPage;
