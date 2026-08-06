# PCP Specification

**Version:** 0.1 (Draft)

---

# 1. Introduction

The Project Context Protocol (PCP) defines a standardized conceptual model for preserving, organizing, and transferring Project Context.

The objective of PCP is to improve Project Continuity by ensuring that the information required to understand, maintain, and evolve a Project remains accessible and consistent across Contributors, tools, and time.

PCP defines concepts and normative requirements rather than implementation technologies. It is independent of programming languages, storage formats, development environments, and software tooling.

The specification establishes a common foundation that enables different implementations to exchange and preserve Project Context while remaining interoperable at the conceptual level.

The primary goal of PCP is to reduce unnecessary rediscovery of project knowledge and to enable efficient Project Continuity regardless of changes in Contributors.

---

# 2. Scope

This specification defines the conceptual and normative foundation of the Project Context Protocol (PCP).

Specifically, this specification defines:

* The core concepts of PCP.
* The normative requirements for PCP-compliant implementations.
* The relationship between Project Context and its Contributors.
* The requirements for preserving Project Continuity.
* The conformance criteria for implementations.

This specification intentionally does not define:

* Programming languages.
* Storage technologies.
* File formats.
* Communication protocols.
* User interfaces.
* Development workflows.
* Implementation-specific architectures.

These aspects are implementation decisions and are outside the scope of this specification.

---

# 3. Normative Language

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this specification are to be interpreted as described in RFC 2119 and RFC 8174 when, and only when, they appear in all capital letters.

These keywords indicate the level of obligation associated with a requirement:

* **MUST / REQUIRED / SHALL** — An absolute requirement of the specification.
* **MUST NOT / SHALL NOT** — An absolute prohibition.
* **SHOULD / RECOMMENDED** — A strong recommendation. Valid reasons may exist to ignore a recommendation, but the implications should be fully understood.
* **SHOULD NOT** — A strong recommendation against a particular behavior.
* **MAY / OPTIONAL** — A truly optional behavior or feature.

---

# 4. References

## 4.1 Normative References

The following documents are indispensable for the application of this specification.

### RFC 2119

Key words for use in RFCs to Indicate Requirement Levels.

### RFC 8174

Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words.

---

## 4.2 Informative References

The following documents provide useful background information and related concepts.

### CommonMark Specification

Reference specification for Markdown syntax.

### RFC 8259

The JavaScript Object Notation (JSON) Data Interchange Format.

### Model Context Protocol (MCP)

Open protocol for providing context to AI systems.

Future revisions of this specification MAY reference additional standards where appropriate. Such references do not alter the conceptual model of PCP unless explicitly stated.

---

# 5. Conceptual Model

The Project Context Protocol (PCP) is based on a conceptual model consisting of four foundational concepts.

These concepts provide the semantic foundation for all normative requirements defined by this specification.

## 5.1 Foundational Concepts

The PCP conceptual model consists of the following concepts:

* Project
* Project Context
* Contributor
* Project Continuity

No concept defined by PCP exists independently of this model.

## 5.2 Concept Relationships

The relationships between the foundational concepts are defined as follows:

* A **Project** provides the scope within which Project Context exists.
* **Project Context** contains the information required to understand, maintain, and continue a Project.
* A **Contributor** creates, maintains, validates, and consumes Project Context.
* **Project Continuity** is achieved through the preservation and maintenance of Project Context.

These relationships are normative and apply to all PCP-compliant implementations.

## 5.3 Technology Independence

The conceptual model defined by PCP is independent of implementation technologies.

A compliant implementation MAY represent these concepts using Markdown, JSON, databases, knowledge graphs, object models, or other technologies, provided that the concepts and their relationships remain semantically equivalent.

## 5.4 Authority

The definitions of the foundational concepts are maintained in the PCP Core Concepts document.

This specification defines the normative requirements that apply to those concepts.

---

# 6. Project Context Model

Project Context is the standardized body of information required to preserve Project Continuity.

A PCP-compliant Project Context SHALL contain, at a minimum, the following conceptual components:

* Decisions
* Knowledge
* Current State
* Open Work
* Architecture
* Operational Guide

Implementations MAY organize these components differently, provided that their meaning and relationships are preserved.

