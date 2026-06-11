# AuditAd — Product Requirements Document (PRD)

## 1. Product Vision
AuditAd is a privacy-focused mobile dashboard that helps users understand, visualize, and manage digital tracking, DNS-related telemetry, and Android privacy controls in a simple, guided experience.

## 2. Problem Statement
Modern Android apps often collect telemetry, perform ad personalization, and trigger background network activity. Users need a clear, educational view of what is happening and how to reduce risk, but many privacy tools are too technical or too opaque.

AuditAd addresses this by combining:
- easy-to-read privacy insights,
- visual explanations of tracker behavior,
- AI-based audit support for manifest analysis,
- practical privacy setup guidance.

To support broad access while preserving premium value, the product will offer a free PWA experience for core privacy education and a paid Android version for deeper native capabilities.

## 3. Target Audience
- Privacy-conscious Android users
- Developers and security reviewers
- Students and researchers interested in mobile data privacy

## 4. Product Goals
### Business / Product Goals
1. Demonstrate a polished privacy dashboard experience for Android users.
2. Provide educational content around tracking, DNS, and data minimization.
3. Reduce the barrier to understanding app-level privacy risks.
4. Launch a free PWA tier to drive adoption and awareness.
5. Offer a premium Android version for users who want the full native experience.

### User Goals
1. See the kinds of telemetry and trackers that apps may use.
2. Learn how privacy controls and DNS settings affect behavior.
3. Audit manifests and app risk profiles quickly.
4. Follow guided steps for ad personalization and ID reset controls.

## 5. Core User Needs
- Clear visualization of privacy and telemetry patterns
- Actionable and understandable security recommendations
- Simple progress through privacy-related tasks
- Confidence that the app is local, educational, and user-controlled

## 6. Features Required
### Free PWA Tier (Basic / Free)
- Dashboard overview of tracker activity and privacy metrics
- DNS stream visualization and category filtering
- Bloom-filter explanation of tracker detection logic
- Manifest auditing interface with Gemini-backed risk analysis
- Janitor-style privacy guidance and reset reminders
- Dark/light theme support
- Responsive PWA installation and mobile web access

### Premium Android Tier (Paid / Full Version)
- Full native Android app download from Play Store or direct distribution
- Real Android package inspection and device-specific privacy analysis
- Native OS integrations for settings, package management, and deep-link actions
- Advanced privacy controls and stronger enforcement workflows
- Full access to protected modules that are visible but disabled in the PWA
- Optional premium analytics and saved audit history

### Should-Have
- Native Android integration through Capacitor
- Better real data integration for package inspection
- Export/shareable audit summaries
- More precise threat scoring and recommendation logic

### Nice-to-Have
- Persistent audit history
- Real network interception or DNS bridge integration
- Device-specific package inventory
- User accounts or cloud sync for saved privacy reports

## 7. User Experience Requirements
- The UI should feel fast, modern, and mobile-friendly.
- Each tab must have a clear purpose and educational description.
- The app should support both touch and desktop interactions.
- The onboarding and guidance flows should remain understandable to non-experts.
- The PWA must present a clear free-to-use experience with premium upgrade prompts.
- Premium-only features should remain visible in the PWA but appear disabled or gated with upgrade messaging.
- The Android app should provide a seamless path to install or unlock the full feature set.

## 8. Functional Requirements
1. The app must render a main navigation dashboard with tab-based sections.
2. The diagnostics view must simulate or represent DNS/query activity in a usable interface.
3. The auditor view must accept user-provided Android manifest text.
4. The backend must return a risk analysis result in structured JSON.
5. The janitor view must provide privacy tasks and reset guidance.
6. The app must persist basic preferences such as theme and reset reminder state.
7. The PWA must provide a free core experience with visible premium features that are disabled or locked.
8. The premium Android version must unlock the advanced native/privacy modules and provide an upgrade path from the PWA.

## 9. Non-Functional Requirements
- Performance: the dashboard should feel responsive on Android and desktop.
- Reliability: the Gemini audit endpoint should fail gracefully when the API key is missing.
- Maintainability: the app should remain modular and component-based.
- Security: the AI integration must avoid exposing sensitive input without proper handling.

## 10. Success Metrics
- Users understand the app’s privacy concepts quickly.
- The audit workflow is usable and understandable for non-expert users.
- The app presents a credible and polished privacy dashboard experience.
- The feature set is extensible for future production-grade privacy controls.
- Free PWA usage converts a meaningful share of users into Android premium interest.
- Premium users value the native Android experience enough to download or upgrade.

## 11. Risks and Constraints
- The current implementation relies partly on simulated content instead of real device telemetry.
- Real-world privacy enforcement may require stronger native integration.
- Gemini API availability and configuration are required for the AI audit feature.

## 12. Release Scope
Current release scope focuses on:
- demonstration-quality privacy dashboard experience,
- AI-assisted manifest auditing,
- interactive educational modules,
- Android packaging readiness,
- a staged PWA-to-premium Android upgrade model.

## 13. Future Roadmap
- Add real app/package scanning
- Integrate actual DNS filtering or local network monitoring
- Improve analytics and persistence
- Add stronger privacy recommendations and compliance reporting
