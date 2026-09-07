import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseMarkdownStringEntries, parseManifest } from "../src/core/parser.js";

describe("PCP Markdown Parser (parseMarkdownStringEntries)", () => {
  it("parses single frontmatter at the top of markdown content", () => {
    const md = `---
id: "ARCH-0001"
title: "Core Architecture"
status: "active"
tags: ["system", "core"]
dependencies: []
---

# Architecture Document
This is the core architecture specification.`;

    const entries = parseMarkdownStringEntries(md);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].frontmatter.id, "ARCH-0001");
    assert.equal(entries[0].frontmatter.title, "Core Architecture");
    assert.equal(entries[0].frontmatter.status, "active");
    assert.equal(entries[0].startLine, 1);
  });

  it("parses multiple sequential frontmatters in the same document", () => {
    const md = `---
id: "DEC-0001"
title: "First Decision"
status: "accepted"
---

Some context for first decision.

---
id: "DEC-0002"
title: "Second Decision"
status: "proposed"
---

Some context for second decision.`;

    const entries = parseMarkdownStringEntries(md);
    assert.equal(entries.length, 2);
    assert.equal(entries[0].frontmatter.id, "DEC-0001");
    assert.equal(entries[1].frontmatter.id, "DEC-0002");
    assert.equal(entries[1].frontmatter.title, "Second Decision");
  });

  it("ignores code blocks containing triple hyphens and mock frontmatters", () => {
    const md = `---
id: "KN-0001"
title: "Markdown Standards"
status: "active"
---

Here is an example of code:

\`\`\`yaml
---
id: "MOCK-9999"
title: "Should Not Be Parsed"
---
\`\`\`

\`\`\`markdown
---
id: "MOCK-8888"
---
\`\`\`

~~~yaml
---
id: "MOCK-7777"
---
~~~

---
id: "KN-0002"
title: "Real Second Entry"
status: "active"
---

End of document.`;

    const entries = parseMarkdownStringEntries(md);
    assert.equal(entries.length, 2);
    assert.equal(entries[0].frontmatter.id, "KN-0001");
    assert.equal(entries[1].frontmatter.id, "KN-0002");
    assert.equal(entries[1].frontmatter.title, "Real Second Entry");
  });

  it("resiliently ignores markdown horizontal rules (---) without losing subsequent entries", () => {
    const md = `# Document With Horizontal Rules

Here is some intro text.

---

Here is a paragraph after a thematic break.

---

Another paragraph.

---
id: "WORK-0001"
title: "Implement Parser"
status: "completed"
---

Work item details.

---

Closing footer divider.`;

    const entries = parseMarkdownStringEntries(md);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].frontmatter.id, "WORK-0001");
    assert.equal(entries[0].frontmatter.status, "completed");
  });

  it("handles empty or malformed frontmatter blocks gracefully", () => {
    const md = `---
---
---
not a valid yaml: [
---
---
id: "OPS-0001"
title: "Valid Ops Entry"
status: "active"
---`;

    const entries = parseMarkdownStringEntries(md);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].frontmatter.id, "OPS-0001");
  });
});
