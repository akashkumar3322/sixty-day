import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, PartyPopper } from "lucide-react";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompletionModal({ isOpen, onClose }: CompletionModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Play celebration sound
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVq/m7q1aGAg+ltryxnMpBSuAzPLaizsIHGu77+ugUhENVK7m7q1bGgpAmuDyvnAjBjKFz/LTgzQIH2vA7+OZURAQV7Dn7K5dGQpCm+DyvnAkBjSGz/PUhDUIIG3B7+OaUhAQWLHn7K9eGgtDnOHyvnEkBzWH0PPUhTUIH23B7+ObUxIRWLLo7LBfGwxEneHzv3IlBzaI0fPVhjYIIW7C8OSbVBISWrPo7LBgHAxFnuL0wHImCDaJ0vPWhjgJIm/D8OSbVRMSW7Pp7LFhHQ1Gn+L0wHMnCDeK0/PWiDkJI3DD8OWcVhQTXLTp7bJiHg5HoOP0wnQoCjiL1PPXiToKJHHE8OadVxUUXrXq7bNkHxBIoeT0w3UpCzmM1fPYizsLJXLF8OeeWRYVYLbr7bRlIBFJouX1xHYqCzqN1vPZizwLJnPG8OifWhcWYrfs77ZnIRJKpOb1xXcrDDuO1vPajD0MJ3TH8OmgWxgXY7nt77dpIhNLpef2xngtDTyP1/Pbjj4NKXXH8Oqh");
        audio.play();
      } catch (error) {
        console.log("you time is up");
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden border-0 p-0">
        {/* Confetti Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative gradient-celebration p-8 text-center text-white">
          <DialogHeader>
            <DialogTitle className="mb-4 flex items-center justify-center gap-2 text-3xl font-bold">
              <Trophy className="h-8 w-8" />
              Congratulations!
              <Sparkles className="h-8 w-8" />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <PartyPopper className="mx-auto h-20 w-20 animate-bounce" />
            <p className="text-lg font-medium">
              You've completed all 60 days of your study journey!
            </p>
            <p className="text-sm opacity-90">
              Your dedication and consistency are truly remarkable. Keep up the amazing work!
            </p>
          </div>
        </div>

        <div className="bg-card p-6">
          <Button
            onClick={onClose}
            className="w-full bg-success hover:bg-success/90 text-success-foreground"
          >
            Continue Your Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
