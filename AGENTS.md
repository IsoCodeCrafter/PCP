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
1. **Session Handshake (Cold-Start Briefing):**
   - At the beginning of any session or upon first interaction, inspect `context/manifest.yaml`, the latest entry in `context/DECISION_LOG.md`, and active tasks in `context/OPEN_WORK.md`.
   - Provide a concise (3-4 lines max), token-friendly greeting card:
     ```text
     [PCP Active | <project-name>]
     ⚡ Last Decision: DEC-XXXX (<title> - by <author>)
     📋 Active Task: WORK-XXXX (<title>)
     Ready. How should we proceed?
     ```
2. **Context-First Discovery:**
   - Before suggesting architectural changes or writing code, consult the relevant context components.
   - Preserve established knowledge: Never rediscover or contradict past decisions in `DECISION_LOG.md` without an explicit rationale.
3. **Autonomous Context Synchronization (Gravity Matching):**
   - Do NOT ask repetitive confirmation questions like *"Should I record this decision?"*.
   - When introducing structural/architectural changes (new dependencies, schema changes, state management patterns, API contracts) or completing open tasks:
     - Compare against existing entries to match the appropriate abstraction level.
     - Proactively bundle the context update (`DECISION_LOG.md`, `OPEN_WORK.md`, or `KNOWLEDGE.md`) directly into the code change using valid RFC-0001 schema and sequential IDs.
     - Report the context update in your final response summary (e.g., *"Context updated: DEC-0003 & WORK-0001 marked completed"*).
     - The human authorizes the change naturally via Git diff / PR review.
4. **Context Integrity Verification:**
   - Ensure YAML frontmatters, IDs, and cross-references remain valid:
     ```bash
     npx @craftsolutions/pcp check
     ```
5. **Context Bundling:**
   - For external reasoning or web chat review, active context can be compiled via:
     ```bash
     npx @craftsolutions/pcp pack -a
     ```
<!-- PCP_RULES_END -->
