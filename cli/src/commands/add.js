import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils/logger.js";
import { appendEntry, formatEntryBlock, getNextEntryId } from "../core/entry.js";

/**
 * Adds a new structured entry to a PCP context component.
 * 
 * @param {object} options 
 */
export function addCommand(options = {}) {
  const cwd = process.cwd();
  const targetDir = options.contextDir 
    ? path.resolve(cwd, options.contextDir) 
    : path.resolve(cwd, "context");

  const component = options.component;
  if (!component) {
    logger.error("Missing required component name. (e.g. pcp add decisions --title \"...\")");
    process.exit(1);
  }

  const title = options.title;
  if (!title) {
    logger.error("Missing required '--title' option.");
    process.exit(1);
  }

  let content = options.content || "";
  if (options.file) {
    const filePath = path.resolve(cwd, options.file);
    if (!fs.existsSync(filePath)) {
      logger.error(`Content file not found: ${options.file}`);
      process.exit(1);
    }
    content = fs.readFileSync(filePath, "utf8");
  }

  // Parse comma-separated tags and dependencies
  const tags = options.tags 
    ? (Array.isArray(options.tags) ? options.tags : options.tags.split(",").map((t) => t.trim()).filter(Boolean))
    : [];

  const dependencies = options.dependencies || options.deps
    ? (Array.isArray(options.dependencies) ? options.dependencies : (options.dependencies || options.deps).split(",").map((d) => d.trim()).filter(Boolean))
    : [];

  logger.header(`PCP Add — Appending Entry to ${component.toUpperCase()}`);

  try {
    const result = appendEntry(targetDir, {
      component,
      id: options.id,
      title,
      status: options.status,
      tags,
      dependencies,
      content
    });

    logger.success(`Successfully appended entry '${result.id}' to '${result.file}'`);
    logger.info(`Integrity check: ${result.validation.stats.totalEntries} entries verified.`);
    console.log("");
  } catch (err) {
    logger.error(`Failed to add entry: ${err.message}`);
    process.exit(1);
  }
}
