# Design Guidelines for kacgram.net

## Design Approach

**Selected Approach:** Modern health app aesthetic with vibrant visual design
- Inspiration: MyFitnessPal's clarity + Duolingo's playful energy + modern gradient trends
- Focus: Data legibility wrapped in engaging, contemporary visual design
- Mobile-first with generous spacing and touch-friendly interactions

## Core Design Principles

1. **Vibrant Clarity:** Nutrition data presented beautifully without sacrificing readability
2. **Modern Turkish Health Resource:** Professional yet fun, localized experience
3. **Serving Transparency:** Portion sizes prominently displayed with visual emphasis
4. **Visual Hierarchy:** Bold gradients and shadows guide attention to key information

---

## Color System

**Primary Gradient:**
- Green: #22c55e → #16a34a (use for buttons, hero overlays, accent cards)
- Apply: bg-gradient-to-r from-[#22c55e] to-[#16a34a]

**Secondary Accents:**
- Teal: #14b8a6 (badges, progress bars, icons)
- Cyan: #06b6d4 (hover states, secondary highlights)

**Base Colors:**
- Background: Soft gradient from white to #f0fdf4 (green-50)
- Cards: Pure white with shadow-xl and shadow-green-100/20
- Text Primary: #1f2937 (gray-800)
- Text Secondary: #6b7280 (gray-500)

**Application:**
- Hero background: gradient overlay on food imagery
- Calorie cards: white with green gradient border-l-4
- Hover states: transition to teal/cyan accents
- Glassmorphism: white backgrounds with backdrop-blur-lg and bg-white/80

---

## Typography

**Fonts:** Inter (via Google Fonts CDN)

**Scale & Hierarchy:**
- H1: text-4xl md:text-6xl font-bold (hero, page titles)
- H2: text-3xl md:text-4xl font-bold (section headers)
- H3: text-2xl font-semibold (subsections)
- Body: text-base md:text-lg (general content)
- Data Labels: text-sm font-medium uppercase tracking-wide (nutrient names)
- Calorie Numbers: text-6xl md:text-7xl font-black (hero calorie display)
- Small Text: text-xs (metadata, units)

**Treatment:**
- Headlines: Use gradient text with bg-clip-text for major headings
- Bold weights (600-900) for emphasis
- Generous letter-spacing on labels for modern feel

---

## Layout & Spacing

**Spacing System:** Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Section padding: py-16 md:py-24 lg:py-32
- Card padding: p-6 md:p-8
- Component gaps: gap-6 md:gap-8
- Container: max-w-7xl mx-auto px-6 md:px-8

**Grid Strategy:**
- Mobile: grid-cols-1
- Tablet: grid-cols-2 (md:)
- Desktop: grid-cols-3 lg:grid-cols-4 (popular foods, alternatives)

**Breathing Room:** Generous whitespace between sections (mb-16 to mb-24)

---

## Component Library

### Homepage Hero

**Visual Treatment:**
- Full-width section with large food photography background (hero image: 1920x800px vibrant food composition)
- Gradient overlay: bg-gradient-to-br from-[#22c55e]/90 to-[#16a34a]/80
- Content: Centered, max-w-4xl
- H1: "Türkiye'nin En Kapsamlı Gıda Besin Değerleri Rehberi" (white text with text-shadow)
- Subtitle: Light text explaining serving-based approach
- Search Bar: Large (h-16), white background with shadow-2xl, rounded-2xl, integrated green gradient search button
- Glassmorphism effect on search container: backdrop-blur-md bg-white/90
- Height: min-h-[600px] md:min-h-[700px]
- Button on image: backdrop-blur-md with bg-white/20 treatment

**Popular Foods Section:**
- py-20, light gradient background
- H2: "Popüler Gıdalar" with green gradient underline decoration
- Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4, gap-6
- Cards: White, rounded-xl, shadow-lg hover:shadow-2xl, transform hover:scale-105, transition-all duration-300
- Each card: Food image (250x250px, rounded-t-xl), name (font-semibold), calorie badge with teal background

### Food Detail Page (/:slug)

**Hero Section:**
- Large food image: 600x400px (or larger), rounded-2xl, shadow-2xl
- Desktop layout: Two-column (md:grid-cols-2), gap-12
- Left: Image with subtle gradient border
- Right: Food name (H1), serving info badge (teal background, rounded-full, px-4 py-2)

**Calorie Showcase Card:**
- Prominent card with green gradient border-l-8, shadow-xl
- Glassmorphism: backdrop-blur-sm with subtle white/95 background
- Layout: Flex with icon (large calorie flame icon from Heroicons)
- Serving size: text-lg text-gray-600 with portion emoji
- Calorie number: text-7xl font-black with gradient text effect
- Label: "kalori" in text-2xl
- Padding: p-8 md:p-10, rounded-2xl

**Macronutrient Cards:**
- Three-column grid (grid-cols-3 gap-4)
- Each: White card, rounded-xl, p-6, shadow-md
- Icon at top (Protein/Fat/Carb icons from Heroicons in teal)
- Large number (text-3xl font-bold)
- Progress bar: h-2 rounded-full bg-gray-200 with teal fill showing percentage
- Label below bar

**Detailed Nutrition Table:**
- Modern table with alternating row backgrounds (even:bg-green-50/30)
- Header: bg-gradient-to-r from-green-500 to-green-600, text-white, rounded-t-xl
- Rows: py-4 px-6, hover:bg-green-50 transition
- Borders: border-b border-gray-100
- Values: font-medium for emphasis
- Include nutrient icons from Heroicons inline

**Alternatives Section:**
- H2: "Benzer Gıdalar" with gradient accent
- Grid: grid-cols-2 md:grid-cols-3, gap-6
- Cards: Image (200x200px), overlay with gradient on hover, name, calorie badge
- Shadow-lg, rounded-xl, overflow-hidden for image containment

---

## Images & Visual Elements

**Food Photography:**
- Hero: 1920x800px vibrant, high-quality food compositions
- Detail page: 600x400px professional food shots
- Grid cards: 250x250px square thumbnails
- All: rounded corners, subtle shadows, object-cover
- Placeholder: Gradient green pattern with food icon from Heroicons

**Icons:** Heroicons (via CDN)
- Nutrient types: protein (beaker), fat (droplet), carbs (lightning)
- UI elements: search, fire (calories), chart
- Size: w-6 h-6 for inline, w-12 h-12 for feature icons
- Color: Teal (#14b8a6) for consistency

**Badges & Labels:**
- Rounded-full for tags
- Gradient backgrounds for calorie indicators
- Shadow-sm for depth

---

## Effects & Animations

**Glassmorphism:**
- Search bar, overlay elements: backdrop-blur-lg bg-white/80
- Borders: border border-white/20
- Shadow: shadow-2xl with colored shadow tints

**Hover Effects:**
- Cards: transform scale-105, shadow-lg → shadow-2xl
- Buttons: brightness-110
- Images: subtle zoom (scale-105) with overflow-hidden container
- Duration: transition-all duration-300

**Shadows:**
- Cards: shadow-lg default, shadow-2xl on hover
- Hero elements: shadow-2xl
- Calorie card: shadow-xl with green tint (shadow-green-500/10)

**Gradients:**
- Backgrounds: subtle radial-gradient or linear
- Borders: gradient-to-r for accent lines
- Text: bg-clip-text for headlines

---

## Mobile Optimization

**Touch Targets:** Minimum 48px height for all interactive elements
**Responsive Images:** srcset for different densities
**Stack Behavior:** 
- Food detail: Image above content on mobile
- Macro cards: Full width stack on mobile, row on tablet+
- Tables: Horizontal scroll with sticky first column
**Spacing Scale Down:** py-16 on mobile → py-24 on desktop

---

## Accessibility & Quality

- High contrast maintained despite vibrant colors (WCAG AA)
- Semantic HTML with proper heading hierarchy
- ARIA labels for icons and interactive elements
- Alt text for all food images describing the food
- Keyboard navigation with visible focus states (green ring)
- Turkish decimal formatting (virgül for decimals)

---

This modern, vibrant design creates an engaging Turkish nutrition resource that makes data exploration delightful while maintaining professional health app credibility through clear information hierarchy and serving-based transparency.