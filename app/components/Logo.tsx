interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Modern rounded square background */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="8"
        fill="url(#logoGradient)"
      />

      {/* Simple bird silhouette - Twitter-style */}
      <path
        d="M28 14c-.8.4-1.6.6-2.5.7.9-.5 1.6-1.4 1.9-2.4-.8.5-1.8.9-2.8 1-1.6-1.8-4.4-1.9-6.2-.3-1.2 1.1-1.7 2.8-1.3 4.4-3.7-.2-7.1-1.9-9.3-4.7-1.2 2.1-.6 4.8 1.5 6.2-.7 0-1.4-.2-2-.6v.1c0 2.2 1.5 4 3.6 4.5-.7.2-1.4.2-2.1.1.6 1.9 2.4 3.2 4.4 3.2-1.7 1.3-3.8 2-6 2h-1c2.2 1.4 4.8 2.2 7.5 2.2 9 0 13.9-7.5 13.9-13.9v-.6c1-.7 1.8-1.6 2.5-2.6-.9.4-1.8.7-2.8.8z"
        fill="#ffffff"
      />

      {/* Banner rectangle in corner */}
      <g opacity="0.95">
        <rect
          x="6"
          y="28"
          width="12"
          height="8"
          rx="1.5"
          fill="#ffffff"
        />
        <line x1="8" y1="30.5" x2="13" y2="30.5" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="8" y1="32.5" x2="15" y2="32.5" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="8" y1="34.5" x2="11" y2="34.5" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* Gradient Definition */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoWithText({ size = 32, showText = true }: LogoProps & { showText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Logo size={size} />
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg text-foreground">XBanner</span>
          <span className="text-xs text-muted-foreground -mt-1">Builder</span>
        </div>
      )}
    </div>
  );
}