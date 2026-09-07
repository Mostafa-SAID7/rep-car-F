# AI features

## Current capabilities

The AI adapter in `features/ai/api/geminiService.ts` exposes app-owned functions for:

- Structured diagnostics with optional image input
- Structured maintenance schedules
- Markdown DIY guides
- Web-grounded parts search
- Maps-grounded nearby shop search
- Streaming maintenance chat

Pages receive domain-shaped values such as `DiagnosticResult`, `MaintenanceScheduleResult`, and `SearchResult`. They do not need to know how Gemini represents grounding chunks or generated content responses.

## Configuration

Set:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

Use `.env.local` for local development and Replit Secrets for the hosted workspace. Do not paste credentials into source files, issues, pull requests, or documentation.

## Failure behavior

- Missing configuration produces a user-facing unavailable state for chat.
- Invalid structured JSON is converted into a feature-level error.
- Pages show an error notification and stop their loading state when a request fails.
- Search sources are normalized into typed `SearchSource` values and may be empty when the provider returns no grounding metadata.

## Production security boundary

The current Vite configuration injects the Gemini key into the browser for the imported prototype. This should be treated as a development-stage boundary, not a final public deployment architecture.

Before exposing the app publicly:

1. Add a server-side API or trusted function.
2. Move Gemini client creation and prompts to that server boundary.
3. Validate request payloads and enforce rate limits.
4. Return only the app-owned DTOs needed by the UI.
5. Remove client-side key injection from `vite.config.ts`.