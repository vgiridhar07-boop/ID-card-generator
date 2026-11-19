---
name: Student ID Studio & Credential Lab
description: Precision institutional identity design studio and credential management system
colors:
  surface-canvas: "#F4F4F6"
  surface-panel: "#FFFFFF"
  surface-elevated: "#FFFFFF"
  surface-subtle: "#ECECEF"
  border-hairline: "#E2E2E7"
  border-subtle: "#EAEAEF"
  border-strong: "#C8C8D2"
  grid-neutral: "#D5D5DC"
  scrollbar-track: "#CFCFD6"
  scrollbar-thumb: "#D1D1D8"
  scrollbar-hover: "#B5B5BE"
  ink-primary: "#111216"
  ink-secondary: "#474B57"
  ink-muted: "#5E6472"
  brand-navy: "#0F223D"
  brand-navy-hover: "#0A172A"
  brand-sapphire: "#1D4ED8"
  brand-amber: "#B45309"
  status-success: "#047857"
  status-success-tint: "#ECFDF5"
  status-destructive: "#B91C1C"
  status-destructive-tint: "#FEF2F2"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  subheading:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  heading:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  compact:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"
  caption:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  micro:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.02em"
  label:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"
rounded:
  xs: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  card: "19px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
---

# Design System: Student ID Studio & Credential Lab

## Overview
Student ID Studio is a high-precision, institutional-grade credential design environment and multi-college identity management platform. The visual language balances Swiss architectural discipline with archival scholastic elegance. Every pixel embodies cryptographic accuracy, print-grade precision, and WCAG AA+ legibility.

## Colors
- **Canvas (`#F4F4F6`):** Clean, calm architectural paper mat.
- **Panel & Surface (`#FFFFFF`):** Pure white container surfaces with hairline borders.
- **Ink Primary (`#111216`):** High-density obsidian ink, delivering 16:1 contrast against white.
- **Ink Secondary (`#474B57`):** Readable body and field label tone with 7.8:1 contrast.
- **Ink Muted (`#5E6472`):** Structural metadata and supplementary guidance tone with 5.6:1 contrast (guaranteed WCAG AA compliance > 4.5:1).
- **Brand Navy (`#0F223D`):** Authoritative scholastic midnight blue for primary CTAs.
- **Sapphire Accent (`#1D4ED8`):** Focus rings, active indicators, and technical interactive highlights.
- **Success (`#047857`) & Destructive (`#B91C1C`):** High-contrast semantic feedback tints.

## Typography
- **Primary Interface Face:** `Instrument Sans` — sharp, contemporary geometric sans with human architectural proportions. Free of overused AI-slop boilerplate.
- **Editorial Scholastic Face:** `Newsreader` — refined optical-size serif for institutional titles and classic credential crests.
- **Data & Measurement Face:** `JetBrains Mono` with `tabular-nums` — strictly reserved for technical specs, ISO-7810 dimensions, coordinates, and matriculation identifiers.
- **Legibility Floor:** All functional UI labels, captions, metadata rows, and badges must strictly observe an 11px minimum floor.

## Layout
- **Two-Column Command Shell:** 5-column left-hand studio drawer for contextual controls; 7-column right-hand drafting mat for live, high-resolution CR80 card visualization.
- **Drafting Mat:** Centered spatial canvas with a subtle micro-dot coordinate grid (`radial-gradient(#D5D5DC 1.2px, transparent 1.2px)`).
- **Responsive Fluidity:** Smooth collapse from dual-column workstation at desktop (`1440px+`) to modular single-column layout on mobile (`375px+`) with zero horizontal overflow.

## Elevation & Depth
- **Restrained Ambient Layers:** Shadows feature realistic multi-stop soft falloff with downward directional offsets.
  - `shadow-xs`: `0 1px 2px rgba(17, 18, 22, 0.04)`
  - `shadow-sm`: `0 2px 4px -1px rgba(17, 18, 22, 0.05), 0 1px 2px -1px rgba(17, 18, 22, 0.03)`
  - `shadow-card`: `0 12px 32px -6px rgba(17, 18, 22, 0.12), 0 4px 12px -2px rgba(17, 18, 22, 0.04)`
  - `shadow-modal`: `0 24px 64px -12px rgba(17, 18, 22, 0.22)`
- Flat colored costume halos and arbitrary thick outlines are strictly prohibited.

## Shapes
- **Container Radius:** `8px` (`rounded-lg`) for major surface modules; `6px` (`rounded-md`) for controls and inputs.
- **CR80 Credit Card Radius:** `19px` (~3.18mm standard corner radius on physical ISO/IEC 7810 cards).
- **Buttons & Pills:** `6px` (`rounded-md`) or full pill (`rounded-full`) for status indicators.

## Components
- **Input Fields:** Hairline border `#E2E2E7`, crisp focus ring in Sapphire `#1D4ED8` with 2px offset, legible 13px/14px type, minimum 38px tap target.
- **Navigation Tabs:** Segmented pill or border-b indicator with active contrast, smooth transitions, and distinct active weight.
- **Status Badges:** Minimum 11px font size, enclosed in soft tinted backgrounds with matching hairline borders.
- **Action Buttons:** Deep navy fill, white text, subtle hover lift, disabled opacity 0.5.

## Do's and Don'ts
### Do:
- Maintain strict WCAG AA contrast (≥4.5:1) for all body, muted, and placeholder text.
- Use `tabular-nums` for all student IDs, dimension readouts, and numerical stats.
- Keep the UI hierarchy flat; avoid nesting cards inside cards.
- Respect `prefers-reduced-motion` for all transitions and transforms.

### Don't:
- Never use kickers or eyebrows above headings.
- Never use text below 11px for interactive or functional labels.
- Never use gradient text or arbitrary glassmorphism blurs as decoration.
- Never use monospace as a costume outside of actual code, data, or measurements.
