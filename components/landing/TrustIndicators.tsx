
import React from 'react';

const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/><circle cx="7" cy="17" r="2"/><circle cx="17"cy="17" r="2"/></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const indicators = [
  { title: "Fast Turnaround", desc: "7-14 day standard. Rush available.", icon: <TruckIcon /> },
  { title: "Quality Guaranteed", desc: "Premium products or money back.", icon: <ShieldIcon /> },
  { title: "Local Service", desc: "Houston-based team ready to help.", icon: <ClockIcon /> },
];

const TrustIndicators: React.FC = () => {
  return (
    <section className="bg-background-primary py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {indicators.map(item => (
            <div key={item.title} className="flex items-center gap-4">
              <div className="text-accent">{item.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
