# Operational Guide

This document describes the procedures required to operate, maintain, and contribute to the Project.

Document repeatable operational procedures rather than one-time tasks.

---

# Operational Procedure Template

```markdown
---
id: "OPS-0001"
title: "Short descriptive title"
status: "active" # active | deprecated
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
tags: ["deployment", "release"]
dependencies: []
---

## Objective
Describe the purpose of this procedure.

## Prerequisites
List everything required before starting:
* Required permissions or credentials.
* Required runtime environment / software.

## Procedure
Describe the steps in sequential order:
1. Step 1 (Action)
2. Step 2 (Validation)
3. Step 3 (Completion)

## Expected Result
Describe the expected outcome after successful completion.

## Rollback
If applicable, describe how to safely undo the procedure.

## Notes
Include additional operational considerations or warnings.
```

---

# Example

---
id: "OPS-0001"
title: "Deploy a New Release"
status: "active"
created_at: "2026-08-17"
updated_at: "2026-08-17"
tags: ["release", "production"]
dependencies: []
---

## Objective
Deploy the latest stable release to the target environment.

## Prerequisites
* Production deployment credentials.
* Clean CI/CD pipeline pass (`pcp check` and test suite).

## Procedure
1. Run local context and code validation.
2. Tag release in Git repository (`git tag vX.Y.Z`).
3. Trigger CI release workflow.
4. Verify health endpoints post-deployment.

## Expected Result
The new release is active and operational.

## Rollback
Trigger the rollback workflow to revert to the previous Git tag.

## Notes
Deployments should be executed within designated maintenance windows.
