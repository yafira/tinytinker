"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

type Category = keyof typeof UNITS;

const UNITS = {
  length: {
    mm: 1,
    cm: 10,
    m: 1000,
    km: 1_000_000,
    in: 25.4,
    ft: 304.8,
    yd: 914.4,
    mi: 1_609_344,
    "thou (mil)": 0.0254,
  },
  weight: {
    mg: 1,
    g: 1000,
    kg: 1_000_000,
    oz: 28_349.5,
    lb: 453_592,
    ton: 907_184_740,
  },
  temperature: {
    "°C": 0,
    "°F": 0,
    K: 0,
  },
  "fabric / textile": {
    in: 25.4,
    cm: 10,
    yd: 914.4,
    m: 1000,
    "1/8 yd": 114.3,
    "1/4 yd": 228.6,
    "1/2 yd": 457.2,
  },
  "data / storage": {
    bit: 1,
    B: 8,
    KB: 8_000,
    MB: 8_000_000,
    GB: 8_000_000_000,
    TB: 8_000_000_000_000,
    KiB: 8_192,
    MiB: 8_388_608,
    GiB: 8_589_934_592,
  },
  "wire / AWG": {
    "AWG 30": 0.2546,
    "AWG 28": 0.3211,
    "AWG 26": 0.4049,
    "AWG 24": 0.5106,
    "AWG 22": 0.6438,
    "AWG 20": 0.8128,
    "AWG 18": 1.024,
    "AWG 16": 1.291,
    "AWG 14": 1.628,
    "AWG 12": 2.053,
  },
  pressure: {
    Pa: 1,
    kPa: 1000,
    MPa: 1_000_000,
    bar: 100_000,
    atm: 101_325,
    psi: 6894.76,
    mmHg: 133.322,
  },
  speed: {
    "m/s": 1,
    "km/h": 0.27778,
    mph: 0.44704,
    knot: 0.514444,
    fps: 0.3048,
  },
};

function convertTemp(value: number, from: string, to: string): number {
  let c: number;
  if (from === "°C") c = value;
  else if (from === "°F") c = ((value - 32) * 5) / 9;
  else c = value - 273.15;
  if (to === "°C") return c;
  if (to === "°F") return (c * 9) / 5 + 32;
  return c + 273.15;
}

function convert(
  value: number,
  from: string,
  to: string,
  category: Category,
): number {
  if (category === "temperature") return convertTemp(value, from, to);
  const units = UNITS[category] as Record<string, number>;
  return (value * units[from]) / units[to];
}

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) < 0.001 && n !== 0) return n.toExponential(4);
  if (Math.abs(n) >= 1e9) return n.toExponential(4);
  return (+n.toPrecision(7)).toString();
}

const tableVals = [1, 2, 5, 10, 20, 50, 100];

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("in");
  const [input, setInput] = useState("10");

  const units = Object.keys(UNITS[category]);

  const handleCategory = (cat: Category) => {
    setCategory(cat);
    const u = Object.keys(UNITS[cat]);
    setFromUnit(u[0]);
    setToUnit(u[1] ?? u[0]);
    setInput("1");
  };

  const result =
    input !== "" && !isNaN(parseFloat(input))
      ? convert(parseFloat(input), fromUnit, toUnit, category)
      : null;

  return (
    <ToolPage
      title="unit converter"
      description="convert between units of length, weight, temperature, fabric, data, wire gauge & more."
      category="measurements"
    >
      {/* category tabs */}
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}
      >
        {(Object.keys(UNITS) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={category === cat ? "btn btn-primary" : "btn btn-ghost"}
            style={{ fontSize: 11, padding: "5px 12px" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* converter */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 12,
          alignItems: "end",
          marginBottom: 28,
        }}
      >
        <div>
          <label
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            from
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            style={{ marginBottom: 8 }}
          >
            {units.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="enter value"
          />
        </div>

        <div
          style={{ paddingBottom: 10, color: "var(--ink-ghost)", fontSize: 20 }}
        >
          →
        </div>

        <div>
          <label
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            to
          </label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            style={{ marginBottom: 8 }}
          >
            {units.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <div
            className="result-box"
            style={{
              minHeight: 38,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 24,
                fontWeight: 300,
                color: "var(--ink)",
              }}
            >
              {result !== null ? fmt(result) : "—"}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--ink-ghost)",
              }}
            >
              {toUnit}
            </span>
          </div>
        </div>
      </div>

      {/* quick reference table */}
      {category !== "wire / AWG" && (
        <div>
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
            quick reference
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ borderBottom: "1.5px solid var(--border)" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 12px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--ink-ghost)",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                  }}
                >
                  {fromUnit}
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 12px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--ink-ghost)",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                  }}
                >
                  {toUnit}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableVals.map((v, i) => (
                <tr
                  key={v}
                  style={{
                    background: i % 2 === 0 ? "var(--card)" : "transparent",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <td
                    style={{
                      padding: "7px 12px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {v} {fromUnit}
                  </td>
                  <td
                    style={{
                      padding: "7px 12px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--ink)",
                    }}
                  >
                    {fmt(convert(v, fromUnit, toUnit, category))} {toUnit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* wire AWG special table */}
      {category === "wire / AWG" && (
        <div>
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
            diameter reference
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ borderBottom: "1.5px solid var(--border)" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 12px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--ink-ghost)",
                    fontWeight: 500,
                  }}
                >
                  AWG
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 12px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--ink-ghost)",
                    fontWeight: 500,
                  }}
                >
                  Ø mm
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(UNITS["wire / AWG"]).map(([gauge, mm], i) => (
                <tr
                  key={gauge}
                  style={{
                    background: i % 2 === 0 ? "var(--card)" : "transparent",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <td
                    style={{
                      padding: "7px 12px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {gauge}
                  </td>
                  <td
                    style={{
                      padding: "7px 12px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--ink)",
                    }}
                  >
                    {mm} mm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolPage>
  );
}
