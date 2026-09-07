import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { validateContext } from "../src/core/validator.js";

describe("PCP Context Validator (validateContext)", () => {
  const repoRoot = path.resolve(import.meta.dirname, "../../");
  const repoContext = path.join(repoRoot, "context");

  it("validates the living repo context directory with 100% success", () => {
    const result = validateContext(repoContext);
    assert.equal(result.valid, true, `Errors found: ${JSON.stringify(result.errors)}`);
    assert.equal(result.errors.length, 0);
    assert.ok(result.stats.totalComponents >= 5);
    assert.ok(result.stats.totalEntries >= 12);
  });

  it("returns error when manifest.yaml is missing", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-test-"));
    try {
      const result = validateContext(tempDir);
      assert.equal(result.valid, false);
      assert.ok(result.errors.some((e) => e.file === "manifest.yaml"));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("detects dangling references and duplicate IDs", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pcp-test-"));
    try {
      const manifestContent = `pcp_version: "0.1"
schema_version: "1.0"
project:
  name: "Test Project"
  id: "test-proj"
components:
  decisions:
    path: "DECISION_LOG.md"
`;
      fs.writeFileSync(path.join(tempDir, "manifest.yaml"), manifestContent, "utf8");

      const decisionsContent = `---
id: "DEC-0001"
title: "First Decision"
status: "accepted"
dependencies: ["ARCH-9999"]
---

---
id: "DEC-0001"
title: "Duplicate Decision"
status: "proposed"
---
`;
      fs.writeFileSync(path.join(tempDir, "DECISION_LOG.md"), decisionsContent, "utf8");

      const result = validateContext(tempDir);
      assert.equal(result.valid, false);

      // Duplicate ID check
      assert.ok(
        result.errors.some((e) => e.message.includes("Duplicate ID 'DEC-0001' found")),
        "Expected duplicate ID error"
      );

      // Dangling reference check
      assert.ok(
        result.errors.some((e) => e.message.includes("Dangling Reference") && e.message.includes("ARCH-9999")),
        "Expected dangling reference error"
      );
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
