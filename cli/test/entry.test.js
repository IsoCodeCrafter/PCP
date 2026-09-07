import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { formatEntryBlock, getNextEntryId, appendEntry } from "../src/core/entry.js";

describe("PCP Entry Management (cli/src/core/entry.js)", () => {
  const repoRoot = path.resolve(import.meta.dirname, "../../");
  const repoContext = path.join(repoRoot, "context");

  it("calculates the correct next entry ID based on existing entries", () => {
    // repo context currently has DEC-0001, DEC-0002
    const nextDec = getNextEntryId(repoContext, "decisions");
    assert.equal(nextDec, "DEC-0003");

    // repo context currently has ARCH-0001, ARCH-0002
    const nextArch = getNextEntryId(repoContext, "architecture");
    assert.equal(nextArch, "ARCH-0003");
  });

  it("formats an RFC-0001 compliant frontmatter block", () => {
    const formatted = formatEntryBlock({
      id: "DEC-0099",
      title: "Test Decision",
      status: "accepted",
      tags: ["test", "unit"],
      dependencies: ["ARCH-0001"],
      content: "## Context\nTesting the formatter.",
      component: "decisions"
    });

    assert.equal(formatted.id, "DEC-0099");
    assert.equal(formatted.frontmatter.title, "Test Decision");
    assert.ok(formatted.blockText.includes("id: DEC-0099"));
    assert.ok(formatted.blockText.includes("Testing the formatter."));
  });

  it("appends an entry and validates context in a temporary environment", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-entry-test-"));
    try {
      const manifestContent = `pcp_version: "0.1"
schema_version: "1.0"
project:
  name: "Temporary Test"
  id: "temp-test"
components:
  decisions:
    path: "DECISION_LOG.md"
`;
      fs.writeFileSync(path.join(tempDir, "manifest.yaml"), manifestContent, "utf8");
      fs.writeFileSync(path.join(tempDir, "DECISION_LOG.md"), "# Decision Log\n", "utf8");

      // Append first entry
      const res1 = appendEntry(tempDir, {
        component: "decisions",
        title: "Initial Decision",
        content: "We decided to start the project."
      });

      assert.equal(res1.success, true);
      assert.equal(res1.id, "DEC-0001");
      assert.equal(res1.validation.stats.totalEntries, 1);

      // Append second entry (auto ID: DEC-0002)
      const res2 = appendEntry(tempDir, {
        component: "decisions",
        title: "Second Decision",
        content: "Second decision details."
      });

      assert.equal(res2.success, true);
      assert.equal(res2.id, "DEC-0002");
      assert.equal(res2.validation.stats.totalEntries, 2);

      // Duplicate ID rejection
      assert.throws(() => {
        appendEntry(tempDir, {
          component: "decisions",
          id: "DEC-0001",
          title: "Conflicting Decision",
          content: "Should fail."
        });
      }, /Duplicate ID/);

      // Verify file content has both entries
      const content = fs.readFileSync(path.join(tempDir, "DECISION_LOG.md"), "utf8");
      assert.ok(content.includes("id: DEC-0001"));
      assert.ok(content.includes("id: DEC-0002"));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("rolls back appended content if validation fails (e.g. dangling reference)", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-rollback-test-"));
    try {
      const manifestContent = `pcp_version: "0.1"
schema_version: "1.0"
project:
  name: "Rollback Test"
  id: "rollback-test"
components:
  decisions:
    path: "DECISION_LOG.md"
`;
      fs.writeFileSync(path.join(tempDir, "manifest.yaml"), manifestContent, "utf8");
      fs.writeFileSync(path.join(tempDir, "DECISION_LOG.md"), "# Decision Log\n", "utf8");

      // Attempt to append with dangling reference
      assert.throws(() => {
        appendEntry(tempDir, {
          component: "decisions",
          title: "Broken Decision",
          dependencies: ["NON_EXISTENT_ID-9999"],
          content: "Has broken dep."
        });
      }, /Context validation failed after appending/);

      // File must be intact and not contain broken entry
      const fileContent = fs.readFileSync(path.join(tempDir, "DECISION_LOG.md"), "utf8");
      assert.equal(fileContent, "# Decision Log\n");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
