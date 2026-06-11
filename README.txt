# AuditAd

AuditAd is a hybrid mobile/web app built with React, TypeScript, Vite, and Capacitor.

# AuditAd Privacy Dashboard

AuditAd is a high-performance local DNS threat optimizer and privacy audit utility for Android. It operates as a local loopback to monitor, audit, and block intrusive telemetry, ad-frames, and cross-app profiling hooks without routing your data to external servers.

## Features & Tabs

### 1. Diagnostic Center
The heartbeat of AuditAd. It displays a live stream of DNS queries intercepted by the local VPN loopback (Port 53).
- **Live Logging**: Real-time visibility into which apps are making network requests and where they are going.
- **Categorization**: Automatically flags queries as Ads, Analytics, Trackers, or Allowed.
- **Latency Tracking**: Measures the overhead of on-device filtration (typically < 1.8ms).
- **Control**: Pause the stream or clear logs at any time to focus on specific app activity.

### 2. Bloom Filter Playground
A deep-dive visualization into AuditAd's zero-knowledge matching engine.
- **Simulation**: Understand how the app checks hostnames against 150,000+ domains in sub-millisecond time.
- **Interactive Math**: Adjust parameters like Bit Array Size (m), Tracked Domains (n), and Hash Functions (k) to see the effect on the False Positive Probability.
- **Memory Map**: A visual 64-bit memory grid showing how trackers "flip bits" in kernel memory.

### 3. Package Auditor Engine
A security scanner for Android Manifest files and installed packages.
- **Manifest Deep Audit**: Paste an `AndroidManifest.xml` and use Gemini AI to generate an instant privacy risk scorecard.
- **Risk Indexing**: Calculates a threat score (0-100) based on excessive permissions and background intent receivers.
- **Package Catalogue**: Browse "installed" apps (like *Shadow Legends: RPG* or *ChatterBox Ultimate*) to see their specific tracking liabilities and Play Store links.

### 4. Account Janitor
A direct deep-linking helper to guide users through complex corporate privacy settings.
- **Interactive Tutorials**: Step-by-step overlays for Google and Meta (Facebook) privacy controls.
- **Direct Routing**: One-click handles to launch native Android settings or web-based privacy centers.
- **Advertising ID Reset**: Guides you to wipe your hardware-bound Advertising ID to neutralize cross-app profiling.

### 5. Private DNS Settings
Educational center for configuring Android's native Private DNS (TLS/HTTPS).
- **Battery Optimization**: Explains why Native DNS is the most efficient defense (0% battery drain compared to local VPN loops).
- **Presets**: Copiable hostnames for AdGuard, Cloudflare, and Quad9.
- **Setup Guide**: Visual walkthrough for Android 9+ system settings.

## Native Enhancements
- **Ghost App Prevention**: A specialized `AppCheckPlugin` uses explicit `PackageManager` flag filters (`MATCH_DEFAULT_ONLY`) to prevent stale metadata from showing uninstalled apps as "installed."
- **Capacitor 6 Bridge**: Seamless integration between the React-based UI and native Android system APIs.

## Build & Deployment

### Prerequisites
- Node.js & npm
- Android Studio & Android SDK

### Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in your environment (for the Auditor Engine).
3. Build web assets and sync to Android:
   ```bash
   npm run build
   npx cap sync android
   ```
4. Run via Android Studio or the CLI:
   ```bash
   npx cap open android
   ```

## License
SPDX-License-Identifier: Apache-2.0


## Project Overview

- **UI:** Built using React 19 + TypeScript with Vite and Tailwind CSS.
- **Mobile shell:** Capacitor Android integration provides the Android wrapper and access to native device features.
- **Android native code:** Custom Capacitor plugin code is implemented in Java under `android/app/src/main/java/...`.
- **Data persistence:** The app currently uses browser `localStorage` for simple state persistence and settings such as theme preference and workspace state.
- **No Kotlin UI layer:** There are no Kotlin source files in this repository; the web UI is rendered from the React app, while Android native integration is Java-based.

## Tech Stack

- `react` + `react-dom`
- `typescript`
- `vite`
- `tailwindcss`
- `@capacitor/core`
- `@capacitor/android`
- `express` and `dotenv` for local development server support

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.
3. Run the app:
   `npm run dev`

## Android

1. Build the web app and sync Capacitor:
   `npm run android`
2. This runs the Capacitor sync and opens the Android project in Android Studio.

## Notes

- The current project does not include a dedicated mobile database layer like SQLite or Room.
- Persistence is handled with `localStorage` for session-specific values and simple settings.
- If you want to add richer device-side storage, you can integrate Capacitor Storage, SQLite, or an Android database solution later.
