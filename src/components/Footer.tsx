import { Candy, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-muted/30 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Candy className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-lg">Sweet Shop</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/sweets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> for sweet lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
