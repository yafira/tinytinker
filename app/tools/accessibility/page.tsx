"use client";
import { useState, useCallback } from "react";
import ToolPage from "@/components/ToolPage";

// color utils

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function linearize(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagLevel(ratio: number): {
  aa: boolean;
  aaLarge: boolean;
  aaa: boolean;
  aaaLarge: boolean;
} {
  return {
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

// color blindness simulation

type CBType = "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

function simulateColorBlindness(
  r: number,
  g: number,
  b: number,
  type: CBType,
): [number, number, number] {
  const matrices: Record<CBType, number[][]> = {
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
    ],
  };
  const m = matrices[type];
  return [
    Math.round(
      Math.min(255, Math.max(0, m[0][0] * r + m[0][1] * g + m[0][2] * b)),
    ),
    Math.round(
      Math.min(255, Math.max(0, m[1][0] * r + m[1][1] * g + m[1][2] * b)),
    ),
    Math.round(
      Math.min(255, Math.max(0, m[2][0] * r + m[2][1] * g + m[2][2] * b)),
    ),
  ];
}

// readable text suggester

function suggestTextColor(
  r: number,
  g: number,
  b: number,
): { color: string; contrast: number; label: string }[] {
  const bgLum = relativeLuminance(r, g, b);
  const candidates = [
    { color: "#000000", label: "black" },
    { color: "#FFFFFF", label: "white" },
    { color: "#1a1917", label: "near black" },
    { color: "#2d1f3d", label: "deep purple" },
    { color: "#0f0820", label: "dark ink" },
    { color: "#f0eaff", label: "pale lavender" },
    { color: "#fdf8ff", label: "near white" },
  ];
  return candidates
    .map((c) => {
      const rgb = hexToRgb(c.color)!;
      const lum = relativeLuminance(...rgb);
      const ratio = contrastRatio(bgLum, lum);
      return { ...c, contrast: +ratio.toFixed(2) };
    })
    .sort((a, b) => b.contrast - a.contrast);
}

const CB_TYPES: { value: CBType; label: string; desc: string }[] = [
  {
    value: "protanopia",
    label: "protanopia",
    desc: "red-blind (~1% of males)",
  },
  {
    value: "deuteranopia",
    label: "deuteranopia",
    desc: "green-blind (~1% of males)",
  },
  { value: "tritanopia", label: "tritanopia", desc: "blue-blind (rare)" },
  {
    value: "achromatopsia",
    label: "achromatopsia",
    desc: "total color blindness (rare)",
  },
];

type Tab = "contrast" | "colorblind" | "readable";

const SWATCHES = [
  "#A855C8",
  "#6030A8",
  "#F8D8E8",
  "#C8B8E8",
  "#FF6B6B",
  "#FFC75F",
  "#A8E063",
  "#56CCF2",
  "#1A1917",
  "#888888",
  "#FFFFFF",
  "#0f0820",
];

export default function AccessibilityPage() {
  const [tab, setTab] = useState<Tab>("contrast");

  // contrast state
  const [fg, setFg] = useState("#FFFFFF");
  const [bg, setBg] = useState("#6030A8");

  // color blindness state
  const [cbColor, setCbColor] = useState("#A855C8");
  const [cbType, setCbType] = useState<CBType>("protanopia");

  // readable text state
  const [readableBg, setReadableBg] = useState("#C8B8E8");

  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  }, []);

  // contrast calculations
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  const contrastValid = fgRgb && bgRgb;
  const ratio = contrastValid
    ? +contrastRatio(
        relativeLuminance(...fgRgb!),
        relativeLuminance(...bgRgb!),
      ).toFixed(2)
    : 0;
  const wcag = wcagLevel(ratio);

  // color blindness
  const cbRgb = hexToRgb(cbColor);
  const cbSimulated = cbRgb ? simulateColorBlindness(...cbRgb, cbType) : null;
  const cbSimHex = cbSimulated ? rgbToHex(...cbSimulated) : null;

  // readable text
  const readableRgb = hexToRgb(readableBg);
  const suggestions = readableRgb ? suggestTextColor(...readableRgb) : [];

  const PassBadge = ({ pass }: { pass: boolean }) => (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 4,
        background: pass ? "rgba(45,122,79,0.1)" : "rgba(176,48,96,0.1)",
        color: pass ? "#2d7a4f" : "#b03060",
        border: `1px solid ${pass ? "rgba(45,122,79,0.3)" : "rgba(176,48,96,0.3)"}`,
        fontWeight: 500,
      }}
    >
      {pass ? "pass" : "fail"}
    </span>
  );

  return (
    <ToolPage
      title="accessibility checker"
      description="contrast checker, color blindness simulator, and readable text suggester."
      category="color & design"
    >
      {/* tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {(["contrast", "colorblind", "readable"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "btn btn-primary" : "btn btn-ghost"}
            style={{ fontSize: 12 }}
          >
            {t === "contrast"
              ? "contrast checker"
              : t === "colorblind"
                ? "color blindness"
                : "readable text"}
          </button>
        ))}
      </div>

      {/* contrast checker */}
      {tab === "contrast" && (
        <div>
          {/* color inputs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {[
              { label: "foreground (text)", value: fg, set: setFg, key: "fg" },
              { label: "background", value: bg, set: setBg, key: "bg" },
            ].map((field) => (
              <div key={field.key}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-ghost)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {field.label}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="color"
                    value={hexToRgb(field.value) ? field.value : "#000000"}
                    onChange={(e) => field.set(e.target.value.toUpperCase())}
                    style={{
                      width: 36,
                      height: 36,
                      padding: 2,
                      border: "1.5px solid var(--border)",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* preview */}
          {contrastValid && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                preview
              </div>
              <div
                style={{
                  background: bg,
                  borderRadius: 10,
                  padding: "24px",
                  border: "1.5px solid var(--border)",
                }}
              >
                <div
                  style={{
                    color: fg,
                    fontFamily: "var(--font-mono)",
                    fontSize: 24,
                    fontWeight: 400,
                    marginBottom: 8,
                  }}
                >
                  the quick brown fox
                </div>
                <div
                  style={{
                    color: fg,
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    opacity: 0.9,
                  }}
                >
                  small body text — does this read comfortably?
                </div>
                <div
                  style={{
                    color: fg,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    opacity: 0.75,
                    marginTop: 6,
                  }}
                >
                  tiny caption text — really pushing the limits here
                </div>
              </div>
            </div>
          )}

          {/* ratio + wcag */}
          {contrastValid && (
            <div>
              <div className="result-box" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--ink-ghost)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      contrast ratio
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 36,
                        fontWeight: 300,
                        color: "var(--ink)",
                      }}
                    >
                      {ratio}:1
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--ink-ghost)",
                        marginBottom: 4,
                      }}
                    >
                      min 4.5:1 for AA normal text
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--ink-ghost)",
                      }}
                    >
                      min 7:1 for AAA normal text
                    </div>
                  </div>
                </div>
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1.5px solid var(--border)" }}>
                    {["level", "requirement", "use case", "result"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "6px 10px",
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--ink-ghost)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          fontWeight: 500,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      level: "AA",
                      req: "4.5:1",
                      use: "normal text (< 18pt)",
                      pass: wcag.aa,
                    },
                    {
                      level: "AA Large",
                      req: "3:1",
                      use: "large text (≥ 18pt or 14pt bold)",
                      pass: wcag.aaLarge,
                    },
                    {
                      level: "AAA",
                      req: "7:1",
                      use: "normal text enhanced",
                      pass: wcag.aaa,
                    },
                    {
                      level: "AAA Large",
                      req: "4.5:1",
                      use: "large text enhanced",
                      pass: wcag.aaaLarge,
                    },
                  ].map((row, i) => (
                    <tr
                      key={row.level}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: i % 2 === 0 ? "var(--card)" : "transparent",
                      }}
                    >
                      <td
                        style={{
                          padding: "8px 10px",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 500,
                          fontSize: 13,
                          color: "var(--ink)",
                        }}
                      >
                        {row.level}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          fontFamily: "var(--font-mono)",
                          fontSize: 13,
                          color: "var(--ink-soft)",
                        }}
                      >
                        {row.req}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          fontSize: 12,
                          color: "var(--ink-muted)",
                        }}
                      >
                        {row.use}
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <PassBadge pass={row.pass} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* color blindness simulator */}
      {tab === "colorblind" && (
        <div>
          {/* input */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              color to simulate
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <input
                type="color"
                value={hexToRgb(cbColor) ? cbColor : "#a855c8"}
                onChange={(e) => setCbColor(e.target.value.toUpperCase())}
                style={{
                  width: 36,
                  height: 36,
                  padding: 2,
                  border: "1.5px solid var(--border)",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              />
              <input
                type="text"
                value={cbColor}
                onChange={(e) => setCbColor(e.target.value)}
                style={{
                  maxWidth: 160,
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                }}
              />
            </div>
            {/* swatches */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SWATCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => setCbColor(s)}
                  style={{
                    width: 24,
                    height: 24,
                    background: s,
                    border:
                      cbColor.toUpperCase() === s
                        ? "2px solid var(--accent)"
                        : "1.5px solid var(--border)",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          {/* type selector */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              type
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {CB_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setCbType(t.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    background:
                      cbType === t.value
                        ? "rgba(96,48,168,0.08)"
                        : "var(--card)",
                    border: `1.5px solid ${cbType === t.value ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.12s",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      fontWeight: 500,
                      color:
                        cbType === t.value ? "var(--accent)" : "var(--ink)",
                      minWidth: 120,
                    }}
                  >
                    {t.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--ink-ghost)",
                    }}
                  >
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* result */}
          {cbRgb && cbSimulated && cbSimHex && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div style={{ height: 80, background: cbColor }} />
                <div style={{ padding: "12px 14px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--ink-ghost)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    original
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      color: "var(--ink)",
                    }}
                  >
                    {cbColor}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--ink-ghost)",
                      marginTop: 2,
                    }}
                  >
                    rgb({cbRgb.join(", ")})
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div style={{ height: 80, background: cbSimHex }} />
                <div style={{ padding: "12px 14px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--ink-ghost)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    as seen with {cbType}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      color: "var(--ink)",
                    }}
                  >
                    {cbSimHex}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--ink-ghost)",
                      marginTop: 2,
                    }}
                  >
                    rgb({cbSimulated.join(", ")})
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* readable text suggester */}
      {tab === "readable" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              background color
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <input
                type="color"
                value={hexToRgb(readableBg) ? readableBg : "#c8b8e8"}
                onChange={(e) => setReadableBg(e.target.value.toUpperCase())}
                style={{
                  width: 36,
                  height: 36,
                  padding: 2,
                  border: "1.5px solid var(--border)",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              />
              <input
                type="text"
                value={readableBg}
                onChange={(e) => setReadableBg(e.target.value)}
                style={{
                  maxWidth: 160,
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SWATCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => setReadableBg(s)}
                  style={{
                    width: 24,
                    height: 24,
                    background: s,
                    border:
                      readableBg.toUpperCase() === s
                        ? "2px solid var(--accent)"
                        : "1.5px solid var(--border)",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          {readableRgb && suggestions.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                text color suggestions — sorted by contrast
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {suggestions.map((s, i) => {
                  const level = wcagLevel(s.contrast);
                  return (
                    <div
                      key={s.color}
                      style={{
                        background: readableBg,
                        border: `1.5px solid ${i === 0 ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: 10,
                        padding: "14px 16px",
                        cursor: "pointer",
                        transition: "all 0.12s",
                      }}
                      onClick={() => copy(s.color, s.color)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            background: s.color,
                            borderRadius: 4,
                            border: "1px solid rgba(0,0,0,0.1)",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            color: s.color,
                            fontWeight: 500,
                          }}
                        >
                          {s.label} — {s.color}
                        </span>
                        <span
                          style={{
                            marginLeft: "auto",
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: s.color,
                            opacity: 0.7,
                          }}
                        >
                          {s.contrast}:1
                        </span>
                        {copied === s.color && (
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 11,
                              color: "var(--accent)",
                            }}
                          >
                            copied ✦
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          color: s.color,
                          fontFamily: "var(--font-mono)",
                          fontSize: 15,
                          marginBottom: 4,
                        }}
                      >
                        the quick brown fox jumps over the lazy dog
                      </div>
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        <PassBadge pass={level.aa} />
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--ink-ghost)",
                          }}
                        >
                          AA
                        </span>
                        <PassBadge pass={level.aaa} />
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--ink-ghost)",
                          }}
                        >
                          AAA
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolPage>
  );
}
