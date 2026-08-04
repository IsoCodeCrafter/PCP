# PCP Specification

Version: 0.1.0

Status: Draft

---

# 1. Purpose

PCP (Project Context Protocol) defines an open standard for preserving project context.

The goal is to allow any contributor—human or AI—to continue a software project without rebuilding understanding from previous conversations.

---

# 2. Objectives

A PCP compliant project SHALL:

- Preserve important project knowledge.
- Preserve architectural decisions.
- Preserve current project state.
- Preserve unfinished work.
- Reduce context rebuilding.
- Be understandable by both humans and AI.

---

# 3. Core Components

Every PCP project consists of:

- Project Context
- Living Documents
- Decision History
- Current Focus
- Open Loops
- Operational Guide

---

# 4. Living Documents

Living Documents evolve together with the project.

They are continuously updated instead of rewritten.

---

# 5. Reference Implementation

The `.context` directory is the official reference implementation.

Alternative implementations are allowed as long as they comply with this specification.

