# FLORINSKY Atelier — Design System

**FLORINSKY** is a premium atelier that designs and rents **bespoke floral walls** —
lush photo-zone backdrops for weddings, corporate events, and private parties.
The brand voice is editorial and high-fashion; the product is a luxury rental
service ("The Art of Floral Design"). The single marketing site walks a visitor
from an aspirational hero through service highlights, a curated collections
gallery, and a date-inquiry form.

The aesthetic is **soft pastel premium neumorphism**: warm rose-and-cream
surfaces that appear gently extruded from the page, matched light/dark shadow
pairs, fully-rounded pills, and large 32–48px card radii. No hard borders, no
flat fills — depth comes entirely from light.

---

## Source

- **Figma file:** `Florinsky.fig` (mounted virtual filesystem). Single page
  `Page-1` → frame `Html → Body` (node `1:2`), a 1280px-wide marketing page.
  Local components: `LocalDelivery` (feature card), `ClassicRose` (collection
  card), `Link`/`Link2` (nav + footer links), `SpinbuttonMonthMm` (date field).
- Only two of four bitmap images were extractable from the binary (hero +
  Classic Rose); the Tropical Escape and Whimsical Hydrangea collection photos
  were supplied separately by the user and now live in `assets/`.

### Refinements applied
The source had a few harmony breaks; this system tunes them while honoring the
brand's chosen direction:
1. **Wordmark color** — a saturated lilac `--brand: #A878D0` (richer than the
   source violet, kept lilac not blue) ties the wordmark to the lilac surfaces.
2. **Inquiry form panel** — kept the **cool grey-blue** `#D4D6DB` with cool inset
   shadows exactly as in the Figma, as a deliberate cool counterpoint to the
   warm scheme.
3. **Footer** — spans the **full viewport width** (full-bleed deep-mauve plate).
4. **Footer social icons** — one rendered as a stray "✕" close glyph and one as
   a raw Material-Symbols text token. Standardized on a clean line-icon set.
5. **Top nav** — widened to hold six items (Gallery, Collections, Process,
   Testimonials, About, Contact).
6. **Collection cards** — bolder titles + an `arrow-up-right` affordance marking
   each card as clickable to view wall details. Hero photo & its white frame use
   concentric radii for an even border.
7. **Unified shadows** — all elevations now share one translucent highlight/shade
   pair at consistent strength (see Visual Foundations).
8. **New section — Our Premium Distinction**: an inset lilac panel of eight
   expandable accordion rows (guarantees / objections), placed before the
   inquiry form. Accent eyebrows, gradient title rules, and full button
   hover/press states were added throughout for premium polish.

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `README.md` | This file — context, content + visual foundations, iconography |
| `colors_and_type.css` | All design tokens: color, neumorphic shadows, type, radii, spacing |
| `SKILL.md` | Agent-Skills manifest for reuse in Claude Code |
| `assets/` | Hero & collection photos, social/feature SVG icons |
| `preview/` | Design-system specimen cards (shown in the Design System tab) |
| `ui_kits/website/` | High-fidelity recreation of the marketing site + components |

---

## CONTENT FUNDAMENTALS

**Voice — editorial luxury.** Copy reads like a high-fashion lookbook, not a
hardware store. Short, evocative, confident. Nature-meets-couture framing:
*"Each wall is a masterpiece inspired by nature and high fashion."*

- **Person:** Brand speaks as **"we"**; addresses the reader as **"you / your"**.
  *"We create stunning backdrops…"*, *"Inquire about your Date"*.
- **Casing:** Two deliberate registers —
  - **Title Case** for headings & section titles: *"Make your event"*, *"Collections"*, *"Bespoke Style"*, *"Inquire about your Date"*.
  - **ALL-CAPS with wide letter-spacing** for eyebrows, button labels & social
    headers: *THE ART OF FLORAL DESIGN*, *EXPLORE DESIGNS*, *OUR PROCESS*,
    *SEND INQUIRY*, *FOLLOW OUR JOURNEY*. This is the brand's signature device —
    caps + tracking signals premium restraint.
- **Sentence copy** stays Title-light / sentence case: *"Fill out the form below
  and we will get back to you within 24 hours."*
- **Length:** headlines 2–6 words; card descriptions one tight sentence
  (~10–14 words); subcopy two lines max.
- **No emoji. No exclamation marks.** Tone is calm and assured.
- **Vocabulary:** "bespoke", "masterpiece", "compositions", "celebration",
  "atelier", "photo zone", "flawless". Avoid salesy/discount language.
- **Wordmark:** **FLORINSKY** always set in Playfair Display, often paired with
  the tagline eyebrow *THE ART OF FLORAL DESIGN*.

---

## VISUAL FOUNDATIONS

**Overall vibe.** Quiet, expensive, tactile. Everything looks softly pressed
into — or gently lifted out of — a warm rose-cream sheet of clay. Light is the
only structural device; there are essentially no strokes.

### Color
- **Base** is a warm rose-beige `#EADCDB`; raised elements are cream `#F9F4F0`.
- **Two accent surfaces**: dusty-rose `#DECED2` (feature cards) and the photo
  **frame** `#C3BDCF` (the lilac matte around each collection photo). A third
  inset surface, distinction lilac `#DBCFE2`, backs the Premium-Distinction
  panel. The cool form panel `#D4D6DB` is a deliberate counterpoint.
