import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";
import { parseManifest, parseMarkdownStringEntries, getDocumentPrologue } from "./parser.js";
import { VERSION } from "../utils/version.js";

const COMPONENT_ALIASES = {
  arch: "architecture",
  architecture: "architecture",
  dec: "decisions",
  decision: "decisions",
  decisions: "decisions",
  decision_log: "decisions",
  kn: "knowledge",
  knowledge: "knowledge",
  work: "open_work",
  open_work: "open_work",
  "open-work": "open_work",
  tasks: "open_work",
  ops: "operational_guide",
  oper: "operational_guide",
  operational_guide: "operational_guide",
  "operational-guide": "operational_guide"
};

const INACTIVE_STATUSES = new Set([
  "completed",
  "done",
  "superseded",
  "deprecated",
  "abandoned",
  "closed",
  "rejected",
  "archived"
]);

/**
 * Compiles project context into a consolidated, token-optimized bundle.
 * 
 * @param {string} contextDir Target context directory (default: './context')
 * @param {object} options Packaging options
 * @param {boolean} [options.activeOnly=false] Filter out completed, superseded, and deprecated entries
 * @param {string|string[]} [options.components] Specific component(s) to pack
 * @param {string} [options.format='markdown'] Output format ('markdown' | 'json')
 * @returns {{ output: string, format: string, stats: object, manifest: object }}
 */
