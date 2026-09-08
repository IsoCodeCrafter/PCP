<!-- PCP_RULES_START -->
## 📌 Project Context Protocol (PCP) Directives
> Automatically synced by PCP CLI (v0.1.2). Do not edit between boundary markers.

This repository adheres to the **Project Context Protocol (PCP)** standard for preserving, organizing, and maintaining persistent project continuity across human and AI contributors.

### 🧭 Context Location & Architecture
- **Canonical Entry Point:** `context/manifest.yaml`
- **Core Knowledge Components:**
  - `context/ARCHITECTURE.md`: Structural boundaries, component domains, and non-negotiable architectural constraints.
  - `context/DECISION_LOG.md`: Historical architectural decision records (ADRs) with rationale and consequences.
  - `context/KNOWLEDGE.md`: Durable domain rules, business invariants, and technical conventions.
  - `context/OPEN_WORK.md`: Active tasks, priority backlog items, and technical debt tracking.
  - `context/OPERATIONAL_GUIDE.md`: Setup, testing, contribution, deployment, and operational runbooks.

### 🤖 AI Contributor Protocol
1. **Context-First Discovery:** Before suggesting architectural changes or writing code, read `context/manifest.yaml` and consult the relevant context components.
2. **Preserve Knowledge:** Do not rediscover established decisions. If an architectural choice is already recorded in `DECISION_LOG.md`, adhere to it unless an explicit revision is proposed.
3. **Human-in-the-Loop Lifecycle:** When proposing new context entries or status updates, follow the `READ ➔ UNDERSTAND ➔ PROPOSE ➔ HUMAN APPROVAL ➔ WRITE` cycle.
4. **Context Integrity:** Always verify that context cross-references and YAML frontmatters remain valid:
   ```bash
   npx @craftsolutions/pcp check
   ```
5. **Context Bundling:** For external reasoning or web chat review, active context can be compiled via:
   ```bash
   npx @craftsolutions/pcp pack -a
   ```
<!-- PCP_RULES_END -->
