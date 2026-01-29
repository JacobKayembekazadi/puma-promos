
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary focus:ring-accent disabled:opacity-50 disabled:pointer-events-none";

    const variantClasses = {
      primary: "bg-accent text-text-dark hover:bg-accent-hover px-6 py-3",
      outline: "border-2 border-accent text-accent hover:bg-accent/10 px-6 py-3",
      ghost: "text-text-secondary hover:bg-accent/10 px-4 py-2",
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
