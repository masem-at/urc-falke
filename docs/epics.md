---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - 'docs/prd.md'
  - 'docs/architecture.md'
  - 'docs/ux-design-specification.md'
---

# urc-falke - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for urc-falke, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**User Management & Onboarding (FR1-FR11):**
- **FR1:** User kann via QR-Code in unter 30 Sekunden onboarden
- **FR2:** User kann USV-Mitgliedsnummer zur Verifizierung eingeben
- **FR3:** System kann USV-Mitgliedsnummer automatisch validieren
- **FR4:** User kann Profilbild hochladen
- **FR5:** User erhält Badge "Gründungsmitglied" bei Onboarding vor Launch
- **FR6:** System generiert automatisch Lostopf-Registrierung für 200€ Verlosung
- **FR7:** User kann Profil bearbeiten (Name, Email, Telefon)
- **FR8:** User kann sich abmelden (Account löschen)
- **FR9:** User sieht "Du bist bereits Mitglied!"-Bestätigung bei USV-Nummer-Verifizierung
- **FR10:** User kann Passwort zurücksetzen via Email
- **FR11:** System zeigt "GRATIS für USV-Mitglieder"-Badge prominent

**Event Management (FR12-FR22):**
- **FR12:** Admin kann Events erstellen mit Datum, Zeit, Treffpunkt, Schwierigkeit
- **FR13:** User kann sich für Events anmelden (<5 Klicks)
- **FR14:** User kann sich von Events abmelden
- **FR15:** User sieht Event-Teilnehmerliste mit Avatars (Social Proof)
- **FR16:** System zeigt "Noch 5 Plätze frei"-Anzeige
- **FR17:** User kann Events in Kalender exportieren (iCal/Google Calendar/Outlook)
- **FR18:** Admin kann Events bearbeiten und löschen
- **FR19:** System sendet Wetter-Warnung 24h vor Event bei Regen >80%
- **FR20:** User sieht vergangene Events (Archiv)
- **FR21:** Admin kann Event-Schwierigkeit festlegen (Leicht/Mittel/Schwer/Rennrad)
- **FR22:** User erhält Event-Erinnerung 48h vor Start

**Communication & AI Assistant (FR23-FR32):**
- **FR23:** User kann mit Falki AI-Chatbot in natürlicher Sprache kommunizieren
- **FR24:** Falki kann Event-Informationen abfragen ("Wann ist die nächste Tour?")
- **FR25:** Falki kann User für Events anmelden via Chat
- **FR26:** Falki kann USV-Mitgliedschafts-Infos bereitstellen
- **FR27:** Falki nutzt Anthropic Claude API (Haiku Model)
- **FR28:** System loggt alle Falki-Interaktionen für Verbesserungen
- **FR29:** Falki zeigt Bestätigungsdialog bei kritischen Aktionen (An-/Abmeldung)
- **FR30:** User kann Falki via Text oder Spracheingabe nutzen
- **FR31:** Admin kann Falki-Prompts anpassen
- **FR32:** Falki bietet Fallback-UI-Links bei unklaren Anfragen

**Notifications & Communication (FR33-FR37):**
- **FR33:** System sendet Email-Benachrichtigungen (neue Events, Erinnerungen)
- **FR34:** User kann Newsletter-Präferenzen verwalten
- **FR35:** Admin kann Event-Ankündigungen versenden
- **FR36:** System sendet Bestätigungs-Email nach Event-Anmeldung
- **FR37:** User erhält "Willkommen!"-Email nach Onboarding

**Content & Community (FR38-FR45):**
- **FR38:** User kann Event-Fotos hochladen (nach Event)
- **FR39:** User kann Tourberichte schreiben
- **FR40:** System zeigt Event-Galerie mit allen Fotos
- **FR41:** User kann Fotos kommentieren und liken
- **FR42:** System zeigt "Häufige Mitfahrer"-Recommendations (nach 5+ gemeinsamen Events)
- **FR43:** User sieht eigene Event-Historie
- **FR44:** Admin kann Tourberichte moderieren
- **FR45:** User kann Event-Fotos in Social Media teilen

**Fundraising & Donations (FR46-FR51):**
- **FR46:** User kann Spenden tätigen via Stripe oder PayPal
- **FR47:** System bietet Recurring Donations (monatlich/jährlich)
- **FR48:** User erhält steuerlich absetzbare Spendenbescheinigung
- **FR49:** Admin sieht Fundraising-Dashboard mit Spendenzielen
- **FR50:** System sendet Dankes-Email nach Spende
- **FR51:** User kann anonyme Spenden tätigen

**Administration & Analytics (FR52-FR59):**
- **FR52:** Admin sieht Mitglieder-Statistiken (Gesamt, USV, Aktive)
- **FR53:** Admin kann Event-Statistiken exportieren (CSV/PDF)
- **FR54:** System trackt User-Aktivität (Events besucht, Fotos hochgeladen)
- **FR55:** Admin kann User-Rollen verwalten (Member/Admin)
- **FR56:** System loggt alle Admin-Aktionen (Audit Trail)
- **FR57:** Admin kann Event-Teilnehmerlisten herunterladen
- **FR58:** System zeigt Engagement-Metriken (Event-Anmeldungen pro Monat)
- **FR59:** Admin kann Benutzer-Daten exportieren (DSGVO)

**Accessibility & User Experience (FR60-FR67):**
- **FR60:** Alle UI-Elemente sind keyboard-navigierbar
- **FR61:** System ist screen-reader-kompatibel (NVDA, JAWS, VoiceOver)
- **FR62:** User kann Font-Size anpassen
- **FR63:** System bietet High-Contrast-Mode
- **FR64:** Alle Touch-Targets sind mindestens 44x44px
- **FR65:** System funktioniert auf iOS 14+ und Android 8+
- **FR66:** User kann Dark-Mode aktivieren
- **FR67:** System erreicht Lighthouse Accessibility Score >95

**Branding & Multi-Tenant (FR68-FR71):**
- **FR68:** System nutzt URC-Falke-Farben (USV-Blau, Warm-Orange)
- **FR69:** UI ist responsive (320px Mobile bis 1440px Desktop)
- **FR70:** System nutzt Radix UI Component Library
- **FR71:** UI zeigt Franz-Fraißl-Legacy-Hinweis (Über-Seite)

### Non-Functional Requirements

**Performance (NFR-P1 to NFR-P4):**
- **NFR-P1:** Largest Contentful Paint (LCP) < 2.5 Sekunden
- **NFR-P1:** First Input Delay (FID) < 100ms
- **NFR-P1:** Cumulative Layout Shift (CLS) < 0.1
- **NFR-P1:** Time to Interactive (TTI) < 3 Sekunden
- **NFR-P2:** Event-Anmeldung < 10 Sekunden (inkl. Backend-Response)
- **NFR-P2:** Admin Event-Erstellung < 2 Minuten
- **NFR-P2:** Falki-Response-Zeit < 3 Sekunden (Claude Haiku API)
- **NFR-P3:** JavaScript Bundle < 200KB gzipped
- **NFR-P3:** Page Weight < 1MB (inkl. Images)
- **NFR-P3:** CSS Bundle < 50KB gzipped
- **NFR-P4:** App funktioniert auf 3G-Netzen (min. 400kbps)
- **NFR-P4:** Offline-Funktionalität für Event-Anmeldung (PWA Service Worker)

**Security (NFR-S1 to NFR-S4):**
- **NFR-S1:** Daten encrypted at rest (PostgreSQL, NeonDB)
- **NFR-S1:** Daten encrypted in transit (TLS 1.3)
- **NFR-S1:** JWT-Tokens in HttpOnly Cookies (kein LocalStorage)
- **NFR-S1:** Cookies mit SameSite=Strict
- **NFR-S2:** Role-Based Access Control (RBAC) für Member/Admin
- **NFR-S2:** USV-Mitgliedsnummer-Verifizierung via API
- **NFR-S2:** Admin-Aktionen erfordern Re-Authentication
- **NFR-S3:** Input Validation auf Client & Server (Zod 3.24+)
- **NFR-S3:** Rate Limiting auf allen API-Endpoints
- **NFR-S3:** SQL Injection Prevention (Drizzle ORM Prepared Statements)
- **NFR-S3:** XSS Prevention (React Automatic Escaping)
- **NFR-S4:** Content Security Policy (CSP) Headers
- **NFR-S4:** Secure Headers (HSTS, X-Frame-Options, X-Content-Type-Options)

