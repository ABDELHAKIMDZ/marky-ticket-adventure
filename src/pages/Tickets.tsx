
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { TicketCheck, QrCode } from "lucide-react";

interface Ticket {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: "unused" | "used" | "expired";
  lastScanned?: string;
  scanHistory?: {
    timestamp: string;
    location: string;
  }[];
}

const Tickets = () => {
  const [tickets] = useState<Ticket[]>([
    {
      id: "1",
      from: "New York",
      to: "Boston",
      date: "2024-03-01",
      time: "09:00 AM",
      status: "unused",
      scanHistory: []
    },
    {
      id: "2",
      from: "Boston",
      to: "Washington DC",
      date: "2024-02-15",
      time: "02:30 PM",
      status: "used",
      lastScanned: "2024-02-15 14:25",
      scanHistory: [
        {
          timestamp: "2024-02-15 14:25",
          location: "Boston Terminal"
        }
      ]
    },
    {
      id: "3",
      from: "Béjaïa Center",
      to: "Tichy",
      date: "2024-02-10",
      time: "10:00 AM",
      status: "expired",
      lastScanned: "2024-02-10 10:05",
      scanHistory: [
        {
          timestamp: "2024-02-10 09:55",
          location: "Béjaïa Station"
        },
        {
          timestamp: "2024-02-10 10:05",
          location: "Bus Entry"
        }
      ]
    }
  ]);

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "unused":
        return "bg-primary/10 text-primary";
      case "used":
        return "bg-green-100 text-green-600";
      case "expired":
        return "bg-red-100 text-red-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <TicketCheck className="text-primary" />
            My Tickets
          </h1>
        </header>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{ticket.from} → {ticket.to}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Date: {ticket.date}</span>
                      <span>Time: {ticket.time}</span>
                    </div>
                  </div>
                  
                  {ticket.lastScanned && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <QrCode className="h-4 w-4" />
                      Last scanned: {ticket.lastScanned}
                    </div>
                  )}
                  
                  {ticket.scanHistory && ticket.scanHistory.length > 0 && (
                    <div className="border-t pt-2 mt-2">
                      <p className="text-sm font-medium mb-1">Scan History:</p>
                      <div className="space-y-1">
                        {ticket.scanHistory.map((scan, index) => (
                          <div 
                            key={index} 
                            className="text-xs text-gray-600 flex justify-between items-center"
                          >
                            <span>{scan.location}</span>
                            <span className="text-gray-400">{scan.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Tickets;
