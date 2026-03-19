"use client";
import { useState } from "react";
import Link from "next/link";

type Tag =
  | "all"
  | "calc"
  | "gen"
  | "ref"
  | "decode"
  | "convert"
  | "test"
  | "plan"
  | "guide";

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

const ALL_TAGS: Tag[] = [
  "all",
  "calc",
  "gen",
  "ref",
  "decode",
  "convert",
  "test",
  "plan",
];

export default function ToolGrid() {
  const [active, setActive] = useState<Tag>("all");

  const filtered = allTools
    .map((section) => ({
      ...section,
      tools:
        active === "all"
          ? section.tools
          : section.tools.filter((t) => t.tag === active),
    }))
    .filter((section) => section.tools.length > 0);

  return (
    <div>
      {/* filter bar */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--ink-ghost)",
              marginRight: 4,
            }}
          >
            filter:
          </span>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag === active ? "all" : tag)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: tag === "all" ? 11 : 9,
                fontWeight: 500,
                letterSpacing: "0.08em",
                padding: tag === "all" ? "3px 10px" : "2px 8px",
                borderRadius: 4,
                border:
                  active === tag
                    ? "1.5px solid var(--border-hover)"
                    : "1.5px solid var(--border)",
                cursor: "pointer",
                transition: "all 0.12s",
                background:
                  active === tag ? "var(--card-hover)" : "transparent",
                color: active === tag ? "var(--ink)" : "var(--ink-ghost)",
              }}
              className={tag !== "all" ? `tag tag-${tag}` : ""}
            >
              {tag}
              {tag !== "all" && active === tag && (
                <span style={{ marginLeft: 4, opacity: 0.6 }}>✕</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* tool sections */}
      {filtered.map((section) => (
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

      {/* empty state */}
      {filtered.length === 0 && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--ink-ghost)",
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          no tools with tag "{active}" yet ✦
        </div>
      )}
    </div>
  );
}
