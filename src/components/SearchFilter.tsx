import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SWEET_CATEGORIES, SweetCategory } from '@/types/sweet';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: SweetCategory | null;
  onCategoryChange: (category: SweetCategory | null) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange(null);
    onPriceRangeChange({ min: 0, max: 100 });
  };

  const hasActiveFilters = searchQuery || selectedCategory || priceRange.min > 0 || priceRange.max < 100;

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for sweets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-1.5"
          onClick={() => onCategoryChange(null)}
        >
          All
        </Badge>
        {SWEET_CATEGORIES.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-1.5"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Extended Filters */}
      {showFilters && (
        <div className="p-4 rounded-xl border-2 border-border bg-muted/30 animate-scale-in">
          <h4 className="font-display font-semibold mb-4">Price Range</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">Min Price</label>
              <Input
                type="number"
                min={0}
                value={priceRange.min}
                onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                className="text-center"
              />
            </div>
            <span className="text-muted-foreground pt-6">to</span>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">Max Price</label>
              <Input
                type="number"
                min={0}
                value={priceRange.max}
                onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                className="text-center"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
