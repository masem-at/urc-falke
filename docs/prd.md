---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments:
  - 'docs/analysis/product-brief-urc-falke-2025-12-21.md'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
workflowType: 'prd'
lastStep: 11
completed: true
completedAt: '2025-12-21'
project_name: 'urc-falke'
user_name: 'Mario'
date: '2025-12-21'
---

# Product Requirements Document - urc-falke

**Author:** Mario
**Date:** 2025-12-21

---

## Executive Summary

**urc-falke** ist eine moderne, barrierefreie Community-Plattform für den URC Falke Radclub in Kautzen, Österreich. Die Plattform löst ein kritisches Problem: **450 USV-Hauptvereinsmitglieder wissen nicht, dass sie kostenlos beim Radclub dabei sein können**. Durch QR-Code-basiertes Sofort-Onboarding, einen KI-gestützten Chatbot-Assistenten "Falki" und konsequent barrierefreies Design aktiviert die Plattform diese "unsichtbaren" Mitglieder und verjüngt gleichzeitig den alternden Mitgliederstamm.

Die Plattform vereint Event-Management, Mitgliederkommunikation, Foto- und Tourberichte, Spendenfunktionen und ein vollständiges Admin-Dashboard. Der Kern-Differentiator ist die **Barrierefreiheit als DNA**: Die Plattform funktioniert gleichzeitig für technikaffine 35-Jährige UND 70-Jährige ohne Smartphone-Erfahrung - ohne Kompromisse.

**Launch-Ziel:** Vor der Vorstandsneuwahl im Frühjahr 2025 mit Live-Demo von "Falki" und aktivierten Beta-Testern aus allen Altersgruppen.

### Was macht das besonders

**Technologische Innovation:**
- **"Falki" KI-Chatbot**: Conversational Interface powered by Anthropic Claude API ermöglicht natürliche Interaktion ("Falki, wann ist die nächste Ausfahrt?"). Kein anderer regionaler Radclub bietet KI-gestützte Mitgliederbetreuung.
- **QR-Code Instant-Onboarding**: 3 Klicks, 20 Sekunden, "Willkommen in der Falken-Familie!" - keine Registrierungshürden.
- **Barrierefreiheit als Fundament**: WCAG 2.1 AA konform, vollständige Keyboard-Navigation, Screen-Reader-optimiert, große Touch-Targets (44x44px minimum).

**Strategische Opportunity:**
- **Die "450 Unsichtbare"**: Massive ungenutzte Mitgliederbasis, die von kostenlosem Zugang nichts weiß. Kein Marketing-Problem, sondern Kommunikationsproblem mit technologischer Lösung.
- **Generationsübergreifendes Design**: Simultane Optimierung für Gerhard (67, Traditionalist) und Lisa (38, Spontane) durch adaptive UI und Falki als Equalizer.
- **Perfektes Timing**: Launch zur Vorstandsneuwahl demonstriert Innovation und Aufbruchsstimmung.

**Heritage Mission:**
Fortsetzung von Franz Fraißls (Marios Großvater) Community-Building-Vision im digitalen Zeitalter. Was er mit 11 physischen Vereinsvorständen erreichte, ermöglicht diese Plattform digital: Menschen zusammenbringen, Gemeinschaft stärken, Tradition mit Innovation verbinden.

**Unfair Advantage:**
- Insider-Entwicklung (Mario kennt Community-Dynamik und echte Bedürfnisse)
- Anthropic-Subscription bereits vorhanden (Falki quasi kostenlos)
- Budget gesichert (<200€ Launch-Incentive durch Marios Nebenfirma)
- Vorreiter-Position (keine vergleichbaren digitalen Lösungen bei regionalen Radclubs)

## Projekt-Klassifizierung

**Technischer Typ:** Web Application (Responsive, PWA-ready)
**Domäne:** Allgemein (Community/Sport-Plattform)
**Komplexität:** Niedrig (Standard-Anforderungen, keine regulierten Branchen)
**Projekt-Kontext:** Greenfield - neues Projekt

**Technologie-Stack (abgeleitet aus Brief):**
- Frontend: Modern JavaScript/TypeScript, Responsive Design, WCAG-konform
- Backend: RESTful API mit Claude API Integration für Falki
- Datenbank: Mitglieder, Events, Nachrichten, Spenden
- Zahlungen: Stripe (primär), PayPal (Fallback)
- Hosting: Modern Cloud-Infrastruktur (Vercel/Railway vorgeschlagen im Brief)
- KI: Anthropic Claude API (Haiku für Speed/Cost, Sonnet für Komplexität)

**Besondere Anforderungen:**
- WCAG 2.1 AA Compliance (AAA wo möglich)
- DSGVO-konform (Österreich/EU)
- Deutsch als primäre Sprache
- Fehler-sichere UX (Bestätigungsdialoge bei kritischen Aktionen)

---

## Success Criteria

### User Success

**Gerhard (67) - "Der Traditionalist":**
- ✅ Kann sich **ohne Hilfe** für Event anmelden
- ✅ Nutzt Falki mindestens **1x pro Woche** für Fragen
- ✅ Wiederkehrende Nutzung nach erster Tour
- ✅ Wird **Botschafter** und zeigt anderen älteren Mitgliedern die Plattform
- ✅ Sagt: "Das ist einfacher als WhatsApp!"

**Lisa (38) - "Die Spontane":**
- ✅ Onboarding in **unter 30 Sekunden**
- ✅ Spontane Event-Anmeldung in **unter 5 Klicks**
- ✅ Kommt zu mindestens **3 Touren in ersten 2 Monaten**
- ✅ Bringt andere mit (Referrals)
- ✅ Sagt: "Schneller und einfacher als Instagram!"

**Mario (41) - "Der Visionär" (Admin):**
- ✅ Event-Erstellung in **unter 2 Minuten** (vs. 20 Min vorher = 10x Verbesserung)
- ✅ Live-Überblick über Event-Anmeldungen
- ✅ Wartung **unter 2 Stunden pro Monat**
- ✅ **Neuwahl gewonnen** mit klarer Mehrheit nach erfolgreicher Demo
- ✅ "Großvater Franz wäre stolz" - Legacy-Mission erfüllt

**Peter (52) - "Der Unsichtbare":**
- ✅ Aktivierung durch "Du bist bereits Mitglied!"-Postwurf
- ✅ Erste Tour besucht nach Onboarding
- ✅ Wird **aktives Mitglied** statt "unsichtbar"
- ✅ Mindestens **10 dokumentierte "Ich wusste nicht..."-Stories**

### Business Success

**Launch-Phase (Wochen 1-6: Mitte Jänner - Ende Februar 2025):**
- 🎯 **50+ Neuanmeldungen** aus 450 USV-Mitgliedern
- 🎯 **10%+ Conversion-Rate** der "Unsichtbaren"
- 🎯 **80+ Verlosung-Teilnehmer** (= 80 Onboardings)
- 🎯 **15+ Teilnehmer pro Tour** (Verdopplung des Ist-Stands)
- 🎯 **40%+ probieren Falki aus** (First-Use)

**3-Monats-Ziele (Ende April 2025):**
- 📈 **60-80 aktive Mitglieder** (Mitgliederwachstum)
- 📈 **60%+ nutzen Plattform mind. 1x/Woche** (Engagement-Rate)
- 📈 **ROI: 200€ Investment → 60+ Mitglieder** = **3,33€ Cost per Acquisition**
- 📈 **70%+ Wiederkehr-Rate** nach erster Tour
- 📈 Stabil **2-3 Touren pro Monat** mit hoher Beteiligung

**6-Monats-Vision (Sommer 2025):**
- 🚀 **100+ aktive Mitglieder** (Community-Größe)
- 🚀 **20-25 Teilnehmer pro Tour** (Kapazitätsgrenze erreicht!)
- 🚀 **"Modernster Radclub der Region"** Image etabliert
- 🚀 **Organisches Wachstum** durch Empfehlungen
- 🚀 **Plattform läuft stabil** mit <2h Maintenance/Monat

### Technical Success

**Launch-Readiness (vor Neuwahl - Frühjahr 2025):**
- ✅ **Live Demo funktionsfähig** mit allen Features
- ✅ **Falki beantwortet Fragen live** auf Beamer bei Wahlversammlung
- ✅ **QR-Codes generiert** und bereit für Verteilung
- ✅ **10+ Beta-Tester** erfolgreich onboarded (Gerhard- und Lisa-Typen)
- ✅ **WCAG 2.1 AA validated** (Screen-Reader-Test mit realen Usern)
- ✅ **Erste Spende kann live getätigt werden** (Demo-fähig)

**Post-Launch (6 Wochen):**
- ✅ **Zero kritische Accessibility-Bugs**
- ✅ **Falki hat 200+ Konversationen** erfolgreich geführt
- ✅ **90%+ positive User-Feedback** (Survey nach ersten Touren)
- ✅ **Admin-Effizienz: Event-Management in 2 Min** (10x Verbesserung messbar)
- ✅ **20+ Tour-Reports mit Fotos** veröffentlicht
- ✅ **500€+ in Spenden** gesammelt

