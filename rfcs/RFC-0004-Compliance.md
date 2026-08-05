# RFC-0004

## Title

Compliance

## Status

Accepted

---

# Abstract

This RFC defines what it means for an implementation to be PCP compliant.

Compliance is determined by preserved concepts, not by file names, directory structures, or implementation technologies.

---

# Compliance Requirements

A PCP implementation SHALL:

- Preserve all required Core Context concepts.
- Preserve relationships between concepts.
- Keep context human readable or machine interpretable.
- Allow project continuity across contributors.

---

# Non-Requirements

A PCP implementation is NOT required to:

- Use Markdown.
- Use a `.context` directory.
- Follow a specific directory layout.
- Use Git.
- Use any specific AI model.

---

# Reference Implementation

The official reference implementation demonstrates one compliant implementation.

Alternative implementations remain compliant if they satisfy this RFC.

---

# Compatibility Levels

Future versions of PCP MAY define multiple compliance levels.

This RFC defines the baseline compliance model.
