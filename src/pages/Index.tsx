
import { useState } from "react";
import { Tutorial } from "@/components/Tutorial";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

const Index = () => {
  const [showTutorial, setShowTutorial] = useState(true);

  const featuredDestinations = [
    {
      title: "Mountain Retreat",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      price: "$45",
    },
    {
      title: "City Explorer",
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511",
      price: "$35",
    },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredDestinations.map((destination) => (
              <Card key={destination.title} className="overflow-hidden group">
                <div className="relative h-48">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">{destination.title}</h3>
                    <p className="text-sm">From {destination.price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Book Your Trip</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <MapPin className="text-primary" />
              <input
                type="text"
                placeholder="Where to?"
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-primary" />
                <input
                  type="text"
                  placeholder="Date"
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <Clock className="text-primary" />
                <input
                  type="text"
                  placeholder="Time"
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            </div>
            <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
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
