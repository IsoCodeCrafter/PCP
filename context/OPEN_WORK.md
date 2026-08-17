# Open Work

This document tracks active, pending, and scheduled work items for the Project Context Protocol.

---
id: "WORK-0001"
title: "Develop Phase 2 CLI MVP (init and check)"
status: "completed"
priority: "critical"
owner: "PCP Core Contributors"
created_at: "2026-08-17"
updated_at: "2026-08-17"
target_version: "v0.2"
tags: ["cli", "phase-2", "linter"]
dependencies: ["DEC-0002", "ARCH-0002"]
---

## Description
Develop a lightweight CLI tool implementing two essential commands:
1. `pcp init`: Scaffolds the canonical `context/` structure and `manifest.yaml` in a new or existing repository.
2. `pcp check`: Validates `manifest.yaml`, parses YAML Frontmatters across all context Markdown documents, and reports broken cross-reference IDs or missing fields.

## Rationale
Validates Phase 2 of the roadmap and provides the primary feedback loop for developers and CI pipelines.

## Implementation Notes
* Implemented in `cli/` as a Node.js package (`@pcp/cli`).
* Verified against `context/` dogfooding and automated test runs.
* Returns exit code `0` on success and `1` on failure.

---
id: "WORK-0002"
title: "Design Phase 3 MCP Server (Read and Propose)"
status: "completed"
priority: "high"
owner: "PCP Core Contributors"
created_at: "2026-08-17"
updated_at: "2026-08-17"
target_version: "v0.3"
tags: ["mcp", "phase-3", "agent-interface"]
dependencies: ["DEC-0002", "KN-0003", "WORK-0001"]
---

## Description
Build an MCP (Model Context Protocol) server exposing tools for AI agents to discover, read, and propose changes to the repository context.

## Rationale
Enables AI tools (Cursor, Claude Desktop, Antigravity, Windsurf) to natively understand and maintain project context without manual copy-pasting.

## Implementation Notes
* Implemented in `cli/src/mcp/server.js` and executable via `pcp mcp`.
* Follows the strict `READ -> UNDERSTAND -> PROPOSE -> HUMAN APPROVAL -> WRITE` protocol.
* Exposes 5 MCP tools (`pcp_get_manifest`, `pcp_read_component`, `pcp_search_context`, `pcp_check_integrity`, `pcp_propose_entry`) and 6 standard `context://` resources.

---
id: "WORK-0003"
title: "Implement Phase 4 GitHub Action & CI Workflow"
status: "completed"
priority: "medium"
owner: "PCP Core Contributors"
created_at: "2026-08-17"
updated_at: "2026-08-17"
target_version: "v0.4"
tags: ["ci", "github-actions", "phase-4"]
dependencies: ["WORK-0001"]
---

## Description
Provide an official GitHub Action (`.github/workflows/pcp-check.yml`) that automatically runs `pcp check` on pull requests to ensure project context never drifts or breaks schema constraints.

## Rationale
Prevents documentation rot and enforces continuous context compliance on every pull request.
