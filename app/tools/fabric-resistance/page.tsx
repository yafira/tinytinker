"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

type UseCase = "all" | "conductor" | "sensor" | "ground" | "insulator";

interface Material {
  name: string;
  resistance: string;
  unit: "Ω/sq" | "Ω/m" | "Ω" | "—";
  useCase: UseCase[];
  notes: string;
  washable: boolean | null;
  source: string;
}

const materials: Material[] = [
  {
    name: "silver-coated knit fabric",
    resistance: "< 1",
    unit: "Ω/sq",
    useCase: ["conductor", "ground"],
    notes:
      "soft, stretchy, great for ground planes and large conductive areas. tarnishes over time.",
    washable: true,
    source: "less EMF, shieldex",
  },
  {
    name: "copper ripstop fabric",
    resistance: "< 0.1",
    unit: "Ω/sq",
    useCase: ["conductor", "ground"],
    notes:
      "very low resistance, not stretchy. good for flat traces and shielding.",
    washable: false,
    source: "adafruit, lessemf",
  },
  {
    name: "nickel-coated fabric",
    resistance: "< 1",
    unit: "Ω/sq",
    useCase: ["conductor", "ground"],
    notes: "durable, less prone to tarnish than silver. stiffer hand.",
    washable: false,
    source: "lessemf, sparkfun",
  },
  {
    name: "stainless steel knit",
    resistance: "1–10",
    unit: "Ω/sq",
    useCase: ["conductor"],
    notes:
      "durable and washable. slightly higher resistance than silver but more robust long-term.",
    washable: true,
    source: "bekaert, v technical textiles",
  },
  {
    name: "velostat / linqstat",
    resistance: "10k–100k",
    unit: "Ω/sq",
    useCase: ["sensor"],
    notes:
      "pressure-sensitive resistive film. resistance decreases under pressure — perfect for soft pressure sensors.",
    washable: false,
    source: "adafruit, lessemf",
  },
  {
    name: "eeonyx resistive fabric",
    resistance: "1k–20k",
    unit: "Ω/sq",
    useCase: ["sensor"],
    notes:
      "stretchable resistive fabric. resistance changes with stretch — useful for bend and flex sensors.",
    washable: true,
    source: "eeonyx.com",
  },
  {
    name: "resistive foam (anti-static)",
    resistance: "10k–1M",
    unit: "Ω/sq",
    useCase: ["sensor"],
    notes:
      "the pink foam that ICs ship in. cheap pressure sensor material for prototyping.",
    washable: false,
    source: "electronics suppliers, repurposed packaging",
  },
  {
    name: "copper tape (with conductive adhesive)",
    resistance: "< 0.01",
    unit: "Ω/sq",
    useCase: ["conductor"],
    notes:
      "not fabric but useful for hybrid soft/hard circuits. rigid, not sewable. good for paper circuits.",
    washable: false,
    source: "adafruit, chibitronics",
  },
  {
    name: "conductive thread (2-ply stainless)",
    resistance: "27.6",
    unit: "Ω/m",
    useCase: ["conductor"],
    notes:
      "most common maker thread. see the conductive thread calculator for full specs.",
    washable: true,
    source: "adafruit",
  },
  {
    name: "regular felt",
    resistance: "—",
    unit: "—",
    useCase: ["insulator"],
    notes:
      "non-conductive. great substrate for soft circuits. easy to sew and cut.",
    washable: true,
    source: "craft stores",
  },
  {
    name: "cotton fabric",
    resistance: "—",
    unit: "—",
    useCase: ["insulator"],
    notes:
      "non-conductive when dry. can conduct slightly when wet — keep circuits away from sweat zones.",
    washable: true,
    source: "fabric stores",
  },
  {
    name: "neoprene",
    resistance: "—",
    unit: "—",
    useCase: ["insulator"],
    notes:
      "non-conductive, water-resistant. good for wearables that need structure.",
    washable: true,
    source: "fabric stores",
  },
];

const USE_CASES: { value: UseCase; label: string; desc: string }[] = [
  { value: "all", label: "all", desc: "" },
  { value: "conductor", label: "conductor", desc: "carries current" },
  { value: "sensor", label: "sensor", desc: "responds to pressure or stretch" },
  { value: "ground", label: "ground plane", desc: "large area ground" },
  { value: "insulator", label: "insulator", desc: "separates circuits" },
];

