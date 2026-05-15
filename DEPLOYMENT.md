# Deployment

This project builds to a static Vite output directory. No Node.js server, SSR
runtime, or database process is required in production.

## Build the production bundle

From the repository root:

```bash
npm install
npm run build
```

The build output is written to `dist/`:

- `dist/index.html`
- `dist/assets/*`
- `dist/favicon.svg`

## Validate the built output locally

Serve the compiled files locally with Vite's preview server:

```bash
npm run serve:dist
```

The preview server binds to `0.0.0.0:8080` through `vite.config.ts`.

## Bare file or directory deployment

For a self-hosted static deployment:

1. Run `npm run build`.
2. Copy the contents of `dist/` to the target web root or static directory.
3. Serve that directory with any static web server.

Examples:

### Copy to a web root

```bash
rsync -av --delete dist/ user@host:/var/www/mike-t-hhic-aaaaa/
```

### Serve with Python for a simple local smoke test

```bash
cd dist
python3 -m http.server 8080 --bind 0.0.0.0
```

### Serve with Nginx

Point an Nginx server block at the copied directory:

```nginx
server {
    listen 80;
    server_name _;
    root /var/www/mike-t-hhic-aaaaa;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Deployment notes

- `dist/` is generated output and is intentionally ignored by Git.
- If `VITE_APP_TITLE` should differ by environment, set it before running `npm run build`.
- Because the app has no client-side route segments, a plain static file server is sufficient.
