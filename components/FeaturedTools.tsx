"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TITLES = [
  "voltage high",
  "top of the stack",
  "hot off the bus",
  "currently running",
  "featured.exe",
  "in the queue",
  "ready to execute",
];

const ALL_TOOLS = [
  {
    href: "/tools/resistor",
    label: "resistor decoder",
    desc: "color band → resistance value",
    category: "electronics",
    tag: "decode",
  },
  {
    href: "/tools/ohms-law",
    label: "ohm's law",
    desc: "V, I, R, P solver + LED resistor",
    category: "electronics",
    tag: "calc",
  },
  {
    href: "/tools/wire-gauge",
    label: "wire gauge reference",
    desc: "AWG ↔ mm², ampacity, resistance",
    category: "electronics",
    tag: "ref",
  },
  {
    href: "/tools/capacitor",
    label: "capacitor decoder",
    desc: "capacitor code → value",
    category: "electronics",
    tag: "decode",
  },
  {
    href: "/tools/markov",
    label: "markov generator",
    desc: "generate text from any corpus",
    category: "generative text",
    tag: "gen",
  },
  {
    href: "/tools/cutup",
    label: "cut-up machine",
    desc: "burroughs-style text reassembly",
    category: "generative text",
    tag: "gen",
  },
  {
    href: "/tools/glitch-text",
    label: "glitch text",
    desc: "zalgo, wide, morse, binary & more",
    category: "generative text",
    tag: "gen",
  },
  {
    href: "/tools/zine-filler",
    label: "zine filler",
    desc: "placeholder text in 5 flavors",
    category: "generative text",
    tag: "gen",
  },
  {
    href: "/tools/ascii",
    label: "ascii generator",
    desc: "big text, image → ascii, patterns",
    category: "generative text",
    tag: "gen",
  },
  {
    href: "/tools/palette",
    label: "color palette",
    desc: "harmonious palettes from any seed color",
    category: "color & design",
    tag: "gen",
  },
  {
    href: "/tools/color-converter",
    label: "color converter",
    desc: "hex ↔ rgb ↔ hsl ↔ oklch",
    category: "color & design",
    tag: "convert",
  },
  {
    href: "/tools/hex-name",
    label: "hex color namer",
    desc: "give any hex a poetic name",
    category: "color & design",
    tag: "decode",
  },
  {
    href: "/tools/color-cheatsheet",
    label: "color cheatsheet",
    desc: "css, tailwind, material, pastel & more",
    category: "color & design",
    tag: "ref",
  },
  {
    href: "/tools/accessibility",
    label: "accessibility checker",
    desc: "contrast, color blindness & more",
    category: "color & design",
    tag: "test",
  },
  {
    href: "/tools/zine-imposer",
    label: "zine imposer",
    desc: "8-page mini-zine fold layout",
    category: "print & zine",
    tag: "plan",
  },
  {
    href: "/tools/unit-converter",
    label: "unit converter",
    desc: "length, weight, temp, fabric, wire & more",
    category: "measurements",
    tag: "convert",
  },
  {
    href: "/tools/code-identifier",
    label: "code identifier",
    desc: "detect programming language from a snippet",
    category: "code & dev",
    tag: "decode",
  },
  {
    href: "/tools/binary-converter",
    label: "binary / hex",
    desc: "text & numbers → binary, hex, octal",
    category: "code & dev",
    tag: "convert",
  },
  {
    href: "/tools/regex-tester",
    label: "regex tester",
    desc: "test regex patterns live",
    category: "code & dev",
    tag: "test",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FeaturedTools() {
  const [title, setTitle] = useState("voltage high");
  const [featured, setFeatured] = useState(ALL_TOOLS.slice(0, 3));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTitle(TITLES[Math.floor(Math.random() * TITLES.length)]);
    setFeatured(shuffle(ALL_TOOLS).slice(0, 3));
    setMounted(true);
  }, []);

  return (
    <div style={{ marginBottom: 48 }}>
      <div className="section-head" style={{ marginBottom: 16 }}>
        {mounted ? title : "voltage high"}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
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
                  style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}
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
  );
}
