# Contributing to Auto AI

Thanks for helping improve Auto AI. Contributions should make vehicle care clearer, safer, or easier to act on.

## Before you start

1. Read [`docs/architecture.md`](docs/architecture.md) to understand the application boundaries.
2. Read [`docs/development.md`](docs/development.md) for local setup and conventions.
3. Search existing issues before opening a new one.
4. For a larger change, open an issue first so the direction is clear.

## Local workflow

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

AI features need `GEMINI_API_KEY`. Keep credentials in `.env.local` locally or Replit Secrets; never commit them.

## Code guidelines

- Keep route composition in `app/`.
- Keep reusable UI in `components/`.
- Keep provider-specific AI code behind `features/ai/api/`.
- Keep pages focused on user interaction and presentation.
- Prefer app-owned types over SDK response types at UI boundaries.
- Reuse the shared theme tokens and styles instead of adding one-off colors.
- Treat loading, empty, error, and success states as part of every user-facing workflow.
- Avoid unrelated refactors in feature pull requests.

## Pull requests

Every pull request should explain:

- What user problem it solves
- What changed and where
- How it was verified
- Whether environment variables or external services are required

Before requesting review, run:

```bash
pnpm typecheck
pnpm build
```

## Commit guidance

Use short, action-oriented commit messages, for example:

```text
Add typed sources to parts search
Improve mobile navigation drawer
Document Gemini configuration
```