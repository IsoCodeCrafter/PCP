import path from "node:path";
import { logger } from "../utils/logger.js";
import { validateContext } from "../core/validator.js";

/**
 * Runs the context verification / linter suite.
 * 
 * @param {object} options 
 * @param {string} [options.contextDir]
 */
export function checkCommand(options = {}) {
  const cwd = process.cwd();
  const targetDir = options.contextDir 
    ? path.resolve(cwd, options.contextDir) 
    : path.resolve(cwd, "context");

  logger.header("PCP Check — Validating Project Context Integrity");
  logger.detail("Context Directory", path.relative(cwd, targetDir) || ".");

  const result = validateContext(targetDir);

  // Print statistics
  console.log("");
  logger.info(`Components Registered: ${result.stats.totalComponents}`);
  logger.info(`Total Structured Entries: ${result.stats.totalEntries}`);

  const typesSummary = Object.entries(result.stats.entriesByType)
    .map(([type, count]) => `${type}: ${count}`)
    .join(" | ");
  if (typesSummary) {
    logger.dim(`  Breakdown: [ ${typesSummary} ]`);
  }

  // Print Warnings
  if (result.warnings.length > 0) {
    console.log("");
    logger.warn(`Found ${result.warnings.length} warning(s):`);
    for (const w of result.warnings) {
      const location = w.line ? `:${w.line}` : "";
      console.log(`  - ${w.file}${location} -> ${w.message}`);
    }
  }

  // Print Errors
  if (result.errors.length > 0) {
    console.log("");
    logger.error(`Found ${result.errors.length} validation error(s):`);
    for (const err of result.errors) {
      const location = err.line ? `:${err.line}` : "";
      console.log(`  - ${err.file}${location} -> ${err.message}`);
    }
  }

  console.log("");
  if (result.valid) {
    logger.success("All PCP schema, component, and cross-reference checks PASSED.");
    logger.dim("Exit Code: 0\n");
    if (options.exit !== false) process.exit(0);
  } else {
    logger.error("PCP context verification FAILED. Please resolve the errors above.");
    logger.dim("Exit Code: 1\n");
    if (options.exit !== false) process.exit(1);
  }
}
