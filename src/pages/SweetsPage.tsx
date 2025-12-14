import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SweetCard } from '@/components/SweetCard';
import { SearchFilter } from '@/components/SearchFilter';
import { useSweets } from '@/context/SweetContext';
import { useAuth } from '@/context/AuthContext';
import { SweetCategory } from '@/types/sweet';
import { Candy, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function SweetsPage() {
  const { sweets, isLoading } = useSweets();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SweetCategory | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });

  const filteredSweets = useMemo(() => {
    return sweets.filter((sweet) => {
      // Search filter
      const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = !selectedCategory || sweet.category === selectedCategory;

      // Price range filter
      const matchesPrice = sweet.price >= priceRange.min && sweet.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [sweets, searchQuery, selectedCategory, priceRange]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <Candy className="h-8 w-8 text-primary" />
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Our Sweet Collection
              </h1>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse our delightful selection of artisan candies and treats
            </p>
          </div>

          {/* Search and Filters */}
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredSweets.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredSweets.length} sweet{filteredSweets.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSweets.map((sweet) => (
                  <SweetCard key={sweet.id} sweet={sweet} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍬</div>
              <h3 className="font-display text-xl font-bold mb-2">No sweets found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
