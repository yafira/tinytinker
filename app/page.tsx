import Link from "next/link";

const featured = [
  {
    href: "/tools/resistor",
    label: "Resistor decoder",
    desc: "Read color bands, get resistance values + tolerances instantly.",
    badge: "popular",
    category: "Electronics",
  },
  {
    href: "/tools/ohms-law",
    label: "Ohm's law calc",
    desc: "Solve for V, I, R, or P — includes LED resistor calculator.",
    category: "Electronics",
  },
  {
    href: "/tools/palette",
    label: "Color palette gen",
    desc: "Generate harmonious palettes from a seed color.",
    category: "Generators",
  },
];

const allTools = [
  {
    section: "Electronics & Circuits",
    tools: [
      {
        href: "/tools/resistor",
        label: "Resistor decoder",
        desc: "Color band → resistance value",
        badge: "popular",
      },
      {
        href: "/tools/ohms-law",
        label: "Ohm's law / LED calc",
        desc: "V, I, R, P solver + LED resistor",
      },
      {
        href: "/tools/wire-gauge",
        label: "Wire gauge reference",
        desc: "AWG ↔ mm², ampacity, resistance",
      },
    ],
  },
  {
    section: "Generators",
    tools: [
      {
        href: "/tools/palette",
        label: "Color palette gen",
        desc: "Harmonious palettes from any seed color",
      },
    ],
  },
  {
    section: "Print & Zine",
    tools: [
      {
        href: "/tools/zine-imposer",
        label: "Zine imposer",
        desc: "8-page mini-zine fold layout",
        badge: "new",
      },
    ],
  },
  {
    section: "Measurements",
    tools: [
      {
        href: "/tools/unit-converter",
        label: "Unit converter",
        desc: "Length, weight, temp, fabric, wire & more",
      },
    ],
  },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 40px" }}>
      <div style={{ marginBottom: 52 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 42,
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#1a1917",
            marginBottom: 14,
          }}
        >
          A toolbox for people
          <br />
          <span style={{ color: "#e84c1e", fontStyle: "italic" }}>
            who make things.
          </span>
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#7a7870",
            maxWidth: 480,
            lineHeight: 1.65,
          }}
        >
          Small, focused utilities for makers, engineers, artists, crafters
          &amp; tinkerers. No logins. No tracking. Everything runs in your
          browser.
        </p>
      </div>

      <div style={{ marginBottom: 52 }}>
        <div className="section-label" style={{ marginBottom: 14 }}>
          Greatest hits
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {featured.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{ textDecoration: "none" }}
            >
              <div
                className="tool-card"
                style={{
                  background: "white",
                  border: "1px solid #dbd7ce",
                  borderRadius: 10,
                  padding: "18px 18px 16px",
                  cursor: "pointer",
                }}
              >
                {tool.badge && (
                  <span
                    className={`badge badge-${tool.badge}`}
                    style={{ marginBottom: 10, display: "inline-block" }}
                  >
                    {tool.badge}
                  </span>
                )}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 300,
                    marginBottom: 6,
                    color: "#1a1917",
                  }}
                >
                  {tool.label}
                </div>
                <div
                  style={{ fontSize: 12, color: "#7a7870", lineHeight: 1.55 }}
                >
                  {tool.desc}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "#b8b6b0",
                    marginTop: 10,
                    letterSpacing: "0.06em",
                  }}
                >
                  {tool.category}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {allTools.map((section) => (
        <div key={section.section} style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ marginBottom: 14 }}>
            {section.section}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 10,
            }}
          >
            {section.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="tool-card"
                  style={{
                    background: "white",
                    border: "1px solid #dbd7ce",
                    borderRadius: 7,
                    padding: "13px 14px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#1a1917",
                      }}
                    >
                      {tool.label}
                    </span>
                    {tool.badge && (
                      <span className={`badge badge-${tool.badge}`}>
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: "#7a7870" }}>
                    {tool.desc}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: 64,
          paddingTop: 24,
          borderTop: "1px solid #dbd7ce",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#b8b6b0",
            letterSpacing: "0.04em",
          }}
        >
          tinytinker.tools — made with curiosity. no logins. no ads. long live
          the handmade web.
        </p>
      </div>
    </div>
  );
}
