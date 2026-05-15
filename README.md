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
