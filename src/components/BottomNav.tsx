
import { Home, Ticket, Bell, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 py-2 px-4 flex justify-around items-center animate-slide-up">
      <Link
        to="/"
        className={`flex flex-col items-center space-y-1 ${
          isActive("/") ? "text-primary" : "text-gray-600"
        }`}
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        to="/tickets"
        className={`flex flex-col items-center space-y-1 ${
          isActive("/tickets") ? "text-primary" : "text-gray-600"
        }`}
      >
        <Ticket size={24} />
        <span className="text-xs">Tickets</span>
      </Link>
      <Link
        to="/notifications"
        className={`flex flex-col items-center space-y-1 ${
          isActive("/notifications") ? "text-primary" : "text-gray-600"
        }`}
      >
        <Bell size={24} />
        <span className="text-xs">Notifications</span>
      </Link>
      <Link
        to="/settings"
        className={`flex flex-col items-center space-y-1 ${
          isActive("/settings") ? "text-primary" : "text-gray-600"
        }`}
      >
        <Settings size={24} />
        <span className="text-xs">Settings</span>
      </Link>
    </nav>
  );
};
