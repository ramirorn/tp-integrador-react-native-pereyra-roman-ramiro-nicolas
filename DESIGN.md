---
name: Biblioteca IPF
description: A mint-and-forest-green bookshelf for a school library, where covers sit on pale mint plates and deep green marks every action.
colors:
  forest: "#0E4D3A"
  forest-deep: "#0A3328"
  mint: "#3DDC97"
  mint-light: "#BDF2D7"
  mint-plate: "#DDF6EA"
  canvas: "#F3FCF8"
  surface: "#FFFFFF"
  ink: "#0D1F19"
  ink-muted: "#4C6359"
  ink-on-forest: "#E8F7EF"
  ink-on-forest-soft: "#A9D9C2"
  hairline: "#D5E7DC"
  success: "#13704F"
  success-soft: "#D6F3E4"
  error: "#B42318"
  error-soft: "#FDE6E3"
  warning: "#8A4B0B"
  warning-soft: "#FCEFD8"
  disabled-fill: "#E2F1E9"
  camera-black: "#000000"
typography:
  display:
    fontFamily: "System (San Francisco on iOS, Roboto on Android)"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "System"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "32px"
    letterSpacing: "-0.4px"
  title:
    fontFamily: "System"
    fontSize: "22px"
    fontWeight: 700
  subtitle:
    fontFamily: "System"
    fontSize: "17px"
    fontWeight: 700
  body:
    fontFamily: "System"
    fontSize: "15px"
    fontWeight: 400
  caption:
    fontFamily: "System"
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: "System"
    fontSize: "11px"
    fontWeight: 600
rounded:
  cover: "8px"
  control: "14px"
  tile: "20px"
  card: "24px"
  hero: "28px"
  bar: "32px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.ink-on-forest}"
    typography: "{typography.subtitle}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "56px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.forest}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "56px"
  button-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.forest}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "56px"
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "56px"
  button-disabled:
    backgroundColor: "{colors.disabled-fill}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
  book-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
  book-card-plate:
    backgroundColor: "{colors.mint-plate}"
    padding: "16px"
  card-action:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.ink-on-forest}"
    rounded: "{rounded.pill}"
    size: "48px"
  card-action-done:
    backgroundColor: "{colors.mint-light}"
    textColor: "{colors.forest}"
    rounded: "{rounded.pill}"
    size: "48px"
  hero-banner:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.surface}"
    rounded: "{rounded.hero}"
    padding: "24px"
  category-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    height: "72px"
  category-tile-active:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.ink-on-forest}"
    rounded: "{rounded.tile}"
  stat-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px"
  stat-card-highlight:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.mint}"
    rounded: "{rounded.card}"
    padding: "16px"
  tab-bar:
    backgroundColor: "{colors.forest-deep}"
    textColor: "{colors.ink-on-forest-soft}"
    rounded: "{rounded.bar}"
    height: "68px"
  scan-button:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.forest-deep}"
    rounded: "{rounded.pill}"
    size: "64px"
  cover-fallback:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.ink-on-forest}"
    rounded: "{rounded.cover}"
    padding: "8px"
---

# Design System: Biblioteca IPF

## Overview

**Creative North Star: "The Mint Shelf"**

Book covers are the product, and the system exists to display them. Each cover rests on a pale mint plate, like a bookshop window, while every action (reserve, search, scan, confirm) is marked by deep forest green. Mint itself is the spark: it appears on the active tab, the raised scan button, and a highlighted figure, never as a large fill. The reference the student supplied was a mint/green mobile shop UI, and the build keeps its grammar: rounded white cards over a tinted canvas, pill buttons, and a floating dark bar with a raised centre button.

The mood is calm, fresh and tidy. Density is low to medium: a two-column shelf of cards, large touch targets (48px minimum, buttons 56px), generous 16 to 24px gutters. Depth is soft and tinted green, never grey or hard. All copy is clear Argentine Spanish (voseo) addressed to the student.

The course imposes hard structural rules that shape the code: every colour, size and spacing value lives in `src/constants/tema.ts`, styles use `StyleSheet.create` only, and no inline styles. Any new surface must add to `tema.ts` first.

