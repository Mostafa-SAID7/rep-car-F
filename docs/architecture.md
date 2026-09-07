# Architecture

## Design goal

Auto AI is organized around a thin application shell, route-level screens, reusable UI, and isolated provider integrations. The goal is to make a new vehicle-care workflow additive instead of requiring edits across unrelated parts of the app.

## Application layers

```text
index.tsx
  └── App
      ├── NotificationProvider
      ├── HashRouter
      └── Layout
          ├── Sidebar
          ├── header and theme state
          ├── AppRoutes
          └── cross-cutting widgets
```

### `app/`

Owns application composition:

- `app/routes.tsx` is the single route composition point.
- `app/navigation.tsx` is the source of truth for workspace navigation, page labels, and dashboard tool metadata.

When adding a workspace destination, update the navigation registry and route composition together.

### `pages/`

Owns route-level screens. Pages coordinate form state, user interaction, loading states, and feature-specific rendering. They should not construct provider SDK clients or parse provider response metadata.

### `components/`

Owns reusable presentation and shell components such as cards, buttons, inputs, the sidebar, page headers, notifications, and the chatbot surface.

### `features/ai/api/`

Owns the Gemini integration. This is the provider boundary:

- It creates Gemini clients and chat sessions.
- It builds provider prompts and schemas.
- It parses JSON responses.
- It converts grounding metadata into app-owned `SearchSource` values.
- It returns domain-shaped results to pages.

UI code should import from this boundary rather than from `@google/genai`.

### `types.ts`

Contains contracts shared between feature adapters and UI. Provider-specific SDK types should not leak into these contracts.

### `services/`

Contains compatibility entry points for older integrations. New feature code should use the relevant feature boundary instead of adding more generic service modules.

## Route ownership

| Route | Screen | Main responsibility |
| --- | --- | --- |
| `/` | Dashboard | Orient the driver and link to vehicle-care tools |
| `/diagnostics` | Diagnostics | Collect symptoms and display a structured AI report |
| `/schedule` | Maintenance | Collect vehicle details and display a mileage schedule |
| `/guides` | DIY Guides | Generate and render a safety-aware guide |
| `/parts` | Find Parts | Search for parts and show web sources |
| `/shops` | Find Shops | Use location context to find nearby shops |
| `/profile` | Profile | Save local driver and vehicle preferences |

## Cross-cutting behavior

- Theme preference is persisted under `auto-ai-theme`.
- Profile preferences are persisted under `auto-ai-profile`.
- Notifications are exposed through `NotificationContext`.
- The mobile navigation drawer locks body scrolling and closes on Escape or backdrop click.
- AI loading and error states are handled at the route level while provider parsing remains in the AI adapter.

## Adding a new feature

1. Add the route-level screen in `pages/`.
2. Add the route in `app/routes.tsx`.
3. Add navigation metadata in `app/navigation.tsx` if it belongs in the workspace.
4. Add or extend an app-owned type in `types.ts`.
5. Add provider calls and response mapping under the appropriate `features/*/api/` boundary.
6. Keep loading, empty, error, and success states visible.
7. Run `pnpm typecheck` and `pnpm build`.