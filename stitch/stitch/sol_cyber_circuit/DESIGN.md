# Design System Document: Tactical High-End Gaming Interface

## 1. Overview & Creative North Star: "The Neon Monolith"
This design system is built to transform a standard gaming hub into an immersive, high-precision environment. The Creative North Star is **"The Neon Monolith"**—a concept that blends the weight of brutalist architectural forms with the ethereal glow of advanced telemetry.

We move beyond "standard UI" by embracing **intentional asymmetry** and **tonal depth**. Rather than placing elements in a flat grid, we treat the screen as a 3D space where data "floats" over deep-void surfaces. The goal is to make the user feel like they are operating a premium piece of military-grade hardware, where every interaction is rewarded with a tactile, luminous response.

---

## 2. Colors & Surface Logic
The palette is rooted in the "Deep Blue" and "Dark Grey" of a midnight sky, punctuated by high-energy "Cyan" and "Gold" signals.

### The "No-Line" Rule
**Strict Mandate:** Traditional 1px solid borders for sectioning are strictly prohibited. 
Separation must be achieved through:
*   **Background Shifts:** Using `surface_container_low` (#1c1b1b) for the main canvas and `surface_container` (#201f1f) for sidebars.
*   **Negative Space:** Utilizing the Spacing Scale (specifically `8` (2rem) and `12` (3rem)) to create breathing room that defines boundaries.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked layers.
1.  **Base Layer:** `surface` (#131313) — The infinite void.
2.  **Section Layer:** `surface_container_low` (#1c1b1b) — Broad content areas.
3.  **Component Layer:** `surface_container_high` (#2a2a2a) — Individual cards and widgets.
4.  **Interaction Layer:** `surface_bright` (#393939) — Active or hovered elements.

### The "Glass & Gradient" Rule
To elevate the "Tech" feel, main CTAs and hero banners should utilize a **linear gradient** from `primary` (#adc8f5) to `primary_container` (#1e3a5f) at a 135-degree angle. Floating panels (like tooltips or overlays) must use **Glassmorphism**: `surface_variant` (#353534) at 60% opacity with a `16px` backdrop-blur to allow underlying game art to bleed through softly.

---

## 3. Typography: Editorial Authority
We utilize a high-contrast pairing: **Space Grotesk** for structural authority and **Inter** for data-heavy legibility.

*   **Display & Headlines:** (Space Grotesk) Use `display-lg` (3.5rem) with `-0.04em` letter spacing for hero sections. The tight kerning creates a "locked-in" tech aesthetic.
*   **Body & Labels:** (Inter) Use `body-md` (0.875rem) for descriptions. Ensure `on_surface_variant` (#c4c6cf) is used for secondary text to maintain a sophisticated hierarchy.
*   **The Reward Tone:** Use `tertiary` (Gold #e9c400) exclusively for `label-md` or `label-sm` when indicating ranks, rewards, or achievements. It acts as a rare, high-value signal.

---

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines; we use light and shadow to define reality.

*   **The Layering Principle:** A "floating" card should be `surface_container_highest` (#353534) placed on a `surface_dim` (#131313) background. This creates a natural, soft lift.
*   **Ambient Shadows:** Use shadows only for modal elements. Shadow: `0px 24px 48px rgba(0, 0, 0, 0.4)`. Never use pure black shadows; always tint them with a hint of the `primary_container` blue.
*   **The Ghost Border:** If a boundary is functionally required (e.g., an input field), use `outline_variant` (#43474e) at **15% opacity**. It should feel like a faint laser line, not a physical wall.
*   **Glow States:** Interactive elements (like active Game Cards) should emit a `secondary` (Cyan) outer glow: `box-shadow: 0 0 20px rgba(0, 212, 253, 0.25)`.

---

## 5. Components: The Tactical Kit

### Game Cards (The Hero Component)
*   **Structure:** No borders. Use `surface_container_high`.
*   **Hover State:** Scale up by 2%. Apply the "Glow State" (Cyan). The card's title should shift from `on_surface` to `secondary`.
*   **Transitions:** Use `250ms cubic-bezier(0.4, 0, 0.2, 1)` for all hover effects to ensure a snappy, "hydraulic" feel.

### Buttons
*   **Primary:** Background: `secondary_container` (#00d2fd); Text: `on_secondary` (#003642). Shape: `md` (0.375rem).
*   **Secondary (Ghost):** No background. `1px` Ghost Border (15% opacity). Text: `secondary`. On hover, fill background at 10% opacity.
*   **Tertiary:** Text-only. Use `label-md` uppercase with `0.1em` letter spacing.

### Input Fields
*   **Base:** `surface_container_lowest`. Ghost Border at 10% opacity.
*   **Focus State:** Border opacity increases to 100% using `secondary` (Cyan). Add a subtle `2px` Cyan underline to mimic a terminal cursor.

### Chips & Badges
*   **Status Chips:** Use `secondary_fixed_dim` (#3cd7ff) for "Online" and `tertiary_fixed_dim` (#e9c400) for "Premium." No solid backgrounds—use 10% opacity fills with high-saturation text.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical padding. For example, give a hero section more bottom padding (`24`) than top padding (`16`) to create downward momentum.
*   **Do** use "Cyan" sparingly. It is a high-frequency signal; if everything glows, nothing is important.
*   **Do** lean into the Spacing Scale. If a layout feels "crowded," double the space rather than adding a divider line.

### Don’t:
*   **Don’t** use pure white (#ffffff) for text. It vibrates too harshly against the dark background. Always use `on_surface` (#e5e2e1).
*   **Don’t** use standard "Rounded" corners for everything. Mix `sm` (0.125rem) for tactical elements and `md` (0.375rem) for cards to maintain a "machined" look.
*   **Don’t** use 100% opaque dividers. If you must separate content vertically, use a 1px `surface_variant` line that fades out at both ends using a radial gradient.