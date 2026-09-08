import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

/**
 * Parses the context manifest file.
 * @param {string} manifestPath 
 * @returns {object}
 */
export function parseManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest file not found: ${manifestPath}`);
  }
  const content = fs.readFileSync(manifestPath, "utf8");
  try {
    const data = yaml.parse(content);
    return data;
  } catch (err) {
    throw new Error(`Failed to parse manifest YAML at ${manifestPath}: ${err.message}`);
  }
}

/**
 * Maximum lines to scan ahead for a YAML Frontmatter block.
 */
const MAX_FRONTMATTER_LINES = 250;

/**
 * Extracts and parses all YAML Frontmatter blocks from a Markdown string.
 * Resilient against markdown horizontal rules and code blocks.
 * 
 * @param {string} content 
 * @returns {Array<{ frontmatter: object, raw: string, startLine: number }>}
 */
export function parseMarkdownStringEntries(content) {
  const lines = content.split(/\r?\n/);
  const entries = [];

  let inCodeBlock = false;
  let codeBlockFence = "";

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Code block boundary tracking (``` or ~~~)
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      const fenceType = trimmed.slice(0, 3);
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockFence = fenceType;
      } else if (fenceType === codeBlockFence) {
        inCodeBlock = false;
        codeBlockFence = "";
      }
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    // 2. Candidate YAML Frontmatter opening
    if (trimmed === "---") {
      let closingIndex = -1;
      const yamlLines = [];

      for (let j = i + 1; j < lines.length && (j - i) <= MAX_FRONTMATTER_LINES; j++) {
        const nextTrimmed = lines[j].trim();

        // If a code block starts inside candidate frontmatter, it is not frontmatter
        if (nextTrimmed.startsWith("```") || nextTrimmed.startsWith("~~~")) {
          break;
        }

        if (nextTrimmed === "---" || nextTrimmed === "...") {
          closingIndex = j;
          break;
        }

        yamlLines.push(lines[j]);
      }

      // If a matching closing delimiter was found and has content
      if (closingIndex !== -1 && yamlLines.length > 0) {
        const yamlString = yamlLines.join("\n").trim();
        if (yamlString.length > 0) {
          try {
            const parsed = yaml.parse(yamlString);
            // PCP Frontmatter must be an object with an 'id' string property
            if (parsed && typeof parsed === "object" && typeof parsed.id === "string") {
              entries.push({
                frontmatter: parsed,
                raw: yamlString,
                startLine: i + 1,
                endLine: closingIndex + 1
              });
              // Advance outer loop index to closing delimiter
              i = closingIndex;
              continue;
            }
          } catch (e) {
            // Not a valid YAML frontmatter, treat as regular markdown
          }
        }
      }
    }
  }

  // Extract body content for each entry (lines between closing delimiter and next entry or EOF)
  for (let k = 0; k < entries.length; k++) {
    const current = entries[k];
    const nextStart = k + 1 < entries.length ? entries[k + 1].startLine - 1 : lines.length;
    current.body = lines.slice(current.endLine, nextStart).join("\n").trim();
  }

  return entries;
}

/**
 * Extracts the document prologue (introductory markdown prior to the first frontmatter entry).
 * 
 * @param {string} content 
 * @returns {string}
 */
export function getDocumentPrologue(content) {
  const lines = content.split(/\r?\n/);
  const entries = parseMarkdownStringEntries(content);
  if (entries.length === 0) {
    return content.trim();
  }
  const firstEntryStart = entries[0].startLine - 1;
  return lines.slice(0, firstEntryStart).join("\n").trim();
}

/**
 * Extracts and parses all YAML Frontmatter blocks from a Markdown file.
 * Handles both top-of-file and inline multi-entry Frontmatter blocks.
 * 
 * @param {string} filePath 
 * @returns {Array<{ frontmatter: object, raw: string, startLine: number }>}
 */
export function parseMarkdownEntries(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf8");
  return parseMarkdownStringEntries(content);
}