**Langfristig (6 Monate):**
- ✅ **Plattform läuft stabil** (<2h Maintenance/Monat)
- ✅ **50-75 Falki-Anfragen pro Woche** (konstante Nutzung)
- ✅ **Sustainability** ohne ständigen Dev-Support
- ✅ **Performance**: Responsive, schnell, zuverlässig

### Measurable Outcomes

**Ultimative Erfolgsindikatoren:**
1. **"Peter-Moment"**: Mindestens **10 dokumentierte** "Ich wusste nicht, dass ich kostenlos dabei sein kann!"-Stories
2. **"Gerhard-Moment"**: Ältere Generation nutzt Plattform **aktiv und selbstständig**, lieber als WhatsApp
3. **"Lisa-Moment"**: Junge Generation sagt **"Schneller und einfacher als Instagram!"**
4. **"Mario-Moment"**: **Großvater Franz wäre stolz** - Legacy-Mission erfüllt, bei Neuwahl gewonnen

**Quantitative KPIs:**
- **User Acquisition**: 50+ in 6 Wochen, 80+ in 3 Monaten
- **Engagement**: 60%+ nutzen mind. 1x/Woche
- **Retention**: 70%+ kommen nach erster Tour wieder
- **Efficiency**: Admin-Zeit 2 Min (10x Verbesserung)
- **ROI**: 3,33€ Cost per Acquisition (außergewöhnlich gut!)

---

## Product Scope

### MVP - Minimum Viable Product

