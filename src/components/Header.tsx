import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Candy, LogOut, User, Menu, X, ShieldCheck } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Candy className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-candy-mint animate-pulse" />
          </div>
          <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-candy-strawberry bg-clip-text text-transparent">
            Sweet Shop
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/sweets" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Sweets
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="mint" size="sm">
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-up">
          <nav className="container py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className="text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/sweets" 
              className="text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Sweets
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="mint" size="sm" className="w-full">
                      <ShieldCheck className="h-4 w-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2 py-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
