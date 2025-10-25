# Design Guidelines for besindegerim.com - Minimal Edition

## Design Philosophy

**Approach:** Clean, professional, minimal design with dark green, black, and white tones.

**Motto:** "Less is more"

- Focus: Content first, effects second
- Palette: Dark green (#1f8a4d), black (#000), white (#f5f5f5)
- Style: Solid colors, clean borders, minimal effects
- No gradients, no glassmorphism, no neon, no heavy animations

---

## Color System

### Primary Colors
```
Background:
--bg-primary: #000000           /* Pure black - main background */
--bg-secondary: #0b1d16         /* Deep green-black - sections */
--bg-card: #111111              /* Dark gray - cards */

Text:
--text-primary: #f5f5f5         /* Light white - headings */
--text-secondary: #c7c7c7       /* Gray white - body text */
--text-muted: #7f7f7f           /* Muted gray - labels */

Accent:
--accent-green: #1f8a4d         /* Dark green - buttons, highlights */
--accent-green-hover: #27a35f   /* Lighter green - hover state */

Borders:
--border-green: rgba(31, 138, 77, 0.3)   /* Green border */
--border-subtle: rgba(255, 255, 255, 0.1) /* Subtle white border */
```

### Tailwind Classes
```css
bg-black           /* Pure black background */
bg-[#0b1d16]       /* Deep green-black */
bg-[#111]          /* Card background */

text-white         /* Primary text */
text-white/80      /* Secondary text */
text-white/60      /* Muted text */

bg-[#1f8a4d]       /* Accent green */
text-[#1f8a4d]     /* Green text */

border-white/10    /* Subtle border */
border-white/20    /* Medium border */
border-[#1f8a4d]   /* Green border */
```

---

## Typography

### Font Family
```css
font-family: Inter, system-ui, sans-serif;
```

### Hierarchy
```
H1 - Hero Heading:
  text-5xl sm:text-6xl font-bold tracking-tight text-white

H2 - Section Heading:
  text-3xl sm:text-4xl font-semibold text-white

H3 - Subsection:
  text-xl sm:text-2xl font-semibold text-white

Body Text:
  text-base text-white/80

Small Text:
  text-sm text-white/60

Label Text:
  text-xs uppercase tracking-wide text-white/50
```

### Rules
- ✅ Clean, readable fonts
- ✅ Good contrast (white on dark)
- ✅ Font weights: 400, 600, 700 only
- ❌ NO gradient text
- ❌ NO text shadows
- ❌ NO glow effects

---

## Layout & Spacing

### Container
```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Section Padding
```css
py-12 sm:py-16 lg:py-20
```

### Component Padding
```css
p-6    /* Cards */
p-4    /* Small components */
p-3    /* Tiny components */
```

### Grid Systems
```css
/* Food Cards */
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6

/* Features */
grid grid-cols-1 md:grid-cols-3 gap-8
```

---

## Components

### Cards (Food Cards)

**Structure:**
```jsx
<div className="bg-[#111] border border-white/10 rounded-md overflow-hidden hover:border-[#1f8a4d]/50 transition-colors">
  <img src="..." alt="..." className="w-full h-48 object-cover" />
  <div className="p-4">
    <h3 className="text-lg font-semibold text-white">Food Name</h3>
    <p className="text-sm text-white/60 mt-1">Category</p>
    <div className="flex items-center justify-between mt-4">
      <span className="text-2xl font-bold text-[#1f8a4d]">22 kcal</span>
      <span className="text-xs text-white/50">1 orta</span>
    </div>
  </div>
</div>
```

**Rules:**
- ✅ Solid background (`bg-[#111]`)
- ✅ Thin border (`border border-white/10`)
- ✅ Small radius (`rounded-md`)
- ✅ Hover: border color change only
- ✅ Simple transition (`transition-colors`)
- ❌ NO glassmorphism
- ❌ NO 3D transforms
- ❌ NO shadows (except minimal if needed)

### Buttons

**Primary Button (Green):**
```jsx
<button className="bg-[#1f8a4d] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[#27a35f] transition-colors">
  Button Text
</button>
```

**Outline Button:**
```jsx
<button className="border border-[#1f8a4d] text-[#1f8a4d] px-6 py-2.5 rounded-md font-medium hover:bg-[#1f8a4d]/10 transition-colors">
  Button Text
</button>
```

**Rules:**
- ✅ Solid colors
- ✅ Simple hover (color change)
- ✅ Optional: subtle translate (`hover:-translate-y-0.5`)
- ❌ NO gradients
- ❌ NO glow effects
- ❌ NO heavy transforms

### Input Fields

```jsx
<input 
  className="bg-black/50 border border-white/20 text-white px-4 py-2.5 rounded-md focus:border-[#1f8a4d] focus:outline-none transition-colors"
  placeholder="Search..."
/>
```

**Rules:**
- ✅ Solid dark background
- ✅ Thin border
- ✅ Focus: green border
- ✅ Simple transitions
- ❌ NO glassmorphism
- ❌ NO blur effects

### Badges/Pills

```jsx
<span className="bg-[#1f8a4d] text-white text-xs px-3 py-1 rounded-full font-medium">
  Label
</span>
```

**Rules:**
- ✅ Solid backgrounds
- ✅ Small size
- ✅ `rounded-full` for pills
- ❌ NO neon effects
- ❌ NO glow

---

## Effects & Interactions

### ✅ ALLOWED

```css
/* Simple color transitions */
transition-colors duration-200

/* Opacity changes */
hover:opacity-90

/* Border color changes */
hover:border-[#1f8a4d]

/* Minimal transforms (optional) */
hover:-translate-y-0.5

/* Simple shadows (if absolutely needed) */
shadow-sm
```

### ❌ NOT ALLOWED

```css
/* NO gradients */
bg-gradient-to-r from-green-500 to-cyan-500

/* NO glassmorphism */
backdrop-blur-xl bg-white/5

/* NO glow shadows */
shadow-[0_0_30px_rgba(34,197,94,0.5)]

/* NO 3D transforms */
hover:scale-110 hover:rotate-3

/* NO animations */
animate-pulse animate-bounce

/* NO neon effects */
text-shadow: 0 0 20px #22c55e

/* NO complex transitions */
transition-all duration-500
```

---

## Page Sections

### Hero Section

**Structure:**
```jsx
<section className="bg-black py-20">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <h1 className="text-5xl sm:text-6xl font-bold text-white">
      Besin Değerleri
    </h1>
    <p className="text-xl text-white/80 mt-4 max-w-2xl mx-auto">
      Gerçek porsiyon bazlı kalori ve besin değerleri
    </p>
  </div>
</section>
```

**Rules:**
- ✅ Black background
- ✅ Clean white text
- ✅ Minimal spacing
- ❌ NO animated backgrounds
- ❌ NO glowing orbs
- ❌ NO gradient overlays

### Content Sections

```jsx
<section className="bg-[#0b1d16] py-16">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-12">
      Section Title
    </h2>
    {/* Content */}
  </div>
</section>
```

**Rules:**
- ✅ Deep green-black background
- ✅ White headings
- ✅ Generous whitespace
- ✅ Grid layouts
- ❌ NO effects

### Footer

```jsx
<footer className="bg-black border-t border-white/10 py-8">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <p className="text-white/60 text-sm">
      © 2025 besindegerim.com
    </p>
  </div>
</footer>
```

---

## Responsive Design

### Breakpoints
```
sm: 640px   /* Tablet */
md: 768px   /* Small desktop */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Mobile-First
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns
- Touch targets: min 44px

---

## Accessibility

### Contrast
- White text / black background: 21:1 ✅
- White text / dark green: 9.5:1 ✅
- Green button / white text: 4.5:1 ✅

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-[#1f8a4d] focus:ring-offset-2 focus:ring-offset-black
```

---

## Example Components

### Minimal Food Card
```jsx
<div className="bg-[#111] border border-white/10 rounded-md overflow-hidden hover:border-[#1f8a4d]/50 transition-colors">
  <img src="/api/placeholder/400/300" alt="Food" className="w-full h-48 object-cover" />
  <div className="p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-white">Domates</h3>
      <span className="text-xs px-2 py-1 bg-[#1f8a4d]/20 text-[#1f8a4d] rounded-full">Sebze</span>
    </div>
    <div className="flex items-baseline justify-between mt-4">
      <span className="text-2xl font-bold text-[#1f8a4d]">22 kcal</span>
      <span className="text-xs text-white/50">1 orta domates (123g)</span>
    </div>
    <div className="flex gap-2 mt-3">
      <span className="text-xs px-2 py-1 bg-white/5 text-white/60 rounded">1.1g protein</span>
      <span className="text-xs px-2 py-1 bg-white/5 text-white/60 rounded">4.8g karb</span>
      <span className="text-xs px-2 py-1 bg-white/5 text-white/60 rounded">0.2g yağ</span>
    </div>
  </div>
</div>
```

### Minimal Hero
```jsx
<section className="bg-black py-20">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
      Besin Değerleri Platformu
    </h1>
    <p className="text-xl text-white/80 mb-12">
      Gerçek porsiyon bazlı kalori ve besin değerleri. USDA verisi.
    </p>
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-3">
        <input 
          className="flex-1 bg-black/50 border border-white/20 text-white px-6 py-3 rounded-md focus:border-[#1f8a4d] focus:outline-none transition-colors"
          placeholder="Gıda ara... (ör: domates, elma)"
        />
        <button className="bg-[#1f8a4d] text-white px-8 py-3 rounded-md font-medium hover:bg-[#27a35f] transition-colors">
          Ara
        </button>
      </div>
    </div>
  </div>
</section>
```

---

## Summary

### ✅ DO USE
- Dark green (#1f8a4d), black (#000), white (#f5f5f5)
- Solid backgrounds
- Thin borders (1px)
- Small border-radius (`rounded-md`)
- Simple transitions (colors, opacity)
- Clean typography
- Generous spacing

### ❌ DON'T USE
- Gradients
- Glassmorphism/blur
- Neon effects
- Glow shadows
- Animations (pulse, bounce)
- 3D transforms (scale, rotate)
- Too many effects

**Design Principle:** Clean, professional, content-focused. Let the data shine.
