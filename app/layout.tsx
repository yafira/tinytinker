"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  {
    label: "electronics",
    items: [
      { href: "/tools/resistor", label: "resistor decoder" },
      { href: "/tools/ohms-law", label: "ohm's law" },
      { href: "/tools/wire-gauge", label: "wire gauge ref" },
      { href: "/tools/capacitor", label: "capacitor decoder" },
      { href: "/tools/555-timer", label: "555 timer" },
      { href: "/tools/voltage-divider", label: "voltage divider" },
    ],
  },
  {
    label: "generative text",
    items: [
      { href: "/tools/markov", label: "markov generator" },
      { href: "/tools/cutup", label: "cut-up machine" },
      { href: "/tools/glitch-text", label: "glitch text" },
      { href: "/tools/zine-filler", label: "zine filler" },
      { href: "/tools/ascii", label: "ascii generator" },
    ],
  },
  {
    label: "color & design",
    items: [
      { href: "/tools/palette", label: "color palette" },
      { href: "/tools/color-converter", label: "color converter" },
      { href: "/tools/hex-name", label: "hex color namer" },
      { href: "/tools/color-cheatsheet", label: "color cheatsheet" },
      { href: "/tools/accessibility", label: "accessibility checker" },
    ],
  },
  {
    label: "print & zine",
    items: [{ href: "/tools/zine-imposer", label: "zine imposer" }],
  },
  {
    label: "measurements",
    items: [{ href: "/tools/unit-converter", label: "unit converter" }],
  },
  {
    label: "code & dev",
    items: [
      { href: "/tools/code-identifier", label: "code identifier" },
      { href: "/tools/binary-converter", label: "binary / hex" },
      { href: "/tools/regex-tester", label: "regex tester" },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  /* close menu on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  /* prevent body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const SidebarContent = () => (
    <>
      {/* logo */}
      <Link
        href="/"
        style={{
          textDecoration: "none",
          display: "block",
          padding: "20px 16px 16px",
          borderBottom: "1.5px solid var(--border)",
        }}
        onClick={() => setMenuOpen(false)}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 15,
            fontWeight: 500,
            color: "var(--ink)",
            letterSpacing: "-0.02em",
          }}
        >
          tinytinker<span style={{ color: "var(--accent)" }}>✦</span>tools
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-soft)",
            marginTop: 3,
            letterSpacing: "0.1em",
          }}
        >
          handmade web tools
        </div>
      </Link>

      {/* nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {nav.map((section) => (
          <div key={section.label} style={{ marginBottom: 18 }}>
            <div
              className="nav-section-label"
              style={{
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "3px 8px",
                marginBottom: 5,
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 500,
              }}
            >
              <span style={{ color: "#f59e0b", fontSize: 8 }}>✦</span>
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
                    display: "block",
                    padding: "5px 8px",
                    fontSize: 13,
                    color: active ? "var(--ink)" : "var(--ink-soft)",
                    textDecoration: "none",
                    borderRadius: 5,
                    transition: "all 0.1s",
                    fontWeight: active ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--nav-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* footer */}
      <div
        style={{ padding: "12px 16px", borderTop: "1.5px solid var(--border)" }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-soft)",
            lineHeight: 2,
            letterSpacing: "0.04em",
          }}
        >
          no logins. no tracking.
          <br />
          handmade web tools.
        </div>
      </div>
    </>
  );

  return (
    <html lang="en">
      <head>
        <title>tinytinker.tools</title>
        <meta name="description" content="a soft toolkit for curious makers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>"
        />
      </head>
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* desktop sidebar */}
          <aside
            className="sidebar-desktop"
            style={{
              width: 230,
              flexShrink: 0,
              borderRight: "1.5px solid var(--border)",
              background: "var(--bg-sidebar)",
              display: "flex",
              flexDirection: "column",
              position: "sticky",
              top: 0,
              height: "100vh",
              overflowY: "auto",
              transition: "background 0.2s, border-color 0.2s",
            }}
          >
            <SidebarContent />
          </aside>

          {/* mobile header */}
          <div
            className="mobile-header"
            style={{
              display: "none",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 56,
              background: "var(--bg-sidebar)",
              borderBottom: "1.5px solid var(--border)",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              zIndex: 90,
              transition: "background 0.2s",
            }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--ink)",
                }}
              >
                tinytinker<span style={{ color: "var(--accent)" }}>✦</span>tools
              </div>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "1.5px solid var(--border)",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--ink-soft)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {menuOpen ? "✕" : "☰"} menu
            </button>
          </div>

          {/* mobile menu overlay */}
          {menuOpen && (
            <div
              className="mobile-overlay"
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 95,
              }}
            />
          )}

          {/* mobile sidebar drawer */}
          <aside
            className="sidebar-mobile"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 280,
              height: "100vh",
              background: "var(--bg-sidebar)",
              borderRight: "1.5px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              zIndex: 100,
              transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.25s ease",
              overflowY: "auto",
            }}
          >
            <SidebarContent />
          </aside>

          {/* main content */}
          <main
            className="main-content"
            style={{
              flex: 1,
              minWidth: 0,
              background: "var(--bg)",
              transition: "background 0.2s",
            }}
          >
            {children}
          </main>
        </div>

        {/* fixed dark mode toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={dark ? "switch to light" : "switch to dark"}
          style={{ position: "fixed", top: 16, right: 20, zIndex: 101 }}
        >
          {dark ? "☀︎" : "☽"}
        </button>
      </body>
    </html>
  );
}
