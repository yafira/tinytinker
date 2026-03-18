"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  {
    label: "electronics",
    items: [
      { href: "/tools/resistor", label: "resistor decoder", tag: "decode" },
      { href: "/tools/ohms-law", label: "ohm's law", tag: "calc" },
      { href: "/tools/wire-gauge", label: "wire gauge ref", tag: "ref" },
      { href: "/tools/capacitor", label: "capacitor decoder", tag: "decode" },
    ],
  },
  {
    label: "generative text",
    items: [
      { href: "/tools/markov", label: "markov generator", tag: "gen" },
      { href: "/tools/cutup", label: "cut-up machine", tag: "gen" },
      { href: "/tools/glitch-text", label: "glitch text", tag: "gen" },
      { href: "/tools/zine-filler", label: "zine filler", tag: "gen" },
      { href: "/tools/ascii", label: "ascii generator", tag: "gen" },
    ],
  },
  {
    label: "color & design",
    items: [
      { href: "/tools/palette", label: "color palette", tag: "gen" },
      {
        href: "/tools/color-converter",
        label: "color converter",
        tag: "convert",
      },
      { href: "/tools/hex-name", label: "hex color namer", tag: "decode" },
      {
        href: "/tools/color-cheatsheet",
        label: "color cheatsheet",
        tag: "ref",
      },
      {
        href: "/tools/accessibility",
        label: "accessibility checker",
        tag: "test",
      },
    ],
  },
  {
    label: "print & zine",
    items: [
      { href: "/tools/zine-imposer", label: "zine imposer", tag: "plan" },
    ],
  },
  {
    label: "measurements",
    items: [
      {
        href: "/tools/unit-converter",
        label: "unit converter",
        tag: "convert",
      },
    ],
  },
  {
    label: "code & dev",
    items: [
      {
        href: "/tools/code-identifier",
        label: "code identifier",
        tag: "decode",
      },
      {
        href: "/tools/binary-converter",
        label: "binary / hex",
        tag: "convert",
      },
      { href: "/tools/regex-tester", label: "regex tester", tag: "test" },
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

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
    localStorage.setItem("theme", next ? "dark" : "light");
  };

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
          {/* sidebar */}
          <aside
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
            {/* logo */}
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "block",
                padding: "20px 16px 16px",
                borderBottom: "1.5px solid var(--border)",
              }}
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
            <nav style={{ flex: 1, padding: "12px 8px" }}>
              {nav.map((section) => (
                <div key={section.label} style={{ marginBottom: 18 }}>
                  {/* section label */}
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

                  {/* nav links */}
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
                        <span>{item.label}</span>
                        <span className={`tag tag-${item.tag}`}>
                          {item.tag}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* footer */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1.5px solid var(--border)",
              }}
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
          </aside>

          {/* main content */}
          <main
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
          style={{ position: "fixed", top: 16, right: 20, zIndex: 100 }}
        >
          {dark ? "☀︎" : "☽"}
        </button>
      </body>
    </html>
  );
}
