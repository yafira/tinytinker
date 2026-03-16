"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

const AWG_DATA = [
  {
    awg: 0,
    dia_mm: 8.252,
    area_mm2: 53.48,
    amp_chassis: 150,
    amp_chassis_str: "150A",
    ohm_per_km: 0.3224,
    use: "heavy power, EV, welding",
  },
  {
    awg: 2,
    dia_mm: 6.544,
    area_mm2: 33.63,
    amp_chassis: 95,
    amp_chassis_str: "95A",
    ohm_per_km: 0.5127,
    use: "power distribution, automotive",
  },
  {
    awg: 4,
    dia_mm: 5.189,
    area_mm2: 21.15,
    amp_chassis: 70,
    amp_chassis_str: "70A",
    ohm_per_km: 0.8152,
    use: "automotive, solar panels",
  },
  {
    awg: 6,
    dia_mm: 4.115,
    area_mm2: 13.3,
    amp_chassis: 55,
    amp_chassis_str: "55A",
    ohm_per_km: 1.296,
    use: "appliances, HVAC",
  },
  {
    awg: 8,
    dia_mm: 3.264,
    area_mm2: 8.367,
    amp_chassis: 40,
    amp_chassis_str: "40A",
    ohm_per_km: 2.061,
    use: "dryer, range, A/C",
  },
  {
    awg: 10,
    dia_mm: 2.588,
    area_mm2: 5.261,
    amp_chassis: 30,
    amp_chassis_str: "30A",
    ohm_per_km: 3.277,
    use: "water heater, dryer",
  },
  {
    awg: 12,
    dia_mm: 2.053,
    area_mm2: 3.309,
    amp_chassis: 20,
    amp_chassis_str: "20A",
    ohm_per_km: 5.211,
    use: "kitchen outlets, A/C",
  },
  {
    awg: 14,
    dia_mm: 1.628,
    area_mm2: 2.081,
    amp_chassis: 15,
    amp_chassis_str: "15A",
    ohm_per_km: 8.286,
    use: "lighting, general outlets",
  },
  {
    awg: 16,
    dia_mm: 1.291,
    area_mm2: 1.309,
    amp_chassis: 13,
    amp_chassis_str: "13A",
    ohm_per_km: 13.17,
    use: "extension cords, light fixtures",
  },
  {
    awg: 18,
    dia_mm: 1.024,
    area_mm2: 0.823,
    amp_chassis: 10,
    amp_chassis_str: "10A",
    ohm_per_km: 20.95,
    use: "lamps, small appliances",
  },
  {
    awg: 20,
    dia_mm: 0.8128,
    area_mm2: 0.519,
    amp_chassis: 7,
    amp_chassis_str: "7A",
    ohm_per_km: 33.31,
    use: "internal wiring, PCB jumpers",
  },
  {
    awg: 22,
    dia_mm: 0.6438,
    area_mm2: 0.326,
    amp_chassis: 5,
    amp_chassis_str: "5A",
    ohm_per_km: 53.48,
    use: "signal wiring, hobby electronics",
  },
  {
    awg: 24,
    dia_mm: 0.5106,
    area_mm2: 0.205,
    amp_chassis: 3.5,
    amp_chassis_str: "3.5A",
    ohm_per_km: 84.22,
    use: "breadboard wires, Arduino",
  },
  {
    awg: 26,
    dia_mm: 0.4049,
    area_mm2: 0.129,
    amp_chassis: 2.2,
    amp_chassis_str: "2.2A",
    ohm_per_km: 133.9,
    use: "sensor cables, ribbon cable",
  },
  {
    awg: 28,
    dia_mm: 0.3211,
    area_mm2: 0.081,
    amp_chassis: 0.8,
    amp_chassis_str: "0.8A",
    ohm_per_km: 212.9,
    use: "PCB traces, thin signal wire",
  },
  {
    awg: 30,
    dia_mm: 0.2546,
    area_mm2: 0.0509,
    amp_chassis: 0.5,
    amp_chassis_str: "0.5A",
    ohm_per_km: 338.6,
    use: "magnet wire, fine signal",
  },
  {
    awg: 32,
    dia_mm: 0.2019,
    area_mm2: 0.032,
    amp_chassis: 0.35,
    amp_chassis_str: "0.35A",
    ohm_per_km: 538.3,
    use: "fine magnet wire, wearables",
  },
  {
    awg: 34,
    dia_mm: 0.1601,
    area_mm2: 0.02,
    amp_chassis: 0.15,
    amp_chassis_str: "0.15A",
    ohm_per_km: 856.0,
    use: "coils, fine enameled wire",
  },
  {
    awg: 36,
    dia_mm: 0.127,
    area_mm2: 0.013,
    amp_chassis: 0.09,
    amp_chassis_str: "0.09A",
    ohm_per_km: 1361,
    use: "hair-fine coils, transformers",
  },
];

export default function WireGaugePage() {
  const [search, setSearch] = useState("");

  const filtered = AWG_DATA.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      row.awg.toString().includes(q) ||
      row.use.toLowerCase().includes(q) ||
      row.amp_chassis_str.includes(q)
    );
  });

  return (
    <ToolPage
      title="wire gauge reference"
      description="AWG to mm², diameter, ampacity, and resistance per km. filter by gauge, current, or use case."
      category="electronics"
    >
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="filter by AWG, amperage, or use case…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 380 }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ borderBottom: "1.5px solid var(--border)" }}>
              {["AWG", "Ø mm", "mm²", "ampacity", "Ω/km", "common use"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "6px 10px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--ink-ghost)",
                      letterSpacing: "0.1em",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              const ampPct = row.amp_chassis / 150;
              const barColor =
                row.amp_chassis >= 30
                  ? "#a855c8"
                  : row.amp_chassis >= 5
                    ? "#c084d4"
                    : "var(--ink-faint)";
              return (
                <tr
                  key={row.awg}
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
                      fontSize: 14,
                      color: "var(--ink)",
                    }}
                  >
                    {row.awg}
                  </td>
                  <td
                    style={{
                      padding: "8px 10px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {row.dia_mm.toFixed(3)}
                  </td>
                  <td
                    style={{
                      padding: "8px 10px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {row.area_mm2.toFixed(3)}
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 4,
                          background: "var(--border)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${ampPct * 100}%`,
                            height: "100%",
                            background: barColor,
                            borderRadius: 2,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--ink-soft)",
                        }}
                      >
                        {row.amp_chassis_str}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "8px 10px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {row.ohm_per_km < 10
                      ? row.ohm_per_km.toFixed(2)
                      : row.ohm_per_km.toFixed(0)}
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            padding: "32px 0",
            textAlign: "center",
            color: "var(--ink-ghost)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
        >
          no results for "{search}"
        </div>
      )}

      <div
        style={{
          marginTop: 20,
          padding: "12px 16px",
          background: "var(--card)",
          borderRadius: 8,
          border: "1.5px solid var(--border)",
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "var(--ink-muted)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          <strong style={{ color: "var(--ink-soft)" }}>note:</strong> ampacity
          figures are for chassis/open-air wiring at 25°C ambient. bundled or
          enclosed wiring requires derating. always consult local electrical
          codes for permanent installations.
        </p>
      </div>
    </ToolPage>
  );
}
