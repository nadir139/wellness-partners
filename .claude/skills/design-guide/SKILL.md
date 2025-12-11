---
name: design-guide
description: Comprehensive design system for modern, professional UIs. Use when building any UI components, pages, or interfaces to ensure clean, minimal design with proper spacing, typography, colors, and interaction states. Enforces 8px grid system, neutral color palettes, and mobile-first principles.
---

# Design Guide

Ensure every UI looks modern and professional through clean, minimal design principles.

## Core Principles

1. **Clean and minimal** - Generous white space, avoid clutter
2. **Neutral foundation** - Grays and off-whites as base
3. **Restrained accent** - ONE accent color used sparingly
4. **Consistent spacing** - 8px grid system always
5. **Clear hierarchy** - Typography with purpose
6. **Subtle depth** - Shadows used with restraint
7. **Thoughtful rounding** - Rounded corners where appropriate
8. **Interactive clarity** - Clear states for all interactions
9. **Mobile-first** - Design for small screens, scale up

## Color System

### Base Palette

**Backgrounds:**
- Primary: `#FFFFFF` (pure white)
- Secondary: `#FAFAFA` (off-white)
- Tertiary: `#F5F5F5` (light gray)

**Text:**
- Primary: `#1A1A1A` (near black)
- Secondary: `#666666` (medium gray)
- Tertiary: `#999999` (light gray)
- Disabled: `#CCCCCC` (very light gray)

**Borders:**
- Default: `#E5E5E5` (light border)
- Hover: `#D4D4D4` (slightly darker)
- Focus: Use accent color

### Accent Color

