import Link from "next/link";

const featured = [
  {
    href: "/tools/resistor",
    label: "resistor decoder",
    desc: "read color bands, get resistance values & tolerances instantly.",
    category: "electronics",
    tag: "decode",
  },
  {
    href: "/tools/ascii",
    label: "ascii generator",
    desc: "big text, image to ascii, and pattern generator.",
    category: "generative text",
    tag: "gen",
  },
  {
    href: "/tools/accessibility",
    label: "accessibility checker",
    desc: "contrast, color blindness simulator & readable text suggester.",
    category: "color & design",
    tag: "test",
  },
];

const allTools = [
  {
    section: "electronics",
    tools: [
      {
        href: "/tools/resistor",
        label: "resistor decoder",
        desc: "color band → resistance value",
        tag: "decode",
      },
      {
        href: "/tools/ohms-law",
        label: "ohm's law",
        desc: "V, I, R, P solver + LED resistor",
        tag: "calc",
      },
      {
        href: "/tools/wire-gauge",
        label: "wire gauge reference",
        desc: "AWG ↔ mm², ampacity, resistance",
        tag: "ref",
      },
      {
        href: "/tools/capacitor",
        label: "capacitor decoder",
        desc: "capacitor code → value",
        tag: "decode",
      },
    ],
  },
  {
    section: "generative text",
    tools: [
      {
        href: "/tools/markov",
        label: "markov generator",
        desc: "generate text from any corpus",
        tag: "gen",
      },
      {
        href: "/tools/cutup",
        label: "cut-up machine",
        desc: "burroughs-style text reassembly",
        tag: "gen",
      },
      {
        href: "/tools/glitch-text",
        label: "glitch text",
        desc: "zalgo, wide, morse, binary & more",
        tag: "gen",
      },
      {
        href: "/tools/zine-filler",
        label: "zine filler",
        desc: "placeholder text in 5 flavors",
        tag: "gen",
      },
      {
        href: "/tools/ascii",
        label: "ascii generator",
        desc: "big text, image → ascii, patterns",
        tag: "gen",
      },
    ],
  },
  {
    section: "color & design",
    tools: [
      {
        href: "/tools/palette",
        label: "color palette",
        desc: "harmonious palettes from any seed color",
        tag: "gen",
      },
      {
        href: "/tools/color-converter",
        label: "color converter",
        desc: "hex ↔ rgb ↔ hsl ↔ oklch",
        tag: "convert",
      },
      {
        href: "/tools/hex-name",
        label: "hex color namer",
        desc: "give any hex a poetic name",
        tag: "decode",
      },
      {
        href: "/tools/color-cheatsheet",
        label: "color cheatsheet",
        desc: "css, tailwind, material, pastel & more",
        tag: "ref",
      },
      {
        href: "/tools/accessibility",
        label: "accessibility checker",
        desc: "contrast, color blindness & more",
        tag: "test",
      },
    ],
  },
  {
    section: "print & zine",
    tools: [
      {
        href: "/tools/zine-imposer",
        label: "zine imposer",
        desc: "8-page mini-zine fold layout",
        tag: "plan",
      },
    ],
  },
  {
    section: "measurements",
    tools: [
      {
        href: "/tools/unit-converter",
        label: "unit converter",
        desc: "length, weight, temp, fabric, wire & more",
        tag: "convert",
      },
    ],
  },
  {
    section: "code & dev",
    tools: [
      {
        href: "/tools/code-identifier",
        label: "code identifier",
        desc: "detect programming language from a snippet",
        tag: "decode",
      },
      {
        href: "/tools/binary-converter",
        label: "binary / hex",
        desc: "text & numbers → binary, hex, octal",
        tag: "convert",
      },
      {
        href: "/tools/regex-tester",
        label: "regex tester",
        desc: "test regex patterns live",
        tag: "test",
      },
    ],
  },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 40px" }}>
      {/* hero */}
      <div
        style={{
          marginBottom: 52,
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "var(--accent)",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 500,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 1,
                background: "var(--border-hover)",
              }}
            />
            tinytinker.tools
          </div>
          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 44,
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              marginBottom: 16,
            }}
          >
            a soft toolkit
            <br />
            <span
              style={{
                color: "var(--accent)",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              for curious makers.
            </span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--ink-muted)",
              maxWidth: 440,
              lineHeight: 1.8,
            }}
          >
            tiny, focused utilities for makers, engineers, artists,
            <br />
            crafters & tinkerers — without leaving your browser.
          </p>
        </div>

        {/* flower mascot */}
        <div style={{ flexShrink: 0 }}>
          <img
            src="/flower.png"
            alt="tinytinker flower mascot"
            className="mascot"
            style={{
              width: 220,
              height: 220,
              objectFit: "contain",
              borderRadius: "50%",
              opacity: 0.95,
              transition: "filter 0.2s",
            }}
          />
        </div>
      </div>

      {/* featured */}
      <div style={{ marginBottom: 48 }}>
        <div className="section-head" style={{ marginBottom: 16 }}>
          greatest hits
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {featured.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{ textDecoration: "none" }}
            >
              <div className="feat-card" style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: "var(--ink)",
                    }}
                  >
                    {tool.label}
                  </div>
                  <span className={`tag tag-${tool.tag}`}>{tool.tag}</span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {tool.desc}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--ink-ghost)",
                    marginTop: 14,
                    letterSpacing: "0.08em",
                  }}
                >
                  {tool.category}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* all tools */}
      {allTools.map((section) => (
        <div key={section.section} style={{ marginBottom: 40 }}>
          <div className="section-head">{section.section}</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: 10,
            }}
          >
            {section.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{ textDecoration: "none" }}
              >
                <div className="tool-card" style={{ padding: "16px 18px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "var(--ink)",
                      }}
                    >
                      {tool.label}
                    </div>
                    <span className={`tag tag-${tool.tag}`}>{tool.tag}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                    {tool.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
