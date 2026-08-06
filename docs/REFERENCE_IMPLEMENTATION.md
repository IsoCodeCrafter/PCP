# Reference Implementation

## Purpose

The Reference Implementation provides a concrete example of a Project Context Protocol (PCP) implementation.

Its purpose is to demonstrate how the concepts and normative requirements defined by the PCP Specification can be realized in practice.

The Reference Implementation is intended to improve understanding, interoperability, and adoption of PCP.

---

# Scope

The Reference Implementation illustrates one valid implementation of PCP.

It does not restrict alternative implementations.

Implementations MAY differ in:

* Programming language
* Storage technology
* File organization
* Internal architecture
* Tooling
* Automation

provided that they preserve the concepts and normative requirements defined by the PCP Specification.

---

# Principles

The Reference Implementation SHALL:

* Preserve all foundational PCP concepts.
* Preserve semantic relationships.
* Follow the PCP Specification.
* Demonstrate recommended project organization.
* Serve as an educational example.

The Reference Implementation SHALL NOT introduce additional normative requirements beyond the PCP Specification.

---

# Relationship to the Specification

The PCP Specification is normative.

The Reference Implementation is informative.

Where conflicts exist, the PCP Specification takes precedence.

Implementations are compliant by conforming to the Specification, not by copying the Reference Implementation.

---

# Recommended Structure

A typical Reference Implementation MAY include:

* Project overview
* Core concepts
* Decision Log
* Knowledge
* Architecture
* Operational Guide
* Open Work

The exact directory structure is implementation-specific.

---

# Alternative Implementations

Alternative implementations are encouraged.

Examples include:

* Markdown-based repositories
* JSON document stores
* SQL or NoSQL databases
* Knowledge graphs
* Cloud-native services
* AI-native context stores

All implementations are considered equally valid if they satisfy the PCP Specification.

---

# Versioning

The Reference Implementation SHOULD indicate the PCP Specification version with which it is compatible.

Example:

```text
PCP Specification: 1.0
Reference Implementation: 1.0
```

---

# Compliance

The Reference Implementation is expected to satisfy the highest available PCP compliance level.

It serves as the primary reference for interoperability testing, examples, and educational material.

It is not the only valid implementation of PCP.

