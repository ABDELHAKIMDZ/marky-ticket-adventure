
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Bell } from "lucide-react";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    marketing: false
  });

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => {
      const newState = { ...prev, [type]: !prev[type] };
      
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Notifications`,
        description: `${newState[type] ? 'Enabled' : 'Disabled'} ${type} notifications`
      });
      
      return newState;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-500 dark:text-blue-400" />
          <div>
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive push notifications
            </p>
          </div>
        </div>
        <Switch
          id="push-notifications"
          checked={notifications.push}
          onCheckedChange={() => handleNotificationChange('push')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Receive email updates
          </p>
        </div>
        <Switch
          id="email-notifications"
          checked={notifications.email}
          onCheckedChange={() => handleNotificationChange('email')}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="marketing-notifications">Marketing</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Receive marketing emails
          </p>
        </div>
        <Switch
          id="marketing-notifications"
          checked={notifications.marketing}
          onCheckedChange={() => handleNotificationChange('marketing')}
        />
      </div>
    </div>
  );
};
