import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SweetCard } from '@/components/SweetCard';
import { useSweets } from '@/context/SweetContext';
import { Candy, Sparkles, ShoppingBag, Truck, Heart } from 'lucide-react';

const Index = () => {
  const { sweets } = useSweets();
  const featuredSweets = sweets.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-candy-pink/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-candy-mint/30 blur-3xl" />
          </div>
          
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Handcrafted with love</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
                Welcome to the{' '}
                <span className="bg-gradient-to-r from-primary via-candy-strawberry to-candy-caramel bg-clip-text text-transparent">
                  Sweetest
                </span>{' '}
                Shop in Town
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Discover our delightful collection of artisan candies, 
                handcrafted chocolates, and nostalgic treats that bring 
                joy to every moment.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/sweets">
                  <Button size="xl" variant="candy">
                    <ShoppingBag className="h-5 w-5" />
                    Shop Now
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="xl" variant="outline">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating candy decorations */}
          <div className="absolute top-20 left-10 text-4xl animate-float opacity-60">🍬</div>
          <div className="absolute top-40 right-20 text-3xl animate-float opacity-60" style={{ animationDelay: '0.5s' }}>🍭</div>
          <div className="absolute bottom-20 left-1/4 text-3xl animate-float opacity-60" style={{ animationDelay: '1s' }}>🍫</div>
          <div className="absolute bottom-40 right-1/4 text-4xl animate-float opacity-60" style={{ animationDelay: '1.5s' }}>🍮</div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center hover:-translate-y-1 transition-transform">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-candy-pink-light flex items-center justify-center mx-auto mb-4">
                    <Candy className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">Premium Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    Only the finest ingredients in every sweet treat
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:-translate-y-1 transition-transform">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-candy-mint-light flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-7 w-7 text-candy-mint" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Fresh sweets delivered right to your doorstep
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:-translate-y-1 transition-transform">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-candy-caramel-light flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-7 w-7 text-candy-caramel" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">Made with Love</h3>
                  <p className="text-sm text-muted-foreground">
                    Handcrafted by passionate confectioners
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Sweets */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Featured Sweets
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Discover our most popular treats that customers can't get enough of
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSweets.map((sweet) => (
                <SweetCard key={sweet.id} sweet={sweet} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/sweets">
                <Button variant="outline" size="lg">
                  View All Sweets
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-candy">
          <div className="container text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Satisfy Your Sweet Tooth?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join our community of sweet lovers and get exclusive access to new arrivals, 
              special offers, and delicious surprises!
            </p>
            <Link to="/register">
              <Button size="xl" variant="secondary" className="shadow-elevated">
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
