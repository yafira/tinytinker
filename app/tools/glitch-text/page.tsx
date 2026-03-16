"use client";
import { useState, useEffect } from "react";
import ToolPage from "@/components/ToolPage";

const ZALGO_UP = [
  "\u0300",
  "\u0301",
  "\u0302",
  "\u0303",
  "\u0304",
  "\u0305",
  "\u0306",
  "\u0307",
  "\u0308",
  "\u0309",
  "\u030A",
  "\u030B",
  "\u030C",
  "\u030D",
  "\u030E",
  "\u030F",
  "\u0310",
  "\u0311",
  "\u0312",
  "\u0313",
  "\u0314",
  "\u0315",
  "\u031A",
  "\u031B",
  "\u033D",
  "\u033E",
  "\u033F",
  "\u0340",
  "\u0341",
  "\u0342",
  "\u0343",
  "\u0344",
];
const ZALGO_DOWN = [
  "\u0316",
  "\u0317",
  "\u0318",
  "\u0319",
  "\u031C",
  "\u031D",
  "\u031E",
  "\u031F",
  "\u0320",
  "\u0321",
  "\u0322",
  "\u0323",
  "\u0324",
  "\u0325",
  "\u0326",
  "\u0327",
  "\u0328",
  "\u0329",
  "\u032A",
  "\u032B",
  "\u032C",
  "\u032D",
  "\u032E",
  "\u032F",
];
const ZALGO_MID = [
  "\u0330",
  "\u0331",
  "\u0332",
  "\u0333",
  "\u0334",
  "\u0335",
  "\u0336",
  "\u0337",
  "\u0338",
];

const STRIKE = "\u0336";
const UNDERLINE = "\u0332";
const DOUBLE_STRIKE = "\u0335";

const WIDE_MAP: Record<string, string> = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 "
  .split("")
  .forEach((c, i) => {
    const codes = [
      0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21,
      0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21,
      0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff21, 0xff41,
      0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff41,
      0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff41,
      0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff41, 0xff10, 0xff10,
      0xff10, 0xff10, 0xff10, 0xff10, 0xff10, 0xff10, 0xff10, 0xff10, 0x3000,
    ];
    const base =
      c === " "
        ? 0x3000
        : c >= "a" && c <= "z"
          ? 0xff41 + (c.charCodeAt(0) - 97)
          : c >= "A" && c <= "Z"
            ? 0xff21 + (c.charCodeAt(0) - 65)
            : c >= "0" && c <= "9"
              ? 0xff10 + (c.charCodeAt(0) - 48)
              : c.charCodeAt(0);
    WIDE_MAP[c] = String.fromCharCode(base);
  });

const CIRCLE_MAP: Record<string, string> = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  .split("")
  .forEach((c) => {
    if (c >= "A" && c <= "Z")
      CIRCLE_MAP[c] = String.fromCodePoint(0x24b6 + c.charCodeAt(0) - 65);
    else if (c >= "a" && c <= "z")
      CIRCLE_MAP[c] = String.fromCodePoint(0x24d0 + c.charCodeAt(0) - 97);
    else if (c >= "1" && c <= "9")
      CIRCLE_MAP[c] = String.fromCodePoint(0x2460 + c.charCodeAt(0) - 49);
    else if (c === "0") CIRCLE_MAP[c] = "⓪";
  });

const MIRROR_MAP: Record<string, string> = {
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ƃ",
  h: "ɥ",
  i: "ı",
  j: "ɾ",
  k: "ʞ",
  l: "l",
  m: "ɯ",
  n: "u",
  o: "o",
  p: "d",
  q: "b",
  r: "ɹ",
  s: "s",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  x: "x",
  y: "ʎ",
  z: "z",
  A: "∀",
  B: "ᗺ",
  C: "Ɔ",
  D: "ᗡ",
  E: "Ǝ",
  F: "Ⅎ",
  G: "פ",
  H: "H",
  I: "I",
  J: "ɾ",
  K: "ʞ",
  L: "˥",
  M: "W",
  N: "N",
  O: "O",
  P: "Ԁ",
  Q: "Q",
  R: "ᴚ",
  S: "S",
  T: "┴",
  U: "∩",
  V: "Λ",
  W: "M",
  X: "X",
  Y: "⅄",
  Z: "Z",
  "0": "0",
  "1": "Ɩ",
  "2": "ᄅ",
  "3": "Ɛ",
  "4": "ㄣ",
  "5": "ϛ",
  "6": "9",
  "7": "ㄥ",
  "8": "8",
  "9": "6",
  ".": "˙",
  ",": "'",
  "?": "¿",
  "!": "¡",
  "(": ")",
  ")": "(",
};

