/**
 * src/components/SkillsDropdown.jsx
 * Quick-launch dropdown for all Claude Code project skills.
 */

import React, { useState, useRef, useEffect } from "react";

const SKILLS = [
  {
    cmd: "/ch-audit",
    label: "Ch-Audit",
    emoji: "🔬",
    desc: "Full three-instrument chapter audit — LitCentral OMEGA + SPSS Ω + PBI",
  },
  {
    cmd: "/omega-audit",
    label: "Omega-Audit",
    emoji: "📊",
    desc: "Full manuscript audit · SPSS Omega + LitCentral + PBI + roadmap to Ω 112",
  },
  {
    cmd: "/fix-pass",
    label: "Fix-Pass",
    emoji: "✂️",
    desc: "One editorial pass — banned phrases, passive voice, filter words, artifacts",
  },
  {
    cmd: "/insert-anchor",
    label: "Insert-Anchor",
    emoji: "⚓",
    desc: "Propose a verified sensory anchor insert (max 250 words) for a specific chapter",
  },
  {
    cmd: "/deep-research",
    label: "Deep-Research",
    emoji: "🔍",
    desc: "Fan-out web research harness — multi-source, fact-checked, adversarially verified",
  },
  {
    cmd: "/code-review",
    label: "Code-Review",
    emoji: "👁",
    desc: "Review current diff for correctness bugs and simplification opportunities",
  },
  {
    cmd: "/security-review",
    label: "Security-Review",
    emoji: "🔒",
    desc: "Complete security review of pending changes on the current branch",
  },
  {
    cmd: "/update-config",
    label: "Update-Config",
    emoji: "⚙️",
    desc: "Configure Claude Code harness via settings.json — hooks, permissions, env vars",
  },
];

export default function SkillsDropdown() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleSelect(cmd) {
    navigator.clipboard.writeText(cmd).catch(() => {});
    setCopied(cmd);
    setTimeout(() => setCopied(null), 1800);
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          background: open
            ? "linear-gradient(90deg,#19c0a8,#9a5cd6)"
            : "linear-gradient(90deg,#d4a72c,#19c0a8,#9a5cd6)",
          color: "#0b0d12",
          fontWeight: 800,
          borderRadius: 7,
          border: "none",
          cursor: "pointer",
          fontFamily: "monospace",
          letterSpacing: "0.12em",
          fontSize: 12,
          whiteSpace: "nowrap",
        }}
        title="Project skills — click to copy command"
      >
        ⚡ Skills {open ? "▲" : "▼"}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 999,
            background: "#13161e",
            border: "1px solid #2a2d3a",
            borderRadius: 9,
            boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
            minWidth: 320,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "8px 14px 6px",
              fontSize: 9,
              letterSpacing: "0.18em",
              color: "#7f8c8d",
              fontWeight: 700,
              textTransform: "uppercase",
              fontFamily: "monospace",
              borderBottom: "1px solid #1e2130",
            }}
          >
            Project Skills — click to copy
          </div>

          {SKILLS.map((s) => (
            <button
              key={s.cmd}
              onClick={() => handleSelect(s.cmd)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                width: "100%",
                padding: "9px 14px",
                background: copied === s.cmd ? "#1a2e22" : "transparent",
                border: "none",
                borderBottom: "1px solid #1a1d26",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                if (copied !== s.cmd) e.currentTarget.style.background = "#1c1f2e";
              }}
              onMouseLeave={(e) => {
                if (copied !== s.cmd) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1, marginTop: 1 }}>{s.emoji}</span>
              <span style={{ flex: 1 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    fontSize: 12,
                    color: copied === s.cmd ? "#19c0a8" : "#d4a72c",
                    letterSpacing: "0.08em",
                  }}
                >
                  {copied === s.cmd ? "✓ copied" : s.cmd}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: 11,
                    color: "#8a8fa8",
                    marginTop: 2,
                    lineHeight: 1.35,
                  }}
                >
                  {s.desc}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
