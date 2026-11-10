import { test } from "node:test";
import assert from "node:assert/strict";
import createExpense, { Taggable } from "../src/behaviors.js";
import { EvenSplit, ShareSplit } from "../src/models.js";

test("3: add a tag, trim spaces, and ignore duplicate tags [Milestone 2, Task 3]", () => {
  const labels = Taggable(["trip"]);
  labels.addTag(" food ");
  labels.addTag("food");
  assert.deepEqual(labels.getTags(), ["trip", "food"]);
  assert.throws(() => labels.addTag(" "), "an empty tag should be rejected");
});
test("3: each expense keeps its own private list of tags [Milestone 2, Task 3]", () => {
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
test("4: an expense can have tags and still split its amount [Milestone 2, Task 4]", () => {
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

test("3: reject non-text tags without changing the private list [Milestone 2, Task 3]", () => {
  const labels = Taggable(["trip"]);
  for (const value of [null, undefined, 42, {}, []]) {
    assert.throws(() => labels.addTag(value));
    assert.deepEqual(labels.getTags(), ["trip"]);
  }
});

test("4: a weighted expense keeps its class, tags, and split behavior [Milestone 2, Task 4]", () => {
  const expense = createExpense({
    id: "dinner",
    description: "Dinner",
    payer: "Alex",
    participants: ["Alex", "Sam"],
    amountCents: 300,
    type: "share",
    weights: [1, 2],
    tags: ["trip"],
  });
  assert.ok(expense instanceof ShareSplit);
  expense.addTag("food");
  assert.deepEqual(expense.getTags(), ["trip", "food"]);
  assert.deepEqual(expense.split(), { Alex: 100, Sam: 200 });
});
