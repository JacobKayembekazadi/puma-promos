
import React from 'react';

const CoffeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2"/><path d="M18 16.5V20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3.5"/><path d="M7 16.5h10"/><path d="M10 2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M18 2v2a2 2 0 0 1 2 2v2"/></svg>;
const ShirtIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;
const PowerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>;
const BagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 18a2 2 0 0 0-2 2h12a2 2 0 0 0-2-2Z"/><path d="M10 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2"/><path d="m16.14 3.1-4.24 4.24"/><path d="m6.34 8.86-1.18 1.18"/><path d="M14 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V2"/><path d="M7.86 3.1 12.1 7.35"/><path d="m17.66 8.86 1.18 1.18"/></svg>;

const categories = [
  { name: "Drinkware & Tumblers", desc: "Tumblers, bottles, and mugs", startPrice: "$3.50", icon: <CoffeeIcon />, href: "https://pumapromos.espwebsite.com/ProductResults/?SearchTerms=Tumblers" },
  { name: "Apparel & Uniforms", desc: "T-shirts, hoodies, and hats", startPrice: "$12.00", icon: <ShirtIcon />, href: "https://pumapromos.espwebsite.com/ProductResults/?SearchTerms=Apparel" },
  { name: "Tech Accessories", desc: "Power banks, earbuds, USB drives", startPrice: "$8.00", icon: <PowerIcon />, href: "https://pumapromos.espwebsite.com/ProductResults/?SearchTerms=Tech" },
  { name: "Bags & Totes", desc: "Backpacks, totes, and duffels", startPrice: "$5.00", icon: <BagIcon />, href: "https://pumapromos.espwebsite.com/ProductResults/?SearchTerms=Bags" },
];

const CategoryCards: React.FC = () => {
  return (
    <section className="bg-background-secondary py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map(cat => (
            <div key={cat.name} className="bg-background-card border border-border rounded-xl p-6 text-center group transition-all duration-300 hover:border-accent hover:-translate-y-2 flex flex-col">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-hover flex items-center justify-center text-accent">
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-text-primary">{cat.name}</h3>
              <p className="mt-2 text-sm text-text-secondary">{cat.desc}</p>
              <p className="mt-4 text-text-secondary font-semibold">Starting at {cat.startPrice}</p>
              <a href={cat.href} target="_blank" rel="noopener noreferrer" className="mt-auto pt-4 font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View Products →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
