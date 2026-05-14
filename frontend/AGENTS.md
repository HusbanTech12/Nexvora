# AGENTS.md — Frontend Agent Guidelines

This file provides guidance for AI agents working on the frontend codebase. Read this before making any significant changes.

---

## Overview

The frontend is a **Next.js 15 application** using:
- TypeScript (strict mode)
- TailwindCSS v4
- ShadCN/UI components
- Framer Motion for animations

See [`CLAUDE.md`](./CLAUDE.md) for detailed technical specifications.

---

## Key Principles

### 1. Follow the Design System

Always use the established design tokens and patterns:

```tsx
// ✅ Correct
<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
  <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
    Premium Heading
  </h2>
</div>

// ❌ Avoid — don't invent new patterns
<div className="bg-gray-800 custom-shadow round-lg">
```

### 2. Mobile-First Approach

Design for mobile first, enhance for larger screens:

```tsx
// ✅ Mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// ❌ Desktop-first
<div className="grid grid-cols-4 gap-4">
```

### 3. Use Framer Motion Properly

All animations should feel smooth and premium:

```tsx
// ✅ Staggered fade-in
<motion.div
  variants={container}
  initial="hidden"
  animate="show"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={item} />
  ))}
</motion.div>

// ❌ Jarring transitions
<motion.div transition={{ duration: 0.01 }}>
```

### 4. Keep Components Focused

Each component should do one thing well:

```tsx
// ✅ Focused component
function HeroSection() {
  return (
    <section>
      <HeroHeadline />
      <HeroSubheadline />
      <HeroCTAs />
      <HeroVisual />
    </section>
  );
}

// ❌ God component
function HeroSection() {
  // 500 lines of everything
}
```

---

## File Organization

### Where to Put Things

| Type | Location |
|------|----------|
| UI Components | `components/ui/` |
| Marketing Components | `components/marketing/` |
| Dashboard Components | `components/dashboard/` |
| AI Chat Components | `components/ai-assistant/` |
| Shared Components | `components/shared/` |
| Utilities | `lib/` |
| Custom Hooks | `hooks/` |
| Types | `types/` |

### Naming Conventions

- **Components**: PascalCase (`HeroSection.tsx`)
- **Hooks**: camelCase with `use` prefix (`useLeadForm.ts`)
- **Utils**: camelCase (`formatCurrency.ts`)
- **Types**: PascalCase (`LeadFormData.ts`)
- **CSS classes**: kebab-case (Tailwind classes)

---

## Common Patterns

### Server vs Client Components

```tsx
// app/page.tsx — Server Component (default)
async function HomePage() {
  const data = await fetchData(); // Can use async/await
  return <MarketingContent data={data} />;
}

// components/marketing/Hero.tsx — Client Component
"use client";
export function HeroSection() {
  const { scrollY } = useScroll();
  return <motion.div style={{ y }} />;
}
```

### Using ShadCN Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Customize with Tailwind, not inline styles
<Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90">
  Get Started
</Button>
```

### Animation Variants

```tsx
// Define variants at top of file
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

---

## Quality Checklist

Before completing any task:

- [ ] TypeScript compiles without errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] Follows design system colors
- [ ] Uses proper semantic HTML
- [ ] Images optimized with Next.js Image
- [ ] Dark theme consistent throughout

---

## Testing Visual Changes

When implementing UI changes:

1. Run `npm run dev`
2. Test on multiple viewport sizes
3. Verify animations are smooth
4. Check dark mode consistency
5. Test interactive elements (buttons, forms, modals)

---

## Getting Help

- Design system details: [`CLAUDE.md`](./CLAUDE.md)
- Component examples: Check existing `components/ui/` files
- Animation patterns: See marketing components with Framer Motion
- API integration: Check `lib/api.ts` for endpoints

---

## Anti-Patterns to Avoid

1. **No inline styles** — Use Tailwind classes only
2. **No `any` types** — Always define proper interfaces
3. **No magic numbers** — Use constants or CSS variables
4. **No unnecessary re-renders** — Use `useMemo`/`useCallback` when needed
5. **No hardcoded strings** — Use i18n or constants
6. **No layout shifts** — Specify image dimensions, use skeleton loaders