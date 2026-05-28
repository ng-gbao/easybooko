import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 shrink-0 group ${className}`}>
    <span
      className="relative inline-flex items-center justify-center h-9 w-9 rounded-xl shadow-md transition-transform group-hover:scale-105"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent, var(--primary))) 100%)",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-5 w-5 text-primary-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Building base */}
        <path d="M7 27V14l9-6 9 6v13" />
        <path d="M3 27h26" />
        {/* Windows */}
        <path d="M12 18h2M18 18h2M12 22h2M18 22h2" />
        {/* Location pin on top */}
        <circle cx="16" cy="6" r="2.2" fill="currentColor" stroke="none" opacity="0.95" />
      </svg>
    </span>
    <span className="font-heading text-xl font-bold text-primary tracking-tight">
      Easybooko
    </span>
  </Link>
);

export default Logo;
