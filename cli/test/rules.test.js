import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";
import {
  generatePcpRuleContent,
  mergeRuleContent,
  syncRules,
  PCP_RULES_START_MARKER,
  PCP_RULES_END_MARKER
} from "../src/core/rules.js";

const BIN_PATH = path.resolve(import.meta.dirname, "../bin/pcp.js");

describe("PCP Rules & Editor Bridge (cli/src/core/rules.js)", () => {
  it("generates valid PCP rule content with boundaries and manifest reference", () => {
    const block = generatePcpRuleContent({ contextDir: "my-context" });

    assert.ok(block.startsWith(PCP_RULES_START_MARKER));
    assert.ok(block.endsWith(PCP_RULES_END_MARKER));
    assert.match(block, /my-context\/manifest\.yaml/);
    assert.match(block, /my-context\/ARCHITECTURE\.md/);
    assert.match(block, /my-context\/DECISION_LOG\.md/);
    assert.match(block, /my-context\/KNOWLEDGE\.md/);
    assert.match(block, /my-context\/OPEN_WORK\.md/);
    assert.match(block, /my-context\/OPERATIONAL_GUIDE\.md/);
    assert.match(block, /Session Handshake/);
    assert.match(block, /Autonomous Context Synchronization/);
    assert.match(block, /npx @craftsolutions\/pcp check/);
    assert.match(block, /npx @craftsolutions\/pcp pack -a/);
  });

  it("handles mergeRuleContent on empty content as 'created'", () => {
    const block = generatePcpRuleContent();
    const result = mergeRuleContent("", block);

    assert.equal(result.action, "created");
    assert.equal(result.content.trim(), block.trim());
  });

  it("appends PCP block to existing file content without markers as 'updated'", () => {
    const block = generatePcpRuleContent();
    const existing = "# Custom User Rules\n\nAlways use TypeScript strict mode.";
    const result = mergeRuleContent(existing, block);

    assert.equal(result.action, "updated");
    assert.ok(result.content.startsWith("# Custom User Rules"));
    assert.ok(result.content.includes(PCP_RULES_START_MARKER));
    assert.ok(result.content.includes(PCP_RULES_END_MARKER));
  });

  it("surgically updates existing PCP block without touching surrounding user rules", () => {
    const oldBlock = `${PCP_RULES_START_MARKER}\nOld Directives\n${PCP_RULES_END_MARKER}`;
    const userHeader = "# Project Setup\nNode.js 22 required.";
    const userFooter = "# Architecture Rules\nUse functional components.";
    const existing = `${userHeader}\n\n${oldBlock}\n\n${userFooter}`;

    const newBlock = generatePcpRuleContent();
    const result = mergeRuleContent(existing, newBlock);

    assert.equal(result.action, "updated");
    assert.ok(result.content.startsWith(userHeader));
    assert.ok(result.content.endsWith(userFooter + "\n"));
    assert.ok(result.content.includes("Project Context Protocol (PCP) Directives"));
    assert.ok(!result.content.includes("Old Directives"));
  });

  it("reports 'unchanged' when rule block is already identical", () => {
    const block = generatePcpRuleContent();
    const content = `# User Header\n\n${block}\n\n# User Footer`;
    const result = mergeRuleContent(content, block);

    assert.equal(result.action, "unchanged");
    assert.equal(result.content, content);
  });

  it("synchronizes default target rule files in a directory and remains idempotent", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-rules-test-"));

    try {
      // 1. Initial sync
      const firstRun = syncRules(tempDir, { contextDir: "context" });
      assert.equal(firstRun.dryRun, false);
      assert.equal(firstRun.results.length, 3);
      assert.ok(firstRun.results.every((r) => r.action === "created"));

      assert.ok(fs.existsSync(path.join(tempDir, ".cursorrules")));
      assert.ok(fs.existsSync(path.join(tempDir, "CLAUDE.md")));
      assert.ok(fs.existsSync(path.join(tempDir, ".github", "copilot-instructions.md")));

      // 2. Idempotent second sync
      const secondRun = syncRules(tempDir, { contextDir: "context" });
      assert.ok(secondRun.results.every((r) => r.action === "unchanged"));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("respects --dry-run without modifying the filesystem", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-rules-dryrun-"));

    try {
      const result = syncRules(tempDir, { dryRun: true });
      assert.equal(result.dryRun, true);
      assert.equal(result.results.length, 3);
      assert.ok(result.results.every((r) => r.action === "created"));

      // Nothing should have been written to disk
      assert.ok(!fs.existsSync(path.join(tempDir, ".cursorrules")));
      assert.ok(!fs.existsSync(path.join(tempDir, "CLAUDE.md")));
      assert.ok(!fs.existsSync(path.join(tempDir, ".github", "copilot-instructions.md")));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("synchronizes custom targets like windsurf", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-rules-windsurf-"));

    try {
      const result = syncRules(tempDir, { targets: ["windsurf"] });
      assert.equal(result.results.length, 1);
      assert.equal(result.results[0].target, "windsurf");
      assert.equal(result.results[0].file, ".windsurfrules");
      assert.ok(fs.existsSync(path.join(tempDir, ".windsurfrules")));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("executes via CLI cleanly", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-rules-cli-"));

    try {
      const stdout = execSync(`node "${BIN_PATH}" sync-rules -d "${tempDir}" --targets cursor,claude`, {
        encoding: "utf8"
      });

      assert.match(stdout, /PCP Rules — Editor & Agent Bridge/);
      assert.match(stdout, /\.cursorrules/);
      assert.match(stdout, /CLAUDE\.md/);
      assert.ok(fs.existsSync(path.join(tempDir, ".cursorrules")));
      assert.ok(fs.existsSync(path.join(tempDir, "CLAUDE.md")));
      assert.ok(!fs.existsSync(path.join(tempDir, ".github", "copilot-instructions.md")));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
