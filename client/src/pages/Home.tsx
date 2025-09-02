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
      <footer className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 text-background overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='37' cy='37' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-4xl font-bold text-accent" data-testid="text-footer-brand">LuxeCuffs</h3>
                <p className="text-background/80 leading-relaxed max-w-md text-lg" data-testid="text-footer-description">
                  Handcrafted luxury cufflinks that define sophistication. Each piece tells a story of timeless elegance and impeccable craftsmanship.
                </p>
              </div>
              
              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-background">Stay Updated</h4>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-full bg-background/10 border border-background/20 text-background placeholder:text-background/60 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6">
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                <a href="#" className="group bg-background/10 hover:bg-accent p-3 rounded-full transition-all duration-300 hover:scale-110" data-testid="link-social-facebook">
                  <svg className="w-5 h-5 text-background group-hover:text-accent-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="group bg-background/10 hover:bg-accent p-3 rounded-full transition-all duration-300 hover:scale-110" data-testid="link-social-instagram">
                  <svg className="w-5 h-5 text-background group-hover:text-accent-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-2.458 0-4.467-2.01-4.467-4.467c0-2.458 2.009-4.467 4.467-4.467c2.458 0 4.467 2.009 4.467 4.467C12.916 14.978 10.907 16.988 8.449 16.988z"/>
                  </svg>
                </a>
                <a href="#" className="group bg-background/10 hover:bg-accent p-3 rounded-full transition-all duration-300 hover:scale-110" data-testid="link-social-twitter">
                  <svg className="w-5 h-5 text-background group-hover:text-accent-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Sections */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-background">Shop</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-home">Home</Link></li>
                <li><Link href="/products" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-products">All Products</Link></li>
                <li><a href="#" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-collections">Collections</a></li>
                <li><a href="#" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-new-arrivals">New Arrivals</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-background">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-contact">Contact Us</a></li>
                <li><a href="#" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-shipping">Shipping Info</a></li>
                <li><a href="#" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-returns">Returns & Exchanges</a></li>
                <li><a href="#" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-support">Size Guide</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-background">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-about">About Us</a></li>
                <li><a href="#" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-careers">Careers</a></li>
                <li><a href="#" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-press">Press</a></li>
                <li><a href="#" className="text-background/80 hover:text-accent transition-colors text-lg" data-testid="link-footer-affiliates">Affiliates</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-background/20 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-background/70 text-center md:text-left" data-testid="text-footer-copyright">
                &copy; 2024 LuxeCuffs. All rights reserved.
              </p>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="#" className="text-background/70 hover:text-accent transition-colors">Privacy Policy</a>
                <a href="#" className="text-background/70 hover:text-accent transition-colors">Terms of Service</a>
                <a href="#" className="text-background/70 hover:text-accent transition-colors">Cookie Policy</a>
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-3">
                <span className="text-background/70 text-sm">We accept</span>
                <div className="flex gap-2">
                  <div className="bg-background/10 p-2 rounded">
                    <div className="w-8 h-5 bg-background/20 rounded"></div>
                  </div>
                  <div className="bg-background/10 p-2 rounded">
                    <div className="w-8 h-5 bg-background/20 rounded"></div>
                  </div>
                  <div className="bg-background/10 p-2 rounded">
                    <div className="w-8 h-5 bg-background/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}
