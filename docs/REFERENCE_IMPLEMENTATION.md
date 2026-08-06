# Reference Implementation

## Purpose

The Reference Implementation provides a concrete example of a Project Context Protocol (PCP) implementation.

Its purpose is to demonstrate how the concepts and normative requirements defined by the PCP Specification can be realized in practice.

The Reference Implementation improves understanding, interoperability, and adoption by illustrating one valid realization of PCP.

---

# Scope

The Reference Implementation illustrates one valid implementation of PCP.

It is an example rather than a prescribed solution and does not restrict alternative implementations.

Implementations MAY differ in:

* Programming language
* Storage technology
* File organization
* Internal architecture
* Tooling
* Automation

provided that they preserve the concepts, semantic relationships, and normative requirements defined by the PCP Specification.

---

# Principles

The Reference Implementation SHALL:

* Preserve all foundational PCP concepts.
* Preserve semantic relationships.
* Follow the PCP Specification.
* Demonstrate a recommended organization of Project Context.
* Serve as an educational and interoperable example.

The Reference Implementation SHALL NOT introduce additional normative requirements beyond those defined by the PCP Specification.

---

# Relationship to the Specification

The PCP Specification is normative.

The Reference Implementation is informative.

Where conflicts exist, the PCP Specification takes precedence.

Implementations achieve compliance by conforming to the PCP Specification, not by reproducing the Reference Implementation.

---

# Recommended Structure

A typical Reference Implementation MAY include:

* Project Context
* Decision Log
* Knowledge
* Architecture
* Operational Guide
* Open Work

The exact directory structure remains implementation-specific.

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

All implementations are considered equally valid provided they satisfy the PCP Specification.

---

# Versioning

The Reference Implementation SHOULD indicate the version of the PCP Specification with which it is compatible.

Example:

```text
PCP Specification: 1.0
Reference Implementation: 1.0
```

---

# Compliance

The Reference Implementation is expected to satisfy the highest available PCP compliance level.

It serves as the primary reference for interoperability testing, educational material, and implementation examples.

The Reference Implementation demonstrates one valid implementation of PCP; it is not the only compliant implementation.
