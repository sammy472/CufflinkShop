import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { type Product } from '@shared/schema';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState('featured');

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.set('search', searchQuery);
  if (selectedMaterials.length > 0) queryParams.set('material', selectedMaterials[0]); // Simplified for demo
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    if (min) queryParams.set('minPrice', min.toString());
    if (max) queryParams.set('maxPrice', max.toString());
  }

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', queryParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/products?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const handleMaterialChange = (material: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, material]);
    } else {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return b.featured ? 1 : -1; // Featured first
    }
  });

  return (
    <div className="min-h-screen bg-background transition-theme">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-filters-title">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search cufflinks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <Label>Price Range</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      { label: 'Under $200', value: '0-200' },
                      { label: '$200 - $500', value: '200-500' },
                      { label: '$500 - $1000', value: '500-1000' },
                      { label: 'Over $1000', value: '1000-' },
                    ].map((range) => (
                      <div key={range.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`price-${range.value}`}
                          checked={priceRange === range.value}
                          onCheckedChange={(checked) => 
                            setPriceRange(checked ? range.value : '')
                          }
                          data-testid={`checkbox-price-${range.value}`}
                        />
                        <Label htmlFor={`price-${range.value}`} className="text-sm">
                          {range.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div>
                  <Label>Material</Label>
                  <div className="space-y-2 mt-2">
                    {['Gold', 'Silver', 'Platinum', 'Titanium', 'Brass'].map((material) => (
                      <div key={material} className="flex items-center space-x-2">
                        <Checkbox
                          id={`material-${material}`}
                          checked={selectedMaterials.includes(material)}
                          onCheckedChange={(checked) => 
                            handleMaterialChange(material, checked as boolean)
                          }
                          data-testid={`checkbox-material-${material.toLowerCase()}`}
                        />
                        <Label htmlFor={`material-${material}`} className="text-sm">
                          {material}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMaterials([]);
                    setPriceRange('');
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-foreground" data-testid="text-products-title">
                All Products
              </h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Sort by: Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12" data-testid="text-no-products">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMaterials([]);
                    setPriceRange('');
                  }}
                  data-testid="button-reset-filters"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-all-products">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} variant="compact" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CartDrawer />
    </div>
  );
}
