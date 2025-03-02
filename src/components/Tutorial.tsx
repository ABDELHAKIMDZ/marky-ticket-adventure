
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const tutorialSteps = [
  {
    title: "Welcome to Marky Ticket",
    description: "Your journey begins here. Book bus tickets with ease.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    title: "Discover Places",
    description: "Explore amazing destinations and plan your next adventure.",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
  },
  {
    title: "Easy Booking",
    description: "Book your tickets in just a few taps.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  },
];

export const Tutorial = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldShow, setShouldShow] = useState(true);
  
  useEffect(() => {
    // Check if the tutorial has been completed before
    const tutorialCompleted = localStorage.getItem("tutorialCompleted");
    if (tutorialCompleted === "true") {
      setShouldShow(false);
      onComplete();
    }
  }, [onComplete]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark tutorial as completed
      localStorage.setItem("tutorialCompleted", "true");
      setShouldShow(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    // Mark tutorial as completed when skipped
    localStorage.setItem("tutorialCompleted", "true");
    setShouldShow(false);
    onComplete();
  };

  if (!shouldShow) {
    return null;
  }

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
                  onClick={handleSkip}
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
