import { test } from "node:test";
import assert from "node:assert/strict";
import createGroup from "../src/group.js";
import createExpense from "../src/behaviors.js";
const createTestExpense = (id = "tea") =>
  createExpense({
    id,
    description: "Drink purchase",
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
  group.addExpense(createTestExpense());
  assert.equal(group.hasExpense("tea"), true);
  assert.throws(() => group.addExpense(createTestExpense()), "reject a duplicate ID");
  assert.equal(group.getState().expenses.length, 1);
});

test("5: add: reject an outside payer or participant without changing state", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(createTestExpense());
  for (const changes of [
    { payer: "Pat" },
    { participants: ["Alex", "Pat"] },
  ]) {
    const outsider = createExpense({ ...createTestExpense("outside").toJSON(), ...changes });
    assert.throws(() => group.addExpense(outsider));
    assert.deepEqual(group.getState().expenses.map((expense) => expense.id), ["tea"]);
  }
});

test("5: add: validate an expense again when saving its copy", () => {
  const group = createGroup(["Alex", "Sam"]);
  const invalid = createTestExpense();
  invalid.description = " ";
  assert.throws(() => group.addExpense(invalid));
  assert.deepEqual(group.getState().expenses, []);
});

test("6: lookup: find a saved expense by its ID or return undefined", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(createTestExpense());
  assert.equal(group.findExpense("tea").description, "Drink purchase");
  assert.equal(group.findExpense("missing"), undefined);
});

test("6: lookup: remove only the requested expense and report whether anything changed", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(createTestExpense());
  group.addExpense(createTestExpense("coffee"));
  assert.equal(group.removeExpense("tea"), true);
  assert.equal(group.hasExpense("tea"), false);
  assert.deepEqual(group.getState().expenses.map((expense) => expense.id), ["coffee"]);
  assert.equal(group.removeExpense("missing"), false);
  assert.deepEqual(group.getState().expenses.map((expense) => expense.id), ["coffee"]);
});


test("5: add: accept $100,000, reject one extra cent, and free capacity on removal", () => {
  const group = createGroup(["Alex", "Sam"]);
  for (let index = 0; index < 10; index++) {
    const expense = createTestExpense(`large-${index}`);
    expense.amountCents = index === 9 ? 999_999 : 1_000_000;
    group.addExpense(expense);
  }
  const total = () => group.getState().expenses.reduce((sum, expense) => sum + expense.amountCents, 0);
  assert.equal(total(), 9_999_999);
  const penny = createTestExpense("penny");
  penny.amountCents = 1;
  group.addExpense(penny);
  assert.equal(total(), 10_000_000);
  const before = group.getState().expenses.map((expense) => expense.toJSON());
  const extra = createTestExpense("extra");
  extra.amountCents = 1;
  assert.throws(() => group.addExpense(extra), {
    name: "RangeError", message: /Group spending.*\$100,000\.00/,
  });
  assert.equal(group.hasExpense("extra"), false);
  assert.deepEqual(group.getState().expenses.map((expense) => expense.toJSON()), before);
  assert.equal(group.removeExpense("penny"), true);
  group.addExpense(extra);
  assert.equal(group.hasExpense("extra"), true);
  assert.equal(total(), 10_000_000);
});
