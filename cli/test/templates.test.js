import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

describe("PCP Template Consistency & SSOT Audit (cli/test/templates.test.js)", () => {
  const repoRoot = path.resolve(import.meta.dirname, "../../");
  const refDir = path.join(repoRoot, "reference/context-template/context");
  const cliDir = path.join(repoRoot, "cli/templates/context");

  it("ensures reference and cli template directories exist", () => {
    assert.ok(fs.existsSync(refDir), `Missing reference template dir at: ${refDir}`);
    assert.ok(fs.existsSync(cliDir), `Missing cli template dir at: ${cliDir}`);
  });

  it("guarantees 100% byte-for-byte identity between reference and bundled templates (Zero Drift)", () => {
    const refFiles = fs.readdirSync(refDir).sort();
    const cliFiles = fs.readdirSync(cliDir).sort();

    assert.deepEqual(refFiles, cliFiles, "Template file rosters must match exactly.");

    for (const file of refFiles) {
      const refContent = fs.readFileSync(path.join(refDir, file), "utf8");
      const cliContent = fs.readFileSync(path.join(cliDir, file), "utf8");
      assert.equal(
        refContent,
        cliContent,
        `Template drift detected in '${file}': reference and bundled cli template must be identical.`
      );
    }
  });

  it("verifies manifest.yaml does NOT contain derived state (count or active_items)", () => {
    for (const dir of [refDir, cliDir, path.join(repoRoot, "context")]) {
      const manifestPath = path.join(dir, "manifest.yaml");
      assert.ok(fs.existsSync(manifestPath), `manifest.yaml must exist in ${dir}`);

      const content = fs.readFileSync(manifestPath, "utf8");
      const parsed = yaml.parse(content);

      for (const [compName, compConfig] of Object.entries(parsed.components || {})) {
        assert.equal(
          compConfig.count,
          undefined,
          `SSOT Violation: 'count' must not be in manifest.yaml for component '${compName}' in ${dir}`
        );
        assert.equal(
          compConfig.active_items,
          undefined,
          `SSOT Violation: 'active_items' must not be in manifest.yaml for component '${compName}' in ${dir}`
        );
        assert.ok(compConfig.path, `Component '${compName}' must declare a valid 'path' in ${dir}`);
      }
    }
  });
});
