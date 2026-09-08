#!/usr/bin/env node

import { parseArgs } from "node:util";
import { initCommand } from "../src/commands/init.js";
import { checkCommand } from "../src/commands/check.js";
import { addCommand } from "../src/commands/add.js";
import { packCommand } from "../src/commands/pack.js";
import { startMcpServer } from "../src/mcp/server.js";
import { logger } from "../src/utils/logger.js";
import { VERSION } from "../src/utils/version.js";

const HELP_TEXT = `
PCP CLI — Project Context Protocol (v${VERSION})
Standardize Context, Not Intelligence.

USAGE:
  pcp <command> [options]

COMMANDS:
  init      Initialize a standard PCP context in the current repository
  check     Validate manifest, schemas, and cross-reference integrity (Linter)
  pack      Compile project context into a single portable bundle for LLMs
  add       Append a validated entry to a context component (e.g. pcp add decisions)
  mcp       Start the Model Context Protocol (MCP) server for AI assistants

OPTIONS:
  -h, --help       Show this help message
  -v, --version    Show version number
  -d, --dir        Target context directory (default: ./context)
  -o, --output     Output file path for packed context (default: stdout)
  -a, --active     Pack only active items (filters completed/superseded entries)
  --components     Comma-separated component names to include (e.g. arch,decisions)
  --json           Output as structured JSON instead of Markdown
  -n, --name       Project name (for init)
  -i, --id         Project or Entry ID
  -f, --force      Force overwrite existing context files (for init)
  -t, --title      Entry title (for add)
  -c, --content    Entry content string (for add)
  -s, --status     Entry status (e.g. active, proposed, accepted)
  --tags           Comma-separated tags (for add)
  --deps           Comma-separated dependency IDs (for add)
  --file           Path to content markdown file (for add)

EXAMPLES:
  $ pcp init --name "My Awesome App"
  $ pcp check
  $ pcp pack -o prompt-context.md
  $ pcp pack -a | pbcopy
  $ pcp pack --components architecture,decisions
  $ pcp add decisions --title "Use Redis Cache" --content "Cache session state in Redis."
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
    force: { type: "boolean", short: "f" },
    title: { type: "string", short: "t" },
    content: { type: "string", short: "c" },
    status: { type: "string", short: "s" },
    output: { type: "string", short: "o" },
    active: { type: "boolean", short: "a" },
    json: { type: "boolean" },
    components: { type: "string" },
    tags: { type: "string" },
    deps: { type: "string" },
    file: { type: "string" }
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
  const targetDir = options.dir || (command === "add" ? undefined : positionalDir);

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

    case "pack":
    case "bundle":
    case "compile":
      packCommand({
        contextDir: targetDir,
        output: options.output,
        activeOnly: options.active,
        json: options.json,
        components: options.components
      });
      break;

    case "add":
    case "append":
      addCommand({
        contextDir: options.dir,
        component: parsed.positionals[0],
        title: options.title,
        content: options.content,
        status: options.status,
        tags: options.tags,
        dependencies: options.deps,
        id: options.id,
        file: options.file
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
