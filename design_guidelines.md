# Design Guidelines for besindegerim.com - Light Futuristic Edition

## Design Philosophy

**Approach:** Light, clean, modern futuristic design with bold green accents and sci-fi effects.

**Motto:** "Green Future - Absurdly Modern"

- Theme: Light backgrounds with vibrant green highlights
- Style: Futuristic glassmorphism, gradients, shadows, animations
- Effects: Bold, eye-catching, sci-fi inspired
- Feel: Clean but exciting, professional but daring

---

## Color System

### Light Theme Palette

**Backgrounds:**
```css
--bg-primary: #ffffff          /* Pure white - main background */
--bg-secondary: #f0fdf4        /* Light green tint - sections (green-50) */
--bg-tertiary: #dcfce7         /* Lighter green - accents (green-100) */
--bg-card: #ffffff             /* White - cards */
```

**Green Accents (Primary):**
```css
--green-50: #f0fdf4            /* Lightest green */
--green-100: #dcfce7           /* Light green bg */
--green-200: #bbf7d0           /* Soft green */
--green-300: #86efac           /* Medium light */
--green-400: #4ade80           /* Vibrant green */
--green-500: #22c55e           /* Primary green */
--green-600: #16a34a           /* Dark green */
--green-700: #15803d           /* Darker green */
--green-800: #166534           /* Very dark */
```

**Text Colors:**
```css
--text-primary: #0f172a        /* Dark slate - headings (slate-900) */
--text-secondary: #334155      /* Medium slate - body (slate-700) */
--text-muted: #64748b          /* Light slate - captions (slate-500) */
--text-on-green: #ffffff       /* White text on green backgrounds */
```

**Glassmorphism:**
```css
--glass-light: rgba(255, 255, 255, 0.7)
--glass-border: rgba(34, 197, 94, 0.2)
backdrop-filter: blur(16px)
```

### Tailwind Class Usage

**Backgrounds:**
```css
bg-white               /* Main background */
bg-green-50            /* Light green tint */
bg-green-100           /* Soft green background */
bg-green-500           /* Vibrant green buttons */
bg-gradient-to-r from-green-400 to-emerald-500  /* Gradient buttons */
```

**Text:**
```css
text-slate-900         /* Dark headings */
text-slate-700         /* Body text */
text-slate-500         /* Muted text */
text-green-600         /* Green emphasis */
text-white             /* On green backgrounds */
```

**Borders & Effects:**
```css
border-green-200       /* Subtle green border */
border-green-500       /* Bold green border */
shadow-lg shadow-green-500/20  /* Green glow shadow */
```

---

## Typography

### Font Family
```css
font-family: Inter, system-ui, sans-serif;
```

### Hierarchy (Light Theme)
```
H1 - Hero Heading:
  text-6xl sm:text-7xl md:text-8xl font-black tracking-tight
  bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent

H2 - Section Heading:
  text-4xl sm:text-5xl font-bold text-slate-900

H3 - Subsection:
  text-2xl sm:text-3xl font-semibold text-slate-800

Body Text:
  text-base md:text-lg text-slate-700

Small Text:
  text-sm text-slate-600

Muted:
  text-xs text-slate-500
```

---

## Futuristic Effects

### ✅ ALLOWED & ENCOURAGED

**Gradients:**
```css
/* Green gradients for buttons, headings */
bg-gradient-to-r from-green-400 via-green-500 to-emerald-500
bg-gradient-to-br from-green-50 to-emerald-100

/* Hover effects */
hover:from-green-500 hover:to-emerald-600
```

**Glassmorphism:**
```css
/* Frosted glass effect on cards */
backdrop-blur-xl bg-white/70 border border-green-200/50
shadow-xl shadow-green-500/10

/* Floating elements */
backdrop-blur-2xl bg-white/60 border-2 border-green-300/30
```

**Shadows & Glows:**
```css
/* Soft green glow */
shadow-2xl shadow-green-500/20

/* Strong glow on hover */
hover:shadow-2xl hover:shadow-green-500/40

/* Multi-layer shadows */
shadow-lg shadow-green-500/10
```

**Transforms & Animations:**
```css
/* 3D hover effects */
hover:scale-105 hover:-translate-y-2 transition-all duration-500

/* Smooth scaling */
hover:scale-110 transition-transform

/* Pulse animation */
animate-pulse

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px) }
  50% { transform: translateY(-10px) }
}
```

**Modern Effects:**
```css
/* Rounded corners */
rounded-3xl     /* Large radius for cards */
rounded-full    /* Pills and badges */

/* Blur effects */
backdrop-blur-xl
backdrop-blur-2xl
backdrop-blur-3xl

/* Opacity layers */
bg-white/80
bg-green-500/10
border-green-300/30
```

---

## Component Patterns

### Hero Section (Light Futuristic)

