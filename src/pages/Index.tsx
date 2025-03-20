
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
                        <Label htmlFor="user-email">Email Address</Label>
                        <Input 
                          id="user-email" 
                          value={userProfile.email} 
                          onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="user-phone">Phone Number</Label>
                        <Input 
                          id="user-phone" 
                          value={userProfile.phone || ''} 
                          onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                          placeholder="+213 555 000000"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notifications">Notifications</Label>
                          <p className="text-sm text-gray-500">Receive trip alerts and promotions</p>
                        </div>
                        <Switch 
                          id="notifications" 
                          checked={userProfile.notifications} 
                          onCheckedChange={(checked) => setUserProfile({...userProfile, notifications: checked})}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleSignOut} 
                      variant="outline" 
                      className="w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
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
                  <Card key={destination.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48">
                      <img 
                        src={destination.image} 
                        alt={destination.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-white/80 hover:bg-white"
                          onClick={() => toggleFavorite(destination.location)}
                        >
                          <Heart 
                            className={userProfile.favorites.includes(destination.location) ? 
                              "text-red-500 fill-red-500" : "text-gray-600"} 
                            size={18} 
                          />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <h3 className="text-white font-semibold">{destination.title}</h3>
                        <div className="flex items-center text-white/90 text-sm">
                          <MapPin size={14} className="mr-1" />
                          <span>{destination.location}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="flex-grow pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Star className="text-yellow-400 mr-1" size={16} />
                          <span className="text-sm font-medium">{destination.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({destination.reviews.length} reviews)
                          </span>
                        </div>
                        <span className="font-semibold text-primary">{destination.price}</span>
                      </div>
                      
                      <div className="mt-2 flex space-x-2">
                        <Badge variant="outline" className="text-xs flex items-center">
                          <Route size={12} className="mr-1" />
                          {destination.distance}
                        </Badge>
                        <Badge variant="outline" className="text-xs flex items-center">
                          <Clock size={12} className="mr-1" />
                          {destination.travelTime}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {destination.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4 px-4">
                      <div className="w-full grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="text-sm w-full"
                          onClick={() => {
                            setReviewDestination(destination);
                            setShowRatingModal(true);
                          }}
                        >
                          <MessageCircle size={16} className="mr-1" />
                          Review
                        </Button>
                        <Button 
                          className="text-sm w-full"
                          onClick={() => handleDestinationSelect(destination.location)}
                        >
                          <Ticket size={16} className="mr-1" />
                          Book
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
            
            {showRouteMap && (
              <section className="mb-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-3 text-secondary">
                  Trip Details
                </h2>
                <Card className="overflow-hidden">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-semibold">
                      {from} to {to}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <RouteMap from={from || ""} to={to || ""} intermediateStops={intermediateStops} />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-1/2">
                          <Label>Departure Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal mt-1",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
                                initialFocus
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="w-full sm:w-1/2">
                          <Label>Departure Time</Label>
                          <Select
                            disabled={!date || availableTimes.length === 0}
                            value={selectedTime}
                            onValueChange={handleTimeSelect}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="multi-city">Multi-city trip</Label>
                          <Switch 
                            id="multi-city" 
                            checked={multiCityTrip} 
                            onCheckedChange={setMultiCityTrip}
                          />
                        </div>
                        
                        {multiCityTrip && (
                          <div className="border rounded-md p-3 space-y-3 mt-2">
                            <p className="text-sm font-medium">Add intermediate stops:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {["Tichy", "Aokas", "Souk El Tennine", "Akbou", "El Kseur", "Gouraya"]
                                .filter(stop => stop !== to && !intermediateStops.includes(stop))
                                .map(stop => (
                                  <Button 
                                    key={stop} 
                                    variant="outline" 
                                    className="text-xs justify-start"
                                    onClick={() => handleAddIntermediateStop(stop)}
                                  >
                                    <Plus className="mr-1 h-3 w-3" />
                                    {stop}
                                  </Button>
                                ))
                              }
                            </div>
                            
                            {intermediateStops.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Your stops:</p>
                                <div className="flex flex-wrap gap-2">
                                  {intermediateStops.map(stop => (
                                    <Badge 
                                      key={stop} 
                                      variant="secondary"
                                      className="flex items-center gap-1 pr-2"
                                    >
                                      {stop}
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-4 w-4 p-0 hover:bg-transparent"
                                        onClick={() => handleRemoveIntermediateStop(stop)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="border-t pt-4 mt-2">
                        <div className="flex items-end gap-2">
                          <div className="flex-grow space-y-1">
                            <Label htmlFor="promo-code">Promo Code</Label>
                            <Input 
                              id="promo-code"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="Enter promo code"
                              disabled={!!appliedPromo}
                            />
                          </div>
                          {appliedPromo ? (
                            <Button 
                              variant="outline" 
                              className="shrink-0"
                              onClick={removePromoCode}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Remove
                            </Button>
                          ) : (
                            <Button 
                              variant="secondary" 
                              className="shrink-0"
                              onClick={applyPromoCode}
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                        
                        {appliedPromo && (
                          <div className="mt-2 bg-green-50 border border-green-200 p-2 rounded-md flex items-center">
                            <Check className="text-green-500 mr-2 h-4 w-4" />
                            <p className="text-sm text-green-700">
                              {appliedPromo.discount}% discount applied!
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-secondary/5 p-3 rounded-md space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Base fare:</span>
                          <span className="font-medium">{ticketPrice} DA</span>
                        </div>
                        
                        {appliedPromo && (
                          <div className="flex justify-between text-green-600">
                            <span className="text-sm">Discount:</span>
                            <span className="font-medium">-{(ticketPrice - discountedPrice).toFixed(0)} DA</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-primary">{discountedPrice} DA</span>
                        </div>
                      </div>
                      
                      <div className="mt-1 flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={resetReservation}
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={!from || !to || !date || !selectedTime}
                          onClick={handleReservation}
                        >
                          Reserve Ticket
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
            
            {showReservationDetails && (
              <section className="mb-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-3 text-secondary">
                  Ticket Confirmation
                </h2>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold">Your ticket is ready!</h3>
                      <p className="text-sm text-gray-500">
                        Ticket ID: {ticketId}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">From</p>
                          <p className="font-medium">{from}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">To</p>
                          <p className="font-medium">{to}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-medium">{date && format(date, 'PPP')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="font-medium">{selectedTime}</p>
                        </div>
                      </div>
                      
                      {intermediateStops.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Intermediate Stops</p>
                          <div className="flex flex-wrap gap-1">
                            {intermediateStops.map(stop => (
                              <Badge key={stop} variant="outline" className="text-xs">
                                {stop}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-bold text-primary">{discountedPrice} DA</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-2 border rounded-md">
                        <img src={qrCodeData} alt="Ticket QR Code" className="w-40 h-40" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={resetReservation}>
                        <X className="mr-1 h-4 w-4" />
                        Close
                      </Button>
                      <Button 
                        onClick={() => {
                          const ticket = recentTickets[0]; // Most recent ticket
                          if (ticket) {
                            handleShareTicket(ticket);
                          }
                        }}
                      >
                        <Share className="mr-1 h-4 w-4" />
                        Share Ticket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </TabsContent>
          
          <TabsContent value="my-tickets">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-secondary">
                Your Tickets
              </h2>
              {recentTickets.length > 0 ? (
                <div className="space-y-4">
                  {recentTickets.map(ticket => (
                    <Card key={ticket.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-grow">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold">
                                {ticket.from} to {ticket.to}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {ticket.date} at {ticket.time}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline">
                                {ticket.status === "unused" ? "Active" : ticket.status}
                              </Badge>
                              <Badge variant="secondary">
                                {ticket.price} DA
                              </Badge>
                            </div>
                            
                            {ticket.stops && ticket.stops.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs text-gray-500 mb-1">Stops:</p>
                                <div className="flex flex-wrap gap-1">
                                  {ticket.stops.map(stop => (
                                    <Badge key={stop} variant="outline" className="text-xs">
                                      {stop}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="shrink-0 flex flex-row md:flex-col gap-2">
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => viewTicket(ticket)}
                            >
                              <QrCode className="mr-1 h-4 w-4" />
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="flex-1"
                              onClick={() => handleShareTicket(ticket)}
                            >
                              <Share2 className="mr-1 h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-6 text-center">
                    <div className="mb-3 flex justify-center">
                      <Ticket className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No tickets yet</h3>
                    <p className="text-gray-500 mb-4">
                      Book your first ticket to see it here.
                    </p>
                    <Button onClick={() => setActiveTab("explore")}>
                      Explore Destinations
                    </Button>
                  </CardContent>
                </Card>
              )}
            </section>
          </TabsContent>
          
          <TabsContent value="promotions">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-secondary">
                Available Promotions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {promotions.map(promo => (
                  <Card key={promo.id} className="border-l-4 border-l-primary bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-xl text-primary">
                            {promo.discount}% OFF
                          </h3>
                          <p className="text-sm font-medium">
                            {promo.description}
                          </p>
                        </div>
                        <Badge variant="outline">
                          Expires {format(new Date(promo.expiryDate), 'dd MMM')}
                        </Badge>
                      </div>
                      
                      {promo.minimumPurchase && (
                        <p className="text-xs text-gray-500 mb-3">
                          Minimum purchase: {promo.minimumPurchase} DA
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <code className="bg-secondary/10 px-2 py-1 rounded text-sm font-bold">
                          {promo.code}
                        </code>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setPromoCode(promo.code);
                          setActiveTab("explore");
                          toast({
                            description: `Promo code ${promo.code} copied to clipboard`,
                            duration: 2000,
                          });
                        }}>
                          <Tag className="mr-1 h-4 w-4" />
                          Use Code
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
      
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate your experience</DialogTitle>
            <DialogDescription>
              {reviewDestination ? `Share your thoughts about ${reviewDestination.title}` : 'Leave a review'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentRating(rating)}
                >
                  <Star 
                    className={rating <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                    size={24} 
                  />
                </Button>
              ))}
            </div>
            
            <Textarea
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRatingModal(false)}>
              Cancel
            </Button>
            <Button onClick={submitReview} disabled={currentRating === 0}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showTicketDetailsDialog} onOpenChange={setShowTicketDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex justify-center">
                {selectedTicket.qrCode ? (
                  <img 
                    src={selectedTicket.qrCode} 
                    alt="Ticket QR Code" 
                    className="w-40 h-40 border rounded-md"
                  />
                ) : (
                  <div className="w-40 h-40 border rounded-md flex items-center justify-center bg-gray-50">
                    <QrCode className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
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
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Ticket ID</p>
                  <p className="font-mono text-sm">{selectedTicket.id}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge 
                    variant={selectedTicket.status === "unused" ? "default" : 
                      selectedTicket.status === "used" ? "secondary" : "outline"}
                  >
                    {selectedTicket.status === "unused" ? "Active" : 
                      selectedTicket.status === "used" ? "Used" : "Expired"}
                  </Badge>
                </div>
                
                {selectedTicket.stops && selectedTicket.stops.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Stops:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTicket.stops.map(stop => (
                        <Badge key={stop} variant="outline" className="text-xs">
                          {stop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Issued</p>
                  <p className="text-sm">
                    {new Date(selectedTicket.issued).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTicketDetailsDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedTicket) {
                handleShareTicket(selectedTicket);
              }
            }}>
              <Share2 className="mr-1 h-4 w-4" />
              Share Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

