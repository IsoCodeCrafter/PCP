# Conformance

## Purpose

This document defines what it means for an implementation to conform to the Project Context Protocol (PCP).

Its purpose is to establish consistent criteria for evaluating PCP implementations while remaining independent of specific technologies, storage formats, or development tools.

---

# Scope

This document defines:

* Conformance requirements
* Compliance levels
* Evaluation principles
* Relationship to the PCP Specification

It does not define implementation details or validation procedures.

---

# Relationship to the Specification

The PCP Specification is the normative source of all conformance requirements.

This document explains how those requirements are interpreted when evaluating an implementation.

Where conflicts exist, the PCP Specification takes precedence.

---

# Conformance Principles

A conforming implementation SHALL:

* Preserve all foundational PCP concepts.
* Preserve the semantic relationships defined by the PCP Specification.
* Preserve Project Context independently of implementation technology.
* Support Project Continuity through shared Project Context.

Conformance is determined by concepts rather than file structures, programming languages, or storage technologies.

---

# Compliance Levels

PCP defines progressive levels of compliance.

## Level 1 — Concept Compliance

The implementation preserves all foundational PCP concepts and their relationships.

## Level 2 — Specification Compliance

The implementation satisfies all mandatory normative requirements defined by the PCP Specification.

## Level 3 — Reference Compatibility

The implementation is interoperable with the PCP Reference Implementation while remaining implementation independent.

Higher compliance levels may be introduced in future versions of PCP.

---

# Evaluation Criteria

A compliant implementation should be evaluated according to the following questions:

* Are all foundational concepts preserved?
* Are semantic relationships maintained?
* Is Project Context preserved independently of implementation technology?
* Does the implementation satisfy all mandatory specification requirements?
* Can Project Continuity be maintained through the available Project Context?

---

# Non-Conformance

An implementation is considered non-conformant if it:

* Omits foundational PCP concepts.
* Violates semantic relationships.
* Fails to satisfy mandatory specification requirements.
* Changes the meaning of PCP concepts.

Implementation-specific extensions do not affect conformance provided they remain compatible with the PCP Specification.

---

# Future Evolution

Future versions of PCP MAY introduce additional compliance levels, validation mechanisms, and certification processes.

Such additions SHOULD remain backward compatible whenever practical.

---

# Summary

PCP conformance evaluates whether an implementation preserves the concepts and normative requirements defined by the PCP Specification.

Compliance is based on conceptual correctness rather than implementation choices.

