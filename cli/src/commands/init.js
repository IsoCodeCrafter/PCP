import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "../utils/logger.js";
import yaml from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to official reference template
const TEMPLATE_DIR = path.resolve(__dirname, "../../../reference/context-template/context");

/**
 * Initializes a new PCP context structure in the target project.
 * 
 * @param {object} options 
 * @param {string} [options.targetDir]
 * @param {string} [options.name]
 * @param {string} [options.id]
 * @param {boolean} [options.force]
 */
export function initCommand(options = {}) {
  const cwd = process.cwd();
  const targetDir = options.targetDir 
    ? path.resolve(cwd, options.targetDir) 
    : path.resolve(cwd, "context");

  logger.header("PCP Init — Initializing Project Context");

  if (!fs.existsSync(TEMPLATE_DIR)) {
    logger.error(`Reference template not found at: ${TEMPLATE_DIR}`);
    process.exit(1);
  }

  // Check if context directory already exists
  const manifestPath = path.join(targetDir, "manifest.yaml");
  if (fs.existsSync(manifestPath) && !options.force) {
    logger.warn(`Project Context already exists at: ${targetDir}`);
    logger.dim("Use --force to overwrite existing context files.");
    return;
  }

  // Create target directory if needed
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy template files
  const templateFiles = fs.readdirSync(TEMPLATE_DIR);
  let copiedCount = 0;

  for (const file of templateFiles) {
    if (file.startsWith(".")) continue;

    const srcFile = path.join(TEMPLATE_DIR, file);
    const destFile = path.join(targetDir, file);

    let content = fs.readFileSync(srcFile, "utf8");

    // Customize manifest.yaml if project details provided
    if (file === "manifest.yaml") {
      try {
        const manifestObj = yaml.parse(content);
        const folderName = path.basename(cwd);
        manifestObj.project.name = options.name || manifestObj.project.name || folderName;
        manifestObj.project.id = options.id || manifestObj.project.id || folderName.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
        manifestObj.project.created_at = new Date().toISOString().split("T")[0];
        content = yaml.stringify(manifestObj);
      } catch (e) {
        // Fallback to raw copy
      }
    }

    fs.writeFileSync(destFile, content, "utf8");
    copiedCount++;
    logger.success(`Created: ${path.relative(cwd, destFile)}`);
  }

  logger.info(`Successfully initialized ${copiedCount} context files in '${path.relative(cwd, targetDir)}'.`);
  logger.dim("\nNext step: Run 'npx pcp check' to verify context integrity.\n");
}
