// FLORINSKY UI Kit — top nav, hero, features
const { useState: useStateS } = React;

function NavLink({ label, active, onClick }) {
  const [hover, setHover] = useStateS(false);
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        font: active ? "600 16px/1.5 var(--font-sans)" : "500 16px/1.5 var(--font-sans)",
        textDecoration: "none",
        color: active ? "var(--brand-deep)" : hover ? "var(--brand)" : "var(--ink-soft)",
        transition: "color var(--dur) var(--ease)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <span style={{
        position: "absolute", left: "50%", bottom: -10, transform: "translateX(-50%)",
        width: active ? 6 : 0, height: 6, borderRadius: 9999, background: "var(--brand)",
        transition: "width var(--dur) var(--ease)",
      }}></span>
    </a>
  );
}

function TopNav() {
  const links = ["Gallery", "Collections", "Process", "Testimonials", "About", "Contact"];
  const [active, setActive] = useStateS(null);
  return (
    <nav style={{ padding: "20px 64px", display: "flex", justifyContent: "center", width: "100%" }}>
      <div style={{
        height: 60, borderRadius: "var(--r-pill)",
        background: "var(--bg)", boxShadow: "var(--elev-md)",
        display: "inline-flex", alignItems: "center", gap: 44, padding: "0 52px",
      }}>
        {links.map((l) => (
          <NavLink key={l} label={l} active={active === l} onClick={() => setActive(l)} />
        ))}
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 64, padding: "40px 0 8px" }}>
      {/* Wordmark + tagline with accent flourishes */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <span style={{
          font: "var(--wordmark)", letterSpacing: "var(--ls-wordmark)",
          color: "var(--brand)",
        }}>FLORINSKY</span>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ width: 40, height: 1.5, background: "var(--brand-soft)" }}></span>
          <Eyebrow>The Art of Floral Design</Eyebrow>
          <span style={{ width: 40, height: 1.5, background: "var(--brand-soft)" }}></span>
        </div>
      </div>

      {/* Framed hero image — cream matte plate with large elevation */}
      <div style={{
        width: "100%", maxWidth: 1072, borderRadius: "var(--r-card)",
        background: "var(--surface)", boxShadow: "var(--elev-lg)", padding: 16,
      }}>
        <div style={{ borderRadius: "calc(var(--r-card) - 16px)", overflow: "hidden", aspectRatio: "1040 / 585" }}>
          <img
            src="assets/hero-flower-wall.jpg" alt="Premium flower wall"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>

      {/* Headline + subcopy + CTAs */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36, textAlign: "center" }}>
        <h1 style={{ font: "var(--h1)", letterSpacing: "-0.01em", color: "var(--ink-mauve)", margin: 0, maxWidth: 1050 }}>
          Make your event<br />with premium flower walls
        </h1>
        <p style={{ font: "var(--body-lg)", color: "var(--ink-soft)", margin: 0, maxWidth: 672 }}>
          We create stunning backdrops for weddings, corporate events, and private
          parties. Each wall is a masterpiece inspired by nature and high fashion.
        </p>
        <div style={{ display: "flex", gap: 24, padding: "8px 0 0" }}>
          <NeoButton color="var(--ink-mauve)">Explore Designs</NeoButton>
          <NeoButton color="var(--ink-soft)">Our Process</NeoButton>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({ icon, title, body }) {
  const [hover, setHover] = useStateS(false);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: "var(--r-card)", background: "var(--surface-rose)",
        boxShadow: "var(--elev-md)", padding: "40px 32px 48px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        transition: "transform var(--dur) var(--ease)",
      }}
    >
      <IconWell name={icon} />
      <h3 style={{ font: "var(--h3)", letterSpacing: "-0.01em", color: "var(--ink)", margin: "6px 0 0" }}>{title}</h3>
      <p style={{ font: "var(--body)", color: "var(--ink-soft)", margin: 0, maxWidth: 252 }}>{body}</p>
    </article>
  );
}

function Features() {
  const items = [
    { icon: "truck", title: "Local Delivery", body: "Prompt delivery and setup across Toronto and the surrounding GTA." },
    { icon: "wrench", title: "Pro Setup", body: "Our specialists handle every detail, ensuring a flawless photo zone appearance." },
    { icon: "palette", title: "Bespoke Style", body: "Unique floral compositions created specifically for your celebration's theme." },
  ];
  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, width: "100%", maxWidth: 1072 }}>
      {items.map((it) => <FeatureCard key={it.title} {...it} />)}
    </section>
  );
}

Object.assign(window, { TopNav, Hero, Features });
