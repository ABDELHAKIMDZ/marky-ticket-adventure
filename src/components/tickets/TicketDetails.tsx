import { Button } from "@/components/ui/button";
import { Share, QrCode, Printer, Mail, Calendar, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Ticket } from "@/types/app";
import { Badge } from "@/components/ui/badge";
import { RouteMap, RouteMapProps } from "@/components/RouteMap";
import { useToast } from "@/components/ui/use-toast";

interface TicketDetailsProps {
  ticket: Ticket;
  onShare: (ticket: Ticket) => void;
  onCancel?: (ticket: Ticket) => void;
}

export const TicketDetails = ({ ticket, onShare, onCancel }: TicketDetailsProps) => {
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unused":
        return "bg-green-100 text-green-700 border-green-200";
      case "used":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "expired":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "";
    }
  };

  const routeMapProps: RouteMapProps = {
    from: ticket.from,
    to: ticket.to,
    intermediateStops: ticket.stops
  };

  const handlePrint = () => {
    window.print();
    toast({
      description: "Printing ticket...",
    });
  };

  const handleEmailShare = () => {
    const subject = `Bus Ticket - ${ticket.from} to ${ticket.to}`;
    const body = `Your ticket details:%0D%0A
      From: ${ticket.from}%0D%0A
      To: ${ticket.to}%0D%0A
      Date: ${ticket.date}%0D%0A
      Time: ${ticket.time}%0D%0A
      Ticket ID: ${ticket.id}`;
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    
    toast({
      description: "Opening email client...",
    });
  };

  const addToCalendar = () => {
    const event = {
      title: `Bus Trip: ${ticket.from} to ${ticket.to}`,
      description: `Ticket ID: ${ticket.id}`,
      location: ticket.from,
      startTime: `${ticket.date}T${ticket.time}`,
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${encodeURIComponent(event.startTime)}`;
    
    window.open(googleCalendarUrl, '_blank');
    
    toast({
      description: "Adding to calendar...",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Ticket #{ticket.id}</CardTitle>
          <Badge className={getStatusColor(ticket.status)}>
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm opacity-80">Issued: {new Date(ticket.issued).toLocaleString()}</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-sm text-gray-500">From</h4>
            <p className="font-semibold">{ticket.from}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">To</h4>
            <p className="font-semibold">{ticket.to}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Date</h4>
            <p className="font-semibold">{ticket.date}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Time</h4>
            <p className="font-semibold">{ticket.time}</p>
          </div>
        </div>
        
        {ticket.stops && ticket.stops.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm text-gray-500 mb-2">Stops</h4>
            <div className="flex flex-wrap gap-2">
              {ticket.stops.map((stop, index) => (
                <Badge key={index} variant="outline">
                  {stop}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h4 className="text-sm text-gray-500 mb-2">Price</h4>
          <p className="text-xl font-bold">{ticket.price} DA</p>
        </div>
        
        {ticket.qrCode && (
          <div className="flex justify-center">
            <img 
              src={ticket.qrCode} 
              alt="Ticket QR Code" 
              className="h-48 w-48 object-contain"
            />
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Route Map</h4>
          <div className="h-48 border rounded">
            <RouteMap {...routeMapProps} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleEmailShare}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" onClick={addToCalendar}>
            <Calendar className="mr-2 h-4 w-4" />
            Reminder
          </Button>
        </div>
        <div className="flex gap-2">
          {onCancel && ticket.status === "unused" && (
            <Button variant="destructive" onClick={() => onCancel(ticket)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
          <Button onClick={() => onShare(ticket)}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
