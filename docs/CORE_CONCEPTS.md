# Core Concepts

This document defines the fundamental concepts of the **Project Context Protocol (PCP)**.

Every normative requirement defined by the PCP Specification is based on these concepts.

Implementations MAY differ in structure, storage, or technology, but they MUST preserve the concepts defined in this document.

---

# Concept Template

Every concept defined by PCP follows the same structure:

* Definition
* Purpose
* Relationships
* Examples
* Non-Examples
* Notes

This template ensures consistency throughout the specification.

---

# Context

## Definition

Context is the complete body of information required for a contributor to understand and continue a project without unnecessary rediscovery.

## Purpose

To preserve project continuity by providing a shared understanding of the project.

## Relationships

* Context belongs to a Project.
* Context is created and maintained by Contributors.
* Context enables Project Continuity.
* Context includes Decisions, Knowledge, Current State, Architecture, and Operational Guidance.

## Examples

* Architectural decisions
* Current project status
* Known constraints
* Design rationale
* Operational procedures
* Open work items

## Non-Examples

The following are not context by themselves:

* Source code
* Chat history
* Git history
* README
* Issue tracker
* Prompt history

These artifacts may contribute to project context but do not constitute project context on their own.

## Notes

Context is concept-oriented rather than file-oriented.

PCP standardizes the information required to continue a project, not how that information is stored.

---

# Contributor

## Definition

A Contributor is any human, AI system, or automated process that creates, modifies, consumes, or maintains project context.

## Purpose

To participate in the continuous evolution of a project through a shared context.

## Relationships

* Contributors create Context.
* Contributors consume Context.
* Contributors produce Decisions and Knowledge.
* Multiple Contributors may collaborate on the same Project Context.

## Examples

* Software developer
* Project maintainer
* AI coding assistant
* Autonomous software agent
* CI/CD automation
* Documentation generator

## Non-Examples

* A repository without context
* A storage system
* A programming language

## Notes

PCP treats all contributors equally with respect to context exchange.

---

# Project

## Definition

A Project is a bounded body of work with a defined purpose and an expected continuity over time.

## Purpose

To provide the scope within which project context exists.

## Relationships

* A Project owns one Project Context.
* A Project may have multiple Contributors.
* A Project evolves through Decisions and accumulated Knowledge.

## Examples

* Open-source software
* Commercial application
* Internal tooling
* Research project

## Non-Examples

* A single source file
* A single conversation
* An isolated prompt

## Notes

A project may outlive its original contributors.

---

# Project Continuity

## Definition

Project Continuity is the ability of a project to continue efficiently regardless of changes in contributors.

## Purpose

To minimize knowledge loss and reduce onboarding effort.

## Relationships

* Project Continuity depends on Context.
* Contributors preserve Project Continuity by maintaining Context.
* PCP exists to improve Project Continuity.

## Examples

* A new developer becoming productive quickly.
* An AI assistant continuing work without lengthy explanations.
* A project surviving team changes.

## Non-Examples

* Relying solely on personal memory.
* Depending on a single individual.
* Reconstructing decisions from chat history.

## Notes

Project Continuity is the primary objective of PCP.

---

## Future Concepts

The following concepts will be defined in subsequent revisions of this document:

* Decision
* Knowledge
* Current State
* Open Work
* Architecture
* Operational Guide
* Compliance
* Reference Implementation