**Scope-Philosophie:** FULL FEATURE SET (Mario's Entscheidung: "Ich weiß dass ihr das extrem schnell schafft")

**Core Features - ALLES im MVP:**

**1. QR-Code Instant-Onboarding** ✅
- 3-Klick-Registrierung
- USV-Mitgliedsnummer-Verifizierung
- "Willkommen in der Falken-Familie!" Bestätigung
- Gründungsmitglied 2.0 Badge
- Automatisch im Lostopf

**2. Event-Management (Full)** ✅
- Admin: Events erstellen/bearbeiten/absagen
- Members: Zu-/Absagen mit einem Klick
- Teilnehmerliste, Schwierigkeitsgrade
- Wetterwarnung-Integration
- iCal Export (Kalender-Sync)

**3. Falki AI-Chatbot (v1)** ✅
- Anthropic Claude API (Haiku für Speed/Cost)
- Function Calling: Events abfragen, An-/Abmelden
- Fehler-sichere Bestätigungen
- Text-Input (primary)
- "Falki, wann ist die nächste Ausfahrt?"

**4. Foto & Tour-Reports** ✅
- Upload von Admins/Members
- Galerie pro Tour mit Alt-Texten (a11y)
- Kurze Text-Reports
- Social Sharing (OG Tags)
- Kommentar-Funktion

**5. Messaging System** ✅
- Member-to-Member Nachrichten
- Admin-Broadcasts
- Email-Fallback
- Bestätigungsdialoge (verhindert falsche Empfänger)
- DSGVO-compliant

**6. Email-Benachrichtigungen (Full)** ✅
- Tour-Ankündigungen
- Erinnerungen (48h vor Event)
- Neue Nachrichten
- Tour-Reports verfügbar
- Wöchentlicher Newsletter (optional)

**7. Spenden-System** ✅
- Stripe Integration (primär)
- PayPal Fallback
- Einmalspende + Recurring
- Transparenz: "Wofür wird's verwendet"
- "Steuerlich absetzbar" Badge
- Danke-Email nach Spende

**8. Admin Dashboard (Full Analytics)** ✅
- Member-Statistiken (Anzahl, Wachstum, Aktivität)
- Event-Statistiken (Zusagen-Rate, beliebte Zeiten)
- Spenden-Tracking
- Engagement-Metriken (Logins, Falki-Nutzung)
- Export für Board-Meetings (CSV/PDF)

**9. Member Profiles (Full)** ✅
- Profilfoto, Bio
- Fahrrad-Info (Typ, Präferenzen)
- Lieblings-Strecken
- Achievements/Badges
- Privacy-Settings

**10. Accessibility Foundation** ✅
- WCAG 2.1 AA minimum (AAA wo möglich)
- Screen-reader optimization (NVDA, JAWS tested)
- Vollständige Keyboard-Navigation
- Hoher Kontrast (4.5:1 minimum)
- Große Touch-Targets (44x44px)
- Adaptive UI (Gerhard vs Lisa Modes)

**11. Dual-Branding & Design System** ✅
- URC Terrakotta/Creme/Dunkelbraun Palette
- USV Footer Integration
- Responsive Design (Mobile-First)
- Dark Mode Option
- Komponenten-Bibliothek

**MVP Success Criteria:**
- Demo-fähig vor Neuwahl (Frühjahr 2025)
- Falki live auf Beamer
- 10+ Beta-Tester erfolgreich
- WCAG 2.1 AA validated

### Growth Features (Post-MVP)

**Phase 2.0 (3-6 Monate nach MVP Launch):**
- **Falki Voice Input (v1.5)**: Browser Speech Recognition, "Hey Falki..." Wake-Word
- **Gamification**: Kilometer-Challenges, Leaderboards, Team-Wettbewerbe
- **Nicht-USV-Mitglieder Handling**: Nach rechtlicher Klärung, eigener Beitrag
- **Multi-Language Support**: Englisch als zweite Sprache

**Phase 2.5 (6-12 Monate nach Launch):**
- **Multi-Verein-Support**: Andere USV-Sektionen (Fußball, Tennis)
- **Advanced Analytics Dashboard**: Predictive Analytics, Trend-Analysen
- **Integration mit Strava/Komoot**: Route-Tracking, Leistungsdaten
- **Native Mobile Apps**: iOS/Android (wenn PWA nicht ausreicht)

### Vision (Future)

**Franz Fraißl Legacy Vision (2+ Jahre):**

**"Das USV-Ökosystem":**
- Zentrale Plattform für **alle 11 Sektionen** des USV Kautzen
- Community-Building Tools für jeden Verein (Fußball, Tennis, etc.)
- Shared Services: Mitgliederverwaltung, Event-Kalender, Spenden
- Cross-Sektion Events und Kooperationen

**Digitales Erbe:**
- "Was mein Großvater mit 11 physischen Vorständen erreichte, ermöglicht diese Plattform digital"
- Community zusammenbringen über Sektionsgrenzen hinweg
- Tradition mit Innovation verbinden

**Regionale Expansion:**
- Vorbild für andere Sportvereine in Niederösterreich
- White-Label-Lösung für andere Radclubs
- Legacy-Story als Verkaufsargument
- "Modernster Sportverein Österreichs"

**Technologische Vision:**
- Falki v3: Multimodal (Voice, Text, Bild)
- Predictive Event-Planung (KI schlägt optimale Termine vor)
- Automatisierte Content-Generierung (Tour-Reports via KI)
- AR/VR Integration für virtuelle Touren

---

## User Journeys

**Journey 1: Gerhard - Der Weg zurück ins digitale Vereinsleben**

Gerhard Huber sitzt Samstagabend am Küchentisch und scrollt durch seine WhatsApp-Gruppen. Die URC-Gruppe ist wieder voll mit Nachrichten - wer kommt zur nächsten Tour? Wann treffen wir uns? Er hat Angst, etwas Wichtiges zu übersehen. Letztes Mal hatte er versehentlich "Allen antworten" geklickt statt nur dem Obmann - peinlich.

Beim nächsten Radwandertag liegt am Treffpunkt ein Flyer aus: "QR-Code scannen - dabei sein!" Sein Enkel zeigt ihm, wie man den Code mit der Kamera scannt. Drei Klicks später erscheint: **"Willkommen in der Falken-Familie, Gerhard!"** mit Konfetti-Animation. Gerhard lächelt - das war einfach.

Am nächsten Morgen öffnet er die Seite. Große, klare Karte: **"Nächste Ausfahrt: Samstag 9:00 Uhr"**. Ein riesiger grüner Button: **"DABEI!"**. Er klickt. Bestätigung. Fertig. "Das habe ich alleine geschafft!", denkt er stolz.

Eine Woche später probiert er etwas Neues. Er tippt unten: "Falki, wer kommt am Samstag mit?" Sekunden später antwortet Falki: "12 Mitglieder haben zugesagt, Gerhard. Lisa, Peter, Franz..." **Der Wow-Moment**: "Ich habe mit der Website gesprochen!"

Drei Monate später ist Gerhard Botschafter. Er zeigt anderen älteren Mitgliedern die Plattform. "Das ist einfacher als WhatsApp!", sagt er immer wieder. Seine Angst vor Technologie ist verschwunden.

**Dieser Journey zeigt Requirements für:**
- QR-Code Instant-Onboarding (3-Klick-Registrierung)
- Große, klare UI-Elemente (44x44px Touch-Targets)
- Fehler-sichere UX (keine versehentlichen Aktionen)
- Falki AI-Chatbot (Natural Language Interface)
- Event-Anzeige mit prominentem "Dabei"-Button
- WCAG 2.1 AA Accessibility (Screen-Reader, Keyboard-Navigation)

---

**Journey 2: Lisa - Von "Was ist URC?" zu Stammgast in 3 Wochen**

Lisa Berger wartet im Auto auf ihre Kinder vor der Schule. WhatsApp-Ping von der USV-Gruppe: "Kostenlos für dich! URC Falke Radclub - QR-Code im Anhang". **"Wait... es gibt einen Radclub?!"** Sie hat keine Ahnung, dass so etwas existiert.

Während sie ihren Kaffee trinkt, scannt sie den Code. 20 Sekunden später: Fertig. **"Ok, das war... einfach?"** Kein langes Formular, keine Bestätigungs-Emails, keine Wartezeit. Abends auf der Couch scrollt sie durch die Events. Fotos von letzten Touren - andere Mitte-30-Jährige! Samstag 9 Uhr passt perfekt in ihren Kalender.

Klick. **"DABEI!"** - Auto-Sync in ihren iPhone-Kalender. **Quick & Easy.**

Freitagabend beim Kochen kommt die Frage: "Falki, wie schnell fahren die morgen?" - "Gemütliches Tempo, Lisa. Durchschnitt 20 km/h, alle Levels willkommen." - **"Perfect!"**

Die erste Tour ist ein Erfolg. Sie lernt Sandra kennen - auch Mama, auch neu in Kautzen. Nach der dritten Tour sind sie Freundinnen. Samstagmorgen ist jetzt "Lisas Zeit" - weg vom Mama-Alltag, fit bleiben, neue Freunde.

Sechs Monate später bringt sie zwei Kolleginnen mit und postet Tour-Fotos auf Instagram: "Best mornings with URC Falke 🚴‍♀️🦅 #modernsterradclub"

**Dieser Journey zeigt Requirements für:**
- Ultra-schnelles Onboarding (<30 Sekunden)
- Mobile-First Responsive Design
- Event-Anmeldung in <5 Klicks
- iPhone Kalender-Integration (iCal Export)
- Falki Quick-Info Queries
- Social Features (Foto-Galerie, Sharing, OG Tags)
- Push-/Email-Benachrichtigungen (48h Erinnerung)

---

**Journey 3: Mario - Von 20 Minuten Chaos zu 2 Minuten Effizienz**

Mario sitzt an seinem Laptop und erstellt das nächste Event. Wie immer: WhatsApp-Nachricht tippen, in drei Gruppen posten, Excel-Liste für Zusagen pflegen, Teilnehmern einzeln antworten. **20 Minuten später** ist er fertig. Es muss einen besseren Weg geben.

Zwei Wochen später ist die Plattform live. Mario loggt sich ins Admin-Dashboard ein. Clean. Übersichtlich. Genau wie er es sich vorgestellt hat.

**"Neue Tour erstellen"** - Formular öffnet sich:
- Datum: Samstag, 23. März, 9:00 Uhr
- Treffpunkt: Sporthaus Kautzen
- Schwierigkeit: Mittel
- Beschreibung: "Frühlingstour durchs Weinviertel, 45km"

Save. **Live.** Der QR-Code wird automatisch generiert. Email-Benachrichtigungen gehen raus. **Fertig in 2 Minuten.**

Innerhalb von 24 Stunden: **12 Anmeldungen**. Mario sieht live, wer zugesagt hat. Dashboard zeigt: "Durchschnittliche Zusagen-Rate: 65%" - wertvolle Insights für Planung.

Bei der Wahlversammlung im Frühjahr ist sein großer Moment. **Live-Demo auf dem Beamer**: "Falki, wie viele Mitglieder sind jetzt aktiv?" - Falki antwortet live vor allen. **Standing Ovation.** Mario wird mit klarer Mehrheit in den Vorstand gewählt.

Sechs Monate später: 85 aktivierte Mitglieder. Platform läuft stabil. Wartung < 2h/Monat. **"Großvater Franz wäre stolz."** Die Legacy-Mission ist erfüllt.

**Dieser Journey zeigt Requirements für:**
- Admin Dashboard mit Full Analytics
- Event-Management (Erstellen/Bearbeiten/Absagen in <2 Min)
- Live-Überblick über Anmeldungen
- Automatische QR-Code-Generierung
- Email-Benachrichtigungen (Auto-Send bei neuem Event)
- Member-Statistiken (Wachstum, Aktivität, Engagement)
- Export-Funktionen (CSV/PDF für Board-Meetings)
- Falki Live-Demo-Capability

---

**Journey 4: Peter - Von "unsichtbar" zu aktivem Mitglied**

Peter Moser öffnet seinen Briefkasten. Zwischen Rechnungen und Werbung: Ein bunter Flyer vom USV Kautzen. **"Du bist bereits Mitglied!"** - Moment, wovon reden die?

Er liest weiter: "Als USV-Mitglied kannst du KOSTENLOS beim URC Falke Radclub mitmachen. Einfach QR-Code scannen!"

**"Wait... kostenlos?!"** Peter zahlt seit 20 Jahren 15€ USV-Beitrag. Er fährt gerne Rad, aber immer alleine. Gesellschaft wäre schön, aber er dachte, das kostet extra.

Abends scannt er den Code mit seinem Handy. Die Seite öffnet sich: **"Willkommen zurück, Peter! Du bist schon lange USV-Mitglied - jetzt auch offiziell Teil der Falken-Familie!"**

Er sieht die nächste Tour: **Sonntag, 10 Uhr, gemütliches Tempo**. Perfekt. Er klickt "Dabei".

Sonntag 10 Uhr am Treffpunkt: 15 Leute, viele Gesichter die er vom Sehen kennt. "Peter! Schön dass du dabei bist!" - Der Obmann begrüßt ihn herzlich. Die Tour macht Spaß. Beim Kaffee danach erzählt er seine Story: **"Ich wusste nicht, dass ich kostenlos dabei sein kann!"**

Drei Monate später ist Peter Stammgast. Er hat 8 Touren gemacht und zwei alte Schulfreunde mitgebracht - auch "Unsichtbare", die jetzt aktiv sind.

**Dieser Journey zeigt Requirements für:**
- USV-Mitgliedsnummer-Verifizierung (automatische Erkennung)
- "Du bist bereits Mitglied!"-Messaging (für 450 Unsichtbare)
- Gründungsmitglied 2.0 Badge (Incentive)
- Multi-Channel Launch (Postwurfsendung, QR-Codes)
- Member-Status-Tracking (USV vs Extern)
- Aktivierungs-Analytics ("Peter-Momente" zählen)

---

### Journey Requirements Summary

Die vier Journeys zeigen die vollständige Bandbreite benötigter Capabilities:

**Onboarding & Zugang:**
- QR-Code Instant-Onboarding (3-Klick, <30 Sek)
- USV-Mitgliedsnummer-Verifizierung
- Gründungsmitglied 2.0 Badge & Verlosung
- Multi-Tier Mitgliedschaft (USV kostenlos vs Extern)

**Event-Management:**
- Admin: Event erstellen/bearbeiten in <2 Min
- User: Event-Anmeldung in <5 Klicks
- Teilnehmerlisten Live-Tracking
- iCal Export (Kalender-Integration)
- Schwierigkeitsgrade (Leicht/Mittel/Schwer)

**Kommunikation:**
- Falki AI-Chatbot (Natural Language Queries)
- Email-Benachrichtigungen (Ankündigungen, Erinnerungen)
- Bestätigungsdialoge (fehler-sichere UX)
- Member-to-Member Messaging
- Admin-Broadcasts

**Accessibility & UX:**
- WCAG 2.1 AA Compliance (AAA wo möglich)
- Große Touch-Targets (44x44px minimum)
- Vollständige Keyboard-Navigation
- Screen-Reader Optimization
- Hoher Kontrast, große Schrift
- Adaptive UI (Gerhard vs Lisa Modes)

**Admin & Analytics:**
- Dashboard mit Full Analytics
- Member-Statistiken (Wachstum, Aktivität)
- Event-Statistiken (Zusagen-Rate, Trends)
- Engagement-Metriken (Logins, Falki-Nutzung)
- Export für Board-Meetings (CSV/PDF)

**Community Features:**
- Foto-Galerie & Tour-Reports
- Social Sharing (OG Tags)
- Member Profiles (Bio, Fahrrad-Info)
- Achievements/Badges
- Privacy-Settings

**Additional Features:**
- Spenden-System (Stripe/PayPal)
- Dual-Branding (URC/USV)
- Dark Mode
- DSGVO-Compliance

---

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. "Falki" - KI-gestützter Conversational Assistant für Sportvereine**

**Was ist neu:**
- Erster regionaler Radclub mit KI-Chatbot für Mitgliederbetreuung
- Natural Language Interface (Anthropic Claude API) für Community-Management
- Function Calling für Event-Queries, Anmeldungen, Teilnehmerlisten
- Fehler-sichere Bestätigungen bei kritischen Aktionen

**Innovation-Pattern:**
Kombiniert Consumer-grade AI (wie ChatGPT) mit domain-specific Functions für Vereinsmanagement. Senkt Einstiegshürde für ältere Generation durch natürliche Sprache statt komplexer UI-Navigation.

**2. Accessibility-First als Kern-Architektur**

**Was ist neu:**
- Barrierefreiheit nicht als Compliance-Checkbox, sondern als **Design-Prinzip von Tag 1**
- Simultane Optimierung für entgegengesetzte Personas (Gerhard 67 vs. Lisa 38) ohne Kompromisse
- Adaptive UI Modi basierend auf User-Präferenzen
- Accessibility + Speed + Modern Design = kein Trade-off

**Innovation-Pattern:**
Widerlegt Annahme dass "accessible" = "langsam" oder "altmodisch" bedeutet. Zeigt dass WCAG 2.1 AA + moderne UX patterns kompatibel sind.

**3. QR-Code Instant-Onboarding für Vereinsmitgliedschaften**

**Was ist neu:**
- 3-Klick-Registrierung (QR scannen → Bestätigen → Dabei)
- Zero-Form-Filling Onboarding
- Sofortige Aktivierung mit Konfetti-Moment
- USV-Mitgliedsnummer-Verifizierung im Hintergrund

**Innovation-Pattern:**
Überträgt E-Commerce "One-Click-Checkout" Prinzip auf Vereinsmitgliedschaften. Reduziert Onboarding von Minuten auf Sekunden.

**4. Generationsübergreifendes Design ohne Kompromisse**

**Was ist neu:**
- Gerhard (67) UND Lisa (38) haben beide optimale Experience
- Keine "Seniorenversion" vs "Normalversion"
- Falki als Equalizer: Ältere nutzen Chat, Jüngere nutzen direkte UI
- Große Touch-Targets + Schnelle Interactions gleichzeitig

**Innovation-Pattern:**
Multi-Modal Design: Verschiedene Interaktionsmuster für selbe Funktionalität. Chat-Interface für Ältere, Direct-UI für Jüngere - beide führen zum gleichen Ziel.

### Market Context & Competitive Landscape

**Regionale Sportvereine (Radclubs):**
- Status Quo: WhatsApp-Gruppen, Excel-Listen, Email-Chaos
- Digitale Lösungen: Kaum vorhanden, meist veraltete Websites
- **urc-falke Position:** First-Mover mit moderner Plattform

**Community-Management-Tools:**
- Existierende Tools: SportMember, Vereinsplaner, etc.
- **urc-falke Differentiator:** KI-Chatbot + Accessibility-First + QR-Onboarding
- Kein anderes Tool kombiniert diese drei Elemente

**AI Chatbots im Vereinswesen:**
- Consumer AI (ChatGPT, Claude) bekannt
- **Sportvereine nutzen AI:** Praktisch nicht existent
- **Opportunity:** Early Adopter Advantage, "modernster Radclub Österreichs"

**Accessibility in Community Platforms:**
- Meiste Plattformen: Accessibility als Afterthought
- **urc-falke:** Accessibility als DNA = USP für ältere Zielgruppe
- Wettbewerbsvorteil in alternden Vereinsstrukturen

### Validation Approach

**Falki AI-Chatbot Validation:**
- **Beta-Test:** 10+ User aus beiden Generationen (Gerhard- und Lisa-Typen)
- **Metrics:** Success-Rate von Queries (Ziel: 90%+), User-Satisfaction (Ziel: 4.5/5)
- **Fallback:** Falls Falki nicht adoptiert wird → Standard UI funktioniert standalone
- **Iterative Improvement:** Claude Prompt-Tuning basierend auf realen Queries

**Accessibility-First Validation:**
- **WCAG 2.1 AA Audit:** Automated Tools (axe, WAVE) + Manual Screen-Reader-Tests (NVDA, JAWS)
- **Real-User Testing:** Gerhard (67) muss **ohne Hilfe** Event anmelden können
- **Metrics:** Zero kritische A11y-Bugs bei Launch, 90%+ positive Feedback von 60+ Usern
- **Standard Compliance:** WCAG ist etablierter Standard, kein Risiko

**QR-Code Onboarding Validation:**
- **User Testing:** Onboarding-Zeit muss <30 Sek sein (Ziel erreicht bei 80%+ der Test-User)
- **Conversion Rate:** 10%+ der 450 USV-Mitglieder müssen aktiviert werden
- **Fallback:** Traditionelles Web-Formular als Alternative (aber QR bleibt primär)

**Generationsübergreifendes Design Validation:**
- **Dual Success Metrics:** Gerhard (67) Satisfaction + Lisa (38) Satisfaction beide >4/5
- **A/B Testing:** Adaptive UI Modi vs. Single UI → Optimal-Mix finden
- **Proof Point:** "Gerhard-Moment" (nutzt lieber als WhatsApp) + "Lisa-Moment" (schneller als Instagram)

### Risk Mitigation

**Risiko 1: Falki Adoption niedrig**
- **Mitigation:** Falki ist **Optional Enhancement**, nicht Required Feature
- UI funktioniert vollständig ohne Falki
- Marketing: Live-Demo bei Neuwahl generiert "Wow-Effekt"
- **Fallback:** Wenn <20% Falki nutzen nach 3 Monaten → Feature bleibt, aber weniger prominent

**Risiko 2: Accessibility-Overhead verzögert Development**
- **Mitigation:** Accessibility von Anfang an = schneller als Retrofitting
- Modern Frameworks (React/Vue) haben A11y-Best-Practices built-in
- Mario hat "komplette Business-Site an einem Nachmittag" Erfahrung mit Claude
- **Reality Check:** WCAG 2.1 AA ist Standard, nicht Rocket Science

**Risiko 3: QR-Code Adoption bei Älteren**
- **Mitigation:** Multi-Channel Launch (Postwurf + Flyer + Radwandertag-Präsenz)
- Hilfe von Familie/Enkeln beim Scannen (z.B. Gerhard)
- **Fallback:** Traditionelles Web-Formular als Alternative
- **Trend:** QR-Codes sind Post-COVID mainstream (Restaurants, Impfzertifikate)

**Risiko 4: Generationsübergreifendes Design scheitert**
- **Mitigation:** Falki als Equalizer löst Problem elegant
- Adaptive UI Modi als Safety Net
- **Validation:** Beta-Tests mit beiden Generationen vor Launch
- **Worst Case:** Separate UI-Modi (nicht optimal, aber funktional)

---

## Web Application Specific Requirements

### Project-Type Overview

**urc-falke** ist eine moderne **Progressive Web Application (PWA-ready)** mit Fokus auf **Smartphone-First Responsive Design** und **Accessibility als Kern-Architektur**. Die Anwendung kombiniert SPA-Patterns für flüssige UX mit SEO-Optimierung für organische Discovery. Als Community-Plattform priorisiert sie **Einfachheit, Geschwindigkeit und Barrierefreiheit** über komplexe Features.

**Architektur-Pattern:** JAMstack / Modern Web App
- **Frontend:** React/Vue SPA mit Component-Based Architecture
- **Backend:** RESTful API + Claude API Integration
- **Deployment:** Static Hosting (Vercel/Netlify) + Serverless Functions
- **Database:** Cloud-hosted (Postgres/MongoDB)

### Browser Matrix & Platform Support

**Desktop Browsers (Primär):**
- Chrome 120+ (letzte 2 Versionen)
- Firefox 120+ (letzte 2 Versionen)
- Safari 17+ (macOS)
- Edge 120+ (Chromium-based)

**Mobile Browsers (KRITISCH - Smartphone-First):**
- iOS Safari 16+ (iPhone/iPad)
- Chrome Mobile 120+ (Android)
- Samsung Internet (Android)

**Accessibility Browser Support:**
- Screen-Reader kompatibel: NVDA, JAWS, VoiceOver
- Keyboard-Navigation: Alle Browser
- High-Contrast Mode: Windows/macOS native support

**Browser Features Required:**
- JavaScript ES2020+
- CSS Grid & Flexbox
- Local Storage / Session Storage
- Camera API (für QR-Code Scanning)
- Geolocation API (optional für Event-Locations)
- Push Notifications API (für Event-Erinnerungen)

**Polyfills:** Minimal, focus on modern browsers

### Responsive Design Strategy

**Mobile-First Approach:**
- Design starts at 320px (small smartphones)
- Primary breakpoints: 320px, 768px, 1024px, 1440px
- Touch-optimized UI (44x44px minimum touch targets)

**Device Categories:**
1. **Smartphone (Primary)** - 320px - 767px
   - Lisa (38) auf iPhone: Hauptnutzung
   - Gerhard (67) auf Samsung: Große Touch-Targets

2. **Tablet** - 768px - 1023px
   - Optional support, weniger kritisch

3. **Desktop** - 1024px+
   - Mario (Admin) auf Laptop: Dashboard-Nutzung
   - Full-width Analytics, Multi-Column Layouts

**Responsive Components:**
- **Navigation:** Hamburger Menu (Mobile) → Full Nav (Desktop)
- **Event-Cards:** Stack (Mobile) → Grid 2-3 Columns (Desktop)
- **Admin-Dashboard:** Single Column (Mobile) → Multi-Panel (Desktop)
- **Falki Chat:** Bottom Sheet (Mobile) → Sidebar (Desktop)

**Images & Media:**
- Responsive Images: `srcset` + WebP format
- Lazy Loading für Tour-Fotos
- Optimized für 3G/4G Networks (Kautzen Land-Gegend)

### Performance Targets

**Core Web Vitals (Google):**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Custom Performance Targets:**
- **Time to Interactive (TTI):** < 3s auf 4G
- **Event-Anmeldung:** < 5 Klicks, < 10s total
- **Admin Event-Erstellung:** < 2 Min (10x Verbesserung!)
- **Falki Response Time:** < 2s (Haiku API Speed)

**Bundle Size Targets:**
- Initial JS Bundle: < 200KB (gzipped)
- Total Page Weight: < 1MB (ohne Bilder)
- Code Splitting: Route-based

**Caching Strategy:**
- Static Assets: Aggressive caching (1 Jahr)
- API Responses: Short-term caching (5-15 Min)
- Offline-First: Service Worker für PWA (Future)

**Performance Monitoring:**
- Lighthouse CI in Deployment Pipeline
- Real User Monitoring (RUM): Google Analytics / Vercel Analytics
- Error Tracking: Sentry / LogRocket

### SEO Strategy

**Primary SEO Goals:**
- **Local Discovery:** "Radclub Kautzen" Google-Suche → urc-falke Rank #1
- **Organic Traffic:** USV-Mitglieder finden Plattform durch Suche
- **Social Sharing:** OG Tags für Instagram/Facebook Posts

**SEO-Critical Pages:**
1. **Homepage:** "URC Falke - Radclub Kautzen"
2. **Events-Übersicht:** Öffentlich sichtbar (nicht Login-gated)
3. **Über Uns:** Club-Geschichte, Franz Fraißl Legacy
4. **Kontakt:** Vorstand, Ansprechpartner

**SEO Technical Implementation:**
- **Meta Tags:** Title, Description, Keywords optimiert
- **Open Graph Tags:** Für Social Media Sharing (Instagram, Facebook)
- **Structured Data:** Schema.org LocalBusiness + SportsActivityLocation markup
- **Sitemap.xml:** Auto-generiert
- **robots.txt:** Erlaubt Crawling von Public Pages

**Content Strategy:**
- **Tour-Reports:** Blog-Style mit SEO-optimierten Titeln
- **Keywords:** "Radclub Kautzen", "Radfahren Weinviertel", "URC Falke"
- **Internal Linking:** Events ↔ Tour-Reports ↔ Member-Stories

**SSR/SSG Consideration:**
- **Option 1:** Next.js SSG für SEO-kritische Pages
- **Option 2:** React SPA + Pre-rendering (Netlify/Vercel)
- **Decision:** Pre-rendering ausreichend für MVP

### Accessibility Level (WCAG Compliance)

**Target Compliance:** WCAG 2.1 Level AA (AAA wo möglich)

**WCAG 2.1 AA Requirements Covered:**

**1. Perceivable:**
- ✅ Text Alternatives (Alt-Texte für alle Bilder)
- ✅ Captions & Audio Descriptions (für zukünftige Videos)
- ✅ Adaptable Content (Responsive, Screen-Reader friendly)
- ✅ Distinguishable (Kontrast 4.5:1 minimum, große Schrift 16px+)

**2. Operable:**
- ✅ Keyboard Accessible (alle Funktionen ohne Maus nutzbar)
- ✅ Enough Time (keine zeitlimitierten Interaktionen)
- ✅ Seizures Prevention (keine blinkenden Elemente)
- ✅ Navigable (Skip Links, klare Fokus-Indikatoren, Breadcrumbs)

**3. Understandable:**
- ✅ Readable (Deutsch, einfache Sprache, Schriftgröße anpassbar)
- ✅ Predictable (konsistente Navigation, keine überraschenden Änderungen)
- ✅ Input Assistance (Fehler-Prävention, klare Fehlermeldungen, Labels)

**4. Robust:**
- ✅ Compatible (Valid HTML5, ARIA Landmarks, Screen-Reader tested)

**Accessibility Testing:**
- **Automated:** axe DevTools, WAVE, Lighthouse Accessibility Audit
- **Manual:** Screen-Reader Tests (NVDA Windows, JAWS, VoiceOver macOS/iOS)
- **Real-User Testing:** Gerhard (67) muss ohne Hilfe navigieren können
- **Continuous:** CI/CD Pipeline mit axe-core Tests

**Adaptive UI Features:**
- **Font-Size Controls:** User kann Schriftgröße anpassen (Gerhard)
- **High-Contrast Mode:** OS-native respektiert (Windows/macOS)
- **Focus Indicators:** Deutlich sichtbar (3px solid, Terrakotta-Farbe)
- **Touch-Target Size:** Minimum 44x44px (WCAG AAA für Touch)

**AAA Aspirations (wo möglich):**
- Kontrast 7:1 für Hauptinhalte (übertrifft AA 4.5:1)
- Größere Touch-Targets 48x48px (übertrifft AA 44x44px)
- Erweiterte Keyboard-Shortcuts (z.B. "N" für nächste Tour)

### Implementation Considerations

**Tech Stack Recommendation (basierend auf Requirements):**
- **Frontend Framework:** React + TypeScript (Type-Safety, große Community)
- **UI Library:** Tailwind CSS + Headless UI (Accessibility built-in)
- **State Management:** Zustand / Redux Toolkit
- **API Client:** Axios / TanStack Query (Caching)
- **Form Handling:** React Hook Form (Performance)
- **Validation:** Zod (Type-safe validation)
- **Testing:** Vitest + React Testing Library + Playwright
- **Accessibility Testing:** axe-core + jest-axe

**Backend Integration:**
- RESTful API (Node.js/Express oder Python/FastAPI)
- Anthropic Claude API für Falki
- Stripe API für Spenden
- Email Service (SendGrid/Mailgun)

**Deployment:**
- **Hosting:** Vercel (optimal für Next.js) oder Netlify
- **Database:** Supabase (Postgres + Realtime) oder MongoDB Atlas
- **CDN:** Cloudflare (Global, DDoS Protection)
- **Monitoring:** Vercel Analytics + Sentry

**Development Workflow:**
- Git Flow: Feature Branches → PR → Main
- CI/CD: GitHub Actions (Tests, Lighthouse, Deploy)
- Preview Deployments: Vercel Preview Links
- Accessibility Gates: axe-core Tests must pass

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** **Experience MVP** mit vollem Feature-Set

Die urc-falke Plattform verfolgt bewusst einen **"Full Experience MVP"** Ansatz statt des klassischen "Minimum Viable Product". Diese Entscheidung basiert auf mehreren strategischen Faktoren:

**Rationale für FULL FEATURE SET:**
1. **AI-Assisted Development Speed:** Moderne Development-Tools (Claude, Copilot) ermöglichen 10x schnellere Umsetzung als traditionelle Entwicklung
2. **Kritisches Launch-Timing:** Live-Demo bei Neuwahl erfordert **überzeugende, vollständige Experience**
3. **Generationsübergreifende UX:** Halbe Features würden User-Journeys brechen - Gerhard (67) braucht vollständige Experience zum Onboarding
4. **First-Mover-Advantage:** Als erster digitaler Radclub in der Region müssen wir Standards setzen, nicht Minimum liefern
5. **Legacy-Mission:** Franz Fraißls Vision erfordert umfassende Lösung, keine halbe digitale Transformation

**Resource Requirements:**
- **Team Size:** 1 Developer (Mario) + Claude AI Assistance
- **Timeline:** 6-8 Wochen bis Launch (Ende Jänner - Mitte Februar 2025)
- **Budget:** <200€ Launch-Incentive (durch Marios Nebenfirma gedeckt)
- **Ongoing:** <2h Maintenance/Monat nach Launch

### MVP Feature Set (Phase 1) - Launch vor Neuwahl

**Core User Journeys Supported:** Alle 4 Journeys (Gerhard, Lisa, Mario, Peter)

**Must-Have Capabilities (11 Features):**

**Onboarding & Mitgliederverwaltung:**
1. **QR-Code Instant-Onboarding** - 3-Klick-Registrierung, <30 Sekunden
   - USV-Mitgliedsnummer-Verifizierung
   - Gründungsmitglied 2.0 Badge
   - Automatischer Lostopf-Eintrag (200€ Verlosung)

2. **Member Profiles** - Profilfoto, Bio, Fahrrad-Info, Achievements
   - Privacy-Settings (DSGVO-compliant)

**Event-Management:**
3. **Event-Management System** - Admin kann Events in <2 Min erstellen
   - User: Event-Anmeldung in <5 Klicks
   - Teilnehmerlisten Live-Tracking
   - Schwierigkeitsgrade (Leicht/Mittel/Schwer)
   - iCal Export für Kalender-Integration

**Kommunikation:**
4. **Falki AI-Chatbot (v1)** - Anthropic Claude API (Haiku für Speed/Cost)
   - Function Calling: Events abfragen, An-/Abmelden
   - Fehler-sichere Bestätigungen bei kritischen Aktionen
   - Natural Language Queries ("Falki, wann ist die nächste Tour?")

5. **Messaging System** - Member-to-Member + Admin-Broadcasts
   - Email-Fallback, DSGVO-compliant

6. **Email-Benachrichtigungen** - Tour-Ankündigungen, Erinnerungen (48h vorher)
   - Neue Nachrichten, Tour-Reports, Wöchentlicher Newsletter (optional)

**Content & Community:**
7. **Foto & Tour-Reports** - Upload, Galerie, Social Sharing
   - Alt-Texte für Accessibility
   - OG Tags für Instagram/Facebook

**Fundraising:**
8. **Spenden-System** - Stripe (primär) + PayPal (Fallback)
   - Einmalspende + Recurring Options
   - Transparenz: "Wofür wird's verwendet"
   - Danke-Email automatisch

**Admin Tools:**
9. **Admin Dashboard** - Full Analytics
   - Member-Statistiken (Anzahl, Wachstum, Aktivität)
   - Event-Statistiken (Zusagen-Rate, Trends)
   - Spenden-Tracking
   - Engagement-Metriken (Logins, Falki-Nutzung)
   - Export (CSV/PDF) für Board-Meetings

**Design & Accessibility:**
10. **Accessibility Foundation** - WCAG 2.1 AA Compliance (AAA wo möglich)
    - Screen-Reader Optimization (NVDA, JAWS tested)
    - Vollständige Keyboard-Navigation
    - Hoher Kontrast (4.5:1 minimum), große Touch-Targets (44x44px)
    - Adaptive UI (Gerhard vs Lisa Modes)

11. **Dual-Branding & Design System** - URC Terrakotta/Creme/Dunkelbraun Palette
    - USV Footer Integration, Responsive Design (Mobile-First)
    - Dark Mode Option

**MVP Success Criteria:**
- ✅ Demo-fähig bei Neuwahl (Live auf Beamer)
- ✅ Falki beantwortet Fragen live vor Publikum
- ✅ 10+ Beta-Tester erfolgreich onboarded (beide Generationen)
- ✅ WCAG 2.1 AA validiert (Automated + Manual Tests)
- ✅ Zero kritische Bugs bei Launch

### Post-MVP Features

**Phase 2.0 (3-6 Monate nach Launch):**

**Falki Enhancements:**
- **Voice Input (v1.5)** - Browser Speech Recognition API
  - "Hey Falki..." Wake-Word
  - Hands-free Interaction (für Radfahrer unterwegs)

**Engagement Features:**
- **Gamification** - Kilometer-Challenges, Leaderboards
  - Team-Wettbewerbe (Gerhard vs Lisa Generation)
  - Achievements & Badges System erweitern

**Membership Expansion:**
- **Nicht-USV-Mitglieder Handling** - Nach rechtlicher Klärung
  - Eigener Mitgliedsbeitrag-System
  - Zwei-Tier-Membership (USV kostenlos vs Extern kostenpflichtig)

**Internationalization:**
- **Multi-Language Support** - Englisch als zweite Sprache
  - Für internationale Gäste bei Touren

**Phase 2.5 (6-12 Monate nach Launch):**

**Platform Expansion:**
- **Multi-Verein-Support** - Andere USV-Sektionen (Fußball, Tennis)
  - Shared Services: Mitgliederverwaltung, Event-Kalender
  - Cross-Sektion Events

**Advanced Analytics:**
- **Predictive Analytics Dashboard** - Trend-Analysen, Forecasting
  - "Welche Touren werden gut besucht?" AI-Predictions
  - Optimale Event-Zeiten vorschlagen

**Integrations:**
- **Strava/Komoot Integration** - Route-Tracking, Leistungsdaten
  - Automatische Tour-Reports via Tracking-Import

**Native Apps (conditional):**
- **iOS/Android Apps** - Nur wenn PWA nicht ausreicht
  - Push Notifications native
  - Camera Integration verbessert

**Phase 3: Franz Fraißl Legacy Vision (2+ Jahre)**

**Das USV-Ökosystem:**
- Zentrale Plattform für **alle 11 Sektionen** des USV Kautzen
- Community-Building Tools für jeden Verein
- Shared Member-Database, Event-Kalender, Spenden-Management
- Cross-Sektion Events und Kooperationen

**Regionale Expansion:**
- White-Label-Lösung für andere Radclubs (Niederösterreich, Österreich-weit)
- "Modernster Sportverein Österreichs" Positioning
- Legacy-Story als Marketing-Asset

**Technologische Vision:**
- **Falki v3:** Multimodal (Voice, Text, Bild-Erkennung)
- **Predictive Event-Planung:** KI schlägt optimale Termine basierend auf Wetter, Verfügbarkeit
- **Automatisierte Content-Generierung:** Tour-Reports via KI aus Fotos + Tracking
- **AR/VR Integration:** Virtuelle Touren für Wintermonate

### Scoping Boundaries - Was ist NICHT im Scope

**Out of Scope für MVP:**
- ❌ Native Mobile Apps (PWA reicht für MVP)
- ❌ Voice Input für Falki (Browser API noch nicht stabil genug)
- ❌ Gamification/Leaderboards (nice-to-have, nicht kritisch)
- ❌ Nicht-USV-Mitglieder (rechtliche Klärung pending)
- ❌ Multi-Language (Deutsch reicht für Start)
- ❌ Strava/Komoot Integration (kann später)
- ❌ Multi-Verein-Support (Single-Tenant MVP)
- ❌ Advanced Predictive Analytics (Basic Analytics reicht)

**Manual Workflows im MVP (können später automatisiert werden):**
- ✅ USV-Mitgliedsnummer-Verifizierung: Manual Admin-Approval im Zweifel (Auto-Check als Primary)
- ✅ Tour-Reports: Manual Upload (keine Auto-Generation aus Tracking)
- ✅ Content-Moderation: Manual Review durch Admins
- ✅ Event-Planung: Manual durch Mario (keine KI-Predictions)

### Risk Mitigation Strategy

**Technical Risks:**

**Risiko 1: Falki Adoption niedrig (<20% nach 3 Monaten)**
- **Probability:** Medium (neue Technologie für Zielgruppe)
- **Impact:** Low (UI funktioniert standalone ohne Falki)
- **Mitigation:** Live-Demo bei Neuwahl generiert "Wow-Effekt", Beta-Tests mit beiden Generationen
- **Contingency:** Falls <20% Adoption → Feature bleibt, wird aber weniger prominent (kein Re-Design nötig)

**Risiko 2: WCAG Compliance verzögert Launch**
- **Probability:** Low (moderne Frameworks haben A11y built-in)
- **Impact:** High (Gerhard Journey bricht ohne Accessibility)
- **Mitigation:** Accessibility von Tag 1, nicht Retrofitting. Automated Tests (axe-core) in CI/CD Pipeline
- **Validation:** Mario hat Erfahrung mit Claude: "komplette Business-Site an einem Nachmittag"

**Risiko 3: QR-Code Onboarding scheitert bei Älteren**
- **Probability:** Low (QR-Codes sind Post-COVID mainstream)
- **Impact:** Medium (verzögert Aktivierung der 450 Unsichtbaren)
- **Mitigation:** Multi-Channel Launch (Postwurf + Flyer + Hilfe von Familie/Enkeln), Traditionelles Web-Formular als Fallback
- **Success Story:** Gerhard Journey zeigt dass Enkel beim ersten Scan hilft

**Market Risks:**

**Risiko 4: 450 USV-Mitglieder interessieren sich nicht für Radclub**
- **Probability:** Medium (unbekannte Zielgruppe)
- **Impact:** High (Business Case bricht)
- **Mitigation:** Product Brief validiert dass Problem existiert ("Ich wusste nicht dass ich kostenlos dabei sein kann!")
- **De-Risking:** 200€ Verlosung als Launch-Incentive → garantiert Initial Signups
- **Validation Metric:** 50+ Neuanmeldungen in 6 Wochen (10%+ Conversion) = Erfolg

**Risiko 5: Launch-Timing verpasst (Neuwahl ohne Live-Demo)**
- **Probability:** Medium (aggressive Timeline)
- **Impact:** High (politisches Momentum verloren)
- **Mitigation:** Full Feature Set ist machbar in 6-8 Wochen mit AI-Assistance. Prio: Demo-fähige Features first (Falki, Event-Management, Onboarding)
- **Contingency:** Falls Verzögerung → Soft-Launch vor Neuwahl mit reduzierten Features, volle Features nachgeliefert

**Resource Risks:**

**Risiko 6: Mario hat weniger Zeit als geplant**
- **Probability:** Medium (Nebenprojekt neben Hauptjob)
- **Impact:** High (Launch verzögert)
- **Mitigation:** AI-Assisted Development (Claude) = 10x Speed-Multiplier. Scope ist klar, keine Scope Creep.
- **Contingency:** Priorisierung nach Demo-Criticality: Falki + Events + Onboarding = Minimum für Live-Demo

**Risiko 7: Budget überschreitet 200€**
- **Probability:** Low (Cloud-Services günstig, Anthropic-Subscription vorhanden)
- **Impact:** Low (Mario's Nebenfirma kann mehr decken wenn nötig)
- **Mitigation:** Tech-Stack optimiert für Low-Cost (Vercel Free Tier, Supabase Free Tier, Claude API günstig)
- **Reality Check:** 200€ ist Launch-Incentive (Verlosung), nicht Dev-Budget

### Development Phases & Milestones

**Phase 1: Foundation (Woche 1-2)**
- Setup: React + TypeScript + Tailwind, Supabase/MongoDB
- Auth System + Member Profiles
- Basic Event-Management (CRUD)
- **Milestone:** Admin kann Event erstellen, User kann sich anmelden

**Phase 2: Core Features (Woche 3-4)**
- QR-Code Onboarding (USV-Verifizierung)
- Email-Benachrichtigungen (Sendgrid/Mailgun)
- Foto & Tour-Reports Upload
- Messaging System (Member-to-Member)
- **Milestone:** End-to-End User Journey funktioniert (QR → Event → Anmeldung → Email)

**Phase 3: Innovation Layer (Woche 5-6)**
- Falki AI-Chatbot Integration (Claude API)
- Function Calling (Events abfragen, An-/Abmelden)
- Admin Dashboard (Analytics, Statistiken)
- Spenden-System (Stripe Integration)
- **Milestone:** Falki beantwortet Fragen, Admin-Dashboard zeigt Metriken

**Phase 4: Polish & Accessibility (Woche 7-8)**
- WCAG 2.1 AA Audit (Automated + Manual)
- Screen-Reader Testing (NVDA, JAWS)
- Performance Optimization (Lighthouse < 2.5s LCP)
- Beta-Testing mit 10+ Usern (beide Generationen)
- Bugfixes & UI-Polish
- **Milestone:** WCAG validated, Zero kritische Bugs, Beta-Feedback incorporated

**Phase 5: Launch (Woche 9)**
- Deployment auf Production (Vercel/Netlify)
- QR-Codes generieren & drucken
- Postwurf an 450 USV-Mitglieder
- Live-Demo bei Neuwahl vorbereiten
- **Milestone:** Live vor Neuwahl, 10+ Beta-Tester aktiv

**Success Metrics für MVP Launch:**
- ✅ **50+ Neuanmeldungen** in 6 Wochen (10%+ Conversion der 450 Unsichtbaren)
- ✅ **Falki hat 200+ Konversationen** erfolgreich geführt (Post-Launch Wochen 1-6)
- ✅ **90%+ positive User-Feedback** (Survey nach ersten Touren)
- ✅ **Zero kritische Accessibility-Bugs** (WCAG 2.1 AA validated)
- ✅ **Admin-Effizienz: Event-Management in 2 Min** (10x Verbesserung messbar)
- ✅ **Mario gewinnt Neuwahl** mit klarer Mehrheit nach erfolgreicher Demo

---

## Functional Requirements

### User Management & Onboarding

**FR1:** User kann via QR-Code in unter 30 Sekunden onboarden (Scan → Bestätigen → Fertig)

**FR2:** User kann USV-Mitgliedsnummer zur Verifizierung eingeben

**FR3:** System kann USV-Mitgliedsnummer automatisch validieren

**FR4:** User kann nach erfolgreichem Onboarding "Gründungsmitglied 2.0" Badge erhalten

**FR5:** User wird automatisch im Verlosungs-Lostopf registriert bei Onboarding

**FR6:** User kann Profilfoto hochladen und Bio-Text eingeben

**FR7:** User kann Fahrrad-Informationen (Typ, Präferenzen) in Profil hinterlegen

**FR8:** User kann Lieblings-Strecken in Profil angeben

**FR9:** User kann Privacy-Settings verwalten (welche Infos öffentlich sichtbar)

**FR10:** User kann Achievements und Badges in Profil anzeigen

**FR11:** Admin kann User-Mitgliedschaft manuell verifizieren bei Unklarheiten

### Event Management

**FR12:** Admin kann Events erstellen mit Datum, Zeit, Treffpunkt, Schwierigkeit, Beschreibung

**FR13:** Admin kann Events bearbeiten und Details aktualisieren

**FR14:** Admin kann Events absagen und Absage-Benachrichtigung senden

**FR15:** User kann sich für Events mit einem Klick anmelden ("Dabei"-Button)

**FR16:** User kann Event-Anmeldung wieder zurückziehen (Absagen)

**FR17:** User kann Liste aller Teilnehmer für ein Event einsehen

**FR18:** User kann Event-Details inklusive Schwierigkeitsgrad (Leicht/Mittel/Schwer) sehen

**FR19:** User kann Events in persönlichen Kalender exportieren (iCal Format)

**FR20:** System kann Live-Tracking der Anmeldungen für Events bereitstellen

**FR21:** System kann Wetterwarnung-Informationen zu Events anzeigen

**FR22:** Admin kann QR-Codes für Events automatisch generieren lassen

### Communication & AI Assistant

**FR23:** User kann mit Falki AI-Chatbot in natürlicher Sprache kommunizieren (Deutsch)

**FR24:** User kann Falki nach nächsten Events fragen

**FR25:** User kann über Falki Event-Anmeldungen durchführen

**FR26:** User kann über Falki Event-Absagen durchführen

**FR27:** User kann Falki nach Teilnehmerlisten für Events fragen

**FR28:** System kann bei kritischen Aktionen (An-/Abmeldung via Falki) Bestätigungsdialoge anzeigen

**FR29:** User kann Nachrichten an andere Mitglieder senden (Member-to-Member Messaging)

**FR30:** Admin kann Broadcast-Nachrichten an alle Mitglieder senden

**FR31:** System kann Nachrichten per Email-Fallback zustellen wenn User nicht eingeloggt

**FR32:** User kann Email-Benachrichtigungen für neue Nachrichten erhalten

### Notifications & Communication

**FR33:** User kann Email-Benachrichtigungen bei neuen Tour-Ankündigungen erhalten

**FR34:** User kann Email-Erinnerung 48h vor Event-Start erhalten

**FR35:** User kann Benachrichtigung erhalten wenn neue Tour-Reports verfügbar sind

**FR36:** User kann optionalen wöchentlichen Newsletter abonnieren

**FR37:** System kann automatische Danke-Email nach Spende senden

### Content & Community

**FR38:** User kann Fotos von Touren hochladen

**FR39:** Admin kann Fotos von Touren hochladen

**FR40:** User kann Tour-Reports mit Text erstellen

**FR41:** User kann Galerie mit Fotos pro Tour durchstöbern

**FR42:** User kann Kommentare zu Tour-Reports hinterlassen

**FR43:** User kann Tour-Reports auf Social Media teilen (Instagram, Facebook)

**FR44:** System kann Alt-Texte für alle hochgeladenen Bilder unterstützen (Accessibility)

**FR45:** System kann Open Graph Tags für Social Sharing generieren

### Fundraising & Donations

**FR46:** User kann Einmalspende via Stripe durchführen

**FR47:** User kann Einmalspende via PayPal durchführen

**FR48:** User kann wiederkehrende Spende (Recurring) einrichten

**FR49:** User kann Informationen sehen zu "Wofür wird Spende verwendet"

**FR50:** User kann "Steuerlich absetzbar" Badge bei Spende sehen

**FR51:** System kann automatische Danke-Email nach erfolgreicher Spende senden

### Administration & Analytics

**FR52:** Admin kann Member-Statistiken einsehen (Anzahl, Wachstum, Aktivität)

**FR53:** Admin kann Event-Statistiken einsehen (Zusagen-Rate, beliebte Zeiten, Trends)

**FR54:** Admin kann Spenden-Tracking einsehen (Gesamtbetrag, Recurring vs Einmal)

**FR55:** Admin kann Engagement-Metriken einsehen (Logins, Falki-Nutzung, Active Users)

**FR56:** Admin kann Statistiken als CSV exportieren für Board-Meetings

**FR57:** Admin kann Statistiken als PDF exportieren für Board-Meetings

**FR58:** Admin kann Live-Überblick über aktuelle Event-Anmeldungen sehen

**FR59:** System kann durchschnittliche Zusagen-Rate über alle Events berechnen

### Accessibility & User Experience

**FR60:** System kann vollständige Keyboard-Navigation unterstützen (alle Funktionen ohne Maus)

**FR61:** System kann Screen-Reader-Kompatibilität bieten (NVDA, JAWS, VoiceOver)

**FR62:** User kann Schriftgröße anpassen (Font-Size Controls)

**FR63:** System kann High-Contrast Mode respektieren (OS-native Einstellungen)

**FR64:** System kann deutliche Fokus-Indikatoren für Keyboard-Navigation anzeigen

**FR65:** System kann Touch-Targets mit mindestens 44x44px Größe bereitstellen

**FR66:** System kann adaptive UI-Modi bereitstellen (optimiert für verschiedene Generationen)

**FR67:** System kann Dark Mode Option unterstützen

### Branding & Multi-Tenant

**FR68:** System kann URC Terrakotta/Creme/Dunkelbraun Farbpalette verwenden

**FR69:** System kann USV Footer-Integration anzeigen

**FR70:** System kann Responsive Design für Mobile-First Devices bereitstellen (320px - 1440px)

**FR71:** System kann Komponenten-Bibliothek für konsistentes Design verwenden

---

## Non-Functional Requirements

### Performance

**NFR-P1:** Page Load Performance
- **LCP (Largest Contentful Paint):** < 2.5 Sekunden auf 4G Verbindung
- **FID (First Input Delay):** < 100 Millisekunden
- **CLS (Cumulative Layout Shift):** < 0.1
- **Time to Interactive (TTI):** < 3 Sekunden auf 4G

**NFR-P2:** User Action Response Times
- Event-Anmeldung: < 10 Sekunden total (< 5 Klicks)
- Admin Event-Erstellung: < 2 Minuten (10x Verbesserung vs. aktuell 20 Min)
- Falki AI Response: < 2 Sekunden (Haiku API Speed)
- Foto-Upload: < 5 Sekunden für Bilder bis 5MB

**NFR-P3:** Bundle Size & Optimization
- Initial JavaScript Bundle: < 200KB (gzipped)
- Total Page Weight: < 1MB (ohne Bilder/Videos)
- Images: WebP Format, Lazy Loading, Responsive srcset

**NFR-P4:** Network Conditions
- Funktionsfähig auf 3G Verbindungen (Kautzen Landgegend)
- Graceful Degradation bei schlechter Netzqualität
- Offline-Fähigkeit für bereits geladene Inhalte (PWA Service Worker - Future)

### Security

**NFR-S1:** Data Encryption
- Alle Daten encrypted at rest (Database Level Encryption)
- Alle Daten encrypted in transit (HTTPS/TLS 1.3 minimum)
- Payment-Daten via Stripe/PayPal (PCI-DSS compliant, kein direktes Card-Handling)

**NFR-S2:** Authentication & Authorization
- Secure Session Management (HttpOnly Cookies, SameSite=Strict)
- Password Requirements: Minimum 8 Zeichen, Mix aus Buchstaben/Zahlen empfohlen
- Admin vs User Role-Based Access Control (RBAC)
- USV-Mitgliedsnummer-Verifizierung vor vollem Zugang

**NFR-S3:** Data Protection
- User kann Privacy-Settings verwalten (FR9)
- Member-to-Member Messages sind privat (nur Sender/Empfänger sichtbar)
- Admin hat Zugriff auf Statistiken, NICHT auf private Nachrichten
- Spenden-Daten werden vertraulich behandelt

**NFR-S4:** Security Best Practices
- Input Validation gegen SQL Injection, XSS, CSRF
- Rate Limiting auf API Endpoints (z.B. Falki max 10 Requests/Minute pro User)
- Secure Headers (Content-Security-Policy, X-Frame-Options, etc.)
- Regular Dependency Updates (npm audit clean)

### Accessibility

**NFR-A1:** WCAG 2.1 Level AA Compliance (MANDATORY)
- Alle Perceivable Guidelines erfüllt (Alt-Texte, Kontrast 4.5:1, große Schrift 16px+)
- Alle Operable Guidelines erfüllt (Keyboard Navigation, keine Zeitlimits, Skip Links)
- Alle Understandable Guidelines erfüllt (Deutsch, einfache Sprache, klare Fehlermeldungen)
- Alle Robust Guidelines erfüllt (Valid HTML5, ARIA Landmarks)

**NFR-A2:** Screen-Reader Compatibility
- Getestet mit NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)
- Alle Formulare haben Labels und ARIA-Beschreibungen
- Live-Regions für dynamische Content-Updates (z.B. Falki Antworten)
- Semantisches HTML (nav, main, aside, header, footer tags)

**NFR-A3:** Keyboard Navigation
- Alle Funktionen ohne Maus nutzbar (Tab, Enter, Escape, Arrow Keys)
- Fokus-Indikatoren deutlich sichtbar (3px solid, Terrakotta-Farbe)
- Keine Keyboard-Traps
- Skip-Links zu Hauptinhalt ("Zum Hauptinhalt springen")

**NFR-A4:** Touch & Motor Accessibility
- Minimum Touch-Target Size: 44x44px (WCAG AAA Aspiration: 48x48px)
- Ausreichender Abstand zwischen interaktiven Elementen (8px minimum)
- Keine Gesten, die Feinmotorik erfordern (z.B. kein Swipe-Only)
- Große Buttons für Gerhard (67) Journey

**NFR-A5:** Visual Accessibility
- Kontrast-Ratio: 4.5:1 minimum für Text (AAA Aspiration: 7:1 für Hauptinhalte)
- High-Contrast Mode Support (respektiert OS-Einstellungen)
- Schriftgröße anpassbar (User kann Font-Size Controls nutzen)
- Keine Information durch Farbe allein (immer zusätzliche Indikatoren)

**NFR-A6:** Accessibility Testing & Validation
- Automated Tests: axe-core in CI/CD Pipeline (0 kritische Issues erlaubt)
- Manual Testing: Gerhard (67) muss ohne Hilfe Event anmelden können
- Lighthouse Accessibility Score: 95+ bei Launch
- Real-User Feedback: 90%+ positive Feedback von 60+ Users

### Integration & APIs

**NFR-I1:** Anthropic Claude API Integration
- Falki nutzt Claude Haiku für Speed/Cost-Optimization
- Fallback zu Sonnet bei komplexen Queries (optional)
- Function Calling für Event-Queries, An-/Abmeldungen
- Error Handling: Graceful Degradation wenn API unavailable (UI funktioniert weiter)

**NFR-I2:** Payment Integration
- Stripe API (Primary): PCI-DSS compliant, keine Card-Daten gespeichert
- PayPal API (Fallback): OAuth Flow, Webhook-basierte Bestätigung
- Einmalspende + Recurring Subscription Support
- Automatic Danke-Email via Webhook

**NFR-I3:** Email Service Integration
- Sendgrid oder Mailgun für Transactional Emails
- Email-Templates: Tour-Ankündigungen, Erinnerungen, Nachrichten
- Bounce Handling und Unsubscribe-Management
- DSGVO-konforme Email-Verarbeitung

**NFR-I4:** Calendar Integration
- iCal Export für Event-Anmeldungen
- Import in Apple Calendar, Google Calendar, Outlook
- Automatische Updates bei Event-Änderungen (optional)

**NFR-I5:** Social Media Integration
- Open Graph Tags für Instagram, Facebook Sharing
- Schema.org Markup (LocalBusiness, SportsActivityLocation)
- Social Share Buttons (keine Tracking-Pixel ohne Consent)

### Reliability & Availability

**NFR-R1:** Uptime & Availability
- Target Uptime: 99.5% (entspricht ~3.6h Downtime/Monat)
- Geplante Wartungsfenster: Nachts (02:00-05:00 CET) mit Ankündigung
- Zero Downtime während Events (Samstag/Sonntag Vormittag kritisch)

**NFR-R2:** Error Handling & Recovery
- Graceful Degradation bei API-Ausfällen (z.B. Falki unavailable → UI weiter nutzbar)
- User-freundliche Fehlermeldungen (keine Stack Traces)
- Automatic Retry für transiente Fehler (z.B. Network Timeouts)
- Admin-Benachrichtigung bei kritischen Fehlern (Email Alert)

**NFR-R3:** Data Backup & Recovery
- Tägliche automatische Database-Backups
- Point-in-Time Recovery möglich (letzten 7 Tage)
- Backup-Storage geografisch getrennt (Disaster Recovery)
- Restore-Test alle 3 Monate

**NFR-R4:** Monitoring & Observability
- Real User Monitoring (RUM): Vercel Analytics oder Google Analytics
- Error Tracking: Sentry oder LogRocket
- Performance Monitoring: Lighthouse CI in Deployment Pipeline
- Admin Dashboard: Live-Status der kritischen Services

**NFR-R5:** Maintenance Overhead
- Target: < 2 Stunden Maintenance pro Monat (Mario's Requirement)
- Automated Deployments (CI/CD via GitHub Actions)
- Automated Tests (verhindert Regressionen)
- Self-Service Admin-Tools (Mario kann Events/Users ohne Code-Changes managen)

### Compliance & Legal

**NFR-C1:** DSGVO Compliance (EU/Österreich)
- User kann eigene Daten einsehen (Data Export)
- User kann eigene Daten löschen (Right to be Forgotten)
- User kann Privacy-Settings verwalten (Consent Management)
- Cookie Consent Banner (nur notwendige Cookies ohne Consent)
- Datenschutzerklärung verfügbar und aktuell

**NFR-C2:** Data Retention & Deletion
- Inaktive Accounts nach 24 Monaten Inaktivität archiviert (mit Vorab-Benachrichtigung)
- Gelöschte User-Daten innerhalb 30 Tage komplett entfernt
- Spenden-Daten: 10 Jahre Aufbewahrung (Steuerliche Anforderungen)
- Logs: 90 Tage Retention für Debugging

**NFR-C3:** Audit & Transparency
- Admin-Aktionen werden geloggt (Who did What When)
- User kann Audit-Log eigener Daten einsehen
- Transparenz bei Spenden: "Wofür wird's verwendet" öffentlich sichtbar

### Scalability

**NFR-SC1:** User Growth Scenarios
- Initial Launch: 50-80 aktive User (MVP Target)
- 6 Monate: 100+ aktive User
- 12 Monate: 150-200 aktive User (bei Success)
- System muss 3x Initial Load ohne Performance-Degradation handhaben

**NFR-SC2:** Concurrent Usage
- Gleichzeitige User bei Event-Anmeldung: 30-50 User
- Falki Concurrent Requests: 10-20 parallele Conversations
- Admin Dashboard: 2-3 Admins gleichzeitig
- Database: Connection Pooling für 100+ concurrent connections

**NFR-SC3:** Data Volume
- Events: ~100 Events pro Jahr
- Fotos: ~1000 Fotos pro Jahr (avg 2MB = 2GB Storage)
- Messages: ~5000 Messages pro Jahr
- Database Growth: < 1GB pro Jahr (moderate Scale)

**NFR-SC4:** Growth Strategy
- Architektur unterstützt Horizontal Scaling (Serverless Functions)
- Database kann vertikal skalieren (Supabase/MongoDB Atlas)
- CDN für Static Assets (Cloudflare)
- Future: Multi-Verein-Support erfordert Multi-Tenancy (Phase 2.5)

---
