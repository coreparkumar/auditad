# AuditAd — Product Requirements Document (PRD)

## 1. Product Summary
AuditAd is a privacy-focused mobile and web experience for Android users who want to understand tracker behavior, DNS-related telemetry, and mobile privacy controls in a simple guided interface. The current implementation is a polished demo-style dashboard with a Capacitor-based Android wrapper and a React + TypeScript frontend.

## 2. Current Product State
The codebase currently includes a working UI experience for five major tabs:
- Diagnostics
- Bloom Filter
- Package Auditor
- Account Janitor
- Private DNS Settings

The app is built as a hybrid web app with Android packaging via Capacitor. The UI is implemented in React, while Android-specific functionality is currently limited to package inspection and settings-launching plugins.

## 3. Target Users
- Privacy-conscious Android users
- Developers and security reviewers
- Students and researchers exploring mobile privacy controls

## 4. Product Goals
### Business Goals
1. Deliver a credible privacy dashboard experience for Android users.
2. Educate users about tracker behavior, DNS settings, and privacy controls.
3. Provide a strong foundation for future native privacy enforcement features.

### User Goals
1. Understand which apps may be triggering telemetry or ad-related traffic.
2. Learn how DNS and privacy settings affect tracking exposure.
3. Review app risk information and follow guided privacy actions.

## 5. Core Features in the Current Build
### Implemented
- Responsive dashboard navigation and tab-based layout
- Diagnostics screen with a simulated live DNS stream, counters, and filters
- Bloom Filter visualization for educational explanation of matching logic
- Package auditor experience for manifest-based risk analysis
- Janitor workspace for privacy guidance and reset steps
- Private DNS education content and settings guidance
- Android native plugin support for installed-app inspection and settings navigation

### Partially Implemented
- Android packaging and Capacitor bridge
- Native settings integrations for app and DNS-related flows

## 6. Diagnostic Center Assessment
### Status: Partially Implemented
The Diagnostic Center is present in the app UI and is visible as a dedicated tab, but it is currently a demonstration experience rather than a true Android-level DNS interception feature.

### What is implemented
- The Diagnostics tab is rendered in the app shell in [src/App.tsx](src/App.tsx).
- The main feed UI is implemented in [src/components/DNSStream.tsx](src/components/DNSStream.tsx).
- The screen includes simulated queries, category labels, counters, and a pause/clear interface.

### What is not implemented
- No actual Android VPN or DNS interception service is present in the native codebase.
- There is no real Port 53 capture, loopback listener, or local DNS packet interceptor.
- The “shield” toggle is a UI state only and does not activate a real network filtering engine.
- The Android native layer currently includes package inspection and settings deeplinks in [android/app/src/main/java/com/auditad/app/AppCheckPlugin.java](android/app/src/main/java/com/auditad/app/AppCheckPlugin.java), but no DNS interception plugin or VPN service.

### Conclusion
The feature is implemented visually and as a user experience concept, but it is not yet a functional Android diagnostic engine for real-time DNS monitoring.

## 7. Functional Requirements
1. The app must provide a navigation-based privacy dashboard experience.
2. The Diagnostics view must present a usable network-activity simulation or live data feed.
3. The Package Auditor must accept manifest input and produce a structured privacy assessment.
4. The Janitor view must guide users through privacy controls and ID reset actions.
5. The app must support Android packaging and basic native integrations.

## 8. Non-Functional Requirements
- Performance: the UI should remain responsive on mobile and desktop.
- Maintainability: the frontend should remain modular and component-driven.
- Reliability: AI-backed analysis should fail gracefully when configuration is missing.
- Security: native integrations should avoid over-privileged behavior and explain permissions clearly.

## 9. Risks and Gaps
- The current Diagnostic Center relies on simulated traffic rather than actual device telemetry.
- Real DNS blocking or interception would require deeper native Android work.
- Any production-grade privacy enforcement would need stronger permissions, OS integration, and rigorous testing.

## 10. Recommended Next Steps
1. Decide whether the product should remain a demo/privacy education app or evolve into a real network-monitoring tool.
2. If real monitoring is desired, implement an Android native DNS interception or VPN-based architecture.
3. Replace simulated data with either real device telemetry or clearly labeled demo data.
4. Add explicit product messaging to distinguish “simulated diagnostics” from “real-time system monitoring.”

