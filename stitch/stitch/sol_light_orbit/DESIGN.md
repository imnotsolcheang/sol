```markdown
# Design System Strategy: The Luminous Arena

## 1. Overview & Creative North Star
**Creative North Star: "The Elevated Playroom"**

This design system moves away from the dark, heavy aesthetics typical of gaming interfaces, opting instead for an editorial-grade light mode that feels premium, athletic, and high-energy. We are not building a "standard dashboard"; we are crafting a digital pavilion. 

To break the "template" look, this system utilizes **Intentional Asymmetry**. Instead of perfectly centered grids, we lean into "The Lean"—offsetting headlines and using staggered card layouts to create a sense of forward motion. We use Space Grotesk not just as a font, but as a geometric structural element, pushing display sizes to the edge of the frame to create a "Zine" feel that feels custom and intentional.

---

## 2. Color & Tonal Architecture
The palette transitions from the utilitarian to the aspirational. We rely on "optical air" rather than physical dividers.

### The Palette
- **Primary Surface (`#f8f9fa`):** Our canvas. It is intentionally off-white to reduce eye strain while maintaining a crisp, "gallery" feel.
- **Deep Blue (`#002832`):** Used for "Authority Elements"—typography that needs to feel anchored and permanent.
- **Cyan (`#00d4ff`):** Our "Action Plasma." This is reserved for momentum—buttons, progress bars, and active states.
- **Gold (`#ffd700`):** The "Reward Tier." Used sparingly for achievements, currency, and high-value highlights.

### The "No-Line" Rule
**1px solid borders are strictly prohibited for sectioning.** 
Structural separation is achieved through background shifts. A `surface-container-low` section sitting on a `surface` background provides all the definition a user needs. If a border is required for accessibility, use a **"Ghost Border"**: `outline-variant` at 15% opacity.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets of fine paper:
1.  **Base Layer:** `surface` (#f8f9fa)
2.  **Sectional Layer:** `surface-container-low` (#f3f4f5) - Use for large sidebar or background groupings.
3.  **Content Layer:** `surface-container-lowest` (#ffffff) - Use for individual cards to make them "pop" against the gray.

---

## 3. Typography: Space Grotesk
Space Grotesk’s tabular figures and quirky terminals give us a "High-Tech Editorial" vibe.

*   **Display (lg/md):** Used for "Hero Moments" (e.g., Game Titles, Level Ups). Set with `-0.04em` letter spacing to feel tight and professional.
*   **Headline (lg/md):** The primary organizational tool. Use `primary` (#002832) to ensure maximum contrast and authority.
*   **Title (sm/md):** Used for card headers. These should always be semi-bold to distinguish from body text.
*   **Body (lg/md):** Set in `on-surface-variant` (#43474e) for long-form reading to provide a softer contrast than the headers.
*   **Labels:** Always uppercase with `+0.05em` tracking when used for metadata (e.g., "MATCH RADIUS" or "XP GAIN").

---

## 4. Elevation & Depth
We eschew the heavy shadows of the 2010s in favor of **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** To lift a card, do not reach for a shadow first. Place a `surface-container-lowest` (#ffffff) card on a `surface-container` (#edeeef) background. The 3% shift in luminosity creates a sophisticated, "flat-depth" look.
*   **Glassmorphism:** For floating overlays (Modals, Hover Tooltips), use a semi-transparent `surface` color with a `20px` backdrop-blur. This keeps the user grounded in the "Arena" by letting game art or background colors bleed through.
*   **Ambient Shadows:** If a shadow is essential (e.g., a floating FAB), use a large blur (32px) at 6% opacity, tinted with the `secondary` (#455f87) value rather than pure black.

---

## 5. Components & Signature Patterns

### Buttons (The "Plasma" System)
*   **Primary:** A gradient-filled container (`primary-container` to `primary`). It should feel like a solid object. No borders.
*   **Secondary:** A "Ghost" style. Text in `on-primary-container` (#00b2d6) with a 10% opacity Cyan background.
*   **States:** On hover, primary buttons should "glow" using a `0 0 20px` shadow color-matched to the Cyan (#00d4ff).

### Cards & Lists
*   **Forbid Dividers:** Never use a line to separate list items. Use the **Spacing Scale `3` (1rem)** as a gutter.
*   **Visual Soul:** Cards should utilize `xl` (1.5rem) corner radius for a friendly, gaming-centric feel. Use a subtle gradient `surface-container-lowest` to `surface-container-low` to give the card a slight "pillowed" effect.

### Chips (Badges)
*   **Reward Chips:** Background `tertiary-fixed` (#ffe16d) with `on-tertiary-fixed` (#221b00) text. These are the only elements allowed to use the Gold palette.

### Input Fields
*   **The "Inactive" State:** Background `surface-container-high` with no border. 
*   **The "Active" State:** Background `surface-container-lowest` with a 2px `primary-fixed` (#b4ebff) "Ghost Border."

---

## 6. Do’s and Don’ts

### Do
*   **Use White Space as a Tool:** If two elements feel cluttered, increase the spacing to `8` (2.75rem) before considering a line or a box.
*   **Embrace Large Type:** Let a "Level 50" display-lg header bleed off the right edge of a container for an editorial look.
*   **Layer Tactfully:** Always place lighter containers on darker backgrounds to simulate light hitting the top of a stack.

### Don't
*   **Don't Use Pure Black:** Even for text. Use `primary` (#002832) to keep the "Deep Blue" brand soul alive.
*   **Don't Use 1px Lines:** They create visual noise. Trust the background color shifts.
*   **Don't Overuse Gold:** Gold is for the "Win." If everything is gold, nothing is a reward. Keep it for currency, trophies, and "Pro" tags.
*   **Don't Use Sharp Corners:** Gaming is about flow. Stick to the `DEFAULT` (0.5rem) and `lg` (1rem) roundedness scale.