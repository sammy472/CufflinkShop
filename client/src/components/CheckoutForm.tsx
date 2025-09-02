import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { checkoutSchema, type CheckoutData } from '@shared/schema';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  onOrderComplete: () => void;
}

function PaymentForm({ customerData, onOrderComplete }: { customerData: CheckoutData; onOrderComplete: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create order first
      const orderResponse = await apiRequest("POST", "/api/orders", {
        orderData: customerData,
        items: state.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      const { order } = await orderResponse.json();

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout?success=true`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Payment succeeded
        await apiRequest("POST", "/api/payment-success", {
          orderId: order.id,
          paymentIntentId: order.stripePaymentIntentId,
        });

        clearCart();
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase! You'll receive confirmation emails shortly.",
        });
        onOrderComplete();
      }
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground hover:bg-secondary transition-colors font-semibold text-lg py-3"
        disabled={!stripe || isProcessing}
        data-testid="button-complete-order"
      >
        {isProcessing ? 'Processing...' : 'Complete Order'}
      </Button>
    </form>
  );
}

export function CheckoutForm({ onOrderComplete }: CheckoutFormProps) {
  const { state } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [customerData, setCustomerData] = useState<CheckoutData | null>(null);

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerFirstName: '',
      customerLastName: '',
      customerEmail: '',
      customerPhone: '',
      shippingStreet: '',
      shippingCity: '',
      shippingState: '',
      shippingZipCode: '',
    },
  });

  const subtotal = state.items.reduce((total, item) => 
    total + (parseFloat(item.product.price) * item.quantity), 0
  );
  const shipping = 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const onSubmit = async (data: CheckoutData) => {
    setCustomerData(data);
    
    try {
      // Create payment intent
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: total,
      });
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error: any) {
      form.setError('root', { message: error.message });
    }
  };

  if (clientSecret && customerData) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm customerData={customerData} onOrderComplete={onOrderComplete} />
      </Elements>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...form.register('customerFirstName')}
                data-testid="input-first-name"
              />
              {form.formState.errors.customerFirstName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.customerFirstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...form.register('customerLastName')}
                data-testid="input-last-name"
              />
              {form.formState.errors.customerLastName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.customerLastName.message}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register('customerEmail')}
              data-testid="input-email"
            />
            {form.formState.errors.customerEmail && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.customerEmail.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              {...form.register('customerPhone')}
              data-testid="input-phone"
            />
            {form.formState.errors.customerPhone && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.customerPhone.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              {...form.register('shippingStreet')}
              data-testid="input-street"
            />
            {form.formState.errors.shippingStreet && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.shippingStreet.message}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...form.register('shippingCity')}
                data-testid="input-city"
              />
              {form.formState.errors.shippingCity && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.shippingCity.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...form.register('shippingState')}
                data-testid="input-state"
              />
              {form.formState.errors.shippingState && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.shippingState.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                {...form.register('shippingZipCode')}
                data-testid="input-zip-code"
              />
              {form.formState.errors.shippingZipCode && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.shippingZipCode.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span data-testid="text-checkout-subtotal">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span data-testid="text-checkout-shipping">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span data-testid="text-checkout-tax">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary" data-testid="text-checkout-total">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {form.formState.errors.root && (
        <p className="text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}

      <Button 
        type="submit" 
        className="w-full bg-secondary text-secondary-foreground hover:bg-primary transition-colors font-semibold text-lg py-3"
        data-testid="button-continue-to-payment"
      >
        Continue to Payment
      </Button>
    </form>
  );
}
