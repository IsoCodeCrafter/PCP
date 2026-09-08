import fs from "node:fs";
import path from "node:path";
import { parseManifest, parseMarkdownEntries } from "../core/parser.js";
import { VERSION } from "../utils/version.js";

/**
 * Reads and compiles a lightweight summary of the current PCP context.
 * 
 * @param {string} [projectDir='.']
 * @param {object} [options]
 * @param {string} [options.contextDir='context']
 * @returns {object} Status summary object
 */
export function getStatusSummary(projectDir = ".", options = {}) {
  const resolvedRoot = path.resolve(projectDir);
  const contextDirName = options.contextDir || "context";
  const contextPath = path.join(resolvedRoot, contextDirName);
  const manifestPath = path.join(contextPath, "manifest.yaml");

  if (!fs.existsSync(manifestPath)) {
    return {
      active: false,
      contextPath,
      reason: `No PCP manifest found at: ${manifestPath}`
    };
  }

  const manifest = parseManifest(manifestPath);
  const projectName = manifest.project?.name || path.basename(resolvedRoot);
  const projectVersion = manifest.project?.version || "v0.1.0";
  const pcpVersion = manifest.pcp_version || VERSION;

  // 1. Last Decision
  let lastDecision = null;
  const decRelative = manifest.components?.decisions?.path || "DECISION_LOG.md";
  const decPath = path.join(contextPath, decRelative);
  if (fs.existsSync(decPath)) {
    try {
      const decEntries = parseMarkdownEntries(decPath);
      if (decEntries.length > 0) {
        const last = decEntries[decEntries.length - 1].frontmatter;
        lastDecision = {
          id: last.id,
          title: last.title,
          status: last.status,
          date: last.date,
          contributors: last.contributors || (last.author ? [last.author] : [])
        };
      }
    } catch {
      // Graceful fallback
    }
  }

  // 2. Open Work (Active Tasks)
  let activeTasks = [];
  const workRelative = manifest.components?.open_work?.path || "OPEN_WORK.md";
  const workPath = path.join(contextPath, workRelative);
  if (fs.existsSync(workPath)) {
    try {
      const workEntries = parseMarkdownEntries(workPath);
      activeTasks = workEntries
        .map((e) => e.frontmatter)
        .filter((t) => {
          const s = String(t.status || "").toLowerCase();
          return !["completed", "closed", "resolved", "superseded", "cancelled"].includes(s);
        });
    } catch {
      // Graceful fallback
    }
  }

  return {
    active: true,
    contextPath,
    projectName,
    projectVersion,
    pcpVersion,
    lastDecision,
    activeTasks: {
      count: activeTasks.length,
      top: activeTasks[0] || null
    }
  };
}

/**
 * Formats a terminal box around lines of text.
 * 
 * @param {string[]} lines
 * @param {number} [targetWidth=66]
 * @returns {string}
 */
export function formatBox(lines, targetWidth = 66) {
  // Strip ANSI escapes for length calculation
  const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, "");

  const maxContentLength = lines.reduce((max, line) => {
    const len = stripAnsi(line).length;
    return len > max ? len : max;
  }, 0);

  const innerWidth = Math.max(targetWidth - 4, maxContentLength);
  const topBorder = `┌${"─".repeat(innerWidth + 2)}┐`;
  const bottomBorder = `└${"─".repeat(innerWidth + 2)}┘`;

  const boxedLines = lines.map((line) => {
    const visibleLength = stripAnsi(line).length;
    const padding = " ".repeat(Math.max(0, innerWidth - visibleLength));
    return `│ ${line}${padding} │`;
  });

  return [topBorder, ...boxedLines, bottomBorder].join("\n");
}

/**
 * Handles the 'pcp status' CLI command.
 * 
 * @param {object} options
 */
export function statusCommand(options = {}) {
  const projectDir = options.dir || ".";
  const contextDir = options.contextDir || "context";

  if (options.alias) {
    console.log(`
# ─── PCP Shell Alias Integration ─────────────────────────────
# Add the following lines to your ~/.zshrc or ~/.bashrc:

agy() {
  if [ -f "context/manifest.yaml" ]; then
    pcp status
  fi
  command agy "$@"
}

claude() {
  if [ -f "context/manifest.yaml" ]; then
    pcp status
  fi
  command claude "$@"
}
# ─────────────────────────────────────────────────────────────
`);
    return;
  }

  const summary = getStatusSummary(projectDir, { contextDir });

  if (!summary.active) {
    if (options.json) {
      console.log(JSON.stringify(summary, null, 2));
    } else {
      console.error(`PCP Inactive: ${summary.reason}`);
    }
    process.exit(1);
  }

  if (options.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  const reset = "\x1b[0m";
  const bold = "\x1b[1m";
  const cyan = "\x1b[36m";
  const yellow = "\x1b[33m";
  const green = "\x1b[32m";
  const dim = "\x1b[2m";

  // Decision line
  let decisionText = `${dim}None recorded${reset}`;
  if (summary.lastDecision) {
    const authorText = summary.lastDecision.contributors?.length > 0
      ? ` ${dim}(by ${summary.lastDecision.contributors[0]})${reset}`
      : "";
    decisionText = `${bold}${summary.lastDecision.id}${reset}: ${summary.lastDecision.title}${authorText}`;
  }

  // Work line
  let workText = `${green}None (All tasks completed)${reset}`;
  if (summary.activeTasks.count > 0) {
    const moreText = summary.activeTasks.count > 1 ? ` ${dim}[+${summary.activeTasks.count - 1} more]${reset}` : "";
    workText = `${yellow}${summary.activeTasks.top.id}${reset}: ${summary.activeTasks.top.title}${moreText}`;
  }

  if (options.compact) {
    console.log(`[PCP Active | ${summary.projectName} (${summary.projectVersion})]`);
    console.log(`⚡ Last Decision: ${summary.lastDecision ? summary.lastDecision.id + ' (' + summary.lastDecision.title + ')' : 'None'}`);
    console.log(`📋 Active Task: ${summary.activeTasks.count > 0 ? summary.activeTasks.top.id + ' (' + summary.activeTasks.top.title + ')' : 'None (All completed)'}`);
    return;
  }

  const lines = [
    `🧭 ${bold}${cyan}PCP Active:${reset} ${bold}${summary.projectName}${reset} ${dim}(${summary.projectVersion})${reset}`,
    `⚡ ${bold}Last Decision:${reset} ${decisionText}`,
    `📋 ${bold}Active Task:${reset} ${workText}`
  ];

  console.log(formatBox(lines));
}
