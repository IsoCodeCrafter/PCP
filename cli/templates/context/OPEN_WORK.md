# Open Work

This document tracks unfinished work required to continue the evolution of the Project.

Record work that is planned, in progress, blocked, or awaiting a decision.

The purpose of this document is to ensure that unfinished work remains visible and understandable to every contributor.

---

# Work Item Template

```markdown
---
id: "WORK-0001"
title: "Short descriptive title"
status: "open" # open | in_progress | blocked | completed | cancelled
priority: "high" # critical | high | medium | low
owner: "unassigned"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
target_version: "v1.0"
tags: ["cli", "mvp"]
dependencies: ["DEC-0001", "ARCH-0001"]
---

## Description
Describe the work that needs to be completed. Clearly define the expected outcome.

## Rationale
Explain why this work is important for project progress.

## Implementation Notes
Include technical notes, checklist, or test conditions.

## Related Items
* `WORK-0000`
```

---

# Example

---
id: "WORK-0001"
title: "Define Validation Rules and CLI Check"
status: "open"
priority: "high"
owner: "unassigned"
created_at: "2026-08-17"
updated_at: "2026-08-17"
target_version: "v0.2"
tags: ["tooling", "compliance"]
dependencies: ["DEC-0001", "ARCH-0001"]
---

## Description
Implement a deterministic validation command (`pcp check`) that parses `manifest.yaml` and verifies that all component files and frontmatters satisfy schema constraints.

## Rationale
Automated validation guarantees that the project context never enters a corrupted or drifted state.

## Implementation Notes
* Verify manifest presence.
* Validate YAML Frontmatter of every Markdown file.
* Check for broken reference IDs.

## Related Items
* `DEC-0001`
