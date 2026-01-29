
import React from 'react';
import Button from '../ui/Button';

interface HeaderProps {
  onGetQuoteClick: () => void;
}

const navLinks = [
  { name: "Products", href: "https://pumapromos.espwebsite.com/ProductResults/" },
  { name: "Catalog", href: "https://pumapromos.espwebsite.com/ProductResults/" },
  { name: "Resources", href: "https://pumapromos.espwebsite.com/NewsVideos/" },
];

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="border-2 border-white text-white w-10 h-10 rounded-md flex items-center justify-center text-2xl font-bold">
      P
    </div>
    <div>
      <span className="font-bold text-xl text-text-primary">PumaPromos</span>
      <p className="text-xs text-text-secondary -mt-1">From Houston, TX</p>
    </div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ onGetQuoteClick }) => {
  return (
    <header className="sticky top-0 bg-background-primary/80 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo />
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="text-text-primary hover:text-text-secondary transition-colors font-medium">
                {link.name}
              </a>
            ))}
          </nav>
          <Button onClick={onGetQuoteClick} className="hidden md:inline-flex px-8 py-3">
            Get Personalized Quote
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