type Mode =
  | "zalgo"
  | "strikethrough"
  | "underline"
  | "wide"
  | "circled"
  | "mirror"
  | "binary"
  | "morse";

const MORSE: Record<string, string> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
};

function applyGlitch(text: string, mode: Mode, intensity: number): string {
  switch (mode) {
    case "zalgo":
      return text
        .split("")
        .map((c) => {
          if (c === " ") return c;
          let r = c;
          for (let i = 0; i < intensity; i++) {
            if (Math.random() > 0.3)
              r += ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)];
            if (Math.random() > 0.5)
              r += ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)];
            if (Math.random() > 0.7)
              r += ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)];
          }
          return r;
        })
        .join("");
    case "strikethrough":
      return text
        .split("")
        .map((c) => c + STRIKE)
        .join("");
    case "underline":
      return text
        .split("")
        .map((c) => c + UNDERLINE)
        .join("");
    case "wide":
      return text
        .split("")
        .map((c) => WIDE_MAP[c] || c)
        .join("");
    case "circled":
      return text
        .split("")
        .map((c) => CIRCLE_MAP[c] || c)
        .join("");
    case "mirror":
      return text
        .split("")
        .reverse()
        .map((c) => MIRROR_MAP[c] || c)
        .join("");
    case "binary":
      return text
        .split("")
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
    case "morse":
      return text
        .toLowerCase()
        .split("")
        .map((c) => (c === " " ? "/" : MORSE[c] || c))
        .join(" ");
  }
}

const MODES: { value: Mode; label: string; desc: string }[] = [
  { value: "zalgo", label: "zalgo", desc: "̷c̷o̷r̷r̷u̷p̷t̷ unicode overflow" },
  { value: "strikethrough", label: "s̶t̶r̶i̶k̶e̶", desc: "strikethrough every char" },
  { value: "underline", label: "u̲n̲d̲e̲r̲l̲i̲n̲e̲", desc: "underline every char" },
  { value: "wide", label: "ｗｉｄｅ", desc: "fullwidth unicode chars" },
  { value: "circled", label: "ⓒⓘⓡⓒⓛⓔ", desc: "circled letters" },
  { value: "mirror", label: "ɹoɹɹıɯ", desc: "flip & reverse text" },
  { value: "binary", label: "binary", desc: "text → 8-bit binary" },
  { value: "morse", label: "morse", desc: "text → morse code" },
];

export default function GlitchTextPage() {
  const [input, setInput] = useState("tinytinker tools");
  const [mode, setMode] = useState<Mode>("zalgo");
  const [intensity, setIntensity] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (input) setOutput(applyGlitch(input, mode, intensity));
  }, [input, mode, intensity]);

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <ToolPage
      title="glitch text"
      description="transform text using unicode tricks — zalgo corruption, wide chars, morse, binary & more."
      category="generative text"
    >
      {/* input */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-ghost)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          input text
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type something…"
          style={{ fontSize: 14 }}
        />
      </div>

      {/* mode selector */}
      <div style={{ marginBottom: 20 }}>
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
          glitch mode
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 6,
          }}
        >
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
                padding: "10px 12px",
                background:
                  mode === m.value ? "rgba(168,85,200,0.1)" : "var(--card)",
                border: `1.5px solid ${mode === m.value ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.12s",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: mode === m.value ? "var(--accent)" : "var(--ink)",
                  fontWeight: 500,
                }}
              >
                {m.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--ink-ghost)",
                }}
              >
                {m.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* intensity (zalgo only) */}
      {mode === "zalgo" && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            intensity — {intensity}
          </div>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            style={{ width: "100%", maxWidth: 300 }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: 300,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--ink-ghost)",
              marginTop: 4,
            }}
          >
            <span>subtle</span>
            <span>̷̷̷̷̷̷̷̷c̷h̷a̷o̷s̷</span>
          </div>
        </div>
      )}

      {/* output */}
      {output && (
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>output</span>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 10, padding: "3px 10px" }}
              onClick={copy}
            >
              {copied ? "copied ✦" : "copy"}
            </button>
          </div>
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "20px 18px",
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              color: "var(--ink)",
              lineHeight: 2.2,
              wordBreak: "break-all",
              minHeight: 80,
            }}
          >
            {output}
          </div>
        </div>
      )}
    </ToolPage>
  );
}
