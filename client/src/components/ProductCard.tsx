import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Product } from '@shared/schema';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

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

  const cardSize = variant === 'compact' ? 'h-48' : 'h-64';
  const padding = variant === 'compact' ? 'p-4' : 'p-6';

  return (
    <Card className="product-card bg-card rounded-xl shadow-lg overflow-hidden border border-border" data-testid={`card-product-${product.id}`}>
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className={`w-full ${cardSize} object-cover`}
        data-testid={`img-product-${product.id}`}
      />
      <CardContent className={padding}>
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-xl font-semibold text-card-foreground" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h4>
          {product.featured && (
            <Badge variant="secondary" className="ml-2" data-testid={`badge-featured-${product.id}`}>
              Featured
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground mb-2" data-testid={`text-product-material-${product.id}`}>
          {product.material}
        </p>
        
        <p className="text-muted-foreground mb-4" data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            ${product.price}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="bg-primary text-primary-foreground hover:bg-secondary transition-colors"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground" data-testid={`text-product-stock-${product.id}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </div>
      </CardContent>
    </Card>
  );
}
