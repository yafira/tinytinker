"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  {
    label: "Electronics",
    items: [
      { href: "/tools/resistor", label: "Resistor decoder", badge: "popular" },
      { href: "/tools/ohms-law", label: "Ohm's law calc" },
      { href: "/tools/wire-gauge", label: "Wire gauge ref" },
    ],
  },
  {
    label: "Generators",
    items: [{ href: "/tools/palette", label: "Color palette gen" }],
  },
  {
    label: "Print & Zine",
    items: [
      { href: "/tools/zine-imposer", label: "Zine imposer", badge: "new" },
    ],
  },
  {
    label: "Measurements",
    items: [{ href: "/tools/unit-converter", label: "Unit converter" }],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  return (
    <html lang="en">
      <head>
        <title>tinytinker.tools</title>
        <meta
          name="description"
          content="A handmade toolbox for makers, artists, engineers & tinkerers."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙</text></svg>"
        />
      </head>
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <aside
            style={{
              width: 210,
              flexShrink: 0,
              borderRight: "1px solid #dbd7ce",
              background: "#f5f3ee",
              display: "flex",
              flexDirection: "column",
              position: "sticky",
              top: 0,
              height: "100vh",
              overflowY: "auto",
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "block",
                padding: "22px 18px 18px",
                borderBottom: "1px solid #dbd7ce",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  fontWeight: 300,
                  color: "#1a1917",
                  letterSpacing: "-0.01em",
                }}
              >
                tinytinker<span style={{ color: "#e84c1e" }}>.</span>tools
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "#7a7870",
                  marginTop: 3,
                  letterSpacing: "0.06em",
                }}
              >
                HANDMADE TOOLBOX
              </div>
            </Link>

            <nav style={{ flex: 1, padding: "14px 10px" }}>
              {nav.map((section) => (
                <div key={section.label} style={{ marginBottom: 20 }}>
                  <div
                    className="section-label"
                    style={{ padding: "0 8px", marginBottom: 6 }}
                  >
                    {section.label}
                  </div>
                  {section.items.map((item) => {
                    const active = path === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={active ? "nav-link-active" : ""}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "5px 8px",
                          fontSize: 13,
                          color: active ? "#e84c1e" : "#3d3b35",
                          textDecoration: "none",
                          borderRadius: 4,
                          transition: "all 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            (e.currentTarget as HTMLElement).style.background =
                              "#ede9e0";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                          }
                        }}
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className={`badge badge-${item.badge}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div
              style={{ padding: "14px 18px", borderTop: "1px solid #dbd7ce" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "#b8b6b0",
                  lineHeight: 1.7,
                }}
              >
                No logins. No tracking.
                <br />
                Long live the handmade web.
              </div>
            </div>
          </aside>

          <main style={{ flex: 1, minWidth: 0, background: "#f5f3ee" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
