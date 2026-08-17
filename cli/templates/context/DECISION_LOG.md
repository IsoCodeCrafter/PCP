# Decision Log

This document records significant decisions that influence the evolution of the Project.

Each decision should explain **what** was decided, **why** it was decided, and **what impact** it has on the Project.

---

# Decision Template

```markdown
---
id: "DEC-0001"
title: "Short descriptive title"
status: "accepted" # proposed | accepted | rejected | deprecated | superseded
date: "YYYY-MM-DD"
contributors: ["Human", "AI Assistant"]
supersedes: null
superseded_by: null
tags: ["architecture", "storage"]
dependencies: ["ARCH-0001"]
---

## Context
Describe the problem or situation that required a decision.

## Decision
Describe the decision that was made.

## Rationale
Explain why this solution was selected instead of other alternatives.

## Consequences
Describe the expected impact of the decision (benefits, trade-offs, limitations).

## Alternatives Considered
* Alternative A: Reason rejected.
* Alternative B: Reason rejected.

## Related Decisions
* `DEC-0000`
```

---

# Example

---
id: "DEC-0001"
title: "Adopt Markdown as the Reference Implementation Format"
status: "accepted"
date: "2026-08-05"
contributors: ["Human", "AI Assistant"]
supersedes: null
superseded_by: null
tags: ["storage", "reference-implementation"]
dependencies: ["ARCH-0001"]
---

## Context
A portable, human-readable, and version-controlled format was required for the official reference implementation.

## Decision
Markdown with structured YAML Frontmatter was selected as the primary reference format.

## Rationale
Markdown is human-readable, git-friendly, and universally supported across tooling. YAML Frontmatter provides deterministic machine validation without sacrificing readability.

## Consequences
* High transparency and simple code reviews in Git.
* Requires linter tooling to validate frontmatter structure.

## Alternatives Considered
* **Pure JSON / YAML:** Poor for long-form narrative explanations.
* **SQLite / Embedded DB:** Binary files complicate Git pull request reviews.

## Related Decisions
None
