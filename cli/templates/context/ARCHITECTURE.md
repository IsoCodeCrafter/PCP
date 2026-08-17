# Architecture

This document describes the long-term structure of the Project.

Its purpose is to help contributors understand how the Project is organized without reading the entire codebase.

Focus on concepts, responsibilities, boundaries, and relationships rather than implementation details.

---

# Architecture Entry Template

```markdown
---
id: "ARCH-0001"
title: "Short descriptive title"
status: "active"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
tags: ["core", "structure"]
dependencies: []
---

## Objective
Describe the purpose of this architectural element.

## Overview
Provide a high-level explanation. Focus on responsibilities rather than implementation.

## Components
List the major components involved:
* **Component A:** Responsibility and interactions.
* **Component B:** Responsibility and interactions.

## Dependencies
Describe important dependencies (both internal and external).

## Constraints
Document architectural constraints (e.g., technology independence, latency, security).

## Future Evolution
Describe expected future architectural changes, if known.
```

---

# Example

---
id: "ARCH-0001"
title: "Project Context Lifecycle"
status: "active"
created_at: "2026-08-17"
updated_at: "2026-08-17"
tags: ["core", "lifecycle"]
dependencies: []
---

## Objective
Describe how Project Context evolves during the lifecycle of a Project.

## Overview
Project Context is continuously updated by Contributors and preserved independently of implementation technology.

## Components
* **Project:** Defines scope, purpose, and ownership.
* **Context:** Preserves decisions, architecture, knowledge, and operational guidance.
* **Contributor:** Reads, proposes changes, and maintains the context.

## Dependencies
* PCP Specification
* Decision Log (`DEC-0001`)

## Constraints
Project Context MUST remain technology independent and human-verifiable.

## Future Evolution
Support automated CLI validation and MCP retrieval while preserving semantic compatibility.
