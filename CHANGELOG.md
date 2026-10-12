# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/).

## [4.6.2] - 2026-10-02
### Fixed
- Preloader stutter on low-end Android devices (#2841)
- Phone frame height on captures taller than the viewport (#2833)

## [4.6.0] - 2026-09-11
### Added
- Mobile wall layout with two static columns (#2790)
- `Cache-Control` rules in the bundled `.htaccess` (#2776)
### Changed
- Intro curtain now animates `transform` instead of `clip-path` (#2781)

## [4.5.0] - 2026-07-23
### Added
- Per-project tabs: Overview, Screens, Engineering, Design (#2702)
- "Next project" link at the end of each case study (#2698)

## [4.4.1] - 2026-06-04
### Fixed
- Lenis scroll restoration after route change (#2655)

## [4.4.0] - 2026-05-12
### Added
- Cursor-following preview on the project index (#2610)

## [4.0.0] - 2026-01-20
### Breaking
- Migrated to React 19 and Vite 6
- `projects.json` replaced by a typed `src/data.ts`
### Added
- Reduced-motion toggle in the footer

## [3.8.0] - 2025-09-30
### Added
- Device frames for desktop and mobile captures

## [3.0.0] - 2025-03-18
### Breaking
- Framer Motion replaces GSAP as the default motion engine

## [2.0.0] - 2024-06-07
### Added
- Case-study routes (`/projeto/:id`)

## [1.0.0] - 2023-02-14
- Initial public release
