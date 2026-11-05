import { test } from "node:test";
import assert from "node:assert/strict";
import createExpense, { Taggable } from "../src/behaviors.js";
import { EvenSplit } from "../src/models.js";

test("3: add a tag, trim spaces, and ignore duplicate tags", () => {
  const labels = Taggable(["trip"]);
  labels.addTag(" food ");
  labels.addTag("food");
  assert.deepEqual(labels.getTags(), ["trip", "food"]);
  assert.throws(() => labels.addTag(" "), "an empty tag should be rejected");
});
test("3: each expense keeps its own private list of tags", () => {
  const original = ["trip"];
  const first = Taggable(original);
  const second = Taggable();
  original.push("outside");
  first.getTags().push("outside");
  first.addTag("food");
  assert.deepEqual(
    first.getTags(),
    ["trip", "food"],
    "changing a copy should not change the private list",
  );
  assert.deepEqual(
    second.getTags(),
    [],
    "another expense should have its own list",
  );
});
test("4: an expense can have tags and still split its amount", () => {
  const expense = createExpense({
    id: "tea",
    description: "Tea",
    payer: "Alex",
    participants: ["Alex"],
    amountCents: 100,
    tags: ["trip"],
  });
  assert.ok(
    expense instanceof EvenSplit,
    "adding tags should keep the expense's class",
  );
  assert.deepEqual(expense.getTags(), ["trip"]);
  assert.deepEqual(expense.split(), { Alex: 100 });
});
