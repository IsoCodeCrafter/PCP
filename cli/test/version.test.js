import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { VERSION, PACKAGE_NAME } from "../src/utils/version.js";

describe("PCP Version & Package SSOT", () => {
  it("exports a non-empty version matching package.json", () => {
    const pkgPath = new URL("../package.json", import.meta.url);
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

    assert.equal(VERSION, pkg.version);
    assert.equal(PACKAGE_NAME, "@craftsolutions/pcp");
    assert.match(VERSION, /^\d+\.\d+\.\d+/);
  });
});
