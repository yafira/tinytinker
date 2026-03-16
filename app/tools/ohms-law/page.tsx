"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

type Var = "V" | "I" | "R" | "P";

function fmt(n: number, unit: string) {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n >= 1000) return `${+(n / 1000).toPrecision(4)} k${unit}`;
  if (n < 0.001 && n > 0) return `${+(n * 1000000).toPrecision(4)} µ${unit}`;
  if (n < 1 && n > 0) return `${+(n * 1000).toPrecision(4)} m${unit}`;
  return `${+n.toPrecision(5)} ${unit}`;
}

export default function OhmsLawPage() {
  const [solving, setSolving] = useState<Var>("P");
  const [vals, setVals] = useState<Record<Var, string>>({
    V: "12",
    I: "0.02",
    R: "600",
    P: "",
  });
  const [supplyV, setSupplyV] = useState("5");
  const [ledV, setLedV] = useState("2.1");
  const [ledI, setLedI] = useState("20");

  const setVal = (k: Var, v: string) => setVals((p) => ({ ...p, [k]: v }));
  const inputs = (["V", "I", "R", "P"] as Var[]).filter((v) => v !== solving);
  const v = parseFloat(vals.V),
    i = parseFloat(vals.I),
    r = parseFloat(vals.R);

  let result = 0,
    resultUnit = "",
    resultLabel = "";
  if (solving === "P" && !isNaN(v) && !isNaN(i)) {
    result = v * i;
    resultUnit = "W";
    resultLabel = "power";
  } else if (solving === "V" && !isNaN(i) && !isNaN(r)) {
    result = i * r;
    resultUnit = "V";
    resultLabel = "voltage";
  } else if (solving === "I" && !isNaN(v) && !isNaN(r)) {
    result = v / r;
    resultUnit = "A";
    resultLabel = "current";
  } else if (solving === "R" && !isNaN(v) && !isNaN(i)) {
    result = v / i;
    resultUnit = "Ω";
    resultLabel = "resistance";
  }

  const sv = parseFloat(supplyV),
    lv = parseFloat(ledV),
    li = parseFloat(ledI);
  const ledR = (sv - lv) / (li / 1000);
  const ledP = ((sv - lv) * li) / 1000;

  const varInfo: Record<Var, { label: string; unit: string }> = {
    V: { label: "voltage", unit: "V" },
    I: { label: "current", unit: "A" },
    R: { label: "resistance", unit: "Ω" },
    P: { label: "power", unit: "W" },
  };

  return (
    <ToolPage
      title="ohm's law calculator"
      description="solve for any variable in V = IR. includes a LED resistor calculator."
      category="electronics"
    >
      {/* solve for */}
      <div style={{ marginBottom: 32 }}>
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
          solve for
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {(["V", "I", "R", "P"] as Var[]).map((v) => (
            <button
              key={v}
              onClick={() => setSolving(v)}
              className={solving === v ? "btn btn-primary" : "btn btn-ghost"}
            >
              <span style={{ fontFamily: "var(--font-mono)" }}>{v}</span>
              <span style={{ fontSize: 11, opacity: 0.75 }}>
                — {varInfo[v].label}
              </span>
            </button>
          ))}
        </div>

        {/* inputs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {inputs.map((k) => (
            <div key={k}>
              <label
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  display: "block",
                  marginBottom: 6,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {k} — {varInfo[k].label} ({varInfo[k].unit})
              </label>
              <input
                type="number"
                value={vals[k]}
                onChange={(e) => setVal(k, e.target.value)}
                placeholder={`enter ${varInfo[k].label}`}
              />
            </div>
          ))}
        </div>

        {/* result */}
        <div
          className="result-box"
          style={{ display: "flex", alignItems: "center", gap: 24 }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {resultLabel} ({resultUnit})
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 36,
                fontWeight: 300,
                color: "var(--ink)",
              }}
            >
              {result ? fmt(result, resultUnit) : "—"}
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--ink-ghost)",
                lineHeight: 2.2,
              }}
            >
              V = I × R<br />
              P = V × I<br />I = V / R
            </div>
          </div>
        </div>
      </div>

      {/* divider */}
      <div
        style={{ borderTop: "1.5px solid var(--border)", margin: "32px 0" }}
      />
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--ink-ghost)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        led resistor calculator
      </div>

      <p
        style={{
          fontSize: 12,
          color: "var(--ink-muted)",
          marginBottom: 20,
          lineHeight: 1.7,
        }}
      >
        find the correct current-limiting resistor for an LED.
        <br />
        formula: R = (V<sub>supply</sub> − V<sub>LED</sub>) / I<sub>LED</sub>
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
          <label
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              display: "block",
              marginBottom: 6,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            supply voltage (V)
          </label>
          <input
            type="number"
            value={supplyV}
            onChange={(e) => setSupplyV(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div>
          <label
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              display: "block",
              marginBottom: 6,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            led forward voltage (V)
          </label>
          <input
            type="number"
            step="0.1"
            value={ledV}
            onChange={(e) => setLedV(e.target.value)}
            placeholder="e.g. 2.1"
          />
          <div
            style={{ fontSize: 10, color: "var(--ink-ghost)", marginTop: 4 }}
          >
            red≈2.1V green≈2.2V blue≈3.2V white≈3.3V
          </div>
        </div>
        <div>
          <label
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              display: "block",
              marginBottom: 6,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            led current (mA)
          </label>
          <input
            type="number"
            value={ledI}
            onChange={(e) => setLedI(e.target.value)}
            placeholder="e.g. 20"
          />
          <div
            style={{ fontSize: 10, color: "var(--ink-ghost)", marginTop: 4 }}
          >
            typical: 10–20 mA
          </div>
        </div>
      </div>

      <div className="result-box">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              resistor value
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 32,
                fontWeight: 300,
                color: "var(--ink)",
              }}
            >
              {isFinite(ledR) && ledR > 0 ? fmt(ledR, "Ω") : "—"}
            </div>
            {isFinite(ledR) && ledR > 0 && (
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ink-muted)",
                  marginTop: 4,
                }}
              >
                use nearest standard value
              </div>
            )}
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              resistor power
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 32,
                fontWeight: 300,
                color: "var(--ink)",
              }}
            >
              {isFinite(ledP) && ledP > 0 ? fmt(ledP, "W") : "—"}
            </div>
            {isFinite(ledP) && ledP > 0 && (
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ink-muted)",
                  marginTop: 4,
                }}
              >
                use ≥ {+(ledP * 2).toPrecision(2)}W rated resistor
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
