import React from 'react';

interface LogoProps {
    className?: string;
    variant?: 'default' | 'white' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'default' }) => {
    const isWhite = variant === 'white';
    const isLarge = variant === 'large';

    return (
        <div className={`flex flex-col -space-y-1 ${className}`}>
            <span className={`
        ${isLarge ? 'text-3xl' : 'text-xl'} 
        font-black tracking-tighter uppercase leading-none
        ${isWhite ? 'text-white' : 'text-gray-900'}
      `}>
                Yustech Logic
            </span>
            <span className={`
        ${isLarge ? 'text-sm mt-1' : 'text-[11px]'} 
        font-black tracking-widest uppercase leading-none
        text-brand-primary
      `}>
                System Services
            </span>
        </div>
    );
};

export default Logo;
