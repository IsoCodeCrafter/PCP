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
1. **Context-First Discovery:** Before suggesting architectural changes or writing code, read \`${contextDir}/manifest.yaml\` and consult the relevant context components.
2. **Preserve Knowledge:** Do not rediscover established decisions. If an architectural choice is already recorded in \`DECISION_LOG.md\`, adhere to it unless an explicit revision is proposed.
3. **Human-in-the-Loop Lifecycle:** When proposing new context entries or status updates, follow the \`READ ➔ UNDERSTAND ➔ PROPOSE ➔ HUMAN APPROVAL ➔ WRITE\` cycle.
4. **Context Integrity:** Always verify that context cross-references and YAML frontmatters remain valid:
   \`\`\`bash
   npx @craftsolutions/pcp check
   \`\`\`
5. **Context Bundling:** For external reasoning or web chat review, active context can be compiled via:
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
