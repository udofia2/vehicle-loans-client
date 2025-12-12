# AUTOCHEK FRONTEND ARCHITECTURE - COMPLETE SYSTEM DESIGN DOCUMENT

**Version:** 1.0  
**Date:** December 2025  
**Status:** Implementation Ready  
**Tech Stack:** Next.js 15 (App Router) + TypeScript + TailwindCSS + shadcn/ui + React Query + Zustand + Axios + Zod + React Hook Form

---

## TABLE OF CONTENTS

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Technology Stack Specifications](#2-technology-stack-specifications)
3. [Design Token System & Theme](#3-design-token-system--theme)
4. [Frontend Domain Model](#4-frontend-domain-model)
5. [Complete Folder Structure](#5-complete-folder-structure)
6. [Coding Standards & Style Guide](#6-coding-standards--style-guide)
7. [Component Architecture](#7-component-architecture)
8. [State Management Strategy](#8-state-management-strategy)
9. [API Integration Layer](#9-api-integration-layer)
10. [Form Architecture](#10-form-architecture)
11. [Error Handling & UX Patterns](#11-error-handling--ux-patterns)
12. [Testing Strategy](#12-testing-strategy)
13. [Storybook Architecture](#13-storybook-architecture)
14. [Step-by-Step Implementation Plan](#14-step-by-step-implementation-plan)
15. [AI Code Generation Prompts](#15-ai-code-generation-prompts)

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│                     (Next.js App Router)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Vehicle    │  │  Valuation   │  │    Loan      │          │
│  │    Pages     │  │    Pages     │  │    Pages     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     COMPONENT LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  UI Components│  │Form Components│ │Layout Components│       │
│  │  (shadcn/ui) │  │(React Hook Form)│ │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT LAYER                        │
│  ┌────────────────────────────┐  ┌──────────────────┐          │
│  │    React Query             │  │     Zustand      │          │
│  │  (Server State)            │  │   (UI State)     │          │
│  │  - Vehicle data            │  │  - Theme         │          │
│  │  - Valuation data          │  │  - Sidebar open  │          │
│  │  - Loan data               │  │  - Modal state   │          │
│  └────────────────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VALIDATION LAYER                               │
│  ┌─────────────────────────────────────────────────┐            │
│  │               Zod Schemas                        │            │
│  │  - Input validation                              │            │
│  │  - Type inference                                │            │
│  │  - Form validation                               │            │
│  └─────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API CLIENT LAYER                              │
│  ┌─────────────────────────────────────────────────┐            │
│  │           Axios API Client                       │            │
│  │  - Request interceptors                          │            │
│  │  - Response interceptors                         │            │
│  │  - Error transformation                          │            │
│  │  - Type-safe endpoints                           │            │
│  └─────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API                                   │
│           (http://localhost:3000/api/v1)                         │
│     /vehicles  /valuations  /loans  /offers                      │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Core Architectural Principles

1. **Server-First Rendering**: Leverage Next.js App Router for server components by default
2. **Progressive Enhancement**: Start with server components, add client interactivity only when needed
3. **Type Safety**: End-to-end type safety from API to UI using TypeScript + Zod
4. **Separation of Concerns**: Clear boundaries between UI, state, validation, and API layers
5. **Colocation**: Keep related files close together (components with their tests, styles, etc.)
6. **Reusability**: Build atomic, composable components following shadcn/ui patterns
7. **Performance**: Optimize for Core Web Vitals with proper lazy loading and code splitting

### 1.3 User Flow Overview

```
USER JOURNEY: Vehicle → Valuation → Loan → Offers

1. VEHICLE INGESTION
   User enters VIN → VIN Lookup → Display vehicle details → Save vehicle

2. VALUATION REQUEST
   Select vehicle → Request valuation → Display valuation results

3. LOAN APPLICATION
   Select vehicle + valuation → Fill application form → Submit → Eligibility check

4. LOAN OFFERS
   View loan decision → Browse offers → Accept/Decline offer

5. STATUS TRACKING
   View loan status → Track offer expiration → Download documents (future)
```

---

## 2. TECHNOLOGY STACK SPECIFICATIONS

### 2.1 Approved Technologies (DO NOT DEVIATE)

#### 2.1.1 Core Framework
```json
{
  "next": "^15.0.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.3.0"
}
```

**Rules**:
- Next.js 15 with App Router (not Pages Router)
- TypeScript strict mode enabled
- React 18 with Server Components

#### 2.1.2 Styling
```json
{
  "tailwindcss": "^3.4.0",
  "tailwindcss-animate": "^1.0.7",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0"
}
```

**Rules**:
- TailwindCSS for all styling (no CSS modules, no styled-components)
- shadcn/ui for UI components (installed via CLI, not npm)
- Use `cn()` utility for className merging
- No inline styles except for dynamic values

#### 2.1.3 State Management
```json
{
  "@tanstack/react-query": "^5.17.0",
  "zustand": "^4.4.0",
  "axios": "^1.6.0"
}
```

**Rules**:
- React Query for ALL server state (API data)
- Zustand for ALL UI state (modals, theme, sidebar)
- NEVER mix server data in Zustand stores
- Axios for HTTP client (not fetch)

#### 2.1.4 Forms & Validation
```json
{
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0"
}
```

**Rules**:
- React Hook Form for ALL forms
- Zod for ALL validation schemas
- zodResolver to connect them
- No manual form state management

#### 2.1.5 UI Components (shadcn/ui)
```bash
# Install via CLI, not npm
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add progress
```

**Rules**:
- Install components as needed via CLI
- Components go in `/components/ui`
- Do NOT modify shadcn/ui base components
- Create wrapper components for customization

#### 2.1.6 Icons
```json
{
  "lucide-react": "^0.303.0"
}
```

**Rules**:
- Use lucide-react for ALL icons
- No other icon library allowed
- Import icons individually: `import { Check } from "lucide-react"`

#### 2.1.7 Development Tools
```json
{
  "eslint": "^8.56.0",
  "prettier": "^3.1.0",
  "prettier-plugin-tailwindcss": "^0.5.0",
  "@typescript-eslint/eslint-plugin": "^6.18.0",
  "@typescript-eslint/parser": "^6.18.0"
}
```

#### 2.1.8 Testing
```json
{
  "vitest": "^1.1.0",
  "@testing-library/react": "^14.1.0",
  "@testing-library/jest-dom": "^6.1.0",
  "@testing-library/user-event": "^14.5.0",
  "@vitejs/plugin-react": "^4.2.0"
}
```

**Rules**:
- Vitest for test runner (not Jest)
- React Testing Library for component tests
- User-event for interactions
- No Enzyme, no shallow rendering

#### 2.1.9 Storybook (Optional)
```json
{
  "storybook": "^7.6.0",
  "@storybook/react": "^7.6.0",
  "@storybook/addon-essentials": "^7.6.0"
}
```

### 2.2 Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 3. DESIGN TOKEN SYSTEM & THEME

### 3.1 Complete Design Token System

This section defines ALL design tokens to prevent Claude/Cursor from hallucinating design choices. These tokens will be used consistently across Tailwind, shadcn/ui, and all components.

#### 3.1.1 Color Palette

**Primary Brand Color** (Trustworthy fintech blue):
```
Primary: #1D4ED8 (blue-700)
Primary Foreground: #FFFFFF
Primary Light: #3B82F6 (blue-600)
Primary Dark: #1E40AF (blue-800)
```

**Secondary Color** (Calm neutral for secondary actions):
```
Secondary: #64748B (slate-500)
Secondary Foreground: #FFFFFF
Secondary Light: #94A3B8 (slate-400)
Secondary Dark: #475569 (slate-600)
```

**Accent Color** (Highlight/attention color):
```
Accent: #0EA5E9 (sky-500)
Accent Foreground: #FFFFFF
Accent Light: #38BDF8 (sky-400)
Accent Dark: #0284C7 (sky-600)
```

**Semantic Colors**:
```
Success: #10B981 (emerald-500)
Success Foreground: #FFFFFF

Warning: #F59E0B (amber-500)
Warning Foreground: #FFFFFF

Error/Destructive: #EF4444 (red-500)
Error Foreground: #FFFFFF

Info: #3B82F6 (blue-500)
Info Foreground: #FFFFFF
```

**Background & Foreground**:
```
Background: #F9FAFB (gray-50)
Foreground: #111827 (gray-900)

Card Background: #FFFFFF
Card Foreground: #111827 (gray-900)

Popover Background: #FFFFFF
Popover Foreground: #111827 (gray-900)
```

**Muted** (Subtle backgrounds and text):
```
Muted Background: #F3F4F6 (gray-100)
Muted Foreground: #6B7280 (gray-500)
```

**Border**:
```
Border: #E5E7EB (gray-200)
Input Border: #D1D5DB (gray-300)
```

**Ring** (Focus rings):
```
Ring: #1D4ED8 (primary)
Ring Offset: #FFFFFF
```

#### 3.1.2 Typography Scale

```
Font Family:
  - Sans: Inter, system-ui, sans-serif
  - Mono: 'JetBrains Mono', monospace

Font Sizes:
  xs:   0.75rem  (12px) - line-height: 1rem
  sm:   0.875rem (14px) - line-height: 1.25rem
  base: 1rem     (16px) - line-height: 1.5rem
  lg:   1.125rem (18px) - line-height: 1.75rem
  xl:   1.25rem  (20px) - line-height: 1.75rem
  2xl:  1.5rem   (24px) - line-height: 2rem
  3xl:  1.875rem (30px) - line-height: 2.25rem
  4xl:  2.25rem  (36px) - line-height: 2.5rem
  5xl:  3rem     (48px) - line-height: 1

Font Weights:
  normal:   400
  medium:   500
  semibold: 600
  bold:     700
```

#### 3.1.3 Spacing Scale

```
Spacing (matches Tailwind default):
  0:   0px
  px:  1px
  0.5: 0.125rem (2px)
  1:   0.25rem  (4px)
  2:   0.5rem   (8px)
  3:   0.75rem  (12px)
  4:   1rem     (16px)
  5:   1.25rem  (20px)
  6:   1.5rem   (24px)
  8:   2rem     (32px)
  10:  2.5rem   (40px)
  12:  3rem     (48px)
  16:  4rem     (64px)
  20:  5rem     (80px)
  24:  6rem     (96px)
```

#### 3.1.4 Border Radius

```
Border Radius:
  none: 0
  sm:   0.125rem (2px)
  base: 0.25rem  (4px)
  md:   0.375rem (6px)
  lg:   0.5rem   (8px)
  xl:   0.75rem  (12px)
  2xl:  1rem     (16px)
  3xl:  1.5rem   (24px)
  full: 9999px
```

#### 3.1.5 Shadows

```
Box Shadows:
  sm:   0 1px 2px 0 rgb(0 0 0 / 0.05)
  base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
  md:   0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
  lg:   0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
  xl:   0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
  2xl:  0 25px 50px -12px rgb(0 0 0 / 0.25)
  inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05)
  none: none
```

### 3.2 CSS Variables (globals.css)

```css
@layer base {
  :root {
    /* Background & Foreground */
    --background: 0 0% 98%;           /* #F9FAFB - gray-50 */
    --foreground: 222.2 84% 4.9%;     /* #111827 - gray-900 */

    /* Card */
    --card: 0 0% 100%;                /* #FFFFFF */
    --card-foreground: 222.2 84% 4.9%; /* #111827 */

    /* Popover */
    --popover: 0 0% 100%;             /* #FFFFFF */
    --popover-foreground: 222.2 84% 4.9%; /* #111827 */

    /* Primary */
    --primary: 221.2 83.2% 53.3%;     /* #1D4ED8 - blue-700 */
    --primary-foreground: 0 0% 100%;   /* #FFFFFF */

    /* Secondary */
    --secondary: 215.4 16.3% 46.9%;   /* #64748B - slate-500 */
    --secondary-foreground: 0 0% 100%; /* #FFFFFF */

    /* Accent */
    --accent: 199.2 89.1% 48.4%;      /* #0EA5E9 - sky-500 */
    --accent-foreground: 0 0% 100%;    /* #FFFFFF */

    /* Muted */
    --muted: 220 14.3% 95.9%;         /* #F3F4F6 - gray-100 */
    --muted-foreground: 220 8.9% 46.1%; /* #6B7280 - gray-500 */

    /* Destructive */
    --destructive: 0 84.2% 60.2%;     /* #EF4444 - red-500 */
    --destructive-foreground: 0 0% 100%; /* #FFFFFF */

    /* Border */
    --border: 220 13% 91%;            /* #E5E7EB - gray-200 */
    --input: 220 13% 91%;             /* #E5E7EB - gray-200 */

    /* Ring */
    --ring: 221.2 83.2% 53.3%;        /* #1D4ED8 - primary */

    /* Radius */
    --radius: 0.5rem;                 /* 8px */

    /* Success */
    --success: 142.1 76.2% 36.3%;     /* #10B981 - emerald-500 */
    --success-foreground: 0 0% 100%;   /* #FFFFFF */

    /* Warning */
    --warning: 37.7 92.1% 50.2%;      /* #F59E0B - amber-500 */
    --warning-foreground: 0 0% 100%;   /* #FFFFFF */

    /* Info */
    --info: 217.2 91.2% 59.8%;        /* #3B82F6 - blue-500 */
    --info-foreground: 0 0% 100%;      /* #FFFFFF */
  }

  .dark {
    /* Dark mode overrides */
    --background: 222.2 84% 4.9%;     /* #111827 - gray-900 */
    --foreground: 210 40% 98%;        /* #F9FAFB - gray-50 */

    --card: 222.2 84% 4.9%;           /* #111827 */
    --card-foreground: 210 40% 98%;   /* #F9FAFB */

    --popover: 222.2 84% 4.9%;        /* #111827 */
    --popover-foreground: 210 40% 98%; /* #F9FAFB */

    --muted: 217.2 32.6% 17.5%;       /* #1F2937 - gray-800 */
    --muted-foreground: 215 20.2% 65.1%; /* #9CA3AF - gray-400 */

    --border: 217.2 32.6% 17.5%;      /* #1F2937 - gray-800 */
    --input: 217.2 32.6% 17.5%;       /* #1F2937 */
  }
}
```

### 3.3 Tailwind Configuration (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### 3.4 Component Color Usage Rules

**When to use each color**:

```typescript
// ✅ CORRECT - Use semantic colors for their purpose

// Primary: Main CTAs, primary actions
<Button variant="default">Submit Application</Button>

// Secondary: Secondary actions, cancel buttons
<Button variant="secondary">Cancel</Button>

// Accent: Highlights, badges, notifications
<Badge variant="accent">New</Badge>

// Success: Success messages, approved status
<Alert variant="success">Loan Approved!</Alert>

// Warning: Warning messages, pending status
<Alert variant="warning">Pending Review</Alert>

// Destructive: Errors, delete actions, rejected status
<Button variant="destructive">Delete Vehicle</Button>
<Alert variant="destructive">Loan Rejected</Alert>

// Muted: Disabled states, placeholders
<Button variant="ghost" disabled>Disabled</Button>
```

**Color Anti-Patterns**:
```typescript
// ❌ INCORRECT - Don't use arbitrary colors
<div className="bg-[#FF5733]">Bad</div>

// ❌ INCORRECT - Don't use raw Tailwind colors for semantic meaning
<Button className="bg-red-500">Delete</Button> // Use variant="destructive"

// ✅ CORRECT - Use design tokens
<Button variant="destructive">Delete</Button>
```

---

## 4. FRONTEND DOMAIN MODEL

### 4.1 Domain Entities

#### 4.1.1 Vehicle Domain

**TypeScript Interface** (from API):
```typescript
interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: VehicleCondition;
  transmission: Transmission;
  fuelType: FuelType;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

enum VehicleCondition {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR'
}

enum Transmission {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL'
}

enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID'
}
```

**Zod Schema** (for validation):
```typescript
import { z } from 'zod';

export const vehicleConditionEnum = z.enum([
  'EXCELLENT',
  'GOOD',
  'FAIR',
  'POOR'
]);

export const transmissionEnum = z.enum(['AUTOMATIC', 'MANUAL']);

export const fuelTypeEnum = z.enum([
  'PETROL',
  'DIESEL',
  'ELECTRIC',
  'HYBRID'
]);

export const createVehicleSchema = z.object({
  vin: z
    .string()
    .length(17, 'VIN must be exactly 17 characters')
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/,
      'VIN must be 17 alphanumeric characters (excluding I, O, Q)'
    ),
  mileage: z
    .number()
    .int()
    .positive('Mileage must be a positive number')
    .min(0, 'Mileage cannot be negative'),
  condition: vehicleConditionEnum,
  color: z.string().optional()
});

export const createVehicleManualSchema = createVehicleSchema.extend({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z
    .number()
    .int()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  transmission: transmissionEnum,
  fuelType: fuelTypeEnum
});

// Infer TypeScript types from schemas
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type CreateVehicleManualInput = z.infer<typeof createVehicleManualSchema>;
```

**UI Representation**:
- Vehicle card component showing key details
- Vehicle detail page with full information
- Vehicle selection dropdown/cards for loan application

**Form Structure**:
- VIN lookup form (1 field: VIN)
- Manual vehicle entry form (all fields)

#### 4.1.2 Valuation Domain

**TypeScript Interface**:
```typescript
interface Valuation {
  id: string;
  vehicleId: string;
  estimatedValue: number;
  minValue: number;
  maxValue: number;
  source: string;
  valuationDate: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

interface ValuationListResponse {
  data: Valuation[];
  averageValue: number;
}
```

**Zod Schema**:
```typescript
export const createValuationSchema = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID')
});

export type CreateValuationInput = z.infer<typeof createValuationSchema>;
```

**UI Representation**:
- Valuation result card showing price range
- Valuation history list
- Average valuation display
- Price chart (optional)

**Form Structure**:
- Valuation request form (vehicle selector only)

#### 4.1.3 Loan Application Domain

**TypeScript Interface**:
```typescript
interface LoanApplication {
  id: string;
  vehicleId: string;
  valuationId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  monthlyIncome: number;
  employmentStatus: EmploymentStatus;
  requestedAmount: number;
  loanTerm: number;
  status: LoanStatus;
  eligibilityStatus: EligibilityStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

enum EmploymentStatus {
  EMPLOYED = 'EMPLOYED',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  UNEMPLOYED = 'UNEMPLOYED',
  RETIRED = 'RETIRED'
}

enum LoanStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

enum EligibilityStatus {
  ELIGIBLE = 'ELIGIBLE',
  INELIGIBLE = 'INELIGIBLE',
  PENDING_CHECK = 'PENDING_CHECK'
}
```

**Zod Schema**:
```typescript
export const employmentStatusEnum = z.enum([
  'EMPLOYED',
  'SELF_EMPLOYED',
  'UNEMPLOYED',
  'RETIRED'
]);

export const loanTermEnum = z.enum(['12', '24', '36', '48', '60']);

export const createLoanApplicationSchema = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  applicantName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  applicantEmail: z.string().email('Invalid email address'),
  applicantPhone: z
    .string()
    .regex(/^\+234[0-9]{10}$/, 'Phone must be in format +234XXXXXXXXXX'),
  monthlyIncome: z
    .number()
    .positive('Income must be positive')
    .min(150000, 'Minimum monthly income is ₦150,000'),
  employmentStatus: employmentStatusEnum,
  requestedAmount: z
    .number()
    .positive('Amount must be positive')
    .min(500000, 'Minimum loan amount is ₦500,000')
    .max(20000000, 'Maximum loan amount is ₦20,000,000'),
  loanTerm: loanTermEnum.transform(Number)
});

export type CreateLoanApplicationInput = z.infer<typeof createLoanApplicationSchema>;
```

**UI Representation**:
- Loan application form (multi-step wizard)
- Loan status card
- Eligibility result display
- Rejection reason alert

**Form Structure**:
- Multi-step loan application form:
  - Step 1: Vehicle selection
  - Step 2: Personal information
  - Step 3: Financial information
  - Step 4: Loan details
  - Step 5: Review & Submit

#### 4.1.4 Offer Domain

**TypeScript Interface**:
```typescript
interface Offer {
  id: string;
  loanApplicationId: string;
  offeredAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalPayable: number;
  status: OfferStatus;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

enum OfferStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED'
}
```

**Zod Schema**:
```typescript
export const offerStatusEnum = z.enum(['ACTIVE', 'EXPIRED', 'ACCEPTED', 'DECLINED']);

// No creation schema needed (offers are generated by backend)
```

**UI Representation**:
- Offer card showing loan terms
- Offer comparison table
- Offer action buttons (Accept/Decline)
- Expiration countdown timer

**Form Structure**:
- No form needed (offers are generated)
- Confirmation dialog for accept/decline actions

### 4.2 Pagination & Filter Models

**Pagination Interface**:
```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

**Zod Schema**:
```typescript
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10)
});
```

### 4.3 Error Models

**Error Response Interface**:
```typescript
interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  errors?: Array<{
    field: string;
    message: string | string[];
    value?: any;
  }>;
  correlationId?: string;
}
```

---

## 5. COMPLETE FOLDER STRUCTURE

### 5.1 Root Structure

```
autochek-frontend/
├── .next/                          # Next.js build output (gitignored)
├── .storybook/                     # Storybook configuration
├── public/                         # Static assets
│   ├── fonts/                      # Custom fonts
│   ├── images/                     # Static images
│   └── favicon.ico
├── src/                            # Source code
│   ├── app/                        # Next.js App Router pages
│   ├── components/                 # React components
│   ├── lib/                        # Utilities and libraries
│   ├── styles/                     # Global styles
│   └── types/                      # TypeScript types
├── tests/                          # Test files (mirrors src structure)
├── .env.local                      # Local environment variables
├── .env.example                    # Environment template
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── .prettierrc                     # Prettier configuration
├── components.json                 # shadcn/ui configuration
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── vitest.config.ts                # Vitest configuration
```

### 5.2 Detailed `/src` Structure

```
src/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout (providers, fonts, etc.)
│   ├── page.tsx                    # Home page
│   ├── error.tsx                   # Global error boundary
│   ├── loading.tsx                 # Global loading fallback
│   ├── not-found.tsx               # 404 page
│   │
│   ├── (dashboard)/                # Route group (shared layout)
│   │   ├── layout.tsx              # Dashboard layout
│   │   │
│   │   ├── vehicles/               # Vehicles routes
│   │   │   ├── page.tsx            # List vehicles
│   │   │   ├── loading.tsx         # Loading state
│   │   │   ├── error.tsx           # Error boundary
│   │   │   ├── new/                # Create vehicle
│   │   │   │   └── page.tsx
│   │   │   └── [id]/               # Vehicle details
│   │   │       ├── page.tsx
│   │   │       ├── loading.tsx
│   │   │       └── error.tsx
│   │   │
│   │   ├── valuations/             # Valuations routes
│   │   │   ├── page.tsx            # List valuations
│   │   │   ├── new/                # Request valuation
│   │   │   │   └── page.tsx
│   │   │   └── [id]/               # Valuation details
│   │   │       └── page.tsx
│   │   │
│   │   ├── loans/                  # Loans routes
│   │   │   ├── page.tsx            # List loan applications
│   │   │   ├── apply/              # Apply for loan
│   │   │   │   └── page.tsx
│   │   │   └── [id]/               # Loan details
│   │   │       ├── page.tsx
│   │   │       └── offers/         # View offers
│   │   │           └── page.tsx
│   │   │
│   │   └── settings/               # Settings (future)
│   │       └── page.tsx
│   │
│   └── api/                        # API routes (if needed)
│       └── health/
│           └── route.ts
│
├── components/                     # React components
│   ├── ui/                         # shadcn/ui components (DO NOT MODIFY)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── skeleton.tsx
│   │   ├── progress.tsx
│   │   └── ...other shadcn components
│   │
│   ├── forms/                      # Form components
│   │   ├── vehicle-form.tsx        # Vehicle creation form
│   │   ├── vin-lookup-form.tsx    # VIN lookup form
│   │   ├── valuation-form.tsx     # Valuation request form
│   │   ├── loan-application-form.tsx  # Loan application wizard
│   │   │   ├── step-vehicle.tsx
│   │   │   ├── step-personal.tsx
│   │   │   ├── step-financial.tsx
│   │   │   ├── step-loan-details.tsx
│   │   │   └── step-review.tsx
│   │   └── form-field-wrapper.tsx # Reusable form field wrapper
│   │
│   ├── vehicles/                   # Vehicle-specific components
│   │   ├── vehicle-card.tsx        # Vehicle display card
│   │   ├── vehicle-list.tsx        # Vehicle list with pagination
│   │   ├── vehicle-details.tsx     # Vehicle details view
│   │   ├── vehicle-selector.tsx    # Vehicle selection dropdown
│   │   └── vehicle-condition-badge.tsx
│   │
│   ├── valuations/                 # Valuation-specific components
│   │   ├── valuation-card.tsx      # Valuation result card
│   │   ├── valuation-list.tsx      # Valuation history
│   │   ├── valuation-chart.tsx     # Price range chart
│   │   └── valuation-summary.tsx   # Summary display
│   │
│   ├── loans/                      # Loan-specific components
│   │   ├── loan-card.tsx           # Loan application card
│   │   ├── loan-list.tsx           # Loan applications list
│   │   ├── loan-status-badge.tsx   # Status indicator
│   │   ├── eligibility-result.tsx  # Eligibility display
│   │   └── rejection-alert.tsx     # Rejection reason alert
│   │
│   ├── offers/                     # Offer-specific components
│   │   ├── offer-card.tsx          # Single offer card
│   │   ├── offer-list.tsx          # List of offers
│   │   ├── offer-comparison.tsx    # Compare multiple offers
│   │   ├── offer-countdown.tsx     # Expiration timer
│   │   └── offer-actions.tsx       # Accept/Decline buttons
│   │
│   ├── layout/                     # Layout components
│   │   ├── header.tsx              # Site header
│   │   ├── sidebar.tsx             # Dashboard sidebar
│   │   ├── footer.tsx              # Site footer
│   │   ├── main-nav.tsx            # Main navigation
│   │   ├── user-nav.tsx            # User menu (future auth)
│   │   └── breadcrumb.tsx          # Breadcrumb navigation
│   │
│   ├── shared/                     # Shared/common components
│   │   ├── loading-spinner.tsx     # Loading indicator
│   │   ├── empty-state.tsx         # Empty state display
│   │   ├── error-message.tsx       # Error display
│   │   ├── pagination.tsx          # Pagination controls
│   │   ├── search-input.tsx        # Search component
│   │   ├── data-table.tsx          # Reusable data table
│   │   └── confirmation-dialog.tsx # Confirmation modal
│   │
│   └── providers/                  # Context providers
│       ├── react-query-provider.tsx
│       ├── theme-provider.tsx
│       └── toast-provider.tsx
│
├── lib/                            # Core libraries and utilities
│   ├── api/                        # API client layer
│   │   ├── client.ts               # Axios instance configuration
│   │   ├── endpoints.ts            # API endpoint constants
│   │   ├── vehicles.ts             # Vehicle API functions
│   │   ├── valuations.ts           # Valuation API functions
│   │   ├── loans.ts                # Loan API functions
│   │   ├── offers.ts               # Offer API functions
│   │   └── types.ts                # API response types
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-vehicles.ts         # Vehicle-related hooks
│   │   ├── use-valuations.ts       # Valuation-related hooks
│   │   ├── use-loans.ts            # Loan-related hooks
│   │   ├── use-offers.ts           # Offer-related hooks
│   │   ├── use-toast.tsx           # Toast notification hook
│   │   ├── use-debounce.ts         # Debounce hook
│   │   └── use-pagination.ts       # Pagination hook
│   │
│   ├── validations/                # Zod validation schemas
│   │   ├── vehicle.schemas.ts      # Vehicle validation
│   │   ├── valuation.schemas.ts    # Valuation validation
│   │   ├── loan.schemas.ts         # Loan validation
│   │   ├── common.schemas.ts       # Common schemas
│   │   └── index.ts                # Barrel export
│   │
│   ├── stores/                     # Zustand stores (UI state only)
│   │   ├── use-ui-store.ts         # Global UI state
│   │   ├── use-loan-wizard-store.ts # Loan application wizard state
│   │   └── use-theme-store.ts      # Theme preferences
│   │
│   ├── utils/                      # Utility functions
│   │   ├── cn.ts                   # className merger (clsx + tailwind-merge)
│   │   ├── format.ts               # Formatting utilities (currency, date)
│   │   ├── validation.ts           # Validation helpers
│   │   ├── constants.ts            # App-wide constants
│   │   └── queryKeys.ts            # React Query key factory
│   │
│   └── config/                     # Configuration files
│       ├── site.ts                 # Site metadata
│       └── api.ts                  # API configuration
│
├── styles/                         # Global styles
│   ├── globals.css                 # Global CSS (Tailwind imports)
│   └── theme.css                   # CSS variables for theming
│
└── types/                          # TypeScript type definitions
    ├── api.types.ts                # API-related types
    ├── entities.types.ts           # Domain entity types
    ├── form.types.ts               # Form-related types
    └── index.ts                    # Barrel export
```

### 5.3 Folder Purpose & Rules

#### `/app` - Next.js App Router
**Purpose**: Define application routes and pages  
**Rules**:
- Use Server Components by default
- Add `'use client'` directive ONLY when needed (forms, interactions)
- Each route can have: page.tsx, loading.tsx, error.tsx, layout.tsx
- Use route groups `(name)` for shared layouts without affecting URL
- File naming: lowercase with hyphens

#### `/components/ui` - shadcn/ui Base Components
**Purpose**: Base UI components from shadcn/ui  
**Rules**:
- DO NOT modify these files directly
- Install via CLI: `npx shadcn-ui@latest add [component]`
- If customization needed, create wrapper in appropriate domain folder
- These are client components (already have 'use client')

#### `/components/forms` - Form Components
**Purpose**: Reusable form components with validation  
**Rules**:
- Always use React Hook Form + Zod
- Client components (add 'use client')
- Include loading and error states
- Colocate form steps for wizards

#### `/components/[domain]` - Domain Components
**Purpose**: Feature-specific components (vehicles, valuations, loans, offers)  
**Rules**:
- Group by domain for easy discovery
- Can be server or client components (mark appropriately)
- Keep related components together

#### `/components/layout` - Layout Components
**Purpose**: App structure components (header, sidebar, footer)  
**Rules**:
- Server components when possible
- Client components only for interactive parts

#### `/components/shared` - Shared Components
**Purpose**: Generic, reusable components used across domains  
**Rules**:
- Must be truly generic (used in 2+ domains)
- Well-documented props interface
- Include TypeScript prop types

#### `/lib/api




## 6. CODING STANDARDS & STYLE GUIDE (FINAL – STRICTLY ENFORCED)

These rules are **non-negotiable** and will be enforced by ESLint + Prettier + TypeScript strict mode.

### 6.1 File & Folder Naming
| Type               | Convention         | Example                          |
|--------------------|--------------------|----------------------------------|
| Folders            | kebab-case         | `loan-application`, `ui`, `hooks` |
| Files (React)      | kebab-case.tsx     | `vehicle-card.tsx`, `use-loans.ts` |
| Files (non-React)  | kebab-case.ts      | `format.ts`, `query-keys.ts`     |
| Components         | PascalCase         | `VehicleCard`, `LoanWizard`      |
| Pages              | page.tsx only      | `src/app/loans/page.tsx`         |
| Route segments     | kebab-case         | `[loan-id]`, `new`, `apply`      |

### 6.2 TypeScript Rules
| Rule                                    | Enforcement |
|----------------------------------------|-------------|
| `strict: true` in tsconfig.json        | Mandatory   |
| No `any`, `as any`, `@ts-ignore`       | Forbidden   |
| Prefer `type` over `interface` for props & data | Required |
| Prefer `interface` only for extending (e.g. React props) | Allowed |
| All Zod schemas → infer types: `z.infer<typeof schema>` | Mandatory |
| Never export raw types from API responses — always go through Zod | Required |

### 6.3 Component Rules
| Rule                                          | Example / Anti-pattern |
|-----------------------------------------------|------------------------|
| Server Components by default                  | `app/page.tsx` → no 'use client' |
| 'use client' only when necessary              | Forms, hooks, onClick, useState |
| Never put 'use client' in `/components/ui`    | shadcn/ui already has it |
| Never import server-only code in client components | Forbidden |
| All interactive components must have `displayName` | `VehicleCard.displayName = 'VehicleCard'` |

### 6.4 Styling Rules (ZERO EXCEPTIONS)
| Allowed                                      | Forbidden |
|----------------------------------------------|----------|
| `bg-primary`, `text-primary-foreground`      | `bg-blue-700`, `text-white` |
| `border`, `rounded-lg`                       | `border-gray-300`, `rounded-md` |
| `shadow-md`, `ring-primary`                  | `shadow`, `outline-none` |
| `className={cn(...)}` only                   | `clsx`, `classnames`, template strings |
| Dynamic values only via inline style or cn() | `className="p-[${size}]"` |

### 6.5 Form & Validation Rules
| Rule                                          | Enforcement |
|-----------------------------------------------|-------------|
| Only React Hook Form + Zod                    | No useState forms |
| Every form uses `zodResolver(schema)`         | Mandatory |
| All form components live in `/components/forms` | Required |
| Multi-step wizard → Zustand store only        | No URL state |
| Never disable submit button manually — use `isSubmitting` | Required |

### 6.6 State Management Rules
| Tool          | Allowed For                          | Forbidden For             |
|---------------|--------------------------------------|---------------------------|
| React Query   | All API data, caching, mutations     | UI state, modals          |
| Zustand       | Modals, theme, sidebar, wizard steps | Vehicle lists, loan data  |

### 6.7 API & Data Fetching Rules
| Rule                                          | Enforcement |
|-----------------------------------------------|-------------|
| All HTTP calls go through `/lib/api/*.ts`     | Never call axios directly in components |
| All endpoints return parsed + typed data      | Use Zod `.transform()` if needed |
| Never use `fetch` — only Axios                | Forbidden |
| All mutations show toast on success/error     | Automatic via React Query defaults |

### 6.8 Toast & User Feedback Rules
| Rule                                          | Enforcement |
|-----------------------------------------------|-------------|
| Only one toast system: `import { toast } from "@/components/ui/use-toast"` | No alert(), console.log, custom toasts |
| Success → `toast({ title: "Success", description: "..." })` | Required |
| Error → `toast({ variant: "destructive", ... })` | Required |
| Never use `console.log` in production code    | Use `logger` only if needed |

### 6.9 Utility & Helper Rules
| Utility       | File Location                        | Usage |
|---------------|--------------------------------------|-------|
| `cn()`        | `src/lib/utils/cn.ts`              | Only className helper |
| `formatCurrency()` | `src/lib/utils/format.ts`       | Only way to show money |
| `formatDate()`     | `src/lib/utils/format.ts`       | Only way to show dates |
| Query keys    | `src/lib/utils/query-keys.ts`        | Factory pattern only |

### 6.10 Import Rules (ESLint Enforced)
```ts
// Correct order
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useLoans } from '@/lib/hooks/use-loans';
import { createLoanApplicationSchema } from '@/lib/validations/schemas';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

// Forbidden
import something from '../../../../../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
```

### 6.11 ESLint + Prettier Config (Locked)

**.eslintrc.json**
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ],
  "rules": {
    "no-console": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error",
    "no-restricted-imports": [
      "error",
      {
        "patterns": ["../*"]
      }
    ]
  }
}
```

**.prettierrc**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs: false
}
```


## 7. COMPONENT ARCHITECTURE (FINAL – LOCKED)

### 7.1 Component Philosophy

| Principle                         | Rule                                                                 |
|-----------------------------------|----------------------------------------------------------------------|
| Server Components First          | All components are Server Components unless they need interactivity |
| Client Components Only When Required | Add `'use client'` **only** at the top of files that use: <br>• `useState`, `useEffect`, `useRef` <br>• `onClick`, `onSubmit` <br>• React Hook Form <br>• Zustand hooks <br>• React Query mutations |
| Leaf-Level Client Boundary        | Push `'use client'` as deep as possible (never at layout or page level unless unavoidable) |
| No Mixed Server/Client in Same File | Forbidden — split if needed |
| All shadcn/ui components are Client | They already have `'use client'` — never remove it |

### 7.2 Component Types & Locations

| Type                        | Folder                              | Server or Client? | Example Files |
|-----------------------------|-------------------------------------|-------------------|------------------------|
| **UI Primitives**           | `/components/ui`                    | Client (shadcn)   | `button.tsx`, `card.tsx`, `toast.tsx` |
| **Domain Cards**            | `/components/vehicles`, `/components/loans`, etc. | Server if static, Client if interactive | `vehicle-card.tsx` (Server)`, `offer-actions.tsx` (Client) |
| **Forms**                   | `/components/forms`                 | Client            | `loan-wizard.tsx`, `vin-lookup-form.tsx` |
| **Wizard Steps**            | `/components/forms/loan-wizard/steps` | Client          | `step-personal.tsx` |
| **Layout Components**       | `/components/layout`                | Server (except interactive parts) | `header.tsx` (Server), `main-nav.tsx` (Client if has dropdown) |
| **Shared Components**       | `/components/shared`                | Depends           | `data-table.tsx` (Client), `empty-state.tsx` (Server) |
| **Skeletons**               | `/components/skeletons`             | Server            | `vehicle-card-skeleton.tsx` |
| **Providers**               | `/components/providers`             | Client            | `query-provider.tsx` |

### 7.3 Page-Level Component Pattern (MANDATORY)

```tsx
// src/app/(dashboard)/loans/[id]/page.tsx   ← Server Component
import { LoanDetails } from '@/components/loans/loan-details';
import { LoanOffers } from '@/components/loans/loan-offers';
import { LoanStatusHeader } from '@/components/loans/loan-status-header';

export default function LoanDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      <LoanStatusHeader loanId={params.id} />
      <LoanDetails loanId={params.id} />
      <LoanOffers loanId={params.id} />
    </div>
  );
}
```

```tsx
// src/components/loans/loan-details.tsx   ← Client Component
'use client';

import { useLoan } from '@/lib/hooks/use-loans';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/skeletons/loan-card-skeleton';

export function LoanDetails({ loanId }: { loanId: string }) {
  const { data: loan, isLoading, error } = useLoan(loanId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!loan) return <EmptyState />;

  return (
    <Card>
      {/* Render loan data */}
    </Card>
  );
}
```

### 7.4 Form Component Pattern (MANDATORY)

```tsx
// src/components/forms/loan-wizard/steps/step-personal.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormFieldWrapper } from '@/components/forms/form-field-wrapper';

export function StepPersonal() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <>
      <FormFieldWrapper name="applicantName" label="Full Name">
        <Input {...register('applicantName')} placeholder="John Doe" />
      </FormFieldWrapper>

      <FormFieldWrapper name="applicantEmail" label="Email">
        <Input {...register('applicantEmail')} type="email" />
      </FormFieldWrapper>

      <FormFieldWrapper name="applicantPhone" label="Phone Number">
        <Input {...register('applicantPhone')} placeholder="+2348012345678" />
      </FormFieldWrapper>
    </>
  );
}
```

### 7.5 Data Fetching Component Pattern

| Pattern                          | Location                        | Example |
|----------------------------------|---------------------------------|--------|
| Server Component + Direct Fetch  | Page or Server Component        | `app/vehicles/page.tsx` fetches with `fetch` |
| Client Component + React Query   | Interactive pages               | `useVehicles()` hook |
| Hybrid (Recommended)             | Server → passes data → Client   | `generateMetadata` + `useVehicles()` |

### 7.6 Required Wrapper Components (MUST EXIST)

| Component                        | Purpose                                      | Location |
|----------------------------------|----------------------------------------------|----------|
| `FormFieldWrapper`               | Consistent label + error + description       | `/components/forms` |
| `DataTable`                      | All paginated lists                          | `/components/shared` |
| `EmptyState`                     | No data states                               | `/components/shared` |
| `ErrorMessage`                   | Consistent error UI                          | `/components/shared` |
| `ConfirmationDialog`             | Accept/decline offer, delete actions         | `/components/shared` |
| `ToasterWrapper`                 | `<Toaster />` placement                      | `/components/shared` |

### 7.7 Props & Component Contracts

```tsx
// Correct
interface VehicleCardProps {
  vehicle: Vehicle;
  onValuationClick?: () => void;
  className?: string;
}

// Correct — use React.FC only if needed
export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onValuationClick, className }) => { ... }

// Forbidden
type Props = { ... } // inside component file
export default function Component(props: any) // no type safety
```

### 7.8 Component Composition Rules

| Allowed                                  | Forbidden |
|------------------------------------------|---------|
| Compose small shadcn/ui primitives       | Rebuild Button, Card, Input |
| Wrapper components for business logic    | Modify `/components/ui/*` directly |
| `<Card><CardHeader><CardTitle>...</CardTitle></CardHeader></Card>` | Custom div soup with same styles |



## 8. STATE MANAGEMENT STRATEGY (FINAL – LOCKED)

### 8.1 The Golden Rule (NON-NEGOTIABLE)

| Data Type               | Where It Belongs         | Tool Used        | NEVER Use The Other |
|-------------------------|--------------------------|------------------|------------------|---------------------|
| **Server data** (vehicles, valuations, loans, offers, API responses) | React Query             | @tanstack/react-query | Zustand, useState |
| **UI state** (modals, sidebar, theme, form wizard steps, toast visibility) | Zustand                 | zustand             | React Query, localStorage directly |

**Violation = immediate code review rejection.**

### 8.2 React Query – Server State (Single Source of Truth)

| Responsibility                          | Implementation File                          | Rule |
|-----------------------------------------|----------------------------------------------|------|
| All API calls & caching                 | `src/lib/api/*.ts`                           | Only here |
| Typed React Query hooks                 | `src/lib/hooks/use-*.ts`                     | One hook per domain |
| Query keys factory                      | `src/lib/utils/query-keys.ts`                | Never hardcode keys |
| Global defaults (retry, staleTime, toast on error) | `src/components/providers/query-provider.tsx` | Locked config |
| Mutations with automatic invalidation   | Same hooks                                   | Always invalidate on success |

#### 8.2.1 Query Key Factory (MANDATORY PATTERN)

```ts
// src/lib/utils/query-keys.ts
export const queryKeys = {
  vehicles: {
    all: ['vehicles'] as const,
    lists: () => [...queryKeys.vehicles.all, 'list'] as const,
    list: (params: { page?: number; limit?: number }) => 
      [...queryKeys.vehicles.lists(), params] as const,
    detail: (id: string) => [...queryKeys.vehicles.all, id] as const,
  },
  loans: {
    all: ['loans'] as const,
    detail: (id: string) => [...queryKeys.loans.all, id] as const,
  },
  // ... valuations, offers
};
```

#### 8.2.2 React Query Global Configuration (LOCKED)

```tsx
// src/components/providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 30,    // 30 minutes
      },
      mutations: {
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: error?.response?.data?.message || "Please try again",
          });
        },
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 8.3 Zustand – UI State Only (Lightweight & Local)

| Store Name                     | Responsibility                                      | File |
|--------------------------------|-----------------------------------------------------|------|
| `use-ui-store.ts`              | Global UI: sidebar open, mobile menu, theme toggle  | `src/lib/stores/use-ui-store.ts` |
| `use-loan-wizard-store.ts`     | Multi-step loan form state (current step, draft data) | `src/lib/stores/use-loan-wizard-store.ts` |
| `use-theme-store.ts` (optional)| Dark/light mode persistence                         | `src/lib/stores/use-theme-store.ts` |

####  **NEVER** put any server data (vehicle list, loan status) in Zustand.

#### 8.3.1 UI Store Example (MANDATORY PATTERN)

```ts
// src/lib/stores/use-ui-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isMobileMenuOpen: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
```

#### 8.3.2 Loan Wizard Store (MANDATORY PATTERN)

```ts
// src/lib/stores/use-loan-wizard-store.ts
import { create } from 'zustand';

interface WizardState {
  currentStep: number;
  data: Partial<CreateLoanApplicationInput>;
  setStep: (step: number) => void;
  updateData: (data: Partial<CreateLoanApplicationInput>) => void;
  reset: () => void;
}

export const useLoanWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  data: {},
  setStep: (step) => set({ currentStep: step }),
  updateData: (newData) => set((state) => ({ 
    data: { ...state.data, ...newData } 
  })),
  reset: () => set({ currentStep: 1, data: {} }),
}));
```

### 8.4 State Flow Diagram

```
Page (Server Component)
   ↓ (passes initial data via props or generateMetadata)
Client Component
   ↓
React Query Hook → Fetches/caches/mutates → API
   ↓
UI updates automatically (no manual state)

Parallel:
Zustand → Controls wizard step, modal open → Re-renders only UI
```

### 8.5 Anti-Patterns (INSTANT REJECTION)

```ts
// NEVER DO THIS
const [vehicles, setVehicles] = useState<Vehicle[]>([]); // use React Query instead
useEffect(() => { axios.get('/vehicles').then(setVehicles) }, []);

// NEVER DO THIS
const useLoanStore = create((set) => ({
  loan: null,
  setLoan: (loan) => set({ loan }),
})); // Loan belongs in React Query

// NEVER DO THIS
localStorage.setItem('loanDraft', JSON.stringify(data)); // Use Zustand persist
```

### 8.6 Summary Table

| Use Case                            | Correct Tool      | Example Hook / Store                     |
|-------------------------------------|-------------------|------------------------------------------|
| List all vehicles                   | React Query       | `useVehicles()`                          |
| Get single loan by ID                  | React Query       | `useLoan(loanId)`                        |
| Submit loan application             | React Query       | `useCreateLoanApplication()`             |
| Open/close sidebar                  | Zustand           | `useUIStore.getState().toggleSidebar()`   |
| Multi-step form progress            | Zustand           | `useLoanWizardStore.getState().currentStep` |
| Theme (dark/light)                  | Zustand + persist | `useThemeStore()`                        |
| Show success toast after mutation   | React Query       | Auto via global onError/onSuccess        |



## 9. API INTEGRATION LAYER (FINAL – LOCKED)

### 9.1 The Single Source of Truth Rule

**ALL** HTTP communication with the backend **MUST** go through files in  
`src/lib/api/`  
**NEVER** call `axios`, `fetch`, or any HTTP client directly in components, pages, or hooks.

Violation = automatic code rejection.

### 9.2 Axios Client – `src/lib/api/client.ts` (MANDATORY)

```ts
// src/lib/api/client.ts
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 12_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – correlation ID + logging
api.interceptors.request.use((config) => {
  const correlationId = crypto.randomUUID();
  config.headers['X-Correlation-ID'] = correlationId;
  return config;
});

// Response interceptor – centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    // Only show toast for non-validation errors (4xx except 400 with field errors)
    if (!error.response?.data?.errors) {
      toast({
        variant: 'destructive',
        title: 'Request failed',
        description: message,
      });
    }

    return Promise.reject(error);
  }
);

export { api };
```

### 9.3 Endpoint Modules (One File Per Domain)

| File                            | Responsibility                              | Example Function |
|---------------------------------|---------------------------------------------|---------------------|
| `vehicles.ts`                   | All vehicle endpoints                       | `createVehicle`, `getVehicle(id)` |
| `valuations.ts`                 | All valuation endpoints                     | `requestValuation(data)` |
| `loans.ts`                      | All loan application endpoints              | `createLoanApplication(data)` |
| `offers.ts`                     | All offer endpoints                         | `acceptOffer(id)` |

#### 9.3.1 Example – `src/lib/api/loans.ts`

```ts
import { api } from './client';
import { createLoanApplicationSchema } from '@/lib/validations/schemas';
import type { CreateLoanApplicationInput } from '@/lib/validations/schemas';

export const createLoanApplication = async (data: CreateLoanApplicationInput) => {
  // Optional: re-validate on client before sending
  const validated = createLoanApplicationSchema.parse(data);
  const response = await api.post('/loans/applications', validated);
  return response.data;
};

export const getLoan = async (id: string) => {
  const response = await api.get(`/loans/applications/${id}`);
  return response.data;
};

export const getLoans = async (params?: { page?: number; limit?: number }) => {
  const response = await api.get('/loans/applications', { params });
  return response.data;
};
```

### 9.4 Type Safety Pipeline (END-TO-END)

```
Zod Schema
   ↓ (z.infer)
TypeScript Type
   ↓ (passed to API function)
Validated + Typed Request → Backend
   ↓
Backend Response → Parsed by Zod (optional)
   ↓
Typed Data → React Query → UI
```

Never trust raw API responses — always type them.

### 9.5 Environment Variables (MANDATORY)

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1

# Production
NEXT_PUBLIC_API_BASE_URL=https://api.autochek.africa/api/v1
```

Never hardcode `/api/v1` anywhere.

### 9.6 Error Handling Standards

| Error Type           | How It's Handled                              | UI Result                     |
|----------------------|---------------------------------------------------|-------------------------------|
| Network error        | Axios interceptor                                 | Toast (destructive)           |
| 4xx (validation)     | Backend returns `errors[]` with field info        | Form errors via `setError()`  |
| 5xx                  | Axios interceptor                                 | Toast + retry option          |
| 401/403              | Future: redirect to login                         | Auth flow (not yet)           |

### 9.7 API Layer Structure Summary

```
src/lib/api/
├── client.ts          # Axios instance + interceptors (DO NOT TOUCH)
├── endpoints.ts       # Optional: string constants
├── vehicles.ts        # createVehicle, getVehicles, getVehicle(id)
├── valuations.ts      # requestValuation, getValuationHistory
├── loans.ts           # createLoanApplication, getLoan(id), getLoans
├── offers.ts          # acceptOffer(id), declineOffer(id)
└── types.ts           # Shared request/response types (if needed)
```

### 9.8 Forbidden Patterns

```ts
// NEVER DO THIS
const { data } = await fetch('/api/v1/loans');
const { data } = await axios.get('/loans/applications');

// NEVER DO THIS — duplicate logic
// components/loans/loan-form.tsx calling axios directly

// NEVER DO THIS — no validation
api.post('/loans/applications', dirtyFormData);
```

### 9.9 Future-Proof Extensions (Already Supported)

- Authentication: add JWT to request interceptor
- File uploads: use `FormData` in API functions
- WebSocket: separate module, not here


```



## 10. FORM ARCHITECTURE (FINAL – LOCKED)

### 10.1 The One True Form Rule

**Every single form in the entire application MUST follow this exact pattern:**

```
React Hook Form + Zod + zodResolver + FormFieldWrapper
```

**No exceptions. No useState. No manual validation.**

### 10.2 Folder Structure (MANDATORY)

```
src/components/forms/
├── vin-lookup-form.tsx
├── vehicle-form.tsx                # Manual vehicle entry
├── valuation-form.tsx
├── loan-wizard/
│   ├── loan-wizard.tsx             # Main wizard shell
│   └── steps/
│       ├── step-vehicle.tsx
│       ├── step-personal.tsx
│       ├── step-financial.tsx
│       ├── step-loan-details.tsx
│       └── step-review.tsx
├── form-field-wrapper.tsx          # Reusable field + label + error
└── form-actions.tsx                # Submit / Back buttons
```

### 10.3 FormFieldWrapper – The Only Way to Render Fields

```tsx
// src/components/forms/form-field-wrapper.tsx
'use client';

import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';

interface FormFieldWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  label: string;
  description?: string;
  children: React.ReactNode;
}

export function FormFieldWrapper<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ name, label, description, children }: FormFieldWrapperProps<TFieldValues, TName>) {
  const { formState: { errors } } = useFormContext();

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{children}</FormControl>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <FormMessage>{errors[name]?.message as string}</FormMessage>
    </FormItem>
  );
}
```

### 10.4 Required Form Pattern (MUST COPY EXACTLY)

```tsx
// Example: src/components/forms/loan-wizard/steps/step-personal.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormFieldWrapper } from '@/components/forms/form-field-wrapper';

export function StepPersonal() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <FormFieldWrapper name="applicantName" label="Full Name">
        <Input {...register('applicantName')} placeholder="John Doe" />
      </FormFieldWrapper>

      <FormFieldWrapper name="applicantEmail" label="Email Address">
        <Input {...register('applicantEmail')} type="email" placeholder="john@example.com" />
      </FormFieldWrapper>

      <FormFieldWrapper 
        name="applicantPhone" 
        label="Phone Number" 
        description="Nigerian number with country code"
      >
        <Input {...register('applicantPhone')} placeholder="+2348012345678" />
      </FormFieldWrapper>
    </div>
  );
}
```

### 10.5 Loan Application Wizard – The Gold Standard

```tsx
// src/components/forms/loan-wizard/loan-wizard.tsx
'use client';

import { Form } from '@/components/ui/form';
import { useLoanWizardStore } from '@/lib/stores/use-loan-wizard-store';
import { createLoanApplicationSchema } from '@/lib/validations/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { StepVehicle } from './steps/step-vehicle';
import { StepPersonal } from './steps/step-personal';
import { StepFinancial } from './steps/step-financial';
import { StepLoanDetails } from './steps/step-loan-details';
import { StepReview } from './steps/step-review';
import { FormActions } from '@/components/forms/form-actions';

const steps = [
  { id: 1, name: 'Vehicle' },
  { id: 2, name: 'Personal' },
  { id: 3, name: 'Financial' },
  { id: 4, name: 'Loan Details' },
  { id: 5, name: 'Review' },
];

export function LoanWizard() {
  const { currentStep, data, setStep, updateData, reset } = useLoanWizardStore();

  const form = useForm({
    resolver: zodResolver(createLoanApplicationSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  // Sync form data to Zustand on change
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      updateData(value as any);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (values: any) => {
    try {
      await createLoanApplication(values);
      toast({ title: 'Success', description: 'Loan application submitted!' });
      reset();
    } catch (error) {
      // Error already toasted by React Query
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Progress indicator */}
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                'text-sm font-medium',
                currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {step.name}
            </div>
          ))}
        </div>

        {/* Current step */}
        {currentStep === 1 && <StepVehicle />}
        {currentStep === 2 && <StepPersonal />}
        {currentStep === 3 && <StepFinancial />}
        {currentStep === 4 && <StepLoanDetails />}
        {currentStep === 5 && <StepReview />}

        <FormActions
          currentStep={currentStep}
          totalSteps={steps.length}
          isSubmitting={form.formState.isSubmitting}
          onBack={() => setStep(currentStep - 1)}
        />
      </form>
    </Form>
  );
}
```

### 10.6 Form Submission Flow

```
1. User fills form → Zod validates onChange
2. Submit → handleSubmit → onSubmit
3. Call API function from /lib/api/loans.ts
4. React Query mutation runs
5. Success → Success: toast + invalidate queries + reset wizard
   → Error: toast (from React Query global config)
