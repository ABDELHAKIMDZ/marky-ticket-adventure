
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const tutorialSteps = [
  {
    title: "Welcome to MARKY TICKETS",
    description: "Discover the beauty of Bejaia, your next destination.",
    image: "https://th.bing.com/th/id/OIP.4FK7WK9RynjOSr6o0nZSOgAAAA?w=119&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
  },
  {
    title: "Discover Places",
    description: "Explore the stunning landscapes of Bejaia.",
    image: "https://th.bing.com/th/id/OIP.Hwngx_hopf26OfMin2EU2gHaLI?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
  },
  {
    title: "Easy Booking",
    description: "Book your tickets to Bejaia with just a few taps.",
    image: "https://th.bing.com/th/id/OIP.4FK7WK9RynjOSr6o0nZSOgAAAA?w=119&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
  },
];

export const Tutorial = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="h-full flex flex-col"
        >
          <div className="relative h-2/3">
            <img
              src={tutorialSteps[currentStep].image}
              alt={tutorialSteps[currentStep].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
          </div>
          <div className="flex-1 px-6 py-8 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-secondary mb-4">
                {tutorialSteps[currentStep].title}
              </h1>
              <p className="text-gray-600 text-lg">
                {tutorialSteps[currentStep].description}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentStep ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  onClick={onComplete}
                  className="text-gray-600"
                >
                  Skip
                </Button>
                <Button onClick={handleNext} className="bg-primary text-white">
                  {currentStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