## 6.1 Decisions

Decisions document significant choices made during the evolution of a Project.

Each decision SHOULD include:

* rationale
* consequences
* status
* date
* author or originating Contributor

## 6.2 Knowledge

Knowledge captures durable information that Contributors are expected to preserve beyond individual tasks.

Examples include:

* domain knowledge
* business rules
* technical constraints
* project conventions

## 6.3 Current State

Current State describes the present condition of the Project.

It SHOULD summarize:

* completed work
* ongoing work
* known issues
* active priorities

## 6.4 Open Work

Open Work identifies tasks, problems, and unresolved questions.

Open Work SHOULD remain implementation independent.

## 6.5 Architecture

Architecture documents the structural organization of the Project.

Examples include:

* system structure
* component relationships
* dependency boundaries
* integration points

## 6.6 Operational Guide

Operational Guide describes procedures required to operate, maintain, and contribute to the Project.

Examples include:

* setup
* deployment
* release procedures
* maintenance operations

---

# 7. Requirements

A PCP-compliant implementation MUST satisfy the following requirements.

## REQ-001

A Project MUST define exactly one Project Context.

## REQ-002

Project Context MUST preserve the conceptual model defined by PCP.

## REQ-003

All required conceptual components MUST be represented.

## REQ-004

Project Context MUST remain understandable independent of its original Contributors.

## REQ-005

Implementations MUST preserve semantic equivalence when transforming or exchanging Project Context.

## REQ-006

Implementations MAY introduce additional concepts provided they do not violate PCP semantics.

---

# 8. Conformance

An implementation is considered PCP-compliant if it satisfies all mandatory requirements defined by this specification.

Compliance is evaluated against concepts rather than file layouts or technologies.

A compliant implementation:

* MUST preserve all foundational concepts.
* MUST preserve conceptual relationships.
* MUST satisfy all mandatory requirements.
* MAY define implementation-specific extensions.

Failure to satisfy a mandatory requirement results in non-conformance.

---

# 9. Reference Implementation

The PCP Reference Implementation demonstrates one valid realization of this specification.

It exists to illustrate the concepts defined by PCP.

The Reference Implementation is informative rather than normative.

Alternative implementations are considered compliant provided they satisfy all normative requirements defined by this specification.

---

# 10. Extensibility

PCP is designed to evolve without breaking existing implementations.

Extensions:

* MUST preserve existing concepts.
* MUST preserve semantic compatibility.
* SHOULD remain backward compatible whenever practical.

Implementations MAY introduce optional capabilities provided they do not redefine normative concepts.

---

# 11. Security Considerations

Project Context may contain sensitive information.

Implementations SHOULD consider:

* access control
* authentication
* authorization
* confidential information
* secret management
* auditability

PCP does not define security mechanisms.

Security remains the responsibility of individual implementations.

---

# 12. Future Evolution

Future revisions of PCP SHALL preserve conceptual compatibility whenever practical.

Breaking conceptual changes SHOULD be introduced only through a major specification revision.

Future versions MAY introduce:

* additional concepts
* optional capabilities
* validation mechanisms
* interoperability improvements

Existing compliant implementations SHOULD remain valid unless explicitly deprecated by a future major version.

---

# Appendix A — Terminology

| Term               | Definition                                                                |
| ------------------ | ------------------------------------------------------------------------- |
| Project            | A bounded initiative possessing identity, purpose, and continuity.        |
| Project Context    | The information required to understand, maintain, and continue a Project. |
| Contributor        | Any entity capable of producing or consuming Project Context.             |
| Project Continuity | The capability of a Project to evolve despite changes in Contributors.    |

---

# Appendix B — Document Relationships

The PCP documentation is organized as follows:

* `README.md` — Project overview
* `docs/CORE_CONCEPTS.md` — Conceptual foundation
* `docs/SPECIFICATION.md` — Normative requirements
* `rfcs/` — Controlled evolution of the specification
* `docs/REFERENCE_IMPLEMENTATION.md` — Example implementation

Each document has a distinct responsibility within the PCP documentation.

---

# Appendix C — Revision History

| Version | Description                             |
| ------- | --------------------------------------- |
| 0.1     | Initial draft of the PCP Specification. |