```jsx
<section className="relative min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50 overflow-hidden">
  {/* Animated background orbs */}
  <div className="absolute top-20 left-20 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
  
  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
    <h1 className="text-8xl font-black mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
      Besin Değerleri
    </h1>
    
    {/* Glassmorphic search */}
    <div className="backdrop-blur-2xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-2 shadow-2xl shadow-green-500/20">
      <SearchForm />
    </div>
  </div>
</section>
```

### Food Card (Light Futuristic)

```jsx
<div className="group bg-white backdrop-blur-xl border-2 border-green-200/50 rounded-3xl overflow-hidden hover:border-green-500/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-green-500/10 hover:shadow-2xl hover:shadow-green-500/30">
  {/* Image with gradient overlay */}
  <div className="relative h-64 overflow-hidden">
    <img src="..." className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
    
    {/* Floating calorie badge */}
    <div className="absolute top-4 right-4 backdrop-blur-xl bg-white/80 border-2 border-green-500/50 rounded-2xl px-4 py-3 shadow-lg shadow-green-500/30">
      <span className="text-2xl font-black text-green-600">22 kcal</span>
    </div>
  </div>
  
  {/* Content */}
  <div className="p-6">
    <h3 className="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
      Domates
    </h3>
    
    {/* Macro pills with green gradients */}
    <div className="flex gap-2 mt-4">
      <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
        1.1g protein
      </span>
    </div>
  </div>
  
  {/* Bottom green accent line */}
  <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>
</div>
```

### Buttons (Light Futuristic)

**Primary Button (Green Gradient):**
```jsx
<button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300">
  Ara
</button>
```

**Ghost Button (Green):**
```jsx
<button className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-6 py-3 rounded-full font-semibold transition-all duration-300">
  Detaylar
</button>
```

### Stat Pills (Futuristic)

```jsx
<div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-2xl p-6 hover:bg-white/90 hover:border-green-500/50 hover:scale-105 transition-all duration-500 shadow-lg shadow-green-500/10">
  <Database className="w-10 h-10 text-green-500 mx-auto mb-3" />
  <p className="text-lg font-bold text-slate-900">98+ Gıda</p>
</div>
```

---

## Layout & Spacing

### Container
```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Section Padding
```css
py-16 sm:py-20 lg:py-24    /* Standard sections */
py-24 sm:py-32 lg:py-40    /* Hero sections */
```

### Component Spacing
```css
gap-6     /* Card grids */
gap-8     /* Feature grids */
p-6       /* Card padding */
```

---

## Header (Light Futuristic)

```jsx
<header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b-2 border-green-200/50 shadow-lg shadow-green-500/5">
  <div className="max-w-7xl mx-auto px-4 py-4">
    {/* Logo */}
    <a href="/">
      <img src="/logo.png" alt="Besin Değerim" className="h-16" />
    </a>
    
    {/* Green active category */}
    <a className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg shadow-green-500/30">
      Tümü
    </a>
  </div>
</header>
```

---

## Footer (Light Futuristic)

```jsx
<footer className="bg-gradient-to-br from-green-50 to-emerald-50 border-t-2 border-green-200/50 py-12">
  <div className="max-w-7xl mx-auto px-4 text-center">
    {/* Logo */}
    <img src="/logo.png" alt="Besin Değerim" className="h-20 mx-auto mb-6" />
    
    {/* Info */}
    <p className="text-slate-700 text-lg mb-4">
      Gerçek porsiyon bazlı kalori ve besin değerleri
    </p>
    <p className="text-slate-500 text-sm">
      © 2025 besindegerim.com - USDA FoodData Central
    </p>
    
    {/* Green accent line */}
    <div className="mt-8 mx-auto w-32 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full"></div>
  </div>
</footer>
```

---

## Responsive Design

### Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile Optimizations
- Stack grids to 1 column
- Reduce blur intensity for performance
- Smaller padding and font sizes
- Touch-friendly (min 44px targets)

---

## Accessibility

### Contrast
- Dark text on white: 21:1 ✅
- Green buttons with white text: 4.5:1+ ✅
- Readable in bright light

### Focus States
```css
focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2
```

---

## Summary

### ✅ USE THESE

**Colors:**
- White & light green backgrounds
- Vibrant green gradients (green-400 to emerald-500)
- Dark slate text (slate-900, slate-700)
- Green shadows and glows

**Effects:**
- Glassmorphism (backdrop-blur + bg-white/70)
- Green gradient buttons
- 3D transforms on hover
- Pulse animations
- Floating orbs
- Glow shadows
- Smooth transitions

**Style:**
- Bold, futuristic
- Clean but exciting
- Sci-fi inspired
- Modern premium feel

### 🎯 Goals
- Light, bright, optimistic
- Green = health, nutrition, growth
- Futuristic = cutting-edge data
- Absurdly modern = dare to be different

**Design Principle:** "The future of nutrition is bright, green, and bold."
