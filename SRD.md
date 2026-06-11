# AuditAd — Software Requirements Document (SRD)

## 1. Document Purpose
This document describes the current software design, technical stack, user flows, and implementation structure of the AuditAd application based on the existing codebase.

## 2. Product Summary
AuditAd is a hybrid mobile/web privacy dashboard for Android that presents:
- real-time DNS and telemetry visualization,
- bloom-filter-based tracking simulation,
- app/package privacy auditing,
- account privacy setup guidance,
- private DNS configuration help.

The product position is a demo/educational privacy tool with a polished UI, simulated telemetry streams, and an AI-assisted audit layer. The product will also support a free PWA experience for core functionality, while premium Android capabilities remain available in the full native app.

## 3. Objectives
### Primary objectives
1. Show users how privacy and ad/tracker activity can be visualized.
2. Provide a dashboard for DNS/query inspection and tracker blocking concepts.
3. Support AI-powered analysis of Android manifest files for privacy risk.
4. Offer user guidance for managing ad personalization and privacy settings on Android.
5. Provide a free PWA version for broad access, while reserving advanced native functionality for the paid Android app.

### Non-objectives
- This is not yet a full production DNS/VPN firewall.
- It does not currently implement real device-level network interception in the codebase.
- It does not persist a real analytics database or server-side state beyond demo data and local storage.

## 4. Target Users
- Privacy-conscious Android users
- Developers evaluating mobile privacy controls
- Security/UX reviewers who want a demo of tracker analysis and risk scoring

## 5. Core Features
### 5.1 Diagnostics Center
- Simulated on-device DNS loopback visualization
- Query categories: Ads, Tracker, Analytics, Allowed
- Blocked/allowed status simulation
- Live counters and status summary

### 5.2 Bloom Filter Visualizer
- Demonstrates bloom-filter matching logic for tracker domains
- Adjustable parameters:
  - bit array size (m)
  - tracked entities (n)
  - hash function count (k)
- Visual memory map and false-positive rate explanation

### 5.3 App Auditor Engine
- Displays sample apps and package risk metadata
- Allows custom AndroidManifest.xml input
- Sends manifest text to the server for Gemini-based audit analysis
- Produces risk score, summary, liabilities, mitigations, and DNS suggestion

### 5.4 Account Janitor
- Provides privacy setup tasks for Google and Meta
- Simulates tutorial flow and overlay assist
- Stores a reminder timestamp in localStorage for ad-ID reset scheduling

### 5.5 Private DNS Settings Hub
- Educational section for DNS/privacy configuration guidance
- Presents privacy concepts and setup recommendations

### 5.6 PWA / Premium Feature Strategy
- Free PWA tier: keep the core dashboard, visualizers, audit workflow, and privacy guidance available for general use.
- Premium Android tier: unlock full native Android capabilities, real device-specific privacy workflows, and advanced enforcement or integration features.
- UX rule: premium-only features should remain visible in the PWA but appear disabled or gated with an upgrade prompt to encourage the paid Android version.

## 6. Technical Stack
### 7.1 Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide icons
- Framer Motion / motion (used for animated UI transitions)

### 6.2 Mobile Shell
- Capacitor 6
- Capacitor Android runtime
- Android wrapper generated under android/

### 6.3 Backend / API Layer
- Express.js
- Node.js
- dotenv
- Vite middleware in development mode

### 6.4 AI / Intelligence Layer
- Google GenAI SDK (@google/genai)
- Gemini 3.5 Flash model
- JSON-structured responses with schema enforcement

### 6.5 Build / Tooling
- TypeScript compiler
- esbuild for server bundling
- npm scripts for dev/build/android sync/open

## 7. Architecture Overview
The application uses a split architecture:

1. React frontend renders the dashboard and all five main modules.
2. Capacitor packages the UI into an Android app shell.
3. Express server provides development hosting and AI audit endpoints.
4. Gemini API enriches the app auditor with risk analysis.

