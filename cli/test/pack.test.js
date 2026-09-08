import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";
import { packContext } from "../src/core/pack.js";

const repoRoot = path.resolve(import.meta.dirname, "../../");
const LIVING_CONTEXT_DIR = path.join(repoRoot, "context");
const BIN_PATH = path.resolve(import.meta.dirname, "../bin/pcp.js");

describe("PCP Pack Compiler (cli/src/core/pack.js)", () => {
  it("packs the full living context into markdown with correct structure and TOC", () => {
    const result = packContext(LIVING_CONTEXT_DIR, { activeOnly: false });

    assert.equal(result.format, "markdown");
    assert.equal(result.stats.totalComponents, 5);
    assert.equal(result.stats.totalEntries, 12);
    assert.equal(result.stats.activeOnly, false);
    assert.ok(result.stats.estimatedTokens > 1000);

    // Markdown assertions
    assert.match(result.output, /^# 📦 Project Context Bundle: Project Context Protocol/);
    assert.match(result.output, /## 📋 Table of Contents/);
    assert.match(result.output, /1\. \[Architecture\]\(#1-architecture\) \(`ARCHITECTURE\.md`\) — \*2 entries\*/);
    assert.match(result.output, /2\. \[Decisions\]\(#2-decisions\) \(`DECISION_LOG\.md`\) — \*2 entries\*/);
    assert.match(result.output, /3\. \[Knowledge\]\(#3-knowledge\) \(`KNOWLEDGE\.md`\) — \*3 entries\*/);
    assert.match(result.output, /4\. \[Open Work\]\(#4-open-work\) \(`OPEN_WORK\.md`\) — \*3 entries\*/);
    assert.match(result.output, /5\. \[Operational Guide\]\(#5-operational-guide\) \(`OPERATIONAL_GUIDE\.md`\) — \*2 entries\*/);

    // Content headers
    assert.match(result.output, /## 1\. Architecture \(`ARCHITECTURE\.md`\)/);
    assert.match(result.output, /## 2\. Decisions \(`DECISION_LOG\.md`\)/);
    assert.match(result.output, /## 4\. Open Work \(`OPEN_WORK\.md`\)/);

    // Entries presence
    assert.match(result.output, /id: "ARCH-0001"/);
    assert.match(result.output, /id: "DEC-0001"/);
    assert.match(result.output, /id: "WORK-0001"/);
  });

  it("filters out completed, superseded, and inactive entries when activeOnly is true", () => {
    const result = packContext(LIVING_CONTEXT_DIR, { activeOnly: true });

    assert.equal(result.format, "markdown");
    assert.equal(result.stats.totalComponents, 5);
    // In living repo: all 3 WORK items are status 'completed', so active entries = 12 - 3 = 9
    assert.equal(result.stats.totalEntries, 9);
    assert.equal(result.stats.activeOnly, true);

    // Completed work items should not appear as active entries
    assert.doesNotMatch(result.output, /id:\s*"?WORK-0001"?/);
    assert.doesNotMatch(result.output, /id:\s*"?WORK-0002"?/);
    assert.doesNotMatch(result.output, /id:\s*"?WORK-0003"?/);

    // Should indicate all entries were inactive in Open Work
    assert.match(result.output, /\*\(All 3 entries in this component are completed, superseded, or inactive\.\)\*/);

    // Active items still present
    assert.match(result.output, /id:\s*"?ARCH-0001"?/);
    assert.match(result.output, /id:\s*"?DEC-0001"?/);
    assert.match(result.output, /id:\s*"?KN-0001"?/);
  });

  it("packs only requested components by name and alias", () => {
    // Test with aliases: 'arch' and 'dec'
    const result = packContext(LIVING_CONTEXT_DIR, {
      components: ["arch", "dec"]
    });

    assert.equal(result.stats.totalComponents, 2);
    assert.equal(result.stats.totalEntries, 4);

    assert.match(result.output, /## 1\. Architecture/);
    assert.match(result.output, /## 2\. Decisions/);
    assert.doesNotMatch(result.output, /## 3\. Knowledge/);
    assert.doesNotMatch(result.output, /## 4\. Open Work/);
  });

  it("produces valid structured JSON when format is 'json'", () => {
    const result = packContext(LIVING_CONTEXT_DIR, {
      format: "json",
      activeOnly: false
    });

    assert.equal(result.format, "json");
    const parsed = JSON.parse(result.output);

    assert.equal(parsed.project.id, "pcp-core");
    assert.equal(parsed.project.name, "Project Context Protocol (PCP)");
    assert.equal(parsed.meta.active_only, false);
    assert.equal(parsed.stats.total_components, 5);
    assert.equal(parsed.stats.total_entries, 12);
    assert.ok(parsed.stats.estimated_tokens > 0);
    assert.equal(parsed.components.length, 5);

    const arch = parsed.components.find((c) => c.key === "architecture");
    assert.ok(arch);
    assert.equal(arch.entries_count, 2);
    assert.equal(arch.entries[0].id, "ARCH-0001");
  });

  it("throws descriptive errors for non-existent manifest or unknown components", () => {
    assert.throws(
      () => packContext("/non/existent/path"),
      /Manifest file not found/
    );

    assert.throws(
      () => packContext(LIVING_CONTEXT_DIR, { components: ["invalid_comp_xyz"] }),
      /No matching components found for: invalid_comp_xyz/
    );
  });

  it("executes via CLI with -o flag and writes output file", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-pack-test-"));
    const outputFile = path.join(tempDir, "context-pack.md");

    try {
      execSync(`node "${BIN_PATH}" pack -d "${LIVING_CONTEXT_DIR}" -o "${outputFile}"`, {
        encoding: "utf8"
      });

      assert.ok(fs.existsSync(outputFile));
      const content = fs.readFileSync(outputFile, "utf8");
      assert.match(content, /^# 📦 Project Context Bundle:/);
      assert.match(content, /## 📋 Table of Contents/);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("executes via CLI to stdout cleanly when no output flag is passed", () => {
    const stdout = execSync(`node "${BIN_PATH}" pack -d "${LIVING_CONTEXT_DIR}" -a`, {
      encoding: "utf8"
    });

    assert.match(stdout, /^# 📦 Project Context Bundle:/);
    assert.match(stdout, /Mode:\*\* Active Items Only/);
  });
});
