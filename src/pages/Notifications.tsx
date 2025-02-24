
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Bell, Tag, Ticket, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "booking" | "promo" | "alert";
  timestamp: string;
  read: boolean;
}

const Notifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
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

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast({
      description: "Notification marked as read",
      duration: 2000,
    });
  };

  const clearAll = () => {
    setNotifications([]);
    toast({
      description: "All notifications cleared",
      duration: 2000,
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
              <Bell className="text-primary" />
              Notifications
              {unreadCount > 0 && (
                <span className="text-sm bg-primary text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            {notifications.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAll}
                className="text-gray-600"
              >
                Clear All
              </Button>
            )}
          </div>
        </header>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No notifications to show
            </div>
          ) : (
            notifications.map((notification) => (
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {notification.timestamp}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6"
                            >
                              <Check className="h-4 w-4 text-primary" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
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

export default Notifications;
