# Changelog

All notable changes to the **Project Context Protocol (PCP)** repository and the `@craftsolutions/pcp` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.2] - 2026-09-08

### Added
- **Entry Management & Apply Engine (`cli/src/core/entry.js`)**:
  - Incremental, collision-free ID allocation (`max_id + 1`).
  - RFC-0001 compliant frontmatter block generator with ISO 8601 timestamps and tags.
  - Automatic rollback on validation error (reverts file write if appended entry causes broken references or schema invalidity).
  - New CLI command: `pcp add <component> --title "..." --content "..." [--status ...] [--tags ...] [--deps ...] [--file ...]`.
  - New MCP Tool: `pcp_apply_entry` enabling AI agents to append validated entries under explicit human approval.
  - Enhanced `pcp_propose_entry` MCP tool with optional `apply: boolean` execution parameter.
- **Normative JSON Schemas**:
  - `docs/schemas/manifest.schema.json`: Strict schema for `context/manifest.yaml`.
  - `docs/schemas/entry.schema.json`: Strict schema for RFC-0001 frontmatter entries.
- **Resilient Markdown Parser State Machine (`cli/src/core/parser.js`)**:
  - Lookahead state tracking to prevent false positives when code blocks (```` ``` ```` or `~~~`) contain triple-hyphen sequences.
  - Resilient handling of Markdown horizontal rules (`---`) without terminating entry streams prematurely.
- **Automated Native Test Suite (`cli/test/`)**:
  - Zero-external-dependency unit and integration testing via `node:test` and `node:assert`.
  - Comprehensive coverage for entry creation, parser resilience, validator integrity, and version consistency.
  - Template consistency & zero-drift test (`cli/test/templates.test.js`) guaranteeing byte-for-byte synchronization between `reference/context-template/` and CLI bundled templates.
- **Workspace Architecture**:
  - Monorepo npm workspaces configured in root `package.json` (`workspaces: ["cli"]`).
  - Dynamic single-source-of-truth versioning utility (`cli/src/utils/version.js`).
- **Proven Real-World Integration**:
  - Verified end-to-end consumer workflow in production-grade project (`servis-planer-web`) across `Discover ➔ Read ➔ Search ➔ Propose ➔ Apply ➔ Validate`.

### Changed
- **SSOT Manifest Harmonization**:
  - Removed derived state fields (`count`, `active_items`) from `manifest.yaml` in accordance with SSOT principles (`manifest.yaml` acts solely as Metadata + Component Router).
- **PCP v0.1 Specification (`docs/SPECIFICATION.md`)**:
  - Formally codified Section 6.0 Canonical Entry Point (`manifest.yaml`).
  - Added normative requirements `REQ-007` (Manifest Requirement) and `REQ-008` (Manifest Integrity).
- **Core Scope Freeze**:
  - Finalized normative specification and MCP contracts for v0.1 release candidate.

---

## [0.1.1] - 2026-09-08

### Added
- **NPM Distribution**:
  - Published `@craftsolutions/pcp` on npm registry with executable binaries `pcp` and `pcp-cli`.
  - Bundled standalone context templates into npm package files.
  - Direct execution support via `npx @craftsolutions/pcp init`.
- **Docker Validation**:
  - Added `Dockerfile` for automated containerized MCP validation and registry audits.
- **Documentation**:
  - Added Turkish guide (`docs/GUIDE_TR.md`) and English conceptual explanation (`docs/PCP_EXPLAINED.md`).
  - Updated `README.md` with CI, License, MCP, and Node.js badges.

---

## [0.1.0] - 2026-09-08

### Added
- **Core Specification & Concept**:
  - Initial draft of PCP v0.1 Specification (`docs/SPECIFICATION.md`).
  - Foundational documents: `CORE_CONCEPTS.md`, `CORE_PRINCIPLES.md`, `VISION.md`, `MANIFESTO.md`, `COMPLIANCE.md`.
  - RFC-0001 (Core Context Model) establishing `context/manifest.yaml` and hybrid YAML frontmatter Markdown format.
- **Normative Components**:
  - Standardized schemas for `ARCHITECTURE.md`, `DECISION_LOG.md`, `KNOWLEDGE.md`, `OPEN_WORK.md`, and `OPERATIONAL_GUIDE.md`.
- **CLI MVP**:
  - `pcp init`: Scaffold a standard PCP context in any workspace.
  - `pcp check`: Validate context directory against schemas and referential integrity.
- **MCP Server (`pcp mcp`)**:
  - Stdio JSON-RPC server implementing Model Context Protocol.
  - Tools: `pcp_get_manifest`, `pcp_read_component`, `pcp_search_context`, `pcp_check_integrity`, `pcp_propose_entry`.
  - Resources: `context://manifest`, `context://architecture`, `context://decisions`, `context://knowledge`, `context://open-work`, `context://ops`.

