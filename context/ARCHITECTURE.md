# Architecture

This document describes the architectural model and repository structure of the Project Context Protocol (PCP).

---
id: "ARCH-0001"
title: "PCP Core Conceptual Architecture"
status: "active"
created_at: "2026-08-05"
updated_at: "2026-08-17"
tags: ["conceptual-model", "core"]
dependencies: []
---

## Objective
Define the four foundational concepts and the relationships enabling continuous Project Continuity across human and AI contributors.

## Overview
PCP separates conceptual specifications from implementation technologies. A Project owns a single Project Context, which is evolved by Contributors to guarantee Project Continuity.

## Components
* **Project:** The boundary defining identity and objectives.
* **Project Context:** The structured information body comprising Decisions, Knowledge, Architecture, Operational Procedures, Open Work, and Manifest.
* **Contributor:** Any human, AI model, or automated tool interacting with the context.
* **Project Continuity:** The emergent outcome allowing frictionless handover and zero context loss.

## Dependencies
* None (Foundational layer)

## Constraints
* Technology Independence (MUST be representable in Markdown, JSON, databases, etc.).
* Human-in-the-loop integrity (no unapproved AI state pollution).

---
id: "ARCH-0002"
title: "4-Phase Delivery & Tooling Architecture"
status: "active"
created_at: "2026-08-17"
updated_at: "2026-08-17"
tags: ["delivery-plan", "tooling"]
dependencies: ["ARCH-0001", "DEC-0002"]
---

## Objective
Structure the rollout of the PCP ecosystem into four distinct, progressive phases.

## Overview
Phase 1 establishes the canonical manifest and metadata schema; Phase 2 introduces developer ergonomics via CLI (`init` and `check`); Phase 3 exposes context to AI agents via MCP; Phase 4 establishes continuous validation in CI.

## Components
* **Core & Entry Point (Phase 1):** `manifest.yaml` and YAML Frontmatter standard.
* **Developer UX (Phase 2):** CLI MVP for initialising and verifying repository conformance.
* **Agent Interface (Phase 3):** MCP server enabling `read -> understand -> propose -> human-approve -> write` workflows.
* **Ecosystem (Phase 4):** GitHub Actions and CI-driven context auditing.

## Constraints
* No premature CLI features (`pack` deferred).
* Strict schema validation before code generation.
