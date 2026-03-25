import Link from "next/link";

interface ToolPageProps {
  title: string;
  description: string;
  category: string;
  children: React.ReactNode;
}

export default function ToolPage({
  title,
  description,
  category,
  children,
}: ToolPageProps) {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "clamp(20px, 4vw, 40px)",
      }}
    >
      {/* breadcrumb */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink-ghost)",
          marginBottom: 24,
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Link
          href="/"
          style={{ color: "var(--ink-ghost)", textDecoration: "none" }}
        >
          tinytinker.tools
        </Link>
        <span style={{ color: "var(--accent-soft)" }}>✦</span>
        <span style={{ color: "var(--ink-muted)" }}>{category}</span>
        <span style={{ color: "var(--accent-soft)" }}>✦</span>
        <span style={{ color: "var(--ink-soft)" }}>{title}</span>
      </div>

      {/* header */}
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 28,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            marginBottom: 8,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.7 }}>
          {description}
        </p>
      </div>

      {/* tool content */}
      {children}
    </div>
  );
}
