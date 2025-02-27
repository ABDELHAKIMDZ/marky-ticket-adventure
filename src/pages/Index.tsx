
import { useState, useEffect } from "react";
import { Tutorial } from "@/components/Tutorial";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Star, 
  MessageCircle, 
  LogIn, 
  UserPlus, 
  ArrowRight, 
  Ticket, 
  QrCode, 
  Share2, 
  UserCircle, 
  History, 
  Bell, 
  Heart, 
  Tag, 
  Route, 
  AlertCircle,
  Plus,
  Minus,
  X,
  Check,
  Share,
  LogOut
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PaymentForm } from "@/components/PaymentForm";
import { RouteMap } from "@/components/RouteMap";
import QRCodeGenerator from 'qrcode';
import copy from 'clipboard-copy';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Destination {
  id: string;
  title: string;
  image: string;
  price: string;
  priceValue: number;
  rating: number;
  location: string;
  reviews: Review[];
  description?: string;
  distance?: string;
  travelTime?: string;
}

interface Review {
  id?: string;
  author: string;
  comment: string;
  rating: number;
  date: string;
  authorAvatar?: string;
}

interface Ticket {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  status: "unused" | "used" | "expired";
  qrCode?: string;
  issued: string;
  stops?: string[];
  delay?: string;
}

interface Profile {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  preferredPayment?: string;
  notifications: boolean;
  favorites: string[];
  points: number;
}

interface Promotion {
  id: string;
  code: string;
  discount: number;
  description: string;
  expiryDate: string;
  minimumPurchase?: number;
}

