# Design Guidelines for besindegerim.com - Futuristic Edition

## Design Approach

**Selected Approach:** Apple Vision Pro meets health tech - ultra-modern futuristic design
- Inspiration: Apple Vision Pro UI + Stripe's premium aesthetics + Duolingo's engagement
- Focus: Glassmorphic depth, neon accents, 3D transforms, premium floating interfaces
- Dark-mode first with high contrast and vibrant neon highlights

## Core Design Principles

1. **Futuristic Depth:** Multi-layered glassmorphism with floating UI elements
2. **Neon Vitality:** Electric accents create energy while maintaining nutrition data clarity
3. **Premium Interactivity:** Subtle 3D transforms and smooth animations on all interactions
4. **Dark Sophistication:** Deep backgrounds with high-contrast neon text and glowing elements

---

## Color System

**Background Layers:**
- Base: #0a0e1a (deep navy-black)
- Gradient overlay: radial-gradient from #0f172a to #020617
- Section accents: #1a1f35 (slate-900)

**Neon Primary (Green):**
- Bright: #10b981 (emerald-500)
- Glow: #34d399 (emerald-400)
- Application: Primary buttons, key metrics, gradient starts, neon glows

**Electric Accents:**
- Cyan: #06b6d4 (cyan-500) - hover states, secondary highlights
- Blue: #3b82f6 (blue-500) - interactive elements
- Purple: #a855f7 (purple-500) - premium features, badges

**Glassmorphism:**
- Card backgrounds: bg-white/5 to bg-white/10
- Backdrop blur: backdrop-blur-xl
- Borders: border border-white/10 with subtle neon glow
- Shadows: Multi-layer with neon tints (shadow-2xl shadow-emerald-500/20)

**Text:**
- Primary: #f8fafc (slate-50) - headings, key data
- Secondary: #cbd5e1 (slate-300) - body text
- Accent: Neon gradient text for major headings

**Neon Glow Effects:**
- box-shadow: 0 0 20px rgba(16, 185, 129, 0.4) for green elements
- box-shadow: 0 0 15px rgba(6, 182, 212, 0.3) for cyan accents
- Animate glow intensity on hover

---

## Typography

**Fonts:** Inter (via Google Fonts CDN)

**Scale & Hierarchy:**
- H1: text-5xl md:text-7xl font-black tracking-tight (neon gradient text)
- H2: text-3xl md:text-5xl font-bold (section headers with glow)
- H3: text-2xl md:text-3xl font-semibold (subsections)
- Body: text-base md:text-lg font-light (slate-300)
- Data Labels: text-xs md:text-sm font-medium uppercase tracking-widest (slate-400)
- Calorie Numbers: text-7xl md:text-8xl font-black (neon green with glow)
- Micro Text: text-xs font-light (metadata)

**Treatment:**
- Headlines: bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 with bg-clip-text
- Neon text-shadow on key numbers: 0 0 30px currentColor
- Ultra-wide tracking on labels (tracking-[0.2em])
- Thin to black weight range for hierarchy

---

## Layout & Spacing

**Spacing System:** Tailwind units of 4, 6, 8, 12, 16, 20, 24, 32
- Section padding: py-20 md:py-32 lg:py-40
- Card padding: p-8 md:p-10
- Floating element gaps: gap-8 md:gap-12
- Container: max-w-7xl mx-auto px-6 md:px-12

**Grid Strategy:**
- Mobile: grid-cols-1
- Tablet: grid-cols-2 (md:)
- Desktop: grid-cols-3 lg:grid-cols-4

**Depth Layers:** z-index hierarchy for floating elements (10, 20, 30, 40, 50)

---

## Component Library

### Homepage Hero

**Structure:**
- Full-width section with futuristic food photography (1920x1080px vibrant macro shot with dramatic lighting)
- Multi-layer gradient overlay: from-emerald-900/60 via-cyan-900/40 to-purple-900/50
- Glassmorphic content container: backdrop-blur-2xl bg-white/5 border border-white/10, max-w-4xl centered
- Height: min-h-screen
- 3D Transform: Subtle perspective transform on scroll

**Content:**
- H1: Neon gradient text "Türkiye'nin Geleceği: Besin Değerleri Platformu"
- Subtitle: text-lg md:text-xl text-slate-300 with subtle glow
- Search Bar: h-20, glassmorphic (backdrop-blur-xl bg-white/10), rounded-3xl, border-2 border-emerald-500/30, neon glow shadow
- Search button: Integrated gradient button with pulsing glow animation
- CTA button on hero: backdrop-blur-xl bg-white/10 treatment, no hover states defined