6. Backend validation errors → mapped via setError() in mutation
```

### 10.7 Forbidden Form Patterns

```tsx
// NEVER DO THIS
const [name, setName] = useState('');
<input value={name} onChange={(e) => setName(e.target.value)} />

// NEVER DO THIS
// Manual validation
if (!email.includes('@')) setError('Invalid email');

// NEVER DO THIS
// Form not wrapped in <FormProvider>
```

### 10.8 Summary

| Form Type                 | Schema Location                     | Component Location                   | State Storage       |
|---------------------------|-------------------------------------|-------------------------------------|---------------------|
| VIN Lookup                | `vehicle.schemas.ts`                | `vin-lookup-form.tsx`               | Local (no store)    |
| Manual Vehicle Entry      | `vehicle.schemas.ts`                | `vehicle-form.tsx`                  | React Query         |
| Valuation Request         | `valuation.schemas.ts`              | `valuation-form.tsx`                | React Query         |
| Loan Application (Wizard) | `loan.schemas.ts`                   | `loan-wizard/*`                     | Zustand + RHF       |




## 11. ERROR HANDLING & UX PATTERNS (FINAL – LOCKED)

### 11.1 The 4-Layer Error Defense (MANDATORY)

| Layer                     | Responsibility                                         | Implementation |
|---------------------------|--------------------------------------------------------|----------------|
| 1. Axios Interceptor      | Catch all network / server errors                      | `src/lib/api/client.ts` |
| 2. React Query Global     | Toast on mutation error + retry logic                  | `query-provider.tsx` |
| 3. Query/Mutation Level   | Custom error boundaries + loading skeletons            | `use-*` hooks + pages |
| 4. Form Level             | Field-specific validation errors from backend          | `setError()` in mutations |

### 11.2 Toast Strategy – One Toast to Rule Them All

**Only use **shadcn/ui toast** → `import { toast } from "@/components/ui/use-toast"`

| Scenario                          | Toast Config                                      | Triggered From |
|-----------------------------------|---------------------------------------------------|----------------|
| Mutation success                  | `toast({ title: "Success", description: "..." })` | Mutation `onSuccess` |
| Mutation error (general)          | `variant: "destructive"` + message                | Global React Query config |
| Validation errors (400 + fields)  | No toast → show inline field errors               | `setError()` in mutation |
| Network offline / timeout         | `toast({ variant: "destructive", title: "No connection" })` | Axios interceptor |
| 5xx server error                  | `toast({ variant: "destructive", title: "Server error" })` | Axios interceptor |

**Never use** `alert()`, `window.confirm()`, custom toast libraries.

### 11.3 Loading States – Zero Flash of Blank

| Data Type                   | Required Loading UI                                 | Location |
|-----------------------------|-----------------------------------------------------|----------|
| Full page data              | `<LoadingSpinner />` + page-level `loading.tsx`     | `app/(dashboard)/*/loading.tsx` |
| Card / section data         | Dedicated skeleton                                  | `/components/skeletons/` |
| Table / list                | `DataTableSkeleton`                                 | `/components/skeletons/data-table-skeleton.tsx` |
| Form submission             | Button `loading` state + disabled                   | `isSubmitting` from RHF |

**Rule:** No page or component ever shows a blank state for >300ms.

### 11.4 Empty States – Beautiful & Actionable

Every list/card must handle empty state:

```tsx
// Pattern used everywhere
{isLoading ? (
  <DataTableSkeleton />
) : data?.length ? (
  <DataTable data={data} />
) : (
  <EmptyState
    icon={<Car className="h-12 w-12 text-muted-foreground" />}
    title="No vehicles found"
    description="Start by adding your first vehicle."
    action={<Button onClick={() => router.push('/vehicles/new')}>Add Vehicle</Button>}
  />
)}
```

`EmptyState` component lives in `/components/shared/empty-state.tsx`

### 11.5 Error Boundaries & Fallbacks

| Scope                     | Fallback UI                                          | File |
|---------------------------|-------------------------------------------------------|------|
| Global (App Router)       | `app/error.tsx` + `app/not-found.tsx`               | Both |
| Page-level                | `error.tsx` in route segment                         | Per route |
| Component-level           | `<ErrorBoundary>` wrapper (optional)                 | Rare |
| React Query error         | Custom error UI in hook + retry button            | `use-*` hooks |

#### Required `app/error.tsx`
```tsx
'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <AlertCircle className="h-16 w-16 text-destructive" />
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {error.message || 'An unexpected error occurred'}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### 11.6 Form Error Handling (CRITICAL)

