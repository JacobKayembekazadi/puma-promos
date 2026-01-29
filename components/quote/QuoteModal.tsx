
import React, { useState, useEffect } from 'react';
import type { QuoteFormData, QuoteResult } from '../../types';
import ProgressSidebar from './ProgressSidebar';
import Step1Details from './Step1Details';
import Step2Preferences from './Step2Preferences';
import Step3Branding from './Step3Branding';
import Step4Contact from './Step4Contact';
import QuoteResults from './QuoteResults';
import { generateQuote } from '../../services/geminiService';

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const LoaderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-accent"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>;

interface QuoteModalProps { isOpen: boolean; onClose: () => void; onOpenChat: () => void; }

const initialFormData: QuoteFormData = {
  useCase: '', recipientCount: '', eventDate: '', timeline: 'standard',
  budgetPerItem: '', customBudget: '', productCategories: [], specialRequirements: '',
  logoFile: null, logoPreview: '', brandColors: '', logoPlacement: [],
  companyName: '', contactName: '', email: '', phone: '', referralSource: '',
};

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, onOpenChat }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1); setFormData(initialFormData); setIsGenerating(false); setQuoteResult(null); setError(null); setEmailStatus('idle');
      }, 300);
    }
  }, [isOpen]);

  const updateFormData = (data: Partial<QuoteFormData>) => setFormData((prev) => ({ ...prev, ...data }));
  const nextStep = () => setStep((prev) => (prev < 5 ? prev + 1 : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

  const handleSubmit = async () => {
    setStep(5);
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateQuote(formData);
      setQuoteResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      setError("We couldn't generate your quote. Please try again or contact our team.");
      console.error("Quote generation failed:", message);
    } finally { setIsGenerating(false); }
  };

  const handleEmailQuote = async () => {
    if (!formData.email) {
      setEmailStatus('error');
      setTimeout(() => setEmailStatus('idle'), 3000);
      return;
    }

    // In production, this would be an API call to a backend service
    // For now, we simulate the email sending behavior
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmailStatus('success');
    } catch {
      setEmailStatus('error');
    }
    setTimeout(() => setEmailStatus('idle'), 3000);
  };
  
  if (!isOpen) return null;

  const renderContent = () => {
    if (step < 5) {
      return (
        <div className="flex flex-1 overflow-hidden">
          <ProgressSidebar currentStep={step} />
          <div className="flex-1 p-8 overflow-y-auto">
            {step === 1 && <Step1Details data={formData} updateData={updateFormData} nextStep={nextStep} />}
            {step === 2 && <Step2Preferences data={formData} updateData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
            {step === 3 && <Step3Branding data={formData} updateData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
            {step === 4 && <Step4Contact data={formData} updateData={updateFormData} onSubmit={handleSubmit} prevStep={prevStep} />}
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex-1 p-8 overflow-y-auto relative">
        {isGenerating ? (
          <div className="text-center py-20 flex flex-col items-center justify-center h-full"><LoaderIcon /><h2 className="text-2xl font-bold mt-4">Analyzing your needs...</h2><p className="text-text-secondary mt-2">Our AI is finding the perfect products for you!</p></div>
        ) : error ? (
          <div className="text-center py-20 flex flex-col items-center justify-center h-full"><h2 className="text-2xl font-bold text-red-500">An Error Occurred</h2><p className="text-text-secondary mt-2 max-w-md">{error}</p></div>
        ) : (
          quoteResult && <QuoteResults result={quoteResult} onEmailQuote={handleEmailQuote} onOpenChat={onOpenChat} />
        )}
        {emailStatus === 'success' && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm">Quote emailed to {formData.email}</div>
        )}
        {emailStatus === 'error' && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm">Failed to send email. Please try again.</div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print" onClick={onClose}>
      <div id="quote-modal-content" className="bg-background-primary rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-border transition-all duration-300 print-container" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-border flex justify-between items-center bg-background-secondary rounded-t-2xl no-print">
          <h2 className="text-2xl font-bold text-text-primary">Get Your Personalized Quote</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XIcon /></button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default QuoteModal;
