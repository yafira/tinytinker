"use client";
import { useState, useMemo } from "react";
import ToolPage from "@/components/ToolPage";

interface Match {
  match: string;
  index: number;
  groups: Record<string, string> | null;
}

function getMatches(pattern: string, flags: string, text: string): Match[] {
  try {
    const regex = new RegExp(
      pattern,
      flags.includes("g") ? flags : flags + "g",
    );
    const matches: Match[] = [];
    let m;
    while ((m = regex.exec(text)) !== null) {
      matches.push({
        match: m[0],
        index: m.index,
        groups: m.groups || null,
      });
      if (!flags.includes("g")) break;
    }
    return matches;
  } catch {
    return [];
  }
}

function highlightText(
  text: string,
  pattern: string,
  flags: string,
): React.ReactNode[] {
  if (!pattern) return [<span key="0">{text}</span>];
  try {
    const regex = new RegExp(
      pattern,
      flags.includes("g") ? flags : flags + "g",
    );
    const parts: React.ReactNode[] = [];
    let last = 0;
    let m;
    let i = 0;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > last) {
        parts.push(<span key={`t${i}`}>{text.slice(last, m.index)}</span>);
      }
      parts.push(
        <mark
          key={`m${i}`}
          style={{
            background: "rgba(96,48,168,0.2)",
            color: "var(--ink)",
            borderRadius: 2,
            padding: "0 1px",
            outline: "1.5px solid rgba(96,48,168,0.4)",
          }}
        >
          {m[0]}
        </mark>,
      );
      last = m.index + m[0].length;
      i++;
      if (!flags.includes("g")) break;
    }
    if (last < text.length) {
      parts.push(<span key={`t${i}`}>{text.slice(last)}</span>);
    }
    return parts;
  } catch {
    return [<span key="0">{text}</span>];
  }
}

function isValidRegex(pattern: string, flags: string): boolean {
  try {
    new RegExp(pattern, flags);
    return true;
  } catch {
    return false;
  }
}

const EXAMPLES = [
  {
    label: "email",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "g",
    test: "contact me at hello@tinytinker.tools or support@example.com",
  },
  {
    label: "url",
    pattern: "https?:\\/\\/[^\\s]+",
    flags: "g",
    test: "visit https://tinytinker.tools or http://example.com for more",
  },
  {
    label: "hex color",
    pattern: "#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b",
    flags: "g",
    test: "colors: #fff #a855c8 #1a1917 #f0b #invalid",
  },
  {
    label: "numbers",
    pattern: "-?\\d+(\\.\\d+)?",
    flags: "g",
    test: "pi is 3.14159, temp is -12.5, count is 42",
  },
  {
    label: "named group",
    pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})",
    flags: "g",
    test: "dates: 2024-03-15 and 1999-12-31",
  },
  {
    label: "words",
    pattern: "\\b\\w{5,}\\b",
    flags: "g",
    test: "find all words that are five or more characters long",
  },
];