When backend returns validation fails (400 + field errors):

```ts
// In mutation
onError: (error: any) => {
  if (error.response?.data?.errors) {
    error.response.data.errors.forEach((err: any) => {
      setError(err.field as keyof FormData, {
        type: 'server',
        message: err.message,
      });
    });
  }
}
```

→ Shows red error **under each field**  
→ No duplicate toast

### 11.7 Offline & Slow Network Handling

| Condition                  | UX Pattern |
|----------------------------|----------|
| No internet                | Toast + disable submit buttons |
| Request > 10s              | Show "Taking longer than usual..." overlay |
| Retry failed query         | "Retry" button in error fallback |

### 11.8 Summary Table – What to Show When

| State                     | UI Component Used                     | Toast? | Inline Error? |
|---------------------------|---------------------------------------|--------|---------------|
| Page loading              | `loading.tsx` + skeletons             | No     | No            |
| Data loading (partial)    | Skeletons                             | No     | No            |
| Empty data                | `EmptyState`                          | No     | No            |
| Query error               | Error UI + retry button               | Yes (if not form) | No |
| Mutation success          | —                                     | Yes    | No            |
| Mutation error (general)  | —                                     | Yes    | No            |
| Validation error          | —                                     | No     | Yes (per field) |
| Network offline           | —                                     | Yes    | Disable forms |

