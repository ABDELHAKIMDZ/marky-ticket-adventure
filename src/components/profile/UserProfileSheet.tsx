
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Profile } from "@/types/app";

interface UserProfileSheetProps {
  profile: Profile;
  open: boolean;
  setOpen: (open: boolean) => void;
  onProfileUpdate: (profile: Profile) => void;
  onSignOut: () => void;
}

export const UserProfileSheet = ({ 
  profile, 
  open, 
  setOpen, 
  onProfileUpdate, 
  onSignOut 
}: UserProfileSheetProps) => {
  const [localProfile, setLocalProfile] = useState(profile);

  const handleProfileChange = (field: keyof Profile, value: any) => {
    setLocalProfile({
      ...localProfile,
      [field]: value
    });
    
    // Update the global profile state
    onProfileUpdate({
      ...profile,
      [field]: value
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={profile.avatar} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-gray-500 text-sm">{profile.email}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <h4 className="font-medium">Reward Points</h4>
              <Badge variant="outline" className="font-semibold">{profile.points} points</Badge>
            </div>
            <p className="text-sm text-gray-500">Earn points for each booking and review</p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Account Settings</h4>
            
            <div className="space-y-2">
              <Label htmlFor="user-name">Full Name</Label>
              <Input 
                id="user-name" 
                value={localProfile.name} 
                onChange={(e) => handleProfileChange('name', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-email">Email Address</Label>
              <Input 
                id="user-email" 
                value={localProfile.email} 
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-phone">Phone Number</Label>
              <Input 
                id="user-phone" 
                value={localProfile.phone || ''} 
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="+213 555 000000"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-gray-500">Receive trip alerts and promotions</p>
              </div>
              <Switch 
                id="notifications" 
                checked={localProfile.notifications} 
                onCheckedChange={(checked) => handleProfileChange('notifications', checked)}
              />
            </div>
          </div>
          
          <Button 
            onClick={onSignOut} 
            variant="outline" 
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
