import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";
import { parseManifest, parseMarkdownEntries } from "./parser.js";
import { validateContext } from "./validator.js";

const DEFAULT_PREFIX_MAP = {
  architecture: "ARCH",
  decisions: "DEC",
  knowledge: "KN",
  open_work: "WORK",
  operational_guide: "OPS"
};

/**
 * Resolves component configuration from manifest.
 * 
 * @param {string} contextDir 
 * @param {string} componentName 
 * @returns {{ config: object, filePath: string, relativePath: string }}
 */
export function getComponentInfo(contextDir, componentName) {
  const manifestPath = path.join(contextDir, "manifest.yaml");
  const manifest = parseManifest(manifestPath);

  const compConfig = manifest.components?.[componentName];
  if (!compConfig) {
    throw new Error(`Component '${componentName}' is not defined in manifest.yaml`);
  }

  const relativePath = compConfig.path || `${componentName.toUpperCase()}.md`;
  const filePath = path.isAbsolute(relativePath) ? relativePath : path.join(contextDir, relativePath);

  return { config: compConfig, filePath, relativePath };
}

/**
 * Calculates the next sequential ID for a given component (e.g. DEC-0003).
 * Uses maximum existing ID number rather than length to prevent collisions.
 * 
 * @param {string} contextDir 
 * @param {string} componentName 
 * @returns {string} Next unique ID (e.g. 'DEC-0003')
 */
export function getNextEntryId(contextDir, componentName) {
  const prefix = DEFAULT_PREFIX_MAP[componentName] || componentName.toUpperCase().slice(0, 4);
  const { filePath } = getComponentInfo(contextDir, componentName);

  let maxNum = 0;
  if (fs.existsSync(filePath)) {
    const entries = parseMarkdownEntries(filePath);
    const idRegex = new RegExp(`^${prefix}-(\\d+)$`);

    for (const entry of entries) {
      const match = entry.frontmatter.id?.match(idRegex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  const nextNumStr = String(maxNum + 1).padStart(4, "0");
  return `${prefix}-${nextNumStr}`;
}

/**
 * Formats a PCP RFC-0001 Frontmatter entry block.
 * 
 * @param {object} options 
 * @returns {{ id: string, frontmatter: object, blockText: string }}
 */
export function formatEntryBlock(options) {
  const {
    id,
    title,
    status,
    tags = [],
    dependencies = [],
    supersedes = null,
    content = "",
    component
  } = options;

  if (!id) {
    throw new Error("Entry ID is required.");
  }
  if (!title) {
    throw new Error("Entry title is required.");
  }

  const today = new Date().toISOString().split("T")[0];
  const defaultStatus = component === "decisions" ? "proposed" : "active";

  const frontmatterObj = {
    id,
    title,
    status: status || defaultStatus,
    created_at: today,
    updated_at: today,
    tags: Array.isArray(tags) ? tags : [],
    dependencies: Array.isArray(dependencies) ? dependencies : []
  };

  if (supersedes) {
    frontmatterObj.supersedes = supersedes;
  }

  const formattedYaml = yaml.stringify(frontmatterObj).trim();
  const trimmedContent = content.trim();

  const blockText = `\n---\n${formattedYaml}\n---\n\n${trimmedContent}\n`;

  return {
    id,
    frontmatter: frontmatterObj,
    blockText
  };
}

/**
 * Appends a new structured entry to a context component file with integrity validation.
 * 
 * @param {string} contextDir Absolute path to context directory
 * @param {object} options Entry options
 * @returns {{ success: boolean, id: string, file: string, validation: object }}
 */
export function appendEntry(contextDir, options) {
  const { component } = options;
  if (!component) {
    throw new Error("Target 'component' name is required.");
  }

  const { filePath, relativePath } = getComponentInfo(contextDir, component);

  // 1. Resolve or generate Entry ID
  const entryId = options.id || getNextEntryId(contextDir, component);

  // 2. Pre-check for duplicate ID in existing context
  if (fs.existsSync(filePath)) {
    const existingEntries = parseMarkdownEntries(filePath);
    if (existingEntries.some((e) => e.frontmatter.id === entryId)) {
      throw new Error(`Duplicate ID: Entry '${entryId}' already exists in ${relativePath}.`);
    }
  }

  // 3. Format entry block
  const { blockText } = formatEntryBlock({
    ...options,
    id: entryId
  });

  // 4. Append to file
  const originalContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const separator = originalContent.length > 0 && !originalContent.endsWith("\n") ? "\n" : "";
  const updatedContent = `${originalContent}${separator}${blockText}`;

  fs.writeFileSync(filePath, updatedContent, "utf8");

  // 5. Post-append integrity verification
  const validation = validateContext(contextDir);
  if (!validation.valid) {
    // If critical error introduced, roll back changes to maintain integrity
    fs.writeFileSync(filePath, originalContent, "utf8");
    const errorMsg = validation.errors.map((e) => `${e.file}: ${e.message}`).join("; ");
    throw new Error(`Context validation failed after appending. Changes reverted. Reason: ${errorMsg}`);
  }

  return {
    success: true,
    id: entryId,
    file: relativePath,
    validation
  };
}
