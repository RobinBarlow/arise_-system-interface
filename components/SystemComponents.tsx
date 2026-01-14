import React from 'react';

// A neon-bordered container
export const SystemPanel: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => {
  return (
    <div className={`relative bg-sys-black/80 border border-sys-blue/40 backdrop-blur-md p-4 rounded-sm shadow-neon ${className}`}>
      {title && (
        <div className="absolute -top-3 left-4 bg-sys-void px-2 border border-sys-blue/50 text-sys-blue text-xs font-bold tracking-widest uppercase">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

export const SystemButton: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'danger' | 'gold'; 
  disabled?: boolean;
  className?: string;
}> = ({ onClick, children, variant = 'primary', disabled = false, className = '' }) => {
  const baseStyles = "relative px-6 py-2 font-rajdhani font-bold uppercase tracking-wider transition-all duration-200 clip-path-slant";
  
  const variants = {
    primary: "bg-sys-blue/20 text-sys-blue border border-sys-blue hover:bg-sys-blue hover:text-white hover:shadow-neon",
    danger: "bg-sys-crimson/20 text-sys-crimson border border-sys-crimson hover:bg-sys-crimson hover:text-white hover:shadow-red-500/50",
    gold: "bg-sys-gold/10 text-sys-gold border border-sys-gold hover:bg-sys-gold hover:text-black hover:shadow-gold",
  };

  const disabledStyle = "opacity-50 cursor-not-allowed grayscale";

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyle : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const StatRow: React.FC<{ label: string; value: number; onIncrease?: () => void; canIncrease?: boolean }> = ({ label, value, onIncrease, canIncrease }) => (
  <div className="flex items-center justify-between py-2 border-b border-sys-blue/10 last:border-0">
    <span className="text-gray-400 font-bold tracking-widest text-sm">{label}</span>
    <div className="flex items-center gap-4">
      <span className="font-orbitron text-sys-text text-lg">{value}</span>
      {canIncrease && onIncrease && (
        <button 
          onClick={onIncrease}
          className="w-6 h-6 flex items-center justify-center border border-sys-blue text-sys-blue hover:bg-sys-blue hover:text-white transition-colors"
        >
          +
        </button>
      )}
    </div>
  </div>
);

export const ProgressBar: React.FC<{ current: number; max: number; color?: string }> = ({ current, max, color = "bg-sys-blue" }) => {
  const percent = Math.min((current / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-sys-black border border-white/10 relative overflow-hidden">
      <div 
        className={`h-full ${color} shadow-neon transition-all duration-500 ease-out`} 
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
