
import React from 'react';

interface ProgressSidebarProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Project Details" },
  { number: 2, title: "Preferences" },
  { number: 3, title: "Branding" },
  { number: 4, title: "Contact" },
];

const ProgressSidebar: React.FC<ProgressSidebarProps> = ({ currentStep }) => {
  return (
    <div className="w-60 bg-background-secondary p-8 border-r border-border hidden md:block no-print">
      <ul>
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <li key={step.number} className="relative pl-8 pb-8">
              <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${isActive || isCompleted ? 'border-accent bg-accent' : 'border-border'}`} />
              {index < steps.length - 1 && (
                <div className="absolute left-[7px] top-5 h-full w-0.5 bg-border">
                  <div 
                    className="w-full bg-accent transition-all duration-300" 
                    style={{ height: isCompleted ? '100%' : '0%' }} 
                  />
                </div>
              )}
              <p className={`font-bold ${isActive || isCompleted ? 'text-text-primary' : 'text-text-secondary'}`}>
                STEP {step.number}
              </p>
              <p className={`text-sm ${isActive || isCompleted ? 'text-text-secondary' : 'text-gray-500'}`}>
                {step.title}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProgressSidebar;
