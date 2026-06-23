// FLORINSKY UI Kit — shared parts
// Icon (Lucide), NeoButton, IconWell, SectionTitle, Eyebrow
const { useEffect, useRef, useState } = React;

// Build a lucide SVG string from the icon's node data so REACT fully owns
// the markup — we never let lucide.createIcons() mutate the live DOM (that
// swaps nodes out from under React and breaks reconciliation/state commits).
function lucideSvg(name, size, stroke) {
  const pascal = String(name).split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const lib = window.lucide || {};
  const data = (lib.icons && lib.icons[pascal]) || lib[pascal];
  if (!data) return "";
  // lucide stores ["svg", attrs, [ [childTag, childAttrs], ... ] ]
  const kids = (data[0] === "svg" && Array.isArray(data[2])) ? data[2] : data;
  const children = kids.map(([tag, attrs]) =>
    "<" + tag + " " + Object.entries(attrs || {}).map(([k, v]) => k + '="' + v + '"').join(" ") + "></" + tag + ">"
  ).join("");
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + stroke +
    '" stroke-linecap="round" stroke-linejoin="round">' + children + "</svg>";
}

// Renders a Lucide icon as React-owned inline SVG.
function Icon({ name, size = 24, color = "var(--ink-mauve)", stroke = 1.75, style }) {
  const html = React.useMemo(() => lucideSvg(name, size, stroke), [name, size, stroke]);
  return (
    <span
      style={{ color, display: "inline-flex", lineHeight: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    ></span>
  );
}

// Circular pressed-in icon disc — the brand's standard icon container.
function IconWell({ name, size = 64, iconSize = 32 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "var(--r-icon)",
        display: "grid", placeItems: "center",
        boxShadow: "var(--inset-md)",
      }}
    >
      <Icon name={name} size={iconSize} stroke={1.75} />
    </div>
  );
}

// Pill button rendered purely with neumorphic shadow.
// Full state model: rest → hover (lift + deepen + accent) → press (inset + sink).
function NeoButton({ children, variant = "ghost", color = "var(--ink-mauve)", spacing = "var(--ls-btn)", onClick, style }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const shadow = pressed ? "var(--inset-md)" : hover ? "var(--elev-hover)" : "var(--elev-md)";
  const base = {
    border: "none",
    borderRadius: "var(--r-pill)",
    background: variant === "solid" ? "var(--surface)" : "rgba(255,255,255,0.002)",
    padding: variant === "solid" ? "20px 56px" : "16px 32px",
    font: "var(--btn)",
    letterSpacing: spacing,
    textTransform: "uppercase",
    color: (hover || pressed) ? "var(--brand-deep)" : color,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease), color var(--dur) var(--ease)",
    boxShadow: shadow,
    transform: pressed ? "translateY(0) scale(0.97)" : hover ? "translateY(-3px)" : "translateY(0)",
    ...style,
  };
  return (
    <button
      style={base}
      onMouseEnter={() => setHover(true)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => { setPressed(false); setHover(false); }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Eyebrow({ children, color = "var(--ink-soft)", opacity = 0.6 }) {
  return (
    <span style={{
      font: "var(--body)", letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase", color, opacity, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

// Section title with the short accent rule under it.
function SectionTitle({ children, eyebrow }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {eyebrow ? (
        <span style={{
          font: "700 13px/1.5 var(--font-sans)", letterSpacing: "0.34em",
          textTransform: "uppercase", color: "var(--brand)", whiteSpace: "nowrap",
        }}>{eyebrow}</span>
      ) : null}
      <h2 style={{ font: "var(--h2)", letterSpacing: "var(--ls-h2)", color: "var(--ink)", margin: 0 }}>
        {children}
      </h2>
      <span style={{ width: 96, height: 4, borderRadius: "var(--r-pill)", background: "linear-gradient(90deg, var(--brand), var(--ink-mauve))" }}></span>
    </div>
  );
}

Object.assign(window, { Icon, IconWell, NeoButton, Eyebrow, SectionTitle });
