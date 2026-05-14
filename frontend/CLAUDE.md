# CLAUDE.md — Frontend Development

## Project Context

This is the **frontend application** of an AI-powered fullstack development agency platform. See the root [`CLAUDE.md`](../CLAUDE.md) for the complete project vision, business goals, and architecture.

---

## 🎯 Frontend Objectives

Build a premium, futuristic marketing website and dashboard system that:

- Converts visitors into paying clients
- Showcases AI integration expertise
- Demonstrates premium engineering quality
- Provides an interactive AI assistant UI
- Includes analytics dashboard features

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS v4 |
| Components | ShadCN/UI |
| Animations | Framer Motion |
| Charts | Recharts |
| State | React hooks + Zustand |
| Forms | React Hook Form + Zod |

---

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Marketing pages (home, services, pricing)
│   ├── dashboard/          # Dashboard pages
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # ShadCN components
│   ├── marketing/          # Marketing section components
│   ├── dashboard/           # Dashboard components
│   ├── ai-assistant/       # AI chat UI components
│   └── shared/             # Shared/reusable components
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── api.ts              # API client
│   └── constants.ts        # Constants
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── public/                # Static assets
```

---

## 🎨 Design System

### Colors

```css
--background: #09090b        /* zinc-950 */
--foreground: #ffffff
--primary: #7c3aed           /* violet-600 */
--primary-foreground: #ffffff
--secondary: #1e1b4b         /* indigo-950 */
--accent: #a855f7             /* purple-500 */
--muted: #27272a              /* zinc-800 */
--card: #18181b               /* zinc-900 */
```

### Visual Style

- Dark premium theme with glassmorphism
- Purple/violet/indigo gradients
- Neon accent glows
- Floating UI elements
- Soft shadows and borders
- Smooth Framer Motion animations

### Typography

- Headings: Inter (bold/extrabold)
- Body: Inter (regular/medium)
- Monospace: JetBrains Mono (code blocks)

---

## ✨ Animation Guidelines

Use Framer Motion for all animations:

```tsx
// Page transitions
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

// Staggered children
<motion.div variants={container} initial="hidden" animate="show">
  <motion.div variants={item}>...</motion.div>
</motion.div>

// Hover effects
<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
```

### Animation Patterns

- **Fade in on scroll**: `fadeInUp` variant with viewport trigger
- **Staggered reveals**: 0.1s delay between items
- **Hover states**: `scale: 1.02-1.05`, subtle glow increase
- **Page transitions**: 300ms fade with slight y-translate
- **Loading states**: Pulsing skeletons with shimmer

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* mobile landscape */
md:  768px   /* tablet */
lg:  1024px  /* desktop */
xl:  1280px  /* large desktop */
2xl: 1536px  /* extra large */
```

---

## 🔌 API Integration

Base URL: `http://localhost:8000/api`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | Send message to AI assistant |
| GET | `/leads` | Fetch leads list |
| POST | `/leads` | Create new lead |
| GET | `/analytics` | Fetch analytics data |
| POST | `/consultation` | Book consultation |

---

## 📋 Development Rules

1. **Always use TypeScript** — no `any` types
2. **Responsive-first** — design mobile, enhance for larger screens
3. **Accessibility** — WCAG 2.1 AA compliance
4. **Performance** — Next.js Image optimization, lazy loading
5. **SEO** — Semantic HTML, proper meta tags
6. **No console.log** — use proper logging or debug utilities

---

## 🚀 Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

---

## 📝 Component Guidelines

### Marketing Components

- Hero section with animated dashboard preview
- Trust metrics with animated counters
- Service cards with hover effects
- Pricing cards with gradient borders
- Testimonial slider with Framer Motion
- Final CTA with glowing gradient

### Dashboard Components

- Sidebar navigation with collapse
- Stats cards with mini charts
- Data tables with sorting/filtering
- Modal dialogs with glassmorphism
- Toast notifications

### AI Assistant Components

- Chat interface with streaming
- Message bubbles with markdown
- Typing indicator animation
- Conversation history sidebar

---

## 🎯 Current Phase

**Phase 1: Marketing Website**

- [ ] Project setup
- [ ] Homepage with all sections
- [ ] Services page
- [ ] Pricing page
- [ ] Responsive layouts
- [ ] Animation polish

---

## 🔗 References

- Root CLAUDE.md: `/mnt/d/LeadGenAI/CLAUDE.md`
- Design tokens: Use CSS variables from globals.css
- Component examples: Check `/components/ui` for ShadCN usage