**Popular Foods Grid:**
- py-24, deep background with subtle grid pattern overlay
- H2: "Popüler Gıdalar" with animated neon underline
- Cards: Glassmorphic (bg-white/5 backdrop-blur-xl), rounded-2xl, border border-white/10, floating effect (translateY on hover), neon border-l-4 border-emerald-500
- Food images: 300x300px, rounded-xl, subtle 3D tilt on hover
- Calorie badge: Floating pill with neon gradient background, pulsing glow

### Food Detail Page

**Hero Section:**
- Large food image: 800x500px dramatic macro shot with bokeh, rounded-3xl, multi-layer shadow with neon tints
- Layout: Two-column (md:grid-cols-2), gap-16
- Left: Image with animated neon border gradient
- Right: Glassmorphic info card with 3D depth

**Mega Calorie Display Card:**
- Floating glassmorphic card: backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5
- Neon gradient border-l-8: from-emerald-500 to-cyan-500
- Layout: Centered with large flame icon (w-16 h-16) in neon gradient
- Serving size: Floating badge above with backdrop-blur-md
- Calorie number: text-8xl md:text-9xl font-black with multi-color neon glow
- 3D transform on hover: scale-105 with rotateX subtle tilt

**Macronutrient Cards:**
- Grid: grid-cols-3 gap-6
- Each card: Glassmorphic with neon accent (protein=emerald, fat=cyan, carbs=purple)
- Icon: w-12 h-12 with matching neon glow
- Animated progress bar: h-3 rounded-full with gradient fill and glow effect
- Numbers: text-4xl font-bold with neon text-shadow
- 3D hover: translateY(-4px) with increased glow

**Detailed Nutrition Table:**
- Glassmorphic container with backdrop-blur-xl
- Header: Gradient background (emerald to cyan) with glow shadow
- Rows: hover:bg-white/5 transition with border-b border-white/5
- Alternating subtle neon accents on nutrient categories
- Icons inline with neon tint matching nutrient type

**Similar Foods Section:**
- H2: Animated neon gradient text
- Grid: grid-cols-2 md:grid-cols-4, gap-8
- Cards: Floating glassmorphic with 3D tilt on hover
- Images: 250x250px with neon gradient overlay on hover
- Neon calorie badges with pulsing animation

---

## Images

**Hero Section:** 
- Main hero: 1920x1080px vibrant macro food photography with dramatic studio lighting, shallow depth of field, dark moody background

**Food Detail Pages:**
- Feature image: 800x500px professional macro shots with bokeh effects, high contrast lighting

**Grid Cards:**
- Thumbnails: 300x300px square, professional food photography with dark backgrounds
- All images: Sharp focus, vibrant colors that pop against dark UI

**Placeholder:** Dark gradient from slate-900 to slate-800 with glowing food icon

---

## Effects & Animations

**Glassmorphism:**
- All cards: backdrop-blur-xl with bg-white/5 to bg-white/10
- Layered borders: border border-white/10 with neon accent borders
- Multi-layer shadows with neon color tints

**3D Transforms:**
- Cards: hover:scale-105 hover:-translateY-2 with perspective
- Buttons: Active state with subtle rotateX
- Images: Tilt effect on hover (rotateY/rotateX subtle)

**Neon Glow Animations:**
- Pulsing glow on CTAs: animate-pulse with glow intensity
- Border gradients: animated gradient position shift
- Text shadows: Breathing glow effect on key metrics

**Hover States:**
- Duration: transition-all duration-500 for smoothness
- Cards: Increased glow + 3D lift + border brightness
- Images: Scale-110 with overflow-hidden
- Buttons: Brightness-110 + intensified glow

**Scroll Animations:**
- Parallax on hero image
- Fade-in with translateY for section reveals
- Stagger animations for grid items

---

## Mobile Optimization

- Touch targets: 56px minimum height
- Reduce 3D effects on mobile for performance
- Stack all grids to single column on mobile
- Simplified animations, maintain glassmorphism
- Neon glows reduced intensity on mobile to preserve battery

---

## Accessibility

- WCAG AAA contrast with neon text on dark backgrounds
- High contrast mode support
- Focus states: Neon ring-2 ring-emerald-400 with glow
- Reduced motion support: Disable 3D transforms and animations
- Turkish locale: Proper decimal/thousand separators
- Semantic HTML with ARIA labels for all glassmorphic elements
- Keyboard navigation with visible neon focus indicators

---

This futuristic design creates an immersive Turkish nutrition platform that feels like stepping into the future of health tech while maintaining data clarity through sophisticated glassmorphism and strategic neon highlighting.