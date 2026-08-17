# Operational Guide

This document describes the operational workflows, maintenance routines, and contribution guidelines for the PCP repository.

---
id: "OPS-0001"
title: "Proposing and Accepting Architectural Changes via RFC"
status: "active"
created_at: "2026-08-17"
updated_at: "2026-08-17"
tags: ["governance", "rfc-process"]
dependencies: ["DEC-0002"]
---

## Objective
Preserve conceptual integrity by requiring all normative changes to pass through an RFC and Decision Log review before code implementation.

## Prerequisites
* Clearly defined problem statement affecting PCP specification or reference implementation.

## Procedure
1. Create a draft RFC in `rfcs/RFC-XXXX-<Title>.md`.
2. Formulate motivation, conceptual impact, schema design, and alternatives.
3. Review and deliberate with contributors.
4. Upon consensus, transition status to `Accepted`.
5. Log a corresponding entry in `context/DECISION_LOG.md` (e.g. `DEC-XXXX`).
6. Update `context/manifest.yaml` and reference templates.

## Expected Result
A documented, auditable architectural change with zero unverified drift.

---
id: "OPS-0002"
title: "Local Context Conformance Check"
status: "active"
created_at: "2026-08-17"
updated_at: "2026-08-17"
tags: ["validation", "ci"]
dependencies: ["WORK-0001"]
---

## Objective
Verify that all context documents in the repository conform to RFC-0001 schema standards.

## Prerequisites
* Node.js runtime for PCP CLI tool.

## Procedure
1. Run `node ./cli/bin/pcp.js check` (or `npx pcp check`).
2. Ensure zero broken cross-reference IDs and valid YAML Frontmatters.
3. Commit context updates alongside code changes.

## Expected Result
Validation succeeds with exit code `0`.