**Accessibility (NFR-A1 to NFR-A6):**
- **NFR-A1:** WCAG 2.1 Level AA Compliance (MANDATORY)
- **NFR-A1:** Color Contrast min. 4.5:1 für Body Text
- **NFR-A1:** Color Contrast min. 3:1 für Large Text (18px+)
- **NFR-A2:** Screen Reader kompatibel (NVDA, JAWS, VoiceOver tested)
- **NFR-A2:** Semantic HTML5 (nav, main, article, section)
- **NFR-A2:** ARIA Labels für alle Interactive Elements
- **NFR-A3:** Full Keyboard Navigation (Tab-Order, Enter/Space Actions)
- **NFR-A3:** Visible Focus Indicators (min. 2px outline)
- **NFR-A3:** Skip Links ("Skip to main content")
- **NFR-A4:** Touch Targets min. 44x44px (WCAG 2.1 AA, iOS HIG)
- **NFR-A4:** Spacing between Touch Targets min. 8px
- **NFR-A5:** Font Size min. 16px (Gerhard's Readability)
- **NFR-A5:** Line Height 1.5 für Body Text
- **NFR-A5:** User kann Font Size anpassen (±2 Stufen)
- **NFR-A6:** Lighthouse Accessibility Score min. 95
- **NFR-A6:** axe-core DevTools zeigt 0 Critical Issues

**Integration & APIs (NFR-I1 to NFR-I5):**
- **NFR-I1:** Anthropic Claude API (Haiku Model) für Falki Chatbot
- **NFR-I1:** Claude Function Calling für Event-Anmeldung via Chat
- **NFR-I1:** Rate Limit 100 req/min (Backend-Side, global)
- **NFR-I2:** Stripe Integration (primary) für Donations
- **NFR-I2:** PayPal Integration (fallback) für Donations
- **NFR-I2:** PCI DSS Compliance (Stripe/PayPal hosted checkout)
- **NFR-I3:** Email Service (Sendgrid oder Mailgun) für Transaktionale Emails
- **NFR-I3:** Email Templates (Willkommen, Event-Bestätigung, Erinnerung)
- **NFR-I4:** iCal Export für Apple/Google/Outlook Calendar
- **NFR-I4:** Deep Linking für QR-Code → Event-Details
- **NFR-I5:** Open Graph Meta Tags für Social Sharing
- **NFR-I5:** PWA Manifest für "Add to Home Screen"

**Reliability & Availability (NFR-R1 to NFR-R5):**
- **NFR-R1:** Uptime Target 99.5% (~3.6h Downtime pro Monat)
- **NFR-R1:** Planned Maintenance max. 2h pro Monat (off-peak)
- **NFR-R2:** Database Backups täglich (automated via NeonDB)
- **NFR-R2:** Point-in-Time Recovery (PITR) 7 Tage
- **NFR-R2:** Backup Retention 30 Tage
- **NFR-R3:** Real User Monitoring (RUM) via Vercel Analytics
- **NFR-R3:** Error Tracking via Sentry (Post-MVP)
- **NFR-R3:** Uptime Monitoring (Pingdom oder UptimeRobot)
- **NFR-R4:** API Response Time P95 < 500ms
- **NFR-R4:** API Response Time P99 < 1000ms
- **NFR-R5:** Graceful Degradation bei API-Failures (Falki → "Nutze Direct-UI")

**Compliance & Legal (NFR-C1 to NFR-C3):**
- **NFR-C1:** DSGVO Compliance (EU GDPR)
- **NFR-C1:** User kann Daten exportieren (JSON/CSV)
- **NFR-C1:** User kann Account löschen (DSGVO Right to be Forgotten)
- **NFR-C1:** Consent Management für Cookies und Tracking
- **NFR-C2:** User-Daten werden nach 24 Monaten Inaktivität archiviert
- **NFR-C2:** Archivierte Daten bleiben 10 Jahre für Spendenbescheinigungen
- **NFR-C3:** Audit Logging für Admin-Aktionen (wer, wann, was)
- **NFR-C3:** Audit Logs werden 3 Jahre aufbewahrt

**Scalability (NFR-SC1 to NFR-SC4):**
- **NFR-SC1:** Initial Launch: 50-80 aktive User
- **NFR-SC1:** 6 Monate: 100+ User
- **NFR-SC1:** 12 Monate: 150-200 User (Target: 450 USV-Mitglieder aktiviert)
- **NFR-SC2:** Concurrent Event-Anmeldungen: 30-50 User (Peak: Samstag-Morgen)
- **NFR-SC3:** Event-Erstellungen: ~100 Events pro Jahr
- **NFR-SC3:** Foto-Uploads: ~1000 Fotos pro Jahr
- **NFR-SC3:** Falki-Chats: ~5000 Messages pro Jahr
- **NFR-SC4:** Horizontal Scaling via Vercel Serverless Functions (auto)
- **NFR-SC4:** Database Scaling via NeonDB Auto-Scaling (vertical)

### Additional Requirements

**From Architecture Document:**

**Starter Template & Monorepo Setup:**
- Initialize Turborepo Monorepo: `npx create-turbo@latest urc-falke-monorepo`
- 4 Workspaces: `apps/web` (Frontend PWA), `apps/api` (Backend Express), `packages/shared` (Drizzle Schema, Types), `packages/ui` (Radix UI Components)
- Package Manager: pnpm 9.x (Workspaces, fast installs)
- Build System: Turborepo with parallel task execution
- TypeScript Project References for type-safe cross-workspace imports

**Infrastructure Requirements:**
- Hosting Platform: Vercel Serverless Functions (auto-scaling)
- Database: PostgreSQL 16 via NeonDB (managed, auto-backups)
- CDN: Vercel Edge Network for static assets
- Environment Variables: Vercel Dashboard (Production/Preview/Development)

**Deployment Requirements:**
- CI/CD Pipeline: GitHub Actions → TypeScript check → ESLint → Tests → Vercel Deploy
- Auto-Deploy: Every commit to `main` branch triggers production deploy
- Preview Deployments: Every PR gets unique preview URL
- Build Command: `pnpm turbo build` (Turborepo pipeline)
- Output Directory: `apps/web/dist` (Vite build output)

**Integration Requirements:**
- Anthropic Claude API: Haiku model, Rate limit 100 req/min (backend-side)
- USV-API: Membership verification, Rate limit 5 req/min per IP
- Event Registration API: Rate limit 10 req/min per user
- Stripe API: Donations (primary), PCI DSS compliant
- PayPal API: Donations (fallback)
- Email Service: Sendgrid or Mailgun for transactional emails

**Monitoring & Logging Requirements:**
- Vercel Analytics: Web Vitals tracking (LCP, FID, CLS, TTI)
- Console Logs: Structured logging for MVP (JSON format)
- Post-MVP: Sentry for error tracking, Plausible for privacy-first analytics
- Real User Monitoring (RUM): Track Time-to-Event-Anmeldung, Completion Rate
- Uptime Monitoring: Pingdom or UptimeRobot (99.5% SLA validation)

**Security Implementation Requirements:**
- Authentication: JWT in HttpOnly cookies via jose 6.1.3
- Password Hashing: bcrypt 5.x with salt rounds 10
- HTTPS Mandatory: TLS 1.3 (Vercel automatic)
- Rate Limiting: express-rate-limit middleware per service
- Input Validation: Zod 3.24+ schemas on client & server
- Audit Logging: All admin actions logged with timestamp, user, action

**API Pattern Requirements:**
- REST-like JSON API: `/api/v1/` prefix for versioning
- Error Format: RFC 7807 Problem Details with `type`, `title`, `status`, `detail`, `instance`, `action` fields
- Success Format: Direct data (no `{ success: true, data: ... }` wrapper)
- Field Naming: camelCase JSON fields (e.g., `userId`, `createdAt`)
- Date Format: ISO 8601 strings in UTC (e.g., `"2025-12-22T10:00:00Z"`)
- Status Codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 409 (Conflict), 500 (Internal Server Error)

**State Management Requirements:**
- Server State: TanStack Query 5.90.12 with Query Keys pattern (`queryKeys.events.detail(123)`)
- Client State: Zustand 5.0.9 with immutable updates (no direct mutations)
- Offline Queue: Zustand persist middleware + IndexedDB
- Optimistic UI: TanStack Query `onMutate` for instant feedback
- Background Sync: Workbox Background Sync for offline event registrations

**Database Requirements:**
- ORM: Drizzle 0.45.1 (type-safe, lightweight)
- Schema: Drizzle Kit for migrations (`drizzle-kit generate`, `drizzle-kit push`)
- Naming: snake_case for tables (`users`, `events`, `event_participants`) and columns (`user_id`, `created_at`)
- Primary Keys: `id` (serial) in every table
- Foreign Keys: `{referenced_table_singular}_id` pattern (e.g., `user_id`, `event_id`)
- Indexes: `idx_{table}_{columns}` pattern (e.g., `idx_users_email`, `idx_events_date`)

**Offline-First PWA Requirements:**
- Service Worker: vite-plugin-pwa 0.17+ with Workbox
- Cache Strategy: Cache-First for static assets, Network-First for API calls
- Offline Queue: IndexedDB for pending event registrations
- Background Sync: Auto-retry when online (Workbox Background Sync API)
- App Manifest: PWA Manifest for "Add to Home Screen"

**Naming Convention Requirements:**
- Database Layer: snake_case (tables: `users`, columns: `user_id`)
- URL Paths: kebab-case (`/api/v1/event-registration`)
- File/Directory Names: kebab-case (`event-card.tsx`, `use-event-registration.ts`)
- TypeScript Code: camelCase (variables: `userId`, functions: `registerForEvent`)
- React Components: PascalCase (components: `EventCard`, `UserProfile`)
- TypeScript Types: PascalCase (types: `Event`, `UserRole`, interfaces: `ApiResponse`)
- JSON API Fields: camelCase (`{ "userId": 123, "createdAt": "..." }`)

**From UX Design Specification:**

**Responsive Design Requirements:**
- Mobile-First Design: Primary viewport 320px - 640px (iPhone SE to iPhone 14)
- Breakpoints: Mobile (320px+), Tablet (641px+), Desktop (1025px+)
- Touch-Optimized: 44x44px minimum touch targets (iOS Human Interface Guidelines)
- Safe Area Insets: iOS Home Indicator support (bottom-sticky navigation)

**Accessibility Implementation Requirements:**
- WCAG 2.1 AA Compliance: MANDATORY for all components and screens
- Screen Reader: ARIA labels for all interactive elements, semantic HTML5
- Keyboard Navigation: Full keyboard access, visible focus indicators (2px blue outline)
- Touch Targets: 44x44px minimum (Gerhard's motorik requirements)
- Font Size: 16px minimum for body text (Gerhard's readability)
- Contrast Ratio: 4.5:1 minimum for body text, 3:1 for large text
- Focus Management: Logical tab order, skip links ("Skip to main content")
- Reduced Motion: Respect `prefers-reduced-motion: reduce` user preference

**Browser/Device Compatibility Requirements:**
- iOS Support: iOS 14+ Safari (Lisa's iPhone 14)
- Android Support: Android 8+ Chrome (Gerhard's Samsung)
- Desktop Support: Chrome, Firefox, Safari, Edge (Mario's Admin Dashboard)
- PWA Support: Service Worker API, Push Notifications API (Phase 2)
- Camera API: QR Code scanning (native browser camera access)

**Interaction Pattern Requirements:**
- Multi-Modal Interaction: QR-Code Scan (80% young users), Falki Chat (80% older users), Direct UI Browse (60% discovery)
- Bottom-Tab-Bar Navigation: 3 tabs (🏠 Events, 💬 Falki, 👤 Profil), 64px height
- Error Prevention: Confirmation dialogs for critical actions (event registration, cancellation)
- Optimistic UI: Instant success feedback, background sync for offline actions
- Progressive Disclosure: Advanced features hidden until user ready (e.g., Admin Dashboard)

**Animation & Micro-Interaction Requirements:**
- Micro-Interactions: 200ms duration (button hover, tab switch)
- Page Transitions: 300ms duration (screen slide-in from right, modal open)
- Konfetti Animation: 1000ms duration (success celebration), 50 particles, 70° spread, opt-out in settings
- Easing: `ease-out` for natural movement (Lisa's smooth UX expectation)
- Reduced Motion: Disable all animations if `prefers-reduced-motion: reduce`

**Error Handling UX Requirements:**
- Clear Error Messages: German language, actionable instructions, no technical jargon
- Recovery Actions: Prominently displayed (e.g., "Auf Warteliste setzen" for full events)
- Confirmation Dialogs: For critical actions (e.g., "Möchtest du dich wirklich anmelden für Samstag, 9:00 Uhr?")
- Undo Actions: Always visible (e.g., "Abmelden" button 1 click away after registration)
- RFC 7807 Format: Problem Details with `action` field for recovery options

**Design System Implementation Requirements:**
- Component Library: Radix UI Primitives (unstyled, accessibility-first)
- Styling Framework: Tailwind CSS 3.x (utility-first, 4px grid system)
- Color Palette: USV-Blau (#1E40AF primary), Warm-Orange (#F97316 secondary), Success Green (#10B981)
- Typography: System font stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- Icon System: Lucide Icons (24x24px standard, 2px stroke width)
- Spacing System: 4px grid (8px, 12px, 16px, 24px, 32px, 48px)

### FR Coverage Map

**Epic 1: User Onboarding & Authentication**
- FR1: QR-Code Instant-Onboarding (<30 Sekunden)
- FR2: USV-Mitgliedsnummer-Eingabe
- FR3: USV-Mitgliedsnummer-Validierung
- FR4: Profilbild hochladen
- FR5: "Gründungsmitglied"-Badge
- FR6: Lostopf-Registrierung (200€ Verlosung)
- FR7: Profil bearbeiten
- FR8: Account löschen (DSGVO)
- FR9: "Du bist bereits Mitglied!"-Bestätigung
- FR10: Passwort zurücksetzen
- FR11: "GRATIS für USV-Mitglieder"-Badge

**Epic 2: Event Discovery & Participation**
- FR13: User meldet sich für Events an (<5 Klicks)
- FR14: User meldet sich von Events ab
- FR15: Event-Teilnehmerliste mit Avatars
- FR16: "Noch X Plätze frei"-Anzeige
- FR17: Event in Kalender exportieren (iCal)
- FR19: Wetter-Warnung 24h vor Event
- FR20: Vergangene Events (Archiv)
- FR21: Event-Schwierigkeit (Leicht/Mittel/Schwer/Rennrad)
- FR22: Event-Erinnerung 48h vor Start

**Epic 3: Event Administration & Analytics**
- FR12: Admin erstellt Events
- FR18: Admin bearbeitet/löscht Events
- FR52: Admin sieht Mitglieder-Statistiken
- FR53: Admin exportiert Event-Statistiken (CSV/PDF)
- FR54: System trackt User-Aktivität
- FR55: Admin verwaltet User-Rollen
- FR56: Admin-Aktionen loggen (Audit Trail)
- FR57: Admin lädt Event-Teilnehmerlisten herunter
- FR58: System zeigt Engagement-Metriken
- FR59: Admin exportiert Benutzer-Daten (DSGVO)

**Epic 4: Falki AI Assistant**
- FR23: Falki Chatbot (natürliche Sprache)
- FR24: Falki beantwortet Event-Fragen
- FR25: Falki meldet User für Events an
- FR26: Falki gibt USV-Mitgliedschafts-Infos
- FR27: Falki nutzt Claude Haiku API
- FR28: System loggt Falki-Interaktionen
- FR29: Falki zeigt Bestätigungsdialog
- FR30: Text oder Spracheingabe
- FR31: Admin kann Falki-Prompts anpassen
- FR32: Falki bietet Fallback-UI-Links

**Epic 5: Community & Content Sharing**
- FR38: Event-Fotos hochladen
- FR39: Tourberichte schreiben
- FR40: Event-Galerie ansehen
- FR41: Fotos kommentieren und liken
- FR42: "Häufige Mitfahrer"-Recommendations
- FR43: Eigene Event-Historie
- FR44: Admin moderiert Tourberichte
- FR45: Event-Fotos in Social Media teilen

**Epic 6: Notifications & Communication**
- FR33: Email-Benachrichtigungen
- FR34: Newsletter-Präferenzen verwalten
- FR35: Admin sendet Event-Ankündigungen
- FR36: Bestätigungs-Email nach Event-Anmeldung
- FR37: "Willkommen!"-Email nach Onboarding

**Epic 7: Donations & Fundraising**
- FR46: Spenden via Stripe/PayPal
- FR47: Recurring Donations
- FR48: Steuerlich absetzbare Spendenbescheinigung
- FR49: Admin sieht Fundraising-Dashboard
- FR50: Dankes-Email nach Spende
- FR51: Anonyme Spenden

**Cross-Cutting (All Epics):**
- FR60-FR67: Accessibility (WCAG 2.1 AA, Screen Reader, Keyboard Navigation, 44x44px Touch Targets)
- FR68-FR71: Branding (URC-Farben, Responsive Design, Radix UI, Franz-Fraißl-Legacy)

**Total Coverage:** 71/71 FRs = **100%** ✅

## Epic List

### Epic 1: User Onboarding & Authentication

**Goal:** Users können sich registrieren, authentifizieren, und ihr Profil verwalten - mit zwei getrennten Onboarding-Tracks für bestehende und neue Mitglieder.

**User Outcome:**
- **Existing Members (Pre-Seeded):** Personalisierter QR-Code → Auto-Login → Passwort setzen → Profil prüfen → FERTIG in <15 Sekunden
- **New Members:** Generischer QR-Code → Registrierung → FERTIG in <30 Sekunden
- USV-Mitgliedsnummer-Verifizierung mit "GRATIS"-Badge
- Profil erstellen und verwalten
- Account löschen (DSGVO-compliant)

**FRs Covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11 (11 FRs)

**Implementation Priority:** Foundation - Must be completed first

**Technical Notes:**
- Turborepo Monorepo Setup (4 workspaces: apps/web, apps/api, packages/shared, packages/ui)
- JWT Authentication (jose 6.1.3) + HttpOnly Cookies
- bcrypt 5.x for password hashing
- Drizzle ORM Schema (`users` table with snake_case columns, including `onboarding_token` fields)
- **Two-Track Onboarding:**
  - Track A (Existing): Token-based auto-login + force password change + minimal profile
  - Track B (New): Standard registration form + full onboarding
- QR-Code Generation & Deep Linking (personalized tokens for existing members)
- Pre-Seed CLI Tool (`pnpm seed:members`) for bulk member import
- USV-API Integration (membership verification with rate limiting)

---

### Epic 2: Event Discovery & Participation

**Goal:** Users können Events entdecken, sich anmelden, und ihre Teilnahme verwalten.

**User Outcome:**
- Event-Anmeldung in <5 Klicks
- Event-Teilnehmerliste sehen (Social Proof)
- Events in Kalender exportieren (iCal)
- Wetter-Warnungen und Erinnerungen erhalten
- Vergangene Events durchsuchen

**FRs Covered:** FR13, FR14, FR15, FR16, FR17, FR19, FR20, FR21, FR22 (9 FRs)

**Dependencies:** Requires Epic 1 (Authentication)

**Technical Notes:**
- TanStack Query 5.90.12 (server state, optimistic UI)
- Zustand 5.0.9 (offline queue for registrations)
- Drizzle Schema (`events`, `event_participants` tables)
- Radix UI Components (Event Cards, Confirmation Dialogs)
- iCal Export functionality
- Weather API Integration
- PWA Offline-First (IndexedDB + Workbox Background Sync)

---

### Epic 3: Event Administration & Analytics

**Goal:** Admins können Events verwalten, Statistiken analysieren, und die Plattform administrieren.

**Admin Outcome:**
- Event-Erstellung in <2 Minuten (10x schneller als WhatsApp/Excel)
- Event-Management (Edit, Delete)
- Mitglieder-Statistiken und Analytics
- User-Rollen verwalten (RBAC)
- DSGVO-konforme Daten-Exporte
- Audit Trail für alle Admin-Aktionen

**FRs Covered:** FR12, FR18, FR52, FR53, FR54, FR55, FR56, FR57, FR58, FR59 (10 FRs)

**Dependencies:** Requires Epic 1 (Authentication + RBAC) and Epic 2 (Event System)

**Technical Notes:**
- Admin Dashboard (React + Tailwind, Desktop-optimized)
- TanStack Router Protected Routes (role-based access)
- Role-Based Access Control (RBAC middleware)
- CSV/PDF Export (papaparse, jsPDF libraries)
- Analytics Tracking (Event-Anmeldungen, User-Aktivität)
- Audit Logging (PostgreSQL `audit_logs` table, 3-year retention)

---

### Epic 4: Falki AI Assistant

**Goal:** Users können mit der Plattform in natürlicher Sprache interagieren.

**User Outcome:**
- Natural Language Interface für alle Platform-Features
- Event-Fragen via Chat stellen
- Event-Anmeldung via Chat ("Melde mich für Samstag an")
- USV-Mitgliedschafts-Infos via Chat erhalten
- Sprach- oder Text-Eingabe nutzen

**FRs Covered:** FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32 (10 FRs)

**Dependencies:** Requires Epic 1 (Authentication), Epic 2 (Events), Epic 3 (Admin Features)

**Technical Notes:**
- Anthropic Claude API (Haiku Model) Integration
- Function Calling für Event-Anmeldung via Chat
- Rate Limiting (100 req/min backend-side, global)
- Chat UI (Radix Dialog + Custom Message Bubbles)
- Prompt Engineering (System Prompts, Few-Shot Examples)
- Confirmation Dialogs für kritische Aktionen
- Fallback-UI-Links bei unklaren Anfragen

---

### Epic 5: Community & Content Sharing

**Goal:** Users können Erfahrungen teilen, Fotos hochladen, und Community-Features nutzen.

**User Outcome:**
- Event-Fotos hochladen nach Tour
- Tourberichte schreiben und teilen
- Event-Galerien durchsuchen
- Fotos kommentieren und liken
- "Häufige Mitfahrer"-Recommendations sehen
- Eigene Event-Historie ansehen
- Fotos in Social Media teilen

**FRs Covered:** FR38, FR39, FR40, FR41, FR42, FR43, FR44, FR45 (8 FRs)

**Dependencies:** Requires Epic 1 (Authentication), Epic 2 (Events)

**Technical Notes:**
- File Upload (Images) via Backend API with validation
- Drizzle Schema (`photos`, `tour_reports`, `comments`, `likes` tables)
- Image Optimization & CDN (Vercel Edge Network)
- Social Proof Algorithms (frequent riders after 5+ shared events)
- Open Graph Meta Tags for social sharing
- Admin Moderation Tools for tour reports

---

### Epic 6: Notifications & Communication

**Goal:** Users bleiben informiert über Events, Neuigkeiten, und Platform-Aktivitäten.

**User Outcome:**
- Email-Benachrichtigungen für neue Events
- Bestätigungs-Emails nach Event-Anmeldung
- Event-Erinnerungen 48h vor Start
- "Willkommen!"-Email nach Onboarding
- Newsletter-Präferenzen verwalten
- Admin kann Event-Ankündigungen versenden

**FRs Covered:** FR33, FR34, FR35, FR36, FR37 (5 FRs)

**Dependencies:** Requires Epic 1 (Authentication), Epic 2 (Events), Epic 3 (Admin Features)

**Technical Notes:**
- Email Service Integration (Sendgrid or Mailgun)
- Transactional Email Templates (Welcome, Event Confirmation, Reminder)
- Marketing Email Templates (Event Announcements, Newsletter)
- Preference Management (opt-in/opt-out, DSGVO-compliant)
- Email Queue (Background Jobs für async sending)

---

### Epic 7: Donations & Fundraising

**Goal:** Users können den Club finanziell unterstützen.

**User Outcome:**
- Spenden via Stripe oder PayPal tätigen
- Recurring Donations einrichten (monatlich/jährlich)
- Steuerlich absetzbare Spendenbescheinigung erhalten
- Dankes-Email nach Spende
- Anonyme Spenden möglich
- Admin sieht Fundraising-Dashboard mit Spendenzielen

**FRs Covered:** FR46, FR47, FR48, FR49, FR50, FR51 (6 FRs)

**Dependencies:** Requires Epic 1 (Authentication)

**Technical Notes:**
- Stripe Integration (primary payment processor, PCI DSS compliant)
- PayPal Integration (fallback payment method)
- Hosted Checkout (Stripe Checkout, PayPal hosted buttons)
- Recurring Donations (Stripe Subscriptions)
- Donation Records (10-year retention for tax purposes)
- Fundraising Analytics Dashboard
- Donation Confirmation Emails

---

## Epic Implementation Summary

**Total Epics:** 7
**Total FRs Covered:** 59 direct FRs + 12 cross-cutting FRs = 71/71 (100%)

**Epic Dependency Flow:**
1. **Epic 1** (Foundation) → Authentication & User Management
2. **Epic 2** (Core) → Event Participation (uses Epic 1)
3. **Epic 3** (Admin) → Event Administration (uses Epic 1 & 2)
4. **Epic 4** (Enhancement) → Falki AI (uses Epic 1, 2, 3)
5. **Epic 5** (Social) → Community Features (uses Epic 1 & 2)
6. **Epic 6** (Communication) → Notifications (uses Epic 1, 2, 3)
7. **Epic 7** (Financial) → Donations (uses Epic 1)

**Cross-Cutting Concerns (Applied to ALL Epics):**
- **Accessibility:** WCAG 2.1 AA compliance, 44x44px touch targets, screen reader support, keyboard navigation (FR60-FR67)
- **Branding:** URC-Falke colors (USV-Blau #1E40AF, Warm-Orange #F97316), Radix UI + Tailwind CSS, responsive design (FR68-FR71)
- **Performance:** LCP <2.5s, Bundle <200KB, offline-capable PWA
- **Security:** JWT in HttpOnly Cookies, TLS 1.3, Rate Limiting, Input Validation
- **Compliance:** DSGVO (data export, deletion, consent management)

---

## Epic 1: User Onboarding & Authentication - Stories

### Story 1.0: Pre-Seed Existing URC Falke Members (Admin Tool)

As an **admin preparing for launch**,
I want to pre-seed existing URC Falke members with onboarding tokens,
So that they can quickly activate their accounts via QR code without full registration.

**Acceptance Criteria:**

**Given** I have a CSV file with existing URC Falke member data
**When** the CSV contains columns: `email`, `first_name`, `last_name`, `usv_number` (optional)
**Then** I can prepare the member import file in this format:
```csv
email,first_name,last_name,usv_number
max@example.com,Max,Mustermann,USV123456
lisa@example.com,Lisa,Schmidt,
```

**Given** the CSV file is prepared
**When** I run the CLI command: `pnpm seed:members --csv ./data/existing-members.csv`
**Then** the CLI tool processes each row and:
1. Generates a unique 16-character alphanumeric `onboarding_token` (e.g., `A7K9P2M4X8Q1W5Z3`)
2. Sets `onboarding_token_expires` to 90 days from now
3. Generates a temporary password hash (random 16-char password)
4. Creates a user record with:
   - `email`, `first_name`, `last_name`, `usv_number` (from CSV)
   - `password_hash` (temporary, will be changed on first login)
   - `onboarding_status: 'pre_seeded'`
   - `must_change_password: true`
   - `is_founding_member: true` (all pre-seeded members are founding members)
5. Inserts record into `users` table

**And** the CLI outputs a CSV file: `./data/member-tokens-output.csv` with columns:
```csv
email,first_name,last_name,onboarding_token,qr_code_url,onboarding_link
max@example.com,Max,Mustermann,A7K9P2M4X8Q1W5Z3,https://api.qrserver.com/v1/create-qr-code/?data=...,https://urc-falke.app/onboard-existing?token=A7K9P2M4X8Q1W5Z3
```

**And** the `qr_code_url` generates a QR code linking to: `https://urc-falke.app/onboard-existing?token={onboarding_token}`
**And** this output CSV can be sent to the print service for Postwurfsendung generation

**Given** a pre-seeded user record exists with `onboarding_status: 'pre_seeded'`
**When** I query the database
**Then** I can verify the user exists with:
- Valid `onboarding_token`
- `must_change_password: true`
- `onboarding_token_expires` in the future
- `is_founding_member: true`

**Given** the member import is complete
**When** I send the Postwurfsendung
**Then** existing members receive:
- **Option 1**: QR code linking to `https://urc-falke.app/onboard-existing?token={token}`
- **Option 2**: Printed key (the token text) with instructions: "Gehe zu urc-falke.app/activate und gib deinen Code ein"

**And** Error handling:
- Duplicate email addresses are skipped with warning logged
- Invalid email format rows are skipped with error logged
- Summary report shows: X successful, Y skipped, Z errors

---

### Story 1.1: Monorepo Foundation & Basic User Schema

As a **developer**,
I want a properly configured Turborepo monorepo with basic user database schema,
So that I have a solid foundation for implementing authentication features.

**Acceptance Criteria:**

**Given** no existing project structure exists
**When** I run `npx create-turbo@latest urc-falke-monorepo` and configure the 4 workspaces
**Then** the following structure is created:
- `apps/web` (Frontend PWA with Vite 5 + React 18 + TypeScript 5)
- `apps/api` (Backend Express API with TypeScript)
- `packages/shared` (Shared types and Drizzle schema)
- `packages/ui` (Radix UI component wrappers)

**And** Turborepo is configured with `turbo.json` defining build pipeline
**And** pnpm workspaces are properly configured in `pnpm-workspace.yaml`
**And** TypeScript project references are set up for cross-workspace imports

**Given** the monorepo structure exists
**When** I create the Drizzle ORM schema for `users` table
**Then** the schema includes the following columns (snake_case):
- `id` (serial primary key)
- `email` (text, unique, not null)
- `password_hash` (text, not null)
- `usv_number` (text, unique, nullable)
- `is_usv_verified` (boolean, default false)
- `profile_image_url` (text, nullable)
- `first_name` (text, nullable)
- `last_name` (text, nullable)
- `role` (text, default 'member') - for RBAC (member/admin)
- `is_founding_member` (boolean, default false)
- `lottery_registered` (boolean, default false)
- `onboarding_token` (text, unique, nullable) - for existing member onboarding
- `onboarding_token_expires` (timestamp, nullable) - token expiry (90 days)
- `onboarding_status` (text, nullable) - 'pre_seeded' | 'password_changed' | 'completed'
- `must_change_password` (boolean, default false) - force password change for pre-seeded users
- `created_at` (timestamp, default now())
- `updated_at` (timestamp, default now())

**And** Drizzle migrations are configured (`drizzle.config.ts`)
**And** NeonDB connection string is configured in environment variables
**And** Initial migration is created and can be applied

**Given** the database schema is created
**When** I run the dev servers
**Then** `pnpm turbo dev` starts both frontend and backend
**And** Frontend runs on `http://localhost:5173` (Vite default)
**And** Backend API runs on `http://localhost:3000`
**And** Both workspaces have hot reload enabled

---

### Story 1.2: User Registration with Email & Password

As a **new user**,
I want to register an account with my email and password,
So that I can access the platform and participate in events.

**Acceptance Criteria:**

**Given** I am on the registration page (`/register`)
**When** I enter a valid email (e.g., `user@example.com`) and a password (min. 8 characters)
**And** I click the "Registrieren" button
**Then** my password is hashed using bcrypt (salt rounds: 10)
**And** a new user record is created in the `users` table
**And** a JWT token is generated using jose 6.1.3
**And** the JWT is stored in an HttpOnly cookie with `SameSite=Strict`
**And** I am redirected to the events page (`/events`)
**And** I see a success message: "Willkommen! Dein Account wurde erstellt."

**Given** I try to register with an email that already exists
**When** I submit the registration form
**Then** I receive an error message: "Diese Email-Adresse ist bereits registriert."
**And** the registration form remains visible
**And** no duplicate user is created

**Given** I try to register with an invalid email format
**When** I submit the registration form
**Then** I receive a validation error: "Bitte gib eine gültige Email-Adresse ein."
**And** the form does not submit

**Given** I try to register with a password shorter than 8 characters
**When** I submit the registration form
**Then** I receive a validation error: "Passwort muss mindestens 8 Zeichen lang sein."
**And** the form does not submit

**And** All form inputs have WCAG 2.1 AA compliant labels and ARIA attributes
**And** Registration button is 44x44px minimum (accessibility requirement)
**And** Form is fully keyboard-navigable with visible focus indicators

---

### Story 1.3: User Login & Session Management

As a **registered user**,
I want to log in with my email and password,
So that I can access my account and registered events.

**Acceptance Criteria:**

**Given** I am on the login page (`/login`)
**When** I enter my registered email and correct password
**And** I click the "Anmelden" button
**Then** my password is verified using bcrypt compare
**And** a JWT token is generated with payload: `{ userId, email, role }`
**And** the JWT is stored in an HttpOnly cookie (name: `auth_token`, SameSite=Strict, Max-Age: 7 days)
**And** I am redirected to the events page (`/events`)
**And** I see a success message: "Willkommen zurück!"

**Given** I try to login with an incorrect password
**When** I submit the login form
**Then** I receive an error message: "Email oder Passwort falsch."
**And** I remain on the login page
**And** no session is created

**Given** I try to login with an email that doesn't exist
**When** I submit the login form
**Then** I receive an error message: "Email oder Passwort falsch." (same message for security)
**And** no session is created

**Given** I am logged in with a valid JWT cookie
**When** I visit any protected page (e.g., `/events`, `/profile`)
**Then** my JWT is validated on the backend (jose verify)
**And** my `userId` and `role` are extracted from the JWT
**And** the page loads successfully

**Given** I am logged in
**When** I click the "Abmelden" button in the user menu
**Then** my `auth_token` cookie is cleared (Max-Age: 0)
**And** I am redirected to the homepage (`/`)
**And** I see a message: "Du wurdest erfolgreich abgemeldet."

**And** Login form has "Passwort anzeigen" toggle (eye icon) for accessibility
**And** Login form is fully keyboard-navigable
**And** "Passwort vergessen?" link is visible and accessible

---

### Story 1.4a: QR-Code Onboarding for Existing Members (Token-Based Auto-Login)

As an **existing URC Falke member who received a QR code in the mail**,
I want to scan my personalized QR code and quickly activate my account,
So that I can start using the app in under 15 seconds.

**Acceptance Criteria:**

**Given** I am a pre-seeded member (via Story 1.0) with a valid `onboarding_token`
**When** I scan my personalized QR code with my smartphone camera
**Then** I am redirected to: `https://urc-falke.app/onboard-existing?token={my_onboarding_token}`
**And** the onboarding page loads in <2 seconds

**Given** I am on the onboarding page via my personalized token
**When** the page loads
**Then** the backend validates my token by checking:
1. Token exists in `users` table (`onboarding_token` field)
2. Token has not expired (`onboarding_token_expires > NOW()`)
3. User has `onboarding_status: 'pre_seeded'`

**And** if token is valid, I am automatically logged in:
- JWT is generated with `{ userId, email, role }`
- JWT is stored in HttpOnly cookie (`auth_token`)
- I am immediately redirected to `/onboard-existing/set-password`

**Given** I am on the `/onboard-existing/set-password` page
**When** the page loads
**Then** I see a personalized welcome screen:
- "Willkommen zurück, {firstName}!" heading
- "Bitte wähle ein neues Passwort für deinen Account."
- New Password input (min. 8 chars, required)
- Confirm Password input (must match)
- "Passwort festlegen"-Button (44x44px, primary color)

**Given** I enter a new password (min. 8 chars) and confirmation matches
**When** I click "Passwort festlegen"
**Then** a `POST /api/v1/users/me/set-password` request is sent with payload: `{ newPassword }`
**And** the backend:
1. Hashes the new password using bcrypt (salt rounds: 10)
2. Updates `password_hash` field
3. Sets `must_change_password: false`
4. Sets `onboarding_status: 'password_changed'`
5. Clears `onboarding_token` and `onboarding_token_expires` (single-use token)

**And** I am redirected to `/profile/complete`
**And** I see a success message: "Passwort erfolgreich festgelegt!"

**Given** I am on `/profile/complete` (minimal profile completion)
**When** the page loads
**Then** I see a simple form with:
- First Name (pre-filled from CSV, editable)
- Last Name (pre-filled from CSV, editable)
- Telefon (optional, empty)
- "Hast du eine USV-Mitgliedsnummer?" checkbox (pre-checked if `usv_number` exists from CSV)
- USV-Nummer input (pre-filled if exists, editable)
- "Profil abschließen"-Button

**Given** I review my pre-filled information and optionally add phone number
**When** I click "Profil abschließen"
**Then** a `PATCH /api/v1/users/me/complete-profile` request is sent
**And** `onboarding_status` is set to `'completed'`
**And** A konfetti animation plays (1000ms, 50 particles)
**And** I am redirected to `/events` (main app)
**And** I see a welcome message: "Geschafft! Du bist jetzt Teil der digitalen Falken-Familie. 🎉"

**And** Total time from QR scan to events page: <15 seconds (faster than 30-second target)

**Given** my `onboarding_token` has expired (`onboarding_token_expires < NOW()`)
**When** I try to use the QR code
**Then** I see an error page:
- "Dein Aktivierungscode ist abgelaufen."
- "Bitte kontaktiere uns unter info@urc-falke.at für einen neuen Code."

**Given** my `onboarding_token` was already used (`onboarding_status != 'pre_seeded'`)
**When** I try to use the QR code again
**Then** I am redirected to the login page (`/login`)
**And** I see a message: "Du hast deinen Account bereits aktiviert. Bitte melde dich mit deinem Passwort an."

---

### Story 1.4b: QR-Code Onboarding for New Members (Registration)

As a **potential new member who received a generic QR code or registration link**,
I want to scan the QR code and complete registration in under 30 seconds,
So that I can join the club without filling out lengthy forms.

**Acceptance Criteria:**

**Given** an admin has generated a generic QR code for new member onboarding
**When** I scan the QR code with my smartphone camera
**Then** I am redirected to: `https://urc-falke.app/register`
**And** the registration page loads in <2 seconds

**Given** I am on the registration page
**When** the page loads
**Then** I see a registration form with:
- "Willkommen in der Falken-Familie!" heading
- Email input (empty, required)
- Password input (min. 8 chars, required)
- Confirm Password input (must match, required)
- "Hast du eine USV-Mitgliedsnummer?" checkbox
- USV-Nummer input (conditional, only visible if checkbox checked)

**And** I see a prominent "GRATIS für USV-Mitglieder"-Badge if checkbox is checked
**And** The form has exactly 3-4 required fields (Email, Password, Confirm Password, USV-Nummer if checked)

**Given** I complete the registration form (without USV number)
**When** I click "Jetzt dabei sein!" button
**Then** a `POST /api/v1/auth/register` request is sent with payload: `{ email, password }`
**And** my account is created:
1. Password is hashed using bcrypt (salt rounds: 10)
2. User record is inserted with `onboarding_status: 'completed'` (no pre-seeding)
3. JWT is generated and stored in HttpOnly cookie
4. If before launch date: `is_founding_member: true`, `lottery_registered: true`

**And** I am automatically logged in
**And** A konfetti animation plays (1000ms duration, 50 particles)
**And** I am redirected to `/events`
**And** I see a success screen: "Geschafft! Du bist jetzt Mitglied."
**And** The total time from QR scan to success screen is <30 seconds (FR1 requirement)

**Given** I complete the registration form with a USV number
**When** I click "Jetzt dabei sein!" button
**Then** my account is created with `usv_number` field populated
**And** `is_usv_verified` is set to `false` (verification happens in Story 1.5)
**And** I see a message: "Deine USV-Mitgliedsnummer wird geprüft..."
**And** I proceed to the events page

**Given** I try to register with an email that already exists
**When** I submit the form
**Then** I receive an error message: "Diese Email-Adresse ist bereits registriert."
**And** I see a link: "Passwort vergessen?" redirecting to `/reset-password`

**And** All form inputs have WCAG 2.1 AA compliant labels
**And** Registration button is 44x44px minimum
**And** Form is fully keyboard-navigable

---

### Story 1.5: USV-Mitgliedsnummer Verification

As a **user with a USV membership number**,
I want my USV membership to be verified automatically,
So that I receive the "GRATIS für USV-Mitglieder" benefit.

**Acceptance Criteria:**

**Given** I registered with a USV number (via onboarding or profile)
**When** the system validates my USV number via USV-API
**Then** an API call is made to `POST /api/v1/usv/verify` with payload: `{ usvNumber }`
**And** the USV-API responds with `{ valid: true, memberSince: "2018-01-15" }` or `{ valid: false }`
**And** the API call is rate-limited to 5 requests per minute per IP address

**Given** the USV-API confirms my number is valid
**When** the verification completes
**Then** my `is_usv_verified` field is set to `true`
**And** I receive an email: "Deine USV-Mitgliedschaft wurde bestätigt! Du bist GRATIS dabei."
**And** I see a "GRATIS"-Badge on my profile page
**And** I see a confirmation message: "Du bist bereits Mitglied! Willkommen zurück." (FR9)

**Given** the USV-API confirms my number is invalid
**When** the verification completes
**Then** my `is_usv_verified` field remains `false`
**And** I receive an error message: "Die eingegebene USV-Mitgliedsnummer konnte nicht verifiziert werden. Bitte prüfe deine Eingabe."
**And** I can update my USV number in profile settings

**Given** the USV-API is unreachable or times out
**When** the verification is attempted
**Then** the system logs the error
**And** I see a message: "Die Überprüfung dauert länger als erwartet. Wir benachrichtigen dich, sobald sie abgeschlossen ist."
**And** the verification is retried up to 3 times with exponential backoff

**Given** I am a verified USV member (`is_usv_verified: true`)
**When** I view any event registration page
**Then** I see a "GRATIS für USV-Mitglieder"-Badge (green badge with checkmark icon)
**And** I do not see any payment/membership fee information
**And** The badge is displayed prominently (FR11 requirement)

---

### Story 1.6: User Profile Management

As a **registered user**,
I want to view and edit my profile information,
So that I can keep my details up-to-date and upload a profile picture.

**Acceptance Criteria:**

**Given** I am logged in
**When** I navigate to `/profile`
**Then** I see my current profile information:
- Email (read-only)
- First Name (editable text input)
- Last Name (editable text input)
- USV-Mitgliedsnummer (editable text input if not verified)
- Profile Picture (image preview or placeholder avatar)
- "Gründungsmitglied"-Badge (visible if `is_founding_member: true`)
- "GRATIS"-Badge (visible if `is_usv_verified: true`)

**And** I see an "Edit Profile" button (44x44px minimum)

**Given** I click "Edit Profile"
**When** the edit mode activates
**Then** all editable fields become input fields
**And** I see a "Save Changes" button
**And** I see a "Cancel" button

**Given** I update my first name to "Max" and last name to "Mustermann"
**When** I click "Save Changes"
**Then** a `PATCH /api/v1/users/me` request is sent with payload: `{ firstName: "Max", lastName: "Mustermann" }`
**And** the `users` table is updated: `first_name = 'Max'`, `last_name = 'Mustermann'`, `updated_at = NOW()`
**And** I see a success message: "Profil erfolgreich aktualisiert."
**And** the edit mode is closed

**Given** I want to upload a profile picture
**When** I click "Profilbild hochladen"
**Then** a file picker opens accepting image formats: JPG, PNG, WebP
**And** the maximum file size is 5MB

**Given** I select a valid image file (e.g., 2MB JPG)
**When** the upload completes
**Then** the image is uploaded to the backend API (`POST /api/v1/users/me/avatar`)
**And** the image is stored in Vercel Blob Storage (or similar)
**And** the image URL is saved to `profile_image_url` field
**And** the image is displayed as my avatar (circular, 64x64px on profile page)

**Given** I try to upload a file larger than 5MB
**When** I select the file
**Then** I receive an error: "Datei zu groß. Maximale Größe: 5MB."
**And** the upload is blocked

**And** Profile page is fully accessible (keyboard navigation, screen reader labels)
**And** All form inputs have proper ARIA labels

---

### Story 1.7: Password Reset Flow

As a **user who forgot their password**,
I want to reset my password via email,
So that I can regain access to my account.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I click "Passwort vergessen?" link
**Then** I am redirected to `/reset-password`
**And** I see an email input field
**And** I see instructions: "Gib deine Email-Adresse ein. Wir senden dir einen Link zum Zurücksetzen deines Passworts."

**Given** I enter my registered email address
**When** I click "Link senden"
**Then** a password reset token is generated (secure random 32-byte string)
**And** the token is stored in the database with expiration time (1 hour from now)
**And** an email is sent to my address with subject: "Passwort zurücksetzen - URC Falke"
**And** the email contains a reset link: `https://urc-falke.app/reset-password/{token}`
**And** I see a confirmation message: "Wenn diese Email-Adresse registriert ist, erhältst du einen Link zum Zurücksetzen deines Passworts."

**Given** I click the reset link in the email
**When** the reset page loads (`/reset-password/{token}`)
**Then** the token is validated (not expired, not already used)
**And** I see a form with:
- "Neues Passwort" input (min. 8 characters)
- "Passwort bestätigen" input (must match)
- "Passwort ändern" button

**Given** I enter a new password (min. 8 chars) and confirmation matches
**When** I click "Passwort ändern"
**Then** my password is hashed using bcrypt (salt rounds: 10)
**And** the `password_hash` field in `users` table is updated
**And** the reset token is marked as used (or deleted)
**And** I am redirected to the login page
**And** I see a success message: "Dein Passwort wurde erfolgreich geändert. Bitte melde dich mit deinem neuen Passwort an."

**Given** the reset token is expired (>1 hour old)
**When** I try to use the reset link
**Then** I see an error: "Dieser Link ist abgelaufen. Bitte fordere einen neuen Link an."
**And** I am redirected to `/reset-password` (email input form)

**Given** the reset token is invalid or already used
**When** I try to use the reset link
**Then** I see an error: "Ungültiger Link. Bitte fordere einen neuen Link an."

---

### Story 1.8: Account Deletion (DSGVO)

As a **registered user**,
I want to delete my account and all associated data,
So that I comply with my DSGVO right to be forgotten.

**Acceptance Criteria:**

**Given** I am logged in and on my profile page
**When** I scroll to the bottom of the page
**Then** I see a "Danger Zone" section (red border)
**And** I see a button: "Account löschen" (red background, white text, 44x44px min)

**Given** I click "Account löschen"
**When** the confirmation dialog opens
**Then** I see a warning message:
- "Möchtest du deinen Account wirklich löschen?"
- "Diese Aktion kann nicht rückgängig gemacht werden."
- "Alle deine Daten (Profil, Event-Anmeldungen, Fotos, Kommentare) werden dauerhaft gelöscht."
**And** I see two buttons:
- "Abbrechen" (gray, secondary)
- "Ja, Account löschen" (red, primary)

**Given** I click "Ja, Account löschen" in the confirmation dialog
**When** the deletion process starts
**Then** a `DELETE /api/v1/users/me` request is sent
**And** the backend performs the following actions:
1. Delete all event registrations (`event_participants` where `user_id = {myId}`)
2. Delete all uploaded photos (`photos` where `user_id = {myId}`)
3. Delete all tour reports (`tour_reports` where `user_id = {myId}`)
4. Delete all comments (`comments` where `user_id = {myId}`)
5. Delete the user record (`users` where `id = {myId}`)
6. Delete profile image from Vercel Blob Storage (if exists)

**And** the `auth_token` cookie is cleared (logout)
**And** I am redirected to the homepage (`/`)
**And** I see a final message: "Dein Account wurde erfolgreich gelöscht. Wir hoffen, dich bald wieder zu sehen!"

**Given** I click "Abbrechen" in the confirmation dialog
**When** the dialog closes
**Then** no deletion occurs
**And** I remain on my profile page

**And** Admin actions (event creation, analytics logs) are NOT deleted (anonymized instead)
**And** Audit logs retain anonymized reference: `user_id = NULL, deleted_user_email = {hash}`
**And** Donation records are retained for 10 years (DSGVO exception for tax purposes, anonymized)

---

### Story 1.9: "Gründungsmitglied" Badge & Lostopf

As a **new user who registers before the official launch**,
I want to receive a "Gründungsmitglied" badge and be automatically entered into the 200€ lottery,
So that I am recognized as an early supporter.

**Acceptance Criteria:**

**Given** the platform launch date is defined as `LAUNCH_DATE = 2025-03-01` (environment variable)
**When** I register my account (via Story 1.2 or Story 1.4)
**Then** the system checks if `current_date < LAUNCH_DATE`
**And** if true, my `is_founding_member` field is set to `true`
**And** my `lottery_registered` field is set to `true`

**Given** I am a founding member (`is_founding_member: true`)
**When** I view my profile page
**Then** I see a gold "Gründungsmitglied"-Badge with a star icon
**And** the badge is displayed prominently at the top of my profile
**And** the badge has a tooltip: "Du gehörst zu den ersten Mitgliedern! Danke für deine Unterstützung."

**Given** I am a founding member
**When** I view any event details page
**Then** my avatar in the participant list has a small gold star indicator
**And** other users can see that I am a founding member

**Given** I am registered in the lottery (`lottery_registered: true`)
**When** I view my profile page
**Then** I see a notification: "Du nimmst automatisch an der 200€ Verlosung teil! Die Ziehung findet am {LAUNCH_DATE} statt."
**And** I see my lottery entry number (e.g., "Deine Los-Nummer: #042")

**Given** the launch date has passed (`current_date >= LAUNCH_DATE`)
**When** new users register
**Then** `is_founding_member` is set to `false`
**And** `lottery_registered` is set to `false`
**And** they do NOT receive the founding member badge

**Given** an admin wants to draw the lottery winner
**When** they navigate to `/admin/lottery`
**Then** they see a list of all users where `lottery_registered: true`
**And** they can click "Gewinner ziehen" to randomly select 1 winner
**And** the winner is displayed with their name and email
**And** an email is sent to the winner: "Herzlichen Glückwunsch! Du hast die 200€ Verlosung gewonnen!"

---

## Epic 2: Event Discovery & Participation - Stories

### Story 2.1: Event Database Schema & Basic Event Listing

As a **developer**,
I want to create the event database schema and a basic event listing API,
So that users can view upcoming cycling events.

**Acceptance Criteria:**

**Given** the monorepo and user schema exist (from Story 1.1)
**When** I create the Drizzle ORM schema for `events` table
**Then** the schema includes the following columns (snake_case):
- `id` (serial primary key)
- `title` (text, not null)
- `description` (text, nullable)
- `date` (timestamp, not null) - event start date/time
- `meeting_point` (text, not null) - e.g., "USV Clubhaus, Kautzen"
- `difficulty` (text, not null) - enum: 'leicht', 'mittel', 'schwer', 'rennrad'
- `max_participants` (integer, nullable) - null = unlimited
- `current_participants` (integer, default 0)
- `created_by_user_id` (integer, foreign key to `users.id`, not null)
- `weather_warning_sent` (boolean, default false)
- `reminder_sent` (boolean, default false)
- `is_archived` (boolean, default false)
- `created_at` (timestamp, default now())
- `updated_at` (timestamp, default now())

**And** I create the Drizzle schema for `event_participants` table:
- `id` (serial primary key)
- `event_id` (integer, foreign key to `events.id`, not null)
- `user_id` (integer, foreign key to `users.id`, not null)
- `registered_at` (timestamp, default now())
- `unique constraint on (event_id, user_id)` - prevent duplicate registrations

**And** Drizzle migrations are created and applied

**Given** the database schema exists
**When** I implement `GET /api/v1/events` endpoint
**Then** the endpoint returns all upcoming events (where `date >= NOW() AND is_archived = false`)
**And** events are sorted by date ascending (earliest first)
**And** the response includes for each event:
```json
{
  "id": 123,
  "title": "Sonntagsausfahrt nach Linz",
  "description": "Gemütliche Tour...",
  "date": "2025-01-15T09:00:00Z",
  "meetingPoint": "USV Clubhaus",
  "difficulty": "mittel",
  "maxParticipants": 50,
  "currentParticipants": 23,
  "spotsLeft": 27,
  "createdBy": { "userId": 1, "name": "Mario" }
}
```

**Given** the API endpoint exists
**When** I implement the Frontend Event List page (`/events`)
**Then** I see a list of upcoming events displayed as cards
**And** each card shows:
- Event title
- Date (formatted: "Samstag, 15. Januar 2025, 09:00 Uhr")
- Difficulty badge (colored: Leicht=green, Mittel=yellow, Schwer=orange, Rennrad=red)
- "Noch X Plätze frei" (if `maxParticipants` is set)
- Participant avatars (first 5, stacked)

**And** The page uses TanStack Query for data fetching
**And** The page shows a loading skeleton while fetching
**And** The page is accessible (WCAG 2.1 AA, keyboard navigation)

---

### Story 2.2: Event Details View

As a **user**,
I want to view detailed information about an event,
So that I can decide if I want to participate.

**Acceptance Criteria:**

**Given** the event listing exists (Story 2.1)
**When** I implement `GET /api/v1/events/{id}` endpoint
**Then** the endpoint returns complete event details including:
```json
{
  "id": 123,
  "title": "Sonntagsausfahrt nach Linz",
  "description": "Gemütliche Tour entlang der Donau...",
  "date": "2025-01-15T09:00:00Z",
  "meetingPoint": "USV Clubhaus, Kautzen",
  "difficulty": "mittel",
  "maxParticipants": 50,
  "currentParticipants": 23,
  "spotsLeft": 27,
  "isRegistrationOpen": true,
  "isUserRegistered": false,
  "createdBy": {
    "userId": 1,
    "firstName": "Mario",
    "lastName": "Müller",
    "profileImageUrl": "..."
  },
  "participants": [
    { "userId": 2, "firstName": "Lisa", "profileImageUrl": "..." },
    // ... first 10 participants
  ],
  "createdAt": "2024-12-01T10:00:00Z"
}
```

**And** the `isUserRegistered` field is `true` if the authenticated user has registered for this event
**And** `isRegistrationOpen` is `false` if `currentParticipants >= maxParticipants` or `date < NOW()`

**Given** the API endpoint exists
**When** I click on an event card in the event list
**Then** I am navigated to `/events/{id}` (event details page)
**And** I see the event details page with:
- Hero section: Event title, date, difficulty badge
- Description section (markdown formatted)
- Meeting point with map icon
- "DABEI!"-Button (44x44px min, prominent, blue primary color) if not registered
- "Abmelden"-Button (gray secondary) if already registered
- Participant section showing avatars + names
- "Noch X Plätze frei" indicator (if applicable)
- "In Kalender speichern"-Button

**Given** the event is full (`currentParticipants >= maxParticipants`)
**When** I view the event details page
**Then** I see "Event ist voll" message instead of "DABEI!"-Button
**And** I see "Auf Warteliste setzen"-Button (disabled/coming in future epic)

**Given** the event is in the past (`date < NOW()`)
**When** I view the event details page
**Then** I see "Event ist beendet" message
**And** registration buttons are not visible

**And** The difficulty badge shows appropriate color and icon:
- Leicht: Green background, "🚴 Leicht" label
- Mittel: Yellow background, "🚴‍♂️ Mittel" label
- Schwer: Orange background, "🚵 Schwer" label
- Rennrad: Red background, "🚴‍♀️ Rennrad" label

---

### Story 2.3: Event Registration (<5 Klicks)

As a **logged-in user**,
I want to register for an event in less than 5 clicks,
So that I can quickly join cycling tours.

**Acceptance Criteria:**

**Given** I am logged in and viewing an event details page
**When** I click the "DABEI!"-Button (Click 1)
**Then** a confirmation dialog opens (Radix Dialog component)
**And** the dialog shows:
- Event title and date
- "Möchtest du bei dieser Tour dabei sein?"
- Meeting point reminder
- "Ja, dabei sein!" button (green, primary) (Click 2)
- "Abbrechen" button (gray, secondary)

**Given** I click "Ja, dabei sein!" in the confirmation dialog
**When** the registration is submitted
**Then** a `POST /api/v1/events/{id}/register` request is sent
**And** the backend creates a record in `event_participants` table:
```sql
INSERT INTO event_participants (event_id, user_id, registered_at)
VALUES ({eventId}, {userId}, NOW())
```

**And** the `events.current_participants` counter is incremented:
```sql
UPDATE events SET current_participants = current_participants + 1 WHERE id = {eventId}
```

**And** TanStack Query uses optimistic UI (updates cache immediately)
**And** I see the success state before the API responds (instant feedback)

**Given** the API responds successfully
**When** the registration completes
**Then** the dialog closes
**And** a konfetti animation plays (1000ms, 50 particles, green/blue colors)
**And** I see a success toast notification: "Geschafft! Du bist dabei. 🎉"
**And** the "DABEI!"-Button changes to "Abmelden"-Button
**And** my avatar appears in the participant list

**Given** the API responds with an error (e.g., event is full)
**When** the registration fails
**Then** I see an RFC 7807 error dialog:
```json
{
  "type": "event-full",
  "title": "Event ist voll",
  "status": 409,
  "detail": "Die maximale Teilnehmeranzahl (50) wurde erreicht.",
  "action": {
    "label": "Auf Warteliste setzen",
    "href": "/api/v1/events/{id}/waitlist"
  }
}
```
**And** the optimistic update is rolled back (cache reverted)
**And** I see the error message with recovery action button

**Given** I am offline (no internet connection)
**When** I register for an event
**Then** the registration is queued in Zustand offline queue (IndexedDB)
**And** I see a success message: "Anmeldung wird synchronisiert, sobald du online bist."
**And** when I go online, the Service Worker Background Sync retries the request

**And** Total clicks from event list to success: ≤5 clicks (FR13 requirement):
1. Click event card → Event details page
2. Click "DABEI!" button → Confirmation dialog
3. Click "Ja, dabei sein!" → Registration complete

**And** All buttons are 44x44px minimum (accessibility)
**And** Confirmation dialog is keyboard-accessible (Escape to cancel, Enter to confirm)

---

### Story 2.4: Event Cancellation / Unregister

As a **registered user**,
I want to unregister from an event,
So that I can cancel my participation if my plans change.

**Acceptance Criteria:**

**Given** I am registered for an event (Story 2.3 completed)
**When** I view the event details page
**Then** I see an "Abmelden"-Button (gray, secondary, 44x44px min)

**Given** I click the "Abmelden"-Button
**When** the confirmation dialog opens
**Then** I see:
- Event title and date
- "Möchtest du dich wirklich abmelden?"
- "Ja, abmelden" button (red, caution color)
- "Abbrechen" button (gray)

**Given** I click "Ja, abmelden" in the confirmation dialog
**When** the cancellation is submitted
**Then** a `DELETE /api/v1/events/{id}/register` request is sent
**And** the backend deletes the record from `event_participants`:
```sql
DELETE FROM event_participants WHERE event_id = {eventId} AND user_id = {userId}
```

**And** the `events.current_participants` counter is decremented:
```sql
UPDATE events SET current_participants = current_participants - 1 WHERE id = {eventId}
```

**And** TanStack Query uses optimistic UI (updates cache immediately)

**Given** the API responds successfully
**When** the cancellation completes
**Then** the dialog closes
**And** I see a toast notification: "Du wurdest abgemeldet."
**And** the "Abmelden"-Button changes back to "DABEI!"-Button
**And** my avatar is removed from the participant list
**And** "Noch X Plätze frei" updates to show +1 available spot

**Given** the event is less than 24 hours away
**When** I try to unregister
**Then** I see a warning in the confirmation dialog:
- "Das Event startet in weniger als 24 Stunden."
- "Bitte informiere den Admin, wenn du nicht teilnehmen kannst."
**And** I can still proceed with cancellation

**And** Cancellation is possible up until the event start time
**And** After the event has started, the "Abmelden"-Button is hidden

---

### Story 2.5: Event Participant List (Social Proof)

As a **user viewing an event**,
I want to see who else is participating,
So that I can see familiar faces and feel part of the community.

**Acceptance Criteria:**

**Given** I am viewing an event details page
**When** the event has registered participants
**Then** I see a "Teilnehmer" section showing:
- Participant count: "23 Teilnehmer"
- Avatar list (circular, 32x32px, stacked with -8px overlap)
- First 10 participants visible
- "+13 weitere" indicator if more than 10 participants

**And** each avatar shows:
- Profile image (or placeholder with initials)
- Tooltip on hover with full name: "Max Mustermann"
- Gold star icon overlay if user is founding member (`is_founding_member: true`)

**Given** I click "Alle Teilnehmer anzeigen" link
**When** the expanded list opens (Radix Dialog)
**Then** I see all registered participants in a scrollable list with:
- Avatar (48x48px)
- Full name
- "Gründungsmitglied" badge (if applicable)
- "Häufiger Mitfahrer" indicator (if I've ridden with them 5+ times)

**Given** the event has a maximum participant limit (`maxParticipants` is set)
**When** I view the event details
**Then** I see a "Noch X Plätze frei" indicator:
- `spotsLeft = maxParticipants - currentParticipants`
- Green background if `spotsLeft > 10`
- Yellow background if `spotsLeft <= 10 AND spotsLeft > 0`
- Red background with "Event ist voll" if `spotsLeft = 0`

**Given** the event is nearly full (e.g., "Noch 3 Plätze frei")
**When** I view the event
**Then** the "Noch X Plätze frei" indicator pulses gently (CSS animation)
**And** the indicator is prominently displayed near the "DABEI!"-Button

**And** The participant list respects DSGVO privacy:
- Only registered users can see the participant list
- Users can opt-out of appearing in lists (future story: Privacy Settings)

**And** Participant list is accessible:
- Screen reader announces: "23 Teilnehmer registriert"
- Keyboard navigation through participant list

---

### Story 2.6: Calendar Export (iCal)

As a **user registered for an event**,
I want to export the event to my calendar,
So that I don't forget the tour and can sync with my other appointments.

**Acceptance Criteria:**

**Given** I am viewing an event details page
**When** the page loads
**Then** I see an "In Kalender speichern"-Button (44x44px min, calendar icon)
**And** the button is visible for both registered and non-registered users

**Given** I click "In Kalender speichern"
**When** the API endpoint `GET /api/v1/events/{id}/ical` is called
**Then** the backend generates an .ics file (iCalendar format) with:
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//URC Falke//Cycling Events//DE
BEGIN:VEVENT
UID:event-{eventId}@urc-falke.app
DTSTAMP:20250101T120000Z
DTSTART:20250115T090000Z
DTEND:20250115T130000Z
SUMMARY:Sonntagsausfahrt nach Linz
DESCRIPTION:Gemütliche Tour entlang der Donau...
LOCATION:USV Clubhaus, Kautzen
URL:https://urc-falke.app/events/{eventId}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR
```

**And** the response has headers:
- `Content-Type: text/calendar; charset=utf-8`
- `Content-Disposition: attachment; filename="event-{eventId}.ics"`

**Given** the .ics file is downloaded
**When** I open the file
**Then** my default calendar app (Apple Calendar, Google Calendar, Outlook) opens
**And** the event is added to my calendar with:
- Title: Event title
- Start time: Event date/time
- End time: Estimated end (start + 4 hours as default)
- Location: Meeting point
- Description: Event description + link to event page

**Given** I am using iOS Safari
**When** I click "In Kalender speichern"
**Then** the file downloads and iOS prompts: "Add to Calendar?"
**And** I can add it with one tap

**Given** I am using Google Calendar on Android
**When** I click "In Kalender speichern"
**Then** Google Calendar app opens with pre-filled event details
**And** I can save it with one tap

**And** The iCal export works for past events (for archival purposes)
**And** If I am registered for the event, the .ics file includes a reminder:
- `VALARM` component with `-PT2H` (2 hours before event)

---

### Story 2.7: Past Events Archive

As a **user**,
I want to view past events,
So that I can reminisce about previous tours and see my participation history.

**Acceptance Criteria:**

**Given** I am on the events page (`/events`)
**When** the page loads
**Then** I see two tabs:
- "Kommende Touren" (default, active)
- "Vergangene Touren"

**And** the tabs are implemented using Radix UI Tabs component
**And** the tabs are keyboard-accessible (Arrow keys to switch)

**Given** I click the "Vergangene Touren" tab
**When** the tab activates
**Then** the API endpoint `GET /api/v1/events?filter=past` is called
**And** the endpoint returns events where `date < NOW()` OR `is_archived = true`
**And** events are sorted by date descending (most recent first)

**Given** the past events load
**When** I view the archive list
**Then** I see event cards similar to upcoming events, but with:
- Grayed-out appearance (opacity: 0.8)
- Date in past tense: "War am Samstag, 15. Januar 2025"
- No registration buttons
- "Event beendet" badge
- Participant count: "23 Teilnehmer"

**Given** I click on a past event card
**When** the event details page opens
**Then** I see all event information (read-only)
**And** I see the participant list (who attended)
**And** if I attended, I see a green "Du warst dabei ✓" indicator
**And** I see a "Tour-Bericht ansehen" button (links to tour report, if exists - Epic 5)

**Given** I want to view only events I attended
**When** I check the "Nur meine Touren" filter checkbox
**Then** the list filters to show only events where I was registered

**And** Past events remain searchable (search by title, description)
**And** The archive loads with pagination (20 events per page) if many past events exist

---

### Story 2.8: Weather Warnings

As a **user registered for an event**,
I want to receive a weather warning if rain is forecasted,
So that I can prepare appropriate gear or decide to skip the tour.

**Acceptance Criteria:**

**Given** a weather API integration exists (e.g., OpenWeatherMap)
**When** I configure the backend with API credentials
**Then** the system has access to `WEATHER_API_KEY` environment variable
**And** the weather check function can call `GET https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={key}`

**Given** an event is scheduled for tomorrow (24 hours away)
**When** a background job (cron) runs every hour
**Then** the job checks all events where:
- `date BETWEEN NOW() AND NOW() + INTERVAL '24 hours'`
- `weather_warning_sent = false`

**And** for each matching event, the job:
1. Fetches weather forecast for the event location (meeting point coordinates)
2. Checks if rain probability > 80% OR heavy rain (> 10mm/hour)
3. If true, sends weather warning emails to all participants

**Given** rain probability is > 80%
**When** the weather warning is triggered
**Then** all registered participants receive an email with:
- Subject: "⛈️ Wetter-Warnung: {Event Title}"
- Body:
  ```
  Hallo {firstName},

  Für die Tour "{eventTitle}" am {date} ist Regen vorhergesagt (Regenwahrscheinlichkeit: 85%).

  Bitte bring entsprechende Regenkleidung mit oder melde dich ab, wenn du nicht teilnehmen möchtest.

  Aktuelle Vorhersage:
  - Temperatur: 12°C
  - Niederschlag: 15mm/h
  - Wind: 20 km/h

  Event-Details: https://urc-falke.app/events/{eventId}

  Viel Spaß bei der Tour!
  URC Falke Team
  ```

**And** the `events.weather_warning_sent` field is set to `true` (prevents duplicate emails)

**Given** the weather improves (rain probability drops below 50%)
**When** the next weather check runs
**Then** a "Entwarnung" email is sent:
- Subject: "☀️ Wetterbesserung: {Event Title}"
- Body: "Gute Nachrichten! Das Wetter hat sich gebessert..."

**And** The email includes an "Abmelden"-Link for quick cancellation

**Given** the weather API is unavailable or returns an error
**When** the weather check fails
**Then** the system logs the error (console + error tracking)
**And** no email is sent (fail silently, don't spam users)
**And** the check is retried in the next cron run (1 hour later)

**And** Weather warnings are only sent for events happening within the next 24 hours (FR19 requirement)
**And** Admins can view weather warning logs in the admin dashboard

---

### Story 2.9: Event Reminders

As a **user registered for an event**,
I want to receive a reminder 48 hours before the event,
So that I don't forget about the tour.

**Acceptance Criteria:**

**Given** an event is scheduled for the day after tomorrow (48 hours away)
**When** a background job (cron) runs every 6 hours
**Then** the job checks all events where:
- `date BETWEEN NOW() + INTERVAL '46 hours' AND NOW() + INTERVAL '50 hours'`
- `reminder_sent = false` (column added to `events` table in Story 2.1)

**And** for each matching event, the job sends reminder emails to all registered participants

**Given** I am registered for an event in 48 hours
**When** the reminder is triggered
**Then** I receive an email with:
- Subject: "🚴 Erinnerung: {Event Title} morgen um {time}"
- Body:
  ```
  Hallo {firstName},

  Nur noch 2 Tage bis zur Tour "{eventTitle}"!

  📅 Datum: {weekday}, {date} um {time} Uhr
  📍 Treffpunkt: {meetingPoint}
  🚴 Schwierigkeit: {difficulty}
  👥 Teilnehmer: {currentParticipants} von {maxParticipants}

  Bereite dein Rad vor und pack alles Nötige ein. Wir freuen uns auf dich!

  [In Kalender speichern] [Event-Details ansehen] [Abmelden]

  Bis bald!
  URC Falke Team
  ```

**And** the email includes action buttons:
- "In Kalender speichern" → Downloads .ics file
- "Event-Details ansehen" → Links to event page
- "Abmelden" → Direct cancellation link with token

**And** the `events.reminder_sent` field is set to `true` (prevents duplicate emails)

**Given** I registered for an event less than 48 hours before it starts
**When** the reminder check runs
**Then** I do NOT receive a reminder (only sent if registered >48h before)

**Given** I unregister from an event after the reminder was sent
**When** I check my email
**Then** I do not receive any further emails about this event

**Given** the email service (Sendgrid/Mailgun) is unavailable
**When** the reminder job runs
**Then** the system logs the error
**And** the reminder job retries failed emails in the next run (6 hours later)
**And** `reminder_sent` remains `false` until successful delivery

**And** Reminders are sent exactly 48 hours before event start (FR22 requirement)
**And** Admins can view reminder logs in the admin dashboard (sent count, failed count)
**And** Users can opt-out of reminders in profile settings (future story: Notification Preferences)

---

## Epic 3: Event Administration & Analytics - Stories

### Story 3.1: Admin Role Setup & Admin Dashboard Foundation

As a **developer**,
I want to set up role-based access control (RBAC) and an admin dashboard foundation,
So that administrators can access protected admin features.

**Acceptance Criteria:**

**Given** the `users` table already has a `role` column (created in Epic 1, Story 1.1)
**When** I implement RBAC middleware in the backend
**Then** the middleware checks the JWT token payload for `user.role`
**And** requests to `/api/v1/admin/*` routes require `role === 'admin'`
**And** non-admin requests receive `403 Forbidden` with RFC 7807 Problem Details:
```json
{
  "type": "about:blank",
  "title": "Forbidden",
  "status": 403,
  "detail": "Du benötigst Admin-Rechte für diese Aktion.",
  "action": "contact_admin"
}
```

**Given** RBAC middleware exists
**When** I create protected frontend routes using TanStack Router
**Then** the route `/admin` requires `user.role === 'admin'` (client-side guard)
**And** non-admin users are redirected to `/events` with error toast
**And** the Admin Dashboard route is NOT shown in the bottom tab bar (only accessible via direct navigation or Falki)

**Given** protected routes are configured
**When** I create the Admin Dashboard layout component
**Then** the layout includes:
- Desktop-optimized design (min-width: 1024px recommended)
- Top Navigation Bar with:
  - "URC Falke Admin Dashboard" title
  - User profile dropdown (logout option)
- Left Sidebar Navigation with links:
  - 📊 Dashboard (Overview)
  - 📅 Events verwalten
  - 👥 Mitglieder
  - 📈 Analytics
  - 🔧 Einstellungen
- Main Content Area (responsive grid layout)

**Given** the dashboard layout exists
**When** an admin user navigates to `/admin`
**Then** they see a welcome screen: "Willkommen im Admin-Bereich, {firstName}!"
**And** the screen displays quick stats cards:
- Total Members
- Events This Month
- Active Users (last 7 days)
- Pending Registrations

**And** clicking any quick stat card navigates to the detailed view

---

### Story 3.2: Admin Creates Events

As an **admin**,
I want to create new cycling events quickly,
So that I can announce tours to members in less than 2 minutes.

**Acceptance Criteria:**

**Given** I am logged in as admin and on the `/admin/events` page
**When** I click the "Neues Event erstellen" button (green, prominent)
**Then** a full-screen modal opens (Radix Dialog) with the "Event erstellen" form
**And** the form has the following fields:
- **Titel** (text input, required, max 100 chars, placeholder: "Feierabendtour ins Umland")
- **Beschreibung** (textarea, optional, max 2000 chars, markdown support)
- **Datum & Uhrzeit** (datetime-local input, required, default: tomorrow 9:00 AM)
- **Treffpunkt** (text input, required, max 200 chars, placeholder: "Parkplatz Stadion, Eingang Süd")
- **Schwierigkeitsgrad** (select dropdown: Leicht, Mittel, Schwer, Rennrad, default: Mittel)
- **Max. Teilnehmer** (number input, required, min: 2, max: 50, default: 20)
- **Strecke (km)** (number input, optional, min: 5, max: 300)
- **GPX-Track** (file upload, optional, .gpx only, max 5MB)

**Given** I fill out all required fields correctly
**When** I click "Event erstellen" (submit button)
**Then** a `POST /api/v1/admin/events` request is sent with JSON body (camelCase):
```json
{
  "title": "Feierabendtour ins Umland",
  "description": "Entspannte Runde...",
  "eventDate": "2025-12-28T09:00:00Z",
  "meetingPoint": "Parkplatz Stadion, Eingang Süd",
  "difficulty": "mittel",
  "maxParticipants": 20,
  "distanceKm": 35,
  "gpxTrackUrl": null
}
```

**And** the backend creates a record in the `events` table:
```sql
INSERT INTO events (
  title, description, event_date, meeting_point, difficulty,
  max_participants, current_participants, distance_km, gpx_track_url,
  created_by_admin_id, created_at
) VALUES (...)
```

**And** the `created_by_admin_id` column references the admin's `user.id`
**And** the backend logs the action in `audit_logs`:
```sql
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, created_at)
VALUES ({adminId}, 'CREATE', 'event', {newEventId}, '{"title": "..."}', NOW())
```

**Given** the event is created successfully
**When** the API responds with `201 Created`
**Then** the modal closes
**And** a konfetti animation plays (1000ms, 50 particles)
**And** a success toast appears: "Event erstellt! 🎉"
**And** the events list refreshes (TanStack Query refetch)
**And** the new event appears at the top of the list

**Given** the form has validation errors (e.g., missing title, past date)
**When** I try to submit
**Then** the form shows inline error messages (red text below field)
**And** the first error field is focused
**And** the submit button remains enabled (allow retry)

**Given** the GPX file upload fails (file too large, wrong format)
**When** I upload an invalid file
**Then** an error message appears below the upload field: "Ungültige Datei. Nur .gpx-Dateien bis 5MB erlaubt."
**And** the upload is rejected
**And** I can retry with a different file

---

### Story 3.3: Admin Edits & Deletes Events

As an **admin**,
I want to edit or delete existing events,
So that I can correct mistakes or cancel tours.

**Acceptance Criteria:**

**Given** I am on the `/admin/events` page viewing the events list
**When** I hover over an event card
**Then** I see two action buttons:
- ✏️ "Bearbeiten" (blue button)
- 🗑️ "Löschen" (red button)

**Given** I click "Bearbeiten" on an event
**When** the edit modal opens
**Then** the modal is pre-filled with the current event data
**And** all fields are editable (same fields as Story 3.2)
**And** the modal title is "Event bearbeiten"

**Given** I modify the event fields
**When** I click "Änderungen speichern"
**Then** a `PATCH /api/v1/admin/events/{id}` request is sent with the updated fields
**And** the backend updates the `events` table:
```sql
UPDATE events
SET title = ?, description = ?, event_date = ?, ..., updated_at = NOW()
WHERE id = ?
```

**And** the backend logs the action in `audit_logs`:
```sql
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, created_at)
VALUES ({adminId}, 'UPDATE', 'event', {eventId}, '{"changes": {"title": "old->new"}}', NOW())
```

**And** the modal closes
**And** a success toast appears: "Event aktualisiert!"
**And** the events list refreshes

**Given** I click "Löschen" on an event
**When** the confirmation dialog opens
**Then** the dialog shows:
- Title: "Event löschen?"
- Message: "Möchtest du das Event '{eventTitle}' wirklich löschen?"
- Warning (if participants exist): "⚠️ {X} Teilnehmer sind angemeldet. Sie werden per Email benachrichtigt."
- "Ja, löschen" button (red, destructive)
- "Abbrechen" button (gray)

**Given** I confirm deletion
**When** I click "Ja, löschen"
**Then** a `DELETE /api/v1/admin/events/{id}` request is sent
**And** the backend performs a soft delete:
```sql
UPDATE events SET deleted_at = NOW(), deleted_by_admin_id = {adminId} WHERE id = {eventId}
```

**And** the backend logs the action in `audit_logs`:
```sql
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, created_at)
VALUES ({adminId}, 'DELETE', 'event', {eventId}, '{"participantCount": X}', NOW())
```

**And** the backend sends cancellation emails to all participants (via email queue)
**And** the dialog closes
**And** a success toast appears: "Event gelöscht. Teilnehmer wurden benachrichtigt."
**And** the event disappears from the list

**Given** I try to delete an event with participants
**When** the deletion fails (e.g., database constraint)
**Then** an error toast appears: "Fehler beim Löschen. Bitte versuche es erneut."
**And** the event remains in the list

---

### Story 3.4: Audit Logging System

As an **admin**,
I want all admin actions to be logged,
So that I can review changes and ensure accountability.

**Acceptance Criteria:**

**Given** no `audit_logs` table exists
**When** I create the Drizzle ORM schema for audit logging
**Then** the schema includes the following columns (snake_case):
- `id` (serial primary key)
- `user_id` (integer, foreign key to `users.id`, not null)
- `action` (text, not null) - values: 'CREATE', 'UPDATE', 'DELETE', 'ROLE_CHANGE'
- `resource_type` (text, not null) - values: 'event', 'user', 'settings'
- `resource_id` (integer, not null) - ID of the affected resource
- `details` (jsonb, nullable) - additional context (e.g., changed fields)
- `ip_address` (text, nullable) - request IP for security auditing
- `user_agent` (text, nullable) - request User-Agent
- `created_at` (timestamp, default now())

**And** the table has indexes:
```sql
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

**And** the table has a retention policy comment:
```sql
COMMENT ON TABLE audit_logs IS '3-year retention policy. Records older than 3 years should be archived.';
```

**Given** the `audit_logs` table exists
**When** an admin performs any CREATE/UPDATE/DELETE action
**Then** the backend automatically logs the action:
```typescript
await db.insert(auditLogs).values({
  userId: req.user.id,
  action: 'CREATE', // or 'UPDATE', 'DELETE'
  resourceType: 'event',
  resourceId: newEvent.id,
  details: { title: newEvent.title },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  createdAt: new Date()
});
```

**Given** audit logs are being created
**When** I navigate to `/admin/audit-logs` (new page)
**Then** I see a paginated table with columns:
- Zeitpunkt (timestamp, format: DD.MM.YYYY HH:mm)
- Benutzer (admin name, link to user profile)
- Aktion (color-coded: CREATE=green, UPDATE=blue, DELETE=red, ROLE_CHANGE=orange)
- Ressource (e.g., "Event: Feierabendtour")
- Details (expandable JSON preview)

**And** the table has filters:
- Date range picker (default: last 30 days)
- Action type dropdown (all/CREATE/UPDATE/DELETE/ROLE_CHANGE)
- User dropdown (all admins)

**And** the table has search:
- Search by resource name (e.g., event title)

**Given** I click on a Details cell
**When** the JSON details expand
**Then** I see the full JSON object formatted (syntax highlighting)
**And** I can copy the JSON to clipboard

**Given** I filter by action type "DELETE"
**When** I select "DELETE" from the dropdown
**Then** only DELETE actions are shown
**And** the table updates instantly (TanStack Query)

---

### Story 3.5: Activity Tracking & Member Statistics

As an **admin**,
I want to see member statistics and activity trends,
So that I can understand platform engagement and growth.

**Acceptance Criteria:**

**Given** users are registering and participating in events
**When** the system tracks user activity
**Then** the following events are tracked:
- User registration (captured via `users.created_at`)
- User login (captured via `user_sessions` table, new table)
- Event registration (captured via `event_participants.registered_at`)
- Event cancellation (captured via `event_participants.cancelled_at`, new nullable column)

**And** a new `user_sessions` table is created:
```sql
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  login_at TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_login_at ON user_sessions(login_at DESC);
```

**And** every successful login creates a `user_sessions` record

**Given** activity data is being tracked
**When** I navigate to `/admin/statistics` (new page)
**Then** I see the "Member Statistics" dashboard with the following sections:

**Section 1: Overview Cards**
- **Total Members**: Count of all users
- **USV-Verified Members**: Count of users with `is_usv_verified = true`
- **Founding Members**: Count of users with `is_founding_member = true`
- **Active Users (Last 7 Days)**: Count of users with at least 1 login in the last 7 days

**Section 2: Registration Trends Chart**
- Line chart showing user registrations over the last 30 days
- X-axis: Date (DD.MM format)
- Y-axis: Number of new registrations
- Data grouped by day
- Tooltip on hover showing exact count

**Section 3: Activity Breakdown Table**
- Table with columns:
  - Date (DD.MM.YYYY)
  - New Registrations
  - Total Logins
  - Event Registrations
  - Event Cancellations
- Sortable by column (default: Date DESC)
- Pagination (20 rows per page)

**Given** I hover over the Registration Trends Chart
**When** I move my cursor over a data point
**Then** a tooltip appears showing:
- Date: "23.12.2025"
- Registrations: "8"

**Given** I click on the "Total Members" overview card
**When** the navigation occurs
**Then** I am taken to `/admin/members` (members list page)

**Given** no activity data exists (e.g., brand new installation)
**When** I view the statistics page
**Then** I see empty state messages:
- "Noch keine Mitglieder registriert."
- Chart shows "Keine Daten verfügbar"
- Table is empty with message "Keine Aktivität in den letzten 30 Tagen"

---

### Story 3.6: Event Analytics & Engagement Metrics

As an **admin**,
I want to see event analytics and engagement metrics,
So that I can understand which events are popular and optimize future tours.

**Acceptance Criteria:**

**Given** events have participants (from Epic 2)
**When** I navigate to `/admin/analytics/events` (new page)
**Then** I see the "Event Analytics" dashboard with the following sections:

**Section 1: Engagement Overview Cards**
- **Total Events Created**: Count of all events
- **Total Registrations**: Sum of all event registrations
- **Average Attendance Rate**: (participants who showed up / total registered) × 100%
- **Cancellation Rate**: (cancellations / total registrations) × 100%

**Section 2: Most Popular Events Table**
- Table with columns:
  - Event Title (link to event details)
  - Event Date (DD.MM.YYYY)
  - Registrations (count)
  - Cancellations (count)
  - Attendance Rate (percentage)
- Sorted by Registrations DESC (default)
- Top 10 events shown
- Pagination available

**Section 3: Registration Timeline Chart**
- Line chart showing event registrations over time (last 90 days)
- X-axis: Week (e.g., "KW 51")
- Y-axis: Number of registrations
- Data grouped by week
- Tooltip on hover

**Section 4: Peak Registration Times Heatmap**
- Heatmap showing when users register for events:
  - X-axis: Day of week (Mo, Di, Mi, Do, Fr, Sa, So)
  - Y-axis: Hour of day (0-23)
  - Color intensity: Number of registrations (light=low, dark=high)
- Helps admins understand optimal announcement times

**Given** I click on an event title in the "Most Popular Events" table
**When** the navigation occurs
**Then** I am taken to `/admin/events/{id}` (event details page)
**And** the page shows:
- Event details (title, date, description, etc.)
- Participant list with avatars and names
- Timeline of registrations (graph)
- **"Download Participant List" button** (CSV export)

**Given** I click "Download Participant List" on the event details page
**When** the download is triggered
**Then** a `GET /api/v1/admin/events/{id}/participants/export` request is sent
**And** the backend generates a CSV file with columns:
```csv
Vorname,Nachname,Email,USV-Nummer,Angemeldet am,Status
Lisa,Müller,lisa@example.com,12345,23.12.2025 09:15,Bestätigt
Gerhard,Schmidt,gerhard@example.com,67890,23.12.2025 10:30,Abgesagt
...
```

**And** the CSV file is downloaded with filename: `teilnehmerliste-{event-title}-{date}.csv`
**And** the CSV uses UTF-8 BOM encoding (Excel-compatible for German umlauts)

**Given** an event has no participants yet
**When** I try to download the participant list
**Then** the button is disabled
**And** a tooltip appears: "Keine Teilnehmer angemeldet"

---

### Story 3.7: Event Statistics Export (CSV/PDF)

As an **admin**,
I want to export event statistics as CSV or PDF,
So that I can share reports with the board or analyze data in Excel.

**Acceptance Criteria:**

**Given** I am on the `/admin/analytics/events` page
**When** I see the export section at the top of the page
**Then** I see two export buttons:
- "Export als CSV" (Excel icon, blue button)
- "Export als PDF" (PDF icon, red button)

**And** I see a date range picker:
- Default: Last 30 days
- Allows selecting custom date range

**Given** I click "Export als CSV"
**When** the export is triggered
**Then** a `GET /api/v1/admin/analytics/events/export?format=csv&startDate=2025-11-23&endDate=2025-12-23` request is sent
**And** the backend generates a CSV file with columns:
```csv
Event-Titel,Datum,Schwierigkeit,Max. Teilnehmer,Anmeldungen,Absagen,Teilnahmerate (%),Erstellt von,Erstellt am
Feierabendtour,23.12.2025,Mittel,20,18,2,88.89,Mario Admin,20.12.2025
Rennrad-Training,24.12.2025,Rennrad,15,12,1,91.67,Mario Admin,21.12.2025
...
```

**And** the CSV file is downloaded with filename: `event-statistiken-{startDate}-{endDate}.csv`
**And** the CSV uses UTF-8 BOM encoding (Excel-compatible)

**Given** I click "Export als PDF"
**When** the export is triggered
**Then** a `GET /api/v1/admin/analytics/events/export?format=pdf&startDate=2025-11-23&endDate=2025-12-23` request is sent
**And** the backend generates a PDF file using jsPDF library with:
- **Header**: "URC Falke - Event Statistiken"
- **Subtitle**: "Zeitraum: 23.11.2025 - 23.12.2025"
- **Table**: Same data as CSV (Event-Titel, Datum, Anmeldungen, etc.)
- **Summary Section**:
  - Total Events: X
  - Total Registrations: Y
  - Average Attendance Rate: Z%
- **Footer**: "Erstellt am: {currentDate} | Seite {pageNumber}"

**And** the PDF file is downloaded with filename: `event-statistiken-{startDate}-{endDate}.pdf`
**And** the PDF is printable (A4 format, landscape orientation)

**Given** no events exist in the selected date range
**When** I try to export
**Then** an error toast appears: "Keine Events im ausgewählten Zeitraum gefunden."
**And** the export is cancelled

**Given** the export fails (e.g., server error)
**When** the API returns `500 Internal Server Error`
**Then** an error toast appears: "Export fehlgeschlagen. Bitte versuche es erneut."
**And** the error is logged to the backend console

---

### Story 3.8: User Role Management (RBAC)

As an **admin**,
I want to manage user roles (promote/demote users to admin),
So that I can delegate admin responsibilities to trusted members.

**Acceptance Criteria:**

**Given** I am on the `/admin/members` page
**When** the page loads
**Then** I see a searchable, paginated table with columns:
- Avatar (profile image)
- Name (first_name + last_name)
- Email
- USV-Nummer (if verified)
- Role (badge: "Admin" in red, "Member" in gray)
- Registriert am (DD.MM.YYYY)
- Actions (3-dot menu button)

**And** the table has filters:
- Search by name or email (real-time search)
- Filter by role (All / Admin / Member)
- Filter by USV-verified status (All / Verified / Not Verified)

**Given** I click the 3-dot menu button for a user
**When** the dropdown menu opens
**Then** I see the following actions:
- 👁️ "Profil ansehen" (navigates to `/admin/members/{id}`)
- 🔧 "Rolle ändern" (opens role change dialog)
- 📊 "Aktivität ansehen" (shows user activity modal)
- 🗑️ "Account löschen" (opens deletion confirmation, DSGVO compliance)

**Given** I click "Rolle ändern" for a member user
**When** the role change dialog opens
**Then** the dialog shows:
- Title: "Rolle ändern für {userName}?"
- Current role: "Member"
- New role: Select dropdown (Admin / Member)
- Confirmation message: "Möchtest du {userName} zum Admin machen? Sie erhalten Zugriff auf alle Admin-Funktionen."
- "Bestätigen" button (blue)
- "Abbrechen" button (gray)

**Given** I select "Admin" and click "Bestätigen"
**When** the role change is submitted
**Then** a `PATCH /api/v1/admin/users/{id}/role` request is sent with body:
```json
{ "role": "admin" }
```

**And** the backend updates the `users` table:
```sql
UPDATE users SET role = 'admin', updated_at = NOW() WHERE id = {userId}
```

**And** the backend logs the action in `audit_logs`:
```sql
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, created_at)
VALUES ({adminId}, 'ROLE_CHANGE', 'user', {userId}, '{"oldRole": "member", "newRole": "admin"}', NOW())
```

**And** the dialog closes
**And** a success toast appears: "{userName} ist jetzt Admin."
**And** the table refreshes (TanStack Query refetch)
**And** the user's role badge changes to "Admin" (red)

**Given** I try to demote myself (current admin)
**When** I click "Rolle ändern" on my own user
**Then** a warning dialog appears:
- Title: "Warnung"
- Message: "Du bist dabei, deine eigenen Admin-Rechte zu entfernen. Du wirst keinen Zugriff mehr auf den Admin-Bereich haben. Möchtest du fortfahren?"
- "Ja, fortfahren" button (red, destructive)
- "Abbrechen" button (gray)

**Given** I confirm self-demotion
**When** the role change completes
**Then** I am logged out
**And** redirected to `/events` (member view)
**And** a toast appears: "Deine Admin-Rechte wurden entfernt."

**Given** I try to change the role of the only admin in the system
**When** the role change is submitted
**Then** the backend returns `400 Bad Request` with error:
```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Mindestens ein Admin muss existieren. Du kannst den letzten Admin nicht degradieren.",
  "action": "promote_another_admin_first"
}
```

**And** an error toast appears: "Fehler: Mindestens ein Admin muss existieren."

---

### Story 3.9: DSGVO Data Export

As an **admin**,
I want to export complete user data packages,
So that I can comply with DSGVO Article 20 (data portability) requests.

**Acceptance Criteria:**

**Given** I am on the `/admin/members/{id}` user details page
**When** I see the user profile
**Then** I see a "DSGVO-Daten exportieren" button (blue, with download icon)
**And** a disclaimer text: "Exportiert alle personenbezogenen Daten dieses Benutzers gemäß DSGVO Art. 20."

**Given** I click "DSGVO-Daten exportieren"
**When** the export is triggered
**Then** a `GET /api/v1/admin/users/{id}/export` request is sent
**And** the backend collects all user data from multiple tables:
- **User profile**: `users` table (email, name, profile_image_url, usv_number, etc.)
- **Event participations**: `event_participants` table (all events registered/cancelled)
- **Event photos**: `photos` table (if Epic 5 is implemented)
- **Tour reports**: `tour_reports` table (if Epic 5 is implemented)
- **Comments & likes**: `comments`, `likes` tables (if Epic 5 is implemented)
- **Login history**: `user_sessions` table (last 90 days only, for privacy)
- **Audit logs**: `audit_logs` table (where `user_id = {userId}`)

**And** the backend generates a JSON file with structure:
```json
{
  "exportDate": "2025-12-23T10:30:00Z",
  "user": {
    "id": 123,
    "email": "lisa@example.com",
    "firstName": "Lisa",
    "lastName": "Müller",
    "usvNumber": "12345",
    "isUsvVerified": true,
    "isFoundingMember": true,
    "lotteryRegistered": true,
    "profileImageUrl": "https://...",
    "role": "member",
    "createdAt": "2025-12-01T08:00:00Z",
    "updatedAt": "2025-12-15T12:00:00Z"
  },
  "eventParticipations": [
    {
      "eventId": 42,
      "eventTitle": "Feierabendtour",
      "eventDate": "2025-12-23T09:00:00Z",
      "registeredAt": "2025-12-20T14:30:00Z",
      "cancelledAt": null,
      "attended": true
    },
    ...
  ],
  "loginHistory": [
    {
      "loginAt": "2025-12-22T08:15:00Z",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    },
    ...
  ],
  "auditLogs": [
    {
      "action": "UPDATE",
      "resourceType": "user",
      "details": { "field": "email", "oldValue": "old@example.com", "newValue": "new@example.com" },
      "createdAt": "2025-12-15T12:00:00Z"
    },
    ...
  ],
  "photos": [...],
  "tourReports": [...],
  "comments": [...],
  "likes": [...]
}
```

**And** the JSON file is downloaded with filename: `dsgvo-export-{userId}-{date}.json`
**And** the JSON is formatted (pretty-printed, indented)

**Given** the export is successful
**When** the download completes
**Then** a success toast appears: "DSGVO-Export erfolgreich heruntergeladen."
**And** the export action is logged in `audit_logs`:
```sql
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, created_at)
VALUES ({adminId}, 'EXPORT', 'user', {userId}, '{"type": "dsgvo_export"}', NOW())
```

**Given** the user has no data (e.g., just registered, no activity)
**When** the export is generated
**Then** the JSON file includes only the user profile section
**And** other sections are empty arrays: `"eventParticipations": []`, etc.

**Given** the export fails (e.g., database timeout)
**When** the API returns `500 Internal Server Error`
**Then** an error toast appears: "Export fehlgeschlagen. Bitte versuche es erneut."
**And** the error is logged to the backend console with stack trace

**Given** the admin tries to export data for a non-existent user
**When** the API returns `404 Not Found`
**Then** an error toast appears: "Benutzer nicht gefunden."
**And** the admin is redirected to `/admin/members`

---

## Epic 4: Falki AI Assistant - Stories

### Story 4.1: Falki Chat UI Foundation

As a **user**,
I want to chat with Falki in a conversational interface,
So that I can interact with the platform using natural language.

**Acceptance Criteria:**

**Given** I am logged in
**When** I tap the "💬 Falki" tab in the bottom tab bar
**Then** I navigate to the Falki chat screen (`/falki` route)
**And** the screen is fullscreen on mobile (no extra padding)
**And** the screen has three main sections:
- **Header**: "Falki - Dein URC Assistent" with info icon (opens help dialog)
- **Messages Container**: Scrollable chat messages (reversed scroll, newest at bottom)
- **Input Section**: Text input + send button (sticky at bottom)

**Given** I open the Falki chat for the first time
**When** the chat screen loads
**Then** I see a welcome message from Falki:
```
"Hallo {firstName}! 👋 Ich bin Falki, dein persönlicher URC-Assistent.
Ich kann dir helfen mit:
- Event-Fragen beantworten
- Dich für Events anmelden
- USV-Mitgliedschafts-Infos geben

Was kann ich für dich tun?"
```

**And** the welcome message has an avatar (bicycle icon or Falki logo)
**And** the message appears with a fade-in animation (200ms)

**Given** I type a message "Hallo Falki!"
**When** I click the "Senden" button or press Enter
**Then** my message appears in the chat as a user bubble:
- Right-aligned
- Blue background (#1E40AF USV-Blau)
- White text
- Rounded corners (8px)
- Max width: 80% of screen
- Timestamp below (small gray text, format: HH:mm)

**And** my message is immediately added to the chat (optimistic UI)
**And** a loading indicator appears (three dots animation) while Falki responds

**Given** Falki responds to my message
**When** the API returns the response
**Then** Falki's message appears as an assistant bubble:
- Left-aligned
- Light gray background (#F3F4F6)
- Dark text (#1F2937)
- Rounded corners (8px)
- Max width: 80% of screen
- Avatar on the left (bicycle icon)
- Timestamp below (format: HH:mm)

**And** the loading indicator disappears
**And** the message container scrolls to the bottom smoothly (300ms animation)

**Given** I have a conversation with multiple messages
**When** I close the Falki tab and return later
**Then** my chat history persists (stored in IndexedDB)
**And** I see all previous messages (user + assistant)
**And** the scroll position is at the bottom (showing latest messages)

**Given** the chat history exceeds 50 messages
**When** I load the chat screen
**Then** only the last 50 messages are displayed initially
**And** I can scroll up to load older messages (infinite scroll pagination)
**And** older messages are loaded from IndexedDB (10 messages at a time)

**Given** I click the info icon in the header
**When** the help dialog opens
**Then** I see tips for using Falki:
- "Frag mich nach Events: 'Welche Touren gibt es nächste Woche?'"
- "Melde dich an: 'Melde mich für Samstag an'"
- "USV-Infos: 'Was kostet die USV-Mitgliedschaft?'"
- "Ich antworte in wenigen Sekunden!"

**And** the dialog has a "Verstanden" button to close

---

### Story 4.2: Claude Haiku API Integration

As a **developer**,
I want to integrate the Claude Haiku API,
So that Falki can respond to user queries with AI-generated answers.

**Acceptance Criteria:**

**Given** no Claude API integration exists
**When** I install the Anthropic SDK
**Then** `npm install @anthropic-ai/sdk@0.30.0` (or latest) is added to `apps/api/package.json`
**And** the backend has a new environment variable: `ANTHROPIC_API_KEY` (stored in `.env`)

**Given** the Anthropic SDK is installed
**When** I create the Falki service module (`apps/api/src/services/falki.service.ts`)
**Then** the module exports a `sendMessage()` function:
```typescript
async function sendMessage(userId: number, userMessage: string): Promise<string> {
  // 1. Create Anthropic client
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // 2. Fetch user context (name, USV status, etc.)
  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  // 3. Build system prompt with user context
  const systemPrompt = buildSystemPrompt(user);

  // 4. Call Claude Haiku API
  const response = await client.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
    tools: [registerForEventTool, getEventDetailsTool] // Function calling
  });

  // 5. Handle tool calls (if any)
  if (response.stop_reason === 'tool_use') {
    return handleToolCall(response);
  }

  // 6. Return text response
  return response.content[0].text;
}
```

**Given** the system prompt is being built
**When** `buildSystemPrompt(user)` is called
**Then** the prompt includes:
```
Du bist Falki, der freundliche KI-Assistent des Union Radsport Club Falkenau (URC Falke).

Deine Aufgaben:
- Beantworte Fragen zu Events, Touren und Terminen
- Hilf Usern bei der Event-Anmeldung
- Gib Informationen zur USV-Mitgliedschaft
- Sprich deutsch und duze den User

User-Kontext:
- Name: {user.firstName} {user.lastName}
- USV-Mitglied: {user.isUsvVerified ? 'Ja' : 'Nein'}
- Gründungsmitglied: {user.isFoundingMember ? 'Ja' : 'Nein'}

Wichtige Regeln:
- Sei präzise und hilfsbereit
- Verwende Event-IDs nur aus den verfügbaren Tools
- Wenn du nicht weiterhelfen kannst, biete Links zur UI an
- Bestätige immer vor kritischen Aktionen (Event-Anmeldung)
```

**Given** the API endpoint `/api/v1/falki/chat` is created
**When** I send a POST request with:
```json
{ "message": "Hallo Falki!" }
```

**Then** the backend validates:
- User is authenticated (JWT token)
- Message is not empty (min 1 char, max 1000 chars)
- Rate limiting: 100 requests per minute (global, all users)

**And** the backend calls `sendMessage(userId, message)`
**And** the response is returned:
```json
{
  "message": "Hallo Mario! 👋 Wie kann ich dir heute helfen?",
  "timestamp": "2025-12-23T10:30:00Z"
}
```

**Given** the rate limit is exceeded
**When** I send the 101st request within 1 minute
**Then** the backend returns `429 Too Many Requests` with RFC 7807 error:
```json
{
  "type": "about:blank",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Zu viele Anfragen. Bitte versuche es in 1 Minute erneut.",
  "retryAfter": 60
}
```

**Given** the Claude API fails (timeout, API error)
**When** the request times out or returns 500
**Then** the backend catches the error and returns a fallback response:
```json
{
  "message": "Entschuldigung, ich habe gerade Probleme zu antworten. Bitte versuche es erneut oder nutze die normale UI.",
  "error": true
}
```

**And** the error is logged to the backend console with stack trace

**Given** the Claude API key is invalid
**When** the API returns `401 Unauthorized`
**Then** the backend logs a critical error: "ANTHROPIC_API_KEY is invalid or missing"
**And** returns a fallback response to the user
**And** sends an alert to the admin (e.g., email notification)

---

### Story 4.3: Event Q&A via Falki

As a **user**,
I want to ask Falki about events,
So that I can quickly get information without browsing the UI.

**Acceptance Criteria:**

**Given** I am chatting with Falki
**When** I ask "Welche Events gibt es nächste Woche?"
**Then** Falki calls the `getUpcomingEvents` function (function calling)
**And** the function queries the database:
```sql
SELECT id, title, event_date, meeting_point, difficulty, current_participants, max_participants
FROM events
WHERE event_date >= NOW()
  AND event_date <= NOW() + INTERVAL '7 days'
  AND deleted_at IS NULL
ORDER BY event_date ASC
LIMIT 5
```

**And** Falki responds with a formatted list:
```
Hier sind die Events nächste Woche:

📅 **Feierabendtour ins Umland**
- Datum: Samstag, 28.12.2025, 9:00 Uhr
- Treffpunkt: Parkplatz Stadion, Eingang Süd
- Schwierigkeit: Mittel
- Teilnehmer: 18 / 20 (noch 2 Plätze frei)

📅 **Rennrad-Training**
- Datum: Sonntag, 29.12.2025, 8:00 Uhr
- Treffpunkt: Marktplatz Falkenau
- Schwierigkeit: Rennrad
- Teilnehmer: 12 / 15 (noch 3 Plätze frei)

Möchtest du dich für eine Tour anmelden?
```

**And** the response includes markdown formatting (bold titles, bullet points)
**And** the frontend renders markdown using a markdown parser (e.g., `react-markdown`)

**Given** I ask "Was ist der Treffpunkt für Samstag?"
**When** Falki processes the query
**Then** Falki infers the event ID (next Saturday's event) from context
**And** Falki calls the `getEventDetails(eventId)` function
**And** the function queries the database:
```sql
SELECT title, event_date, meeting_point, description, difficulty, distance_km, gpx_track_url
FROM events
WHERE id = {eventId}
```

**And** Falki responds:
```
Der Treffpunkt für die **Feierabendtour ins Umland** am Samstag, 28.12.2025 um 9:00 Uhr ist:

📍 **Parkplatz Stadion, Eingang Süd**

Die Tour ist als **Mittel** eingestuft und geht über ca. 35 km.

Möchtest du dich anmelden?
```

**Given** I ask "Gibt es morgen eine Tour?"
**When** Falki queries the database for tomorrow's events
**Then** if events exist, Falki lists them (same format as above)
**And** if no events exist, Falki responds:
```
Leider gibt es morgen keine geplante Tour. 😔

Die nächste Tour ist am Samstag, 28.12.2025 um 9:00 Uhr: **Feierabendtour ins Umland**.

Möchtest du mehr Details?
```

**Given** I ask an unclear question like "Wann ist die Tour?"
**When** Falki cannot determine which event I'm referring to
**Then** Falki asks for clarification:
```
Welche Tour meinst du? Hier sind die nächsten Touren:

1. **Feierabendtour ins Umland** - Samstag, 28.12.2025
2. **Rennrad-Training** - Sonntag, 29.12.2025

Sag mir einfach "Samstag" oder "Sonntag", und ich gebe dir mehr Infos! 😊
```

**Given** I follow up with "Samstag"
**When** Falki receives the follow-up message
**Then** Falki uses conversation context (previous messages) to infer I'm asking about the Saturday event
**And** Falki provides the event details (same as "Was ist der Treffpunkt für Samstag?" scenario)

**Given** I ask about the weather "Wie wird das Wetter am Samstag?"
**When** Falki processes the query
**Then** Falki checks if weather data exists for the event (from Epic 2, Story 2.8)
**And** if weather data exists, Falki responds:
```
Das Wetter für Samstag, 28.12.2025:

🌤️ **Teilweise bewölkt**
- Temperatur: 8°C
- Niederschlag: 10% Regenwahrscheinlichkeit
- Wind: 12 km/h

Perfekt für eine Tour! 🚴‍♂️
```

**And** if weather data doesn't exist (not yet 24h before event), Falki responds:
```
Die Wettervorhersage wird 24 Stunden vor dem Event verfügbar sein. Schau gerne morgen noch mal rein! 😊
```

---

### Story 4.4: Event Registration via Falki

As a **user**,
I want to register for events via Falki,
So that I can sign up without leaving the chat.

**Acceptance Criteria:**

**Given** I am chatting with Falki about events
**When** I say "Melde mich für Samstag an"
**Then** Falki infers the event ID (next Saturday's event) from context
**And** Falki proposes using the `registerForEvent` tool with confirmation required (FR29)
**And** the backend sends a response with `requiresConfirmation: true`:
```json
{
  "message": "Möchtest du dich wirklich für die **Feierabendtour ins Umland** am Samstag, 28.12.2025 um 9:00 Uhr anmelden?",
  "confirmation": {
    "action": "registerForEvent",
    "eventId": 42,
    "eventTitle": "Feierabendtour ins Umland",
    "eventDate": "2025-12-28T09:00:00Z"
  }
}
```

**Given** the frontend receives a confirmation request
**When** the response contains `confirmation` object
**Then** a confirmation dialog opens (Radix AlertDialog) with:
- Title: "Event-Anmeldung bestätigen"
- Message: "Möchtest du dich wirklich für die **Feierabendtour ins Umland** am Samstag, 28.12.2025 um 9:00 Uhr anmelden?"
- Event details (title, date, meeting point)
- "Ja, anmelden!" button (green, primary)
- "Abbrechen" button (gray, secondary)

**Given** I click "Ja, anmelden!"
**When** the confirmation is submitted
**Then** a `POST /api/v1/falki/execute` request is sent with:
```json
{
  "action": "registerForEvent",
  "eventId": 42
}
```

**And** the backend executes the registration (same logic as Epic 2, Story 2.3):
```sql
INSERT INTO event_participants (event_id, user_id, registered_at)
VALUES ({eventId}, {userId}, NOW())
```

**And** the backend returns:
```json
{
  "success": true,
  "message": "Super! Du bist jetzt für die **Feierabendtour ins Umland** angemeldet. 🎉"
}
```

**And** the frontend displays Falki's success message in the chat
**And** a konfetti animation plays (1000ms, 50 particles)
**And** the confirmation dialog closes

**Given** I click "Abbrechen"
**When** the confirmation is cancelled
**Then** the dialog closes
**And** Falki responds in the chat:
```
Kein Problem! Falls du dich doch noch anmelden möchtest, sag einfach Bescheid. 😊
```

**Given** the event is full (current_participants >= max_participants)
**When** I try to register via Falki
**Then** the backend checks availability before showing confirmation
**And** if the event is full, Falki responds:
```
Leider ist die **Feierabendtour ins Umland** bereits ausgebucht. 😔

Es sind bereits 20 / 20 Teilnehmer angemeldet.

Möchtest du auf die Warteliste?
```

**And** no confirmation dialog is shown

**Given** I'm already registered for the event
**When** I try to register again via Falki
**Then** Falki checks my registration status (query `event_participants` table)
**And** Falki responds:
```
Du bist bereits für die **Feierabendtour ins Umland** angemeldet! 😊

Möchtest du dich doch abmelden?
```

**And** no confirmation dialog is shown

**Given** I say "Melde mich ab von Samstag"
**When** Falki processes the cancellation request
**Then** Falki infers the event ID and proposes cancellation with confirmation:
```
Möchtest du dich wirklich von der **Feierabendtour ins Umland** am Samstag, 28.12.2025 abmelden?
```

**And** a confirmation dialog opens (same flow as registration)
**And** if confirmed, the backend cancels the registration (Epic 2, Story 2.4 logic)

**Given** the registration fails (e.g., database error)
**When** the backend returns `500 Internal Server Error`
**Then** Falki responds:
```
Ups, da ist etwas schiefgelaufen. 😔

Bitte versuche es erneut oder melde dich direkt über die [Event-Seite](/events/42) an.
```

**And** the error is logged to the backend console

---

### Story 4.5: USV-Mitgliedschafts-Infos via Falki

As a **user**,
I want to ask Falki about USV membership,
So that I can learn about benefits and how to join.

**Acceptance Criteria:**

**Given** I am chatting with Falki
**When** I ask "Was kostet die USV-Mitgliedschaft?"
**Then** Falki responds with accurate USV pricing information:
```
Die USV-Mitgliedschaft kostet **50€ pro Jahr** für Erwachsene.

Ermäßigungen:
- **Jugendliche (bis 18 Jahre)**: 25€
- **Familienmitgliedschaft**: 100€ (bis 4 Personen)

Als USV-Mitglied sind alle URC-Touren **GRATIS** für dich! 🎉

Möchtest du mehr über die Vorteile erfahren?
```

**And** the pricing information is stored in the system prompt (configurable by admin in Story 4.8)

**Given** I ask "Wie werde ich USV-Mitglied?"
**When** Falki processes the query
**Then** Falki responds with instructions:
```
So wirst du USV-Mitglied:

1. **Online-Anmeldung**: Gehe zu [usv-falkenau.de/mitgliedschaft](https://usv-falkenau.de/mitgliedschaft)
2. **Formular ausfüllen**: Name, Adresse, Geburtsdatum
3. **Mitgliedsbeitrag zahlen**: 50€ per Überweisung oder PayPal
4. **USV-Mitgliedsnummer erhalten**: Per Email (ca. 2-3 Tage)
5. **Mitgliedsnummer hier eingeben**: In deinem URC-Profil verifizieren

Dann bist du dabei! 🚴‍♂️

Möchtest du zur [Profil-Seite](/profil)?
```

**And** the response includes clickable links (rendered as `<a>` tags by markdown parser)

**Given** I ask "Welche Vorteile habe ich als USV-Mitglied?"
**When** Falki processes the query
**Then** Falki responds with benefits:
```
Als USV-Mitglied genießt du diese Vorteile:

✅ **GRATIS-Teilnahme** an allen URC-Touren (sonst 5€ pro Tour)
✅ **Versicherungsschutz** bei allen Touren (Haftpflicht & Unfall)
✅ **Zugang zum USV-Clubhaus** (Werkstatt, Duschen, Aufenthaltsraum)
✅ **Rabatte** bei lokalen Fahrradhändlern (10-15%)
✅ **Mitgliederversammlungen** mit Mitbestimmungsrecht
✅ **Newsletter** mit exklusiven Infos und Terminen

**Kosten**: 50€ pro Jahr

Möchtest du dich anmelden? → [USV Beitreten](https://usv-falkenau.de/mitgliedschaft)
```

**Given** I ask "Bin ich USV-Mitglied?"
**When** Falki checks my user profile
**Then** if `user.isUsvVerified === true`, Falki responds:
```
Ja, du bist verifiziertes USV-Mitglied! 🎉

Deine USV-Mitgliedsnummer: **{user.usvNumber}**

Du kannst GRATIS an allen URC-Touren teilnehmen. Viel Spaß! 🚴‍♂️
```

**And** if `user.isUsvVerified === false`, Falki responds:
```
Nein, du bist noch kein verifiziertes USV-Mitglied.

Wenn du bereits Mitglied bist, kannst du deine Mitgliedsnummer in deinem [Profil](/profil) eingeben.

Wenn du noch kein Mitglied bist, [hier anmelden](https://usv-falkenau.de/mitgliedschaft). 😊
```

**Given** I ask an unrelated question like "Was ist der beste Fahrradladen?"
**When** Falki cannot answer (outside of knowledge domain)
**Then** Falki responds:
```
Das weiß ich leider nicht. 😔

Ich bin spezialisiert auf:
- Event-Fragen
- Event-Anmeldungen
- USV-Mitgliedschafts-Infos

Für andere Fragen wende dich bitte an die Community oder die Admins. 😊
```

**And** Falki offers fallback UI links (FR32):
```
Hier sind hilfreiche Links:
- [Events ansehen](/events)
- [Profil bearbeiten](/profil)
- [Admin kontaktieren](/kontakt)
```

---

### Story 4.6: Interaction Logging & Analytics

As an **admin**,
I want to see Falki interaction logs and analytics,
So that I can understand how users interact with the chatbot and improve responses.

**Acceptance Criteria:**

**Given** no `falki_interactions` table exists
**When** I create the Drizzle ORM schema for interaction logging
**Then** the schema includes the following columns (snake_case):
- `id` (serial primary key)
- `user_id` (integer, foreign key to `users.id`, not null)
- `user_message` (text, not null)
- `assistant_response` (text, not null)
- `function_calls` (jsonb, nullable) - logs function calls (e.g., `[{name: "registerForEvent", args: {eventId: 42}}]`)
- `success` (boolean, default true) - false if API error or timeout
- `error_message` (text, nullable) - error details if success=false
- `response_time_ms` (integer, nullable) - API response time in milliseconds
- `created_at` (timestamp, default now())

**And** the table has indexes:
```sql
CREATE INDEX idx_falki_interactions_user_id ON falki_interactions(user_id);
CREATE INDEX idx_falki_interactions_created_at ON falki_interactions(created_at DESC);
CREATE INDEX idx_falki_interactions_success ON falki_interactions(success);
```

**Given** a user sends a message to Falki
**When** the backend processes the request
**Then** the backend logs the interaction:
```typescript
const startTime = Date.now();
try {
  const response = await sendMessage(userId, userMessage);
  const responseTime = Date.now() - startTime;

  await db.insert(falkiInteractions).values({
    userId,
    userMessage,
    assistantResponse: response,
    functionCalls: extractFunctionCalls(response), // Parse function calls from response
    success: true,
    responseTimeMs: responseTime,
    createdAt: new Date()
  });

  return response;
} catch (error) {
  const responseTime = Date.now() - startTime;

  await db.insert(falkiInteractions).values({
    userId,
    userMessage,
    assistantResponse: 'Error',
    success: false,
    errorMessage: error.message,
    responseTimeMs: responseTime,
    createdAt: new Date()
  });

  throw error;
}
```

**Given** interaction logs are being created
**When** I navigate to `/admin/analytics/falki` (new admin page)
**Then** I see the "Falki Analytics" dashboard with the following sections:

**Section 1: Overview Cards**
- **Total Interactions**: Count of all Falki messages
- **Success Rate**: (successful interactions / total interactions) × 100%
- **Avg Response Time**: Average response_time_ms
- **Active Users (Last 7 Days)**: Count of unique users who used Falki

**Section 2: Most Asked Questions Table**
- Table with columns:
  - User Message (truncated to 100 chars)
  - Count (how many times asked)
  - Avg Response Time (ms)
  - Success Rate (%)
- Sorted by Count DESC (default)
- Top 20 questions shown
- Click to expand full message

**Section 3: Function Call Analytics Table**
- Table with columns:
  - Function Name (e.g., "registerForEvent")
  - Total Calls
  - Success Rate (%)
  - Avg Response Time (ms)
- Sorted by Total Calls DESC

**Section 4: Interaction Timeline Chart**
- Line chart showing Falki interactions over time (last 30 days)
- X-axis: Date (DD.MM format)
- Y-axis: Number of interactions
- Data grouped by day
- Tooltip on hover

**Given** I click on a question in the "Most Asked Questions" table
**When** the expansion occurs
**Then** I see:
- Full user message (not truncated)
- Sample assistant response (first occurrence)
- Timestamp of first occurrence
- Link to "View All Interactions" (filtered by this question)

**Given** I navigate to `/admin/analytics/falki/interactions` (detailed logs page)
**When** the page loads
**Then** I see a paginated table with columns:
- Timestamp (DD.MM.YYYY HH:mm)
- User (name, link to user profile)
- User Message (truncated, expandable)
- Assistant Response (truncated, expandable)
- Function Calls (badge count, expandable JSON)
- Success (✅ or ❌)
- Response Time (ms)

**And** the table has filters:
- Date range picker (default: last 7 days)
- User dropdown (all users)
- Success status (all/success/error)
- Function called (all/registerForEvent/getEventDetails)

**And** the table has search:
- Search by user message or assistant response (full-text search)

**Given** the interaction failed (success=false)
**When** I view the interaction in the table
**Then** the Success column shows ❌ (red cross)
**And** hovering over ❌ shows a tooltip with the error message
**And** the row is highlighted in light red background

---

### Story 4.7: Voice Input Support

As a **user**,
I want to use voice input to chat with Falki,
So that I can interact hands-free (e.g., while cycling).

**Acceptance Criteria:**

**Given** I am on the Falki chat screen (`/falki`)
**When** I see the input section
**Then** I see two buttons:
- **Microphone button** (🎤 icon, left of input field)
- **Send button** (paper plane icon, right of input field)

**And** the microphone button is visible on all devices (mobile, tablet, desktop)

**Given** I click the microphone button
**When** the button is pressed
**Then** the browser requests microphone permission (Web Permissions API)
**And** if permission is granted, the microphone starts listening (Web Speech API)
**And** the microphone button changes state:
- Icon: 🔴 (red dot, recording indicator)
- Background: Red (#EF4444)
- Pulsing animation (scale 1.0 → 1.1 → 1.0, infinite loop)

**And** a toast appears: "Jetzt sprechen..."

**Given** I speak into the microphone
**When** the Web Speech API transcribes my speech
**Then** the transcribed text appears in the input field (live update)
**And** the transcription is in German (language: 'de-DE')
**And** the input field updates as I speak (continuous recognition)

**Example:**
- I say: "Welche Events gibt es nächste Woche?"
- Input field shows: "welche events gibt es nächste woche" (lowercase, real-time)

**Given** I stop speaking (silence for 2 seconds)
**When** the speech recognition detects silence
**Then** the microphone stops listening automatically
**And** the microphone button returns to default state (🎤 icon, gray background)
**And** the transcribed text remains in the input field
**And** I can edit the text or click "Senden" to submit

**Given** I click the microphone button again while recording
**When** the button is pressed during recording
**Then** the recording stops manually
**And** the microphone button returns to default state
**And** the transcribed text is finalized in the input field

**Given** the browser doesn't support Web Speech API (e.g., Firefox)
**When** I click the microphone button
**Then** a toast appears: "Spracherkennung wird von deinem Browser nicht unterstützt. Bitte verwende Chrome oder Safari."
**And** the microphone button is disabled (grayed out)
**And** a tooltip on hover explains: "Spracherkennung nicht verfügbar"

**Given** I deny microphone permission
**When** the browser permission dialog is rejected
**Then** a toast appears: "Mikrofon-Zugriff verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen."
**And** the microphone button returns to default state

**Given** the speech recognition fails (e.g., network error, API timeout)
**When** the Web Speech API returns an error
**Then** a toast appears: "Spracherkennung fehlgeschlagen. Bitte versuche es erneut."
**And** the microphone button returns to default state
**And** the input field is cleared (no partial transcription)

**Given** I switch tabs while recording
**When** I navigate away from the Falki chat
**Then** the recording stops automatically (browser security)
**And** when I return, the microphone button is in default state

**Given** I use voice input on iOS Safari
**When** I speak and the transcription completes
**Then** the transcription works correctly (iOS supports Web Speech API since iOS 14.5)
**And** the microphone button UI matches iOS design guidelines (44x44px touch target)

---

### Story 4.8: Admin Prompt Management & Fallback Links

As an **admin**,
I want to customize Falki's system prompt and fallback behavior,
So that I can optimize responses and guide users when Falki can't help.

**Acceptance Criteria:**

**Given** I am logged in as admin
**When** I navigate to `/admin/settings/falki` (new admin page)
**Then** I see the "Falki Configuration" page with three sections:

**Section 1: System Prompt Editor**
- Large textarea (min 10 rows) with current system prompt
- Markdown preview panel (split view)
- Character count (e.g., "1234 / 5000 characters")
- Variables documentation (e.g., `{user.firstName}`, `{user.isUsvVerified}`)
- Default system prompt (example shown in Story 4.2)

**Section 2: USV Membership Info**
- Editable fields for USV membership details:
  - Pricing (Adult, Youth, Family)
  - Benefits list (textarea, markdown support)
  - How to Join instructions (textarea, markdown support)
  - USV Website URL (text input, validated URL)
- "Reset to Default" button (restores original content)

**Section 3: Fallback UI Links**
- List of fallback links (when Falki can't answer)
- Each link has:
  - Label (e.g., "Events ansehen")
  - URL (e.g., "/events")
  - Visibility toggle (show/hide)
- "Add Link" button (adds new link)
- Drag-and-drop reordering (priority)

**Given** I edit the system prompt
**When** I modify the textarea
**Then** the markdown preview updates in real-time (debounced 500ms)
**And** variables like `{user.firstName}` are highlighted (syntax highlighting)
**And** if I use an invalid variable (e.g., `{user.invalidField}`), a warning appears: "Variable nicht verfügbar"

**Given** I click "Änderungen speichern"
**When** the save button is clicked
**Then** a `PATCH /api/v1/admin/settings/falki` request is sent with:
```json
{
  "systemPrompt": "Du bist Falki, der freundliche KI-Assistent...",
  "usvMembershipInfo": {
    "pricing": { "adult": 50, "youth": 25, "family": 100 },
    "benefits": "✅ GRATIS-Teilnahme...",
    "howToJoin": "1. Online-Anmeldung...",
    "websiteUrl": "https://usv-falkenau.de/mitgliedschaft"
  },
  "fallbackLinks": [
    { "label": "Events ansehen", "url": "/events", "visible": true },
    { "label": "Profil bearbeiten", "url": "/profil", "visible": true }
  ]
}
```

**And** the backend updates the `app_settings` table (or dedicated `falki_settings` table):
```sql
UPDATE app_settings
SET value = {json_data}
WHERE key = 'falki_config'
```

**And** the backend clears the system prompt cache (if cached)
**And** a success toast appears: "Falki-Konfiguration gespeichert!"

**Given** the system prompt is updated
**When** a user sends a message to Falki
**Then** the backend uses the new system prompt (from database)
**And** the new prompt is included in the Claude API request

**Given** I click "Test Chat" button (new button in Section 1)
**When** the button is clicked
**Then** a preview chat modal opens (Radix Dialog)
**And** I can test Falki with the new prompt (without saving)
**And** the test chat uses a sandbox environment (doesn't log to `falki_interactions`)
**And** I can send 5 test messages (limit to prevent abuse)

**Given** Falki can't answer a user's question
**When** the user asks something outside Falki's knowledge domain
**Then** Falki responds with fallback message (FR32):
```
Das weiß ich leider nicht. 😔

Hier sind hilfreiche Links:
- [Events ansehen](/events)
- [Profil bearbeiten](/profil)
- [Admin kontaktieren](/kontakt)
```

**And** the fallback links are dynamically loaded from `falki_settings.fallbackLinks`
**And** only visible links are shown (where `visible: true`)

**Given** I add a new fallback link
**When** I click "Add Link" and fill out:
- Label: "Spenden"
- URL: "/spenden"
- Visibility: ✅ (checked)

**Then** the link is added to the list
**And** I can drag it to reorder priority
**And** after saving, the link appears in Falki's fallback responses

**Given** I reset to default settings
**When** I click "Reset to Default" button
**Then** a confirmation dialog appears: "Möchtest du wirklich alle Änderungen verwerfen und die Standardeinstellungen wiederherstellen?"
**And** if confirmed, all fields are reset to default values (from backend seed data)
**And** unsaved changes are lost

---

## Epic 5: Community & Content Sharing - Stories

### Story 5.1: Photo Upload Foundation

As a **user**,
I want to upload photos after participating in an event,
So that I can share my cycling experiences with the community.

**Acceptance Criteria:**

**Given** no `photos` table exists
**When** I create the Drizzle ORM schema for photo storage
**Then** the schema includes the following columns (snake_case):
- `id` (serial primary key)
- `event_id` (integer, foreign key to `events.id`, not null)
- `uploaded_by_user_id` (integer, foreign key to `users.id`, not null)
- `image_url` (text, not null) - full-resolution image URL
- `thumbnail_url` (text, not null) - thumbnail (300x300px) URL
- `caption` (text, nullable, max 500 chars)
- `width` (integer, not null) - original image width in pixels
- `height` (integer, not null) - original image height in pixels
- `file_size_bytes` (integer, not null)
- `like_count` (integer, default 0)
- `comment_count` (integer, default 0)
- `is_hidden` (boolean, default false) - admin moderation flag
- `created_at` (timestamp, default now())

**And** the table has indexes:
```sql
CREATE INDEX idx_photos_event_id ON photos(event_id);
CREATE INDEX idx_photos_uploaded_by_user_id ON photos(uploaded_by_user_id);
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
```

**Given** I participated in an event (exists in `event_participants`)
**When** I navigate to the event details page `/events/{id}`
**Then** I see a "Fotos hochladen" button (camera icon, green)
**And** the button is only visible if:
  - The event is in the past (event_date < NOW())
  - I participated in the event (my user_id in `event_participants`)

**Given** I click "Fotos hochladen"
**When** the upload modal opens (Radix Dialog)
**Then** I see:
- Title: "Event-Fotos hochladen"
- File input (multiple files, accept: image/jpeg, image/png)
- Drag-and-drop zone ("Fotos hierher ziehen oder klicken zum Auswählen")
- Selected files preview (thumbnails with remove button)
- Caption input (optional, max 500 chars, placeholder: "Beschreibe deine Tour...")
- "Hochladen" button (disabled until at least 1 file selected)
- "Abbrechen" button

**Given** I select photos from my device
**When** I choose 3 JPEG files (total 15MB)
**Then** the frontend validates each file:
- File type: Must be JPEG or PNG
- File size: Max 10MB per file
- Total upload: Max 50MB (5 files max per upload)
- Image dimensions: Min 300x300px, max 8000x8000px

**And** if validation passes, I see thumbnails of the selected files
**And** each thumbnail shows:
  - Preview image (100x100px)
  - File name (truncated)
  - File size (e.g., "2.4 MB")
  - Remove button (X icon)

**Given** I upload an invalid file (e.g., 12MB, GIF format)
**When** the validation fails
**Then** an error toast appears: "Ungültige Datei: {fileName}. Nur JPEG/PNG bis 10MB erlaubt."
**And** the file is not added to the preview list

**Given** I click "Hochladen"
**When** the upload is submitted
**Then** a `POST /api/v1/events/{eventId}/photos` request is sent with:
- FormData containing files and caption
- Content-Type: multipart/form-data

**And** the backend uploads each file to Vercel Blob (or S3-compatible storage):
```typescript
const uploadedFile = await put(`event-photos/${eventId}/${Date.now()}-${file.name}`, file, {
  access: 'public',
  addRandomSuffix: true
});
```

**And** the backend generates a thumbnail (300x300px) using Sharp library:
```typescript
const thumbnailBuffer = await sharp(file.buffer)
  .resize(300, 300, { fit: 'cover' })
  .jpeg({ quality: 80 })
  .toBuffer();

const thumbnail = await put(`event-photos/${eventId}/thumbnails/${Date.now()}.jpg`, thumbnailBuffer, {
  access: 'public'
});
```

**And** the backend inserts records into the `photos` table:
```sql
INSERT INTO photos (event_id, uploaded_by_user_id, image_url, thumbnail_url, caption, width, height, file_size_bytes, created_at)
VALUES ({eventId}, {userId}, {imageUrl}, {thumbnailUrl}, {caption}, {width}, {height}, {fileSize}, NOW())
```

**Given** the upload is successful
**When** the API returns `201 Created`
**Then** the modal closes
**And** a success toast appears: "Fotos hochgeladen! 🎉"
**And** the event details page refreshes (TanStack Query refetch)
**And** my new photos appear in the event gallery

**Given** the upload fails (e.g., storage quota exceeded, network error)
**When** the API returns `500 Internal Server Error`
**Then** an error toast appears: "Upload fehlgeschlagen. Bitte versuche es erneut."
**And** the modal remains open (allow retry)

**Given** I upload photos during the upload process
**When** the upload is in progress
**Then** I see a progress bar (0-100%) for each file
**And** the "Hochladen" button is disabled
**And** the progress updates in real-time

---

### Story 5.2: Event Photo Gallery

As a **user**,
I want to view event photo galleries,
So that I can see photos from past tours.

**Acceptance Criteria:**

**Given** an event has photos uploaded
**When** I navigate to `/events/{id}` (event details page)
**Then** I see a "Galerie" section below the event description
**And** the section displays photos in a responsive grid layout:
- Mobile: 2 columns
- Tablet: 3 columns
- Desktop: 4 columns

**And** each photo thumbnail shows:
- Image (300x300px, object-fit: cover)
- User avatar overlay (bottom-left corner, 32x32px)
- Like count overlay (bottom-right corner, heart icon + count)
- Hover effect (scale 1.05, smooth transition)

**Given** I click on a photo thumbnail
**When** the click event fires
**Then** a lightbox viewer opens (fullscreen modal)
**And** the lightbox displays:
- Full-resolution image (centered, max 90vw/90vh)
- Caption below image (if provided)
- Uploaded by: "{firstName} {lastName}" with avatar
- Upload date: "vor X Tagen" (relative time)
- Like button (heart icon, filled if I liked it)
- Like count (e.g., "42 Likes")
- Comments section (below photo)
- Navigation arrows (left/right to browse gallery)
- Close button (X icon, top-right)

**Given** I am in the lightbox viewing a photo
**When** I click the right arrow
**Then** the next photo in the gallery is displayed
**And** the transition is smooth (fade-in, 200ms)
**And** the URL updates to `/events/{id}/photos/{nextPhotoId}` (deep linking)

**Given** I am viewing the last photo in the gallery
**When** I click the right arrow
**Then** the lightbox wraps around to the first photo
**And** a subtle visual indicator shows "Zurück zum Anfang"

**Given** I swipe left on mobile (touch gesture)
**When** the swipe distance exceeds 50px
**Then** the lightbox navigates to the next photo (same as arrow)

**Given** I press the Escape key
**When** the lightbox is open
**Then** the lightbox closes
**And** I return to the event details page
**And** the URL updates to `/events/{id}`

**Given** the event has no photos yet
**When** I view the event details page
**Then** I see an empty state in the "Galerie" section:
- Icon: Camera with slash
- Message: "Noch keine Fotos hochgeladen."
- Sub-message: "Sei der Erste, der Fotos von dieser Tour teilt!"
- "Fotos hochladen" button (if I participated)

**Given** the event has many photos (e.g., 100 photos)
**When** I scroll down the gallery
**Then** photos are loaded incrementally (infinite scroll)
**And** the initial load displays 20 photos
**And** when I reach the bottom, the next 20 photos load automatically
**And** a loading spinner appears during fetch

**Given** I navigate to `/galerie` (new global gallery page)
**When** the page loads
**Then** I see photos from all events (most recent first)
**And** each photo has an event label (e.g., "Feierabendtour - 28.12.2025")
**And** I can filter by:
  - Event (dropdown)
  - Date range (date picker)
  - Uploader (search user)

**And** I can sort by:
  - Most recent (default)
  - Most liked
  - Most commented

---

### Story 5.3: Photo Interactions: Comments & Likes

As a **user**,
I want to like and comment on event photos,
So that I can engage with the community and share my thoughts.

**Acceptance Criteria:**

**Given** no `likes` table exists
**When** I create the Drizzle ORM schema for likes
**Then** the schema includes the following columns (snake_case):
- `id` (serial primary key)
- `photo_id` (integer, foreign key to `photos.id`, not null)
- `user_id` (integer, foreign key to `users.id`, not null)
- `created_at` (timestamp, default now())

**And** the table has a unique constraint:
```sql
ALTER TABLE likes ADD CONSTRAINT unique_like_per_user_photo UNIQUE (photo_id, user_id);
CREATE INDEX idx_likes_photo_id ON likes(photo_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
```

**Given** no `comments` table exists
**When** I create the Drizzle ORM schema for comments
**Then** the schema includes the following columns (snake_case):
- `id` (serial primary key)
- `photo_id` (integer, foreign key to `photos.id`, not null)
- `user_id` (integer, foreign key to `users.id`, not null)
- `comment_text` (text, not null, max 1000 chars)
- `created_at` (timestamp, default now())

**And** the table has indexes:
```sql
CREATE INDEX idx_comments_photo_id ON comments(photo_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
```

**Given** I am viewing a photo in the lightbox
**When** I see the like button (heart icon)
**Then** the button shows:
- Empty heart (outline) if I haven't liked it
- Filled heart (solid, red #EF4444) if I already liked it
- Like count next to the heart (e.g., "42")

**Given** I click the like button
**When** the button is clicked
**Then** a `POST /api/v1/photos/{photoId}/like` request is sent
**And** the backend inserts a like record:
```sql
INSERT INTO likes (photo_id, user_id, created_at)
VALUES ({photoId}, {userId}, NOW())
ON CONFLICT (photo_id, user_id) DO NOTHING
```

**And** the backend increments the photo's like_count:
```sql
UPDATE photos SET like_count = like_count + 1 WHERE id = {photoId}
```

**And** the frontend updates immediately (optimistic UI)
**And** the heart icon changes to filled (red)
**And** the like count increases by 1

**Given** I click the like button again (unlike)
**When** the button is clicked on a liked photo
**Then** a `DELETE /api/v1/photos/{photoId}/like` request is sent
**And** the backend deletes the like record:
```sql
DELETE FROM likes WHERE photo_id = {photoId} AND user_id = {userId}
```

**And** the backend decrements the photo's like_count:
```sql
UPDATE photos SET like_count = like_count - 1 WHERE id = {photoId}
```

**And** the frontend updates immediately
**And** the heart icon changes to outline
**And** the like count decreases by 1

**Given** I am viewing a photo in the lightbox
**When** I scroll to the comments section
**Then** I see all comments for the photo (most recent first)
**And** each comment displays:
- User avatar (32x32px)
- User name (bold)
- Comment text (max 1000 chars, line breaks preserved)
- Relative timestamp (e.g., "vor 2 Stunden")
- Delete button (trash icon, only visible if I'm the author or admin)

**Given** I want to add a comment
**When** I see the comment input field (bottom of comments section)
**Then** the input field has:
- Placeholder: "Kommentar hinzufügen..."
- Max length: 1000 characters
- Character counter (e.g., "450 / 1000")
- Send button (paper plane icon, disabled if empty)

**Given** I type a comment and click send
**When** the send button is clicked
**Then** a `POST /api/v1/photos/{photoId}/comments` request is sent with:
```json
{ "commentText": "Tolle Tour! 🚴‍♂️" }
```

**And** the backend inserts a comment record:
```sql
INSERT INTO comments (photo_id, user_id, comment_text, created_at)
VALUES ({photoId}, {userId}, {commentText}, NOW())
```

**And** the backend increments the photo's comment_count:
```sql
UPDATE photos SET comment_count = comment_count + 1 WHERE id = {photoId}
```

**And** the frontend displays the new comment immediately (optimistic UI)
**And** the comment input field is cleared

**Given** I click the delete button on my own comment
**When** the delete button is clicked
**Then** a confirmation dialog appears: "Kommentar wirklich löschen?"
**And** if confirmed, a `DELETE /api/v1/photos/{photoId}/comments/{commentId}` request is sent
**And** the backend deletes the comment:
```sql
DELETE FROM comments WHERE id = {commentId} AND user_id = {userId}
```

**And** the backend decrements the photo's comment_count
**And** the comment disappears from the list

**Given** someone likes or comments on my photo
**When** the interaction occurs
**Then** I receive a notification (Epic 6 integration):
- "Lisa hat dein Foto geliked 💙"
- "Gerhard hat dein Foto kommentiert: 'Tolle Aufnahme!'"

**And** the notification links to the photo lightbox

---

### Story 5.4: Tour Reports (Write & View)

As a **user**,
I want to write and view tour reports,
So that I can document my cycling experiences in detail.

**Acceptance Criteria:**

**Given** no `tour_reports` table exists
**When** I create the Drizzle ORM schema for tour reports
**Then** the schema includes the following columns (snake_case):
- `id` (serial primary key)
- `event_id` (integer, foreign key to `events.id`, not null)
- `author_user_id` (integer, foreign key to `users.id`, not null)
- `title` (text, not null, max 200 chars)
- `content` (text, not null, max 10000 chars) - markdown format
- `moderation_status` (text, default 'pending') - values: 'pending', 'approved', 'rejected'
- `moderated_by_admin_id` (integer, foreign key to `users.id`, nullable)
- `moderated_at` (timestamp, nullable)
- `created_at` (timestamp, default now())
- `updated_at` (timestamp, default now())

**And** the table has indexes:
```sql
CREATE INDEX idx_tour_reports_event_id ON tour_reports(event_id);
CREATE INDEX idx_tour_reports_author_user_id ON tour_reports(author_user_id);
CREATE INDEX idx_tour_reports_moderation_status ON tour_reports(moderation_status);
CREATE INDEX idx_tour_reports_created_at ON tour_reports(created_at DESC);
```

**Given** I participated in an event
**When** I navigate to the event details page `/events/{id}`
**Then** I see a "Tourbericht schreiben" button (pencil icon, blue)
**And** the button is only visible if:
  - The event is in the past
  - I participated in the event
  - I haven't already written a report for this event

**Given** I click "Tourbericht schreiben"
**When** the editor modal opens (fullscreen on mobile, Radix Dialog)
**Then** I see a markdown editor with:
- Title input (required, max 200 chars, placeholder: "Titel deines Tourberichts")
- Markdown editor (textarea with preview toggle)
- Toolbar: Bold, Italic, Link, List, Image (markdown syntax helpers)
- Preview button (toggle between edit/preview mode)
- Character counter (e.g., "1234 / 10000")
- "Veröffentlichen" button (green, primary)
- "Abbrechen" button (gray, secondary)

**Given** I write a tour report
**When** I type in the markdown editor
**Then** I can use markdown syntax:
- `**bold**` → **bold**
- `*italic*` → *italic*
- `[link](url)` → clickable link
- `- list item` → bullet list
- `![alt](image-url)` → embedded image

**And** I can toggle preview mode to see formatted output

**Given** I click "Veröffentlichen"
**When** the submit button is clicked
**Then** a `POST /api/v1/events/{eventId}/tour-reports` request is sent with:
```json
{
  "title": "Unvergessliche Feierabendtour",
  "content": "## Die Route\n\nWir sind 35km durch...\n\n![Foto](https://...)"
}
```

**And** the backend creates a tour report:
```sql
INSERT INTO tour_reports (event_id, author_user_id, title, content, moderation_status, created_at)
VALUES ({eventId}, {userId}, {title}, {content}, 'pending', NOW())
```

**And** the modal closes
**And** a success toast appears: "Tourbericht eingereicht! ✅ Er wird von einem Admin geprüft."
**And** the report appears in my profile with "Moderation ausstehend" badge

**Given** I am an admin
**When** I navigate to `/admin/moderation/tour-reports`
**Then** I see a list of pending tour reports with:
- Title
- Author (name, avatar)
- Event (title, date)
- Created at (DD.MM.YYYY)
- Preview button (opens preview modal)
- Approve button (green)
- Reject button (red)

**Given** I click "Approve" on a pending report
**When** the approval is submitted
**Then** a `PATCH /api/v1/admin/tour-reports/{id}/approve` request is sent
**And** the backend updates the report:
```sql
UPDATE tour_reports
SET moderation_status = 'approved', moderated_by_admin_id = {adminId}, moderated_at = NOW()
WHERE id = {reportId}
```

**And** the backend logs the action in `audit_logs`
**And** a success toast appears: "Tourbericht freigegeben!"
**And** the report disappears from the pending list

**Given** an approved tour report exists
**When** I navigate to `/events/{id}` (event details page)
**Then** I see a "Tourberichte" section
**And** the section displays all approved reports (list view)
**And** each report card shows:
- Title (clickable, links to detail page)
- Author (name, avatar)
- Excerpt (first 200 chars of content)
- Created at (DD.MM.YYYY)
- "Mehr lesen" button

**Given** I click on a tour report title
**When** the navigation occurs
**Then** I am taken to `/tour-reports/{id}` (detail page)
**And** the page displays:
- Title (h1, large font)
- Author info (avatar, name, "von {firstName} {lastName}")
- Event link (e.g., "zur Feierabendtour am 28.12.2025")
- Created at (DD.MM.YYYY)
- Full content (rendered markdown with syntax highlighting)
- Back button ("Zurück zum Event")

**And** the markdown content is sanitized (XSS protection)
**And** external links open in new tab (`target="_blank"`)

---

### Story 5.5: Social Media Sharing

As a **user**,
I want to share event photos on social media,
So that I can promote the club and attract new members.

**Acceptance Criteria:**

**Given** I am viewing a photo in the lightbox
**When** I see the share button (share icon, top-right toolbar)
**Then** clicking the button opens a share menu (Radix Popover) with options:
- 📘 Facebook
- 💬 WhatsApp
- 📷 Instagram (copy link)
- 🔗 Link kopieren

**Given** I click "Facebook"
**When** the Facebook share is triggered
**Then** the Facebook Share Dialog opens in a new window:
```javascript
window.open(
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(photoUrl)}`,
  'facebook-share-dialog',
  'width=626,height=436'
);
```

**And** the photoUrl includes Open Graph meta tags:
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://urc-falke.de/photos/123" />
<meta property="og:title" content="Feierabendtour - URC Falke" />
<meta property="og:description" content="Tolle Tour mit dem URC Falke am 28.12.2025" />
<meta property="og:image" content="{photo.imageUrl}" />
<meta property="og:image:width" content="{photo.width}" />
<meta property="og:image:height" content="{photo.height}" />
```

**And** a `POST /api/v1/photos/{photoId}/share` request is sent to track the share:
```sql
UPDATE photos SET share_count = share_count + 1 WHERE id = {photoId}
```

**Given** I click "WhatsApp"
**When** the WhatsApp share is triggered
**Then** the WhatsApp Web/App opens with pre-filled message:
```javascript
const message = `Schau dir dieses Foto von unserer Tour an! 🚴‍♂️\n${photoUrl}`;
window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
```

**And** on mobile, the native WhatsApp app opens (deep link)

**Given** I click "Instagram"
**When** Instagram is selected
**Then** a dialog appears:
- Title: "Auf Instagram teilen"
- Message: "Instagram unterstützt kein direktes Teilen. Link wurde kopiert!"
- Instructions: "Öffne Instagram, erstelle einen neuen Post, und füge den Link in die Bio oder Story ein."
- "Instagram öffnen" button (opens instagram://camera)

**And** the photo URL is copied to clipboard

**Given** I click "Link kopieren"
**When** the copy action is triggered
**Then** the photo URL is copied to clipboard
**And** a toast appears: "Link kopiert! 📋"
**And** the share count is incremented

**Given** the browser doesn't support clipboard API
**When** I click "Link kopieren"
**Then** a fallback dialog appears with:
- Read-only input field containing the URL
- "Kopieren" button (manual copy with execCommand)
- "Schließen" button

**Given** the photo page is accessed by a social media crawler
**When** Facebook/WhatsApp/Twitter bots request the page
**Then** the server returns HTML with complete Open Graph tags
**And** the crawler can extract the preview image, title, and description
**And** the preview looks good in social media feeds

**Given** I want to see share statistics
**When** I navigate to `/admin/analytics/social` (new admin page)
**Then** I see a dashboard with:
- Total shares (all photos)
- Shares by platform (Facebook, WhatsApp, Instagram, Link)
- Most shared photos (top 10)
- Share trends over time (last 30 days chart)

---

### Story 5.6: Event History & Frequent Riders

As a **user**,
I want to see my event history and find frequent riding companions,
So that I can track my participation and connect with regular members.

**Acceptance Criteria:**

**Given** I participated in multiple events
**When** I navigate to `/profil` (my profile page)
**Then** I see an "Event-Historie" section with:
- Title: "Meine Touren"
- Total events participated count (e.g., "Du bist 24 Touren gefahren 🚴‍♂️")
- Total distance (sum of all event.distance_km, e.g., "Insgesamt 450 km")
- List of past events (most recent first, paginated 10 per page)

**And** each event in the list shows:
- Event title (clickable, links to event details)
- Event date (DD.MM.YYYY)
- Distance (e.g., "35 km")
- Difficulty badge (Leicht/Mittel/Schwer/Rennrad)
- Participant count (e.g., "18 Teilnehmer")

**Given** I click on an event in my history
**When** the navigation occurs
**Then** I am taken to the event details page `/events/{id}`
**And** I see the event information, photos, and tour reports

**Given** I want to find frequent riding companions
**When** I navigate to `/profil/haeufige-mitfahrer` (new page)
**Then** I see a "Häufige Mitfahrer" section with:
- Title: "Mit wem du am häufigsten fährst"
- Explanation: "Basierend auf gemeinsamen Touren"
- List of users I've ridden with most (sorted by overlap count DESC)

**And** the backend calculates frequent riders:
```sql
SELECT
  u.id, u.first_name, u.last_name, u.profile_image_url,
  COUNT(DISTINCT ep1.event_id) AS shared_events_count
FROM users u
JOIN event_participants ep1 ON u.id = ep1.user_id
JOIN event_participants ep2 ON ep1.event_id = ep2.event_id
WHERE ep2.user_id = {myUserId}
  AND u.id != {myUserId}
  AND ep1.cancelled_at IS NULL
  AND ep2.cancelled_at IS NULL
GROUP BY u.id
HAVING COUNT(DISTINCT ep1.event_id) >= 3
ORDER BY shared_events_count DESC
LIMIT 20
```

**And** each frequent rider card shows:
- User avatar (64x64px)
- User name (bold)
- Badge: "Schon {X}-mal zusammen gefahren" (e.g., "Schon 12-mal zusammen gefahren")
- "Profil ansehen" button (links to `/users/{id}`)

**Given** I click "Profil ansehen" on a frequent rider
**When** the navigation occurs
**Then** I am taken to `/users/{id}` (public user profile page)
**And** the page displays:
- User avatar (large, 128x128px)
- User name
- USV-Mitglied badge (if verified)
- Gründungsmitglied badge (if founding member)
- Event statistics:
  - Total events participated
  - Total distance
- Shared events section: "Gemeinsame Touren" (list of events we both attended)
- Recent photos uploaded by this user

**Given** no user has >= 3 shared events with me
**When** I view the "Häufige Mitfahrer" page
**Then** I see an empty state:
- Icon: Group of cyclists
- Message: "Noch keine häufigen Mitfahrer."
- Sub-message: "Nimm an mindestens 3 Touren teil, um Empfehlungen zu sehen!"

**Given** I want to see event history on my public profile
**When** other users navigate to `/users/{myId}`
**Then** they see my event history (same format as my private profile)
**And** they see my uploaded photos
**And** they do NOT see my email, USV number, or other private data

---

### Story 5.7: Admin Content Moderation

As an **admin**,
I want to moderate tour reports and photos,
So that I can ensure community guidelines are followed.

**Acceptance Criteria:**

**Given** I am logged in as admin
**When** I navigate to `/admin/moderation` (new admin page)
**Then** I see the "Content Moderation Dashboard" with tabs:
- **Tour Reports** (pending approval)
- **Photos** (flagged or reported)
- **Comments** (flagged or reported)

**And** the dashboard shows overview cards:
- Pending Tour Reports (count)
- Flagged Photos (count)
- Flagged Comments (count)
- Moderation Actions (last 7 days, count)

**Given** I click the "Tour Reports" tab
**When** the tab loads
**Then** I see a list of pending tour reports (moderation_status = 'pending')
**And** each report card shows:
- Title (bold)
- Author (name, avatar, link to user profile)
- Event (title, date, link to event)
- Content preview (first 200 chars)
- Created at (DD.MM.YYYY HH:mm)
- "Preview" button (opens preview modal)
- "Approve" button (green)
- "Reject" button (red)

**Given** I click "Preview" on a tour report
**When** the preview modal opens
**Then** I see the full tour report content (rendered markdown)
**And** I can scroll through the entire report
**And** I see approve/reject buttons in the modal footer

**Given** I click "Approve"
**When** the approval is confirmed
**Then** a `PATCH /api/v1/admin/tour-reports/{id}/approve` request is sent
**And** the backend updates:
```sql
UPDATE tour_reports
SET moderation_status = 'approved', moderated_by_admin_id = {adminId}, moderated_at = NOW()
WHERE id = {reportId}
```

**And** the backend logs the action in `audit_logs`:
```sql
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, created_at)
VALUES ({adminId}, 'APPROVE', 'tour_report', {reportId}, '{"title": "..."}', NOW())
```

**And** the report disappears from the pending list
**And** a success toast appears: "Tourbericht freigegeben!"
**And** the author receives a notification: "Dein Tourbericht wurde veröffentlicht! 🎉"

**Given** I click "Reject"
**When** the rejection dialog opens
**Then** I see:
- Title: "Tourbericht ablehnen?"
- Message: "Möchtest du diesen Tourbericht wirklich ablehnen?"
- Reason input (textarea, required, max 500 chars, placeholder: "Grund für die Ablehnung...")
- "Ablehnen" button (red, destructive)
- "Abbrechen" button (gray)

**Given** I confirm rejection with a reason
**When** the rejection is submitted
**Then** a `PATCH /api/v1/admin/tour-reports/{id}/reject` request is sent with:
```json
{ "reason": "Inhalte entsprechen nicht den Community-Richtlinien." }
```

**And** the backend updates:
```sql
UPDATE tour_reports
SET moderation_status = 'rejected', moderated_by_admin_id = {adminId}, moderated_at = NOW()
WHERE id = {reportId}
```

**And** the backend logs the action in `audit_logs`
**And** the author receives a notification: "Dein Tourbericht wurde abgelehnt. Grund: {reason}"

**Given** I click the "Photos" tab
**When** the tab loads
**Then** I see a grid of all photos (most recent first)
**And** each photo has:
- Thumbnail (300x300px)
- User info (avatar, name)
- Event info (title, date)
- Upload date
- Actions: "Hide" button (eye-slash icon), "Delete" button (trash icon)

**Given** I click "Hide" on a photo
**When** the hide action is confirmed
**Then** a `PATCH /api/v1/admin/photos/{id}/hide` request is sent
**And** the backend updates:
```sql
UPDATE photos SET is_hidden = true WHERE id = {photoId}
```

**And** the backend logs the action in `audit_logs`
**And** the photo is hidden from public galleries (users can't see it)
**And** the photo owner sees a message: "Dieses Foto wurde von einem Admin ausgeblendet."

**Given** I click "Delete" on a photo
**When** the deletion dialog opens
**Then** I see:
- Title: "Foto löschen?"
- Warning: "Diese Aktion kann nicht rückgängig gemacht werden!"
- Reason input (textarea, required)
- "Löschen" button (red, destructive)
- "Abbrechen" button (gray)

**Given** I confirm deletion
**When** the deletion is submitted
**Then** a `DELETE /api/v1/admin/photos/{id}` request is sent
**And** the backend deletes the photo:
```sql
DELETE FROM photos WHERE id = {photoId}
```

**And** the backend deletes associated likes and comments (cascade delete)
**And** the backend deletes the image files from storage (Vercel Blob)
**And** the backend logs the action in `audit_logs`
**And** the photo owner receives a notification: "Dein Foto wurde gelöscht. Grund: {reason}"

**Given** I want to see moderation history
**When** I navigate to `/admin/moderation/history`
**Then** I see a paginated table with all moderation actions (last 30 days)
**And** the table has columns:
- Timestamp (DD.MM.YYYY HH:mm)
- Admin (name)
- Action (APPROVE/REJECT/HIDE/DELETE)
- Resource (Tour Report / Photo / Comment)
- Details (title or preview)
- Reason (if applicable)

**And** the table has filters:
- Date range picker
- Admin dropdown
- Action type dropdown
- Resource type dropdown

---

## Epic 6: Notifications & Communication - Stories

### Story 6.1: Email Service Foundation

As a **developer**,
I want to set up an email service infrastructure,
So that the platform can send transactional and marketing emails.

**Acceptance Criteria:**

**Given** no email service exists
**When** I choose an email provider
**Then** I select **Resend** (modern, developer-friendly, EU-compliant)
**And** I install the Resend SDK: `npm install resend@2.x`
**And** I add the API key to `.env`: `RESEND_API_KEY`

**Given** the Resend SDK is installed
**When** I create the email service module (`apps/api/src/services/email.service.ts`)
**Then** the module exports helper functions:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return await resend.emails.send({
    from: 'URC Falke <noreply@urc-falke.de>',
    to,
    subject,
    html
  });
}
```

**Given** I need to send emails asynchronously
**When** I install BullMQ for job queues
**Then** `npm install bullmq@4.x ioredis@5.x` is added
**And** I configure Redis connection (Upstash Redis for serverless)
**And** I create an email queue:
```typescript
import { Queue, Worker } from 'bullmq';

const emailQueue = new Queue('emails', {
  connection: { host: process.env.REDIS_HOST, port: 6379 }
});

export async function queueEmail(emailData) {
  await emailQueue.add('send-email', emailData);
}

// Worker processes emails in background
const worker = new Worker('emails', async (job) => {
  const { to, subject, html } = job.data;
  await sendEmail({ to, subject, html });
});
```

**Given** I need reusable email templates
**When** I create email template functions
**Then** I use React Email (or Handlebars) for templates:
```typescript
// Example: Welcome Email Template
export function welcomeEmailTemplate(user: { firstName: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1E40AF;">Willkommen bei URC Falke, ${user.firstName}! 👋</h1>
        <p>Schön, dass du dabei bist! ...</p>
        <a href="https://urc-falke.de/events" style="...">Zu den Events</a>
      </body>
    </html>
  `;
}
```

**Given** emails need tracking
**When** I send an email via Resend
**Then** Resend provides email tracking (opens, clicks) via webhooks
**And** I can configure webhooks in Resend dashboard

**Given** I want to test emails locally
**When** I run the dev environment
**Then** I use Mailhog or Resend test mode
**And** emails are not sent to real recipients in development

---

### Story 6.2: Transactional Emails

As a **user**,
I want to receive email confirmations for important actions,
So that I have a record of my activities.

**Acceptance Criteria:**

**Given** I register a new account
**When** the registration is successful
**Then** a welcome email is queued:
```typescript
await queueEmail({
  to: user.email,
  subject: 'Willkommen bei URC Falke! 🚴‍♂️',
  html: welcomeEmailTemplate(user)
});
```

**And** the email arrives within 1 minute
**And** the email contains:
- Greeting: "Willkommen, {firstName}!"
- Introduction to URC Falke
- Link to explore events
- Link to complete profile
- USV membership info (if not verified)

**Given** I register for an event
**When** the registration is successful
**Then** a confirmation email is queued:
```typescript
await queueEmail({
  to: user.email,
  subject: 'Event-Anmeldung bestätigt: {eventTitle}',
  html: eventRegistrationTemplate(user, event)
});
```

**And** the email contains:
- Event title
- Event date (DD.MM.YYYY, HH:mm)
- Meeting point
- Participant count ("Du bist Teilnehmer #12")
- Cancellation link (1-click unsubscribe)
- iCal attachment (optional)

**Given** I cancel my event registration
**When** the cancellation is successful
**Then** a cancellation email is queued:
```typescript
await queueEmail({
  to: user.email,
  subject: 'Event-Abmeldung bestätigt: {eventTitle}',
  html: eventCancellationTemplate(user, event)
});
```

**And** the email contains:
- Confirmation: "Du hast dich erfolgreich abgemeldet."
- Event details (for reference)
- Link to view other upcoming events

**Given** I request a password reset
**When** I click "Passwort vergessen?" on the login page
**Then** a password reset email is queued:
```typescript
await queueEmail({
  to: user.email,
  subject: 'Passwort zurücksetzen - URC Falke',
  html: passwordResetTemplate(user, resetToken)
});
```

**And** the email contains:
- Reset link with token (expires in 1 hour)
- Warning: "Wenn du diese Anfrage nicht gestellt hast, ignoriere diese Email."
- Link validity: "Dieser Link ist 1 Stunde gültig."

**Given** an email fails to send (e.g., invalid email, provider error)
**When** the email queue worker processes the job
**Then** the job is retried 3 times (with exponential backoff)
**And** if all retries fail, the error is logged
**And** the admin receives an alert (Epic 3 audit logs)

---

### Story 6.3: Newsletter Preferences

As a **user**,
I want to manage my email preferences,
So that I only receive emails I'm interested in.

**Acceptance Criteria:**

**Given** no `email_preferences` table exists
**When** I create the Drizzle ORM schema
**Then** the schema includes:
- `user_id` (integer, foreign key, primary key)
- `newsletter_events` (boolean, default true) - Event announcements
- `newsletter_community` (boolean, default true) - Community updates
- `newsletter_marketing` (boolean, default false) - Promotions
- `transactional_emails` (boolean, default true) - Cannot be disabled (legal requirement)
- `updated_at` (timestamp)

**Given** I navigate to `/profil/einstellungen` (profile settings)
**When** the page loads
**Then** I see an "Email-Benachrichtigungen" section with toggles:
- ✅ Event-Ankündigungen (newsletter_events)
- ✅ Community-Updates (newsletter_community)
- ⬜ Angebote & Aktionen (newsletter_marketing)
- ✅ Transaktions-Emails (transactional_emails, disabled toggle, grayed out)

**And** each toggle has a description:
- "Event-Ankündigungen: Neue Touren und Event-Erinnerungen"
- "Community-Updates: Tourberichte, Fotos, und Neuigkeiten"
- "Angebote & Aktionen: Spezielle Angebote und Rabatte"
- "Transaktions-Emails: Bestätigungen und wichtige Hinweise (nicht deaktivierbar)"

**Given** I toggle "Event-Ankündigungen" off
**When** the toggle is clicked
**Then** a `PATCH /api/v1/users/me/email-preferences` request is sent with:
```json
{ "newsletterEvents": false }
```

**And** the backend updates:
```sql
UPDATE email_preferences SET newsletter_events = false, updated_at = NOW() WHERE user_id = {userId}
```

**And** a success toast appears: "Email-Einstellungen gespeichert!"

**Given** an admin sends an event announcement email
**When** the email blast is triggered
**Then** the backend filters recipients:
```sql
SELECT u.email FROM users u
JOIN email_preferences ep ON u.id = ep.user_id
WHERE ep.newsletter_events = true
```

**And** only users with `newsletter_events = true` receive the email

**Given** I receive any email from URC Falke
**When** I open the email
**Then** I see an unsubscribe link at the bottom:
"Keine Emails mehr erhalten? [Abmelden](https://urc-falke.de/unsubscribe?token={token})"

**Given** I click the unsubscribe link
**When** I navigate to `/unsubscribe?token={token}`
**Then** I see an unsubscribe confirmation page:
- Title: "Email-Benachrichtigungen abbestellen"
- Message: "Möchtest du dich von allen Emails abmelden?"
- Options (checkboxes):
  - ⬜ Event-Ankündigungen
  - ⬜ Community-Updates
  - ⬜ Angebote & Aktionen
  - ⬜ Alle Emails (außer Transaktions-Emails)
- "Abmelden" button (red)

**Given** I confirm unsubscribe
**When** I click "Abmelden"
**Then** the backend updates my email preferences
**And** I see a success message: "Du wurdest erfolgreich abgemeldet. Du erhältst nur noch wichtige Transaktions-Emails."

---

### Story 6.4: Admin Event Announcements

As an **admin**,
I want to send event announcements to all members,
So that I can promote upcoming tours.

**Acceptance Criteria:**

**Given** I am logged in as admin
**When** I navigate to `/admin/communications` (new page)
**Then** I see the "Email Announcements" dashboard with:
- Title: "Event-Ankündigungen versenden"
- "Neue Ankündigung erstellen" button (green, prominent)
- History of past announcements (list, paginated)

**Given** I click "Neue Ankündigung erstellen"
**When** the modal opens
**Then** I see a form with:
- Subject (text input, required, max 100 chars, placeholder: "Neue Feierabendtour am Samstag!")
- Message (rich text editor, required, max 5000 chars)
- Event selector (dropdown, optional, links announcement to specific event)
- Preview button
- "Vorschau senden" button (sends test email to my admin email)
- "Jetzt versenden" button (blue, primary)

**Given** I write an announcement
**When** I type in the message editor
**Then** I can use rich text formatting:
- Bold, Italic, Underline
- Links
- Lists (bullet, numbered)
- Images (upload or URL)

**Given** I click "Vorschau senden"
**When** the test email is sent
**Then** a `POST /api/v1/admin/announcements/preview` request is sent
**And** the backend sends a test email to my admin email address
**And** a toast appears: "Vorschau-Email versendet an {adminEmail}"

**Given** I click "Jetzt versenden"
**When** the send button is clicked
**Then** a confirmation dialog appears:
- Title: "Ankündigung versenden?"
- Message: "Diese Email wird an {X} Empfänger gesendet."
- Recipient count: "Empfänger: {count} (nur Nutzer mit aktivierten Event-Ankündigungen)"
- "Ja, versenden" button (blue)
- "Abbrechen" button (gray)

**Given** I confirm sending
**When** the confirmation is submitted
**Then** a `POST /api/v1/admin/announcements` request is sent with:
```json
{
  "subject": "Neue Feierabendtour am Samstag!",
  "message": "<p>Hallo zusammen, ...</p>",
  "eventId": 42
}
```

**And** the backend creates an announcement record:
```sql
INSERT INTO announcements (subject, message, event_id, sent_by_admin_id, sent_at, recipient_count)
VALUES ({subject}, {message}, {eventId}, {adminId}, NOW(), {count})
```

**And** the backend queues emails for all eligible recipients:
```typescript
const recipients = await db.select()
  .from(users)
  .innerJoin(emailPreferences, eq(users.id, emailPreferences.userId))
  .where(eq(emailPreferences.newsletterEvents, true));

for (const recipient of recipients) {
  await queueEmail({
    to: recipient.email,
    subject,
    html: announcementEmailTemplate({ user: recipient, message, event })
  });
}
```

**And** the modal closes
**And** a success toast appears: "Ankündigung wird versendet! {X} Empfänger"
**And** the announcement appears in the history list

**Given** I want to see announcement statistics
**When** I click on a past announcement in the history
**Then** I see a detail view with:
- Subject & message
- Sent at (DD.MM.YYYY HH:mm)
- Recipient count
- Open rate (percentage of recipients who opened)
- Click rate (percentage who clicked links)
- Unsubscribe count (how many unsubscribed after this email)

---

### Story 6.5: In-App Notifications

As a **user**,
I want to receive in-app notifications for important events,
So that I stay updated without checking email.

**Acceptance Criteria:**

**Given** no `notifications` table exists
**When** I create the Drizzle ORM schema
**Then** the schema includes:
- `id` (serial primary key)
- `user_id` (integer, foreign key, not null)
- `type` (text, not null) - values: 'event_reminder', 'photo_like', 'photo_comment', 'tour_report_approved'
- `title` (text, not null, max 100 chars)
- `message` (text, not null, max 500 chars)
- `link_url` (text, nullable) - deep link to relevant page
- `is_read` (boolean, default false)
- `created_at` (timestamp, default now())

**And** indexes:
```sql
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

**Given** I am logged in
**When** I see the top navigation bar
**Then** I see a notification bell icon (🔔) in the top-right
**And** if I have unread notifications, I see a red badge with count (e.g., "3")

**Given** I click the notification bell
**When** the notification dropdown opens
**Then** I see a list of my notifications (most recent first, max 10)
**And** each notification shows:
- Icon (based on type: 📅 event, 💙 like, 💬 comment, ✅ approved)
- Title (bold)
- Message (gray, smaller font)
- Time (relative: "vor 2 Stunden")
- Read/unread indicator (unread has light blue background)

**And** the dropdown has:
- "Alle markieren als gelesen" button (top)
- "Alle Benachrichtigungen" link (bottom, opens `/profil/benachrichtigungen`)

**Given** someone likes my photo
**When** the like is created
**Then** the backend creates a notification:
```sql
INSERT INTO notifications (user_id, type, title, message, link_url, created_at)
VALUES (
  {photoOwnerId},
  'photo_like',
  'Neues Like!',
  '{likerName} hat dein Foto geliked 💙',
  '/photos/{photoId}',
  NOW()
)
```

**Given** someone comments on my photo
**When** the comment is created
**Then** a notification is created:
```sql
INSERT INTO notifications (user_id, type, title, message, link_url, created_at)
VALUES (
  {photoOwnerId},
  'photo_comment',
  'Neuer Kommentar!',
  '{commenterName}: "{commentText}"',
  '/photos/{photoId}',
  NOW()
)
```

**Given** my tour report is approved
**When** an admin approves my report
**Then** a notification is created:
```sql
INSERT INTO notifications (user_id, type, title, message, link_url, created_at)
VALUES (
  {authorId},
  'tour_report_approved',
  'Tourbericht veröffentlicht! 🎉',
  'Dein Tourbericht "{reportTitle}" wurde freigegeben.',
  '/tour-reports/{reportId}',
  NOW()
)
```

**Given** I have an event in 48 hours
**When** the reminder job runs (cron job, every hour)
**Then** a notification is created:
```sql
INSERT INTO notifications (user_id, type, title, message, link_url, created_at)
VALUES (
  {userId},
  'event_reminder',
  'Event-Erinnerung: {eventTitle}',
  'Deine Tour startet in 48 Stunden! Treffpunkt: {meetingPoint}',
  '/events/{eventId}',
  NOW()
)
```

**Given** I click on a notification
**When** the notification is clicked
**Then** a `PATCH /api/v1/notifications/{id}/read` request is sent
**And** the backend updates:
```sql
UPDATE notifications SET is_read = true WHERE id = {notificationId}
```

**And** I navigate to the `link_url`
**And** the notification is marked as read (background changes from blue to white)

**Given** I click "Alle markieren als gelesen"
**When** the button is clicked
**Then** a `PATCH /api/v1/notifications/mark-all-read` request is sent
**And** the backend updates:
```sql
UPDATE notifications SET is_read = true WHERE user_id = {userId} AND is_read = false
```

**And** all notifications turn white (read state)
**And** the red badge disappears

**Given** I want real-time notifications
**When** new notifications are created
**Then** the frontend polls `/api/v1/notifications` every 30 seconds
**And** new notifications appear in the bell dropdown
**And** the badge count updates

---

## Epic 7: Donations & Fundraising - Stories

### Story 7.1: Stripe Payment Integration

As a **user**,
I want to donate to URC Falke,
So that I can support the club financially.

**Acceptance Criteria:**

**Given** no Stripe integration exists
**When** I install Stripe SDK
**Then** `npm install stripe@14.x` is added to `apps/api/package.json`
**And** the backend has environment variables:
- `STRIPE_SECRET_KEY` (live/test key)
- `STRIPE_PUBLISHABLE_KEY` (frontend)

**Given** no `donations` table exists
**When** I create the Drizzle ORM schema
**Then** the schema includes:
- `id` (serial primary key)
- `user_id` (integer, foreign key, nullable) - null for anonymous
- `stripe_payment_intent_id` (text, not null, unique)
- `amount_cents` (integer, not null) - amount in cents (e.g., 2500 = 25.00€)
- `currency` (text, default 'eur')
- `is_recurring` (boolean, default false)
- `stripe_subscription_id` (text, nullable) - for recurring donations
- `is_anonymous` (boolean, default false)
- `donor_name` (text, nullable) - for anonymous donors who want receipt
- `donor_email` (text, nullable) - for anonymous donors
- `status` (text, not null) - values: 'pending', 'succeeded', 'failed'
- `receipt_url` (text, nullable) - link to tax receipt PDF
- `created_at` (timestamp, default now())

**And** indexes:
```sql
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX idx_donations_status ON donations(status);
```

**Given** I navigate to `/spenden` (donations page)
**When** the page loads
**Then** I see:
- Hero section: "Unterstütze URC Falke 🚴‍♂️"
- Subtitle: "Deine Spende hilft uns, mehr Touren anzubieten und die Community zu wachsen."
- Donation amount selector (buttons):
  - 10€
  - 25€
  - 50€
  - 100€
  - "Anderer Betrag" (custom input)
- One-time / Monthly toggle
- "Anonym spenden" checkbox
- "Jetzt spenden" button (green, prominent)

**Given** I select 25€ and click "Jetzt spenden"
**When** the button is clicked
**Then** a `POST /api/v1/donations/checkout` request is sent with:
```json
{
  "amountCents": 2500,
  "isRecurring": false,
  "isAnonymous": false
}
```

**And** the backend creates a Stripe Checkout Session:
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'paypal', 'sepa_debit'],
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: { name: 'Spende an URC Falke' },
      unit_amount: 2500 // 25.00€
    },
    quantity: 1
  }],
  mode: 'payment',
  success_url: 'https://urc-falke.de/spenden/erfolg?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://urc-falke.de/spenden',
  metadata: {
    userId: req.user.id,
    isAnonymous: false
  }
});

return { checkoutUrl: session.url };
```

**And** the frontend redirects to the Stripe Checkout page

**Given** I complete the payment on Stripe Checkout
**When** the payment succeeds
**Then** Stripe sends a webhook to `/api/webhooks/stripe`
**And** the backend handles the `checkout.session.completed` event:
```typescript
const session = event.data.object;

await db.insert(donations).values({
  userId: session.metadata.userId,
  stripePaymentIntentId: session.payment_intent,
  amountCents: session.amount_total,
  currency: session.currency,
  isRecurring: false,
  isAnonymous: session.metadata.isAnonymous === 'true',
  status: 'succeeded',
  createdAt: new Date()
});
```

**And** I am redirected to `/spenden/erfolg?session_id={id}`
**And** the success page displays:
- Title: "Vielen Dank für deine Spende! 🎉"
- Konfetti animation (1000ms, 50 particles)
- Donation amount: "Du hast 25,00€ gespendet."
- Next steps: "Du erhältst eine Spendenbescheinigung per Email."
- "Zurück zur Startseite" button

**Given** the payment fails
**When** I cancel on the Stripe Checkout page
**Then** I am redirected to `/spenden?cancelled=true`
**And** a toast appears: "Spende abgebrochen. Versuche es erneut, wenn du möchtest."

---

### Story 7.2: Recurring Donations

As a **user**,
I want to set up recurring donations,
So that I can support URC Falke regularly without manual effort.

**Acceptance Criteria:**

**Given** I am on the `/spenden` page
**When** I toggle "Monatlich" (recurring donations)
**Then** the donation amount selector changes to show monthly values:
- 5€ / Monat
- 10€ / Monat
- 25€ / Monat
- "Anderer Betrag" (custom)

**And** a disclaimer appears: "Deine Spende wird monatlich automatisch abgebucht. Du kannst jederzeit kündigen."

**Given** I select 10€/Monat and click "Jetzt spenden"
**When** the button is clicked
**Then** a `POST /api/v1/donations/checkout` request is sent with:
```json
{
  "amountCents": 1000,
  "isRecurring": true,
  "isAnonymous": false
}
```

**And** the backend creates a Stripe Checkout Session with `mode: 'subscription'`:
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'sepa_debit'],
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: { name: 'Monatliche Spende an URC Falke' },
      unit_amount: 1000,
      recurring: { interval: 'month' }
    },
    quantity: 1
  }],
  mode: 'subscription',
  success_url: 'https://urc-falke.de/spenden/erfolg?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://urc-falke.de/spenden',
  metadata: { userId: req.user.id }
});
```

**Given** I complete the subscription on Stripe
**When** the subscription is created
**Then** Stripe sends a `customer.subscription.created` webhook
**And** the backend stores the subscription:
```sql
INSERT INTO donations (user_id, stripe_payment_intent_id, stripe_subscription_id, amount_cents, is_recurring, status, created_at)
VALUES ({userId}, {paymentIntentId}, {subscriptionId}, 1000, true, 'succeeded', NOW())
```

**Given** I want to manage my subscription
**When** I navigate to `/profil/spenden` (my donations page)
**Then** I see:
- Section: "Deine Spenden"
- One-time donations list (history)
- Recurring donations section: "Deine monatlichen Spenden"

**And** if I have a recurring donation, I see:
- Amount: "10,00€ / Monat"
- Status: "Aktiv" (green badge)
- Next payment: "Nächste Zahlung: 23.01.2026"
- "Spende beenden" button (red)

**Given** I click "Spende beenden"
**When** the cancellation dialog opens
**Then** I see:
- Title: "Monatliche Spende beenden?"
- Message: "Möchtest du deine monatliche Spende wirklich beenden? Du kannst jederzeit wieder spenden."
- "Ja, beenden" button (red)
- "Abbrechen" button (gray)

**Given** I confirm cancellation
**When** the cancellation is submitted
**Then** a `DELETE /api/v1/donations/subscriptions/{subscriptionId}` request is sent
**And** the backend cancels the Stripe subscription:
```typescript
await stripe.subscriptions.cancel(subscriptionId);
```

**And** the backend updates the donation record:
```sql
UPDATE donations SET status = 'cancelled', updated_at = NOW() WHERE stripe_subscription_id = {subscriptionId}
```

**And** a success toast appears: "Monatliche Spende beendet. Vielen Dank für deine Unterstützung!"
**And** the recurring donation section updates to show "Keine aktiven Spenden"

**Given** my recurring donation payment fails (e.g., card declined)
**When** Stripe sends an `invoice.payment_failed` webhook
**Then** the backend sends me an email notification:
- Subject: "Deine monatliche Spende konnte nicht abgebucht werden"
- Message: "Bitte aktualisiere deine Zahlungsmethode..."
- Link to update payment method (Stripe customer portal)

---

### Story 7.3: Anonymous Donations

As a **user**,
I want to donate anonymously,
So that my name doesn't appear on the public donor list.

**Acceptance Criteria:**

**Given** I am on the `/spenden` page
**When** I check the "Anonym spenden" checkbox
**Then** a disclaimer appears: "Dein Name wird nicht öffentlich angezeigt. Du erhältst trotzdem eine Spendenbescheinigung per Email."

**Given** I donate anonymously
**When** I complete the payment
**Then** the backend creates a donation with `is_anonymous = true`:
```sql
INSERT INTO donations (user_id, stripe_payment_intent_id, amount_cents, is_anonymous, status, created_at)
VALUES ({userId}, {paymentIntentId}, 2500, true, 'succeeded', NOW())
```

**Given** I navigate to `/spenden/danke` (public donor wall)
**When** the page loads
**Then** I see:
- Title: "Danke an unsere Unterstützer! 🙏"
- Subtitle: "Diese Menschen ermöglichen unsere Touren."
- List of donors (most recent first, paginated 20 per page)

**And** each donor card shows:
- Name: "{firstName} {lastName}" or "Ein anonymer Spender" (if anonymous)
- Amount: "25,00€" or range ("10-50€" for privacy)
- Date: "Dezember 2025"
- Avatar: Profile picture or generic avatar (if anonymous)

**Given** I donated anonymously
**When** I view the donor wall
**Then** my donation appears as "Ein anonymer Spender"
**And** my name is not shown
**And** my profile picture is replaced with a generic avatar (🎁 icon)

**Given** I am not logged in and donate anonymously
**When** I check "Anonym spenden"
**Then** I am asked for my email address (for receipt):
- Email input field (required for tax receipt)
- "Ich benötige keine Spendenbescheinigung" checkbox (optional)

**And** if I provide my email, I receive a thank you email with receipt link
**And** if I don't provide email, the donation is still processed but no receipt is sent

---

### Story 7.4: Thank You Email

As a **user**,
I want to receive a thank you email after donating,
So that I have confirmation and feel appreciated.

**Acceptance Criteria:**

**Given** I successfully donate
**When** the Stripe webhook confirms the payment
**Then** a thank you email is queued:
```typescript
await queueEmail({
  to: user.email,
  subject: 'Vielen Dank für deine Spende! 🙏',
  html: donationThankYouTemplate(user, donation)
});
```

**And** the email arrives within 1 minute
**And** the email contains:
- Greeting: "Liebe/r {firstName},"
- Thank you message: "Herzlichen Dank für deine großzügige Spende von {amount}€!"
- Impact statement: "Mit deiner Unterstützung können wir mehr Touren anbieten und die Community wachsen lassen."
- Tax receipt info: "Deine Spendenbescheinigung ist im Anhang. Du kannst sie auch in deinem Profil herunterladen."
- Link to download receipt: [Spendenbescheinigung herunterladen]
- Recurring info (if applicable): "Deine monatliche Spende wird automatisch am {date} abgebucht."
- Contact info: "Bei Fragen kontaktiere uns: info@urc-falke.de"

**Given** I donated anonymously
**When** the thank you email is sent
**Then** the email still mentions: "Dein Name wird nicht öffentlich angezeigt."

**Given** I set up a recurring donation
**When** the first payment succeeds
**Then** the thank you email includes:
- "Du hast eine monatliche Spende von {amount}€ eingerichtet. Vielen Dank für deine kontinuierliche Unterstützung!"
- "Deine nächste Zahlung erfolgt am {nextPaymentDate}."
- Link to manage subscription: "Spende verwalten"

**Given** a recurring donation renews
**When** the monthly payment succeeds
**Then** a shorter confirmation email is sent:
- Subject: "Deine monatliche Spende wurde abgebucht"
- Message: "Vielen Dank! Deine Spende von {amount}€ wurde erfolgreich abgebucht."
- Link to receipt for this month

---

### Story 7.5: Tax-Deductible Donation Receipts

As a **user**,
I want to download a tax-deductible donation receipt,
So that I can deduct my donation from taxes.

**Acceptance Criteria:**

**Given** I successfully donated
**When** the donation is confirmed
**Then** the backend generates a PDF receipt using jsPDF (or similar):
```typescript
import jsPDF from 'jspdf';

async function generateDonationReceipt(donation, user) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text('Spendenbescheinigung', 20, 20);

  // Organization details
  doc.setFontSize(12);
  doc.text('Union Radsport Club Falkenau e.V.', 20, 40);
  doc.text('Musterstraße 123, 12345 Falkenau', 20, 47);
  doc.text('Steuernummer: 123/456/78901', 20, 54);
  doc.text('Gemeinnütziger Verein', 20, 61);

  // Donor details
  doc.text(`Spender: ${user.firstName} ${user.lastName}`, 20, 80);
  doc.text(`Adresse: ${user.address}`, 20, 87);

  // Donation details
  doc.text(`Spendenbetrag: ${(donation.amountCents / 100).toFixed(2)}€`, 20, 110);
  doc.text(`Datum: ${format(donation.createdAt, 'dd.MM.yyyy')}`, 20, 117);
  doc.text(`Verwendungszweck: Allgemeine Vereinsförderung`, 20, 124);

  // Legal text
  doc.setFontSize(10);
  doc.text('Die Spende ist steuerlich absetzbar gemäß §10b EStG.', 20, 145);
  doc.text('Der Verein ist als gemeinnützig anerkannt.', 20, 152);

  // Signature
  doc.text('Unterschrift: __________________', 20, 200);
  doc.text('Mario Admin, 1. Vorsitzender', 20, 207);

  return doc.output('arraybuffer');
}
```

**And** the PDF is uploaded to storage (Vercel Blob):
```typescript
const pdfBuffer = await generateDonationReceipt(donation, user);
const receiptUrl = await put(`receipts/${donation.id}.pdf`, pdfBuffer, { access: 'private' });

await db.update(donations).set({ receiptUrl }).where(eq(donations.id, donation.id));
```

**Given** I donated
**When** I navigate to `/profil/spenden` (my donations page)
**Then** I see all my past donations with:
- Date (DD.MM.YYYY)
- Amount (e.g., "25,00€")
- Type ("Einmalig" or "Monatlich")
- Status ("Erfolgreich" green badge)
- "Spendenbescheinigung herunterladen" button (PDF icon)

**Given** I click "Spendenbescheinigung herunterladen"
**When** the button is clicked
**Then** a `GET /api/v1/donations/{id}/receipt` request is sent
**And** the backend returns a signed URL to the PDF:
```typescript
const signedUrl = await getSignedUrl(donation.receiptUrl, { expiresIn: 3600 });
return { url: signedUrl };
```

**And** the PDF downloads to my device
**And** the filename is `spendenbescheinigung-{date}-{amount}eur.pdf`

**Given** I donated anonymously without providing my address
**When** I try to generate a receipt
**Then** I see a message: "Für eine Spendenbescheinigung benötigen wir deine Adresse. Bitte aktualisiere dein Profil."
**And** a link to `/profil/bearbeiten` is provided

---

### Story 7.6: Admin Fundraising Dashboard

As an **admin**,
I want to see fundraising statistics and manage donations,
So that I can track financial support and thank donors.

**Acceptance Criteria:**

**Given** I am logged in as admin
**When** I navigate to `/admin/fundraising` (new page)
**Then** I see the "Fundraising Dashboard" with overview cards:
- **Total Donations (All Time)**: Sum of all successful donations
- **This Month**: Sum of donations in current month
- **This Year**: Sum of donations in current year
- **Recurring Donations**: Count of active subscriptions

**And** I see charts:
- **Donations Over Time**: Line chart (last 12 months)
  - X-axis: Month (Jan, Feb, Mar, ...)
  - Y-axis: Total amount (€)
  - Data grouped by month

- **Donation Distribution**: Pie chart
  - One-time vs Recurring donations (by amount)

**Given** I scroll down the dashboard
**When** I see the "Top Donors" section
**Then** I see a leaderboard table with:
- Rank (#1, #2, #3, ...)
- Donor name (or "Anonym" if anonymous)
- Total donated (all-time)
- Number of donations
- Last donation date

**And** the table is sorted by "Total donated" DESC
**And** anonymous donors are shown as "Anonym" but still counted in stats

**Given** I see the "Recent Donations" section
**When** the section loads
**Then** I see a paginated table with columns:
- Date (DD.MM.YYYY HH:mm)
- Donor (name, link to user profile, or "Anonym")
- Amount (€)
- Type (One-time / Recurring)
- Status (Succeeded / Failed)
- Actions (View receipt, Refund)

**And** the table has filters:
- Date range picker (default: last 30 days)
- Donation type (All / One-time / Recurring)
- Status (All / Succeeded / Failed)

**Given** I want to export donations for accounting
**When** I click "Export Donations" button
**Then** a `GET /api/v1/admin/donations/export?startDate={date}&endDate={date}` request is sent
**And** the backend generates a CSV file with columns:
```csv
Datum,Donor Email,Donor Name,Betrag (€),Typ,Status,Stripe Payment Intent ID
23.12.2025 10:30,lisa@example.com,Lisa Müller,25.00,Einmalig,Erfolgreich,pi_abc123
23.12.2025 11:45,gerhard@example.com,Gerhard Schmidt,10.00,Monatlich,Erfolgreich,pi_def456
```

**And** the CSV file is downloaded with filename: `spenden-export-{startDate}-{endDate}.csv`

**Given** I want to thank donors personally
**When** I click on a donor name in the "Top Donors" table
**Then** I am taken to the donor's profile page `/admin/members/{id}`
**And** I see their donation history
**And** I can send them a personal thank you email via "Email senden" button

**Given** a donation fails (e.g., card declined)
**When** I view the "Recent Donations" table
**Then** the failed donation has status "Fehlgeschlagen" (red badge)
**And** I can click "Details" to see the Stripe error message
**And** I can reach out to the donor to help them resolve the issue