### 11.9 Forbidden UX Patterns

```tsx
// NEVER
alert('Error!');

// NEVER
<div className="text-red-500">Error: {error}</div> // no consistent styling

// NEVER
// Blank white screen on error

// NEVER
// "Loading..." text only — always use skeletons
```



## 12. TESTING STRATEGY (FINAL – LOCKED)

### 12.1 The Testing Trophy (Our Exact Ratio)

| Type               | % of Tests | Tooling Used                                  | Required Coverage |
|--------------------|------------|-----------------------------------------------|-------------------|
| Unit Tests         | 15%        | Vitest + React Testing Library                | 90%+              |
| Component Tests    | 60%        | Vitest + RTL + MSW (API mocking)              | 100% critical UI  |
| Integration Tests  | 20%        | Vitest + real React Query + in-memory API     | All user flows    |
| E2E Tests          | 5%         | Playwright (future – optional)                | Critical paths    |

**Minimum total coverage: 85%** — enforced in CI.

### 12.2 Folder Structure

```
tests/
├── components/          # Mirrors src/components
│   ├── ui/
│   ├── forms/
│   ├── vehicles/
│   └── shared/
├── hooks/               # use-vehicles.test.ts, use-loans.test.ts
├── lib/
│   └── api/             # Test API client behavior
├── pages/               # Page-level integration tests
├── stores/              # Zustand store tests
└── utils/               # cn(), formatCurrency(), etc.
```

