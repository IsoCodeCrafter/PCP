# RFC-0003

## Title

Core Context Layers

## Status

Accepted

---

# Abstract

This RFC defines the logical layers of Project Context.

These layers organize context independently of any storage format, programming language, documentation system, or AI model.

The layers describe *what* a project must preserve, not *how* it is stored.

---

# Layer 1 — Static Context

Static Context contains information that changes infrequently.

It defines the project's identity and long-term structure.

Includes:

- Identity
- Architecture
- Constraints

---

# Layer 2 — Dynamic Context

Dynamic Context represents the project's current state.

It changes frequently during development.

Includes:

- Current State
- Open Work

---

# Layer 3 — Historical Context

Historical Context preserves important project history.

It records why the project became what it is.

Includes:

- Decisions
- Knowledge

---

# Layer 4 — Operational Context

Operational Context explains how contributors continue the project consistently.

Includes:

- Operational Guide

---

# Compliance

Every PCP compliant implementation SHALL preserve all four context layers.

The storage format is implementation specific.

EOF
