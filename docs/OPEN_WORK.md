# Open Work

## Purpose

The Open Work document records all unfinished work required to continue the evolution of a Project.

Its purpose is to provide contributors with a clear understanding of what remains to be completed, investigated, or decided.

Unlike issue trackers, which often focus on implementation tasks, Open Work represents the conceptual backlog required to preserve Project Continuity.

---

# Scope

Open Work includes any activity that has not yet reached a completed state.

Typical examples include:

* Planned features
* Known problems
* Technical debt
* Research topics
* Pending decisions
* Documentation gaps
* Improvement opportunities

Temporary personal notes SHOULD NOT be included.

---

# Work Item Structure

Each work item SHOULD contain the following information.

## Identifier

A unique identifier.

Example:

```text
WORK-0001
```

---

## Title

A concise descriptive title.

Example:

```text
Define Compliance Levels
```

---

## Status

Recommended values include:

* Open
* In Progress
* Blocked
* Completed
* Cancelled

---

## Priority

Recommended values include:

* Critical
* High
* Medium
* Low

---

## Description

Describe the work to be completed.

The description SHOULD clearly define the expected outcome.

---

## Rationale

Explain why the work is important.

---

## Dependencies

Reference related work items, decisions, or knowledge entries when applicable.

Examples:

```text
DEC-0004
KN-0007
WORK-0012
```

---

## Owner

Identify the current responsible contributor, if applicable.

Ownership MAY change over time.

---

## Target Version

Optionally identify the intended release or milestone.

---

# Example

```text
Identifier:
WORK-0001

Title:
Define Compliance Levels

Status:
Open

Priority:
High

Description:
Specify compliance levels for PCP implementations.

Rationale:
Compliance requirements are necessary for interoperability.

Dependencies:
SPEC Section 8

Owner:
Unassigned

Target Version:
PCP 1.0
```

---

# Compliance

A PCP-compliant implementation SHOULD maintain a record of significant unfinished work.

The representation of Open Work is implementation-specific.

The conceptual information defined by this document SHOULD remain preserved regardless of technology or storage format.

---

# Relationship to Project Context

Open Work is a core component of Project Context.

It complements:

* Decision Log
* Knowledge
* Current State
* Architecture
* Operational Guide

Together, these components enable contributors to understand not only what a Project is and how it operates, but also what remains to be accomplished.

