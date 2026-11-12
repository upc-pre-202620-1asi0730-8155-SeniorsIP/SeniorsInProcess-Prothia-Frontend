# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No unreleased changes yet.

## [2.0.0] - 2026-11-12

### Added
- Backend API integration for patient lists, patient portal views, prosthesis inventory, maintenance schedules, clinical messages, gait sessions, alerts, prescriptions, clinical reports, billing subscriptions, and option data.
- Firebase Hosting configuration for deployment.

### Changed
- Configured environment-specific API URLs and endpoint paths for local .NET backend development and production hosting.
- Updated billing and monitoring API clients to match backend endpoint and response contracts.

### Fixed
- Corrected patient-list handling, including clearing store errors after successful requests and guarding response mapping.
- Fixed missing patient-list translations and API response mappings for subscriptions, clinical transmissions, and sign-up responses.

### Removed
- No removals in this patch release.

## [1.0.4] - 2026-11-11

### Added
- Release metadata updates for the current project version.
- Documentation alignment to keep the changelog consistent with project evolution.

### Changed
- Bumped the project version to 1.0.4 to reflect the latest release state.
- Refined changelog structure to maintain consistency with Keep a Changelog conventions.

### Fixed
- Corrected version documentation so the release history accurately represents the latest project milestone.
- Improved clarity of release notes for maintainers and stakeholders.

## [1.0.3] - 2026-11-11

### Added
- Planned improvements for onboarding flows and navigation clarity across the Prothia clinical experience.
- Documentation updates to align release preparation and changelog maintenance with project standards.

### Changed
- Refined release-note structure to better reflect the actual product scope and platform evolution.
- Standardized the release history to align the current project version with Keep a Changelog conventions.

### Fixed
- Clarified changelog entries to distinguish between current product features and planned enhancements.
- Improved release documentation readability for the current project version.

## [1.0.2] - 2026-11-11

### Added
- Structured version documentation for the project release lifecycle.
- Improved changelog entries to capture notable project updates in a consistent format.

### Changed
- Reorganized release notes to better follow Keep a Changelog conventions.
- Standardized wording and versioning metadata for maintainability and traceability.

### Fixed
- Corrected changelog clarity and consistency for the current project state.
- Improved release documentation readability for future updates.

### Removed
- No removals in this patch release.

## [1.0.1] - 2026-11-11

### Added
- Initial Prothia frontend release for a digital rehabilitation platform focused on prosthetic care.
- Role-based entry flow for amputee patients, prosthetics technicians, and therapists/physicians.
- Dashboard views with KPIs for patient load, adherence, and monitoring alerts.
- Patient management screens and clinical data capture workflows.
- Prescription editor for therapeutic plans and rehabilitation scheduling.
- Monitoring module for gait alerts, threshold tracking, and anomaly review.
- Workshop module for prosthesis inventory, maintenance, and operational planning.
- Reporting and analytics views for clinical outcomes and team oversight.
- Billing and subscription management flows for the service lifecycle.
- Communication tools for coordination between clinical and technical teams.
- Patient portal with recovery dashboard, telemetry overview, exercise tracking, and messaging.
- Mock API layer powered by JSON Server to support frontend demo scenarios.
- Modular architecture organized by domain, application, infrastructure, and presentation layers.

### Changed
- Frontend implementation aligned to a Domain-Driven Design structure using Vue 3, Vite, Pinia, Vue Router, and PrimeVue.
- Global application shell and navigation standardized for a multi-role clinical workflow.
- Internationalization support added for English and Spanish interfaces.

### Fixed
- Stabilized the initial project structure to keep module organization, routing, and navigation consistent.

### Removed
- No removals in the initial public frontend release.
