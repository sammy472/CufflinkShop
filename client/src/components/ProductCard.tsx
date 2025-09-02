import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Product } from '@shared/schema';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Star, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    addItem(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const cardSize = variant === 'compact' ? 'h-56' : 'h-72';

  return (
    <Card className="product-card group bg-card rounded-2xl shadow-xl overflow-hidden border-0 transition-theme" data-testid={`card-product-${product.id}`}>
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className={`w-full ${cardSize} object-cover group-hover:scale-110 transition-transform duration-700`}
          data-testid={`img-product-${product.id}`}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full bg-white/90 text-gray-800 hover:bg-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4">
          {product.featured && (
            <Badge className="bg-accent text-accent-foreground font-medium px-3 py-1 rounded-full" data-testid={`badge-featured-${product.id}`}>
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {product.stock <= 0 && (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive" className="rounded-full">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h4>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded-full" data-testid={`text-product-material-${product.id}`}>
              {product.material}
            </span>
            <span className="text-sm text-muted-foreground" data-testid={`text-product-stock-${product.id}`}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2" data-testid={`text-product-description-${product.id}`}>
            {product.description}
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-border/50">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
              ${product.price}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-accent text-accent" />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 rounded-full px-6 shadow-lg hover:shadow-xl"
            data-testid={`button-add-to-cart-desktop-${product.id}`}
          >
            {product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
