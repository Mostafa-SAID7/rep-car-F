# Auto AI

> A focused vehicle-care workspace for understanding problems, planning maintenance, and finding the next best repair step.

Auto AI brings the most common car-care decisions into one calm, guided interface. Drivers can describe a problem, generate a maintenance schedule, find DIY guidance, search for parts, and discover nearby shops without jumping between disconnected tools.

## What it does

- **AI diagnostics** — describe a symptom and optionally attach a photo for a structured report
- **Maintenance schedules** — generate a mileage-based plan for a specific vehicle
- **DIY guides** — get step-by-step repair and maintenance guidance with safety notes
- **Parts finder** — search the web for current parts information and purchasing sources
- **Shop finder** — search nearby repair shops and parts stores using location context
- **Profile workspace** — save local driver and vehicle preferences for this browser
- **AI assistant** — ask follow-up car-care questions in a persistent chat panel

## Product focus

Auto AI is designed around one simple outcome: **help a driver move from uncertainty to a clear, safer next step**.

The interface keeps each workflow focused, returns structured results where possible, and uses shared navigation, theme, notifications, and responsive layout primitives so the experience stays consistent as the product grows.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- Google Gemini via `@google/genai`
- pnpm

## Run locally

### Prerequisites

- Node.js 20+
- pnpm 10+
- A Gemini API key for AI-powered workflows

### Setup

```bash
pnpm install
```

Create `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env.local` or expose an API key in an issue, pull request, or chat message. In Replit, store the key in Secrets instead of a file.

Start the development server:

```bash
pnpm dev
```

Open the Vite preview at `http://localhost:5000`.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite development server |
| `pnpm typecheck` | Run TypeScript without emitting files |
| `pnpm build` | Create a production build |
| `pnpm preview` | Serve the production build locally |

## Project map

```text
app/                         Route and navigation composition
components/                  Shared layout and UI components
context/                     Cross-cutting React providers
features/ai/api/             Gemini adapter and app-owned AI contracts
pages/                       Route-level screens
services/                    Compatibility entry points for integrations
docs/                        Architecture and contributor documentation
.github/                     CI, issue templates, and repository automation
```

Read the documentation hub in [`docs/README.md`](docs/README.md) for the architecture, development conventions, and AI integration notes.

## AI and deployment note

The current Vite setup injects `GEMINI_API_KEY` into the browser bundle so the imported prototype can call Gemini directly. That is convenient for local development, but it is not the preferred security boundary for a public production application.

Before a public launch, move Gemini calls behind a server-side API or trusted backend function. See [`docs/ai-features.md`](docs/ai-features.md) for the current behavior and migration boundary.

## Contributing

Keep changes focused on the driver outcome, preserve the existing React/Vite stack, and run both `pnpm typecheck` and `pnpm build` before opening a pull request. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

No license has been selected for this repository yet. Until one is added, the source should be treated as all rights reserved.