# Knowledge

## Purpose

The Knowledge document preserves durable information that contributors need to understand, maintain, and evolve a Project.

Unlike decisions, which explain why specific choices were made, knowledge represents information that remains valuable regardless of individual implementation tasks or historical events.

The purpose of this document is to reduce repeated discovery and ensure that essential project knowledge survives changes in contributors.

---

# Scope

Knowledge includes information that is expected to remain relevant over time.

Typical examples include:

* Business rules
* Domain concepts
* Technical constraints
* Project conventions
* Shared terminology
* Design assumptions
* External dependencies
* Known limitations

Transient implementation details SHOULD NOT be recorded unless they become long-term project knowledge.

---

# Knowledge Structure

Each knowledge entry SHOULD contain the following information.

## Identifier

A unique identifier.

Example:

```text id="y1vh5n"
KN-0001
```

---

## Title

A short descriptive title.

Example:

```text id="a6sk4j"
Project Context Is Technology Independent
```

---

## Category

Recommended categories include:

* Business
* Domain
* Technical
* Process
* Architecture
* Convention
* Constraint

Implementations MAY define additional categories.

---

## Description

A clear explanation of the knowledge.

The description SHOULD be understandable without requiring additional context.

---

## Rationale

Explain why this knowledge is important for the Project.

---

## Source

Identify where the knowledge originated, when applicable.

Examples:

* Specification
* Decision
* External Standard
* Customer Requirement
* Team Agreement

---

## Related Knowledge

Reference related knowledge entries.

Example:

```text id="lxfx0l"
KN-0004
KN-0011
```

---

# Example

```text id="d9wziv"
Identifier:
KN-0001

Title:
Project Context Is Technology Independent

Category:
Architecture

Description:
Project Context represents concepts rather than storage technologies.

Rationale:
This allows multiple compliant implementations while preserving interoperability.

Source:
PCP Specification

Related Knowledge:
None
```

---

# Compliance

A PCP-compliant implementation SHOULD preserve durable project knowledge.

The storage mechanism is implementation-specific.

The conceptual meaning of each knowledge entry MUST remain preserved regardless of representation.

---

# Relationship to Project Context

Knowledge is one of the core components of Project Context.

It complements:

* Decision Log
* Current State
* Architecture
* Operational Guide
* Open Work

Together, these components provide the long-term understanding required to maintain Project Continuity.

