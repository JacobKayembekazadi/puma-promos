
import React from 'react';
import Button from '../ui/Button';

interface HeroProps {
  onGetQuoteClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetQuoteClick }) => {
  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-background-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary">
          Transform Your Brand
          <br />
          <span>With Premium Promo Products</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg lg:text-xl text-text-secondary">
          Premium promotional products for Houston businesses and beyond. Tell us what you need, and we'll find your perfect branded items.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={onGetQuoteClick} className="w-full sm:w-auto">
            Get Personalized Quote
          </Button>
          <a
            href="https://pumapromos.espwebsite.com/ProductResults/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary focus:ring-accent disabled:opacity-50 disabled:pointer-events-none border-2 border-accent text-accent hover:bg-accent/10 px-6 py-3 w-full sm:w-auto"
          >
            Browse Products →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
