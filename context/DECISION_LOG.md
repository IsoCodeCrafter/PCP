# Decision Log

This document records architectural and structural decisions made in the development of the Project Context Protocol.

---
id: "DEC-0001"
title: "Adopt Markdown as the Reference Implementation Format"
status: "accepted"
date: "2026-08-05"
contributors: ["Human", "AI Assistant"]
supersedes: null
superseded_by: null
tags: ["reference-implementation", "storage", "markdown"]
dependencies: ["ARCH-0001"]
---

## Context
A portable, human-readable, and version-controlled format was needed to demonstrate the PCP specification.

## Decision
Markdown was adopted as the official Level 2 / Level 3 Reference Implementation format.

## Rationale
Markdown is universally supported, readable by humans and LLMs alike, and seamlessly reviewed in Git diffs without proprietary viewer tools.

## Consequences
* High transparency and simple contributor onboarding.
* Requires supplementary structured metadata for reliable machine verification.

## Alternatives Considered
* **Pure JSON:** Lacks readability for long prose explanations.
* **SQLite / Embedded DB:** Binary files do not support readable Git diffs.

---
id: "DEC-0002"
title: "Canonical Entry Point and Hybrid YAML Frontmatter via RFC-0001"
status: "accepted"
date: "2026-08-17"
contributors: ["Human", "AI Assistant"]
supersedes: null
superseded_by: null
tags: ["schema", "manifest", "rfc-0001"]
dependencies: ["ARCH-0001", "DEC-0001"]
---

## Context
PCP lacked a deterministic entry point for programmatic discovery, and freeform Markdown made automated linter checking and dependency auditing error-prone.

## Decision
Adopted `context/manifest.yaml` as the canonical entry point and standardized YAML Frontmatter headers across all Markdown context components as proposed in RFC-0001.

## Rationale
Combines the human readability of Markdown with the deterministic validation capabilities of structured schemas.

## Consequences
* Tooling (e.g. `pcp check`) can reliably validate cross-references and schema constraints.
* Contributors must adhere to standard metadata headers.

## Alternatives Considered
* **Implicit directory convention without manifest:** Fragile and ambiguous for complex repositories.
* **Repo-root `.pcp.yaml`:** Rejected in favor of `context/manifest.yaml` to preserve self-contained context folder portability.
