# Design Guidelines for kacgram.net

## Design Approach

**Selected Approach:** Utility-focused design system with health/nutrition industry references
- Primary inspiration: MyFitnessPal's clarity + Cronometer's data density + Health app minimalism
- Focus on information hierarchy and readability for nutrition data
- Mobile-first, professional aesthetic without AI-generated feel

## Core Design Principles

1. **Data Clarity First:** Nutrition information must be immediately scannable
2. **Trustworthy Professionalism:** Medical/health-adjacent design language
3. **Turkish Localization:** All content, formatting, and cultural nuances in Turkish
4. **Serving-Based Transparency:** Highlight real portion sizes prominently

---

## Typography

**Font Families:**
- Primary: Inter or system-ui for maximum legibility
- Headings: Inter Semi-Bold (600)
- Body: Inter Regular (400)
- Data/Numbers: Inter Medium (500) for emphasis

**Type Scale:**
- H1: text-3xl md:text-4xl (gıda adı)
- H2: text-2xl md:text-3xl (section başlıkları)
- H3: text-xl (alt başlıklar)
- Body: text-base (genel içerik)
- Data labels: text-sm (besin etiketleri)
- Large numbers: text-4xl md:text-5xl (kalori kartı ana sayı)

---

## Layout & Spacing

**Spacing System:** Tailwind units of 2, 4, 6, 8, 12, 16
- Section padding: py-12 md:py-16
- Card padding: p-4 md:p-6
- Component gaps: gap-4 or gap-6
- Container: max-w-6xl mx-auto px-4

**Grid Strategy:**
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns where appropriate (md:grid-cols-2)
- Desktop: 3 columns for alternatives grid (lg:grid-cols-3)

---

## Color Palette

**Base:**
- Background: Açık ton (soft white/cream - very light, warm neutral)
- Surface: Pure white cards with subtle shadows
- Text: Dark gray (high contrast for readability)
- Borders: Light gray (subtle separation)

**Accent:**
- Primary: Yeşil (green) - use for CTAs, highlights, active states
- Success: Lighter green for positive indicators
- Neutral: Gray for secondary actions

**Application:**
- Use green sparingly for emphasis (search button, portion callouts, links)
- Maintain high contrast ratios for accessibility
- White cards on light background with shadow-sm for depth

---

## Component Library

### Homepage (/)

**Hero Section (Compact):**
- NO large hero image
- Simple centered layout: max-w-2xl
- H1: "Gıda Besin Değerleri" (text-3xl md:text-4xl)
- Subtitle: Brief tagline about serving-based nutrition
- Search bar: Large input (h-12 md:h-14) with green search button
- Spacing: py-16 md:py-24

**Popular Foods Section:**
- Grid: 2 columns mobile (grid-cols-2), 3-4 desktop (md:grid-cols-3 lg:grid-cols-4)
- Cards: White background, shadow-sm, rounded-lg, p-4
- Each card: Small food image (if available), food name, calorie preview
- Hover: subtle shadow-md transition

### Food Detail Page (/:slug)

**Header Section:**
- H1: Gıda adı (mb-6)
- Food image: 300x300px (or placeholder), rounded-lg, shadow-sm
- Image placement: Left side on desktop (md:flex with image + content)

**Main Calorie Card (Prominent):**
- Large white card with green accent border-l-4
- Layout: Horizontal flex
- Left: Serving info - "1 {servingLabel}" (text-base text-gray-600)
- Right: Large calorie number (text-5xl font-semibold) + "kcal" label
- Padding: p-6, rounded-lg, shadow-md
- This card should be visually dominant

**Nutrition Table:**
- Clean table design with alternating row backgrounds (stripe pattern)
- Headers: font-medium, border-b-2
- Rows: py-3 px-4 spacing
- Columns: Besin adı | Miktar | Birim
- All values in serving-based units
- Include macros (protein, yağ, karbonhidrat) first, then available micronutrients
- Mobile: Stack to vertical cards if needed

**Alternatives Section (6 Foods):**
- H2: "Benzer Gıdalar" or "Alternatifler"
- Grid: 2 columns mobile, 3 desktop (grid-cols-2 md:grid-cols-3)
- Cards: Similar to homepage popular foods
- Each shows: name, small image, calorie preview
- Link to respective /:slug pages

---

## Images

**Food Images:**
- Detail page: 300x300px square, centered or left-aligned on desktop
- List/Grid cards: 120x120px thumbnails
- Placeholder: Simple green-tinted geometric pattern or food icon
- All images: rounded-lg, object-cover

**NO Hero Images:** This is a data-focused utility site, not a marketing page

---

## Interactions & States

**Minimal Animation:**
- Hover: subtle shadow transitions (transition-shadow duration-200)
- Link hover: green underline or color change
- Button hover: slight brightness increase
- NO complex animations, NO scroll-triggered effects

**Button Styles:**
- Primary (green): rounded-lg, px-6 py-3, font-medium
- Secondary: border with gray, hover to green
- States handled by component library

---

## Mobile-First Considerations

**Touch Targets:**
- Minimum 44x44px for all interactive elements
- Generous spacing between clickable items (gap-4)

**Responsive Behavior:**
- Search bar: Full width on mobile
- Food detail: Stack image above content on mobile
- Tables: Transform to cards or horizontal scroll
- Alternatives grid: 2 columns mobile, expand on desktop

---

## SEO & Accessibility

**Semantic HTML:**
- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive alt text for all images
- ARIA labels where needed

**Content Structure:**
- All content in HTML (JS kapalı durumda bile)
- Logical tab order
- High contrast text (WCAG AA minimum)

---

## Design Quality Standards

- **Information Density:** Balance between data-rich and scannable
- **Professional Medical Aesthetic:** Similar to health apps, not consumer marketing
- **Turkish UX Patterns:** Proper decimal separators (virgül), unit conventions
- **Serving Clarity:** Always emphasize "1 porsiyon" or actual serving size
- **No AI Smell:** Avoid generic gradients, excessive shadows, or template-like patterns

This design creates a trustworthy, data-focused nutrition resource that prioritizes clarity and usability over visual flair, perfectly suited for Turkish users seeking accurate serving-based nutrition information.