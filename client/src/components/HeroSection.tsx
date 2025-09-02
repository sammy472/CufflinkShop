import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Sparkles, Award, Shield } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative luxury-gradient text-primary-foreground overflow-hidden hero-pattern min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
                <span className="text-accent font-medium tracking-wider uppercase text-sm">Luxury Collection</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 fade-in leading-tight" data-testid="text-hero-title">
                Exquisite
                <span className="block text-accent">Cufflinks</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 fade-in leading-relaxed max-w-lg" data-testid="text-hero-description">
                Handcrafted luxury accessories that define sophistication and elevate your presence
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 fade-in">
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 text-lg px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl"
                  data-testid="button-shop-collection"
                >
                  Explore Collection
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-white/10 hover:border-white transition-all duration-300 text-lg px-10 py-4 rounded-full backdrop-blur-sm"
                data-testid="button-learn-more"
              >
                Our Story
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 slide-up">
              <div className="text-center space-y-2">
                <Award className="h-8 w-8 text-accent mx-auto" />
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm text-primary-foreground/80">Years Experience</div>
              </div>
              <div className="text-center space-y-2">
                <Shield className="h-8 w-8 text-accent mx-auto" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-primary-foreground/80">Authentic</div>
              </div>
              <div className="text-center space-y-2">
                <Sparkles className="h-8 w-8 text-accent mx-auto" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-primary-foreground/80">Happy Clients</div>
              </div>
            </div>
          </div>

          <div className="relative fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-3xl transform rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                alt="Luxury Cufflinks"
                className="relative rounded-3xl shadow-2xl w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
