import fs from "node:fs";
import path from "node:path";
import { parseManifest, parseMarkdownEntries } from "./parser.js";

const VALID_STATUSES = new Set([
  "active",
  "proposed",
  "accepted",
  "rejected",
  "deprecated",
  "superseded",
  "open",
  "in_progress",
  "blocked",
  "completed",
  "cancelled"
]);

/**
 * Validates a PCP context directory.
 * 
 * @param {string} contextDir Absolute path to the context directory
 * @returns {object} Validation result
 */
export function validateContext(contextDir) {
  const result = {
    valid: true,
    errors: [],
    warnings: [],
    stats: {
      totalComponents: 0,
      totalEntries: 0,
      entriesByType: {},
      declaredIds: []
    }
  };

  const manifestPath = path.join(contextDir, "manifest.yaml");

  // 1. Check Manifest existence
  if (!fs.existsSync(manifestPath)) {
    result.valid = false;
    result.errors.push({
      file: "manifest.yaml",
      message: `Missing canonical manifest file at: ${manifestPath}`
    });
    return result;
  }

  // 2. Parse Manifest
  let manifest;
  try {
    manifest = parseManifest(manifestPath);
  } catch (err) {
    result.valid = false;
    result.errors.push({
      file: "manifest.yaml",
      message: err.message
    });
    return result;
  }

  // Check required manifest fields
  if (!manifest.pcp_version) {
    result.errors.push({
      file: "manifest.yaml",
      message: "Missing required 'pcp_version' field in manifest.yaml"
    });
  }

  if (!manifest.project || !manifest.project.name) {
    result.errors.push({
      file: "manifest.yaml",
      message: "Missing 'project.name' in manifest.yaml"
    });
  }

  if (!manifest.components || typeof manifest.components !== "object") {
    result.errors.push({
      file: "manifest.yaml",
      message: "Missing or invalid 'components' mapping in manifest.yaml"
    });
    result.valid = result.errors.length === 0;
    return result;
  }

  const allEntries = [];
  const idToEntryMap = new Map();

  // 3. Inspect each component
  for (const [componentName, componentConfig] of Object.entries(manifest.components)) {
    result.stats.totalComponents++;
    const compPath = componentConfig.path || `${componentName.toUpperCase()}.md`;
    const fullPath = path.isAbsolute(compPath) ? compPath : path.join(contextDir, compPath);

    if (!fs.existsSync(fullPath)) {
      result.errors.push({
        file: compPath,
        message: `Component file '${compPath}' specified in manifest does not exist.`
      });
      continue;
    }

    // Parse entries from markdown file
    try {
      const entries = parseMarkdownEntries(fullPath);
      
      for (const entry of entries) {
        const fm = entry.frontmatter;
        result.stats.totalEntries++;
        
        // Count by prefix/type
        const prefix = fm.id ? fm.id.split("-")[0] : "OTHER";
        result.stats.entriesByType[prefix] = (result.stats.entriesByType[prefix] || 0) + 1;

        // Check required fields
        if (!fm.id || typeof fm.id !== "string") {
          result.errors.push({
            file: compPath,
            line: entry.startLine,
            message: `Entry is missing a valid 'id' string.`
          });
          continue;
        }

        if (!fm.title || typeof fm.title !== "string") {
          result.errors.push({
            file: compPath,
            line: entry.startLine,
            message: `Entry '${fm.id}' is missing a valid 'title' string.`
          });
        }

        if (fm.status && !VALID_STATUSES.has(fm.status.toLowerCase())) {
          result.warnings.push({
            file: compPath,
            line: entry.startLine,
            message: `Entry '${fm.id}' has non-standard status: '${fm.status}'`
          });
        }

        // Duplicate ID check
        if (idToEntryMap.has(fm.id)) {
          const existing = idToEntryMap.get(fm.id);
          result.errors.push({
            file: compPath,
            line: entry.startLine,
            message: `Duplicate ID '${fm.id}' found. First defined in ${existing.file}:${existing.startLine}`
          });
        } else {
          const record = {
            id: fm.id,
            file: compPath,
            startLine: entry.startLine,
            dependencies: Array.isArray(fm.dependencies) ? fm.dependencies : [],
            supersedes: fm.supersedes || null
          };
          idToEntryMap.set(fm.id, record);
          allEntries.push(record);
          result.stats.declaredIds.push(fm.id);
        }
      }
    } catch (err) {
      result.errors.push({
        file: compPath,
        message: `Failed to read component: ${err.message}`
      });
    }
  }

  // 4. Cross-Reference and Graph Integrity Validation
  for (const entry of allEntries) {
    for (const depId of entry.dependencies) {
      if (!idToEntryMap.has(depId)) {
        result.errors.push({
          file: entry.file,
          line: entry.startLine,
          message: `Dangling Reference: Entry '${entry.id}' references unknown dependency '${depId}'.`
        });
      }
    }

    if (entry.supersedes && !idToEntryMap.has(entry.supersedes)) {
      result.warnings.push({
        file: entry.file,
        line: entry.startLine,
        message: `Entry '${entry.id}' supersedes unknown ID '${entry.supersedes}'.`
      });
    }
  }

  result.valid = result.errors.length === 0;
  return result;
}
