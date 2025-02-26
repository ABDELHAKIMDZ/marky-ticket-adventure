
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, QrCode } from "lucide-react";
import QRCode from "qrcode";

interface PaymentFormProps {
  price: string;
  from: string;
  to: string;
  date: Date;
  time: string;
  onSuccess: () => void;
}

export const PaymentForm = ({ price, from, to, date, time, onSuccess }: PaymentFormProps) => {
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");

  const handlePayment = async () => {
    // In a real app, this would be connected to a payment processor
    if (cardNumber && expiryDate && cvv) {
      toast({
        title: "Payment Successful",
        description: "Your ticket has been booked!",
      });

      // Generate QR code with ticket details
      const ticketData = JSON.stringify({
        from,
        to,
        date: date.toISOString(),
        time,
        ticketId: Math.random().toString(36).substr(2, 9),
      });

      try {
        const qrDataUrl = await QRCode.toDataURL(ticketData);
        setQrCode(qrDataUrl);
        setShowQR(true);
        onSuccess();
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not generate ticket QR code",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        {!showQR ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Card Number</label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <Input
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CVV</label>
                <Input
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={3}
                  type="password"
                />
              </div>
            </div>
            <div className="pt-4">
              <Button onClick={handlePayment} className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {price}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <img src={qrCode} alt="Ticket QR Code" className="w-48 h-48" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Your Ticket Details</h3>
              <p className="text-sm text-gray-600">From: {from}</p>
              <p className="text-sm text-gray-600">To: {to}</p>
              <p className="text-sm text-gray-600">
                Date: {date.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">Time: {time}</p>
            </div>
            <Button 
              onClick={() => window.print()} 
              variant="outline" 
              className="w-full"
            >
              <QrCode className="mr-2 h-4 w-4" />
              Save Ticket
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