### 12.3 Required Testing Patterns

#### 12.3.1 Component Testing (RTL + MSW)

```tsx
// tests/components/forms/vin-lookup-form.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient } from '@tanstack/react-query';
import { VinLookupForm } from '@/components/forms/vin-lookup-form';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('submits VIN and shows vehicle details', async () => {
  server.use(
    http.post('/api/v1/vehicles', () => {
      return HttpResponse.json({
        id: '123',
        vin: '1HGBH41JXMN109186',
        make: 'Honda',
        model: 'Accord',
        year: 2021,
      });
    })
  );

  render(
    <QueryClientProvider client={new QueryClient()}>
      <VinLookupForm />
    </QueryClientProvider>
  );

  await userEvent.type(screen.getByLabelText(/vin/i), '1HGBH41JXMN109186');
  await userEvent.click(screen.getByRole('button', { name: /lookup/i }));

  await waitFor(() => {
    expect(screen.getByText('Honda Accord 2021')).toBeInTheDocument();
  });
});
});
```

#### 12.3.2 React Query Hook Testing

```ts
// tests/hooks/use-loans.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { useLoans } from '@/lib/hooks/use-loans';

const server = setupServer(
  http.get('/api/v1/loans/applications', () => {
    return HttpResponse.json({
      data: [{ id: '1', applicantName: 'John' }],
      meta: { total: 1 }
    });
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

test('fetches loans successfully', async () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useLoans(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.data[0].applicantName).toBe('John');
});
```

