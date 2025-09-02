import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 fade-in" data-testid="text-hero-title">
            Elevate Your Style
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 fade-in" data-testid="text-hero-description">
            Discover our exclusive collection of premium cufflinks crafted for the distinguished gentleman
          </p>
          <div className="flex flex-col sm:flex-row gap-4 fade-in">
            <Link href="/products">
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-lg px-8 py-4"
                data-testid="button-shop-collection"
              >
                Shop Collection
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors text-lg px-8 py-4"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
