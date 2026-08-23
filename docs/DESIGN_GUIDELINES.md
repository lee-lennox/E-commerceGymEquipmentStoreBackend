# Design Guidelines Document

## GymEquip Store - UI/UX Standards

**Version:** 1.0  
**Date:** August 2026

---

## 1. Design Philosophy

GymEquip Store follows a **modern, clean, and fitness-oriented** design approach. The interface is designed to be:

- **Intuitive:** Users can navigate without training
- **Responsive:** Works seamlessly on mobile, tablet, and desktop
- **Accessible:** WCAG 2.1 AA compliant where possible
- **Performance-focused:** Fast load times and smooth interactions

---

## 2. Color Palette

### 2.1 Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#3B82F6` | Primary buttons, links, active states |
| Primary Dark | `#1D4ED8` | Hover states, emphasis |
| Primary Light | `#DBEAFE` | Backgrounds, badges |

### 2.2 Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| Black | `#111827` | Headings, primary text |
| Dark Gray | `#374151` | Body text |
| Gray | `#6B7280` | Secondary text, placeholders |
| Light Gray | `#9CA3AF` | Disabled states, borders |
| Lighter Gray | `#E5E7EB` | Dividers, borders |
| Lightest Gray | `#F3F4F6` | Section backgrounds |
| White | `#FFFFFF` | Page backgrounds, cards |

### 2.3 Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#10B981` | Success messages, in-stock |
| Warning | `#F59E0B` | Warnings, pending states |
| Danger | `#EF4444` | Errors, out-of-stock, delete actions |
| Info | `#3B82F6` | Informational messages |

### 2.4 Fitness-Themed Accents

| Name | Hex | Usage |
|------|-----|-------|
| Energy Orange | `#F97316` | CTAs, highlights |
| Muscle Red | `#DC2626` | Sale badges, urgency |
| Steel Gray | `#4B5563` | Equipment imagery backgrounds |

---

## 3. Typography

### 3.1 Font Family

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### 3.2 Type Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 36px / 2.25rem | 700 | Page titles |
| H2 | 30px / 1.875rem | 600 | Section headings |
| H3 | 24px / 1.5rem | 600 | Card titles |
| H4 | 20px / 1.25rem | 600 | Subsection headings |
| H5 | 18px / 1.125rem | 500 | Labels |
| Body | 16px / 1rem | 400 | Paragraph text |
| Small | 14px / 0.875rem | 400 | Secondary text |
| XSmall | 12px / 0.75rem | 400 | Captions, timestamps |

### 3.3 Line Heights

| Context | Value |
|---------|-------|
| Headings | 1.2 |
| Body text | 1.6 |
| Buttons | 1.5 |

---

## 4. Layout & Spacing

### 4.1 Grid System

- **Desktop:** 12-column grid, max-width 1280px
- **Tablet:** 8-column grid
- **Mobile:** 4-column grid, full-width with padding

### 4.2 Spacing Scale (Tailwind)

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight gaps |
| sm | 8px | Component internal spacing |
| md | 16px | Standard spacing |
| lg | 24px | Section padding |
| xl | 32px | Large gaps |
| 2xl | 48px | Section margins |
| 3xl | 64px | Page-level spacing |

### 4.3 Breakpoints

| Name | Width | Target |
|------|-------|--------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Small desktop |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large desktop |

---

## 5. Components

### 5.1 Buttons

#### Primary Button
```
Background: #3B82F6
Text: #FFFFFF
Padding: 12px 24px
Border Radius: 8px
Font Weight: 600
Hover: #1D4ED8 (darken 10%)
Active: #1E40AF (darken 15%)
```

#### Secondary Button
```
Background: transparent
Border: 1px solid #E5E7EB
Text: #374151
Padding: 12px 24px
Border Radius: 8px
Hover: #F3F4F6 background
```

#### Danger Button
```
Background: #EF4444
Text: #FFFFFF
Padding: 12px 24px
Border Radius: 8px
Hover: #DC2626
```

