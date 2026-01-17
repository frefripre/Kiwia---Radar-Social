import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
  variant?: 'default' | 'black';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 48, 
  withText = false,
  variant = 'default' 
}) => {
  const color = variant === 'default' ? '#A3E635' : '#000000';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(163,230,53,0.4)]"
      >
        {/* Outer Ring / Radar Wave */}
        <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2" strokeDasharray="8 4" opacity="0.3" />
        <circle cx="50" cy="50" r="35" stroke={color} strokeWidth="4" opacity="0.6" />
        
        {/* Kiwi Body */}
        <path 
          d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM50 75C36.215 75 25 63.785 25 50C25 36.215 36.215 25 50 25C63.785 25 75 36.215 75 50C75 63.785 63.785 75 50 75Z" 
          fill={color} 
        />
        
        {/* Inner Core */}
        <circle cx="50" cy="50" r="12" fill={color} />
        
        {/* "Seeds" / Data Points */}
        <circle cx="50" cy="35" r="3" fill="black" />
        <circle cx="61" cy="40" r="3" fill="black" />
        <circle cx="61" cy="60" r="3" fill="black" />
        <circle cx="50" cy="65" r="3" fill="black" />
        <circle cx="39" cy="60" r="3" fill="black" />
        <circle cx="39" cy="40" r="3" fill="black" />
      </svg>
      
      {withText && (
        <span 
          className="font-black italic tracking-tighter text-white"
          style={{ fontSize: size * 0.6 }}
        >
          KIWIA
        </span>
      )}
    </div>
  );
};