# PCP Specification

Version: 0.1.0

Status: Draft

---

# Document Structure

1. Purpose
2. Terminology
3. Core Context Model
4. Compliance
5. Reference Implementation
6. Versioning

---

# Purpose

PCP standardizes project context.

---

# Terminology

See GLOSSARY.md

---

# Core Context Model

See RFC-0001.

---

# Compliance

A PCP implementation SHALL preserve every required concept.

Implementations MAY choose any storage format.

---

# Reference Implementation

The `.context/` directory is the first official reference implementation.

Other implementations remain compliant if they satisfy the specification.

## Relationship

PCP defines concepts.

Reference implementations define concrete files.

The official reference implementation is located under:

`reference/context-template/`

Alternative implementations remain compliant if they preserve the required concepts.
