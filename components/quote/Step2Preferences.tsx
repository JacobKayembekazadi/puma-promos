
import React from 'react';
import type { QuoteFormData } from '../../types';
import { BUDGET_OPTIONS, CATEGORY_OPTIONS } from '../../constants';
import Button from '../ui/Button';

interface Step2Props {
  data: QuoteFormData;
  updateData: (data: Partial<QuoteFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Step2Preferences: React.FC<Step2Props> = ({ data, updateData, nextStep, prevStep }) => {
  const handleCategoryChange = (category: string) => {
    const newCategories = data.productCategories.includes(category)
      ? data.productCategories.filter((c) => c !== category)
      : [...data.productCategories, category];
    updateData({ productCategories: newCategories });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="font-medium text-text-primary block mb-2">Budget per item (USD)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {BUDGET_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => updateData({ budgetPerItem: opt, customBudget: '' })}
              className={`p-3 border rounded-lg transition-colors ${data.budgetPerItem === opt ? 'bg-accent border-accent text-text-dark' : 'border-border bg-background-secondary hover:border-hover'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-medium text-text-primary block mb-2">Product Categories (Select all that apply)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORY_OPTIONS.map(cat => (
            <label key={cat} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${data.productCategories.includes(cat) ? 'bg-accent/10 border-accent' : 'border-border bg-background-secondary hover:border-hover'}`}>
              <input
                type="checkbox"
                checked={data.productCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="mt-1 h-4 w-4 rounded border-border bg-background-secondary text-accent focus:ring-accent"
              />
              <span className="ml-3 text-sm text-text-primary">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="font-medium text-text-primary block mb-2">Special Requirements (Optional)</label>
        <textarea
          value={data.specialRequirements}
          onChange={(e) => updateData({ specialRequirements: e.target.value })}
          placeholder="Any specific needs or preferences?"
          rows={3}
          className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-1 focus:ring-accent focus:border-accent"
        />
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={prevStep}>← Back</Button>
        <Button onClick={nextStep}>Continue →</Button>
      </div>
    </div>
  );
};

export default Step2Preferences;
