# mike-t-hhic-aaaaa

Vite + React + TypeScript scaffold for the calculator project, with Tailwind CSS, ESLint, and Prettier configured as the frontend baseline.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`
- `npm run test:unit`
- `npm run test:e2e -- --list`
- `npm test`
- `npm run preview`

## Local development

The Vite dev server is configured to bind to `0.0.0.0:8080`.

## Styling and formatting

- Tailwind CSS is enabled through the Vite plugin and imported from `src/index.css`.
- ESLint runs with TypeScript, React Hooks, and React Refresh rules.
- Prettier is configured with the Tailwind plugin to keep class ordering stable.

## Testing and environment

- Vitest runs component tests in `jsdom` with React Testing Library and shared setup from `src/test/setup.ts`.
- Playwright specs live in `e2e/` and target the Vite app on `http://127.0.0.1:8080`.
- Copy `.env.example` to `.env` to override build-time client configuration such as `VITE_APP_TITLE`.

## Engine model

- Calculator engine types live in `src/engine/types.ts`.
- The shared model defines the current entry, pending expression, pending operator, and the typed action union used by later reducer and UI work.
- Arithmetic evaluation lives in `src/engine/evaluate.ts`, including operator precedence, chained reductions, percentage normalization, and divide-by-zero guards.
- Reducer transitions live in `src/engine/reducer.ts`, with unit coverage for arithmetic sequences, editing flows, and edge cases.
- Successful `equals` transitions now append session history entries inside the reducer state for later recall and inspection.
- The first calculator UI primitive lives in `src/components/Display.tsx`, rendering the current entry and in-progress expression with accessible labels and overflow-safe layout.
- Input controls live in `src/components/Keypad.tsx`, mapping calculator buttons directly to the typed reducer actions for digits, operators, sign toggle, clear, backspace, decimal, and equals.
- `src/App.tsx` now assembles the responsive calculator shell, wiring `Display` and `Keypad` directly to the shared reducer state in a mobile-first layout.
- Keyboard input is normalized through `src/engine/keyboard.ts`, keeping the physical keyboard mapping aligned with the same reducer actions used by the keypad.
