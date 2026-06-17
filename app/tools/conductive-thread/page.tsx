"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

const THREADS = [
  {
    label: "adafruit 2-ply stainless",
    ohmPerM: 27.6,
    note: "most common for soft circuits",
  },
  {
    label: "adafruit 3-ply stainless",
    ohmPerM: 14.4,
    note: "lower resistance, thicker hand",
  },
  {
    label: "sparkfun silver-coated",
    ohmPerM: 20,
    note: "smooth, good conductivity",
  },
  {
    label: "bekaert bekitex",
    ohmPerM: 1,
    note: "very low resistance, industrial",
  },
  {
    label: "shieldex 117/17 dtex",
    ohmPerM: 500,
    note: "high resistance, use short runs",
  },
  { label: "custom", ohmPerM: null, note: "" },
];

type LengthUnit = "cm" | "m" | "in" | "ft";
type StrandCount = 1 | 2 | 3;

const LENGTH_UNITS: LengthUnit[] = ["cm", "m", "in", "ft"];

function toMeters(val: number, unit: LengthUnit): number {
  if (unit === "m") return val;
  if (unit === "cm") return val / 100;
  if (unit === "in") return val * 0.0254;
  if (unit === "ft") return val * 0.3048;
  return val / 100;
}

function fmtR(ohms: number): string {
  if (ohms >= 1000) return `${+(ohms / 1000).toPrecision(4)} kΩ`;
  if (ohms < 1) return `${+ohms.toPrecision(3)} Ω`;
  return `${+ohms.toPrecision(4)} Ω`;
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--ink-ghost)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 20,
          fontWeight: 300,
          color: "var(--ink)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function ConductiveThreadPage() {
  const [threadIdx, setThreadIdx] = useState(0);
  const [customOhm, setCustomOhm] = useState("30");
  const [length, setLength] = useState("50");
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>("cm");
  const [strands, setStrands] = useState<StrandCount>(1);
  const [showCircuit, setShowCircuit] = useState(false);
  const [vBatt, setVBatt] = useState("3");
  const [vLED, setVLED] = useState("2.1");
  const [iLED, setILED] = useState("10");

  const selected = THREADS[threadIdx];
  const ohmPerM = selected.ohmPerM ?? parseFloat(customOhm);
  const lengthVal = parseFloat(length);
  const lengthM = !isNaN(lengthVal) ? toMeters(lengthVal, lengthUnit) : NaN;
  const resistance =
    !isNaN(ohmPerM) && !isNaN(lengthM) && lengthM > 0 && ohmPerM > 0
      ? (ohmPerM * lengthM) / strands
      : NaN;

  const vBattVal = parseFloat(vBatt);
  const vLEDVal = parseFloat(vLED);
  const iLEDVal = parseFloat(iLED);
  const vDrive = vBattVal - vLEDVal;
  const iActual =
    !isNaN(resistance) && resistance > 0 ? (vDrive / resistance) * 1000 : NaN;
  const ratio = !isNaN(iActual) ? iActual / iLEDVal : NaN;

  type Verdict = { label: string; color: string; bg: string } | null;
  let verdict: Verdict = null;
  if (showCircuit && !isNaN(ratio)) {
    if (vDrive <= 0) {
      verdict = {
        label: "battery voltage too low to drive this LED",
        color: "var(--ink-danger, #e05252)",
        bg: "rgba(224,82,82,0.08)",
      };
    } else if (ratio < 0.3) {
      verdict = {
        label: `${iActual.toFixed(1)} mA — too dim or won't light`,
        color: "var(--ink-danger, #e05252)",
        bg: "rgba(224,82,82,0.08)",
      };
    } else if (ratio < 0.7) {
      verdict = {
        label: `${iActual.toFixed(1)} mA — will glow dimly, try shorter thread`,
        color: "var(--ink-warn, #c8842a)",
        bg: "rgba(200,132,42,0.08)",
      };
    } else if (ratio <= 1.5) {
      verdict = {
        label: `${iActual.toFixed(1)} mA — this circuit will light up ✦`,
        color: "var(--ink-success, #3a9e6e)",
        bg: "rgba(58,158,110,0.08)",
      };
    } else {
      verdict = {
        label: `${iActual.toFixed(1)} mA — may overdrive LED, shorten thread or add strands`,
        color: "var(--ink-warn, #c8842a)",
        bg: "rgba(200,132,42,0.08)",
      };
    }
  }

  return (
    <ToolPage
      title="conductive thread resistance"
      description="calculate the resistance of conductive thread by type, length, and strand count. includes an optional LED circuit check."
      category="electronics"
    >
      {/* thread selector */}
      <div style={{ marginBottom: 20 }}>
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
          thread type
        </div>
        <select
          value={threadIdx}
          onChange={(e) => setThreadIdx(Number(e.target.value))}
          style={{ width: "100%", fontFamily: "var(--font-mono)" }}
        >
          {THREADS.map((t, i) => (
            <option key={i} value={i}>
              {t.label}
              {t.ohmPerM !== null ? ` — ${t.ohmPerM} Ω/m` : ""}
            </option>
          ))}
        </select>
        {selected.note && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--ink-ghost)",
              marginTop: 5,
            }}
          >
            {selected.note}
          </div>
        )}
      </div>

      {/* custom ohm/m input */}
      {selected.ohmPerM === null && (
        <div style={{ marginBottom: 20 }}>
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
            resistance (Ω/m)
          </div>
          <input
            type="number"
            value={customOhm}
            onChange={(e) => setCustomOhm(e.target.value)}
            placeholder="e.g. 30"
            min="0.01"
            step="0.1"
            style={{ width: "100%" }}
          />
        </div>
      )}

      {/* length + unit */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 100px",
          gap: 10,
          marginBottom: 20,
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
            length
          </div>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            min="0.1"
            step="1"
            style={{ width: "100%" }}
          />
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
            unit
          </div>
          <select
            value={lengthUnit}
            onChange={(e) => setLengthUnit(e.target.value as LengthUnit)}
            style={{ width: "100%" }}
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* strands */}
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
          strands
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {([1, 2, 3] as StrandCount[]).map((s) => (
            <button
              key={s}
              className={strands === s ? "btn btn-primary" : "btn btn-ghost"}
              onClick={() => setStrands(s)}
            >
              {s === 1 ? "single" : s === 2 ? "doubled" : "tripled"}
            </button>
          ))}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-ghost)",
            marginTop: 6,
          }}
        >
          doubling thread halves resistance — useful for lower-resistance runs
        </div>
      </div>

      {/* results */}
      {!isNaN(resistance) && (
        <div className="result-box">
          <ResultRow label="thread resistance" value={fmtR(resistance)} />
          <ResultRow
            label="formula"
            value={`${ohmPerM} × ${lengthM.toFixed(2)}m${strands > 1 ? ` ÷ ${strands}` : ""}`}
          />
        </div>
      )}

      {/* LED circuit check toggle */}
      <div style={{ marginTop: 28 }}>
        <button
          className="btn btn-ghost"
          onClick={() => setShowCircuit(!showCircuit)}
          style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
        >
          {showCircuit ? "− hide LED circuit check" : "+ add LED circuit check"}
        </button>
      </div>

      {showCircuit && (
        <div style={{ marginTop: 20 }}>
          <p
            style={{
              fontSize: 13,
              color: "var(--ink-muted)",
              marginBottom: 20,
              lineHeight: 1.7,
              fontFamily: "var(--font-mono)",
            }}
          >
            checks whether the thread resistance will let enough current through
            to light an LED. no additional resistor — the thread is the
            resistor.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 20,
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
                battery (V)
              </div>
              <input
                type="number"
                value={vBatt}
                onChange={(e) => setVBatt(e.target.value)}
                step="0.1"
                min="0.1"
                style={{ width: "100%" }}
              />
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  marginTop: 4,
                }}
              >
                CR2032 = 3V
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
                LED Vf (V)
              </div>
              <input
                type="number"
                value={vLED}
                onChange={(e) => setVLED(e.target.value)}
                step="0.1"
                min="0.1"
                style={{ width: "100%" }}
              />
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  marginTop: 4,
                }}
              >
                red ≈ 2.1 blue ≈ 3.2
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
                target (mA)
              </div>
              <input
                type="number"
                value={iLED}
                onChange={(e) => setILED(e.target.value)}
                step="1"
                min="1"
                style={{ width: "100%" }}
              />
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  marginTop: 4,
                }}
              >
                typical 10–20 mA
              </div>
            </div>
          </div>

          {verdict && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                padding: "10px 14px",
                borderRadius: 6,
                background: verdict.bg,
                color: verdict.color,
                border: `1px solid ${verdict.color}`,
                marginTop: 4,
              }}
            >
              {verdict.label}
            </div>
          )}
        </div>
      )}

      {/* thread reference table */}
      <div
        style={{
          marginTop: 36,
          padding: "14px 16px",
          background: "var(--card)",
          border: "1.5px solid var(--border)",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-ghost)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          thread reference
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {THREADS.filter((t) => t.ohmPerM !== null).map((t) => (
            <div
              key={t.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "7px 0",
                borderBottom: "1px solid var(--border)",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--ink-soft)",
                }}
              >
                {t.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--accent)",
                  background: "rgba(96,48,168,0.08)",
                  padding: "1px 8px",
                  borderRadius: 3,
                  whiteSpace: "nowrap",
                }}
              >
                {t.ohmPerM} Ω/m
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-ghost)",
            marginTop: 10,
            lineHeight: 1.6,
          }}
        >
          resistance values are typical — measure your actual thread with a
          multimeter for precision. resistance increases with wear, washing, and
          oxidation.
        </div>
      </div>
    </ToolPage>
  );
}