- **Ink is warm brown**, never black: `#2D2626` headings, `#4E4444` body,
  `#6B5A5B` mauve for the hero headline & button labels.
- **Accent** saturated lilac `#A593B5`→`#A878D0` for the wordmark and the small
  underline rule.
- **Footer** is a deep mauve `#63535B` with cream text — the only dark plate.
- Palette is analogous: rose → mauve → lilac, all low-chroma pastels. Keep new
  colors inside that arc (use `oklch` near L 0.8–0.95, C 0.02–0.06, H 350–320).

### Neumorphic shadow system (the core motif)
**One unified system, consistent strength.** Rather than per-surface shadow
colors, every elevation uses a single translucent pair — a white highlight
`--nm-light` (top-left) and a neutral warm-mauve shade `--nm-dark` (bottom-right)
— so depth reads identically on any surface (warm, cool, rose, lilac). Only the
tier changes:
- **`--elev-sm`** ±5/12 · inputs-adjacent, small tiles, social pills.
- **`--elev-md`** ±9/18 · nav, buttons, cards (rest).
- **`--elev-lg`** ±16/32 · hero plate, big features.
- **`--elev-hover`** ±12/24 · the raised hover state.
- **Pressed / wells** use the matching `--inset-sm / -md / -lg` (same pair,
  inset). The form panel and the Premium-Distinction panel are full inset wells.
- Buttons are near-transparent fills that read only via shadow — carved from the
  page. Full state model below.

### Type
- **Display:** Playfair Display — reserved for the FLORINSKY wordmark (68px hero,
  28px footer). High-contrast serif = the couture note.
- **Everything else:** Plus Jakarta Sans. Hero H1 80/100 Bold; section H2 48/56
  Bold; form H2 54 Bold; card H3 32/40 Bold; body 16–18; labels 16 Bold.
- Wide tracking on caps (eyebrow 8px, CTA 4px, buttons 1.6px); tight negative
  tracking on big display headings.

### Shape, spacing, layout
- **Radii:** pills `9999px` (buttons, nav, inputs, social), cards `32px`,
  large panels `48px`. Nothing sharp.
- **Spacing** on an 8pt grid; generous — section gaps 48–96px, card padding
  32px, panel padding 80px.
- **Layout** is a single centered 1200px column on the 1280 canvas; everything
  is centered and symmetrical. Cards sit in even 3-up rows with equal gaps.
- **Images** are photographic, full-color, warm and luminous (creamy whites,
  blush pinks, soft daylight). They live inside rounded 32px frames with a
  cream "matte" border created by the surrounding raised plate. Collection
  cards add a frosted-glass caption bar (`backdrop-filter: blur(10px)` over a
  45%-opacity cream fill).

### Motion & states
- Subtle and slow; `cubic-bezier(0.22,1,0.36,1)`, ~280ms. Fades and gentle lifts
  only — no bounces, no infinite loops.
- **Buttons** carry a full three-state model: **rest** (`--elev-md`) → **hover**
  (lift −3px, deepen to `--elev-hover`, text shifts to `--brand-deep`) →
  **press** (swap to `--inset-md`, sink with `scale(0.97)`). This in/out toggle
  is the brand's signature interaction.
- **Cards** (feature, collection) lift ~6px on hover.
- **Accordion rows** (Premium Distinction) deepen to `--elev-hover` when open;
  number + title shift to accent, the chevron well inverts to inset and rotates.
- **Nav links** shift to `--brand` on hover, `--brand-deep` + an accent dot when
  active.

### Backgrounds & texture
- Flat warm `--bg` fill — no gradients, no patterns, no grain. Depth is shadow,
  not texture. Avoid decorative gradient washes entirely.

---

## ICONOGRAPHY

The source mixed Material Symbols (Outlined) glyphs with a couple of inline
SVGs, and two footer icons were broken in the export. This system standardizes
on a **single clean line-icon family**:

- **Substitution flagged:** UI icons use **[Lucide](https://lucide.dev)** (1.75px
  stroke, rounded line caps) loaded from CDN — it matches the soft, thin,
  rounded neumorphic aesthetic and the original Material-Symbols *Outlined*
  weight far better than mixed sources. The few authentic source SVGs are kept
  in `assets/icons/` for reference.
- **Where icons appear & their Lucide names:**
  - Feature cards: `truck` (Local Delivery), `wrench` (Pro Setup),
    `palette` (Bespoke Style).
  - Footer social: `instagram`, `facebook`, `twitter` (the broken "✕" was the
    X/Twitter mark), plus `globe`/`link` for the generic "Social" link.
  - Date field: `calendar`.
- **Icon presentation:** every icon sits inside a **circular inset well** —
  a `9999px` disc with `--inset-md`, icon stroked in `--ink-mauve` at ~28–32px.
  This pressed-disc treatment is the standard icon container.
- **No emoji, no unicode glyphs** as icons. If a needed icon is missing from
  Lucide, pick the nearest Lucide match rather than mixing families.

> If you have the original brand icon set (or the two missing collection
> photos), drop them in `assets/` and we'll swap them in.
