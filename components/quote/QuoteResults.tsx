
import React from 'react';
import type { QuoteResult } from '../../types';
import Button from '../ui/Button';

interface QuoteResultsProps {
  result: QuoteResult;
  onEmailQuote: () => void;
  onOpenChat: () => void;
}

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const QuoteResults: React.FC<QuoteResultsProps> = ({ result, onEmailQuote, onOpenChat }) => {
  
  const handlePrint = () => {
    // This will use the @media print styles in index.html
    window.print();
  };

  return (
    <div className="text-center print-content">
      <div className="mx-auto w-16 h-16 flex items-center justify-center no-print"><CheckCircleIcon /></div>
      <h2 className="text-3xl font-bold mt-4 print-text-main">Your Quote is Ready!</h2>
      <p className="text-text-secondary mt-1 print-text-light">Quote #{result.quoteNumber}</p>

      <div className="text-left mt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4 print-text-main">Recommended Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.products.map((product, index) => (
            <div key={index} className="bg-background-card border border-border rounded-xl p-6 print-card">
              <div className="inline-block bg-accent text-text-dark px-3 py-1 rounded-full text-xs font-bold mb-4">AI PICK</div>
              <h3 className="text-text-primary text-xl font-bold mb-3 print-text-dark">{product.name}</h3>
              <p className="text-text-secondary italic mb-6 print-text-light">"{product.description}"</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-text-primary print-text-dark"><span>Quantity:</span><span className="font-semibold">{product.quantity} items</span></div>
                <div className="flex justify-between text-text-primary print-text-dark"><span>Unit Price:</span><span className="font-semibold">{formatCurrency(product.price)}</span></div>
                <div className="flex justify-between text-text-primary text-xl border-t border-border pt-2 print-text-dark">
                  <span className="font-bold">Line Total:</span><span className="font-bold">{formatCurrency(product.price * product.quantity)}</span>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-gray-500 text-sm print-text-light"><span className="font-semibold text-text-secondary print-text-dark">Why recommended:</span><br />{product.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-left mt-8 bg-background-card border border-border p-6 rounded-lg print-card">
        <h3 className="text-lg font-semibold text-text-primary mb-4 print-text-dark">Quote Summary</h3>
        <div className="space-y-2 text-text-secondary print-text-light">
            <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(result.subtotal)}</span></div>
            <div className="flex justify-between"><span>Setup Fees:</span><span>{formatCurrency(result.setupFees)}</span></div>
            <div className="flex justify-between"><span>Estimated Shipping:</span><span>{formatCurrency(result.shipping)}</span></div>
            <hr className="my-2 border-border opacity-50"/>
            <div className="flex justify-between font-bold text-2xl text-text-primary print-text-dark">
                <span>Total:</span>
                <span className="print-accent">{formatCurrency(result.total)}</span>
            </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <Button variant="outline" onClick={handlePrint}>Download PDF Quote</Button>
        <Button variant="outline" onClick={onEmailQuote}>Email Me Quote</Button>
        <a href="https://pumapromos.espwebsite.com/ProductResults/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary focus:ring-accent disabled:opacity-50 disabled:pointer-events-none border-2 border-accent text-accent hover:bg-accent/10 px-6 py-3">View Full Catalog</a>
      </div>
      <div className="mt-4 no-print">
        <Button onClick={onOpenChat} className="w-full">Talk to Our Team</Button>
      </div>
      
      <p className="text-sm text-text-secondary mt-6 print-text-light">
        Our Houston team will contact you within 24 hours to finalize details.
      </p>
    </div>
  );
};

export default QuoteResults;
