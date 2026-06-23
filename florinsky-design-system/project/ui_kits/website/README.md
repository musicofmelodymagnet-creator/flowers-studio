# FLORINSKY — Website UI Kit

High-fidelity recreation of the FLORINSKY marketing site (single-page premium
flower-wall rental), rebuilt from the source Figma in the soft pastel
neumorphism style — with the harmony fixes described in the root `README.md`.

## Run
Open `index.html`. React + Babel are loaded from CDN; icons from Lucide; fonts
from Google Fonts. No build step.

## Files
| File | Contents |
|---|---|
| `index.html` | App shell — assembles all sections, loads fonts/icons/tokens |
| `colors_and_type.css` | Design tokens (copy of the root file, kept local so the kit is portable) |
| `components/parts.jsx` | `Icon`, `IconWell`, `NeoButton`, `Eyebrow`, `SectionTitle` |
| `components/sections-top.jsx` | `TopNav`, `Hero`, `Features` |
| `components/distinction.jsx` | `Distinction` — "Our Premium Distinction" accordion (8 expandable rows) |
| `components/sections-bottom.jsx` | `Collections`, `InquiryForm`, `SocialStrip`, `Footer` |
| `image-slot.js` | User-fillable drop target for the two missing collection photos |
| `assets/` | Hero + Classic Rose photos |

## Interactions (cosmetic, not production)
- Nav links highlight the active item.
- Buttons depress (outset → inset shadow) on press.
- Inquiry form: submitting flips the CTA label to "Thank You".
- **Our Premium Distinction**: single-open accordion — click any row to expand its
  detail; open row gets accent treatment and an inverted chevron.
- Collection cards lift on hover and show a clickable “view details” affordance.

## Notes
- Designed at 1280px width (centered 1200 column); scales down responsively.
- Icons are **Lucide** (line, 1.75 stroke) — a documented substitution for the
  source's mixed Material-Symbols/SVG set. See root README → ICONOGRAPHY.
