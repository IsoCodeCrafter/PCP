import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";
import { validateContext } from "./validator.js";

/**
 * Analyzes repository files to infer project identity, tech stack, and operational procedures.
 * 
 * @param {string} projectDir 
 * @returns {object}
 */
export function analyzeRepository(projectDir) {
  const resolvedDir = path.resolve(projectDir);
  const folderName = path.basename(resolvedDir);

  const analysis = {
    name: folderName,
    id: folderName.toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
    description: "Software project with standardized Project Context Protocol (PCP).",
    languages: [],
    frameworks: [],
    tools: [],
    packageManager: "npm",
    scripts: {
      setup: "npm install",
      test: "npm test",
      build: null,
      dev: null
    },
    monorepo: false,
    docker: false,
    ci: false
  };

  // 1. Inspect package.json (Node.js ecosystem)
  const pkgPath = path.join(resolvedDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      if (pkg.name) {
        analysis.name = pkg.name;
        analysis.id = pkg.name.replace(/^@[^/]+\//, "").toLowerCase().replace(/[^a-z0-9-_]/g, "-");
      }
      if (pkg.description) {
        analysis.description = pkg.description;
      }
      analysis.languages.push("JavaScript");

      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {})
      };

      if (allDeps["typescript"] || fs.existsSync(path.join(resolvedDir, "tsconfig.json"))) {
        analysis.languages.push("TypeScript");
      }

      // Frameworks & Libraries
      if (allDeps["next"]) analysis.frameworks.push("Next.js");
      if (allDeps["react"]) analysis.frameworks.push("React");
      if (allDeps["vue"]) analysis.frameworks.push("Vue.js");
      if (allDeps["svelte"] || allDeps["@sveltejs/kit"]) analysis.frameworks.push("Svelte");
      if (allDeps["express"]) analysis.frameworks.push("Express");
      if (allDeps["fastify"]) analysis.frameworks.push("Fastify");
      if (allDeps["@nestjs/core"]) analysis.frameworks.push("NestJS");
      if (allDeps["tailwindcss"]) analysis.tools.push("Tailwind CSS");
      if (allDeps["@modelcontextprotocol/sdk"]) analysis.tools.push("Model Context Protocol (MCP)");

      // Test runners
      if (allDeps["vitest"]) analysis.tools.push("Vitest");
      else if (allDeps["jest"]) analysis.tools.push("Jest");
      else if (allDeps["mocha"]) analysis.tools.push("Mocha");

      // Workspaces
      if (pkg.workspaces || fs.existsSync(path.join(resolvedDir, "pnpm-workspace.yaml"))) {
        analysis.monorepo = true;
        analysis.tools.push("Monorepo Workspaces");
      }

      // Package manager detection
      if (fs.existsSync(path.join(resolvedDir, "pnpm-lock.yaml"))) {
        analysis.packageManager = "pnpm";
      } else if (fs.existsSync(path.join(resolvedDir, "yarn.lock"))) {
        analysis.packageManager = "yarn";
      } else if (fs.existsSync(path.join(resolvedDir, "bun.lockb")) || fs.existsSync(path.join(resolvedDir, "bun.lock"))) {
        analysis.packageManager = "bun";
      }

      // Scripts
      const pm = analysis.packageManager;
      analysis.scripts.setup = `${pm} install`;

      if (pkg.scripts?.test) {
        analysis.scripts.test = `${pm} test`;
      }
      if (pkg.scripts?.build) {
        analysis.scripts.build = pm === "npm" ? "npm run build" : `${pm} build`;
      }
      if (pkg.scripts?.dev) {
        analysis.scripts.dev = pm === "npm" ? "npm run dev" : `${pm} dev`;
      } else if (pkg.scripts?.start) {
        analysis.scripts.dev = pm === "npm" ? "npm start" : `${pm} start`;
      }
    } catch (e) {
      // Ignore malformed package.json
    }
  }

  // 2. Inspect Python ecosystem
  if (fs.existsSync(path.join(resolvedDir, "pyproject.toml")) || fs.existsSync(path.join(resolvedDir, "requirements.txt"))) {
    analysis.languages.push("Python");
    analysis.scripts.setup = "pip install -r requirements.txt";
    analysis.scripts.test = "pytest";

    if (fs.existsSync(path.join(resolvedDir, "pyproject.toml"))) {
      try {
        const tomlContent = fs.readFileSync(path.join(resolvedDir, "pyproject.toml"), "utf8");
        const nameMatch = tomlContent.match(/name\s*=\s*["']([^"']+)["']/);
        if (nameMatch && nameMatch[1]) {
          analysis.name = nameMatch[1];
          analysis.id = nameMatch[1].toLowerCase().replace(/[^a-z0-9-_]/g, "-");
        }
        const descMatch = tomlContent.match(/description\s*=\s*["']([^"']+)["']/);
        if (descMatch && descMatch[1]) {
          analysis.description = descMatch[1];
        }
      } catch (e) {
        // Ignore toml parse errors
      }
    }
  }

  // 3. Inspect Rust ecosystem
  if (fs.existsSync(path.join(resolvedDir, "Cargo.toml"))) {
    analysis.languages.push("Rust");
    analysis.scripts.setup = "cargo build";
    analysis.scripts.test = "cargo test";
    try {
      const cargoContent = fs.readFileSync(path.join(resolvedDir, "Cargo.toml"), "utf8");
      const nameMatch = cargoContent.match(/name\s*=\s*["']([^"']+)["']/);
      if (nameMatch && nameMatch[1]) {
        analysis.name = nameMatch[1];
        analysis.id = nameMatch[1].toLowerCase().replace(/[^a-z0-9-_]/g, "-");
      }
    } catch (e) {
      // Ignore cargo errors
    }
  }

  // 4. Inspect Go ecosystem
  if (fs.existsSync(path.join(resolvedDir, "go.mod"))) {
    analysis.languages.push("Go");
    analysis.scripts.setup = "go mod download";
    analysis.scripts.test = "go test ./...";
    try {
      const goMod = fs.readFileSync(path.join(resolvedDir, "go.mod"), "utf8");
      const modMatch = goMod.match(/module\s+([^\s\r\n]+)/);
      if (modMatch && modMatch[1]) {
        const modParts = modMatch[1].split("/");
        analysis.name = modParts[modParts.length - 1];
        analysis.id = analysis.name.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
      }
    } catch (e) {
      // Ignore go.mod errors
    }
  }

  // 5. Inspect README.md for title and summary if not yet resolved
  const readmePath = path.join(resolvedDir, "README.md");
  if (fs.existsSync(readmePath)) {
    try {
      const readmeContent = fs.readFileSync(readmePath, "utf8");
      const firstHeading = readmeContent.match(/^#\s+(.+)$/m);
      if (firstHeading && firstHeading[1] && analysis.name === folderName) {
        analysis.name = firstHeading[1].trim();
      }
    } catch (e) {
      // Ignore readme error
    }
  }

  // 6. Inspect Docker & CI
  if (fs.existsSync(path.join(resolvedDir, "Dockerfile")) || fs.existsSync(path.join(resolvedDir, "docker-compose.yml"))) {
    analysis.docker = true;
    analysis.tools.push("Docker");
  }
  if (fs.existsSync(path.join(resolvedDir, ".github", "workflows"))) {
    analysis.ci = true;
    analysis.tools.push("GitHub Actions");
  }

  // Deduplicate tags
  analysis.languages = [...new Set(analysis.languages)];
  analysis.frameworks = [...new Set(analysis.frameworks)];
  analysis.tools = [...new Set(analysis.tools)];

  return analysis;
}