function ResistanceBadge({ value, unit }: { value: string; unit: string }) {
  const isInsulator = unit === "—";
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        fontWeight: 500,
        color: isInsulator ? "var(--ink-ghost)" : "var(--accent)",
        background: isInsulator ? "transparent" : "rgba(96,48,168,0.08)",
        padding: isInsulator ? "1px 0" : "1px 8px",
        borderRadius: 3,
        whiteSpace: "nowrap",
      }}
    >
      {value} {unit !== "—" ? unit : "non-conductive"}
    </span>
  );
}

function UseCasePill({ type }: { type: UseCase }) {
  const colors: Record<UseCase, { bg: string; color: string }> = {
    all: { bg: "transparent", color: "var(--ink-ghost)" },
    conductor: { bg: "rgba(56,189,248,0.1)", color: "#0ea5e9" },
    sensor: { bg: "rgba(251,191,36,0.1)", color: "#d97706" },
    ground: { bg: "rgba(167,139,250,0.1)", color: "#7c3aed" },
    insulator: { bg: "rgba(148,163,184,0.1)", color: "var(--ink-ghost)" },
  };
  const c = colors[type];
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: "0.08em",
        padding: "2px 7px",
        borderRadius: 3,
        background: c.bg,
        color: c.color,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {type}
    </span>
  );
}

export default function FabricResistancePage() {
  const [active, setActive] = useState<UseCase>("all");

  const filtered =
    active === "all"
      ? materials
      : materials.filter((m) => m.useCase.includes(active));

  return (
    <ToolPage
      title="fabric & material resistance"
      description="resistance reference for common e-textile materials — conductive fabrics, resistive films, threads, and insulators."
      category="e-textiles"
    >
      {/* filter */}
      <div style={{ marginBottom: 28 }}>
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
          filter by use
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {USE_CASES.map((uc) => (
            <button
              key={uc.value}
              className={
                active === uc.value ? "btn btn-primary" : "btn btn-ghost"
              }
              onClick={() => setActive(uc.value)}
              style={{ fontSize: 12 }}
            >
              {uc.label}
              {uc.desc && (
                <span
                  style={{
                    fontSize: 10,
                    color: active === uc.value ? "inherit" : "var(--ink-ghost)",
                    marginLeft: 5,
                    opacity: 0.7,
                  }}
                >
                  — {uc.desc}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* material cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {filtered.map((m, i) => (
          <div
            key={m.name}
            style={{
              padding: "14px 0",
              borderBottom: "1px solid var(--border)",
              borderTop: i === 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 5,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--ink)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {m.name}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  {m.useCase.map((uc) => (
                    <UseCasePill key={uc} type={uc} />
                  ))}
                </div>
              </div>
              <ResistanceBadge value={m.resistance} unit={m.unit} />
            </div>

            <div
              style={{
                fontSize: 12,
                color: "var(--ink-muted)",
                lineHeight: 1.6,
                marginBottom: 6,
              }}
            >
              {m.notes}
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                flexWrap: "wrap",
              }}
            >
              <span>source: {m.source}</span>
              {m.washable !== null && (
                <span>{m.washable ? "✦ washable" : "✕ not washable"}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* explainer */}
      <div
        style={{
          marginTop: 32,
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
            marginBottom: 10,
          }}
        >
          reading the units
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--ink-soft)",
            lineHeight: 1.7,
          }}
        >
          <div>
            <span style={{ color: "var(--accent)" }}>
              Ω/sq (ohms per square)
            </span>{" "}
            — for flat fabrics. resistance is the same regardless of the size of
            the square — only the aspect ratio (length ÷ width) matters.
          </div>
          <div>
            <span style={{ color: "var(--accent)" }}>Ω/m (ohms per meter)</span>{" "}
            — for thread and linear materials. resistance scales directly with
            length.
          </div>
          <div>
            <span style={{ color: "var(--ink-ghost)" }}>
              all values are typical ranges — measure your specific material
              with a multimeter for precision. resistance changes with washing,
              wear, and oxidation.
            </span>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
