"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

function decodeCapacitor(code: string): {
  value: string;
  valueF: string;
  valuePF: string;
  tolerance: string;
  notes: string;
} | null {
  const c = code.trim().toUpperCase();

  // handle direct values like "100pF", "10nF", "1uF"
  const directMatch = c.match(/^(\d+\.?\d*)\s*(PF|NF|UF|MF)$/i);
  if (directMatch) {
    const num = parseFloat(directMatch[1]);
    const unit = directMatch[2].toUpperCase();
    let pf = num;
    if (unit === "NF") pf = num * 1000;
    if (unit === "UF") pf = num * 1_000_000;
    if (unit === "MF") pf = num * 1_000_000_000;
    return {
      value: formatValue(pf),
      valueF: formatFarads(pf),
      valuePF: `${pf} pF`,
      tolerance: "—",
      notes: "direct value input",
    };
  }

  // 2-digit code (e.g. "47" = 47pF)
  if (/^\d{2}$/.test(c)) {
    const pf = parseInt(c);
    return {
      value: formatValue(pf),
      valueF: formatFarads(pf),
      valuePF: `${pf} pF`,
      tolerance: "—",
      notes: "2-digit code — direct pF value",
    };
  }

  // 3-digit code (e.g. "104" = 100,000 pF = 100 nF)
  const threeDigit = c.match(/^(\d{2})(\d)([A-Z]?)$/);
  if (threeDigit) {
    const base = parseInt(threeDigit[1]);
    const exp = parseInt(threeDigit[2]);
    const tolCode = threeDigit[3];
    const pf = base * Math.pow(10, exp);
    return {
      value: formatValue(pf),
      valueF: formatFarads(pf),
      valuePF: `${pf} pF`,
      tolerance: TOLERANCE_CODES[tolCode] || "—",
      notes: `${base} × 10^${exp} pF`,
    };
  }

  // 4-digit code with tolerance (e.g. "104K")
  const fourDigit = c.match(/^(\d{3})([A-Z])$/);
  if (fourDigit) {
    const base = parseInt(fourDigit[1].slice(0, 2));
    const exp = parseInt(fourDigit[1][2]);
    const tolCode = fourDigit[2];
    const pf = base * Math.pow(10, exp);
    return {
      value: formatValue(pf),
      valueF: formatFarads(pf),
      valuePF: `${pf} pF`,
      tolerance: TOLERANCE_CODES[tolCode] || "—",
      notes: `${base} × 10^${exp} pF`,
    };
  }

  // EIA-198 letter code (e.g. "n47" = 0.47 nF, "4n7" = 4.7 nF)
  const letterCode = c.match(/^(\d*)(P|N|U|M)(\d+)$/i);
  if (letterCode) {
    const before = letterCode[1] || "0";
    const unit = letterCode[2].toUpperCase();
    const after = letterCode[3];
    const num = parseFloat(`${before}.${after}`);
    let pf = num;
    if (unit === "N") pf = num * 1000;
    if (unit === "U") pf = num * 1_000_000;
    if (unit === "M") pf = num * 1_000_000_000;
    return {
      value: formatValue(pf),
      valueF: formatFarads(pf),
      valuePF: `${pf} pF`,
      tolerance: "—",
      notes: `EIA-198 letter code`,
    };
  }

  return null;
}

const TOLERANCE_CODES: Record<string, string> = {
  B: "±0.1 pF",
  C: "±0.25 pF",
  D: "±0.5 pF",
  E: "±0.5%",
  F: "±1%",
  G: "±2%",
  H: "±3%",
  J: "±5%",
  K: "±10%",
  L: "±15%",
  M: "±20%",
  N: "±30%",
  P: "+100% / -0%",
  S: "+50% / -20%",
  W: "+/-0.05 pF",
  X: "+40% / -20%",
  Z: "+80% / -20%",
};

function formatValue(pf: number): string {
  if (pf >= 1_000_000) return `${+(pf / 1_000_000).toPrecision(4)} µF`;
  if (pf >= 1_000) return `${+(pf / 1_000).toPrecision(4)} nF`;
  return `${+pf.toPrecision(4)} pF`;
}

