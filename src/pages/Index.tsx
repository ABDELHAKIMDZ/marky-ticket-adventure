
import { useState } from "react";
import { Tutorial } from "@/components/Tutorial";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin, Star, MessageCircle, LogIn, UserPlus, ArrowRight, Ticket, QrCode } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PaymentForm } from "@/components/PaymentForm";
import { RouteMap } from "@/components/RouteMap";
import QRCodeGenerator from 'qrcode';

const Index = () => {
  const { toast } = useToast();
  const [showTutorial, setShowTutorial] = useState(true);
  const [showAuth, setShowAuth] = useState(true);
  const [userCredit] = useState(1000); // Example: 1000 DA initial credit
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>();
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [qrCodeData, setQrCodeData] = useState('');
  const [ticketId, setTicketId] = useState('');

  const handleSkip = () => {
    setShowAuth(false);
    toast({
      description: "You can sign up later from the settings menu",
      duration: 3000,
    });
  };

  const handleSignIn = () => {
    setShowAuth(false);
    toast({
      description: "Sign in functionality will be implemented soon",
      duration: 2000,
    });
  };

  const handleSignUp = () => {
    setShowAuth(false);
    toast({
      description: "Sign up functionality will be implemented soon",
      duration: 2000,
    });
  };

  const handleDestinationSelect = (destination: string) => {
    setFrom("Béjaïa Center");
    setTo(destination);
    setShowRouteMap(true);
    
    // Generate price based on destination (example)
    const prices = {
      "Tichy": 150,
      "Aokas": 180,
      "Gouraya": 200,
      "Souk El Tennine": 250,
      "Akbou": 300
    };
    
    setTicketPrice(prices[destination as keyof typeof prices] || 150);
    
    // Reset other fields
    setDate(undefined);
    setSelectedTime(undefined);
    setAvailableTimes([]);
    setShowReservationDetails(false);
    
    toast({
      description: `Selected route: Béjaïa Center to ${destination}`,
      duration: 2000,
    });
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
    setDate(newDate);
    if (newDate && from && to) {
      const times = fetchAvailableTimes(from, to, newDate);
      setAvailableTimes(times);
      setSelectedTime(undefined);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleReservation = async () => {
    if (!from || !to || !date || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select all trip details",
        variant: "destructive",
      });
      return;
    }

    // Generate ticket ID
    const newTicketId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setTicketId(newTicketId);

    // Create ticket data for QR code
    const ticketData = {
      id: newTicketId,
      from,
      to,
      date: format(date, 'yyyy-MM-dd'),
      time: selectedTime,
      price: ticketPrice,
      issued: new Date().toISOString(),
    };

    try {
      // Generate QR code
      const qrCode = await QRCodeGenerator.toDataURL(JSON.stringify(ticketData));
      setQrCodeData(qrCode);
      setShowReservationDetails(true);

      toast({
        title: "Success!",
        description: "Your ticket has been reserved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ticket QR code",
        variant: "destructive",
      });
    }
  };

  const resetReservation = () => {
    setFrom(undefined);
    setTo(undefined);
    setDate(undefined);
    setSelectedTime(undefined);
    setShowRouteMap(false);
    setShowReservationDetails(false);
  };

  const featuredDestinations = [
    {
      title: "Béjaïa Center",
      image: "https://images.unsplash.com/photo-1590167920596-706a39e48bc5",
      price: "200 DA",
      rating: 4.8,
      location: "Downtown Béjaïa",
      reviews: [
        {
          author: "Karim M.",
          comment: "Beautiful historic city center!",
          rating: 5,
          date: "2 days ago"
        },
        {
          author: "Sarah B.",
          comment: "Great shopping areas",
          rating: 4.5,
          date: "1 week ago"
        }
      ]
    },
    {
      title: "Tichy Beach",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      price: "150 DA",
      rating: 4.9,
      location: "Tichy",
      reviews: [
        {
          author: "Ahmed L.",
          comment: "Beautiful Mediterranean beach",
          rating: 5,
          date: "3 days ago"
        },
        {
          author: "Lina K.",
          comment: "Perfect for summer vacation",
          rating: 5,
          date: "5 days ago"
        }
      ]
    },
    {
      title: "Gouraya National Park",
      image: "https://images.unsplash.com/photo-1565019011521-b0456c7a1405",
      price: "300 DA",
      rating: 4.7,
      location: "Gouraya",
      reviews: [
        {
          author: "Yacine R.",
          comment: "Amazing hiking trails and views",
          rating: 4.8,
          date: "1 day ago"
        },
        {
          author: "Amira H.",
          comment: "Must-visit natural attraction",
          rating: 4.6,
          date: "4 days ago"
        }
      ]
    }
  ];

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-secondary">Welcome to Marky Ticket</h1>
            <p className="text-gray-600">Your Béjaïa travel companion</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full" 
              onClick={handleSignIn}
              variant="outline"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            
            <Button 
              className="w-full"
              onClick={handleSignUp}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
            
            <Button 
              className="w-full"
              variant="ghost"
              onClick={handleSkip}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue as Guest
            </Button>
          </div>
          
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}
      
      <main className="container mx-auto px-4 py-6 animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Explore Béjaïa
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Discover the beauty of Béjaïa</p>
            <div className="bg-secondary/10 px-4 py-2 rounded-full">
              <span className="font-semibold text-secondary">
                Credit: {userCredit} DA
              </span>
            </div>
          </div>
        </header>

        {!from && !to && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {featuredDestinations.map((destination) => (
              <Card 
                key={destination.title} 
                className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleDestinationSelect(destination.location)}
              >
                <div className="relative h-48">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">{destination.title}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{destination.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{destination.rating}</span>
                      </div>
                      <span className="font-semibold">From {destination.price}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Latest Reviews</span>
                  </div>
                  <div className="space-y-3">
                    {destination.reviews.map((review, index) => (
                      <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{review.author}</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </section>
        )}

        {from && to && !showReservationDetails && (
          <div className="space-y-6">
            {showRouteMap && (
              <RouteMap from={from} to={to} />
            )}
            
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Book Your Trip</CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">From</label>
                    <div className="bg-gray-100 p-3 rounded-md">
                      {from}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">To</label>
                    <div className="bg-gray-100 p-3 rounded-md">
                      {to}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <Select
                      disabled={availableTimes.length === 0}
                      value={selectedTime}
                      onValueChange={handleTimeSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-between items-center">
                  <div>
                    {selectedTime && (
                      <div className="font-medium">
                        Price: <span className="text-primary">{ticketPrice} DA</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={resetReservation}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleReservation}
                      disabled={!from || !to || !date || !selectedTime}
                    >
                      <Ticket className="mr-2 h-4 w-4" />
                      Reserve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showReservationDetails && (
          <Card className="overflow-hidden">
            <div className="bg-primary text-white p-6">
              <h2 className="text-xl font-bold mb-1">Ticket Confirmation</h2>
              <p className="opacity-90">Your ticket has been reserved successfully</p>
            </div>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Ticket ID</p>
                    <p className="font-medium">{ticketId}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium">{from}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-medium">{to}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{date && format(date, 'PPP')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{selectedTime}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium text-lg text-primary">{ticketPrice} DA</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={resetReservation} 
                      className="w-full"
                    >
                      Book Another Ticket
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-md mb-4 max-w-[200px]">
                    {qrCodeData && (
                      <img src={qrCodeData} alt="Ticket QR Code" className="w-full h-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Scan this QR code to validate your ticket</p>
                    <div className="flex items-center justify-center gap-1 text-primary">
                      <QrCode className="h-4 w-4" />
                      <span className="text-sm font-medium">Valid for one use only</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
