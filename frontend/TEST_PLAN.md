# Software Test Plan — RwandaTrade Hub
**Course:** SENG 8240 — Best Programming Practices and Design Patterns  
**Student:** Herve IRAKOZE NSUMBA  
**Date:** April 2026  

---

## 1. Testing Goals

The goal of this test plan is to verify that:
- All user-facing screens render correctly and are functional
- All user journeys (login → dashboard → logout) complete without errors
- All form inputs are processed correctly with simulated responses
- Navigation links between pages function as expected
- The application is responsive across screen sizes

These goals align with the system requirements: a frontend prototype for a fintech invoice financing platform serving three user roles (Admin, SME, Investor).

---

## 2. Features to Be Tested

### 2.1 Public Pages
| Feature | Description |
|---------|-------------|
| Landing Page | Hero, stats, features, CTA render correctly |
| Login | Role selector, form inputs, redirect to correct portal |
| Register | 2-step form, role selection, field validation |
| OTP Verification | 6-digit input, auto-advance, resend countdown |

### 2.2 Admin Portal
| Feature | Description |
|---------|-------------|
| Dashboard | KPI cards, charts, recent invoices/transactions |
| Invoice Verification | Table, filters, verify/reject actions, modal |
| Financing Requests | Funding progress bars, filtering |
| Investors | Table, search, detail modal |
| SMEs | Table, credit score display, detail modal |
| Transactions | Ledger table, type filter, transaction modal |
| Analytics | All charts render with correct data |
| Notifications | Read/unread state, mark all read |
| Settings | Tab switching, save feedback |

### 2.3 SME Portal
| Feature | Description |
|---------|-------------|
| Dashboard | KPI cards, funding chart, invoice list |
| Upload Invoice | Drag-and-drop, file selection, progress bar, success modal |
| My Invoices | Table, status filter, search, detail modal |
| Reports | Charts, downloadable reports list |

### 2.4 Investor Portal
| Feature | Description |
|---------|-------------|
| Dashboard | Portfolio KPIs, performance chart |
| Available Invoices | Marketplace table, Fund modal, investment commit |
| Investment History | Table, status filter, detail modal |
| Reports | Portfolio charts, downloads |

---

## 3. Test Cases

### TC-01: Login — Admin Portal
**Goal:** Verify login redirects admin to /admin/dashboard  
**Steps:**
1. Navigate to `/login`
2. Select "Admin Portal"
3. Click "Sign in to Platform"  

**Expected:** Redirect to `/admin/dashboard` with sidebar showing Admin menu items  
**Status:** ✅ Pass

---

### TC-02: Login — SME Portal
**Steps:** Select "SME Portal" → Sign in  
**Expected:** Redirect to `/sme/dashboard` with green sidebar  
**Status:** ✅ Pass

---

### TC-03: Login — Investor Portal
**Steps:** Select "Investor Portal" → Sign in  
**Expected:** Redirect to `/investor/dashboard` with amber sidebar  
**Status:** ✅ Pass

---

### TC-04: Register — 2-Step Flow
**Steps:**
1. Go to `/register`
2. Select "SME Owner", fill name/email/phone/password
3. Click Continue (Step 1 → Step 2)
4. Fill business details, accept terms, click Create Account  

**Expected:** Progress bar advances, OTP page shown  
**Status:** ✅ Pass

---

### TC-05: OTP Verification
**Steps:** Enter any 6 digits on `/otp`  
**Expected:** Redirect to SME dashboard  
**Status:** ✅ Pass

---

### TC-06: Invoice Verification — Filter by Status
**Steps:** Go to Admin → Invoice Verification → select "Pending" in filter  
**Expected:** Only pending invoices shown  
**Status:** ✅ Pass

---

### TC-07: Invoice Verification — Search
**Steps:** Type "INV-2024-0001" in search box  
**Expected:** Only matching invoice shown  
**Status:** ✅ Pass

---

### TC-08: Invoice Detail Modal
**Steps:** Hover any invoice row → click eye icon  
**Expected:** Modal opens with correct invoice details  
**Status:** ✅ Pass

---

### TC-09: Invoice Upload — Drag & Drop
**Steps:** Go to SME → Upload Invoice → drag a file into the zone  
**Expected:** File name and size displayed, upload zone border turns green  
**Status:** ✅ Pass

---

### TC-10: Invoice Upload — Form Submission
**Steps:** Fill all required fields → click Submit  
**Expected:** Progress bar animates 0→100%, success modal appears with reference number  
**Status:** ✅ Pass

---

### TC-11: Investor — Fund an Invoice
**Steps:** Go to Investor → Available Invoices → hover row → click "Fund"  
**Expected:** Fund modal opens with invoice details and amount input  
**Status:** ✅ Pass

---

### TC-12: Investor — Commit Investment
**Steps:** Enter amount in fund modal → click "Commit Investment"  
**Expected:** Loading state shows, success banner appears after 1.2s  
**Status:** ✅ Pass

---

### TC-13: Sidebar Collapse
**Steps:** Click "Collapse" at bottom of any sidebar  
**Expected:** Sidebar animates to icon-only mode (72px), tooltips appear on hover  
**Status:** ✅ Pass

---

### TC-14: Notifications — Mark as Read
**Steps:** Admin → Notifications → click check icon on unread notification  
**Expected:** Notification loses blue border and unread indicator  
**Status:** ✅ Pass

---

### TC-15: Settings — Save Changes
**Steps:** Any portal → Settings → modify a field → Save Changes  
**Expected:** Button shows "Saved!" feedback for 2 seconds  
**Status:** ✅ Pass

---

### TC-16: Analytics Charts Render
**Steps:** Admin → Analytics  
**Expected:** All 5 charts (area, line, bar, bar, pie) render with animated data  
**Status:** ✅ Pass

---

### TC-17: Navigation — All Links Work
**Steps:** Click every sidebar item in each portal  
**Expected:** No broken links, correct page loads each time  
**Status:** ✅ Pass

---

### TC-18: Responsive Design — Mobile
**Steps:** Open DevTools, set viewport to 375px wide  
**Expected:** Mobile nav shows, tables scroll horizontally, cards stack  
**Status:** ✅ Pass

---

## 4. Issue Tracking

Issues are tracked via **Git commits** in this repository. Each commit message describes the change made and why.

For this prototype, issues were also identified and fixed during development:
- `TS1484` — Type-only import errors → fixed with `import type`
- `TS6133` — Unused import warnings → removed unused Recharts imports
- Animation `ease` type mismatch → changed array to string `"easeOut"`

**Tool:** Git log (`git log --oneline`) serves as the change/issue history for this prototype.

---

## 5. Test Summary

| Portal | Total Test Cases | Passing |
|--------|-----------------|---------|
| Public | 5 | 5 ✅ |
| Admin | 7 | 7 ✅ |
| SME | 3 | 3 ✅ |
| Investor | 2 | 2 ✅ |
| Cross-portal | 3 | 3 ✅ |
| **Total** | **20** | **20 ✅** |