/**
 * Generates tailored PCP context files based on repository analysis.
 * 
 * @param {object} analysis 
 * @returns {Record<string, string>} Map of filename to file content
 */
export function generateBootstrappedContext(analysis) {
  const today = new Date().toISOString().split("T")[0];
  const primaryLang = analysis.languages[0] || "Software";
  const primaryFramework = analysis.frameworks[0] || primaryLang;
  const allStack = [...analysis.languages, ...analysis.frameworks, ...analysis.tools];
  const stackSummary = allStack.length > 0 ? allStack.join(", ") : "Standard Software Architecture";

  // 1. manifest.yaml
  const manifestObj = {
    pcp_version: "0.1",
    schema_version: "1.0",
    project: {
      id: analysis.id,
      name: analysis.name,
      description: analysis.description,
      created_at: today
    },
    components: {
      architecture: {
        path: "ARCHITECTURE.md",
        status: "active"
      },
      decisions: {
        path: "DECISION_LOG.md"
      },
      knowledge: {
        path: "KNOWLEDGE.md"
      },
      open_work: {
        path: "OPEN_WORK.md"
      },
      operational_guide: {
        path: "OPERATIONAL_GUIDE.md",
        status: "active"
      }
    }
  };
  const manifestYaml = yaml.stringify(manifestObj);

  // 2. ARCHITECTURE.md
  const architectureMd = `# Architecture

This document describes the structural organization, system boundaries, and technology stack of **${analysis.name}**.

---
id: "ARCH-0001"
title: "${analysis.name} Core Architecture & Stack"
status: "active"
created_at: "${today}"
updated_at: "${today}"
tags: ["system-architecture", "tech-stack"${analysis.languages.length > 0 ? `, "${analysis.languages[0].toLowerCase()}"` : ""}]
dependencies: []
---

## Overview
${analysis.description}

## Detected Technology Stack
* **Primary Languages:** ${analysis.languages.length > 0 ? analysis.languages.join(", ") : "Not specified"}
* **Key Frameworks:** ${analysis.frameworks.length > 0 ? analysis.frameworks.join(", ") : "Core runtime"}
* **Tooling & Infrastructure:** ${analysis.tools.length > 0 ? analysis.tools.join(", ") : "Standard development tools"}
* **Package / Environment Manager:** \`${analysis.packageManager}\`

## Structural Organization
The project follows clean component modularity with designated configuration, source code, and operational routines. All persistent context is unified under \`context/\` according to the Project Context Protocol.
`;

  // 3. DECISION_LOG.md
  const decisionLogMd = `# Decision Log

This document records the architectural and engineering decisions that shape **${analysis.name}**.

---
id: "DEC-0001"
title: "Adopt ${primaryFramework} and Project Context Protocol (PCP)"
status: "accepted"
date: "${today}"
contributors: ["Repository Maintainers", "PCP Bootstrapper"]
supersedes: null
superseded_by: null
tags: ["foundational", "architecture"${analysis.frameworks.length > 0 ? `, "${analysis.frameworks[0].toLowerCase()}"` : ""}]
dependencies: ["ARCH-0001"]
---

## Context
As **${analysis.name}** evolves, consistent engineering decisions, shared architectural memory, and seamless handovers between human contributors and AI assistants are required.

## Decision
1. Standardize on **${primaryFramework}** (${stackSummary}) for core implementation.
2. Adopt the **Project Context Protocol (PCP)** to maintain a continuous, durable Single Source of Truth directly inside the repository.

## Rationale
Prevents knowledge fragmentation, simplifies contributor onboarding, and ensures autonomous AI coding assistants operate with full context alignment.

## Consequences
* Architectural choices and durable facts must be recorded in \`context/DECISION_LOG.md\` and \`context/KNOWLEDGE.md\`.
* Context integrity is continuously verifiable via \`npx @craftsolutions/pcp check\`.
`;

  // 4. KNOWLEDGE.md
  const knowledgeMd = `# Knowledge Base

This document captures durable domain rules, invariants, and technical standards for **${analysis.name}**.

---
id: "KN-0001"
title: "Development and Dependency Standards"
status: "active"
created_at: "${today}"
updated_at: "${today}"
tags: ["standards", "dependency-hygiene", "conventions"]
dependencies: ["ARCH-0001", "DEC-0001"]
---

## Rule: Dependency Hygiene
Before introducing new third-party libraries, verify whether existing built-in solutions (${primaryLang} native APIs) satisfy the requirement to minimize security surface and bundle bloat.

## Rule: Single Source of Truth
Project context lives in \`context/manifest.yaml\` and its associated markdown documents. AI agents and human developers must query this context before assuming project boundaries.

## Rule: Automated Verification
Code modifications must pass all standard automated test scripts prior to landing in the main branch.
`;

  // 5. OPEN_WORK.md
  const openWorkMd = `# Open Work

This document tracks active priorities, roadmap tasks, and technical debt for **${analysis.name}**.

---
id: "WORK-0001"
title: "Refine Initial PCP Context and Domain Knowledge"
status: "open"
priority: "high"
owner: "Team"
created_at: "${today}"
updated_at: "${today}"
target_version: "v1.0"
tags: ["onboarding", "pcp", "documentation"]
dependencies: ["ARCH-0001", "DEC-0001"]
---

## Description
Complete the initial refinement of the bootstrapped PCP context:
1. Verify system components and domain boundaries in \`context/ARCHITECTURE.md\`.
2. Document established historical decisions in \`context/DECISION_LOG.md\`.
3. Add unique business rules and invariant constraints to \`context/KNOWLEDGE.md\`.

## Verification Criteria
* All registered components accurately describe the project state.
* \`npx @craftsolutions/pcp check\` passes with 0 errors and 0 warnings.
`;

  // 6. OPERATIONAL_GUIDE.md
  const opsGuideMd = `# Operational Guide

This document defines setup, testing, maintenance, and execution runbooks for **${analysis.name}**.

---
id: "OPS-0001"
title: "Setup, Testing, and Execution Runbook"
status: "active"
created_at: "${today}"
updated_at: "${today}"
tags: ["setup", "testing", "runbook"]
dependencies: ["ARCH-0001"]
---

## Prerequisites
* Runtime: ${primaryLang}
* Package / Dependency Manager: \`${analysis.packageManager}\`

## Setup Procedure
Clone the repository and install dependencies:
\`\`\`bash
${analysis.scripts.setup}
\`\`\`

## Testing Procedure
Execute the automated test suite:
\`\`\`bash
${analysis.scripts.test}
\`\`\`
${analysis.scripts.build ? `\n## Build Procedure\nCompile production assets:\n\`\`\`bash\n${analysis.scripts.build}\n\`\`\`\n` : ""}${analysis.scripts.dev ? `\n## Development Mode\nStart the local development server:\n\`\`\`bash\n${analysis.scripts.dev}\n\`\`\`\n` : ""}
## Context Verification
Verify PCP context health at any time:
\`\`\`bash
npx @craftsolutions/pcp check
\`\`\`
`;

  return {
    "manifest.yaml": manifestYaml,
    "ARCHITECTURE.md": architectureMd,
    "DECISION_LOG.md": decisionLogMd,
    "KNOWLEDGE.md": knowledgeMd,
    "OPEN_WORK.md": openWorkMd,
    "OPERATIONAL_GUIDE.md": opsGuideMd
  };
}