## 11. Milestones for a Fully Functional Android-Level Diagnostic Engine
The goal is to replace the current mock UI with a real, privacy-preserving Android diagnostic system that captures, classifies, and displays actual DNS activity from the device.

### Milestone 1 — Product and Architecture Definition
**Objective:** Define the technical scope and compliance boundaries for a real diagnostic engine.

**Deliverables**
- Final product definition for real-time DNS diagnostics versus demo-mode.
- Architecture decision for native Android capture approach, including VPN service, local proxy, or other approved mechanism.
- Privacy and compliance review for permissions, data collection, and user consent.
- Clear success criteria for the first production-quality release.

**Exit Criteria**
- Team agrees on the runtime architecture.
- The expected data flow from device network events to UI is documented.
- Legal and policy review is completed for the chosen implementation path.

### Milestone 2 — Native Android Capture Layer
**Objective:** Build the low-level Android component that can observe or intercept DNS traffic in a real environment.

**Deliverables**
- Android foreground service for diagnostics runtime.
- Permission handling and user consent flow.
- Native DNS capture or interception integration.
- Event emission pipeline from Android to the app layer.

**Exit Criteria**
- The app can receive real DNS-related events from the device runtime.
- The system handles permission denials and startup failures gracefully.
- The native layer can run without requiring the UI to simulate data.

### Milestone 3 — Event Processing and Classification Engine
**Objective:** Convert raw observed traffic into meaningful privacy analytics.

**Deliverables**
- DNS request parsing and normalization.
- App attribution using package identity and process context.
- Domain categorization for Ads, Analytics, Trackers, Allowed, and Unknown.
- Latency and throughput metrics for each event.
- Persistent event buffering for recent history and filtering.

**Exit Criteria**
- Real events are transformed into structured records with category and source metadata.
- The engine can distinguish blocked, allowed, and unknown flows.
- The classification pipeline is explainable and testable.

### Milestone 4 — Replace Simulated UI with Real-Time Live Data
**Objective:** Remove dependency on synthetic logs and wire the UI to live engine data.

**Deliverables**
- Diagnostics screen connected to live events from the Android engine.
- Real-time feed, counters, filters, and pause/resume behavior using actual data.
- Visual states for connecting, collecting, and error conditions.
- Clear labeling of whether the experience is live or demo-mode.

**Exit Criteria**
- The Diagnostics tab no longer depends on hardcoded or random sample traffic.
- The UI shows real activity once the native layer is active.
- The app clearly reports connection health and runtime status.

### Milestone 5 — Protection and Enforcement Features
**Objective:** Move beyond monitoring into practical privacy controls.

**Deliverables**
- Allowlist and blocklist management for domains or categories.
- Optional enforcement actions such as redirecting or blocking suspicious requests.
- User-facing controls for enabling or disabling protection modes.
- Safe fallback behavior when enforcement is unsupported or restricted.

**Exit Criteria**
- Users can enable a protection mode and observe its effect on the live feed.
- The system reports whether blocking is active or unavailable.
- The feature remains stable across supported Android versions.

### Milestone 6 — Hardening, Testing, and Beta Release
**Objective:** Validate the engine under real-world conditions and prepare for beta distribution.

**Deliverables**
- Device testing across multiple Android versions and manufacturers.
- Reliability and performance tuning for event volume and battery usage.
- Crash handling, logging, and diagnostics for support.
- Beta release build and user testing feedback loop.

**Exit Criteria**
- The diagnostic engine works reliably on supported devices.
- Battery and performance impact remain acceptable for daily use.
- The beta build is stable enough for real user trials.

## 12. Definition of Done for the Diagnostic Engine
The Diagnostic Center will be considered fully functional only when all of the following are true:
- It uses real device data rather than hardcoded or simulated logs.
- It can observe or intercept DNS-related activity from the Android environment.
- It classifies traffic into meaningful categories and presents live results in the UI.
- It provides users with a visible and reliable status of whether the engine is active.
- It can be tested on a real Android device without requiring mock data.
