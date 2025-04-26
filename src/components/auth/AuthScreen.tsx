
import { LogIn, UserPlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface AuthScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onSkip: () => void;
}

export const AuthScreen = ({ onSignIn, onSignUp, onSkip }: AuthScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/36902b06-e701-44e7-800f-58f9fc415372.png"
              alt="MARKY TICKETS"
              className="h-32 w-auto" // Increased from h-16 to h-32
            />
          </div>
          <p className="text-gray-600">Your Béjaïa travel companion</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full" 
            onClick={onSignIn}
            variant="outline"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
          
          <Button 
            className="w-full"
            onClick={onSignUp}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Button>
          
          <Button 
            className="w-full"
            variant="ghost"
            onClick={onSkip}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Continue as Guest
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  );
};