/**
 * Bootstraps an intelligent PCP context in a target project.
 * 
 * @param {string} projectDir Target project root
 * @param {object} [options]
 * @param {string} [options.contextDir='context'] Relative path for output context folder
 * @param {string} [options.name] Explicit project name override
 * @param {boolean} [options.force=false] Force overwrite existing context
 * @param {boolean} [options.dryRun=false] Preview generation without writing
 * @returns {{ analysis: object, files: string[], validation: object, dryRun: boolean }}
 */
export function bootstrapProject(projectDir = ".", options = {}) {
  const resolvedProject = path.resolve(projectDir);
  const contextDirName = options.contextDir || "context";
  const targetContextDir = path.isAbsolute(contextDirName)
    ? contextDirName
    : path.join(resolvedProject, contextDirName);

  const dryRun = Boolean(options.dryRun);
  const force = Boolean(options.force);

  // Check if context already exists
  const manifestPath = path.join(targetContextDir, "manifest.yaml");
  if (fs.existsSync(manifestPath) && !force && !dryRun) {
    throw new Error(
      `Context already exists at '${path.relative(process.cwd(), targetContextDir)}'. Use --force to overwrite or 'pcp check' to validate.`
    );
  }

  // 1. Analyze repo
  const analysis = analyzeRepository(resolvedProject);
  if (options.name) {
    analysis.name = options.name;
    analysis.id = options.name.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
  }

  // 2. Generate content
  const contextFiles = generateBootstrappedContext(analysis);
  const fileNames = Object.keys(contextFiles);

  // 3. Write files if not dryRun
  if (!dryRun) {
    if (!fs.existsSync(targetContextDir)) {
      fs.mkdirSync(targetContextDir, { recursive: true });
    }

    for (const [fileName, content] of Object.entries(contextFiles)) {
      const filePath = path.join(targetContextDir, fileName);
      fs.writeFileSync(filePath, content, "utf8");
    }

    // 4. Validate resulting context
    const validation = validateContext(targetContextDir);
    if (!validation.valid) {
      const errMsgs = validation.errors.map((e) => `${e.file}: ${e.message}`).join("; ");
      throw new Error(`Bootstrapped context failed internal validation: ${errMsgs}`);
    }

    return {
      analysis,
      files: fileNames.map((f) => path.join(contextDirName, f)),
      validation,
      dryRun: false
    };
  }

  return {
    analysis,
    files: fileNames.map((f) => path.join(contextDirName, f)),
    validation: { valid: true, errors: [], warnings: [] },
    dryRun: true
  };
}
