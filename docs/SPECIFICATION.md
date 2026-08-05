# PCP Specification

**Version:** 0.1 (Draft)

---

# 1. Introduction

The Project Context Protocol (PCP) defines a standardized conceptual model for preserving, organizing, and transferring project context.

The objective of PCP is to improve project continuity by ensuring that the information required to understand, maintain, and evolve a project remains accessible and consistent across contributors, tools, and time.

PCP defines concepts and normative requirements rather than implementation technologies. It is independent of programming languages, storage formats, development environments, and software tooling.

The specification establishes a common foundation that enables different implementations to exchange and preserve project context while remaining interoperable at the conceptual level.

The primary goal of PCP is to reduce unnecessary rediscovery of project knowledge and to enable efficient project continuation regardless of changes in contributors.

---

# 2. Scope

This specification defines the conceptual and normative foundation of the Project Context Protocol (PCP).

Specifically, this specification defines:

* The core concepts of PCP.
* The normative requirements for PCP-compliant implementations.
* The relationship between Project Context and its contributors.
* The requirements for preserving project continuity.
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
.

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

---

Future revisions of this specification MAY reference additional standards where appropriate. Such references do not alter the conceptual model of PCP unless explicitly stated.


---

# 5. Conceptual Model

Reference:

docs/CORE_CONCEPTS.md

Defines the conceptual foundation of PCP.

---

# 6. Project Context Model

Defines the required components of Project Context.

Including but not limited to:

* Decisions
* Knowledge
* Current State
* Open Work
* Architecture
* Operational Guide

---

# 7. Requirements

Normative requirements for PCP-compliant implementations.

Requirements are expressed using RFC 2119 terminology.

---

# 8. Conformance

Defines what constitutes a PCP-compliant implementation.

Compliance levels.

Mandatory concepts.

Optional extensions.

---

# 9. Reference Implementation

Defines the official reference implementation.

Clarifies the relationship between concepts and concrete implementations.

---

# 10. Extensibility

Guidelines for extending PCP without breaking compatibility.

Versioning principles.

---

# 11. Security Considerations

Potential risks.

Sensitive information.

Access control.

Secrets.

Project privacy.

---

# 12. Future Evolution

Compatibility strategy.

Deprecation policy.

Migration principles.

---

# Appendix A — Terminology

Quick reference for important PCP terms.

---

# Appendix B — Document Structure

Relationship between:

* README
* Core Concepts
* Specification
* RFCs
* Reference Implementation

---

# Appendix C — Revision History

Version history of the specification.
