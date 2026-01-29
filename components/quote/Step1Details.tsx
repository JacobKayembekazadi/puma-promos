import React, { useState } from 'react';
import type { QuoteFormData } from '../../types';
import { USE_CASE_OPTIONS, TIMELINE_OPTIONS } from '../../constants';
import Button from '../ui/Button';

interface Step1Props {
  data: QuoteFormData;
  updateData: (data: Partial<QuoteFormData>) => void;
  nextStep: () => void;
}

// FIX: Moved FormField outside of the component to avoid re-declaration on each render and to fix a potential linter issue.
const FormField = ({ label, children, error }: { label: string, children: React.ReactNode, error?: string }) => (
  <div>
    <label className="font-medium text-text-primary block mb-2">{label}</label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const Step1Details: React.FC<Step1Props> = ({ data, updateData, nextStep }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndProceed = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.useCase) newErrors.useCase = 'This field is required.';
    if (!data.recipientCount) newErrors.recipientCount = 'This field is required.';
    if (Number(data.recipientCount) <= 0) newErrors.recipientCount = 'Must be greater than zero.';
    if (!data.timeline) newErrors.timeline = 'Please select a timeline.';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) { nextStep(); }
  };

  return (
    <div className="space-y-6">
      <FormField label="What are these for?" error={errors.useCase}>
        <select
          value={data.useCase}
          onChange={(e) => updateData({ useCase: e.target.value })}
          className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-1 focus:ring-accent focus:border-accent"
        >
          <option value="" disabled>Select a use case...</option>
          {USE_CASE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="How many items?" error={errors.recipientCount}>
          <input
            type="number" placeholder="e.g., 100" value={data.recipientCount}
            onChange={(e) => updateData({ recipientCount: e.target.value })}
            className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </FormField>
        <FormField label="Target Date (Optional)">
          <input
            type="date" value={data.eventDate}
            onChange={(e) => updateData({ eventDate: e.target.value })}
            className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </FormField>
      </div>

      <FormField label="Delivery Timeframe" error={errors.timeline}>
        <div className="flex flex-col sm:flex-row gap-4">
          {TIMELINE_OPTIONS.map(opt => (
            <label key={opt.value} className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors ${data.timeline === opt.value ? 'bg-accent border-accent text-text-dark' : 'border-border bg-background-secondary hover:border-hover'}`}>
              <input
                type="radio" name="timeline" value={opt.value} checked={data.timeline === opt.value}
                onChange={(e) => updateData({ timeline: e.target.value })} className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </FormField>
      <div className="mt-8 flex justify-end">
        <Button onClick={validateAndProceed}>Continue →</Button>
      </div>
    </div>
  );
};

export default Step1Details;