# 📖 PCP for AI-Assisted Developers: "Your Project's Living Memory"

> What is **PCP (Project Context Protocol)**, how does it work, why should you use it, and how to get started in 5 minutes?

---

## 💡 The Problem We All Face

You build an amazing software project using AI coding assistants (Cursor, Claude, ChatGPT, Windsurf, Antigravity, Copilot). Everything goes great on Day 1.

A few days later, you open a fresh chat window:
* The AI has completely forgotten why you chose **PostgreSQL instead of MongoDB** two days ago.
* It ignores a rule you previously established ("Never use library X here") and breaks working code.
* You waste 15 minutes writing long prompts explaining your architecture and rules all over again.
* When a new human teammate joins the repository: *"Where do I start? Why was this built this way?"*

This is called **Context Rot & Context Fragmentation**.

---

## 1. What Does PCP Do?

**PCP (Project Context Protocol)** is your project's **"shared memory box"**.

It is an open standard ensuring that any **human contributor**, **AI assistant**, or **automation tool** looking at the project understands the exact same architecture, constraints, decisions, and roadmap.

> 🎯 **Core Motto:** *"Standardize Context, Not Intelligence."*  
> *(No matter what AI model or tool you switch to, your project's context remains durable, portable, and unbroken.)*

---

## 2. How Does It Work?

PCP places a clean, lightweight `context/` folder directly inside your repository. It contains 5 core components and 1 canonical entry map:

```text
context/
├── manifest.yaml          🗺️ Map: Project identity & component registry
├── ARCHITECTURE.md        🏗️ Architecture: Structural design & boundaries
├── DECISION_LOG.md        ⚖️ Decisions: Why X was chosen & trade-offs
├── KNOWLEDGE.md           🧠 Knowledge: Rules, conventions, domain knowledge
├── OPEN_WORK.md           📋 Open Work: Next priorities & technical debt
└── OPERATIONAL_GUIDE.md   🛠️ Guide: Setup, build, testing, and deployment
```

### 🪄 The Hybrid Format
Documents are written in **clean human-readable Markdown**, supplemented with structured **YAML Frontmatter headers** so that AI agents, CLI linters, and CI workflows can validate them deterministically with zero ambiguity.

---

## 3. Why Use PCP? (Key Advantages)

| Advantage | What It Gives You |
| :--- | :--- |
| 🛡️ **Zero Broken Code from AI** | The AI understands the architectural boundaries and doesn't hallucinate conflicting structures. |
| ⚡ **Save Time & Prompt Tokens** | Stop writing 5-paragraph explanations in every new chat. The AI reads the context directly. |
| 🔍 **Automated Linter (`pcp check`)** | Catch missing decisions or broken cross-references (`DEC-xxxx`) in 1 second. |
| 🤝 **Human & AI Parity** | Human developers and AI assistants collaborate from the exact same Single Source of Truth (SSOT). |

---

## 4. How Does PCP Compare to Existing Tools?

| Solution | Why It Falls Short | How PCP Solves It |
| :--- | :--- | :--- |
| **README.md** | Surface-level landing page; lacks structured decision logs and AI constraints. | 6 mandatory deep-context components. |
| **Notion / Jira / Linear** | External to code repository; AI cannot query it while coding in IDE. | Lives directly in the Git repository alongside code. |
| **.cursorrules** | Locked to Cursor; useless in Claude Desktop, VS Code, or other tools. | Universal open standard working across all AI tools. |
| **Model Context Protocol (MCP)** | MCP is a **communication pipe** (transport). | PCP is the **standard context payload** flowing through that pipe. |

---

## 5. Quickstart (4 Simple Steps)

### 1. Initialize Context in Your Project
```bash
npx @craftsolutions/pcp init --name "My Awesome App"
```

### 2. Connect Your AI Assistant via MCP (Cursor / Claude / Antigravity)
Add this to your editor's MCP settings:
```json
{
  "mcpServers": {
    "pcp": {
      "command": "npx",
      "args": ["-y", "@craftsolutions/pcp", "mcp"]
    }
  }
}
```

### 3. Develop Collaboratively with AI
Prompt your AI:
> *"Read the PCP context, design the new auth module according to project rules, and propose a new decision for my approval."*

The AI reads `KNOWLEDGE.md`, writes compliant code, and prepares a standard `DEC-xxxx` block for your review.

### 4. Verify Context Conformance
```bash
npx @craftsolutions/pcp check
```
*(Returns exit code `0` and a green confirmation when all schema and reference integrity checks pass!)*
