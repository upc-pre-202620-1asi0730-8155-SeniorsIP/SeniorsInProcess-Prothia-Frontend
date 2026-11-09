# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation improvements for the project release process and changelog maintenance.
- Planned release notes structure for upcoming feature work.

### Changed
- Standardized changelog format to improve traceability and readability across releases.

## [1.0.1] - 2026-11-08

### Added
- Initial frontend release for the Prothia digital rehabilitation platform.
- Role-based access flow for amputee patients, prosthetics technicians, and therapists/physicians.
- Main dashboard with KPIs for patient volume, adherence, and alert status.
- Patient management screens and clinical data entry workflow.
- Prescription editor for therapeutic plans and exercise scheduling.
- Monitoring center for gait alerts, thresholds, and anomaly tracking.
- Workshop module for prosthesis inventory, preventive maintenance, and fleet operations.
- Clinical reporting and analytics views.
- Billing and subscription management flow.
- Communication module for coordination between clinical and workshop teams.
- Patient portal with recovery dashboard, telemetry, exercise tracking, and messaging.
- Mock API integration via JSON Server to support frontend demo scenarios.
- Modular architecture organized by domain, application, infrastructure, and presentation layers.

### Changed
- Frontend implementation aligned with a Domain-Driven Design structure using Vue 3, Vite, Pinia, Vue Router, and PrimeVue.
- Global app shell and navigation standardized for multi-role platform usage.
- Internationalization support added for English and Spanish interfaces.

### Fixed
- Initial project structure stabilized for consistent module organization and navigation flow.

### Removed
- No removals in the initial release.
