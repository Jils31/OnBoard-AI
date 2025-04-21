
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/lovable-uploads/41ffbde3-a1c5-43db-b1e8-60ec48943376.png" 
        alt="Onboarding Buddy Logo" 
        className="h-8 w-8"
      />
      <span className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
        Onboarding Buddy
      </span>
    </div>
  );
};

export default Logo;
