import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-candy-pink/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-candy-mint/30 blur-3xl" />
      </div>
      
      <div className="text-center relative animate-scale-in">
        <div className="text-8xl mb-6 animate-float">🍬</div>
        <h1 className="font-display text-6xl md:text-8xl font-bold text-primary mb-4">
          404
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Oops! This sweet treat doesn't exist
        </p>
        <Link to="/">
          <Button size="xl" variant="candy">
            <Home className="h-5 w-5" />
            Back to Sweet Shop
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
