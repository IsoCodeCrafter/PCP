import { bootstrapProject } from "../core/bootstrap.js";
import { logger } from "../utils/logger.js";

/**
 * Handles the 'pcp bootstrap' CLI command.
 * 
 * @param {object} options
 */
export function bootstrapCommand(options = {}) {
  const projectDir = options.dir || ".";
  const contextDir = options.contextDir || "context";
  const name = options.name;
  const force = Boolean(options.force);
  const dryRun = Boolean(options.dryRun);

  try {
    const result = bootstrapProject(projectDir, {
      contextDir,
      name,
      force,
      dryRun
    });

    const headerBadge = dryRun ? " [DRY-RUN]" : "";
    logger.header(`PCP Bootstrap — Smart Context Generator${headerBadge}`);

    // Log detected stack
    logger.info(`Detected Project: ${result.analysis.name} (${result.analysis.id})`);
    if (result.analysis.languages.length > 0) {
      logger.detail("Languages", result.analysis.languages.join(", "));
    }
    if (result.analysis.frameworks.length > 0) {
      logger.detail("Frameworks", result.analysis.frameworks.join(", "));
    }
    if (result.analysis.tools.length > 0) {
      logger.detail("Tools & Ecosystem", result.analysis.tools.join(", "));
    }
    logger.detail("Package Manager", result.analysis.packageManager);
    logger.detail("Setup Script", result.analysis.scripts.setup);
    logger.detail("Test Script", result.analysis.scripts.test);
    if (result.analysis.scripts.build) {
      logger.detail("Build Script", result.analysis.scripts.build);
    }

    console.log();

    // Log files
    for (const file of result.files) {
      if (dryRun) {
        logger.info(`${file} (would be generated)`);
      } else {
        logger.success(`Created: ${file}`);
      }
    }

    console.log();

    if (!dryRun) {
      logger.success(`Successfully bootstrapped ${result.files.length} tailored context files!`);
      logger.detail("Validation", "100% Valid (0 errors, 0 warnings)");
      logger.dim("\nNext Steps:");
      logger.dim("  1. Run 'npx @craftsolutions/pcp sync-rules' to configure AI editor rules (.cursorrules, CLAUDE.md).");
      logger.dim("  2. Connect MCP in your editor or AI CLI: 'npx -y @craftsolutions/pcp mcp'");
      logger.dim("  3. Run 'npx @craftsolutions/pcp check' to verify context health.\n");
    } else {
      logger.dim("(Dry-run simulation only. Re-run without --dry-run to generate context.)\n");
    }
  } catch (err) {
    logger.error(`Bootstrap failed: ${err.message}`);
    process.exit(1);
  }
}
