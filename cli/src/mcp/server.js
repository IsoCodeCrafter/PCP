import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { parseManifest, parseMarkdownEntries } from "../core/parser.js";
import { validateContext } from "../core/validator.js";
import { formatEntryBlock, appendEntry, getNextEntryId, getComponentInfo } from "../core/entry.js";
import { packContext } from "../core/pack.js";
import { syncRules } from "../core/rules.js";
import { bootstrapProject } from "../core/bootstrap.js";
import { VERSION } from "../utils/version.js";

/**
 * Resolves context directory path.
 * @param {string} [customPath]
 * @returns {string}
 */
function resolveContextDir(customPath) {
  if (customPath) {
    return path.resolve(process.cwd(), customPath);
  }
  return path.resolve(process.cwd(), "context");
}

export function startMcpServer() {
  const server = new Server(
    {
      name: "pcp-context-server",
      version: VERSION
    },
    {
      capabilities: {
        tools: {},
        resources: {}
      }
    }
  );

  // 1. List Available Resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "context://manifest",
          name: "Project Context Manifest",
          mimeType: "text/yaml",
          description: "Canonical PCP manifest defining project metadata and components"
        },
        {
          uri: "context://architecture",
          name: "Architecture & Structural Boundaries",
          mimeType: "text/markdown",
          description: "System architecture, component responsibilities, and constraints"
        },
        {
          uri: "context://decisions",
          name: "Decision Log",
          mimeType: "text/markdown",
          description: "Historical decisions, rationale, alternatives, and consequences"
        },
        {
          uri: "context://knowledge",
          name: "Knowledge Base",
          mimeType: "text/markdown",
          description: "Durable domain rules, technical conventions, and constraints"
        },
        {
          uri: "context://open_work",
          name: "Open Work & Roadmap",
          mimeType: "text/markdown",
          description: "Unfinished work, technical debt, and active priorities"
        },
        {
          uri: "context://operational_guide",
          name: "Operational Guide",
          mimeType: "text/markdown",
          description: "Procedures for setup, contribution, deployment, and testing"
        },
        {
          uri: "context://pack",
          name: "Compiled Project Context Pack",
          mimeType: "text/markdown",
          description: "Consolidated project context bundle compiling all components in a single document"
        }
      ]
    };
  });

  // 2. Read Resource Content
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const contextDir = resolveContextDir();
    const uri = request.params.uri;

    if (uri === "context://pack") {
      const result = packContext(contextDir, { activeOnly: false });
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: result.output
          }
        ]
      };
    }

    const resourceMap = {
      "context://manifest": "manifest.yaml",
      "context://architecture": "ARCHITECTURE.md",
      "context://decisions": "DECISION_LOG.md",
      "context://knowledge": "KNOWLEDGE.md",
      "context://open_work": "OPEN_WORK.md",
      "context://operational_guide": "OPERATIONAL_GUIDE.md"
    };

    const fileName = resourceMap[uri];
    if (!fileName) {
      throw new Error(`Resource not found: ${uri}`);
    }

    const filePath = path.join(contextDir, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Context file does not exist: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, "utf8");
    const mimeType = fileName.endsWith(".yaml") ? "text/yaml" : "text/markdown";

    return {
      contents: [
        {
          uri,
          mimeType,
          text: content
        }
      ]
    };
  });

  // 3. List Available Tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "pcp_get_manifest",
          description: "Get the canonical manifest and overview of the Project Context Protocol (PCP) context.",
          inputSchema: {
            type: "object",
            properties: {
              context_path: {
                type: "string",
                description: "Optional custom path to the context directory (default: ./context)"
              }
            }
          }
        },
        {
          name: "pcp_read_component",
          description: "Read a specific PCP context component (architecture, decisions, knowledge, open_work, operational_guide) along with parsed structured entries.",
          inputSchema: {
            type: "object",
            properties: {
              component: {
                type: "string",
                enum: ["architecture", "decisions", "knowledge", "open_work", "operational_guide"],
                description: "Name of the component to read"
              },
              context_path: {
                type: "string",
                description: "Optional custom path to the context directory (default: ./context)"
              }
            },
            required: ["component"]
          }
        },
        {
          name: "pcp_search_context",
          description: "Search across all PCP context documents and structured entries by keyword, tag, status, or category.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Keyword to search in titles, descriptions, and markdown content"
              },
              tag: {
                type: "string",
                description: "Filter by specific tag (e.g. storage, mcp, cli)"
              },
              status: {
                type: "string",
                description: "Filter by status (e.g. active, accepted, open, completed)"
              },
              context_path: {
                type: "string",
                description: "Optional custom path to the context directory"
              }
            }
          }
        },
        {
          name: "pcp_check_integrity",
          description: "Run the PCP validator/linter to verify manifest validity, schema conformance, and cross-reference integrity (dangling links).",
          inputSchema: {
            type: "object",
            properties: {
              context_path: {
                type: "string",
                description: "Optional custom path to the context directory"
              }
            }
          }
        },
        {
          name: "pcp_propose_entry",
          description: "Format and propose a new structured entry (Decision, Knowledge, Work Item, Architecture, or Ops Procedure) following RFC-0001 YAML Frontmatter standard. Returns the proposed block for human verification.",
          inputSchema: {
            type: "object",
            properties: {
              component: {
                type: "string",
                enum: ["architecture", "decisions", "knowledge", "open_work", "operational_guide"],
                description: "Target component to append entry to"
              },
              id: {
                type: "string",
                description: "Unique ID for the entry (e.g. DEC-0003, WORK-0003, KN-0004)"
              },
              title: {
                type: "string",
                description: "Descriptive title for the entry"
              },
              status: {
                type: "string",
                description: "Status (e.g. proposed, accepted, open, active)"
              },
              tags: {
                type: "array",
                items: { type: "string" },
                description: "Categorization tags"
              },
              dependencies: {
                type: "array",
                items: { type: "string" },
                description: "Referenced dependency IDs (e.g. ['ARCH-0001', 'DEC-0001'])"
              },
              content: {
                type: "string",
                description: "Markdown body content for the entry (sections, rationale, procedure, etc.)"
              },
              apply: {
                type: "boolean",
                description: "Optional. If true, directly appends the entry to the context file after integrity verification. Defaults to false."
              },
              context_path: {
                type: "string",
                description: "Optional custom path to the context directory"
              }
            },
            required: ["component", "title", "content"]
          }
        },
        {
          name: "pcp_apply_entry",
          description: "Append a new verified structured entry (Decision, Knowledge, Work Item, Architecture, or Ops Procedure) directly to the target context document. Automatically verifies integrity and rolls back on failure.",
          inputSchema: {
            type: "object",
            properties: {
              component: {
                type: "string",
                enum: ["architecture", "decisions", "knowledge", "open_work", "operational_guide"],
                description: "Target component to append entry to"
              },
              id: {
                type: "string",
                description: "Optional unique ID for the entry (e.g. DEC-0003). Auto-generated if omitted."
              },
              title: {
                type: "string",
                description: "Descriptive title for the entry"
              },
              status: {
                type: "string",
                description: "Status (e.g. proposed, accepted, open, active)"
              },
              tags: {
                type: "array",
                items: { type: "string" },
                description: "Categorization tags"
              },
              dependencies: {
                type: "array",
                items: { type: "string" },
                description: "Referenced dependency IDs (e.g. ['ARCH-0001', 'DEC-0001'])"
              },
              supersedes: {
                type: "string",
                description: "Optional entry ID that this entry supersedes"
              },
              content: {
                type: "string",
                description: "Markdown body content for the entry"
              },
              context_path: {
                type: "string",
                description: "Optional custom path to the context directory"
              }
            },
            required: ["component", "title", "content"]
          }
        },
        {
          name: "pcp_pack_context",
          description: "Compile and bundle the entire project context into a single self-contained Markdown or JSON document for LLM consumption, with optional filtering for active items only.",
          inputSchema: {
            type: "object",
            properties: {
              active_only: {
                type: "boolean",
                description: "If true, excludes completed, superseded, and deprecated items to optimize token usage"
              },
              components: {
                type: "array",
                items: { type: "string" },
                description: "Optional list of component names to include (e.g. ['architecture', 'decisions'])"
              },
              format: {
                type: "string",
                enum: ["markdown", "json"],
                description: "Output format (default: markdown)"
              },
              context_path: {
                type: "string",
                description: "Optional custom path to the context directory"
              }
            }
          }
        },
        {
          name: "pcp_sync_rules",
          description: "Synchronize PCP directives to AI editor rule files (.cursorrules, CLAUDE.md, .github/copilot-instructions.md, .windsurfrules) while preserving existing user instructions.",
          inputSchema: {
            type: "object",
            properties: {
              targets: {
                type: "array",
                items: { type: "string" },
                description: "Optional list of target rule files ('cursor', 'claude', 'copilot', 'windsurf'). Defaults to cursor, claude, and copilot."
              },
              context_path: {
                type: "string",
                description: "Optional custom relative path to the context directory (default: context)"
              },
              project_root: {
                type: "string",
                description: "Optional root directory path of the project (default: current working directory)"
              }
            }
          }
        },
        {
          name: "pcp_bootstrap_context",
          description: "Analyze the current codebase (detecting language, framework, dependencies, scripts, and runtime) and auto-generate a tailored, schema-compliant PCP context directory.",
          inputSchema: {
            type: "object",
            properties: {
              project_root: {
                type: "string",
                description: "Path to project root directory (default: current working directory)"
              },
              context_path: {
                type: "string",
                description: "Optional custom relative path for context directory (default: context)"
              },
              name: {
                type: "string",
                description: "Optional explicit project name override"
              },
              force: {
                type: "boolean",
                description: "Force overwrite if context directory already exists (default: false)"
              }
            }
          }
        }
      ]
    };
  });

  // 4. Handle Tool Invocations
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const contextDir = resolveContextDir(args?.context_path);

    try {
      switch (name) {
        case "pcp_get_manifest": {
          const manifestPath = path.join(contextDir, "manifest.yaml");
          const manifest = parseManifest(manifestPath);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(manifest, null, 2)
              }
            ]
          };
        }

        case "pcp_read_component": {
          const manifestPath = path.join(contextDir, "manifest.yaml");
          const manifest = parseManifest(manifestPath);
          const compConfig = manifest.components[args.component];
          if (!compConfig) {
            throw new Error(`Component '${args.component}' not declared in manifest.yaml`);
          }

          const filePath = path.join(contextDir, compConfig.path || `${args.component.toUpperCase()}.md`);
          const rawContent = fs.readFileSync(filePath, "utf8");
          const entries = parseMarkdownEntries(filePath);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    component: args.component,
                    file: compConfig.path,
                    total_entries: entries.length,
                    entries: entries.map((e) => e.frontmatter),
                    raw_markdown: rawContent
                  },
                  null,
                  2
                )
              }
            ]
          };
        }

        case "pcp_search_context": {
          const manifestPath = path.join(contextDir, "manifest.yaml");
          const manifest = parseManifest(manifestPath);
          const results = [];
          const query = (args.query || "").toLowerCase();
          const tag = args.tag ? args.tag.toLowerCase() : null;
          const status = args.status ? args.status.toLowerCase() : null;

          for (const [compName, compConfig] of Object.entries(manifest.components)) {
            const filePath = path.join(contextDir, compConfig.path || `${compName.toUpperCase()}.md`);
            if (!fs.existsSync(filePath)) continue;

            const entries = parseMarkdownEntries(filePath);
            for (const entry of entries) {
              const fm = entry.frontmatter;
              const matchesTag = !tag || (Array.isArray(fm.tags) && fm.tags.map((t) => t.toLowerCase()).includes(tag));
              const matchesStatus = !status || (fm.status && fm.status.toLowerCase() === status);
              const matchesQuery =
                !query ||
                (fm.id && fm.id.toLowerCase().includes(query)) ||
                (fm.title && fm.title.toLowerCase().includes(query)) ||
                entry.raw.toLowerCase().includes(query);

              if (matchesTag && matchesStatus && matchesQuery) {
                results.push({
                  component: compName,
                  file: compConfig.path,
                  entry: fm
                });
              }
            }
          }

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ matches_found: results.length, results }, null, 2)
              }
            ]
          };
        }

        case "pcp_check_integrity": {
          const validation = validateContext(contextDir);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(validation, null, 2)
              }
            ]
          };
        }

        case "pcp_propose_entry": {
          if (args.apply === true) {
            const result = appendEntry(contextDir, {
              component: args.component,
              id: args.id,
              title: args.title,
              status: args.status,
              tags: args.tags,
              dependencies: args.dependencies,
              supersedes: args.supersedes,
              content: args.content
            });

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      status: "applied",
                      target_file: result.file,
                      entry_id: result.id,
                      total_entries: result.validation.stats.totalEntries,
                      message: `Entry '${result.id}' successfully appended and validated.`
                    },
                    null,
                    2
                  )
                }
              ]
            };
          }

          const { relativePath } = getComponentInfo(contextDir, args.component);
          const entryId = args.id || getNextEntryId(contextDir, args.component);

          const { blockText } = formatEntryBlock({
            component: args.component,
            id: entryId,
            title: args.title,
            status: args.status,
            tags: args.tags,
            dependencies: args.dependencies,
            supersedes: args.supersedes,
            content: args.content
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    status: "proposal_generated",
                    target_file: relativePath,
                    entry_id: entryId,
                    human_review_required: true,
                    instructions: "Review the proposed Markdown block below and approve insertion into the context file.",
                    proposed_block: blockText
                  },
                  null,
                  2
                )
              }
            ]
          };
        }

        case "pcp_apply_entry": {
          const result = appendEntry(contextDir, {
            component: args.component,
            id: args.id,
            title: args.title,
            status: args.status,
            tags: args.tags,
            dependencies: args.dependencies,
            supersedes: args.supersedes,
            content: args.content
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    status: "applied",
                    target_file: result.file,
                    entry_id: result.id,
                    total_entries: result.validation.stats.totalEntries,
                    message: `Entry '${result.id}' successfully appended and validated.`
                  },
                  null,
                  2
                )
              }
            ]
          };
        }

        case "pcp_pack_context": {
          const result = packContext(contextDir, {
            activeOnly: args?.active_only,
            components: args?.components,
            format: args?.format || "markdown"
          });

          return {
            content: [
              {
                type: "text",
                text: result.output
              }
            ]
          };
        }

        case "pcp_sync_rules": {
          const rootDir = args?.project_root ? path.resolve(args.project_root) : process.cwd();
          const { results } = syncRules(rootDir, {
            targets: args?.targets,
            contextDir: args?.context_path || "context",
            dryRun: false
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    status: "success",
                    results: results.map((r) => ({
                      target: r.target,
                      name: r.name,
                      file: r.file,
                      action: r.action
                    }))
                  },
                  null,
                  2
                )
              }
            ]
          };
        }

        case "pcp_bootstrap_context": {
          const rootDir = args?.project_root ? path.resolve(args.project_root) : process.cwd();
          const result = bootstrapProject(rootDir, {
            contextDir: args?.context_path || "context",
            name: args?.name,
            force: args?.force
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    status: "bootstrapped",
                    project: result.analysis.name,
                    id: result.analysis.id,
                    languages: result.analysis.languages,
                    frameworks: result.analysis.frameworks,
                    files_created: result.files,
                    validation: {
                      valid: result.validation.valid,
                      total_entries: result.validation.stats.totalEntries
                    },
                    message: `Successfully bootstrapped PCP context with ${result.files.length} tailored components.`
                  },
                  null,
                  2
                )
              }
            ]
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error: ${err.message}`
          }
        ]
      };
    }
  });

  const transport = new StdioServerTransport();
  server.connect(transport);
  console.error("PCP MCP Server running on stdio.");
}
