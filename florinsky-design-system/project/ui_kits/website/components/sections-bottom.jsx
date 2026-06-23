// FLORINSKY UI Kit — collections, inquiry form, footer
const { useState: useStateB } = React;

function CollectionCard({ title, src }) {
  const [hover, setHover] = useStateB(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: "var(--r-card)", background: "var(--frame)",
        boxShadow: "var(--elev-md)", padding: 16, cursor: "pointer",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        transition: "transform var(--dur) var(--ease)",
      }}
    >
      <div style={{ position: "relative", borderRadius: "calc(var(--r-card) - 16px)", overflow: "hidden", aspectRatio: "293 / 384" }}>
        <img src={src} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {/* Frosted caption bar with view-details affordance */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, padding: "18px 22px",
          background: "rgba(249,244,240,0.45)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <span style={{ font: "600 17px/1.4 var(--font-sans)", color: "var(--ink)" }}>{title}</span>
          <span
            title={"View details about " + title}
            style={{
              width: 32, height: 32, flex: "none", borderRadius: "var(--r-pill)",
              display: "grid", placeItems: "center", background: "rgba(249,244,240,0.7)",
              boxShadow: hover ? "var(--elev-sm)" : "none",
              transition: "box-shadow var(--dur) var(--ease)",
            }}
          >
            <Icon name="arrow-up-right" size={18} color="var(--ink-mauve)" stroke={2} />
          </span>
        </div>
      </div>
    </div>
  );
}

function Collections() {
  const cards = [
    { title: "Classic Rose", src: "assets/collection-classic-rose.png" },
    { title: "Tropical Escape", src: "assets/collection-tropical-escape.png" },
    { title: "Whimsical Hydrangea", src: "assets/collection-whimsical-hydrangea.png" },
  ];
  return (
    <section style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56, width: "100%", maxWidth: 1072 }}>
      <SectionTitle eyebrow="Curated Backdrops">Collections</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, width: "100%" }}>
        {cards.map((c) => <CollectionCard key={c.title} {...c} />)}
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ font: "var(--label)", color: "var(--ink-soft)", paddingLeft: 16 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", border: "none", outline: "none", boxSizing: "border-box",
  borderRadius: "var(--r-pill)", background: "var(--surface)",
  boxShadow: "var(--inset-input)", padding: "17px 24px",
  font: "var(--body)", color: "var(--ink)",
};

function InquiryForm() {
  const [sent, setSent] = useStateB(false);
  return (
    <section style={{
      width: "100%", maxWidth: 896, borderRadius: "var(--r-panel)",
      background: "var(--surface-form)", boxShadow: "var(--inset-form)",
      padding: "88px 88px 92px", display: "flex", flexDirection: "column", gap: 56,
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
        <span style={{ font: "700 13px/1.5 var(--font-sans)", letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--brand)", whiteSpace: "nowrap" }}>Book Your Date</span>
        <h2 style={{ font: "var(--h2-lg)", letterSpacing: "-0.025em", color: "var(--ink)", margin: 0 }}>
          Inquire about your Date
        </h2>
        <p style={{ font: "var(--body)", color: "var(--ink-soft)", opacity: 0.8, margin: 0 }}>
          Fill out the form below and we will get back to you within 24 hours.
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        style={{ display: "flex", flexDirection: "column", gap: 28 }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <Field label="Name"><input style={inputStyle} placeholder="Your name" /></Field>
          <Field label="Email"><input style={inputStyle} type="email" placeholder="example@mail.com" /></Field>
        </div>

        <Field label="Event Date">
          <div style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <input
              type="text" placeholder="mm/dd/yyyy"
              style={{ border: "none", outline: "none", background: "transparent", font: "var(--body)", color: "var(--ink)", flex: 1 }}
            />
            <Icon name="calendar" size={20} color="var(--ink-muted)" />
          </div>
        </Field>

        <Field label="Message">
          <textarea
            placeholder="Describe your wishes..." rows={4}
            style={{ ...inputStyle, borderRadius: "var(--r-card)", resize: "none", lineHeight: 1.5 }}
          ></textarea>
        </Field>

        <div style={{ display: "flex", justifyContent: "center", padding: "32px 0 0" }}>
          <NeoButton variant="solid" spacing="var(--ls-cta)" color="var(--ink-mauve)">
            {sent ? "Thank You" : "Send Inquiry"}
          </NeoButton>
        </div>
      </form>
    </section>
  );
}

function SocialStrip() {
  const socials = ["instagram", "facebook", "twitter"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, padding: "32px 0" }}>
      <Eyebrow>Follow Our Journey</Eyebrow>
      <div style={{ display: "flex", gap: 32 }}>
        {socials.map((s) => (
          <a key={s} href="#" onClick={(e) => e.preventDefault()} style={{
            width: 64, height: 64, borderRadius: "var(--r-pill)",
            background: "var(--bg)", boxShadow: "var(--elev-md)",
            display: "grid", placeItems: "center",
          }}>
            <Icon name={s} size={23} color="var(--ink)" stroke={1.75} />
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const links = ["Terms of Use", "Privacy Policy", "FAQ"];
  return (
    <footer style={{ width: "100%", background: "var(--footer-bg)", padding: "64px 104px", marginTop: 24 }}>
      <div style={{
        maxWidth: 1072, margin: "0 auto", display: "flex",
        justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ font: "var(--wordmark-sm)", color: "var(--on-dark)" }}>FLORINSKY</span>
          <span style={{ font: "var(--body)", color: "var(--on-dark)", opacity: 0.7 }}>
            © 2026 FLORINSKY. All rights reserved.
          </span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
          {links.map((l) => (
            <a key={l} href="#" onClick={(e) => e.preventDefault()}
               style={{ font: "var(--body)", color: "var(--on-dark)", textDecoration: "none", opacity: 0.85 }}>{l}</a>
          ))}
          <a href="#" onClick={(e) => e.preventDefault()} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--on-dark)", textDecoration: "none" }}>
            <Icon name="instagram" size={16} color="var(--on-dark)" /> Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Collections, InquiryForm, SocialStrip, Footer });