**Key Characteristics:**
- Forest green for actions, mint for emphasis, mint plate for covers.
- Pill-shaped buttons and circular icon actions; cards at a 24px radius.
- Soft green-tinted shadows; no borders on cards.
- Floating tab bar with a raised centre scan action.
- Platform system font, bold titles, small tight scale.
- Pressed state is a uniform 0.75 opacity.

## Colors

A cool, minty neutral field with one dark green carrying all commitment and one bright mint accent.

### Primary
- **Forest Green** (#0E4D3A): primary buttons, card action circles, active filter tile, hero banner base, highlighted stat card, secondary text on light buttons.
- **Deep Forest** (#0A3328): the floating tab bar and the icon on the scan button; the deepest tone in the system.

### Secondary
- **Fresh Mint** (#3DDC97): active tab icon and label, the raised scan button, highlighted stat figure, end stop of the hero gradient. Spark only.
- **Light Mint** (#BDF2D7): the "already reserved" check circle.

### Neutral
- **Mint Plate** (#DDF6EA): the plate behind covers and the empty cover background; gradient end of the plate.
- **Mint Mist Canvas** (#F3FCF8): screen background, and the ring around the raised scan button.
- **Surface White** (#FFFFFF): cards, secondary and light buttons, inactive filter tiles, plate gradient start.
- **Shelf Ink** (#0D1F19): primary text.
- **Muted Moss** (#4C6359): secondary text, author lines, disabled text.
- **Pale Mint Text** (#E8F7EF) and **Soft Mint Text** (#A9D9C2): text and inactive icons on forest surfaces.
- **Hairline Green** (#D5E7DC): the single border, on secondary buttons.
- **Disabled Fill** (#E2F1E9): disabled button background.

### Status
- **Success** (#13704F) on **Success Soft** (#D6F3E4): copies available.
- **Warning** (#8A4B0B) on **Warning Soft** (#FCEFD8): waitlist state.
- **Error** (#B42318) on **Error Soft** (#FDE6E3): danger button, failures.
- **Camera Black** (#000000): scanner viewport only.
- **Fallback cover palette**: six book tones (#0E4D3A, #1F6F5C, #2D5A7B, #7A4E2D, #5B3F7A, #8C2F39) chosen by ISBN, used only when a cover image fails to load.

### Named Rules
**The Forest Commits Rule.** Anything that does something (reserve, search, confirm, filter on) is forest green. Mint never carries an action fill except the scan button.
**The Mint Spark Rule.** Mint (#3DDC97) is an accent on dark forest surfaces, never text on a light surface and never a large fill.
**The Tinted Neutral Rule.** Every neutral leans green. No pure grey and no pure black outside the camera.

## Typography

**Display / Body Font:** the platform system font (San Francisco on iOS, Roboto on Android); no custom face is loaded.

**Character:** Plain and legible, with personality coming from weight (bold titles against regular captions) and tight tracking on the hero title rather than from a typeface.

### Hierarchy
- **Figure** (700, 34px, tabular numerals): stat-card numbers.
- **Headline** (700, 28px, 32px line, -0.4 tracking): hero banner title.
- **Title** (700, 22px): screen and section titles.
- **Subtitle** (700, 17px): button labels.
- **Body** (400 to 700, 15px): book titles on cards (700), general text.
- **Caption** (400 to 600, 13px): authors, banner subline, filter labels (600).
- **Label** (600, 11px): tab labels and fallback-cover micro text.

### Named Rules
**The Bold Title, Quiet Caption Rule.** Hierarchy is carried by weight pairs (700 against 400/600), not by extra families or letter-spaced capitals.
**The Tabular Figures Rule.** Counts and numerals set in `tabular-nums`.

## Layout

A single column of vertically stacked blocks with a two-column card grid for the shelf. Gutters step on the 4px scale: 4, 8, 12, 16, 24, 32. Cards use 12px internal padding, the plate 16px vertical, the hero and stat blocks 24 and 16px. Touch targets are at least 48px; buttons 56px high. Lists end with a 132px reserve so the floating bar never covers content. The tab bar is 68px, inset 16px from the screen edges and 12px above the safe area. Layout is portrait phone only and adapts to Android and iOS through safe-area insets.

## Elevation & Depth

Hybrid: tonal layering (white cards on a mint canvas, covers on mint plates) plus soft, green-tinted drop shadows. Shadows are ambient, not structural, and always use the forest or ink hue.

### Shadow Vocabulary
- **Card** (`0px 8px 20px rgba(14, 77, 58, 0.10)`): book cards, stat cards, primary button, active filter tile.
- **Floating** (`0px 10px 24px rgba(10, 51, 40, 0.28)`): tab bar, scan button, hero banner.
- **Cover** (`0px 6px 12px rgba(13, 31, 25, 0.25)`): every book cover.

### Named Rules
**The Green Shadow Rule.** Shadows are tinted forest or ink at low opacity and offset downward. No grey or hard-edged shadows.
**The Gradient Is for Two Things Rule.** Gradients appear only on the hero banner (forest to mint, 135deg) and the cover plate (white to mint plate, 160deg).

## Shapes

Soft and rounded throughout. Pills (999px) for buttons and circular actions; 24px for cards and stat cards; 20px for filter tiles; 28px for the hero; 32px for the tab bar; 14px as the control radius; 8px for covers so they still read as books. The only border is a 1px hairline on secondary buttons; the scan button wears a 4px canvas-colored ring. The hero cover is rotated 6 degrees as the one deliberate tilt.

## Components

### Buttons
- **Shape:** full pill (999px), 56px high, 24px side padding, icon plus label in 8px gap.
- **Primary:** forest fill, pale mint 17px bold label, Card shadow.
- **Secondary:** white fill, forest label, 1px hairline border.
- **Light:** white fill, forest label; used on forest surfaces (hero).
- **Danger:** error red fill, white label.
- **Pressed / Disabled:** opacity 0.75 on press; disabled becomes pale mint fill with muted text and no shadow.

### Book Card
The cover is shown on a mint plate (white-to-mint gradient, 16px vertical padding) inside a white 24px-radius card with Card shadow. Below: 15px bold title (2 lines), 13px muted author. Footer pairs a status word (success green "N libres", or warning brown "En espera") with a 48px circular forest "add" action; once reserved the action turns light mint with a forest check.

### Cover
Real cover image at 2:3 ratio in four sizes (72, 132, 150, 210px high) with an 8px radius and Cover shadow. If the image fails, a typographic fallback fills the same box with one of six book tones and shows title (and author on larger sizes) in pale mint text.

### Hero Banner
Forest-to-mint diagonal gradient, 28px radius, Floating shadow, 24px padding. Left: white 28px bold two-line title, pale mint subline, light pill button. Right: a tilted cover.

### Category Filter Tiles
Equal-width tiles, 72px minimum height, 20px radius, icon above a 13px label. Inactive: white with forest icon. Active: forest with a mint icon and pale mint label, Card shadow.

### Stat Cards
White 24px cards with a muted caption over a 34px tabular bold figure. The highlighted variant flips to forest with a mint figure.

### Navigation
A floating deep-forest bar (68px, 32px radius, Floating shadow) with two tabs (outline icons that fill when active; inactive soft mint, active fresh mint, 11px labels). A 64px mint circle with a barcode icon is raised 22px above the centre; it is an action that opens the scanner, not a tab.

## Do's and Don'ts

### Do:
- **Do** add any new colour, size or spacing to `src/constants/tema.ts` and reference it; style with `StyleSheet.create` only.
- **Do** place every book cover on the mint plate and give it the Cover shadow.
- **Do** make interactive elements forest green and at least 48px (buttons 56px).
- **Do** tint every shadow with forest or ink at low opacity.
- **Do** give icon-only controls an `accessibilityLabel` and buttons `accessibilityRole="button"`.
- **Do** keep copy in clear Argentine Spanish and explain failures with a visible way forward.

### Don't:
- **Don't** use mint (#3DDC97) as a text colour on light surfaces or as a large fill.
- **Don't** add pure grey, pure black (outside the camera) or hard-edged shadows.
- **Don't** introduce rectangular buttons; actions are pills or circles.
- **Don't** put gradients on anything but the hero banner and the cover plate.
- **Don't** rely on cover images alone; every cover needs the typographic fallback.
- **Don't** use inline styles or hard-coded values in components.
