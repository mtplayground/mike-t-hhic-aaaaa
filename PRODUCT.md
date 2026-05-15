# Product Snapshot

## What this is

`mike-t-hhic-aaaaa` is a single-page calculator web app built with Vite, React,
and TypeScript. It ships as a static frontend bundle and can be deployed to any
basic static file host.

## What it does

- Evaluates addition, subtraction, multiplication, and division with operator
  precedence.
- Supports chained calculations, decimal input, sign toggle, clear, and
  backspace.
- Accepts both on-screen keypad input and physical keyboard input.
- Records successful calculations in session history and lets users recall a
  prior result into the display.
- Surfaces divide-by-zero errors with explicit recovery guidance.
- Shows overflow guidance for long values instead of silently clipping context.

## Current UX contract

- Mobile-first calculator layout with a larger two-panel shell on desktop.
- Display, keypad, keyboard handling, and history all share one reducer-driven
  engine state.
- Buttons use descriptive accessible names such as `add operator` and `divide operator`.
- Error states are announced through live-region semantics.
- Focus order follows DOM order through the keypad controls.

## Architecture

- `src/engine/`: pure calculator domain logic.
  Includes typed state/actions, expression evaluation, reducer transitions, and
  keyboard-to-action mapping.
- `src/components/`: presentational calculator pieces.
  `Display`, `Keypad`, and `HistoryPanel` are the main UI primitives.
- `src/App.tsx`: app shell that wires the reducer to the UI.
- `e2e/`: Playwright coverage for key user flows.

## Conventions

- Keep calculator behavior in the engine layer; UI components should dispatch
  typed actions instead of duplicating logic.
- Prefer accessible selectors and labels because both unit and E2E tests depend
  on them.
- Production output is generated into `dist/` and is not committed.

## Deployment model

- Build with `npm run build`.
- Preview the compiled bundle with `npm run serve:dist` on `0.0.0.0:8080`.
- Deploy by copying `dist/` to a static web root; no backend runtime is
  required.