### 5.2 Cards

```
Background: #FFFFFF
Border Radius: 12px
Box Shadow: 0 1px 3px rgba(0,0,0,0.1)
Padding: 24px
Border: 1px solid #E5E7EB (optional)
```

### 5.3 Forms & Inputs

```
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border Radius: 8px
Padding: 12px 16px
Font Size: 16px
Focus Border: #3B82F6
Focus Ring: 0 0 0 3px rgba(59, 130, 246, 0.2)
Error Border: #EF4444
```

### 5.4 Navigation

#### Header
```
Height: 64px
Background: #FFFFFF
Border Bottom: 1px solid #E5E7EB
Position: sticky top-0
Z-Index: 50
```

#### Sidebar (Admin)
```
Width: 260px
Background: #111827
Text: #FFFFFF
```

### 5.5 Product Card

```
Image: Aspect ratio 1:1, object-fit cover
Content Padding: 16px
Title: 18px, font-weight 600
Price: 20px, font-weight 700, color primary
Rating: Star icons, 14px
```

---

## 6. Icons

| Library | Usage |
|---------|-------|
| Lucide React | Primary icon library (menu, cart, user, search, etc.) |
| Material UI Icons | Admin dashboard, form inputs |

### Icon Sizes

| Context | Size |
|---------|------|
| Inline text | 16px |
| Buttons | 20px |
| Navigation | 24px |
| Feature icons | 32-48px |

---

## 7. Animations & Transitions

### 7.1 Standard Transitions

| Property | Duration | Easing |
|----------|----------|--------|
| Color changes | 150ms | ease-in-out |
| Background changes | 200ms | ease-in-out |
| Transform (hover) | 200ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Opacity | 150ms | ease-in-out |
| Modal/Drawer open | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |

### 7.2 Micro-interactions

- **Button hover:** Scale(1.02), darken background
- **Card hover:** translateY(-4px), shadow increase
- **Loading:** Pulse animation or spinner rotation
- **Toast:** Slide in from right, auto-dismiss after 3s

---

## 8. Responsive Design Rules

### 8.1 Mobile-First Approach

All designs start at mobile viewport and scale up.

### 8.2 Key Responsive Patterns

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Product Grid | 1-2 columns | 3 columns | 4 columns |
| Header | Hamburger menu | Full nav | Full nav |
| Cart | Full-screen overlay | Sidebar | Sidebar |
| Admin Dashboard | Stacked layout | Sidebar + content | Sidebar + content |
| Product Detail | Stacked (image top) | Side-by-side | Side-by-side |

---

## 9. Accessibility Standards

### 9.1 Color Contrast

- Minimum contrast ratio: 4.5:1 for normal text
- Large text (18px+ bold): 3:1 minimum

### 9.2 Interactive Elements

- Minimum touch target: 44x44px
- Focus indicators visible on all interactive elements
- Keyboard navigation support

### 9.3 Screen Readers

- Semantic HTML elements
- ARIA labels on icons and non-text elements
- Alt text on all product images

---

## 10. Image Guidelines

### 10.1 Product Images

| Aspect Ratio | 1:1 (square) |
| Resolution | Minimum 800x800px |
| Format | JPG or WebP |
| Max File Size | 5MB |
| Background | White or transparent |

### 10.2 Hero/Banner Images

| Aspect Ratio | 16:9 or 21:9 |
| Resolution | 1920x1080px minimum |
| Format | JPG |

---

## 11. File Organization

```
frontend/src/
├── app/
│   ├── pages/           # Page-level components
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context providers
│   └── App.js           # Main app with routing
├── services/
│   └── api.js           # API service layer
├── styles/
│   └── theme.css        # Global styles & CSS variables
└── index.js             # Application entry point
```

---

## 12. Tailwind Configuration

Key customizations in `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
          light: '#DBEAFE',
        },
        // Custom colors mapped to design tokens
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```