### High-level flow
1. The user opens the app through the Capacitor Android shell or local dev server.
2. The main dashboard loads the navigation and feature panels.
3. The Diagnostics tab simulates DNS requests and updates counters.
4. The Auditor tab accepts manifest text and sends it to /api/audit.
5. The backend uses Gemini to generate a risk assessment and returns JSON.
6. The UI renders the AI results in the scorecard and mitigation view.

## 8. Application Flow by Module
### 8.1 Startup Flow
- main.tsx mounts the app.
- ThemeProvider initializes the theme from localStorage or system preference.
- App.tsx loads the main DashboardLayout and the default tab.

### 8.2 Diagnostics Flow
- DNSStream generates random DNS-like events.
- It classifies requests as Ads, Tracker, Analytics, or Allowed.
- If the shield is active, blocked categories increment the counters.
- The dashboard summary shows the current metrics.

### 8.3 Bloom Filter Flow
- BloomFilterVisualizer computes hash indices for tracker domains.
- The user can alter the number of bits and hashes.
- The visual grid shows which bits are set and whether a test domain matches a tracker pattern.

### 8.4 Auditor Flow
- AppAuditor shows a catalog of sample apps.
- The user can select a package or paste a manifest.
- Clicking “Deep Audit with Gemini” sends the manifest to the Express endpoint.
- The backend validates the input, calls Gemini, and returns structured JSON.
- The UI displays the AI risk score, flagged liabilities, action plan, and DNS suggestions.

### 8.5 Janitor Flow
- JanitorWorkspace loads predefined privacy tasks.
- The user launches a tutorial overlay and navigates through steps.
- The app stores the last advertising ID reset time in localStorage and triggers reminders.

## 9. Data and State Model
### Client-side state
- React useState for tab selection, counters, query simulation, audit status, manifest text, and tutorial flow.
- localStorage for:
  - theme preference
  - last ad reset timestamp

### Server-side state
- No persistent database is currently implemented.
- The Express server is stateless except for in-memory Gemini client initialization.

## 10. API Design
### Existing endpoints
- GET /api/health
  - Returns simple health status.
- POST /api/audit
  - Accepts JSON with manifestText and appName.
  - Returns a JSON object with riskScore, summary, liabilities, mitigations, and dnsHostnameSuggestion.

## 11. Security and Privacy Notes
- The app is designed as a privacy-education and analysis dashboard.
- It uses local simulation rather than true device-level network blocking in the frontend code.
- The Gemini audit path requires a valid GEMINI_API_KEY and is configured to fail safely if the key is missing.
- The UI explicitly presents the tool as a privacy and DNS optimization concept rather than a full production security firewall.

## 12. Current Implementation Strengths
- Clear modular React component structure
- Strong visual presentation and interactive educational flows
- AI-assisted risk evaluation for Android manifests
- Native Android packaging through Capacitor
- Good separation between UI, UX, and server logic

## 13. Current Limitations
- Most DNS activity is simulated rather than connected to an actual VPN or local DNS service.
- The package catalog is demo data, not live device inventory.
- Native plugin functionality is referenced but the actual runtime behavior is limited in this repository snapshot.
- Persistence is lightweight and local only.

## 14. Recommended Next Steps
1. Replace simulated DNS logs with real device or local network integration.
2. Add real Android package inspection or native plugin data retrieval.
3. Connect the app to persistent storage for user settings and audit history.
4. Add authentication, rate limiting, and stronger backend validation for AI endpoint use.
5. Expand the audit engine with rule-based heuristics alongside Gemini analysis.

## 15. Conclusion
AuditAd is a polished privacy-education hybrid application that combines React, Capacitor, Express, and Gemini AI into a mobile-friendly dashboard. Its main value is the combination of interactive privacy visualization, educational guidance, and AI-assisted manifest auditing.