Choose ONE accent color for the entire interface:
- Use for primary actions only
- Appears in: primary buttons, links, focus states, key icons
- Maximum 10% of the screen should use accent color
- Common choices: Blue (#3B82F6), Green (#10B981), Red (#EF4444), Indigo (#6366F1)

**Never use:**
- Purple/blue gradients
- Multiple accent colors
- Neon or overly saturated colors

### Semantic Colors

Only when needed for feedback:
- Success: `#10B981` (green)
- Warning: `#F59E0B` (amber)
- Error: `#EF4444` (red)
- Info: `#3B82F6` (blue)

## Spacing System

Use the 8px grid exclusively:

**Scale:**
- `xs`: 8px - tight spacing (icon padding, small gaps)
- `sm`: 16px - default component padding
- `md`: 24px - section spacing
- `lg`: 32px - major section gaps
- `xl`: 48px - large section breaks
- `2xl`: 64px - page-level spacing

**Application:**
- Padding: Always multiples of 8
- Margins: Always multiples of 8
- Gaps in flexbox/grid: Always multiples of 8
- Component dimensions: Prefer multiples of 8

**Example:**
```css
/* Good */
padding: 16px;
gap: 24px;
margin-bottom: 32px;

/* Bad */
padding: 15px;
gap: 20px;
margin-bottom: 30px;
```

## Typography

### Font Selection

**Maximum 2 fonts:**
- One for headings (can be the same as body)
- One for body text

**Safe choices:**
- Inter (clean, modern, versatile)
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', ...`

### Size Scale

**Body text:**
- Default: 16px (never smaller)
- Small: 14px (for secondary info only)
- Large: 18px (for emphasis)

**Headings:**
- H1: 48px
- H2: 36px
- H3: 24px
- H4: 20px
- H5: 18px (rarely used)

### Hierarchy Rules

- Use weight for hierarchy: Regular (400), Medium (500), Semibold (600), Bold (700)
- ONE primary heading per section
- Clear visual distinction between heading levels
- Body text uses Regular weight only

**Line height:**
- Body text: 1.5 (24px for 16px text)
- Headings: 1.2

**Example:**
```css
/* Good hierarchy */
h1 { font-size: 48px; font-weight: 700; line-height: 1.2; }
h2 { font-size: 36px; font-weight: 600; line-height: 1.2; }
body { font-size: 16px; font-weight: 400; line-height: 1.5; }

/* Bad - inconsistent, too many weights */
h1 { font-size: 45px; font-weight: 800; }
body { font-size: 15px; font-weight: 300; }
```

## Shadows

Use shadows sparingly for depth, not decoration.

**Shadow scale:**

```css
/* Subtle - for cards, inputs */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

/* Medium - for elevated elements, dropdowns */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Strong - for modals, popovers (rarely) */
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
```

**Rules:**
- Cards: subtle shadow OR border, never both
- Buttons: subtle shadow on primary only
- No shadows on flat elements (badges, tags)
- Hover states: slightly increase shadow
- Never use colored or heavy shadows

## Border Radius

**Scale:**
- `sm`: 4px - tight elements (badges, small buttons)
- `md`: 8px - default (buttons, inputs, cards)
- `lg`: 12px - large cards or containers
- `full`: 9999px - pills, avatars

**Rules:**
- NOT everything needs to be rounded
- Be consistent: pick one default radius (8px recommended)
- Buttons and inputs: same radius
- Cards: slightly larger radius acceptable

**Example:**
```css
/* Good - consistent */
button { border-radius: 8px; }
input { border-radius: 8px; }
.card { border-radius: 8px; }

/* Bad - inconsistent */
button { border-radius: 12px; }
input { border-radius: 4px; }
.card { border-radius: 16px; }
```

## Component Patterns

### Buttons

**Primary button:**
```css
background: [accent-color];
color: white;
padding: 12px 24px; /* 8px multiples */
border-radius: 8px;
border: none;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
font-weight: 500;

/* Hover */
background: [accent-color-darker];
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);

/* Active */
transform: translateY(1px);

/* Disabled */
background: #E5E5E5;
color: #999999;
cursor: not-allowed;
```

**Secondary button:**
```css
background: white;
color: [accent-color];
padding: 12px 24px;
border-radius: 8px;
border: 1px solid #E5E5E5;

/* Hover */
border-color: [accent-color];
background: #FAFAFA;
```

**Ghost button:**
```css
background: transparent;
color: [accent-color];
padding: 12px 24px;
border: none;

/* Hover */
background: #F5F5F5;
```

### Cards

**With border:**
```css
background: white;
border: 1px solid #E5E5E5;
border-radius: 8px;
padding: 24px;
```

**With shadow:**
```css
background: white;
border: none;
border-radius: 8px;
padding: 24px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

**Never:**
- Border AND shadow
- Heavy shadows
- Multiple borders

### Inputs

```css
background: white;
border: 1px solid #E5E5E5;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px; /* minimum */

/* Focus */
border-color: [accent-color];
outline: 2px solid [accent-color-transparent];

/* Error */
border-color: #EF4444;

/* Disabled */
background: #F5F5F5;
color: #999999;
cursor: not-allowed;
```

### Links

```css
color: [accent-color];
text-decoration: none;

/* Hover */
text-decoration: underline;

/* Visited */
color: [accent-color]; /* same as default */
```

## Interactive States

Every interactive element needs clear states:

**Required states:**
1. Default
2. Hover
3. Active (click/press)
4. Focus (keyboard navigation)
5. Disabled

**State guidelines:**
- Hover: Subtle background change or shadow increase
- Active: Slight press effect (translateY) or darker color
- Focus: Outline using accent color, never remove it
- Disabled: Muted colors, cursor: not-allowed

## Layout Principles

### Container Width

```css
/* Page container */
max-width: 1200px;
margin: 0 auto;
padding: 0 24px;

/* Content width (for readability) */
max-width: 680px;
```

### Spacing

- Sections: 64px vertical gap
- Components: 32px vertical gap
- Related items: 16px gap
- Tight groups: 8px gap

### Mobile-First

Always start with mobile design:

```css
/* Mobile first (default) */
.container {
  padding: 16px;
  flex-direction: column;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    flex-direction: row;
  }
}
```

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

## Common Mistakes to Avoid

1. **Too many colors** - Stick to neutral base + one accent
2. **Inconsistent spacing** - Use 8px grid system
3. **Small text** - Never below 16px for body
4. **Heavy shadows** - Keep them subtle
5. **Over-rounding** - Not everything needs rounded corners
6. **Missing states** - Every interactive element needs hover/active/focus
7. **Desktop-first** - Always design for mobile first
8. **Too many fonts** - Maximum 2
9. **Cluttered layouts** - Embrace white space
10. **Purple/blue gradients** - Just don't

## Quick Checklist

Before shipping any UI, verify:
- [ ] All spacing uses 8px multiples
- [ ] Body text is ≥16px
- [ ] Only ONE accent color used
- [ ] All buttons have hover, active, disabled states
- [ ] Focus states are visible (never removed)
- [ ] Mobile layout works first
- [ ] Shadows are subtle
- [ ] Border radius is consistent
- [ ] Sufficient white space between sections
- [ ] Clear visual hierarchy in typography
