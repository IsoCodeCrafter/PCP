import fs from "node:fs";
import path from "node:path";
import { VERSION } from "../utils/version.js";

export const PCP_RULES_START_MARKER = "<!-- PCP_RULES_START -->";
export const PCP_RULES_END_MARKER = "<!-- PCP_RULES_END -->";

export const SUPPORTED_TARGETS = {
  cursor: {
    name: "Cursor IDE",
    file: ".cursorrules"
  },
  claude: {
    name: "Claude (Desktop & Code)",
    file: "CLAUDE.md"
  },
  copilot: {
    name: "GitHub Copilot",
    file: path.join(".github", "copilot-instructions.md")
  },
  windsurf: {
    name: "Windsurf IDE",
    file: ".windsurfrules"
  }
};

/**
 * Generates the standardized PCP instruction block.
 * 
 * @param {object} [options]
 * @param {string} [options.contextDir='context'] Relative path to context directory
 * @returns {string} Formatted markdown rule block with boundary markers
 */
export function generatePcpRuleContent(options = {}) {
  const contextDir = options.contextDir || "context";

  return `${PCP_RULES_START_MARKER}
## 📌 Project Context Protocol (PCP) Directives
> Automatically synced by PCP CLI (v${VERSION}). Do not edit between boundary markers.

This repository adheres to the **Project Context Protocol (PCP)** standard for preserving, organizing, and maintaining persistent project continuity across human and AI contributors.

### 🧭 Context Location & Architecture
- **Canonical Entry Point:** \`${contextDir}/manifest.yaml\`
- **Core Knowledge Components:**
  - \`${contextDir}/ARCHITECTURE.md\`: Structural boundaries, component domains, and non-negotiable architectural constraints.
  - \`${contextDir}/DECISION_LOG.md\`: Historical architectural decision records (ADRs) with rationale and consequences.
  - \`${contextDir}/KNOWLEDGE.md\`: Durable domain rules, business invariants, and technical conventions.
  - \`${contextDir}/OPEN_WORK.md\`: Active tasks, priority backlog items, and technical debt tracking.
  - \`${contextDir}/OPERATIONAL_GUIDE.md\`: Setup, testing, contribution, deployment, and operational runbooks.

### 🤖 AI Contributor Protocol
1. **Session Handshake (Cold-Start Briefing):**
   - At the beginning of any session or upon first interaction, inspect \`${contextDir}/manifest.yaml\`, the latest entry in \`${contextDir}/DECISION_LOG.md\`, and active tasks in \`${contextDir}/OPEN_WORK.md\`.
   - Provide a concise (3-4 lines max), token-friendly greeting card:
     \`\`\`text
     [PCP Active | <project-name>]
     ⚡ Last Decision: DEC-XXXX (<title> - by <author>)
     📋 Active Task: WORK-XXXX (<title>)
     Ready. How should we proceed?
     \`\`\`
2. **Context-First Discovery:**
   - Before suggesting architectural changes or writing code, consult the relevant context components.
   - Preserve established knowledge: Never rediscover or contradict past decisions in \`DECISION_LOG.md\` without an explicit rationale.
3. **Autonomous Context Synchronization (Gravity Matching):**
   - Do NOT ask repetitive confirmation questions like *"Should I record this decision?"*.
   - When introducing structural/architectural changes (new dependencies, schema changes, state management patterns, API contracts) or completing open tasks:
     - Compare against existing entries to match the appropriate abstraction level.
     - Proactively bundle the context update (\`DECISION_LOG.md\`, \`OPEN_WORK.md\`, or \`KNOWLEDGE.md\`) directly into the code change using valid RFC-0001 schema and sequential IDs.
     - Report the context update in your final response summary (e.g., *"Context updated: DEC-0003 & WORK-0001 marked completed"*).
     - The human authorizes the change naturally via Git diff / PR review.
4. **Context Integrity Verification:**
   - Ensure YAML frontmatters, IDs, and cross-references remain valid:
     \`\`\`bash
     npx @craftsolutions/pcp check
     \`\`\`
5. **Context Bundling:**
   - For external reasoning or web chat review, active context can be compiled via:
     \`\`\`bash
     npx @craftsolutions/pcp pack -a
     \`\`\`
${PCP_RULES_END_MARKER}`;
}

