import { test } from "node:test";
import assert from "node:assert/strict";
import { Expense, EvenSplit, ShareSplit } from "../src/models.js";
const dinner = {
  id: "dinner",
  description: "Dinner",
  payer: "Alex",
  participants: ["Alex", "Sam", "Jordan"],
  amountCents: 100,
};

test("1: save an amount in cents and read it back [Milestone 1, Task 1]", () => {
  const expense = new Expense(dinner);
  assert.equal(expense.amountCents, 100, "100 cents should be saved as 100");
  expense.amountCents = 250;
  assert.equal(
    expense.amountCents,
    250,
    "changing the amount should save 250 cents",
  );
});
test("1: reject a negative amount and keep the previous amount [Milestone 1, Task 1]", () => {
  const expense = new Expense(dinner);
  assert.throws(() => {
    expense.amountCents = -1;
  }, "a negative amount should cause an error");
  assert.equal(
    expense.amountCents,
    100,
    "an invalid change should leave the original amount alone",
  );
});
test("2: split one dollar equally as 34, 33, and 33 cents [Milestone 1, Task 2]", () => {
  assert.deepEqual(new EvenSplit(dinner).split(), {
    Alex: 34,
    Sam: 33,
    Jordan: 33,
  });
});
test("2: someone with two shares pays twice as much as someone with one [Milestone 1, Task 2]", () => {
  const expense = new ShareSplit({ ...dinner, weights: [1, 2, 1] });
  assert.deepEqual(expense.split(), { Alex: 25, Sam: 50, Jordan: 25 });
  assert.ok(
    expense instanceof Expense,
    "a share-split expense should still be an Expense",
  );
});


test("2: saved weights survive the supplied JSON-copy interface [Milestone 1, Task 2]", () => {
  const weights = [1, 2, 1];
  const expense = new ShareSplit({ ...dinner, weights });
  assert.deepEqual(expense.weights, weights);
  assert.notEqual(expense.weights, weights);
  const serialized = expense.toJSON();
  assert.deepEqual(serialized.weights, [1, 2, 1]);
  serialized.weights[0] = 9;
  weights[1] = 9;
  assert.deepEqual(expense.split(), { Alex: 25, Sam: 50, Jordan: 25 });
  assert.deepEqual(new ShareSplit(expense.toJSON()).split(), expense.split());
});

const checkAmountLimit = (Class) => {
  const options = { ...dinner, weights: [1, 2, 1], amountCents: 1_000_000 };
  const expense = new Class(options);
  assert.equal(expense.amountCents, 1_000_000);
  for (const amountCents of [1_000_001, 0, -1, 0.5, NaN, Infinity]) {
    assert.throws(() => new Class({ ...options, amountCents }), RangeError);
    assert.throws(() => { expense.amountCents = amountCents; }, RangeError);
    assert.equal(expense.amountCents, 1_000_000);
  }
};

test("1: Expense enforces the $10,000 limit without changing a rejected amount [Milestone 1, Task 1]", () => {
  checkAmountLimit(Expense);
});

test("2: split subclasses enforce the $10,000 limit without changing a rejected amount [Milestone 1, Task 2]", () => {
  for (const Class of [EvenSplit, ShareSplit]) checkAmountLimit(Class);
});

test("1: currency belongs to the Expense class, not individual expenses [Milestone 1, Task 1]", () => {
  assert.equal(Expense.currency, "USD", "Milestone 1, Task 1: declare USD currency as a static class property");
  const expense = new Expense(dinner);
  assert.equal(Object.hasOwn(expense, "currency"), false);
  assert.equal(expense.currency, undefined);
});
