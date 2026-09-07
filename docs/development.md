# Development guide

## Requirements

- Node.js 20 or newer
- pnpm 10 or newer
- Gemini API key for AI workflows

## First setup

```bash
pnpm install
cp .env.example .env.local
```

Set `GEMINI_API_KEY` in `.env.local`, then start the app:

```bash
pnpm dev
```

The Vite server listens on port `5000`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | For AI features | Key used by the current Gemini adapter |

Do not commit local environment files. On Replit, use the workspace Secrets interface.

## Verification

Run these before opening a pull request:

```bash
pnpm typecheck
pnpm build
```

Use `pnpm preview` to inspect the production bundle locally.

## UI conventions

- Use the shared tokens in `index.css` and class recipes in `styles.ts`.
- Prefer responsive-first layouts with a usable 320px minimum width.
- Use the shared `Card`, `Button`, `Input`, and `PageHeader` components before creating one-off equivalents.
- Every async workflow needs a clear loading state, empty state, and error notification.
- Keep text concise and action-oriented. The primary screen question should be obvious without reading every card.
- Use semantic headings and labels for form controls.

## Integrations

The imported project currently calls Gemini from the browser through the Vite environment bridge. This keeps the prototype simple but means production hardening should move provider calls to a trusted server boundary. See [`ai-features.md`](ai-features.md).