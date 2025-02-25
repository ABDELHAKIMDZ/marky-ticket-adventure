import { useState } from "react";
import { Tutorial } from "@/components/Tutorial";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin, Star, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const Index = () => {
  const { toast } = useToast();
  const [showTutorial, setShowTutorial] = useState(true);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();

  const featuredDestinations = [
    {
      title: "Mountain Retreat",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      price: "$45",
      rating: 4.8,
      location: "Colorado Springs",
      reviews: [
        {
          author: "Sarah M.",
          comment: "Beautiful views and perfect weather!",
          rating: 5,
          date: "2 days ago"
        },
        {
          author: "Mike R.",
          comment: "Great hiking trails nearby",
          rating: 4.5,
          date: "1 week ago"
        }
      ]
    },
    {
      title: "City Explorer",
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511",
      price: "$35",
      rating: 4.6,
      location: "New York City",
      reviews: [
        {
          author: "John D.",
          comment: "Amazing city experience",
          rating: 4.5,
          date: "3 days ago"
        },
        {
          author: "Lisa K.",
          comment: "Perfect location for sightseeing",
          rating: 5,
          date: "5 days ago"
        }
      ]
    },
    {
      title: "Beach Paradise",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      price: "$55",
      rating: 4.9,
      location: "Miami Beach",
      reviews: [
        {
          author: "Alex W.",
          comment: "Crystal clear waters and perfect sand",
          rating: 5,
          date: "1 day ago"
        },
        {
          author: "Emma S.",
          comment: "Best beach vacation ever!",
          rating: 4.8,
          date: "4 days ago"
        }
      ]
    },
  ];

  const handleSearch = () => {
    toast({
      description: "Searching for available tickets...",
      duration: 2000,
    });
  };

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}
      
      <main className="container mx-auto px-4 py-6 animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Welcome to Marky Ticket
          </h1>
          <p className="text-gray-600">Where would you like to go today?</p>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredDestinations.map((destination) => (
              <Card 
                key={destination.title} 
                className="overflow-hidden group hover:shadow-lg transition-all duration-300"
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
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Book Your Trip</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <MapPin className="text-primary" />
              <input
                type="text"
                placeholder="Where to?"
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select onValueChange={setTime} value={time}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-primary" />
                    {time ? time : "Select time"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {times.map((timeOption) => (
                    <SelectItem key={timeOption} value={timeOption}>
                      {timeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full bg-secondary hover:bg-secondary/90 text-white"
              onClick={handleSearch}
            >
              Search Tickets
            </Button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
