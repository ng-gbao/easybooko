import { Link } from "react-router-dom";

/**
 * Easybooko logo — premium travel/hotel mark.
 * Same component is used in the header and the footer to stay visually identical.
 *
 * Props:
 *  - tone: "light" keeps the brand text in the primary color (light surfaces).
 *          "dark" inverts the text to white-ish for dark backgrounds like the footer.
 */
export const Logo = ({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) => {
  const textClass =
    tone === "dark"
      ? "text-primary-foreground"
      : "text-primary";

  return (
    <Link
      to="/"
      className={`flex items-center gap-2.5 shrink-0 group ${className}`}
      aria-label="Easybooko — trang chủ"
    >
      <span
        className="relative inline-flex items-center justify-center h-10 w-10 rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-2deg]"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--ocean-aqua)) 100%)",
        }}
        aria-hidden="true"
      >
        {/* Soft inner glow */}
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 via-transparent to-white/25 pointer-events-none" />
        <svg
          viewBox="0 0 36 36"
          className="h-6 w-6 text-primary-foreground relative"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylised hotel silhouette */}
          <path d="M7 28V15l11-7 11 7v13" />
          <path d="M3 28h30" />
          {/* Door */}
          <path d="M16 28v-5h4v5" fill="currentColor" stroke="none" opacity="0.9" />
          {/* Windows */}
          <path d="M11 19h2M23 19h2" />
          {/* Location pin crown */}
          <path d="M18 4.5c2 0 3.4 1.5 3.4 3.4 0 2.2-3.4 4.6-3.4 4.6s-3.4-2.4-3.4-4.6c0-1.9 1.4-3.4 3.4-3.4z" fill="currentColor" stroke="none" opacity="0.95" />
          <circle cx="18" cy="7.9" r="1" fill="hsl(var(--primary))" stroke="none" />
        </svg>
      </span>
      <span className={`font-heading text-xl font-bold tracking-tight ${textClass}`}>
        Easybooko
      </span>
    </Link>
  );
};

export default Logo;
