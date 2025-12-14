import { useState } from 'react';
import { Sweet } from '@/types/sweet';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSweets } from '@/context/SweetContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Package, Sparkles, Loader2 } from 'lucide-react';

interface SweetCardProps {
  sweet: Sweet;
}

const categoryColors: Record<string, string> = {
  'Chocolates': 'bg-candy-chocolate text-primary-foreground',
  'Gummies': 'bg-candy-strawberry text-primary-foreground',
  'Hard Candy': 'bg-candy-lemon text-candy-chocolate',
  'Lollipops': 'bg-candy-blueberry text-primary-foreground',
  'Caramels': 'bg-candy-caramel text-primary-foreground',
  'Mints': 'bg-candy-mint text-candy-chocolate',
  'Fudge': 'bg-candy-chocolate text-primary-foreground',
};

const categoryEmojis: Record<string, string> = {
  'Chocolates': '🍫',
  'Gummies': '🍬',
  'Hard Candy': '🍭',
  'Lollipops': '🍭',
  'Caramels': '🍮',
  'Mints': '🍃',
  'Fudge': '🍫',
};

export function SweetCard({ sweet }: SweetCardProps) {
  const { purchaseSweet } = useSweets();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 10;

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to make a purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsAnimating(true);
    setIsPurchasing(true);
    
    const success = await purchaseSweet(sweet.id);
    
    if (success) {
      toast({
        title: "Sweet Success! 🎉",
        description: `You purchased ${sweet.name}!`,
      });
    } else {
      toast({
        title: "Purchase failed",
        description: "Sorry, something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setIsPurchasing(false);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <Card className={`overflow-hidden group ${isAnimating ? 'animate-wiggle' : ''} ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div className="relative h-40 bg-gradient-to-br from-candy-pink-light via-candy-cream to-candy-mint-light flex items-center justify-center overflow-hidden">
        {sweet.image_url ? (
          <img 
            src={sweet.image_url} 
            alt={sweet.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
            {categoryEmojis[sweet.category] || '🍬'}
          </span>
        )}
        
        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-bold">
              Out of Stock
            </Badge>
          </div>
        )}
        
        {isLowStock && !isOutOfStock && (
          <Badge className="absolute top-3 right-3 bg-candy-caramel text-primary-foreground animate-pulse">
            Only {sweet.quantity} left!
          </Badge>
        )}

        {/* Sparkle decoration */}
        <Sparkles className="absolute top-3 left-3 h-5 w-5 text-candy-pink opacity-60" />
      </div>

      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-bold text-lg leading-tight line-clamp-2">
            {sweet.name}
          </h3>
        </div>
        
        <Badge className={`${categoryColors[sweet.category] || 'bg-muted text-muted-foreground'} mb-3`}>
          {sweet.category}
        </Badge>

        {sweet.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {sweet.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-primary">
            ${sweet.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span className="text-sm">{sweet.quantity} in stock</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className="w-full"
          variant={isOutOfStock ? "secondary" : "candy"}
          disabled={isOutOfStock || isPurchasing}
          onClick={handlePurchase}
        >
          {isPurchasing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Purchasing...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
