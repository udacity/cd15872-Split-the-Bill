import { test } from "node:test";
import assert from "node:assert/strict";
import { Expense, EvenSplit, ShareSplit } from "../src/models.js";
const details = () => ({
  id: "tea",
  description: " Tea ",
  payer: "Alex",
  participants: ["Alex", "Sam"],
  amountCents: 120,
});
test("1: save expense details, trim the description, and default the category to Other [Milestone 1, Task 1]", () => {
  const input = details();
  const expense = new Expense(input);
  assert.equal(expense.id, "tea");
  assert.equal(expense.description, "Tea");
  assert.equal(expense.category, "Other");
  assert.equal(expense.payer, "Alex");
  input.participants.push("Outside");
  assert.deepEqual(expense.participants, ["Alex", "Sam"]);
});
test("1: reject missing descriptions and empty participant lists [Milestone 1, Task 1]", () => {
  assert.equal(new Expense(details()).description, "Tea");
  assert.throws(() => new Expense({ ...details(), description: " " }));
  assert.throws(() => new Expense({ ...details(), participants: [] }));
});
test("1: reject zero, fractional, and non-number amounts without changing the saved amount [Milestone 1, Task 1]", () => {
  const expense = new Expense(details());
  [0, 1.5, "100", NaN].forEach((value) => {
    assert.throws(() => {
      expense.amountCents = value;
    });
    assert.equal(expense.amountCents, 120);
  });
});
test("2: both split types inherit the base class and identify their split rule [Milestone 1, Task 2]", () => {
  const even = new EvenSplit(details());
  const share = new ShareSplit({ ...details(), weights: [1, 2] });
  assert.ok(even instanceof Expense);
  assert.ok(share instanceof Expense);
  assert.equal(EvenSplit.currency, "USD", "EvenSplit inherits the class currency");
  assert.equal(ShareSplit.currency, "USD", "ShareSplit inherits the class currency");
  assert.equal(even.type, "even");
  assert.equal(share.type, "share");
  share.amountCents = 300;
  assert.deepEqual(share.split(), { Alex: 100, Sam: 200 });
});
test("2: copy share counts and reject missing or invalid share counts [Milestone 1, Task 2]", () => {
  const weights = [1, 2];
  const expense = new ShareSplit({ ...details(), weights });
  weights[0] = 50;
  assert.deepEqual(expense.weights, [1, 2]);
  [undefined, [1], [0, 2], [1, 1.5]].forEach((weights) => {
    assert.throws(() => new ShareSplit({ ...details(), weights }));
  });
});
