
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare } from "lucide-react";

export const HelpSupportDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-0 hover:bg-transparent">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-shrink-0">
              <HelpCircle className="text-teal dark:text-teal" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Help & Support
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get help with your account
              </p>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Help & Support</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button className="w-full" onClick={() => window.location.href = "mailto:support@example.com"}>
            <MessageSquare className="mr-2" />
            Contact Support
          </Button>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>Need assistance? Our support team is here to help!</p>
            <p>Email: support@example.com</p>
            <p>Hours: Monday - Friday, 9AM - 6PM EST</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
