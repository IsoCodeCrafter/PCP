import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { getStatusSummary, formatBox } from "../src/commands/status.js";

const REPO_ROOT = path.resolve(import.meta.dirname, "../..");

describe("PCP Status Command (cli/src/commands/status.js)", () => {
  it("extracts status summary from the current PCP repository context", () => {
    const summary = getStatusSummary(REPO_ROOT, { contextDir: "context" });

    assert.equal(summary.active, true);
    assert.match(summary.projectName, /Project Context Protocol/);
    assert.ok(summary.lastDecision);
    assert.match(summary.lastDecision.id, /^DEC-/);
    assert.equal(typeof summary.activeTasks.count, "number");
  });

  it("returns active: false when manifest does not exist", () => {
    const summary = getStatusSummary("/non/existent/path");
    assert.equal(summary.active, false);
    assert.match(summary.reason, /No PCP manifest found/);
  });

  it("formats text lines into a clean boxed card", () => {
    const lines = ["Line 1", "Line 2 is longer"];
    const box = formatBox(lines);

    assert.ok(box.startsWith("┌"));
    assert.ok(box.endsWith("┘"));
    assert.ok(box.includes("Line 1"));
    assert.ok(box.includes("Line 2 is longer"));
  });
});
