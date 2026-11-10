import { test } from "node:test";
import assert from "node:assert/strict";
import createGroup from "../src/group.js";
import createExpense from "../src/behaviors.js";
// Supplied fixture: each call creates a fresh expense with its own data.
const createTestExpense = () =>
  createExpense({
    id: "tea",
    description: "Tea",
    payer: "Alex",
    participants: ["Alex", "Sam"],
    amountCents: 100,
    type: "share",
    weights: [1, 1],
    tags: ["trip"],
  });

test("5: state: member inputs and returned arrays cannot change either group [Milestone 3, Task 5]", () => {
  const members = ["Alex", "Sam"];
  const first = createGroup(members);
  const second = createGroup(members);
  members.push("Outside");
  const state = first.getState();
  state.members.push("Outside");
  state.expenses.push("outside");
  assert.deepEqual(first.getState(), { members: ["Alex", "Sam"], expenses: [] });
  assert.deepEqual(second.getState(), { members: ["Alex", "Sam"], expenses: [] });
});

test("5: add: groups keep separate expenses and copy the original expense [Milestone 3, Task 5]", () => {
  const first = createGroup(["Alex", "Sam"]);
  const second = createGroup(["Alex", "Sam"]);
  const original = createTestExpense();
  first.addExpense(original);
  original.amountCents = 900;
  original.participants.push("Outside");
  original.weights[0] = 50;
  original.addTag("outside");
  const saved = first.getState().expenses[0];
  assert.equal(saved.amountCents, 100);
  assert.deepEqual(saved.participants, ["Alex", "Sam"]);
  assert.deepEqual(saved.weights, [1, 1]);
  assert.deepEqual(saved.getTags(), ["trip"]);
  assert.deepEqual(saved.split(), { Alex: 50, Sam: 50 });
  assert.deepEqual(second.getState().expenses, []);
});

test("5: add: changing a state snapshot cannot change saved data [Milestone 3, Task 5]", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(createTestExpense());
  const state = group.getState();
  state.members.push("Outside");
  state.expenses[0].amountCents = 800;
  state.expenses[0].participants.push("Outside");
  state.expenses[0].weights[0] = 50;
  state.expenses[0].addTag("outside");
  state.expenses.length = 0;
  const saved = group.getState();
  assert.deepEqual(saved.members, ["Alex", "Sam"]);
  assert.equal(saved.expenses.length, 1);
  assert.equal(saved.expenses[0].amountCents, 100);
  assert.deepEqual(saved.expenses[0].participants, ["Alex", "Sam"]);
  assert.deepEqual(saved.expenses[0].weights, [1, 1]);
  assert.deepEqual(saved.expenses[0].getTags(), ["trip"]);
});

test("6: lookup: a found expense is an independent copy with working methods [Milestone 3, Task 6]", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(createTestExpense());
  const found = group.findExpense("tea");
  assert.deepEqual(found.split(), { Alex: 50, Sam: 50 });
  found.amountCents = 800;
  found.participants.push("Outside");
  found.weights[0] = 50;
  found.addTag("outside");
  const saved = group.findExpense("tea");
  assert.equal(saved.amountCents, 100);
  assert.deepEqual(saved.participants, ["Alex", "Sam"]);
  assert.deepEqual(saved.weights, [1, 1]);
  assert.deepEqual(saved.getTags(), ["trip"]);
});
