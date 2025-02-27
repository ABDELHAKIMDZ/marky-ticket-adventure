
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { History, MapPin, Calendar, Clock, ArrowLeft, QrCode, Share } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface HistoricalTicket {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  status: "used" | "expired" | "refunded";
  qrCode?: string;
}

const TicketHistory = () => {
  const [pastTickets] = useState<HistoricalTicket[]>([
    {
      id: "TK9872",
      from: "Béjaïa Center",
      to: "Tichy Beach",
      date: "2023-08-15",
      time: "14:30",
      price: 150,
      status: "used",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TK9872"
    },
    {
      id: "TK7651",
      from: "Béjaïa Center",
      to: "Gouraya",
      date: "2023-07-22",
      time: "09:00",
      price: 200,
      status: "used",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TK7651"
    },
    {
      id: "TK4532",
      from: "Béjaïa Center",
      to: "Aokas",
      date: "2023-06-05",
      time: "11:15",
      price: 180,
      status: "refunded",
    },
    {
      id: "TK3214",
      from: "Béjaïa Center",
      to: "Akbou",
      date: "2023-05-17",
      time: "08:30",
      price: 300,
      status: "expired",
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState<HistoricalTicket | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "used":
        return "secondary";
      case "expired":
        return "destructive";
      case "refunded":
        return "outline";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <main className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/tickets">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-secondary dark:text-gray-100 flex items-center gap-2">
              <History className="text-primary" />
              Ticket History
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Your past travels and trips</p>
        </header>

        <div className="space-y-4">
          {pastTickets.length === 0 ? (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2 dark:text-gray-100">No past tickets</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your travel history will appear here
                </p>
                <Button asChild>
                  <Link to="/">Book Your First Trip</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            pastTickets.map((ticket) => (
              <Card 
                key={ticket.id} 
                className="animate-fade-in hover:shadow-md transition-all dark:bg-gray-800 dark:border-gray-700"
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <Badge className="mb-2" variant={getStatusBadgeVariant(ticket.status)}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                    <CardTitle className="text-lg dark:text-gray-100">
                      Ticket #{ticket.id}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <div className="text-sm font-medium dark:text-gray-300">Route</div>
                        <div className="font-medium dark:text-gray-100">
                          {ticket.from} → {ticket.to}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm font-medium dark:text-gray-300">Date</div>
                          <div className="dark:text-gray-100">{formatDate(ticket.date)}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm font-medium dark:text-gray-300">Time</div>
                          <div className="dark:text-gray-100">{ticket.time}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                      {ticket.price} DA
                    </div>
                    
                    {ticket.qrCode && (
                      <Dialog open={showQRDialog && selectedTicket?.id === ticket.id} onOpenChange={(open) => {
                        setShowQRDialog(open);
                        if (!open) setSelectedTicket(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowQRDialog(true);
                            }}
                          >
                            <QrCode className="h-3 w-3 mr-1" />
                            View QR
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs">
                          <DialogHeader>
                            <DialogTitle>Ticket QR Code</DialogTitle>
                          </DialogHeader>
                          {selectedTicket?.qrCode && (
                            <div className="p-4 flex flex-col items-center">
                              <div className="bg-white p-4 rounded-lg mb-4">
                                <img 
                                  src={selectedTicket.qrCode} 
                                  alt="Ticket QR Code" 
                                  className="w-48 h-48"
                                />
                              </div>
                              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                This is a record of your past ticket
                              </div>
                              <Button className="mt-4 w-full" variant="outline">
                                <Share className="h-4 w-4 mr-2" />
                                Share Receipt
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default TicketHistory;