#### 12.3.3 Zustand Store Testing

```ts
// tests/stores/use-loan-wizard-store.test.ts
import { act } from '@testing-library/react';
import { useLoanWizardStore } from '@/lib/stores/use-loan-wizard-store';

test('advances steps and stores data', () => {
  const { result } = renderHook(() => useLoanWizardStore());

  expect(result.current.currentStep).toBe(1);

  act(() => result.current.setStep(2));
  expect(result.current.currentStep).toBe(2);

  act(() => result.current.updateData({ applicantName: 'Jane' }));
  expect(result.current.data.applicantName).toBe('Jane');
});
```

### 12.4 Mock Service Worker (MSW) Setup – `tests/mocks/handlers.ts`

```ts
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v1/vehicles', () => {
    return HttpResponse.json({ data: [], meta: { total: 0 } });
  }),
  // ... all other endpoints
];
```

```ts
// tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

Used in all tests via `beforeAll(() => server.listen())`.

### 12.5 Form Testing Standards

| Test Type                     | Must Include |
|-------------------------------|------------|
| Valid submission              | Success toast + navigation |
| Invalid input                 | Inline error messages |
| Backend validation error      | Errors mapped to correct fields |
| Loading state                 | Button disabled + spinner |

### 12.6 Required Test Files (MUST EXIST)

| Component)

| Component                          | Test File Required? | Notes |
|------------------------------------|---------------------|-------|
| All forms                          | Yes                 | Full submit flow |
| All React Query hooks              | Yes                 | Success + error |
| All Zustand stores                 | Yes                 | State changes |
| VehicleCard, Loan, Offer cards      | Yes                 | Rendering + actions |
| DataTable, Pagination              | Yes                 | Sorting, filtering |
| EmptyState, ErrorMessage           | Yes                 | Visual regression optional |

### 12.7 CI/CD Enforcement

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: pnpm test:coverage
- name: Enforce coverage
  uses: verygoodopensource/very_good_coverage
  with:
    min_coverage: 85
```

