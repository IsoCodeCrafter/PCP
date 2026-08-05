# Compliance

## Purpose

This document defines the requirements for determining whether an implementation conforms to the Project Context Protocol (PCP).

Compliance ensures that different implementations preserve the same conceptual model while remaining free to choose their own technologies, storage formats, and internal architectures.

The objective of compliance is interoperability through shared concepts rather than identical implementations.

---

# Scope

This document applies to every implementation that claims compliance with PCP.

It defines:

* Mandatory requirements
* Optional capabilities
* Compliance evaluation
* Non-conformance conditions

Implementation-specific features are outside the scope of this document unless they affect normative PCP concepts.

---

# Compliance Principles

A PCP-compliant implementation MUST preserve:

* The foundational concepts defined by PCP.
* The relationships between those concepts.
* The normative requirements defined by the specification.

Compliance is determined by semantic equivalence rather than implementation details.

---

# Mandatory Requirements

An implementation claiming PCP compliance MUST:

* Preserve the Project conceptual model.
* Preserve Project Context.
* Preserve Contributor relationships.
* Preserve Project Continuity.
* Maintain all mandatory conceptual components.
* Support long-term continuity of Project Context.

Failure to satisfy any mandatory requirement results in non-conformance.

---

# Optional Capabilities

An implementation MAY provide additional capabilities, including:

* Custom document formats
* Databases
* APIs
* Synchronization
* Validation tools
* AI integrations
* Automation
* Visualization

Optional capabilities MUST NOT redefine normative PCP concepts.

---

# Compliance Levels

PCP defines the following compliance levels.

## Level 1 — Conceptual Compliance

The implementation preserves all mandatory PCP concepts and their relationships.

## Level 2 — Structural Compliance

The implementation additionally follows the recommended document structure and organizational model.

## Level 3 — Reference Compliance

The implementation is fully compatible with the official PCP Reference Implementation.

Future versions of PCP MAY define additional compliance levels.

---

# Non-Conformance

An implementation is not PCP-compliant if it:

* Redefines foundational concepts.
* Removes mandatory conceptual components.
* Breaks semantic compatibility.
* Violates normative requirements defined by the specification.

Implementation differences alone do not constitute non-conformance.

---

# Compliance Verification

Compliance MAY be evaluated through:

* Manual review
* Automated validation
* Reference implementation comparison
* Future PCP validation tools

The verification mechanism is implementation-specific.

---

# Relationship to the Specification

This document complements the PCP Specification.

Where conflicts exist, the PCP Specification takes precedence.

This document explains how compliance is evaluated; it does not redefine the specification itself.

