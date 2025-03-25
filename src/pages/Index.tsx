import { useState, useEffect } from "react";
import { Tutorial } from "@/components/Tutorial";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { BookingDialog } from "@/components/bookings/BookingDialog";
import { TicketDetails } from "@/components/tickets/TicketDetails";
import { UserProfileSheet } from "@/components/profile/UserProfileSheet";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { PromotionCard } from "@/components/promotions/PromotionCard";

import QRCodeGenerator from 'qrcode';
import copy from 'clipboard-copy';
import { format } from "date-fns";
import { Destination, Ticket, Profile, Promotion, Review, Notification } from "@/types/app";

const Index = () => {
  const { toast } = useToast();
  
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [userCredit, setUserCredit] = useState(1000);
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [qrCodeData, setQrCodeData] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [tripStops, setTripStops] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("explore");
  const [profileOpen, setProfileOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [multiCityTrip, setMultiCityTrip] = useState(false);
  const [intermediateStops, setIntermediateStops] = useState<string[]>([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [reviewDestination, setReviewDestination] = useState<Destination | null>(null);
  const [shareTicketUrl, setShareTicketUrl] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketDetailsDialog, setShowTicketDetailsDialog] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    name: "Sarah Ahmed",
    email: "sarah.ahmed@example.com",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    phone: "+213 555 123456",
    preferredPayment: "Credit Card",
    notifications: true,
    favorites: ["Tichy", "Gouraya"],
    points: 450
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Your trip is tomorrow!",
      message: "Don't forget your upcoming trip to Tichy at 14:00",
      isRead: false,
      date: "Just now"
    },
    {
      id: "2",
      title: "Special summer discount!",
      message: "Use code SUMMER30 for 30% off your next trip",
      isRead: true,
      date: "2 days ago"
    }
  ]);

  const [promotions, setPromotions] = useState<Promotion[]>([
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
    },
    {
      id: "3",
      code: "WEEKEND10",
      discount: 10,
      description: "Weekend special discount",
      expiryDate: "2024-08-31",
    }
  ]);

  useEffect(() => {
    const tutorialSeen = localStorage.getItem("tutorialSeen");
    const authSeen = localStorage.getItem("authSeen");
    
    if (tutorialSeen) {
      setShowTutorial(false);
      if (!authSeen) {
        setShowAuth(true);
      }
    } else {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem("tutorialSeen", "true");
    setShowAuth(true);
  };

  const handleSkip = () => {
    setShowAuth(false);
    localStorage.setItem("authSeen", "true");
    toast({
      description: "You can sign up later from the settings menu",
      duration: 3000,
    });
  };

  const handleSignIn = () => {
    setShowAuth(false);
    localStorage.setItem("authSeen", "true");
    setUserProfile({
      ...userProfile,
      name: "Sarah Ahmed",
      email: "sarah.ahmed@example.com",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      phone: "+213 555 123456",
      preferredPayment: "Credit Card",
      notifications: true,
      favorites: ["Tichy", "Gouraya"],
      points: 450
    });
    
    toast({
      description: "Signed in successfully",
      duration: 2000,
    });
  };

  const handleSignUp = () => {
    setShowAuth(false);
    localStorage.setItem("authSeen", "true");
    
    toast({
      description: "Account created successfully",
      duration: 2000,
    });
    
    setUserProfile({
      ...userProfile,
      name: "New User",
      notifications: true,
      points: 100
    });
  };

  const handleSignOut = () => {
    setUserProfile({
      name: "Guest User",
      email: "guest@example.com",
      notifications: true,
      favorites: [],
      points: 250
    });
    
    toast({
      description: "Signed out successfully",
      duration: 2000,
    });
  };

  const handleDestinationSelect = (destination: string) => {
    setFrom("Béjaïa Center");
    setTo(destination);
    setShowBookingDialog(true);
    
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
    
    generateStops(from || "Béjaïa Center", destination);
    
    setDate(undefined);
    setSelectedTime(undefined);
    setAvailableTimes([]);
    setShowReservationDetails(false);
    setAppliedPromo(null);
    setPromoCode("");
    setMultiCityTrip(false);
    setIntermediateStops([]);
    
    toast({
      description: `Selected route: Béjaïa Center to ${destination}`,
      duration: 2000,
    });
  };

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

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
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

  const handleShareTicket = async (ticket: Ticket) => {
    try {
      const shareUrl = `https://marky-ticket.app/tickets/${ticket.id}`;
      setShareTicketUrl(shareUrl);
      
      await copy(shareUrl);
      
      toast({
        title: "Link Copied!",
        description: "Ticket link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share ticket",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = (location: string) => {
    const newFavorites = userProfile.favorites.includes(location)
      ? userProfile.favorites.filter(fav => fav !== location)
      : [...userProfile.favorites, location];
    
    setUserProfile({
      ...userProfile,
      favorites: newFavorites
    });
    
    toast({
      description: userProfile.favorites.includes(location)
        ? `Removed ${location} from favorites`
        : `Added ${location} to favorites`,
      duration: 2000,
    });
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

    const newTicketId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setTicketId(newTicketId);

    const ticketData = {
      id: newTicketId,
      from,
      to,
      date: format(date, 'yyyy-MM-dd'),
      time: selectedTime,
      price: discountedPrice,
      issued: new Date().toISOString(),
      intermediateStops: intermediateStops.length > 0 ? intermediateStops : undefined
    };

    try {
      const qrCode = await QRCodeGenerator.toDataURL(JSON.stringify(ticketData));
      setQrCodeData(qrCode);
      setShowReservationDetails(true);
      setShowBookingDialog(false);

      const newTicket: Ticket = {
        id: newTicketId,
        from,
        to,
        date: format(date, 'yyyy-MM-dd'),
        time: selectedTime,
        price: discountedPrice,
        status: "unused",
        qrCode: qrCode,
        issued: new Date().toISOString(),
        stops: intermediateStops.length > 0 ? intermediateStops : undefined
      };
      
      setRecentTickets([newTicket, ...recentTickets]);
      
      setUserProfile({
        ...userProfile,
        points: userProfile.points + Math.floor(discountedPrice / 10)
      });
      
      setUserCredit(prev => prev - discountedPrice);

      toast({
        title: "Success!",
        description: "Your ticket has been reserved",
      });
      
      const newNotification = {
        id: Date.now().toString(),
        title: "Trip Booked Successfully!",
        message: `Your trip to ${to} on ${format(date, 'PPP')} at ${selectedTime} is confirmed.`,
        isRead: false,
        date: "Just now"
      };
      
      setNotifications([newNotification, ...notifications]);
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
    setShowBookingDialog(false);
    setShowReservationDetails(false);
    setAppliedPromo(null);
    setPromoCode("");
    setMultiCityTrip(false);
    setIntermediateStops([]);
  };

  const submitReview = () => {
    if (!reviewDestination) return;
    
    if (currentRating === 0) {
      toast({
        title: "Error",
        description: "Please provide a rating",
        variant: "destructive",
      });
      return;
    }
    
    const newReview: Review = {
      id: Date.now().toString(),
      author: userProfile.name,
      authorAvatar: userProfile.avatar,
      comment: reviewText,
      rating: currentRating,
      date: "Just now"
    };
    
    const updatedDestinations = featuredDestinations.map(dest => 
      dest.id === reviewDestination.id 
        ? { ...dest, reviews: [newReview, ...dest.reviews] }
        : dest
    );
    
    setFeaturedDestinations(updatedDestinations);
    setShowRatingModal(false);
    setCurrentRating(0);
    setReviewText("");
    
    toast({
      title: "Thank you!",
      description: "Your review has been submitted",
    });
    
    setUserProfile({
      ...userProfile,
      points: userProfile.points + 25
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      description: "All notifications cleared",
      duration: 2000,
    });
  };

  const viewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetailsDialog(true);
  };

  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([
    {
      id: "1",
      title: "Tichy Beach",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      price: "150 DA",
      priceValue: 150,
      rating: 4.9,
      location: "Tichy",
      distance: "15 km",
      travelTime: "25 min",
      description: "Tichy Beach is one of the most beautiful beaches on the Mediterranean coast of Algeria. Known for its clear blue waters and fine sand.",
      reviews: [
        {
          id: "r1",
          author: "Ahmed L.",
          comment: "Beautiful Mediterranean beach",
          rating: 5,
          date: "3 days ago"
        },
        {
          id: "r2",
          author: "Lina K.",
          comment: "Perfect for summer vacation",
          rating: 5,
          date: "5 days ago"
        }
      ]
    },
    {
      id: "2",
      title: "Gouraya National Park",
      image: "https://images.unsplash.com/photo-1565019011521-b0456c7a1405",
      price: "200 DA",
      priceValue: 200,
      rating: 4.7,
      location: "Gouraya",
      distance: "12 km",
      travelTime: "20 min",
      description: "Gouraya National Park offers breathtaking views of the Mediterranean Sea and the city of Béjaïa. It's perfect for hiking and nature lovers.",
      reviews: [
        {
          id: "r3",
          author: "Yacine R.",
          comment: "Amazing hiking trails and views",
          rating: 4.8,
          date: "1 day ago"
        },
        {
          id: "r4",
          author: "Amira H.",
          comment: "Must-visit natural attraction",
          rating: 4.6,
          date: "4 days ago"
        }
      ]
    },
    {
      id: "3",
      title: "Aokas Beach",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206",
      price: "180 DA",
      priceValue: 180,
      rating: 4.5,
      location: "Aokas",
      distance: "20 km",
      travelTime: "35 min",
      description: "Aokas is a peaceful coastal town known for its beautiful beaches, crystal clear waters, and relaxed atmosphere.",
      reviews: [
        {
          id: "r5",
          author: "Karim B.",
          comment: "Less crowded than Tichy, very peaceful",
          rating: 4.5,
          date: "1 week ago"
        },
        {
          id: "r6",
          author: "Nadia M.",
          comment: "Beautiful scenery and clean beaches",
          rating: 4.7,
          date: "3 days ago"
        }
      ]
    },
    {
      id: "4",
      title: "Souk El Tennine",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6",
      price: "250 DA",
      priceValue: 250,
      rating: 4.3,
      location: "Souk El Tennine",
      distance: "35 km",
      travelTime: "50 min",
      description: "Famous for its traditional market and local products. A great place to experience authentic Algerian culture.",
      reviews: [
        {
          id: "r7",
          author: "Farid L.",
          comment: "Great place to buy local products",
          rating: 4.4,
          date: "2 weeks ago"
        },
        {
          id: "r8",
          author: "Salima R.",
          comment: "Authentic experience but crowded on market days",
          rating: 4.0,
          date: "1 week ago"
        }
      ]
    },
    {
      id: "5",
      title: "Akbou",
      image: "https://images.unsplash.com/photo-1591378603223-e15560f3d756",
      price: "300 DA",
      priceValue: 300,
      rating: 4.4,
      location: "Akbou",
      distance: "60 km",
      travelTime: "1h 15min",
      description: "An important economic center in the region with beautiful surroundings and mountain views.",
      reviews: [
        {
          id: "r9",
          author: "Omar T.",
          comment: "Nice city with good restaurants",
          rating: 4.5,
          date: "5 days ago"
        },
        {
          id: "r10",
          author: "Fatiha B.",
          comment: "Good shopping opportunities",
          rating: 4.3,
          date: "1 week ago"
        }
      ]
    }
  ]);

  if (showTutorial) {
    return <Tutorial onComplete={handleTutorialComplete} />;
  }

  if (showAuth) {
    return (
      <AuthScreen 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        onSkip={handleSkip} 
      />
    );
  }

  const routeMapProps = {
    from: from || "",
    to: to || "",
    intermediateStops: intermediateStops
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 animate-fade-in">
        <header className="mb-4 sm:mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              MARKY TICKETS
            </h1>
            <UserProfileSheet 
              profile={userProfile}
              open={profileOpen}
              setOpen={setProfileOpen}
              onProfileUpdate={setUserProfile}
              onSignOut={handleSignOut}
            />
          </div>
        </header>
        
        <Tabs defaultValue="explore" className="w-full">
          <TabsList>
            <TabsTrigger value="explore" onClick={() => setActiveTab("explore")}>Explore</TabsTrigger>
            <TabsTrigger value="my-tickets" onClick={() => setActiveTab("my-tickets")}>My Tickets</TabsTrigger>
            <TabsTrigger value="promotions" onClick={() => setActiveTab("promotions")}>Promotions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-secondary">
                Featured Destinations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    isFavorite={userProfile.favorites.includes(destination.location)}
                    onSelect={handleDestinationSelect}
                    onToggleFavorite={toggleFavorite}
                    onReviewClick={(dest) => {
                      setReviewDestination(dest);
                      setShowRatingModal(true);
                    }}
                  />
                ))}
              </div>
            </section>
            
            {showReservationDetails && (
              <section>
                <h2 className="text-xl font-semibold mb-3 text-secondary">
                  Reservation Complete
                </h2>
                <div className="max-w-md mx-auto">
                  <TicketDetails
                    ticket={{
                      id: ticketId,
                      from: from || "",
                      to: to || "",
                      date: date ? format(date, 'yyyy-MM-dd') : "",
                      time: selectedTime || "",
                      price: discountedPrice,
                      status: "unused",
                      qrCode: qrCodeData,
                      issued: new Date().toISOString(),
                      stops: intermediateStops.length > 0 ? intermediateStops : undefined
                    }}
                    onShare={handleShareTicket}
                  />
                  <div className="mt-4 flex justify-center">
                    <Button onClick={resetReservation}>
                      Book Another Trip
                    </Button>
                  </div>
                </div>
              </section>
            )}
          </TabsContent>
          
          <TabsContent value="my-tickets">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-secondary">
                My Recent Tickets
              </h2>
              {recentTickets.length > 0 ? (
                <div className="space-y-4">
                  {recentTickets.map((ticket) => (
                    <Card key={ticket.id} className="overflow-hidden">
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{ticket.from} → {ticket.to}</h3>
                          <p className="text-sm text-gray-600">
                            {ticket.date} at {ticket.time}
                          </p>
                        </div>
                        <Button variant="outline" onClick={() => viewTicket(ticket)}>
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">You don't have any tickets yet</p>
                  <Button className="mt-4" onClick={() => setActiveTab("explore")}>
                    Book a trip
                  </Button>
                </div>
              )}
            </section>
          </TabsContent>
          
          <TabsContent value="promotions">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-secondary">
                Available Promotions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotions.map((promotion) => (
                  <PromotionCard
                    key={promotion.id}
                    promotion={promotion}
                    onApplyCode={(code) => {
                      setPromoCode(code);
                      setActiveTab("explore");
                      toast({
                        description: "Promo code added. Apply it during booking.",
                        duration: 3000,
                      });
                    }}
                  />
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
      
      <ReviewDialog 
        destination={reviewDestination}
        open={showRatingModal}
        setOpen={setShowRatingModal}
        onSubmitReview={submitReview}
        reviewText={reviewText}
        setReviewText={setReviewText}
        currentRating={currentRating}
        setCurrentRating={setCurrentRating}
      />
      
      <Dialog open={showTicketDetailsDialog} onOpenChange={setShowTicketDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle>Ticket Details</DialogTitle>
          {selectedTicket && (
            <TicketDetails
              ticket={selectedTicket}
              onShare={handleShareTicket}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        {from && to && (
          <BookingDialog
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
            tripStops={tripStops}
            routeMapProps={routeMapProps}
            promotions={promotions}
            onFromChange={setFrom}
            onToChange={setTo}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onPromoCodeChange={setPromoCode}
            onApplyPromoCode={applyPromoCode}
            onRemovePromoCode={removePromoCode}
            onMultiCityToggle={setMultiCityTrip}
            onAddIntermediateStop={handleAddIntermediateStop}
            onRemoveIntermediateStop={handleRemoveIntermediateStop}
            onReservation={handleReservation}
            onCancel={resetReservation}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Index;
