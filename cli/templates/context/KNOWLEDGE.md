# Knowledge

This document preserves durable knowledge that contributors need to understand, maintain, and evolve the Project.

Unlike decisions, knowledge represents information that remains valuable over time regardless of specific implementation tasks.

---

# Knowledge Entry Template

```markdown
---
id: "KN-0001"
title: "Short descriptive title"
category: "architecture" # business | domain | technical | architecture | process | convention | constraint
status: "active" # active | deprecated
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
source: "PCP Specification"
tags: ["core", "principles"]
dependencies: []
---

## Description
Describe the knowledge clearly and concisely.

## Why It Matters
Explain why contributors should know this information.

## Source Details
Provide additional background on the origin or references.

## Related Knowledge
* `KN-0000`
```

---

# Example

---
id: "KN-0001"
title: "Project Context Is Technology Independent"
category: "architecture"
status: "active"
created_at: "2026-08-17"
updated_at: "2026-08-17"
source: "PCP Specification"
tags: ["interoperability", "standards"]
dependencies: []
---

## Description
Project Context defines standardized conceptual models and normative semantics rather than specific storage or implementation technologies.

## Why It Matters
This allows multiple compliant implementations (Markdown, JSON, SQLite, Graph DB) to remain conceptually interoperable across tools and platforms.

## Source Details
Defined in PCP Specification Section 5.3 (Technology Independence).

## Related Knowledge
None
