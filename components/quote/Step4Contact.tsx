import React, { useState } from 'react';
import type { QuoteFormData } from '../../types';
import { REFERRAL_OPTIONS } from '../../constants';
import Button from '../ui/Button';

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

interface Step4Props {
  data: QuoteFormData; updateData: (data: Partial<QuoteFormData>) => void; onSubmit: () => void; prevStep: () => void;
}

// FIX: Moved FormField outside of the component to avoid re-declaration on each render and to fix a potential linter issue.
const FormField = ({ label, children, error }: { label: string, children: React.ReactNode, error?: string }) => (
  <div>
    <label className="font-medium text-text-primary block mb-2">{label}</label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const Step4Contact: React.FC<Step4Props> = ({ data, updateData, onSubmit, prevStep }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.companyName.trim()) newErrors.companyName = 'Company name is required.';
    if (!data.contactName.trim()) newErrors.contactName = 'Your name is required.';
    if (!data.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Email is invalid.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) { onSubmit(); }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Company Name" error={errors.companyName}>
          <input type="text" value={data.companyName} onChange={(e) => updateData({ companyName: e.target.value })} className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-1 focus:ring-accent focus:border-accent" />
        </FormField>
        <FormField label="Your Name" error={errors.contactName}>
          <input type="text" value={data.contactName} onChange={(e) => updateData({ contactName: e.target.value })} className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-1 focus:ring-accent focus:border-accent" />
        </FormField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Email Address" error={errors.email}>
          <input type="email" value={data.email} onChange={(e) => updateData({ email: e.target.value })} className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-1 focus:ring-accent focus:border-accent" />
        </FormField>
        <FormField label="Phone Number (Optional)">
          <input type="tel" placeholder="(555) 123-4567" value={data.phone} onChange={(e) => updateData({ phone: e.target.value })} className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-1 focus:ring-accent focus:border-accent" />
        </FormField>
      </div>
      <FormField label="How did you hear about us? (Optional)">
        <select value={data.referralSource} onChange={(e) => updateData({ referralSource: e.target.value })} className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-1 focus:ring-accent focus:border-accent">
          <option value="">Select an option...</option>
          {REFERRAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </FormField>
      <div className="bg-background-secondary p-3 rounded-lg flex items-center gap-2 text-sm text-text-secondary">
        <LockIcon />
        <span>Your information is secure and confidential.</span>
      </div>
      <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
        <Button variant="ghost" onClick={prevStep}>← Back</Button>
        <Button onClick={validateAndSubmit} className="w-full sm:w-auto">Get My Quote</Button>
      </div>
    </div>
  );
};

export default Step4Contact;