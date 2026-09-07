---
name: GitHub sync limitations
description: Connector behavior to account for when publishing repository changes from this workspace.
---

The connected GitHub client can authenticate repository reads and blob/file writes, but GitHub Git tree creation returned 404 through both proxy and Octokit, while some content reads under `.github` returned a Cloudflare 403. The normal HTTPS remote also does not inherit the connector credential.

**Why:** A push attempt can appear to fail for history or permissions even when the local branch is healthy; the failure may come from the workspace credential path or connector endpoint support.

**How to apply:** Verify the remote ref before writing, prefer the supported GitHub integration flow, and never force-push or expose credentials in chat. Keep CI/CD files unless branch protection proves they are the actual blocker.