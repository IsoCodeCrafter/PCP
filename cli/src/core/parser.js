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
  const lines = content.split(/\r?\n/);
  const entries = [];

  let inFrontmatter = false;
  let currentYamlLines = [];
  let blockStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "---") {
      if (!inFrontmatter) {
        inFrontmatter = true;
        currentYamlLines = [];
        blockStartLine = i + 1;
      } else {
        const yamlString = currentYamlLines.join("\n").trim();
        
        // If the block is completely empty (e.g. accidental consecutive ---), reset start line to current
        if (yamlString.length === 0) {
          blockStartLine = i + 1;
          currentYamlLines = [];
          // Remain in inFrontmatter state for the real block
          continue;
        }

        inFrontmatter = false;
        try {
          const parsed = yaml.parse(yamlString);
          if (parsed && typeof parsed === "object" && typeof parsed.id === "string") {
            entries.push({
              frontmatter: parsed,
              raw: yamlString,
              startLine: blockStartLine
            });
          }
        } catch (e) {
          // Not a valid YAML frontmatter block
        }
        currentYamlLines = [];
      }
    } else if (inFrontmatter) {
      currentYamlLines.push(lines[i]);
    }
  }

  return entries;
}