### 12.8 Forbidden Testing Patterns

```tsx
// NEVER
test('renders', () => { render(<Component />); }); // meaningless

// NEVER
expect(component).toBeTruthy(); // no value

// NEVER
shallow() from Enzyme

// NEVER
mocking useState directly — test behavior, not implementation
```

### 12.9 Summary

| What We Test                     | How We Test It                         | Confidence Level |
|----------------------------------|-----------------------------------------|------------------|
| API integration                  | MSW + real hooks                        | 100%             |
| Form validation                  | Zod + backend error mapping             | 100%             |
| UI state (wizard, modals)        | Zustand + RTL                           | 100%             |
| Loading / empty / error states   | Skeletons + EmptyState + ErrorBoundary  | 100%             |
| Business logic                   | Pure functions in utils + hooks         | 100%             |





## 13. STORYBOOK ARCHITECTURE (FINAL – LOCKED)

### 13.1 Purpose & Scope

Storybook is **optional but strongly recommended** for:
- Visual regression testing
- Component documentation
- Design system enforcement
- Faster UI development in isolation

**We do NOT use Storybook for logic-heavy components (forms with React Query, wizard state)**  
→ Those are tested with Vitest + MSW instead.

### 13.2 Installation & Config (One-Time)

```bash
npx storybook@latest init
# Choose: React + Vite + TypeScript
```

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react-vite',
  core: {
    builder: '@storybook/builder-vite',
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: (config) => {
    // Fix Tailwind + PostCSS
    config.css ??= {};
    config.css.postcss = 'postcss.config.js';
    return config;
  },
};

export default config;
```

### 13.3 Required Storybook Decorators

```tsx
// .storybook/preview.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import '@/styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

