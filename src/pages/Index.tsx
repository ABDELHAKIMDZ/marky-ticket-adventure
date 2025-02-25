
import { useState } from "react";
import { Tutorial } from "@/components/Tutorial";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [showTutorial, setShowTutorial] = useState(true);

  const featuredDestinations = [
    {
      title: "Mountain Retreat",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      price: "$45",
      rating: 4.8,
      location: "Colorado Springs",
    },
    {
      title: "City Explorer",
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511",
      price: "$35",
      rating: 4.6,
      location: "New York City",
    },
    {
      title: "Beach Paradise",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      price: "$55",
      rating: 4.9,
      location: "Miami Beach",
    },
  ];

  const handleSearch = () => {
    toast({
      description: "Searching for available tickets...",
      duration: 2000,
    });
  };

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
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Calendar className="text-primary" />
                <input
                  type="text"
                  placeholder="Date"
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Clock className="text-primary" />
                <input
                  type="text"
                  placeholder="Time"
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
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