export function packContext(contextDir = "./context", options = {}) {
  const resolvedDir = path.resolve(contextDir);
  const manifestPath = path.join(resolvedDir, "manifest.yaml");

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest file not found at ${manifestPath}`);
  }

  const manifest = parseManifest(manifestPath);
  const project = manifest.project || {};
  const pcpVersion = manifest.pcp_version || "0.1";
  const schemaVersion = manifest.schema_version || "1.0";

  const activeOnly = Boolean(options.activeOnly);
  const format = options.format === "json" ? "json" : "markdown";

  // Resolve requested components filter
  let requestedComponents = null;
  if (options.components) {
    if (Array.isArray(options.components)) {
      requestedComponents = options.components;
    } else if (typeof options.components === "string") {
      requestedComponents = options.components.split(",");
    }
    requestedComponents = requestedComponents
      .map((c) => String(c).trim().toLowerCase())
      .filter(Boolean);
  }

  const availableComponents = manifest.components || {};
  const matchedKeys = [];

  for (const key of Object.keys(availableComponents)) {
    if (!requestedComponents || requestedComponents.length === 0) {
      matchedKeys.push(key);
    } else {
      const isMatched = requestedComponents.some((req) => {
        const canonical = COMPONENT_ALIASES[req] || req;
        return canonical === key || key.toLowerCase() === req;
      });
      if (isMatched) {
        matchedKeys.push(key);
      }
    }
  }

  if (matchedKeys.length === 0 && requestedComponents && requestedComponents.length > 0) {
    throw new Error(`No matching components found for: ${requestedComponents.join(", ")}`);
  }

  const packedComponents = [];
  let totalEntriesCount = 0;
  let activeEntriesCount = 0;

  for (const key of matchedKeys) {
    const compConfig = availableComponents[key];
    const compPath = compConfig.path || `${key.toUpperCase()}.md`;
    const fullPath = path.isAbsolute(compPath) ? compPath : path.join(resolvedDir, compPath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Component file not found: ${fullPath} (defined in manifest for '${key}')`);
    }

    const rawContent = fs.readFileSync(fullPath, "utf8");
    const allEntries = parseMarkdownStringEntries(rawContent);
    totalEntriesCount += allEntries.length;

    let finalContent = "";
    let includedEntries = allEntries;

    if (activeOnly) {
      includedEntries = allEntries.filter((e) => {
        const st = String(e.frontmatter?.status || "").toLowerCase().trim();
        return !INACTIVE_STATUSES.has(st);
      });
      activeEntriesCount += includedEntries.length;

      const prologue = getDocumentPrologue(rawContent);
      const chunks = [];
      if (prologue) {
        chunks.push(prologue);
      }

      if (includedEntries.length > 0) {
        for (const entry of includedEntries) {
          const formattedFm = yaml.stringify(entry.frontmatter).trim();
          const bodyPart = entry.body ? `\n\n${entry.body}` : "";
          chunks.push(`---\n${formattedFm}\n---${bodyPart}`);
        }
      } else if (allEntries.length > 0) {
        chunks.push(`*(All ${allEntries.length} entries in this component are completed, superseded, or inactive.)*`);
      }

      finalContent = chunks.join("\n\n").trim();
    } else {
      activeEntriesCount += allEntries.filter((e) => {
        const st = String(e.frontmatter?.status || "").toLowerCase().trim();
        return !INACTIVE_STATUSES.has(st);
      }).length;
      finalContent = rawContent.trim();
    }

    const displayName = key
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    packedComponents.push({
      key,
      displayName,
      path: compPath,
      entriesCount: includedEntries.length,
      totalInFile: allEntries.length,
      entries: includedEntries.map((e) => ({
        id: e.frontmatter.id,
        title: e.frontmatter.title,
        status: e.frontmatter.status,
        tags: e.frontmatter.tags || []
      })),
      content: finalContent
    });
  }

  const nowIso = new Date().toISOString();
  const title = project.name || "Project Context";
  const projectId = project.id ? ` (${project.id})` : "";
  const modeDescription = activeOnly ? "Active Items Only" : "Full Context";

  if (format === "json") {
    const jsonResult = {
      project: {
        id: project.id || null,
        name: project.name || null,
        description: project.description || null
      },
      meta: {
        generator: `@craftsolutions/pcp (v${VERSION})`,
        generated_at: nowIso,
        pcp_version: pcpVersion,
        schema_version: schemaVersion,
        mode: modeDescription,
        active_only: activeOnly
      },
      stats: {
        total_components: packedComponents.length,
        total_entries: activeOnly ? activeEntriesCount : totalEntriesCount,
        estimated_tokens: 0
      },
      components: packedComponents.map((c) => ({
        key: c.key,
        display_name: c.displayName,
        path: c.path,
        entries_count: c.entriesCount,
        entries: c.entries,
        content: c.content
      }))
    };

    const jsonString = JSON.stringify(jsonResult, null, 2);
    const estimatedTokens = Math.round(jsonString.length / 4);
    jsonResult.stats.estimated_tokens = estimatedTokens;

    return {
      output: JSON.stringify(jsonResult, null, 2),
      format: "json",
      stats: {
        totalComponents: packedComponents.length,
        totalEntries: activeOnly ? activeEntriesCount : totalEntriesCount,
        characters: jsonString.length,
        estimatedTokens,
        activeOnly
      },
      manifest
    };
  }

  // Markdown format
  const lines = [];
  lines.push(`# 📦 Project Context Bundle: ${title}${projectId}`);
  lines.push("");
  lines.push(`> **Generated:** ${nowIso} by PCP CLI (v${VERSION})`);
  lines.push(`> **PCP Standard:** v${pcpVersion} | **Schema:** ${schemaVersion}`);
  lines.push(`> **Mode:** ${modeDescription} | **Components:** ${packedComponents.length} | **Entries:** ${activeOnly ? activeEntriesCount : totalEntriesCount}`);
  lines.push("");

  if (project.description) {
    lines.push(`**Project Summary:** ${project.description}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("## 📋 Table of Contents");
  for (let i = 0; i < packedComponents.length; i++) {
    const comp = packedComponents[i];
    const anchor = `${i + 1}-${comp.displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    lines.push(`${i + 1}. [${comp.displayName}](#${anchor}) (\`${comp.path}\`) — *${comp.entriesCount} entries*`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  for (let i = 0; i < packedComponents.length; i++) {
    const comp = packedComponents[i];
    lines.push(`## ${i + 1}. ${comp.displayName} (\`${comp.path}\`)`);
    lines.push("");
    lines.push(comp.content);
    lines.push("");
    if (i < packedComponents.length - 1) {
      lines.push("---");
      lines.push("");
    }
  }

  const outputMarkdown = lines.join("\n");
  const estimatedTokens = Math.round(outputMarkdown.length / 4);

  return {
    output: outputMarkdown,
    format: "markdown",
    stats: {
      totalComponents: packedComponents.length,
      totalEntries: activeOnly ? activeEntriesCount : totalEntriesCount,
      characters: outputMarkdown.length,
      estimatedTokens,
      activeOnly
    },
    manifest
  };
}
