# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

- **Students of the Instituto Politécnico Formosa (IPF):** browse the library catalog, search by title or author, scan a book's barcode, reserve copies, follow their loans and waitlist positions, and get reminded before a loan is due.
- **Library staff:** sign in with fixed credentials to the counter ("mostrador") and hand books to the next person in each waitlist, respecting the order of reservations.

## Product Purpose

Biblioteca IPF lets students check what the library has, reserve it, and return it on time, and lets staff deliver books fairly in queue order. It is the integrating practical assignment (TP N° 4) of the Taller Complementario – React Native II: success means every function is simple but correctly resolved (complete loading/error/empty states, no dangling effects, no dead-end screens) and the technical decisions are explained in writing.

## Operating Context

- Tested on real phones through Expo Go, on both Android and iOS.
- Students use it on their own phone, often inside the library: scanning the barcode on the back cover, or typing the ISBN when the camera is unavailable.
- Staff use the counter screen during service to deliver books in waitlist order.
- Graded by teachers who review code, commit history, README and written answers.

## Capabilities and Constraints

- Expo SDK 58, Expo Router (typed routes), TypeScript strict. Packages only via `npx expo install`.
- Native modules limited to `expo-camera` and `expo-notifications`; no other permissions, no `expo-location`, no `expo-image-picker`, no `expo-permissions`.
- Required routes, deep links (`bibliotecaipf://`), protected staff routes, modal confirmation and permission pre-screens are fixed by the assignment.
- Course rules: `StyleSheet.create` everywhere, colors/sizes/spacing only in `src/constants/tema.ts`, no inline styles, one component per file, `accessibilityRole="button"` and 44×44 touch targets, `npx expo lint` and `npx tsc --noEmit` clean.
- Data is local and simulated (`src/data/libros.ts`, `src/lib/api.ts` provided by the course and copied verbatim). The app works without permissions: manual ISBN entry and in-app notices are always available.
- Book covers: the user asked to add cover images to the app (decided 2026-11-20).

## Brand Commitments

- Name: "Biblioteca IPF". All UI copy in clear Spanish (Argentine voseo), addressed to the user, never raw technical errors.
- The user provided a visual reference (mint/green mobile shop UI) for the redesign.

## Evidence on Hand

- Real catalog data: 16 books in `src/data/libros.ts`, some with real ISBNs for scanner testing.
- No real users, ratings, reviews, or statistics exist; none may be invented.

## Product Principles

1. Never leave the user stuck: every denied permission or failure has a visible way forward.
2. Order is fairness: waitlists are first-in, first-out and the UI makes positions explicit.
3. Simple functions, done right: complete states over extra features.
4. Explain decisions: code and docs must make the technical reasoning traceable.

## Accessibility & Inclusion

Buttons expose `accessibilityRole="button"`; icon-only buttons carry `accessibilityLabel`; touch targets are at least 44×44.
