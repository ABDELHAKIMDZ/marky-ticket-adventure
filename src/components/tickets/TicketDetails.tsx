
import { Button } from "@/components/ui/button";
import { Share, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Ticket } from "@/types/app";
import { Badge } from "@/components/ui/badge";
import { RouteMap, RouteMapProps } from "@/components/RouteMap";

interface TicketDetailsProps {
  ticket: Ticket;
  onShare: (ticket: Ticket) => void;
}

export const TicketDetails = ({ ticket, onShare }: TicketDetailsProps) => {
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
      <CardFooter className="bg-gray-50 flex justify-between">
        <Button variant="outline" onClick={() => window.print()}>
          <QrCode className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={() => onShare(ticket)}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};
