# Core Concepts

This document defines the fundamental concepts of the **Project Context Protocol (PCP)**.

These concepts define the conceptual foundation of PCP. Every normative requirement in the PCP Specification derives its meaning from the concepts defined in this document.

Implementations MAY differ in structure, storage, representation, or technology, but they MUST preserve the concepts defined herein.

---

# Scope

This document defines the conceptual model of PCP.

It intentionally does **not** define:

* storage formats
* file structures
* implementation details
* validation rules
* tooling
* transport mechanisms

Those aspects are defined elsewhere in the PCP Specification and its reference materials.

---

# Concept Model

The PCP conceptual model is built upon four foundational concepts.

```text
Project
    │
    ▼
Project Context
    │
    ├──────────────┐
    ▼              ▼
Contributor   Project Continuity
```

All other PCP concepts are derived from these foundations.

---

# Concept Structure

Every concept defined by PCP follows the same structure:

* Definition
* Purpose
* Relationships
* Examples
* Non-Examples
* Notes

This structure ensures consistency throughout the specification.

---

# Project Context

## Definition

Project Context is the complete set of information required for a contributor to understand, operate, maintain, and continue a project without unnecessary rediscovery.

## Purpose

To preserve Project Continuity through a shared understanding of the project.

## Relationships

* Project Context belongs to a Project.
* Project Context is created, maintained, and consumed by Contributors.
* Project Context enables Project Continuity.
* Project Context may contain Decisions, Knowledge, Current State, Architecture, Operational Guidance, and Open Work.

## Examples

* Architectural decisions
* Project objectives
* Current project state
* Known constraints
* Design rationale
* Operational procedures
* Outstanding work

## Non-Examples

The following artifacts do not constitute Project Context by themselves:

* Source code
* Git history
* Chat history
* README
* Issue trackers
* Prompt history

These artifacts may contribute to Project Context but are not Project Context on their own.

## Notes

Project Context is independent of its representation.

Markdown documents, databases, JSON, knowledge graphs, or future technologies are implementation choices rather than conceptual requirements.

---

# Contributor

## Definition

A Contributor is any entity capable of creating, modifying, consuming, validating, or maintaining Project Context.

## Purpose

To participate in the continuous evolution of a project through a shared Project Context.

## Relationships

* Contributors create Project Context.
* Contributors consume Project Context.
* Contributors maintain Project Context.
* Contributors produce Decisions and Knowledge.
* Multiple Contributors may collaborate on the same Project Context.

## Examples

* Software developers
* Project maintainers
* AI assistants
* Autonomous software agents
* Documentation systems
* CI/CD automation

## Non-Examples

* A repository
* A storage system
* A programming language
* A file format

## Notes

PCP treats human contributors, AI systems, and automated processes as equal participants in the exchange of Project Context.

---

# Project

## Definition

A Project is a bounded initiative possessing identity, purpose, and continuity.

## Purpose

To define the scope within which Project Context exists.

## Relationships

* A Project owns one Project Context.
* A Project may have multiple Contributors.
* A Project evolves through accumulated Knowledge and Decisions.
* A Project seeks Project Continuity.

## Examples

* Open-source software
* Commercial software
* Internal platforms
* Research initiatives

## Non-Examples

* A source file
* A single conversation
* A prompt
* A temporary task

## Notes

A Project may outlive its original contributors.

Project identity remains stable even when contributors change.

---

# Project Continuity

## Definition

Project Continuity is the capability of a Project to evolve despite changes in Contributors.

## Purpose

To minimize knowledge loss and reduce onboarding effort while preserving long-term project evolution.

## Relationships

* Project Continuity depends on Project Context.
* Contributors preserve Project Continuity by maintaining Project Context.
* PCP exists to improve Project Continuity.

## Examples

* A new developer becoming productive quickly.
* An AI assistant continuing work without repeated explanations.
* A project surviving team changes.
* Long-term maintenance without knowledge loss.

## Non-Examples

* Depending on personal memory.
* Reconstructing decisions from chat history.
* Knowledge existing only in one person's mind.
* Restarting project understanding from scratch.

## Notes

Project Continuity is the primary objective of PCP.

Every concept defined by PCP ultimately exists to support Project Continuity.

---

# Future Concepts

The following concepts extend the PCP conceptual model and are defined separately:

* Decision
* Knowledge
* Current State
* Open Work
* Architecture
* Operational Guide
* Compliance
* Reference Implementation
* Validator

These concepts build upon the four foundational concepts defined in this document.

---

# Ecosystem Boundaries & Taxonomy

PCP operates within a wider ecosystem of software engineering tools. It defines a distinct, non-competing boundary within the modern software knowledge stack.

## The Four Knowledge Layers

Software knowledge is organized into four complementary layers:

1. **Source Code (Git):** The executable reality of the project. Contains *what* the system does and *how* it does it.
2. **Work Management (Jira, Linear, GitHub Issues):** Manages *ephemeral execution*—who does what, sprint backlog, and ticket state. When a ticket is closed, its primary operational lifecycle ends.
3. **General Knowledge Management (Notion, Confluence, Internal Wikis):** Manages *human-centric organizational knowledge*—onboarding guides, team directories, and meeting minutes.
4. **Project Continuity Context (PCP):** Manages *durable, machine-discoverable project context* co-located with the repository. Answers: *"When a human or AI contributor joins this codebase today, what architecture, invariants, and accepted decisions must they know to continue work correctly?"*

## Complementarity (The Non-Exclusion Principle)

PCP does not replace issue trackers or wikis:
* Issue trackers answer: *"What task should be worked on next?"*
* Wikis answer: *"How is our company organized?"*
* PCP answers: *"What rules and architecture govern this codebase so that work continues seamlessly across contributor shifts?"*