const Index = () => {
  const { toast } = useToast();
  const [showTutorial, setShowTutorial] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [userCredit, setUserCredit] = useState(1000); // Example: 1000 DA initial credit
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>();
  const [showRouteMap, setShowRouteMap] = useState(false);
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
  
  // User profile state
  const [userProfile, setUserProfile] = useState<Profile>({
    name: "Guest User",
    email: "guest@example.com",
    notifications: true,
    favorites: [],
    points: 250
  });

  // Initialize notifications
  const [notifications, setNotifications] = useState<{id: string, title: string, message: string, isRead: boolean, date: string}[]>([
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

  // Available promotions
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

  // Handle tutorial completion - now shows auth page
  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setShowAuth(true);
  };

  const handleSkip = () => {
    setShowAuth(false);
    toast({
      description: "You can sign up later from the settings menu",
      duration: 3000,
    });
  };

  const handleSignIn = () => {
    setShowAuth(false);
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
    
    toast({
      description: "Account created successfully",
      duration: 2000,
    });
    
    // Set a basic user profile for demo
    setUserProfile({
      ...userProfile,
      name: "New User",
      notifications: true,
      points: 100
    });
  };

  const handleSignOut = () => {
    setShowAuth(true);
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
    setShowRouteMap(true);
    
    // Generate price based on destination (example)
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
    
    // Generate some stops for this route
    generateStops(from || "Béjaïa Center", destination);
    
    // Reset other fields
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
    // Example stops for different routes
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
    
    // Check if promo has expired
    if (new Date(promo.expiryDate) < new Date()) {
      toast({
        title: "Expired Code",
        description: "This promo code has expired",
        variant: "destructive",
      });
      return;
    }
    
    // Check minimum purchase requirement if exists
    if (promo.minimumPurchase && ticketPrice < promo.minimumPurchase) {
      toast({
        title: "Minimum Purchase Required",
        description: `This code requires a minimum purchase of ${promo.minimumPurchase} DA`,
        variant: "destructive",
      });
      return;
    }
    
    // Apply discount
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
    // Increase price for multi-city
    setTicketPrice(prevPrice => {
      const newPrice = prevPrice + 50; // Add 50 DA for each additional stop
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
    // Decrease price
    setTicketPrice(prevPrice => {
      const newPrice = prevPrice - 50; // Remove 50 DA for each removed stop
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
      // In a real app, this would generate a shareable link
      const shareUrl = `https://marky-ticket.app/tickets/${ticket.id}`;
      setShareTicketUrl(shareUrl);
      
      // Copy to clipboard
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
      price: discountedPrice,
      issued: new Date().toISOString(),
      intermediateStops: intermediateStops.length > 0 ? intermediateStops : undefined
    };

    try {
      // Generate QR code
      const qrCode = await QRCodeGenerator.toDataURL(JSON.stringify(ticketData));
      setQrCodeData(qrCode);
      setShowReservationDetails(true);

      // Add this ticket to history
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
      
      // Add points for the purchase
      setUserProfile({
        ...userProfile,
        points: userProfile.points + Math.floor(discountedPrice / 10) // 1 point for every 10 DA
      });
      
      // Deduct from credit
      setUserCredit(prev => prev - discountedPrice);

      toast({
        title: "Success!",
        description: "Your ticket has been reserved",
      });
      
      // Add a notification for the upcoming trip
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
    setShowRouteMap(false);
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
    
    // Create new review
    const newReview: Review = {
      id: Date.now().toString(),
      author: userProfile.name,
      authorAvatar: userProfile.avatar,
      comment: reviewText,
      rating: currentRating,
      date: "Just now"
    };
    
    // Add to destination reviews
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
    
    // Add some bonus points for the review
    setUserProfile({
      ...userProfile,
      points: userProfile.points + 25 // 25 points for a review
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

  // First show the tutorial/welcome page
  if (showTutorial) {
    return <Tutorial onComplete={handleTutorialComplete} />;
  }

  // Then show the auth page after completing the tutorial
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

  // Finally show the main app after authentication
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6 animate-fade-in">
        <header className="mb-4 sm:mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              Marky Ticket
            </h1>
            <div className="flex items-center gap-2">
              <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={userProfile.avatar} />
                      <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>User Profile</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={userProfile.avatar} />
                        <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{userProfile.name}</h3>
                        <p className="text-gray-500 text-sm">{userProfile.email}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Reward Points</h4>
                        <Badge variant="outline" className="font-semibold">{userProfile.points} points</Badge>
                      </div>
                      <p className="text-sm text-gray-500">Earn points for each booking and review</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Account Settings</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="user-name">Full Name</Label>
                        <Input 
                          id="user-name" 
                          value={userProfile.name} 
                          onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="user-email">Email</Label>
                        <Input 
                          id="user-email" 
                          type="email" 
                          value={userProfile.email} 
                          onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="user-phone">Phone (Optional)</Label>
                        <Input 
                          id="user-phone" 
                          value={userProfile.phone || ""} 
                          onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="notifications">Notifications</Label>
                          <p className="text-sm text-gray-500">Receive trip alerts and offers</p>
                        </div>
                        <Switch 
                          id="notifications" 
                          checked={userProfile.notifications} 
                          onCheckedChange={(checked) => 
                            setUserProfile({...userProfile, notifications: checked})
                          } 
                        />
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Favorite Destinations</h4>
                      {userProfile.favorites.length === 0 ? (
                        <p className="text-sm text-gray-500">No favorite destinations yet</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {userProfile.favorites.map(fav => (
                            <Badge key={fav} variant="secondary" className="flex items-center gap-1">
                              {fav}
                              <button 
                                onClick={() => toggleFavorite(fav)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => {
                          setProfileOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button onClick={() => {
                        setProfileOpen(false);
                        toast({
                          description: "Profile updated successfully",
                        });
                      }}>
                        Save Changes
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Notifications</h3>
                    {notifications.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAllNotifications} 
                        className="h-8 px-2 text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-gray-500 py-6">No notifications</p>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-3 rounded-md text-sm ${notification.isRead ? 'bg-gray-100' : 'bg-primary/10'}`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="font-medium">{notification.title}</div>
                            <p className="text-gray-600">{notification.message}</p>
                            <div className="text-xs text-gray-400 mt-1">{notification.date}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="hidden sm:flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-gray-600 hidden sm:block">Discover the beauty of Béjaïa</p>
            <div className="bg-secondary/10 px-4 py-2 rounded-full">
              <span className="font-semibold text-secondary">
                Credit: {userCredit} DA
              </span>
            </div>
          </div>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 sm:w-[400px] w-full mx-auto">
            <TabsTrigger value="explore">
              <MapPin className="h-4 w-4 mr-2" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="trips">
              <History className="h-4 w-4 mr-2" />
              My Trips
            </TabsTrigger>
            <TabsTrigger value="offers">
              <Tag className="h-4 w-4 mr-2" />
              Offers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore" className="space-y-4">
            {!from && !to && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {featuredDestinations.map((destination) => (
                  <Card 
                    key={destination.id} 
                    className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative h-48">
                      <img
                        src={destination.image}
                        alt={destination.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(destination.location);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              userProfile.favorites.includes(destination.location)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-600"
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReviewDestination(destination);
                            setShowRatingModal(true);
                          }}
                        >
                          <Star className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
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
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Route className="w-4 h-4" />
                          <span>{destination.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{destination.travelTime}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {destination.description}
                      </p>
                      <Button 
                        className="w-full"
                        onClick={() => handleDestinationSelect(destination.location)}
                      >
                        <Ticket className="mr-2 h-4 w-4" />
                        Book Ticket
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {from && to && !showReservationDetails && (
              <div className="space-y-6">
                {showRouteMap && (
                  <RouteMap from={from} to={to} />
                )}
                
                <Card className="p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex justify-between items-center">
                      <span>Book Your Trip</span>
                      {multiCityTrip ? (
                        <Badge variant="outline" className="flex items-center">
                          <Route className="h-4 w-4 mr-1" />
                          Multi-City Trip
                        </Badge>
                      ) : null}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                      <div className="grid gap-4">
                        <div className="flex gap-3 relative">
                          <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center relative z-10 mt-1">
                            <MapPin className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-500">From</div>
                            <div className="font-medium">{from}</div>
                          </div>
                        </div>
                        
                        {intermediateStops.map((stop, index) => (
                          <div key={index} className="flex gap-3 relative">
                            <div className="h-6 w-6 rounded-full bg-secondary text-white flex items-center justify-center relative z-10 mt-1">
                              <MapPin className="h-3 w-3" />
                            </div>
                            <div className="flex-1 flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-500">Stop {index + 1}</div>
                                <div className="font-medium">{stop}</div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => handleRemoveIntermediateStop(stop)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex gap-3 relative">
                          <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center relative z-10 mt-1">
                            <MapPin className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-500">To</div>
                            <div className="font-medium">{to}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Switch 
                          id="multi-city" 
                          checked={multiCityTrip}
                          onCheckedChange={(checked) => setMultiCityTrip(checked)}
                        />
                        <Label htmlFor="multi-city" className="cursor-pointer">Multi-city trip</Label>
                      </div>
                      
                      {multiCityTrip && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Stop
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60">
                            <div className="space-y-3">
                              <p className="text-sm font-medium">Add intermediate stop</p>
                              <div className="grid grid-cols-1 gap-2">
                                {["Béjaïa University", "Ihaddaden", "Béjaïa Port", "Soummam Valley", "Béjaïa Market", "Yemma Gouraya Turn", "El Kseur", "Tazmalt"].map((stop) => (
                                  <Button 
                                    key={stop} 
                                    variant="ghost" 
                                    className="justify-start h-auto py-1.5 px-2"
                                    onClick={() => {
                                      handleAddIntermediateStop(stop);
                                      document.body.click(); // Close the popover
                                    }}
                                  >
                                    <MapPin className="h-3 w-3 mr-2" />
                                    {stop}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              disabled={(date) => 
                                date < new Date(new Date().setHours(0, 0, 0, 0)) // Compare dates at start of day
                              }
                              initialFocus
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
                    
                    <div className="border-t pt-4">
                      <div className="flex items-end gap-2 mb-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">Promo Code</label>
                          <div className="flex gap-2">
                            <Input 
                              value={promoCode} 
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="Enter code"
                              disabled={!!appliedPromo}
                            />
                            {!appliedPromo ? (
                              <Button 
                                variant="outline" 
                                onClick={applyPromoCode}
                                disabled={!promoCode.trim()}
                              >
                                Apply
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                onClick={removePromoCode}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {appliedPromo && (
                        <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center text-green-700 font-medium">
                              <Check className="h-4 w-4 mr-1" />
                              {appliedPromo.code} applied!
                            </div>
                            <p className="text-sm text-green-600">{appliedPromo.description}</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100">-{appliedPromo.discount}%</Badge>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Base fare</span>
                          <span>{ticketPrice} DA</span>
                        </div>
                        
                        {appliedPromo && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Discount ({appliedPromo.discount}%)</span>
                            <span className="text-green-600">-{(ticketPrice * appliedPromo.discount / 100).toFixed(2)} DA</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-2 border-t font-medium">
                          <span>Total</span>
                          <span className="text-primary text-lg">{discountedPrice} DA</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-between items-center">
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
                      
                      <div className="bg-gray-50 rounded-lg p-4 relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                        <div className="grid gap-4">
                          <div className="flex gap-3 relative">
                            <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center relative z-10 mt-1">
                              <MapPin className="h-3 w-3" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-500">From</div>
                              <div className="font-medium">{from}</div>
                            </div>
                          </div>
                          
                          {intermediateStops.map((stop, index) => (
                            <div key={index} className="flex gap-3 relative">
                              <div className="h-6 w-6 rounded-full bg-secondary text-white flex items-center justify-center relative z-10 mt-1">
                                <MapPin className="h-3 w-3" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-500">Via</div>
                                <div className="font-medium">{stop}</div>
                              </div>
                            </div>
                          ))}
                          
                          <div className="flex gap-3 relative">
                            <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center relative z-10 mt-1">
                              <MapPin className="h-3 w-3" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-500">To</div>
                              <div className="font-medium">{to}</div>
                            </div>
                          </div>
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
                        <p className="font-medium text-lg text-primary">{discountedPrice} DA</p>
                      </div>
                      
                      <div className="pt-4 space-x-2">
                        <Button 
                          onClick={resetReservation} 
                          variant="outline"
                        >
                          Book Another Ticket
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => handleShareTicket({
                            id: ticketId,
                            from: from || "",
                            to: to || "",
                            date: date ? format(date, 'yyyy-MM-dd') : "",
                            time: selectedTime || "",
                            price: discountedPrice,
                            status: "unused",
                            issued: new Date().toISOString(),
                          })}
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share Ticket
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
          </TabsContent>
          
          <TabsContent value="trips" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {recentTickets.length === 0 ? (
                <Card className="p-8">
                  <div className="text-center space-y-3">
                    <History className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <h3 className="font-medium text-xl">No trips yet</h3>
                      <p className="text-gray-500">Your booked trips will appear here</p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab("explore")}
                      className="mt-2"
                    >
                      Book Your First Trip
                    </Button>
                  </div>
                </Card>
              ) : (
                recentTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">Ticket #{ticket.id}</Badge>
                        <CardTitle className="text-lg">
                          {ticket.from} → {ticket.to}
                        </CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleShareTicket(ticket)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setReviewDestination(featuredDestinations.find(d => d.location === ticket.to) || null);
                            setShowRatingModal(true);
                          }}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="text-sm font-medium">{ticket.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="text-sm font-medium">{ticket.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <Badge 
                            variant={ticket.status === "unused" ? "default" : 
                              ticket.status === "used" ? "secondary" : "destructive"}
                            className="mt-0.5"
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="text-sm font-medium">{ticket.price} DA</p>
                        </div>
                      </div>
                      
                      {ticket.stops && ticket.stops.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Via</p>
                          <div className="flex flex-wrap gap-1">
                            {ticket.stops.map((stop, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {stop}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Booked on {new Date(ticket.issued).toLocaleDateString()}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8"
                          onClick={() => viewTicket(ticket)}
                        >
                          <QrCode className="h-3 w-3 mr-1" />
                          View Ticket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="offers" className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Current Promotions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map((promo) => (
                <Card key={promo.id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-purple-600 p-4 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="secondary" className="mb-2 bg-white/20 hover:bg-white/25">
                          {promo.discount}% OFF
                        </Badge>
                        <h3 className="text-xl font-bold">{promo.description}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-80">Code:</div>
                        <div className="font-mono font-bold">{promo.code}</div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        {promo.minimumPurchase ? (
                          <span>Min. purchase: {promo.minimumPurchase} DA</span>
                        ) : (
                          <span>No minimum purchase</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Valid until {new Date(promo.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setPromoCode(promo.code);
                          setActiveTab("explore");
                          
                          // If no destination is selected, show toast to select one
                          if (!from || !to) {
                            toast({
                              description: "Select a destination first to apply this promo",
                              duration: 3000,
                            });
                          }
                        }}
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Use This Promo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Earn Reward Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Book tickets</h4>
                      <p className="text-sm text-gray-600">Earn 1 point for every 10 DA spent</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Write reviews</h4>
                      <p className="text-sm text-gray-600">Earn 25 points for each review</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Share className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Share tickets</h4>
                      <p className="text-sm text-gray-600">Earn 20 points when friends use your link</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Your current points</span>
                      <Badge variant="secondary">{userProfile.points} points</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Redeem 500 points for a free trip to any destination
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate your experience</DialogTitle>
            <DialogDescription>
              {reviewDestination ? `Share your experience about ${reviewDestination.title}` : "Share your experience"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className="p-1"
                  onClick={() => setCurrentRating(rating)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating <= currentRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div>
              <Label htmlFor="review">Your review</Label>
              <Textarea
                id="review"
                placeholder="Write your thoughts here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRatingModal(false)}>
              Cancel
            </Button>
            <Button onClick={submitReview}>
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDetailsDialog} onOpenChange={setShowTicketDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogDescription>
              View your ticket information and QR code
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg flex justify-between">
                <div>
                  <h3 className="font-medium text-primary">Ticket #{selectedTicket.id}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedTicket.issued).toLocaleString()}
                  </p>
                </div>
                <Badge variant={selectedTicket.status === "unused" ? "default" : 
                    selectedTicket.status === "used" ? "secondary" : "destructive"}>
                  {selectedTicket.status}
                </Badge>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-center mb-2">
                {selectedTicket.qrCode ? (
                  <img src={selectedTicket.qrCode} alt="Ticket QR Code" className="w-48 h-48" />
                ) : (
                  <div className="w-48 h-48 border-dashed border-2 flex items-center justify-center text-gray-400">
                    <QrCode className="h-10 w-10" />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">From</p>
                  <p className="font-medium">{selectedTicket.from}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">To</p>
                  <p className="font-medium">{selectedTicket.to}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{selectedTicket.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{selectedTicket.time}</p>
                </div>
              </div>
              
              {selectedTicket.stops && selectedTicket.stops.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Via</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTicket.stops.map((stop, idx) => (
                      <Badge key={idx} variant="outline">
                        {stop}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Price</span>
                  <span className="font-bold text-primary">{selectedTicket.price} DA</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowTicketDetailsDialog(false)}
            >
              Close
            </Button>
            {selectedTicket && (
              <Button onClick={() => handleShareTicket(selectedTicket)}>
                <Share className="h-4 w-4 mr-2" />
                Share Ticket
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Index;
