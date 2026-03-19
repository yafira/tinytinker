import Link from "next/link";
import FeaturedTools from "@/components/FeaturedTools";
import ToolGrid from "@/components/ToolGrid";

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
            tiny, focused utilities for makers, engineers, artists, crafters,
            tinkerers, for you & curious minds everywhere — without leaving your
            browser.
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

      {/* featured — random on each load */}
      <FeaturedTools />

      {/* all tools with tag filter */}
      <ToolGrid />
    </div>
  );
}
