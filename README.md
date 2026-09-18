# Student Text Hub — Website Repository

**Module:** WEDE5020 — Web Development
**Student:** Nqobile Sibongile Ngcobo (ST10529659)

## Project Overview

Student Text Hub is a hypothetical student‑to‑student marketplace that lets
students buy, sell, rent and borrow academic textbooks. The site was
proposed in Part 1 and is being built out across Part 1 (content and
structure) and Part 2 (visual design and responsiveness) of this module's
assignment.

## File Structure

```
WED DEVELOPMENT/
├── home.html        # single HTML page containing all four sections (Home, About, Services, Contact)
├── css/
│   └── styles.css    # external stylesheet — all visual and responsive styling
├── image.png          # hero/header image
└── README.md          # this document
```

Keeping the stylesheet in its own `css` folder, separate from the markup,
follows standard front‑end practice of separating structure (HTML) from
presentation (CSS), which keeps the project easier to update and scale as
more pages or assets are added (Sklar, 2016).

## Part 2 — Design Summary

### Typography
Headings and body text use a `Poppins`/Arial stack with a defined type
scale (`--fs-sm` to `--fs-xxl`) set with `rem` units, so the whole page
scales predictably if a user changes their base font size — a technique
recommended for accessible, harmonious typography (MDN, 2024a).

### Colour Palette
The palette from the Part 1 proposal was carried through using CSS custom
properties (`:root` variables) so that colour is controlled from a single
location:

| Colour | Hex | Use |
|---|---|---|
| Dark blue | `#123B5D` | headers, navigation, branding |
| Light blue | `#EAF4FB` | backgrounds, info sections |
| White | `#FFFFFF` | page background |
| Orange | `#F39C12` | buttons and calls to action |
| Dark grey | `#333333` | body text |

Colour and contrast choices were checked against the Web Content
Accessibility Guidelines' minimum contrast requirements so that text
remains readable for users with different vision abilities (W3C, 2023).

### Layout
- **Flexbox** is used for the header/navigation bar, so the logo and menu
  align in a single row on desktop and wrap cleanly on smaller screens
  (MDN, 2024b).
- **CSS Grid** is used for the hero section, the About cards, the four
  Services cards and the search form, giving a clear multi‑column desktop
  layout that can collapse to fewer columns at each breakpoint (MDN,
  2024c).
- Interactive states (`:hover`, `:focus`, `:active`) are applied to
  navigation links, buttons and form fields so the interface gives clear
  visual feedback, which supports both usability and keyboard
  accessibility (Nielsen Norman Group, 2024).

### Responsive Design
Two breakpoints were implemented using `em`‑based media queries, which
keeps breakpoints tied to the user's font size rather than a fixed pixel
value (MDN, 2024d):

| Breakpoint | Range | Behaviour |
|---|---|---|
| Desktop | > 768px | Multi-column grid layout (4‑column services, 2‑column about/search) |
| Tablet | ≤ 768px (48em) | Header stacks, services/about drop to 2 columns, search form drops to 1 column |
| Mobile | ≤ 480px (30em) | Fully single‑column layout, full‑width buttons, stacked navigation |

Relative units (`rem`, `em`, `%`) are used throughout for spacing, type
and widths instead of fixed pixel values, which is the approach
recommended for building flexible, device‑agnostic layouts (Marcotte,
2010). The header image also carries `srcset`/`sizes` attributes so the
browser can choose an appropriately sized image for the viewport, in line
with responsive image guidance (MDN, 2024e); a next iteration of this
project would add two or three actual image resolutions to make full use
of this attribute.

Layout and spacing were checked and adjusted using browser developer
tools' device toolbar, which is the standard way to test a responsive
layout without needing physical devices for every screen size (Nielsen
Norman Group, 2024).

### Screenshot Evidence
*(Insert screenshots here before submission.)*

Open `home.html` in a browser, open Developer Tools (F12) → the device
toolbar, and capture the page at three widths, then paste the images into
this section:

