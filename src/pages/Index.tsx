import { useState } from "react";
import { Tutorial } from "@/components/Tutorial";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin, Star, MessageCircle, LogIn, UserPlus, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PaymentForm } from "@/components/PaymentForm";
import { RouteMap } from "@/components/RouteMap";

const Index = () => {
  const { toast } = useToast();
  const [showTutorial, setShowTutorial] = useState(true);
  const [showAuth, setShowAuth] = useState(true);
  const [date, setDate] = useState<Date>();
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>();
  const [showPayment, setShowPayment] = useState(false);

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
      location: "Tichy, Béjaïa",
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
      location: "Gouraya, Béjaïa",
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

  const locations = [
    "Béjaïa Center",
    "Tichy",
    "Aokas",
    "Gouraya",
    "Souk El Tennine",
    "Akbou"
  ];

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

  const handleRouteSelect = (value: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setFrom(value);
    } else {
      setTo(value);
    }
    
    if (date && ((type === 'from' && to) || (type === 'to' && from))) {
      const times = fetchAvailableTimes(type === 'from' ? value : from!, type === 'to' ? value : to!, date);
      setAvailableTimes(times);
      setSelectedTime(undefined);
    }
  };

  const handleSearch = () => {
    if (from && to && date && selectedTime) {
      setShowPayment(true);
      toast({
        description: "Please complete payment to get your ticket",
      });
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Success!",
      description: "Your ticket is ready. You can find it in the Tickets section.",
    });
  };

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
          <p className="text-gray-600">Discover the beauty of Béjaïa</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {featuredDestinations.map((destination) => (
            <Card 
              key={destination.title} 
              className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => {
                setFrom("Béjaïa Center"); // Default starting point
                setTo(destination.location);
                toast({
                  description: `Selected destination: ${destination.location}`,
                  duration: 2000,
                });
              }}
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

        {(from || to) && !showPayment && (
          <section className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Book Your Trip</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select onValueChange={(value) => handleRouteSelect(value, 'from')} value={from}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      {from ? from : "From"}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleRouteSelect(value, 'to')} value={to}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      {to ? to : "To"}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {locations.filter(loc => loc !== from).map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {availableTimes.length > 0 && (
                  <Select onValueChange={setSelectedTime} value={selectedTime}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-primary" />
                        {selectedTime ? selectedTime : "Select time"}
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((timeOption) => (
                        <SelectItem key={timeOption} value={timeOption}>
                          {timeOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Button 
                className="w-full bg-secondary hover:bg-secondary/90 text-white"
                onClick={handleSearch}
                disabled={!from || !to || !date || !selectedTime}
              >
                Search Tickets
              </Button>
            </div>
          </section>
        )}

        {showPayment && from && to && date && selectedTime && (
          <div className="space-y-6">
            <RouteMap from={from} to={to} />
            <PaymentForm
              price="200 DA"
              from={from}
              to={to}
              date={date}
              time={selectedTime}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
