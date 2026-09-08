import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";
import {
  analyzeRepository,
  generateBootstrappedContext,
  bootstrapProject
} from "../src/core/bootstrap.js";
import { validateContext } from "../src/core/validator.js";

const BIN_PATH = path.resolve(import.meta.dirname, "../bin/pcp.js");

describe("PCP Bootstrapper & Codebase Analyzer (cli/src/core/bootstrap.js)", () => {
  it("analyzes Node.js projects with TypeScript, frameworks, and scripts", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-analyze-node-"));

    try {
      const mockPkg = {
        name: "@my-org/analytics-service",
        description: "High throughput analytics ingestion service.",
        scripts: {
          test: "vitest run",
          build: "tsc -b",
          dev: "tsx watch src/index.ts"
        },
        dependencies: {
          fastify: "^4.0.0",
          react: "^18.0.0"
        },
        devDependencies: {
          typescript: "^5.0.0",
          vitest: "^1.0.0"
        }
      };

      fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify(mockPkg, null, 2), "utf8");
      fs.writeFileSync(path.join(tempDir, "pnpm-lock.yaml"), "", "utf8");

      const analysis = analyzeRepository(tempDir);

      assert.equal(analysis.name, "@my-org/analytics-service");
      assert.equal(analysis.id, "analytics-service");
      assert.equal(analysis.packageManager, "pnpm");
      assert.ok(analysis.languages.includes("JavaScript"));
      assert.ok(analysis.languages.includes("TypeScript"));
      assert.ok(analysis.frameworks.includes("Fastify"));
      assert.ok(analysis.frameworks.includes("React"));
      assert.ok(analysis.tools.includes("Vitest"));
      assert.equal(analysis.scripts.setup, "pnpm install");
      assert.equal(analysis.scripts.test, "pnpm test");
      assert.equal(analysis.scripts.build, "pnpm build");
      assert.equal(analysis.scripts.dev, "pnpm dev");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("analyzes Python, Rust, and Go ecosystems", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-analyze-poly-"));

    try {
      // 1. Python pyproject.toml
      const pyproject = `
[project]
name = "data-pipeline"
description = "Fast ETL pipeline"
`;
      fs.writeFileSync(path.join(tempDir, "pyproject.toml"), pyproject, "utf8");
      let analysis = analyzeRepository(tempDir);
      assert.ok(analysis.languages.includes("Python"));
      assert.equal(analysis.name, "data-pipeline");
      assert.equal(analysis.scripts.test, "pytest");

      // 2. Rust Cargo.toml
      const cargo = `
[package]
name = "crypto-engine"
version = "0.1.0"
`;
      fs.writeFileSync(path.join(tempDir, "Cargo.toml"), cargo, "utf8");
      analysis = analyzeRepository(tempDir);
      assert.ok(analysis.languages.includes("Rust"));
      assert.equal(analysis.name, "crypto-engine");
      assert.equal(analysis.scripts.test, "cargo test");

      // 3. Go go.mod
      const goMod = `module github.com/acme/auth-gateway\n\ngo 1.22\n`;
      fs.writeFileSync(path.join(tempDir, "go.mod"), goMod, "utf8");
      analysis = analyzeRepository(tempDir);
      assert.ok(analysis.languages.includes("Go"));
      assert.equal(analysis.name, "auth-gateway");
      assert.equal(analysis.scripts.test, "go test ./...");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("generates 100% schema-valid PCP context files", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-bootstrap-valid-"));

    try {
      const mockPkg = {
        name: "payment-gateway",
        description: "PCI-compliant payment processor",
        scripts: {
          test: "npm test",
          build: "npm run build"
        }
      };
      fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify(mockPkg), "utf8");

      const result = bootstrapProject(tempDir, { contextDir: "context" });

      assert.equal(result.dryRun, false);
      assert.equal(result.files.length, 6);
      assert.equal(result.validation.valid, true);
      assert.equal(result.validation.errors.length, 0);

      // Verify files created
      const contextDir = path.join(tempDir, "context");
      assert.ok(fs.existsSync(path.join(contextDir, "manifest.yaml")));
      assert.ok(fs.existsSync(path.join(contextDir, "ARCHITECTURE.md")));
      assert.ok(fs.existsSync(path.join(contextDir, "DECISION_LOG.md")));
      assert.ok(fs.existsSync(path.join(contextDir, "KNOWLEDGE.md")));
      assert.ok(fs.existsSync(path.join(contextDir, "OPEN_WORK.md")));
      assert.ok(fs.existsSync(path.join(contextDir, "OPERATIONAL_GUIDE.md")));

      // Verify independent validation
      const independentValidation = validateContext(contextDir);
      assert.equal(independentValidation.valid, true);
      assert.equal(independentValidation.stats.totalComponents, 5);
      assert.equal(independentValidation.stats.totalEntries, 5);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("protects existing context from accidental overwrite unless --force is specified", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-bootstrap-force-"));

    try {
      // 1. First bootstrap succeeds
      bootstrapProject(tempDir);
      assert.ok(fs.existsSync(path.join(tempDir, "context", "manifest.yaml")));

      // 2. Second bootstrap without force throws error
      assert.throws(
        () => bootstrapProject(tempDir, { force: false }),
        /Context already exists/
      );

      // 3. Second bootstrap with force succeeds
      const forced = bootstrapProject(tempDir, { force: true, name: "overridden-name" });
      assert.equal(forced.analysis.name, "overridden-name");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("respects dryRun flag without creating files on disk", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-bootstrap-dry-"));

    try {
      const result = bootstrapProject(tempDir, { dryRun: true });
      assert.equal(result.dryRun, true);
      assert.equal(result.files.length, 6);
      assert.ok(!fs.existsSync(path.join(tempDir, "context")));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("executes via CLI cleanly and scaffolds context", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-bootstrap-cli-"));

    try {
      const mockPkg = {
        name: "my-cli-app",
        scripts: { test: "node --test" }
      };
      fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify(mockPkg), "utf8");

      const stdout = execSync(`node "${BIN_PATH}" bootstrap -d "${tempDir}"`, {
        encoding: "utf8"
      });

      assert.match(stdout, /PCP Bootstrap — Smart Context Generator/);
      assert.match(stdout, /Successfully bootstrapped 6 tailored context files/);
      assert.ok(fs.existsSync(path.join(tempDir, "context", "manifest.yaml")));

      // Verify check passes on bootstrapped context
      const checkStdout = execSync(`node "${BIN_PATH}" check -d "${path.join(tempDir, "context")}"`, {
        encoding: "utf8"
      });
      assert.match(checkStdout, /All PCP schema, component, and cross-reference checks PASSED/);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