const FLAG_INFO: Record<string, string> = {
  g: "global — find all matches",
  i: "case insensitive",
  m: "multiline — ^ and $ match line boundaries",
  s: "dotall — . matches newlines too",
};

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState(
    "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
  );
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState(
    "contact me at hello@tinytinker.tools or support@example.com",
  );
  const [replaceWith, setReplaceWith] = useState("");
  const [showReplace, setShowReplace] = useState(false);

  const valid = useMemo(() => isValidRegex(pattern, flags), [pattern, flags]);
  const matches = useMemo(
    () => (valid && pattern ? getMatches(pattern, flags, testText) : []),
    [pattern, flags, testText, valid],
  );
  const highlighted = useMemo(
    () =>
      valid && pattern
        ? highlightText(testText, pattern, flags)
        : [<span key="0">{testText}</span>],
    [pattern, flags, testText, valid],
  );

  const replaceResult = useMemo(() => {
    if (!showReplace || !pattern || !valid) return "";
    try {
      return testText.replace(
        new RegExp(pattern, flags.includes("g") ? flags : flags + "g"),
        replaceWith,
      );
    } catch {
      return "";
    }
  }, [pattern, flags, testText, replaceWith, showReplace, valid]);

  const toggleFlag = (f: string) => {
    setFlags((prev) => (prev.includes(f) ? prev.replace(f, "") : prev + f));
  };

  const loadExample = (ex: (typeof EXAMPLES)[0]) => {
    setPattern(ex.pattern);
    setFlags(ex.flags);
    setTestText(ex.test);
  };

  return (
    <ToolPage
      title="regex tester"
      description="test regular expressions live with match highlighting, named groups, and replace."
      category="code & dev"
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
              key={ex.label}
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => loadExample(ex)}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* pattern input */}
      <div style={{ marginBottom: 16 }}>
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
          pattern
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              color: "var(--ink-ghost)",
            }}
          >
            /
          </span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="your regex pattern…"
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: "var(--font-mono)",
              borderColor: !valid && pattern ? "var(--accent)" : undefined,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              color: "var(--ink-ghost)",
            }}
          >
            /
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              color: "var(--accent)",
              minWidth: 20,
            }}
          >
            {flags}
          </span>
        </div>
        {!valid && pattern && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--accent)",
              marginTop: 6,
            }}
          >
            ✦ invalid regex pattern
          </div>
        )}
      </div>

      {/* flags */}
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
          flags
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(FLAG_INFO).map(([f, desc]) => (
            <button
              key={f}
              onClick={() => toggleFlag(f)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                background: flags.includes(f)
                  ? "rgba(96,48,168,0.1)"
                  : "var(--card)",
                border: `1.5px solid ${flags.includes(f) ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.12s",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: flags.includes(f)
                    ? "var(--accent)"
                    : "var(--ink-soft)",
                }}
              >
                {f}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                }}
              >
                {desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* test text */}
      <div style={{ marginBottom: 16 }}>
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
          test string
        </div>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--ink)",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.7,
            transition: "border-color 0.12s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* highlighted output */}
      {testText && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>matches</span>
            <span
              style={{
                background:
                  matches.length > 0 ? "rgba(96,48,168,0.1)" : "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "1px 7px",
                fontSize: 11,
                color:
                  matches.length > 0 ? "var(--accent)" : "var(--ink-ghost)",
                fontWeight: 500,
              }}
            >
              {matches.length} {matches.length === 1 ? "match" : "matches"}
            </span>
          </div>
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "14px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--ink-soft)",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {highlighted}
          </div>
        </div>
      )}

      {/* match details */}
      {matches.length > 0 && (
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
            match details
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {matches.map((m, i) => (
              <div
                key={i}
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 7,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-ghost)",
                    minWidth: 24,
                  }}
                >
                  #{i + 1}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--ink)",
                    background: "rgba(96,48,168,0.08)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    border: "1px solid rgba(96,48,168,0.2)",
                  }}
                >
                  {m.match || "(empty)"}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-ghost)",
                  }}
                >
                  index: {m.index}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-ghost)",
                  }}
                >
                  length: {m.match.length}
                </span>
                {m.groups && Object.keys(m.groups).length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Object.entries(m.groups).map(([k, v]) => (
                      <span
                        key={k}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--accent)",
                          background: "rgba(96,48,168,0.06)",
                          padding: "1px 6px",
                          borderRadius: 3,
                          border: "1px solid var(--border)",
                        }}
                      >
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* replace */}
      <div>
        <button
          className={showReplace ? "btn btn-primary" : "btn btn-ghost"}
          style={{ fontSize: 12, marginBottom: 16 }}
          onClick={() => setShowReplace(!showReplace)}
        >
          {showReplace ? "✦ replace mode on" : "+ replace mode"}
        </button>

        {showReplace && (
          <div>
            <div style={{ marginBottom: 12 }}>
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
                replace with
              </div>
              <input
                type="text"
                value={replaceWith}
                onChange={(e) => setReplaceWith(e.target.value)}
                placeholder="replacement string… (use $1, $2 for groups)"
                style={{ fontSize: 13 }}
              />
            </div>
            {replaceResult && (
              <div
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {replaceResult}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolPage>
  );
}
