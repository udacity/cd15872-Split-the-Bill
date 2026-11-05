import { test } from "node:test";
import assert from "node:assert/strict";
import createGroup from "../src/group.js";
import createExpense from "../src/behaviors.js";
const tea = () =>
  createExpense({
    id: "tea",
    description: "Tea",
    payer: "Alex",
    participants: ["Alex", "Sam"],
    amountCents: 100,
  });

test("5: check whether an expense has already been added", () => {
  const group = createGroup(["Alex", "Sam"]);
  assert.equal(group.hasExpense("tea"), false);
  group.addExpense(tea());
  assert.equal(group.hasExpense("tea"), true);
  assert.throws(
    () => group.addExpense(tea()),
    "adding the same ID twice should be rejected",
  );
});
test("6: find a saved expense by its ID", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(tea());
  assert.equal(group.findExpense("tea").description, "Tea");
  assert.equal(
    group.findExpense("missing"),
    undefined,
    "an unknown ID should have no result",
  );
});
test("6: removing an expense updates the list and tells the page to refresh", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(tea());
  let refreshCount = 0;
  const stopListening = group.subscribe(() => {
    refreshCount += 1;
  });
  assert.equal(group.removeExpense("tea"), true);
  assert.equal(group.getState().expenses.length, 0);
  assert.equal(
    refreshCount,
    1,
    "a successful removal should notify the page once",
  );
  assert.equal(group.removeExpense("missing"), false);
  assert.equal(
    refreshCount,
    1,
    "nothing changed, so another update is unnecessary",
  );
  stopListening();
  group.addExpense(tea());
  assert.equal(refreshCount, 1);
});
