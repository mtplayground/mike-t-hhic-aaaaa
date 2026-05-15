import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Issue 1 of 15</p>
        <h1>Calculator scaffold is ready</h1>
        <p className="summary">
          This repository now runs on Vite, React, and TypeScript. Later issues
          will add the calculator engine, UI components, history, and test
          coverage on top of this foundation.
        </p>
      </section>

      <section className="panel" aria-labelledby="tooling-heading">
        <h2 id="tooling-heading">Current tooling</h2>
        <ul className="stack">
          <li>Vite for local development and production builds</li>
          <li>React 19 with a TypeScript entrypoint</li>
          <li>Dev server bound to <code>0.0.0.0:8080</code></li>
        </ul>
      </section>

      <section className="panel" aria-labelledby="next-heading">
        <h2 id="next-heading">Next implementation milestones</h2>
        <ol className="stack ordered">
          <li>Install styling, linting, and formatting conventions</li>
          <li>Define the calculator engine state and actions</li>
          <li>Build the display, keypad, and app shell</li>
        </ol>
      </section>
    </main>
  )
}

export default App