- **Desktop** (≥ 1200px)
- **Tablet** (≈ 768px, e.g. iPad)
- **Mobile** (≈ 375–414px, e.g. iPhone)

## Changelog

> All edits made after the release of Part 1 marks/feedback, and all
> Part 2 work, are logged below with the most recent entry first.

### [Part 2] — CSS Styling and Responsive Design
- **Added** external stylesheet `css/styles.css` and linked it from
  `home.html` (replacing the previous unstyled markup).
- **Added** CSS custom properties (`:root` variables) for the colour
  palette and typography scale proposed in Part 1.
- **Added** a type scale using `font-family`, `font-size`, `font-weight`,
  `line-height` and `letter-spacing` for consistent, harmonious
  typography across headings and body text.
- **Added** Flexbox layout for the header/navigation and CSS Grid layout
  for the hero, About cards, Services cards and search form, to create a
  clear desktop layout using a minimum number of selectors.
- **Added** visual styling (`background-color`, `border`, `border-radius`,
  `box-shadow`) to cards and buttons, plus `:hover`, `:focus` and
  `:active` pseudo‑classes on links, buttons and form fields.
- **Added** responsive design: two `em`‑based media query breakpoints
  (tablet ≤ 768px, mobile ≤ 480px), relative units (`rem`/`em`/`%`)
  throughout, and `srcset`/`sizes` on the hero image.
- **Fixed** invalid `<image>` tag in the header, replaced with a
  semantically correct `<img>` element with descriptive `alt` text.
- **Added** a proper `<nav>` landmark with `aria-label="Primary"` around
  the navigation menu, and wrapped the four page sections in a `<main>`
  landmark, improving the document's semantic structure and
  screen‑reader navigation.
- **Fixed** form accessibility: every `<label>` is now explicitly
  associated with its input via matching `for`/`id` attributes, so
  assistive technology announces the correct label for each field
  (W3C, 2023).
- **Added** `lang="en"` and a `viewport` meta tag to `<head>`, which is
  required for the responsive breakpoints to work correctly on mobile
  browsers (MDN, 2024d).

### [Part 1 feedback] — Corrections carried into this build
- Reviewed the mark/feedback for Part 1 and applied the general markup
  and accessibility corrections above (semantic `<nav>`/`<main>`,
  corrected `<img>` tag, label/input associations) as part of preparing
  the page for CSS styling.
- **Note to lecturer:** the specific written feedback comments for Part 1
  were not available at the time of this submission. If particular
  content or structural corrections were requested, please advise and
  they will be logged here as a dated follow‑up entry.

## References

1. Marcotte, E. (2010) *Responsive Web Design*. A List Apart, 25 May.
   Available at: https://alistapart.com/article/responsive-web-design/
   (Accessed: 13 September 2026).

2. MDN Web Docs (2026c) *Responsive web design*. Mozilla. Available at:
   https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
   (Accessed: 13 September 2026).

3. MDN Web Docs (2026e) *CSS styling basics*. Mozilla. Available at:
   https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics
   (Accessed: 13 September 2026).

4. MDN Web Docs (2026f) *CSS grid layout*. Mozilla. Available at:
   https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
   (Accessed: 13 September 2026).

5. MDN Web Docs (2026g) *Basic concepts of flexbox*. Mozilla. Available at:
   https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox
   (Accessed: 13 September 2026).

6. Nielsen Norman Group (2024) *User experience*. Available at:
   https://www.nngroup.com/ (Accessed: 13 September 2026).

7. Sklar, J. (2016) *Principles of Web Design*. 6th edn. Boston: Cengage
   Learning.

8. World Wide Web Consortium (W3C) (2023) *Web Content Accessibility
   Guidelines (WCAG) 2.2*. Available at: https://www.w3.org/TR/WCAG22/
   (Accessed: 13 September 2026).

> These references cover the CSS/responsive-design sources cited in this
> Part 2 documentation specifically. They sit alongside — not in place
> of — the full Harvard reference list already submitted with your Part 1
> proposal document.
