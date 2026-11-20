---
version: 1
slug: "src-app"
primary_target: "src/app"
related_targets: []
---

# Biblioteca IPF – app screens

Scope: every screen of the Expo app (catalog tab stack, Mis reservas tab, buscar, reservar modal, permisos modal, login, mostrador, 404). Mode: Operate. Audience: IPF students reserving books; staff at the counter. Constraints: course rules in PRODUCT.md (tema.ts tokens only, StyleSheet.create, no new native modules, Spanish copy).

## Direction contract

THESIS: The catalog is a boutique shelf where the book cover is the product: covers sit on soft mint plates and get the hero treatment a shop gives its flagship item. It refuses the category default of grey list rows with chevrons and text-only metadata.

OWN-WORLD: Pale mint ground, white rounded cards (24 radius) with soft green-tinted shadows, deep forest green for filled pills, active chips, the tab bar and primary actions, a bright mint accent for availability and highlights, a mint-to-forest gradient on the hero plate only. System faces in heavy, tight headings; Ionicons outline icons; pill buttons; square-ish rounded size-like tiles for chips.

STORY: The student understands what the library has and what is free right now, believes the queue is fair because positions are explicit, and reserves in two taps; staff deliver in order from the counter.

FIRST VIEWPORT: Header with "Catálogo" and the "Personal" link. A gradient hero plate with a featured available book cover, a short headline and a white "Buscar" pill. Below, a row of rounded filter tiles with icons (Todos, Disponibles, En espera). Then "Vistos recientemente" as a horizontal row of cover cards, then the catalog as cover cards. A dark forest tab bar floats at the bottom with a raised round mint button in its center that opens the scanner.

FORM: user-pinned reference (mint/green shoe-shop UI), seed: none (pinned) — user: "Quiero que le des esta estética a la app móvil (imagen adjunta)."

Signature move: the raised center scan button in the floating tab bar, and cover-on-mint-plate cards.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
