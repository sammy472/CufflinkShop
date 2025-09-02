import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type Product } from '@shared/schema';
import { Link } from 'wouter';

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  return (
    <div className="min-h-screen bg-background transition-theme">
      <Navigation />
      <HeroSection />
      
      {/* Featured Products Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4" data-testid="text-featured-title">
              Featured Collection
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-featured-description">
              Handpicked designs that embody sophistication and timeless elegance
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <div className="p-6 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="grid-featured-products">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-primary transition-colors font-semibold px-8 py-3"
                data-testid="button-view-all-products"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4" data-testid="text-footer-brand">LuxeCuffs</h3>
              <p className="text-primary-foreground/80 mb-6 max-w-md" data-testid="text-footer-description">
                Premium cufflinks crafted for the distinguished gentleman. Elevate your style with our exclusive collection of luxury accessories.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-primary-foreground/20 p-3 rounded-lg hover:bg-primary-foreground/30 transition-colors" data-testid="link-social-facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="bg-primary-foreground/20 p-3 rounded-lg hover:bg-primary-foreground/30 transition-colors" data-testid="link-social-instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="bg-primary-foreground/20 p-3 rounded-lg hover:bg-primary-foreground/30 transition-colors" data-testid="link-social-twitter">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-footer-home">Home</Link></li>
                <li><Link href="/products" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-footer-products">Products</Link></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-footer-about">About Us</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-footer-contact">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-footer-shipping">Shipping Info</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-footer-returns">Returns</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-footer-support">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
            <p className="text-primary-foreground/60" data-testid="text-footer-copyright">
              &copy; 2024 LuxeCuffs. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}
