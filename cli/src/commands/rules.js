import { syncRules } from "../core/rules.js";
import { logger } from "../utils/logger.js";

/**
 * Handles the 'pcp sync-rules' CLI command.
 * 
 * @param {object} options 
 */
export function rulesCommand(options = {}) {
  const projectDir = options.dir || ".";
  const contextDir = options.contextDir || "context";
  const targets = options.targets;
  const dryRun = Boolean(options.dryRun);

  try {
    const { results } = syncRules(projectDir, {
      targets,
      contextDir,
      dryRun
    });

    logger.header(`PCP Rules — Editor & Agent Bridge${dryRun ? " [DRY-RUN]" : ""}`);

    let createdCount = 0;
    let updatedCount = 0;
    let unchangedCount = 0;

    for (const res of results) {
      if (res.action === "created") {
        logger.success(`${res.file} (${res.name}) ${dryRun ? "would be created" : "created"}`);
        createdCount++;
      } else if (res.action === "updated") {
        logger.success(`${res.file} (${res.name}) ${dryRun ? "would be updated" : "synchronized"}`);
        updatedCount++;
      } else {
        logger.info(`${res.file} (${res.name}) is already up to date`);
        unchangedCount++;
      }
    }

    console.log();
    logger.detail("Total Checked", results.length);
    if (createdCount > 0) logger.detail("Created", createdCount);
    if (updatedCount > 0) logger.detail("Updated", updatedCount);
    if (unchangedCount > 0) logger.detail("Unchanged", unchangedCount);

    if (dryRun) {
      logger.dim("\n(Dry-run simulation only. Re-run without --dry-run to apply changes.)");
    }
  } catch (err) {
    logger.error(`Rule sync failed: ${err.message}`);
    process.exit(1);
  }
}
