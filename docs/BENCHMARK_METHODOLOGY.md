# PCP Enterprise Evaluation & A/B Benchmark Methodology

**Version:** 1.0 (Normative Evaluation Guide)  
**Target Audience:** Engineering Leaders, CTOs, Enterprise Evaluators, Contributor Teams

---

## 1. Executive Summary & Objective

Enterprise adoption of developer tools cannot rely on subjective claims such as *"PCP works"* or unmeasured assertions like *"drastically reduces costs"*. 

This document defines a reproducible, empirical **A/B Benchmark Protocol** that allows any engineering organization to objectively test and measure whether the **Project Context Protocol (PCP)** delivers measurable improvements in **handoff continuity, architectural compliance, and onboarding efficiency** on their own repositories.

---

## 2. Core Hypothesis

> **Primary Hypothesis:**  
> An autonomous AI agent or human contributor operating with **zero prior conversational memory** will produce a higher rate of architecturally compliant changes with fewer corrective human interventions and lower exploratory overhead when guided by a standardized Project Context (PCP) compared to exploring raw source code and ad-hoc documentation.

---

## 3. Measurable Metrics (Quantitative & Verifiable)

The benchmark strictly measures observables that can be tracked in agent transcript logs and Git commits:

| Metric | Measurement Method | Unit | Significance |
| :--- | :--- | :--- | :--- |
| **M1: Discovery Overhead (Tool Calls)** | Total exploratory tool invocations (`grep`, `find_by_name`, arbitrary file reads) before the first relevant code change. | Count | Measures how much reconnaissance the AI must conduct to locate conventions. |
| **M2: Reconnaissance Input Tokens** | Cumulative token count consumed strictly during repository context discovery prior to code synthesis. | Tokens | Quantifies the computational and economic overhead of rediscovery. |
| **M3: Architectural Compliance Rate** | Binary check: Does the proposed change violate any established architectural decision record (ADR) or domain invariant? | Compliant / Non-Compliant | Evaluates whether historical architectural continuity was maintained or broken. |
| **M4: Convergence Cycles (Human Turns)** | Number of corrective prompt interventions required from a human reviewer before the diff meets repository standards. | Turns | Measures human review friction and developer time saved. |

> [!IMPORTANT]
> **No Unverified Claims:** This methodology does **not** claim "zero hallucination" or fixed percentage cost reductions. Token and latency outcomes vary by model architecture, task domain, and codebase scale.

---

## 4. Benchmark Experimental Protocol

Any team can execute this benchmark within 30–45 minutes using standard AI coding environments (e.g., Cursor, Claude Desktop, Antigravity, Windsurf).

```text
                        Repository Under Test
                                 │
                  ┌──────────────┴──────────────┐
                  ▼                             ▼
        Arm A: Baseline (Raw)         Arm B: PCP-Enabled
        - Clean Chat Session          - Clean Chat Session
        - No Project Context          - Canonical context/
        - Standard file search        - MCP / Rule Bridge
                  │                             │
                  └──────────────┬──────────────┘
                                 ▼
                    Same Synthetic Task Prompt
                                 │
                                 ▼
                     Record Transcript & Diffs
                                 │
                                 ▼
                      Evaluate M1, M2, M3, M4
```

### Step 1: Baseline Candidate Selection
Select a realistic repository containing at least one non-obvious architectural decision or constraint. For example:
- *Constraint DEC-0001:* "Session state MUST be cached in memory via native Map/LRU, not external Redis."
- *Constraint KN-0001:* "All external HTTP client calls MUST pass through the centralized `ApiClient` wrapper with exponential backoff."

### Step 2: Task Formulation
Formulate an identical, objective feature request that touches the constraint without spoon-feeding the solution in the prompt:
> *"Implement a rate-limited analytics tracking endpoint `/api/v1/analytics/track` that records telemetry events and persists session counts."*

### Step 3: Execution of Arm A (Baseline / Unstructured)
1. Open a **brand new, empty chat session** (zero conversation history).
2. Ensure no PCP context directory exists, or configure the agent to ignore `context/`.
3. Submit the task prompt.
4. Record:
   - How many files were inspected (`M1`).
   - Total input tokens consumed (`M2`).
   - Did the generated code import an unapproved external library or violate the established convention? (`M3`).
   - How many human prompts were needed to guide the agent to a compliant solution? (`M4`).

### Step 4: Execution of Arm B (PCP-Enabled)
1. Initialize or retain the standardized `context/` directory with `manifest.yaml`, `ARCHITECTURE.md`, and `DECISION_LOG.md`.
2. Ensure the PCP MCP Server (`pcp mcp`) or editor rule bridge (`pcp sync-rules`) is active.
3. Open a **brand new, empty chat session**.
4. Submit the identical task prompt.
5. Record identical metrics (`M1`, `M2`, `M3`, `M4`).

---

## 5. Sample Evaluation Scorecard

Evaluators record results in a standardized matrix:

```markdown
### PCP Benchmark Run Scorecard
- **Repository:** `acme/billing-api`
- **Model:** Claude 3.5 Sonnet / GPT-4o
- **Date:** 2026-09-08

| Metric | Arm A (Baseline) | Arm B (PCP-Enabled) | Delta (Observed) |
| :--- | :--- | :--- | :--- |
| M1: Discovery File Reads | 14 files | 2 components | -85% exploratory reads |
| M2: Reconnaissance Tokens | 38,400 tokens | 3,100 tokens | Significant reduction |
| M3: Architectural Violation | FAILED (Imported Redis) | PASSED (Used in-memory LRU) | 100% Compliance |
| M4: Human Correction Turns | 3 turns | 1 turn (First-pass clean) | -66% review overhead |
```

---

## 6. Interpretation Criteria & Acceptance Thresholds

An enterprise should consider PCP technically justified if Arm B demonstrates:
1. **Zero Architectural Regression:** The agent adheres to existing ADRs without requiring manual human reminders during the prompt loop.
2. **Deterministic Discovery:** Exploration transitions from heuristic grep searches to deterministic discovery via `context/manifest.yaml`.
3. **Reduced Review Burden:** The human reviewer spends less time acting as an "external architectural memory" for the AI.

---

## 7. Conclusion

PCP does not attempt to make models smarter. It standardizes the **environment and durable memory surrounding the project**. 

By executing this benchmark, organizations obtain empirical proof of whether structured context reduces knowledge rediscovery on their own proprietary codebases.
