
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { Bell, Tag, Ticket, AlertCircle } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "booking" | "promo" | "alert";
  timestamp: string;
  read: boolean;
}

const Notifications = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Booking Confirmed!",
      message: "Your trip to Boston has been confirmed. Have a great journey!",
      type: "booking",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "Special Offer",
      message: "Get 20% off on your next booking to Washington DC!",
      type: "promo",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: "3",
      title: "Schedule Change",
      message: "Your upcoming trip schedule has been slightly modified.",
      type: "alert",
      timestamp: "2 days ago",
      read: true,
    },
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return <Ticket className="text-primary h-6 w-6" />;
      case "promo":
        return <Tag className="text-green-500 h-6 w-6" />;
      case "alert":
        return <AlertCircle className="text-orange-500 h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <Bell className="text-primary" />
            Notifications
          </h1>
        </header>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`animate-fade-in transition-colors ${
                notification.read ? "bg-white" : "bg-primary/5"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-medium ${
                        notification.read ? "text-gray-900" : "text-secondary"
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
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

export default Notifications;
