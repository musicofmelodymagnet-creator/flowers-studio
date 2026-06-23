// FLORINSKY UI Kit — "Our Premium Distinction" accordion (inset panel)
const { useState: useStateD } = React;

const DISTINCTIONS = [
  {
    t: "Floral realism that leaves your guests in awe.",
    d: "Every bloom is selected and placed by hand for true botanical realism — petal depth, tonal variation, the soft asymmetry of a living garden. Guests reach out to touch it, certain it was cut this morning.",
  },
  {
    t: "One-of-a-kind design in all of Canada.",
    d: "Our compositions are developed in-atelier and never mass-produced. From Vancouver to Halifax, you will not find a wall like yours anywhere else in the country.",
  },
  {
    t: "What if the wall color turns out to be different?",
    d: "We colour-match to your palette and confirm with physical swatches before production begins. The wall you approve is the wall that arrives — guaranteed, in writing.",
  },
  {
    t: "The perfect solution for large groups of guests.",
    d: "Modular panels scale from an intimate eight-foot backdrop to a sweeping forty-foot feature, so every guest enjoys a flawless photo moment — no queues, no compromise.",
  },
  {
    t: "No basic flower walls like everyone else has.",
    d: "We retire a design the moment it becomes common. Your backdrop is built from rare varietals and couture arrangements, never the carnation grids found at every other event.",
  },
  {
    t: "Don't let the venue's terrain limit your ideas.",
    d: "Sloped lawns, uneven ballrooms, open terraces — our self-levelling frame system adapts to any surface, indoors or out, with a concealed structure that stays perfectly plumb.",
  },
  {
    t: "Wall reliability matters more than pretty photos.",
    d: "Each frame is load-tested and wind-rated, with locking joints and a weighted base. It stands secure from the first toast to the last dance.",
  },
  {
    t: "Our commitments are backed by money.",
    d: "Timing, colour, and stability are covered by a written guarantee. If we miss the mark on what we promised, you are refunded — no negotiation required.",
  },
];

function DistinctionRow({ index, item, open, onToggle }) {
  const [hover, setHover] = useStateD(false);
  return (
    <div style={{
      borderRadius: 24, background: "var(--surface)",
      boxShadow: open ? "var(--elev-hover)" : "var(--elev-sm)",
      transition: "box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease)",
      transform: hover && !open ? "translateY(-2px)" : "translateY(0)",
      overflow: "hidden",
    }}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "100%", border: "none", background: "transparent", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 22, padding: "24px 28px", textAlign: "left",
        }}
      >
        <span style={{
          font: "700 16px/1 var(--font-sans)", letterSpacing: "0.04em",
          color: open ? "var(--brand-deep)" : "var(--brand)", flex: "none", width: 28,
          transition: "color var(--dur) var(--ease)",
        }}>{String(index + 1).padStart(2, "0")}</span>
        <span style={{
          flex: 1, font: "600 19px/1.4 var(--font-sans)",
          color: open ? "var(--brand-deep)" : "var(--ink)",
          transition: "color var(--dur) var(--ease)",
        }}>{item.t}</span>
        <span style={{
          width: 38, height: 38, flex: "none", borderRadius: "var(--r-pill)",
          display: "grid", placeItems: "center",
          boxShadow: open ? "var(--inset-sm)" : "var(--elev-sm)",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease)",
        }}>
          <Icon name="chevron-down" size={20} color={open ? "var(--brand-deep)" : "var(--ink-mauve)"} stroke={2} />
        </span>
      </button>
      <div style={{
        maxHeight: open ? 240 : 0, opacity: open ? 1 : 0,
        transition: "max-height var(--dur) var(--ease), opacity var(--dur) var(--ease)",
      }}>
        <div style={{ padding: "0 28px 26px 78px" }}>
          <span style={{ display: "block", width: 48, height: 3, borderRadius: 9999, background: "var(--brand-soft)", marginBottom: 16 }}></span>
          <p style={{ font: "var(--body-lg)", fontSize: 16, color: "var(--ink-soft)", margin: 0, maxWidth: 760 }}>{item.d}</p>
        </div>
      </div>
    </div>
  );
}

function Distinction() {
  const [open, setOpen] = useStateD(0);
  return (
    <section style={{
      width: "100%", maxWidth: 1072, borderRadius: "var(--r-panel)",
      background: "var(--surface-distinct)", boxShadow: "var(--inset-lg)",
      padding: "72px 72px 76px", display: "flex", flexDirection: "column", gap: 48,
    }}>
      <SectionTitle eyebrow="Why FLORINSKY">Our Premium Distinction</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {DISTINCTIONS.map((item, i) => (
          <DistinctionRow
            key={i}
            index={i}
            item={item}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Distinction });
