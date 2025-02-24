
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Moon,
  CreditCard,
  Shield,
  Languages,
  HelpCircle,
  LogOut
} from "lucide-react";

interface SettingItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: () => void;
}

const Settings = () => {
  const [settings] = useState<SettingItem[]>([
    {
      id: "notifications",
      icon: <Bell className="text-blue-500" />,
      title: "Notifications",
      description: "Manage your notification preferences",
    },
    {
      id: "appearance",
      icon: <Moon className="text-purple-500" />,
      title: "Appearance",
      description: "Dark mode and theme settings",
    },
    {
      id: "payment",
      icon: <CreditCard className="text-green-500" />,
      title: "Payment Methods",
      description: "Manage your payment options",
    },
    {
      id: "privacy",
      icon: <Shield className="text-red-500" />,
      title: "Privacy & Security",
      description: "Configure your privacy settings",
    },
    {
      id: "language",
      icon: <Languages className="text-orange-500" />,
      title: "Language",
      description: "Change your preferred language",
    },
    {
      id: "help",
      icon: <HelpCircle className="text-teal-500" />,
      title: "Help & Support",
      description: "Get help with your account",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <SettingsIcon className="text-primary" />
            Settings
          </h1>
        </header>

        <div className="space-y-4">
          {settings.map((setting) => (
            <Card 
              key={setting.id}
              className="animate-fade-in cursor-pointer hover:shadow-md transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {setting.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {setting.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {setting.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            variant="destructive" 
            className="w-full mt-6"
            onClick={() => console.log("Logout clicked")}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Settings;
