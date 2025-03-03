import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'blue' | 'gray' | 'white';
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className = '',
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-300',
    white: 'border-white',
  };

  return (
    <div className={`${className}`}>
      <div 
        className={`
          animate-spin 
          rounded-full 
          border-t-2 
          border-b-2 
          ${colorClasses[color]} 
          ${sizeClasses[size]}
        `}
      ></div>
    </div>
  );
};

export default Spinner;