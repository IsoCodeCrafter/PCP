#!/usr/bin/env node

import { parseArgs } from "node:util";
import { initCommand } from "../src/commands/init.js";
import { checkCommand } from "../src/commands/check.js";
import { startMcpServer } from "../src/mcp/server.js";
import { logger } from "../src/utils/logger.js";

const VERSION = "0.1.0";

const HELP_TEXT = `
PCP CLI — Project Context Protocol (v${VERSION})
Standardize Context, Not Intelligence.

USAGE:
  pcp <command> [options]

COMMANDS:
  init      Initialize a standard PCP context in the current repository
  check     Validate manifest, schemas, and cross-reference integrity (Linter)
  mcp       Start the Model Context Protocol (MCP) server for AI assistants

OPTIONS:
  -h, --help       Show this help message
  -v, --version    Show version number
  -d, --dir        Target context directory (default: ./context)
  -n, --name       Project name (for init)
  -i, --id         Project ID (for init)
  -f, --force      Force overwrite existing context files (for init)

EXAMPLES:
  $ pcp init --name "My Awesome App"
  $ pcp check
  $ pcp mcp
`;

function main() {
  const rawArgs = process.argv.slice(2);
  const command = rawArgs[0];

  if (!command || command === "--help" || command === "-h") {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  if (command === "--version" || command === "-v") {
    console.log(`pcp v${VERSION}`);
    process.exit(0);
  }

  const optionsConfig = {
    help: { type: "boolean", short: "h" },
    version: { type: "boolean", short: "v" },
    dir: { type: "string", short: "d" },
    name: { type: "string", short: "n" },
    id: { type: "string", short: "i" },
    force: { type: "boolean", short: "f" }
  };

  let parsed;
  try {
    parsed = parseArgs({
      args: rawArgs.slice(1),
      options: optionsConfig,
      allowPositionals: true
    });
  } catch (err) {
    logger.error(`Argument error: ${err.message}`);
    process.exit(1);
  }

  const options = parsed.values;
  const positionalDir = parsed.positionals[0];
  const targetDir = options.dir || positionalDir;

  switch (command) {
    case "init":
      initCommand({
        targetDir,
        name: options.name,
        id: options.id,
        force: options.force
      });
      break;

    case "check":
    case "validate":
      checkCommand({
        contextDir: targetDir
      });
      break;

    case "mcp":
    case "serve":
      startMcpServer();
      break;

    default:
      logger.error(`Unknown command: '${command}'`);
      console.log(HELP_TEXT);
      process.exit(1);
  }
}

main();