/**
 * Injects or updates the PCP instruction block within existing file content.
 * Preserves user-defined rules outside the boundary markers.
 * 
 * @param {string} existingContent Existing file content
 * @param {string} blockContent New PCP rule block
 * @returns {{ content: string, action: 'created' | 'updated' | 'unchanged' }}
 */
export function mergeRuleContent(existingContent, blockContent) {
  if (!existingContent || existingContent.trim().length === 0) {
    return {
      content: `${blockContent}\n`,
      action: "created"
    };
  }

  const startIndex = existingContent.indexOf(PCP_RULES_START_MARKER);
  const endIndex = existingContent.indexOf(PCP_RULES_END_MARKER);

  if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
    const before = existingContent.slice(0, startIndex).trimEnd();
    const after = existingContent.slice(endIndex + PCP_RULES_END_MARKER.length).trimStart();

    const existingBlock = existingContent.slice(startIndex, endIndex + PCP_RULES_END_MARKER.length).trim();
    if (existingBlock === blockContent.trim()) {
      return {
        content: existingContent,
        action: "unchanged"
      };
    }

    const parts = [];
    if (before.length > 0) parts.push(before);
    parts.push(blockContent);
    if (after.length > 0) parts.push(after);

    return {
      content: `${parts.join("\n\n")}\n`,
      action: "updated"
    };
  }

  // File exists but does not have the PCP block yet: append cleanly
  const trimmed = existingContent.trim();
  return {
    content: `${trimmed}\n\n${blockContent}\n`,
    action: "updated"
  };
}

/**
 * Synchronizes PCP rules across specified editor and agent rule files.
 * 
 * @param {string} projectDir Root directory of the repository
 * @param {object} [options]
 * @param {string|string[]} [options.targets] Target editor keys ('cursor', 'claude', 'copilot', 'windsurf', or 'all')
 * @param {string} [options.contextDir='context'] Relative path to context directory
 * @param {boolean} [options.dryRun=false] If true, simulates changes without writing to disk
 * @returns {{ results: Array<{ target: string, name: string, file: string, path: string, action: string }>, dryRun: boolean }}
 */
export function syncRules(projectDir = ".", options = {}) {
  const resolvedRoot = path.resolve(projectDir);
  const contextDir = options.contextDir || "context";
  const dryRun = Boolean(options.dryRun);

  let targetKeys = [];
  if (!options.targets || options.targets === "all" || (Array.isArray(options.targets) && options.targets.includes("all"))) {
    targetKeys = ["cursor", "claude", "copilot"];
  } else if (Array.isArray(options.targets)) {
    targetKeys = options.targets.map((t) => String(t).trim().toLowerCase());
  } else if (typeof options.targets === "string") {
    targetKeys = options.targets.split(",").map((t) => t.trim().toLowerCase());
  }

  // Filter out duplicates and validate
  targetKeys = [...new Set(targetKeys)].filter(Boolean);

  const ruleBlock = generatePcpRuleContent({ contextDir });
  const results = [];

  for (const key of targetKeys) {
    const targetConfig = SUPPORTED_TARGETS[key];
    if (!targetConfig) {
      throw new Error(`Unsupported target editor: '${key}'. Supported: ${Object.keys(SUPPORTED_TARGETS).join(", ")}`);
    }

    const filePath = path.join(resolvedRoot, targetConfig.file);
    const fileExists = fs.existsSync(filePath);
    const existingContent = fileExists ? fs.readFileSync(filePath, "utf8") : "";

    const { content: updatedContent, action } = mergeRuleContent(existingContent, ruleBlock);

    if (!dryRun && action !== "unchanged") {
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, updatedContent, "utf8");
    }

    results.push({
      target: key,
      name: targetConfig.name,
      file: targetConfig.file,
      path: filePath,
      action
    });
  }

  return {
    results,
    dryRun
  };
}
