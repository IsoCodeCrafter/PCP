import fs from "node:fs";
import path from "node:path";
import { packContext } from "../core/pack.js";
import { logger } from "../utils/logger.js";

/**
 * Handles the 'pcp pack' CLI command.
 * 
 * @param {object} options
 */
export function packCommand(options = {}) {
  const contextDir = options.contextDir || "./context";
  const outputFile = options.output;
  const activeOnly = Boolean(options.activeOnly);
  const format = options.format || (options.json ? "json" : "markdown");
  const components = options.components;

  try {
    const result = packContext(contextDir, {
      activeOnly,
      format,
      components
    });

    if (outputFile) {
      const resolvedOutput = path.resolve(outputFile);
      const outDir = path.dirname(resolvedOutput);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      fs.writeFileSync(resolvedOutput, result.output, "utf8");

      logger.header("PCP Pack — Project Context Compiler");
      logger.success(`Packed ${result.stats.totalComponents} components (${result.stats.totalEntries} entries) into ${outputFile}`);
      logger.detail("Format", result.format.toUpperCase());
      logger.detail("Mode", activeOnly ? "Active Items Only" : "Full Context");
      logger.detail("Size", `${(result.stats.characters / 1024).toFixed(1)} KB`);
      logger.detail("Estimated Tokens", `~${result.stats.estimatedTokens.toLocaleString()}`);
    } else {
      // Direct stdout output for Unix piping (e.g. pcp pack | pbcopy)
      process.stdout.write(result.output + "\n");
    }
  } catch (err) {
    logger.error(`Pack failed: ${err.message}`);
    process.exit(1);
  }
}
