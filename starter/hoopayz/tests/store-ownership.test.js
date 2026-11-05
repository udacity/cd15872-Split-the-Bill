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
test("5: each new group starts empty and keeps its own expenses", () => {
  const members = ["Alex", "Sam"];
  const first = createGroup(members);
  const second = createGroup(members);
  members.push("Outside");
  assert.deepEqual(first.getState().members, ["Alex", "Sam"]);
  assert.deepEqual(first.getState().expenses, []);
  first.addExpense(tea());
  assert.equal(second.getState().expenses.length, 0);
});
test("5: changes to the original expense or a returned copy do not change saved data", () => {
  const group = createGroup(["Alex", "Sam"]);
  const original = tea();
  group.addExpense(original);
  original.amountCents = 900;
  const state = group.getState();
  state.members.push("Outside");
  state.expenses[0].amountCents = 800;
  state.expenses.length = 0;
  group.findExpense("tea").addTag("outside");
  assert.equal(group.findExpense("tea").amountCents, 100);
  assert.deepEqual(group.findExpense("tea").getTags(), []);
  assert.deepEqual(group.getState().members, ["Alex", "Sam"]);
});
test("5: adding an expense tells each listener once and stopping a listener works", () => {
  const group = createGroup(["Alex", "Sam"]);
  const first = [],
    second = [];
  const stop = group.subscribe((state) => first.push(state.expenses.length));
  group.subscribe((state) => second.push(state.expenses.length));
  assert.deepEqual(first, [], "subscribing alone does not announce a change");
  group.addExpense(tea());
  stop();
  group.addExpense(tea("coffee"));
  assert.deepEqual(first, [1]);
  assert.deepEqual(second, [1, 2]);
  assert.throws(() => group.subscribe("not a function"));
});
test("5: rejected additions do not change the group or tell listeners to refresh", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(tea());
  let calls = 0;
  group.subscribe(() => {
    calls += 1;
  });
  assert.throws(() => group.addExpense(tea()));
  const outsider = createExpense({
    id: "out",
    description: "Travel",
    payer: "Pat",
    participants: ["Pat"],
    amountCents: 100,
  });
  assert.throws(() => group.addExpense(outsider));
  assert.equal(calls, 0);
  assert.equal(group.getState().expenses.length, 1);
});
