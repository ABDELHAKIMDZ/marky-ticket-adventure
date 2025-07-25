
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { 
  Settings as SettingsIcon, 
  Bell,
  Moon,
  Sun,
  CreditCard,
  Shield,
  Languages,
  LogOut,
  HelpCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { HelpSupportDialog } from "@/components/settings/HelpSupportDialog";
import { NotificationSettings } from "@/components/settings/NotificationSettings";

interface SettingItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: () => void;
}

const Settings = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPrivacyModeEnabled, setIsPrivacyModeEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);
  
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
      toast({
        title: "Light Mode",
        description: "Light mode activated",
      });
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
      toast({
        title: "Dark Mode",
        description: "Dark mode activated",
      });
    }
  };

  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    });
    
    window.location.href = "/";
  };

  const togglePrivacyMode = () => {
    const newPrivacyModeState = !isPrivacyModeEnabled;
    setIsPrivacyModeEnabled(newPrivacyModeState);
    
    toast({
      title: newPrivacyModeState ? "Privacy Mode Enabled" : "Privacy Mode Disabled",
      description: newPrivacyModeState 
        ? "Your sensitive information will be hidden" 
        : "Sensitive information is now visible"
    });
  };

  const [settings] = useState<SettingItem[]>([
    {
      id: "notifications",
      icon: <Bell className="text-blue-500 dark:text-blue-400" />,
      title: "Notifications",
      description: "Manage your notification preferences",
    },
    {
      id: "appearance",
      icon: isDarkMode ? 
        <Moon className="text-purple-500 dark:text-purple-400" /> : 
        <Sun className="text-yellow-500 dark:text-yellow-400" />,
      title: "Appearance",
      description: "Dark mode and theme settings",
    },
    {
      id: "payment",
      icon: <CreditCard className="text-green-500 dark:text-green-400" />,
      title: "Payment Methods",
      description: "Manage your payment options",
    },
    {
      id: "privacy",
      icon: <Shield className="text-red-500 dark:text-red-400" />,
      title: "Privacy & Security",
      description: "Manage your privacy settings",
    },
    {
      id: "language",
      icon: <Languages className="text-orange-500 dark:text-orange-400" />,
      title: "Language",
      description: "Change your preferred language",
    },
    {
      id: "help",
      icon: <HelpCircle className="text-teal dark:text-teal" />,
      title: "Help & Support",
      description: "Get help with your account",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-300">
      <main className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="text-primary dark:text-primary" />
            Settings
          </h1>
        </header>

        <div className="space-y-4">
          {settings.map((setting) => (
            <Card 
              key={setting.id}
              className={`animate-fade-in cursor-pointer hover:shadow-md transition-all dark-card
                ${setting.id === "appearance" ? "bg-primary/5 dark:bg-primary/10" : ""}
                ${setting.id === "privacy" ? "bg-destructive/5 dark:bg-destructive/10" : ""}
              `}
              onClick={() => {
                if (setting.id === "appearance") {
                  toggleDarkMode();
                }
                if (setting.id === "privacy") {
                  togglePrivacyMode();
                }
                if (setting.id === "notifications" || setting.id === "help") {
                  setActiveSection(activeSection === setting.id ? null : setting.id);
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {setting.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {setting.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                  
                  {setting.id === "appearance" && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="dark-mode" className="sr-only">
                        Dark Mode
                      </Label>
                      <Switch 
                        id="dark-mode" 
                        checked={isDarkMode}
                        onCheckedChange={toggleDarkMode}
                      />
                    </div>
                  )}

                  {setting.id === "privacy" && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="privacy-mode" className="sr-only">
                        Privacy Mode
                      </Label>
                      <Switch 
                        id="privacy-mode" 
                        checked={isPrivacyModeEnabled}
                        onCheckedChange={togglePrivacyMode}
                      />
                    </div>
                  )}
                </div>

                {setting.id === "notifications" && activeSection === "notifications" && (
                  <div className="mt-4 pt-4 border-t">
                    <NotificationSettings />
                  </div>
                )}

                {setting.id === "help" && (
                  <HelpSupportDialog />
                )}
              </CardContent>
            </Card>
          ))}

          <Button 
            variant="destructive" 
            className="w-full mt-6"
            onClick={handleSignOut}
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