function formatFarads(pf: number): string {
  const f = pf * 1e-12;
  if (f >= 1) return `${f} F`;
  if (f >= 1e-3) return `${+(f * 1e3).toPrecision(4)} mF`;
  if (f >= 1e-6) return `${+(f * 1e6).toPrecision(4)} µF`;
  if (f >= 1e-9) return `${+(f * 1e9).toPrecision(4)} nF`;
  if (f >= 1e-12) return `${+(f * 1e12).toPrecision(4)} pF`;
  return `${f} F`;
}

const EXAMPLES = [
  { code: "104", label: "104 (ceramic)" },
  { code: "472", label: "472 (ceramic)" },
  { code: "103K", label: "103K (±10%)" },
  { code: "47", label: "47 (direct pF)" },
  { code: "4n7", label: "4n7 (EIA)" },
  { code: "100nF", label: "100nF" },
];

const COMMON: { code: string; value: string; use: string }[] = [
  { code: "100", value: "10 pF", use: "RF decoupling, timing" },
  { code: "101", value: "100 pF", use: "RF, high freq filtering" },
  { code: "102", value: "1 nF", use: "signal coupling" },
  { code: "103", value: "10 nF", use: "decoupling, filtering" },
  { code: "104", value: "100 nF", use: "power supply decoupling" },
  { code: "105", value: "1 µF", use: "audio coupling, filtering" },
  { code: "224", value: "220 nF", use: "general purpose" },
  { code: "474", value: "470 nF", use: "power filtering" },
  { code: "475", value: "4.7 µF", use: "bulk decoupling" },
  { code: "106", value: "10 µF", use: "power supply filtering" },
];

export default function CapacitorPage() {
  const [input, setInput] = useState("");
  const result = input.trim() ? decodeCapacitor(input) : null;

  return (
    <ToolPage
      title="capacitor decoder"
      description="decode capacitor codes to values. supports 2-digit, 3-digit, EIA-198 letter codes, and direct values."
      category="electronics"
    >
      {/* examples */}
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
          examples
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.code}
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => setInput(ex.code)}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* input */}
      <div style={{ marginBottom: 28 }}>
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
          capacitor code
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 104, 472K, 4n7, 100nF…"
          style={{ maxWidth: 320, fontSize: 16 }}
        />
      </div>

      {/* result */}
      {result && (
        <div className="result-box" style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                value
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 28,
                  fontWeight: 300,
                  color: "var(--ink)",
                }}
              >
                {result.value}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                tolerance
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 28,
                  fontWeight: 300,
                  color: "var(--ink)",
                }}
              >
                {result.tolerance}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                in farads
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  fontWeight: 300,
                  color: "var(--ink-soft)",
                  paddingTop: 6,
                }}
              >
                {result.valueF}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
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
                  in pf
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--ink-soft)",
                  }}
                >
                  {result.valuePF}
                </div>
              </div>
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
                  decoded as
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--ink-soft)",
                  }}
                >
                  {result.notes}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && input.trim() && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--ink-muted)",
            marginBottom: 32,
          }}
        >
          couldn't decode "{input}" — try a format like 104, 472K, 4n7, or
          100nF.
        </div>
      )}

      {/* tolerance reference */}
      <div style={{ marginBottom: 32 }}>
        <div className="section-head" style={{ marginBottom: 12 }}>
          tolerance codes
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 6,
          }}
        >
          {Object.entries(TOLERANCE_CODES).map(([code, tol]) => (
            <div
              key={code}
              style={{
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 6,
                padding: "8px 12px",
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--accent)",
                  minWidth: 16,
                }}
              >
                {code}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-soft)",
                }}
              >
                {tol}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* common values */}
      <div>
        <div className="section-head" style={{ marginBottom: 12 }}>
          common values
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ borderBottom: "1.5px solid var(--border)" }}>
              {["code", "value", "common use"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "6px 10px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
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
            {COMMON.map((row, i) => (
              <tr
                key={row.code}
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: i % 2 === 0 ? "var(--card)" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => setInput(row.code)}
              >
                <td
                  style={{
                    padding: "8px 10px",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "var(--accent)",
                  }}
                >
                  {row.code}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--ink)",
                  }}
                >
                  {row.value}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    fontSize: 13,
                    color: "var(--ink-muted)",
                  }}
                >
                  {row.use}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            marginTop: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-ghost)",
          }}
        >
          click any row to decode it
        </div>
      </div>
    </ToolPage>
  );
}
