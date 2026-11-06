import { test } from "node:test";
import assert from "node:assert/strict";
import createGroup from "../src/group.js";
import createExpense from "../src/behaviors.js";
const tea = (id = "tea") =>
  createExpense({
    id,
    description: "Tea",
    payer: "Alex",
    participants: ["Alex", "Sam"],
    amountCents: 100,
  });

// Checkpoints A–C do not require subscribe or notification behavior.
test("5: state: a new group has its members and no expenses", () => {
  const group = createGroup(["Alex", "Sam"]);
  assert.deepEqual(group.getState(), {
    members: ["Alex", "Sam"],
    expenses: [],
  });
});

test("5: add: check whether an expense has already been added and reject duplicates", () => {
  const group = createGroup(["Alex", "Sam"]);
  assert.equal(group.hasExpense("tea"), false);
  group.addExpense(tea());
  assert.equal(group.hasExpense("tea"), true);
  assert.throws(() => group.addExpense(tea()), "reject a duplicate ID");
  assert.equal(group.getState().expenses.length, 1);
});

test("5: add: reject an outside payer or participant without changing state", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(tea());
  for (const changes of [
    { payer: "Pat" },
    { participants: ["Alex", "Pat"] },
  ]) {
    const outsider = createExpense({ ...tea("outside").toJSON(), ...changes });
    assert.throws(() => group.addExpense(outsider));
    assert.deepEqual(group.getState().expenses.map((expense) => expense.id), ["tea"]);
  }
});

test("5: add: validate an expense again when saving its copy", () => {
  const group = createGroup(["Alex", "Sam"]);
  const invalid = tea();
  invalid.description = " ";
  assert.throws(() => group.addExpense(invalid));
  assert.deepEqual(group.getState().expenses, []);
});

test("6: lookup: find a saved expense by its ID or return undefined", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(tea());
  assert.equal(group.findExpense("tea").description, "Tea");
  assert.equal(group.findExpense("missing"), undefined);
});

test("6: lookup: remove only the requested expense and report whether anything changed", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(tea());
  group.addExpense(tea("coffee"));
  assert.equal(group.removeExpense("tea"), true);
  assert.equal(group.hasExpense("tea"), false);
  assert.deepEqual(group.getState().expenses.map((expense) => expense.id), ["coffee"]);
  assert.equal(group.removeExpense("missing"), false);
  assert.deepEqual(group.getState().expenses.map((expense) => expense.id), ["coffee"]);
});
