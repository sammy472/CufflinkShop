import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'wouter';

export function CartDrawer() {
  const { state, closeCart, updateQuantity, removeItem, getTotalPrice } = useCart();
  const { items, isOpen } = state;

  const shipping = 15.00;
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeCart}
          data-testid="backdrop-cart"
        />
      )}
      
      {/* Cart Drawer */}
      <div 
        className={`cart-drawer fixed right-0 top-0 h-full w-96 bg-card border-l border-border shadow-2xl z-50 ${isOpen ? 'open' : ''}`}
        data-testid="drawer-cart"
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h3 className="text-xl font-semibold text-card-foreground" data-testid="text-cart-title">
              Shopping Cart
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              data-testid="button-close-cart"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-8" data-testid="text-cart-empty">
                <p className="text-muted-foreground">Your cart is empty</p>
                <Link href="/products">
                  <Button className="mt-4" data-testid="button-start-shopping">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.product.id} className="p-4" data-testid={`cart-item-${item.product.id}`}>
                    <div className="flex items-center space-x-4">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                        data-testid={`img-cart-item-${item.product.id}`}
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-card-foreground" data-testid={`text-cart-item-name-${item.product.id}`}>
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground" data-testid={`text-cart-item-price-${item.product.id}`}>
                          ${item.product.price}
                        </p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            data-testid={`button-decrease-quantity-${item.product.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-3 text-sm" data-testid={`text-cart-item-quantity-${item.product.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            data-testid={`button-increase-quantity-${item.product.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-destructive"
                        data-testid={`button-remove-item-${item.product.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span data-testid="text-cart-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span data-testid="text-cart-shipping">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span data-testid="text-cart-tax">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-lg font-semibold text-card-foreground">Total:</span>
                  <span className="text-2xl font-bold text-primary" data-testid="text-cart-total">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              <Link href="/checkout">
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-secondary transition-colors font-semibold py-3"
                  onClick={closeCart}
                  data-testid="button-proceed-to-checkout"
                >
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
