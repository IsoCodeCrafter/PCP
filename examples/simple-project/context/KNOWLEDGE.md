# Knowledge

This document preserves durable knowledge about the TaskFlow project.

Unlike the Decision Log, this document contains information that contributors are expected to know regardless of when they join the project.

---

# KN-0001

## Title

Task-Centered Domain Model

## Category

Domain

## Description

The application revolves around a single core entity: **Task**.

Every major feature either creates, updates, assigns, completes, or displays tasks.

## Why It Matters

Understanding the central role of the Task entity makes it easier to understand the rest of the system.

## Source

Initial Project Design

---

# KN-0002

## Title

Task Status Lifecycle

## Category

Business

## Description

Every task follows the same lifecycle:

```text
New → In Progress → Completed
```

Tasks cannot skip states.

## Why It Matters

This lifecycle is enforced throughout the application and should remain consistent across all features.

## Source

Business Rules

---

# KN-0003

## Title

Single Source of Project Context

## Category

Process

## Description

All project context is maintained inside the `context/` directory.

Contributors should update these documents whenever significant project knowledge changes.

## Why It Matters

Keeping Project Context in a single location prevents knowledge fragmentation and improves long-term maintainability.

## Source

Project Convention

---

# KN-0004

## Title

Technology Independence of Project Context

## Category

Architecture

## Description

Project Context documents are independent of the application's implementation technology.

The application may evolve, but the conceptual Project Context should remain understandable.

## Why It Matters

This allows contributors to preserve knowledge even when technologies change.

## Source

PCP Specification

