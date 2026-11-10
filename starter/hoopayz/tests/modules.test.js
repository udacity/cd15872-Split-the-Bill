// PROVIDED verification: students need not write or study the test runner internals.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { Taggable as publicTaggable } from "../src/behaviors.js";
test("11: tags live in their own module and remain available to the app [Milestone 5, Task 11]", async () => {
  const path = new URL("../src/tags.js", import.meta.url);
  assert.ok(existsSync(path), "Milestone 5, Task 11: Create src/tags.js and move Taggable into it");
  const { Taggable } = await import(path.href);
  assert.equal(
    typeof Taggable,
    "function",
    "Milestone 5, Task 11: tags.js should have a named Taggable export",
  );
  assert.equal(
    publicTaggable,
    Taggable,
    "Milestone 5, Task 11: behaviors.js should import and re-export the same factory",
  );
  const tags = Taggable(["trip"]);
  assert.deepEqual(tags.getTags(), ["trip"]);
});
