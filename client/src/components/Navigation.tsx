import { Link, useLocation } from 'wouter';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export function Navigation() {
  const { getTotalItems, toggleCart } = useCart();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = getTotalItems();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer" data-testid="link-home">
                LuxeCuffs
              </h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`transition-colors ${location === '/' ? 'text-primary' : 'text-foreground hover:text-primary'}`} data-testid="link-nav-home">
              Home
            </Link>
            <Link href="/products" className={`transition-colors ${location === '/products' ? 'text-primary' : 'text-foreground hover:text-primary'}`} data-testid="link-nav-products">
              Products
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <Button
              variant="default"
              size="icon"
              onClick={toggleCart}
              className="relative bg-primary text-primary-foreground hover:bg-secondary"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs h-5 w-5 flex items-center justify-center p-0"
                  data-testid="badge-cart-count"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            <Link href="/admin">
              <Button variant="secondary" className="hidden md:flex" data-testid="button-admin">
                <User className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>

            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="block px-3 py-2 text-foreground hover:text-primary transition-colors" data-testid="link-mobile-home">
                Home
              </Link>
              <Link href="/products" className="block px-3 py-2 text-foreground hover:text-primary transition-colors" data-testid="link-mobile-products">
                Products
              </Link>
              <Link href="/admin" className="block px-3 py-2 text-foreground hover:text-primary transition-colors" data-testid="link-mobile-admin">
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
