# Knowledge

This document preserves durable domain, architectural, and procedural knowledge of the Project Context Protocol.

---
id: "KN-0001"
title: "Project Context Is Technology Independent"
category: "architecture"
status: "active"
created_at: "2026-08-05"
updated_at: "2026-08-17"
source: "PCP Specification Section 5.3"
tags: ["core-principle", "interoperability"]
dependencies: ["ARCH-0001"]
---

## Description
PCP standardizes conceptual relationships and normative requirements rather than specific file formats or database engines. Markdown and YAML Frontmatter serve as the official reference implementation, but implementations using JSON, graph databases, or object stores remain fully compliant if semantic equivalence is preserved.

## Why It Matters
Prevents vendor lock-in and allows future-proofing across evolving AI toolchains and developer environments.

---
id: "KN-0002"
title: "Four Pillars of Project Continuity"
category: "domain"
status: "active"
created_at: "2026-08-05"
updated_at: "2026-08-17"
source: "PCP Specification Section 5.1"
tags: ["foundational-concepts"]
dependencies: ["ARCH-0001"]
---

## Description
The four foundational pillars of PCP are Project, Project Context, Contributor, and Project Continuity. No concept in PCP exists outside this relationship model.

## Why It Matters
Ensures all tooling, RFCs, and implementations remain focused on preserving continuity rather than straying into generic task-tracking or prompt-management tooling.

---
id: "KN-0003"
title: "Human-in-the-Loop AI Collaboration Model"
category: "convention"
status: "active"
created_at: "2026-08-17"
updated_at: "2026-08-17"
source: "DEC-0002 & RFC-0001"
tags: ["ai-governance", "safety"]
dependencies: ["DEC-0002"]
---

## Description
AI assistants must operate under the `READ -> UNDERSTAND -> PROPOSE CHANGE -> HUMAN APPROVAL -> WRITE` protocol when modifying project context. Autonomous unverified writes are strictly prohibited.

## Why It Matters
Guarantees context fidelity and prevents AI hallucination loops from corrupting the single source of truth (SSOT).
