# Repository Guidelines

## Project Structure & Module Organization

This repository is currently a minimal profile project. The root contains
`README.md`, which introduces the project; no application source, tests, build
configuration, or static assets have been added yet. Keep root-level files
limited to repository-wide documentation and configuration. As the project
grows, use a predictable layout such as `src/` for implementation, `tests/` for
automated tests, and `assets/` for images or other non-code files. Keep related
modules together and avoid placing generated output under source directories.

## Build, Test, and Development Commands

There are no build, test, lint, or local-run commands configured at present.
Do not document or rely on a command until its supporting configuration is
committed. When adding a toolchain, expose its common workflows through the
package manager or project task runner and record them in `README.md`; for
example, `npm run dev`, `npm test`, and `npm run lint` for a Node-based site.

## Coding Style & Naming Conventions

Follow the conventions established by the language and formatter introduced
with the project. Use 2-space indentation for JSON, YAML, Markdown lists, and
typical web front-end code unless that toolchain specifies otherwise. Prefer
descriptive, lowercase kebab-case filenames (for example,
`profile-card.tsx`); use PascalCase for UI component names and camelCase for
JavaScript or TypeScript variables and functions. Add a formatter and linter
with any substantial codebase, and run them before opening a pull request.

## Testing Guidelines

No test framework or coverage target exists yet. When functionality is added,
place tests in `tests/` or next to the module using the selected framework's
standard convention, such as `profile-card.test.tsx`. Cover user-visible
behavior and regressions, and ensure the full test command passes locally
before submitting changes. Document any required test setup and coverage policy
when the framework is introduced.

## Commit & Pull Request Guidelines

The available history contains only an initial commit, so no established commit
format can be inferred. Write short, imperative commit subjects that describe
one change, such as `Add profile header` or `Document local setup`. Keep commits
focused and avoid mixing refactors with feature work. Pull requests should
explain the change and verification performed, link relevant issues where
applicable, and include screenshots for visual or layout changes. Update
documentation whenever setup, commands, or user-facing behavior changes.
