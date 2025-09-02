import { Navigation } from '@/components/Navigation';
import { CheckoutForm } from '@/components/CheckoutForm';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { CheckCircle, ShoppingCart } from 'lucide-react';

export default function Checkout() {
  const { state } = useCart();
  const [location] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const isSuccess = urlParams.get('success') === 'true';

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background transition-theme">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-card-foreground mb-4" data-testid="text-success-title">
                Order Successful!
              </h1>
              <p className="text-muted-foreground mb-6" data-testid="text-success-description">
                Thank you for your purchase. You'll receive confirmation emails shortly with your order details and tracking information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" data-testid="button-view-products">
                    View Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background transition-theme">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-card-foreground mb-4" data-testid="text-empty-cart-title">
                Your Cart is Empty
              </h1>
              <p className="text-muted-foreground mb-6" data-testid="text-empty-cart-description">
                Add some premium cufflinks to your cart before proceeding to checkout.
              </p>
              <Link href="/products">
                <Button data-testid="button-shop-now">
                  Shop Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-theme">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-checkout-title">
            Checkout
          </h1>
          <p className="text-muted-foreground" data-testid="text-checkout-description">
            Complete your order details below
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm onOrderComplete={() => window.location.href = '/checkout?success=true'} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle data-testid="text-order-summary-title">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3" data-testid={`order-summary-item-${item.product.id}`}>
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                        data-testid={`img-order-summary-${item.product.id}`}
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium" data-testid={`text-order-summary-name-${item.product.id}`}>
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground" data-testid={`text-order-summary-details-${item.product.id}`}>
                          Qty: {item.quantity} × ${item.product.price}
                        </p>
                      </div>
                      <span className="text-sm font-semibold" data-testid={`text-order-summary-total-${item.product.id}`}>
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
