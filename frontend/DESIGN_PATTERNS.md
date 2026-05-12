# Design Patterns Used — RwandaTrade Hub
**Course:** SENG 8240 — Best Programming Practices and Design Patterns

---

## 1. Component Pattern (Structural)
**Where:** `src/components/ui/` — Button, Input, Modal, StatusBadge, KPICard, Select

Every reusable UI element is isolated into its own component with a single responsibility. The `StatusBadge` component, for example, maps any status string to a consistent visual output — used identically across Admin, SME, and Investor portals.

```tsx
// src/components/ui/StatusBadge.tsx
// Single responsibility: translate a status string into a styled badge
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status];
  return <span className={`... ${config.bg} ${config.text}`}>...</span>;
};
```

---

## 2. Layout / Composite Pattern (Structural)
**Where:** `src/layouts/AdminLayout.tsx`, `SMELayout.tsx`, `InvestorLayout.tsx`

Each portal is composed of a Sidebar + Topbar + `<Outlet />` (React Router). Child pages are injected via the Outlet without knowing about the shell. This is a direct application of the **Composite pattern** — the layout is a container that holds and renders child components uniformly.

```tsx
// AdminLayout.tsx
<div className="flex h-screen">
  <AdminSidebar collapsed={collapsed} onToggle={...} />
  <main>
    <Topbar ... />
    <Outlet />   {/* Any admin page is injected here */}
  </main>
</div>
```

---

## 3. Strategy Pattern (Behavioral)
**Where:** `src/data/mockData.ts` — `formatCurrency()` function; `src/components/ui/StatusBadge.tsx` — `statusConfig` map

The Strategy pattern defines a family of algorithms and makes them interchangeable. The `statusConfig` object maps each status string to a different rendering "strategy" (different colors, labels). Swapping the status changes the strategy without modifying the component.

```tsx
const statusConfig: Record<Status, { label, bg, text, dot }> = {
  pending:  { label: 'Pending',  bg: 'bg-amber-50', ... },
  funded:   { label: 'Funded',   bg: 'bg-green-50', ... },
  rejected: { label: 'Rejected', bg: 'bg-red-50',   ... },
  // Each entry = a different rendering strategy
};
```

---

## 4. Observer Pattern (Behavioral)
**Where:** Throughout — React's `useState` + `useEffect` hooks

React's state system is an implementation of the Observer pattern. When `setFilter()` or `setSearch()` is called, all subscribed components that depend on that state automatically re-render.

```tsx
// InvoiceVerification.tsx
const [statusFilter, setStatusFilter] = useState('all');
// filtered automatically recomputes when statusFilter changes
const filtered = mockInvoices.filter(inv => 
  statusFilter === 'all' || inv.status === statusFilter
);
```

---

## 5. Factory / Data Object Pattern (Creational)
**Where:** `src/data/mockData.ts`

All mock data (invoices, transactions, investments, SMEs, investors, notifications) is defined in one centralized factory file and exported. Components consume it without knowing the data source — the same factory could later be replaced with a real API without changing any page component.

```ts
// mockData.ts acts as a data factory
export const mockInvoices: Invoice[] = [ ... ];
export const mockInvestors: Investor[] = [ ... ];
export const formatCurrency = (amount: number): string => { ... };
```

---

## 6. Module Pattern (Structural)
**Where:** `src/animations/index.ts`, `src/types/index.ts`

Animation variants and TypeScript interfaces are exported from centralized index files — one module per concern. This prevents duplication and ensures every component uses the same animation timing and type definitions.

```ts
// animations/index.ts — exported and reused across 20+ components
export const staggerContainer = { animate: { transition: { staggerChildren: 0.08 } } };
export const staggerItem = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
```

---

## Summary Table

| Pattern | Type | Where Applied |
|---------|------|--------------|
| Component Pattern | Structural | `src/components/ui/*` — Button, Input, Modal, Badge |
| Composite / Layout Pattern | Structural | `src/layouts/*` — portals contain sidebar + topbar + outlet |
| Strategy Pattern | Behavioral | `statusConfig` map in StatusBadge, formatCurrency |
| Observer Pattern | Behavioral | React `useState`/`useEffect` throughout all pages |
| Factory Pattern | Creational | `src/data/mockData.ts` — centralized data factory |
| Module Pattern | Structural | `src/animations/index.ts`, `src/types/index.ts` |
