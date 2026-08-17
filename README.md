# PCP

## **Standardize Context, Not Intelligence.**

### **One Project Context. Every Contributor.**

PCP (**Project Context Protocol**) is an open standard for preserving, organizing, and transferring project context so any contributor—human, AI, or automation—can continue a software project consistently, regardless of who or what takes over next.

---

# Why PCP?

Software projects lose continuity every day.

Knowledge stays inside people's heads.

Important decisions disappear in chat histories.

Documentation becomes outdated.

AI assistants start from scratch because project context is fragmented.

New contributors spend valuable time rediscovering information that already exists.

As projects grow, context becomes scattered across documentation, source code, issue trackers, chats, and individual experience.

**PCP exists to preserve project continuity.**

---

# 🚀 Start Here

> 📖 **New to PCP?** Read our practical beginner guides:
> * 🇹🇷 [Türkçe Rehber (5 Dakikada PCP)](docs/GUIDE_TR.md)
> * 🇬🇧 [PCP Explained for AI Developers](docs/PCP_EXPLAINED.md)

---

## ⚡ Quickstart (CLI & MCP)

### 1. Initialize Context in Any Repository
```bash
npx @pcp/cli init --name "My Project"
```

### 2. Verify Context Integrity (Linter)
```bash
npx @pcp/cli check
```

### 3. Connect to AI Assistants via MCP (Cursor / Claude / Antigravity)
Add this to your IDE's MCP configuration:
```json
{
  "mcpServers": {
    "pcp": {
      "command": "npx",
      "args": ["-y", "@pcp/cli", "mcp"]
    }
  }
}
```

---

# 🔍 Why PCP vs Other Solutions?

| Solution | Limitation | PCP Advantage |
| :--- | :--- | :--- |
| **README.md** | Surface-level landing page; lacks structured decision logs and rules. | 6 mandatory deep-context components. |
| **Notion / Jira** | External to code repository; AI cannot query it while coding. | Lives directly in the Git repository alongside code. |
| **.cursorrules** | Locked to Cursor; useless in Claude Desktop, VS Code, etc. | Universal open standard working across all AI tools. |
| **MCP** | MCP is the **pipe** (transport). | PCP is the **standard context payload** flowing through that pipe. |

---

# Repository Guide

| Goal                       | Location                      |
| -------------------------- | ----------------------------- |
| 🇹🇷 Türkçe Tanıtım Rehberi   | `docs/GUIDE_TR.md`            |
| 🇬🇧 Practical Guide         | `docs/PCP_EXPLAINED.md`       |
| Understand the vision      | `VISION.md`                   |
| Understand the philosophy  | `MANIFESTO.md`                |
| Learn the principles       | `docs/CORE_PRINCIPLES.md`     |
| Learn the concepts         | `docs/CORE_CONCEPTS.md`       |
| Read the specification     | `docs/SPECIFICATION.md`       |
| Accepted RFCs              | `rfcs/RFC-0001-Core-Context-Model.md` |
| Official CLI & MCP Server  | `cli/`                        |
| Copy the official template | `reference/context-template/` |
| Explore a working example  | `examples/simple-project/`    |
| See open work              | `docs/OPEN_WORK.md`           |

---

# What is PCP?

PCP defines a shared Project Context standard.

Instead of teaching every AI system how your project works, PCP standardizes the information surrounding the project itself.

This enables:

* Humans
* AI assistants
* Autonomous agents
* Development tools
* Future contributors

to work from the same understanding of a project.

---

# The Core Idea

Software projects should not depend on memory.

They should depend on shared context.

PCP creates a single, structured Project Context that survives:

* contributor changes
* AI model changes
* team growth
* long development pauses
* tooling evolution

One project.

One context.

Every contributor.

---

# Core Principles

* Context over conversations
* Continuity over memory
* Concepts over files
* Open by design
* Human and AI collaboration
* Preserve knowledge, don't rediscover it
* Standardize context, not tools

---

# How PCP Works

```text
Contributor
      │
      ▼
Project Context
      │
      ▼
Next Contributor
      │
      ▼
Project Continuity
```

Every contributor reads from the same Project Context.

Every contributor leaves the project with better context than they found.

---

# What PCP Is

PCP is:

* An open standard
* A Project Context Protocol
* A continuity-first approach to software development
* Human and AI friendly
* Technology independent
* Implementation independent

---

# What PCP Is Not

PCP is **not**:

* an AI framework
* an agent framework
* a prompt library
* a project management tool
* a documentation platform
* a version control system
* a knowledge base application

PCP standardizes **context**, not intelligence, tools, or workflows.

---

# Reference Implementation

This repository contains the official reference implementation of PCP.

The reference implementation uses Markdown documents to demonstrate the concepts defined by the specification.

Alternative implementations may use different file formats, databases, or storage systems, provided they preserve the required concepts defined by the specification.

**The specification defines concepts.**

**Reference implementations demonstrate practical implementations.**

---

# Repository Structure

```text
docs/           Specifications and documentation
rfcs/           Design decisions and proposals
reference/      Official reference implementation
examples/       Example projects
assets/         Images and diagrams
scripts/        Development utilities
```

---

# Project Status

> ⚠️ **Active Design**

PCP is currently in the specification phase.

The priority is building a stable conceptual foundation before developing tooling and integrations.

---

# Roadmap

* Complete PCP Specification v0.1
* Publish Reference Context Template
* Expand example projects
* Build the Compliance Validator
* Develop the PCP CLI
* Publish VS Code integration
* Publish MCP integration
* Release PCP v1.0

---

# Vision

We believe software projects should be able to continue regardless of who—or what—takes over.

Project continuity should not depend on memory.

It should depend on a shared, structured, and portable Project Context.

---

# Philosophy

**Don't preserve conversations.**

**Preserve context.**

---

# License

MIT License.
