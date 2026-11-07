# Contributing to GRANTLY

Thank you for your interest in contributing to **GRANTLY**! We welcome improvements, bug reports, and documentation enhancements aimed at making higher education scholarships accessible to every student in India.

## Code of Conduct

Please be respectful, collaborative, and considerate of all students, developers, and educators engaging with this platform.

## Development Setup

1. **Prerequisites**: Node.js 20+ and npm 10+.
2. **Clone & Install**:
   ```bash
   git clone https://github.com/AyushB27/Grantly.git
   cd Grantly
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
4. **Run Verification Commands**:
   ```bash
   npm run lint          # Run Oxlint for zero warnings
   npx tsc --noEmit      # Run strict TypeScript compiler verification
   npm test              # Run Vitest unit tests (40 passing tests)
   npm run build         # Verify production bundling
   ```

## Development Guidelines

- **Zero Corporate Jargon**: Use student-centric terms (e.g., "My Applications", "Download Summary", "Closed / Not Selected").
- **Client-Side Sovereignty**: Never introduce network calls that transmit raw student profiles or uploaded document records to external cloud servers.
- **Accessibility**: Ensure all interactive elements declare visible `:focus-visible` styles, correct ARIA attributes, and satisfy WCAG 2.1 AA contrast requirements.
- **Code Quality**: Keep business logic as pure functions in `src/utils/` and state hooks in `src/hooks/`. Avoid circular dependencies and maintain clean TypeScript types.

## Submitting Pull Requests

1. Create a descriptive feature branch (`git checkout -b feature/my-enhancement`).
2. Verify that `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build` all pass cleanly with 0 errors and 0 warnings.
3. Commit with semantic commit messages (`feat:`, `fix:`, `docs:`, `test:`, `perf:`).
4. Open a Pull Request referencing any relevant issues.
