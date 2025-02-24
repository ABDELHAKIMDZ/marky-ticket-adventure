
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { TicketCheck } from "lucide-react";

interface Ticket {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
}

const Tickets = () => {
  const [tickets] = useState<Ticket[]>([
    {
      id: "1",
      from: "New York",
      to: "Boston",
      date: "2024-03-01",
      time: "09:00 AM",
      status: "upcoming",
    },
    {
      id: "2",
      from: "Boston",
      to: "Washington DC",
      date: "2024-02-15",
      time: "02:30 PM",
      status: "completed",
    },
  ]);

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
                <CardTitle className="text-lg flex justify-between">
                  <span>{ticket.from} → {ticket.to}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    ticket.status === "upcoming" 
                      ? "bg-primary/10 text-primary"
                      : ticket.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {ticket.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Date: {ticket.date}</span>
                    <span>Time: {ticket.time}</span>
                  </div>
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