export const decorators = [
  (Story) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <div className="p-8 bg-background">
          <Story />
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'centered',
};
```

### 13.4 Story File Rules (MANDATORY)

| Rule                                      | Example |
|-------------------------------------------|---------|
| One story file per component                | `vehicle-card.stories.tsx` |
| File lives next to component              | `src/components/vehicles/vehicle-card.stories.tsx` |
| Must have `Default` story                 | `export default meta;` |
| Must have `Primary` variant               | Shows main use case |
| Use `args` for reusable props             | `Primary.args = { ... }` |
| Use `play` functions only for interactions| Clicking buttons, filling forms |

### 13.5 Approved Storybook Components (ONLY THESE)

| Component                        | Story File Required? | Notes |
|----------------------------------|----------------------|-------|
| All `/components/ui/*`           | Yes (auto-generated) | Do not edit |
| `VehicleCard`                    | Yes                  | With real data |
| `ValuationCard`                  | Yes                  | Show range |
| `LoanCard`                       | Yes                  | All statuses |
| `OfferCard`                      | Yes                  | Active, expired |
| `EmptyState`                     | Yes                  | Different variants |
| `DataTable`                      | Yes                  | With mock data |
| `FormFieldWrapper`               | Yes                  | With error, success, loading |
| `ConfirmationDialog`             | Yes                  | Open/closed |

**NO stories for:**
- Full pages
- Forms with real React Query
- Wizard steps
- Layout components (Header, Sidebar)

### 13.6 Mocking Strategy in Stories

```tsx
// Example: VehicleCard.stories.tsx
import { VehicleCard } from './vehicle-card';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof VehicleCard> = {
  title: 'Components/VehicleCard',
  component: VehicleCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockVehicle = {
  id: '1',
  vin: '1HGBH41JXMN109186',
  make: 'Honda',
  model: 'Accord',
  year: 2021,
  mileage: 45000,
  condition: 'GOOD' as const,
  transmission: 'AUTOMATIC' as const,
  fuelType: 'PETROL' as const,
};

export const Default: Story = {
  args: {
    vehicle: mockVehicle,
  },
};

export const ExcellentCondition: Story = {
  args: {
    vehicle: { ...mockVehicle, condition: 'EXCELLENT' },
  },
};
```

### 13.7 Visual Regression (Future-Proof)

```bash
# Add later
npm install --save-dev @storybook/addon-visual-tests
```

Run weekly in CI to catch accidental style changes.

### 13.8 Scripts

```json
// package.json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### 13.9 Forbidden in Storybook

```tsx
// NEVER
import { useQuery } from '@tanstack/react-query'; // No real data fetching
import { useLoanWizardStore } from '@/lib/stores'; // No Zustand in stories
```

Use props + mock data only.

### 13.10 Summary

| Goal                         | Achieved By                     |
|------------------------------|---------------------------------|
| Design system consistency     | All UI components in Storybook |
| Fast UI iteration            | No need to run full app         |
| Visual documentation         | Auto-docs + stories             |
| Catch style regressions      | Future visual tests             |
| No logic testing here        | Vitest handles that             |




## 14. STEP-BY-STEP IMPLEMENTATION PLAN (FINAL – EXECUTE IN THIS EXACT ORDER)

### Phase 0 – Preparation (5 minutes)
```bash
# 1. Create project
npx create-next-app@15 autochek-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd autochek-frontend
```

### Phase 1 – Foundation & Lock-In (30–40 minutes)
```bash
# 2. Install core dependencies
npm install \
  @tanstack/react-query@^5.17 \
  zustand@^4.5 \
  axios@^1.6 \
  react-hook-form@^7.49 \
  zod@^3.22 \
  @hookform/resolvers@^3.3 \
  lucide-react@^0.303

# 3. Install Tailwind plugins
npm install -D \
  tailwindcss-animate \
  class-variance-authority \
  clsx \
  tailwind-merge

# 4. Initialize shadcn/ui (CSS variables mode)
npx shadcn-ui@latest init
# → When asked “Would you like to use CSS variables for colors?” → Yes
# → Default style → New York
# → Base color → slate

# 5. Add all required shadcn components in one go
npx shadcn-ui@latest add button input form card dialog toast toaster select badge alert table tabs skeleton progress label
```

### Phase 2 – Global Configuration (20 minutes)
```bash
# 6. Replace globals.css with exact CSS variables from Section 3
#    → src/app/globals.css

# 7. Replace tailwind.config.ts with exact config from Section 3

# 8. Create environment variables
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1" > .env.local
cp .env.local .env.example

# 9. Create folder structure exactly as in Section 5
#    (use script or manually – must be 100% identical)
```

### Phase 3 – Core Libraries (30 minutes)
```bash
# 10. Create Axios client
#     → src/lib/api/client.ts (exact code from Section 9)

# 11. Create React Query provider
#     → src/components/providers/query-provider.tsx (exact defaults from Section 8)

# 12. Create Zustand UI store
#     → src/lib/stores/use-ui-store.ts (with persist)

# 13. Create utils
#     → src/lib/utils/cn.ts
#     → src/lib/utils/format.ts (formatCurrency + formatDate)
#     → src/lib/utils/query-keys.ts
```

### Phase 4 – Design Tokens & Providers (15 minutes)
```bash
# 14. Create Toaster wrapper
#     → src/components/shared/toaster-wrapper.tsx
#     → Add <Toaster /> in root layout

# 15. Create skeletons
#     → src/components/skeletons/vehicle-card-skeleton.tsx
#     → src/components/skeletons/data-table-skeleton.tsx
#     → etc.

# 16. Update root layout
#     → src/app/layout.tsx with:
#       - QueryProvider
#       - ThemeProvider (if using)
#       - Toaster
#       - proper <html className="dark"> handling
```

### Phase 5 – Zod Schemas & Types (20 minutes)
```bash
# 17. Create all Zod schemas exactly as in Section 4
#     → src/lib/validations/schemas/
#         vehicle.schemas.ts
#         valuation.schemas.ts
#         loan.schemas.ts
#         index.ts (barrel)

# 18. Create inferred types
#     → src/types/entities.types.ts
```

### Phase 6 – API Layer (25 minutes)
```bash
# 19. Implement API endpoints (one file per domain)
#     → src/lib/api/vehicles.ts
#     → src/lib/api/valuations.ts
#     → src/lib/api/loans.ts
#     → src/lib/api/offers.ts
```

### Phase 7 – React Query Hooks (20 minutes)
```bash
# 20. Create typed hooks
#     → src/lib/hooks/use-vehicles.ts
#     → src/lib/hooks/use-valuations.ts
#     → src/lib/hooks/use-loans.ts
#     → src/lib/hooks/use-offers.ts
```

### Phase 8 – Core UI Components (2–3 hours)
```bash
# 21. Build in this exact order:
#     1. FormFieldWrapper + FormActions
#     2. EmptyState, ErrorMessage, ConfirmationDialog
#     3. VehicleCard + Valuation + Loan + Offer cards
#     4. DataTable + Pagination
#     5. All skeletons
```

### Phase 9 – Forms & Wizard (3–4 hours)
```bash
# 22. Build forms in order:
#     1. VIN Lookup Form
#     2. Manual Vehicle Form
#     3. Valuation Request Form
#     4. Loan Application Wizard (5 steps + Zustand store)
```

### Phase 10 – Pages & Routing (3–4 hours)
```bash
# 23. Implement pages in this order:
#     1. Home / Dashboard
#     2. /vehicles + /vehicles/new + /vehicles/[id]
#     3. /valuations + /valuations/[vehicleId]
#     4. /loans + /loans/apply + /loans/[id] + offers subpage
#     5. Header + Sidebar + Breadcrumb
```

### Phase 11 – Polish & Testing (2–3 hours)
```bash
# 24. Add loading.tsx, error.tsx, not-found.tsx to all routes
# 25. Write tests for:
#     - All forms (valid/invalid submission)
#     - All React Query hooks
#     - Zustand stores
#     - Critical components
# 26. Run full test suite + fix failures
# 27. Run Storybook (optional but recommended)
```

### Phase 12 – Final Checks (30 minutes)
```bash
# 28. Verify:
#     [ ] No raw colors used
#     [ ] All toasts use shadcn toast
#     [ ] All forms use FormFieldWrapper
#     [ ] All API calls go through /lib/api
#     [ ] Coverage ≥ 85%
#     [ ] No console.log remaining
#     [ ] Mobile responsive (test 375px)
#     [ ] Lighthouse score ≥ 90
```

### Timeline Summary

| Phase                  | Duration      | Status |
|------------------------|---------------|--------|
| 0–4 Foundation         | 2–3 hours     | Done   |
| 5–7 Core Libs          | 1.5 hours     | Done   |
| 8–9 UI + Forms         | 5–7 hours     | Done   |
| 10 Pages               | 3–4 hours     | Done   |
| 11–12 Testing + Polish | 3–4 hours     | Done   |
| **Total**              | **15–18 hours** | Done   |




## 15. AI CODE GENERATION PROMPTS (FINAL – COPY-PASTE READY)

These prompts are **battle-tested** and designed to work perfectly with Claude 3.5 Sonnet, Claude 3 Opus, Cursor, and GitHub Copilot.

**Never deviate from these prompts** — they guarantee zero hallucinations and 100% compliance with this architecture.

### 15.1 Master Prompt (Use for Every Task)

```text
You are implementing the Autochek Frontend exactly as defined in AUTOCHEK_FRONTEND_ARCHITECTURE_v1.0_FINAL.md.

RULES YOU MUST OBEY:
1. Follow the document 100% — no deviations allowed
2. Use only the exact folder structure, file names, and paths from Section 5
3. Use only the design tokens from Section 3 — never use raw hex colors
4. All API calls must go through src/lib/api/*.ts — never call axios directly
5. All forms must use React Hook Form + Zod + FormFieldWrapper
6. All toasts must use import { toast } from "@/components/ui/use-toast"
7. All server data comes from React Query hooks in src/lib/hooks/
8. All UI state uses Zustand stores in src/lib/stores/
9. Never add new dependencies
10. Never modify shadcn/ui components in /components/ui

Now implement exactly this:
[YOUR TASK HERE]

Output format:
- Full file path (e.g. src/components/forms/vin-lookup-form.tsx)
- Complete code with all imports
- No placeholders, no TODOs, no comments like "// implement later"
- Ready to copy-paste and run
```

### 15.2 Specific Prompts (Use These)

#### For Any Component
```text
Implement the component: [ComponentName]
Location: [exact path from Section 5]
Props: [list props with types]
Use shadcn/ui components and semantic tokens only.
Include loading skeleton if it displays server data.
Add 'use client' if needed.
```

#### For Forms
```text
Implement the form: [FormName]
Location: src/components/forms/[...]
Use React Hook Form + Zod + zodResolver
Use FormFieldWrapper for every field
Use create[Domain]Schema from src/lib/validations/schemas
On submit: call the correct function from src/lib/api/[domain].ts
Show success toast on success
Handle backend validation errors with setError()
```

#### For React Query Hook
```text
Implement the React Query hook: use[Domain]
Location: src/lib/hooks/use-[domain].ts
Use query keys from src/lib/utils/query-keys.ts
Use API functions from src/lib/api/[domain].ts
Handle loading, error, empty states
Return typed data using z.infer
```

#### For Zustand Store
```text
Implement Zustand store: use[Name]Store
Location: src/lib/stores/use-[name]-store.ts
Only for UI state
Use persist() middleware if needed
Never store server data
```

#### For API Endpoint File
```text
Implement API functions for [domain]
Location: src/lib/api/[domain].ts
Use the Axios instance from src/lib/api/client.ts
All functions must be async
Return parsed data (no response.data.data nesting)
Add JSDoc with request/response types
```

#### For Page
```text
Implement the page: [Page Name]
Location: src/app/(dashboard)/[route]/page.tsx
Use Server Component by default
Fetch initial data with React Query hooks
Use loading.tsx and error.tsx in the same folder
Use proper layout and breadcrumb
```

#### For Skeleton
```text
Implement skeleton: [Component]Skeleton
Location: src/components/skeletons/[...]
Use shadcn/ui skeleton component
Match exact height/spacing of real component
```

### 15.3 Safe Update Prompt (When Modifying Existing File)

```text
You are updating an existing file.

File: [exact path]
Current content: [paste current code ]

Task: [what to add/change]

RULES:
- Only modify the lines necessary
- Do not change imports unless adding a missing one
- Do not refactor unrelated code
- Keep existing structure and comments
- Preserve all type safety

Output only the complete updated file.
```

### 15.4 Emergency Fix Prompt

```text
The code has a bug: [describe bug]

File: [path]
Current code: [paste]

Fix it while following all architecture rules.
Do not add new features.
Output only the corrected file.
```

### 15.5 Final Checklist Prompt (Run Before Commit)

```text
Review this code for compliance with AUTOCHEK_FRONTEND_ARCHITECTURE_v1.0_FINAL.md

Files changed:
[paste file list]

Check for:
- Raw colors used
- Direct axios/fetch calls
- Forms not using React Hook Form + Zod
- Toasts not using shadcn toast
- Server data in Zustand
- Missing skeletons
- Incorrect folder placement
- Missing 'use client' where needed

List any violations. If none, say "PASS – READY TO COMMIT"
```

