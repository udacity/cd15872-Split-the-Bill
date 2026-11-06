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

test("5: events: subscribing validates callbacks and does not announce a change", () => {
  const group = createGroup(["Alex", "Sam"]);
  let calls = 0;
  const stop = group.subscribe(() => { calls += 1; });
  assert.equal(typeof stop, "function");
  assert.equal(calls, 0);
  assert.throws(() => group.subscribe("not a function"));
});

test("5: events: adding notifies each active listener once and stopping a listener works", () => {
  const group = createGroup(["Alex", "Sam"]);
  const first = [], second = [];
  const stop = group.subscribe((state) => first.push(state.expenses.length));
  group.subscribe((state) => second.push(state.expenses.length));
  group.addExpense(tea());
  stop();
  group.addExpense(tea("coffee"));
  assert.deepEqual(first, [1]);
  assert.deepEqual(second, [1, 2]);
});

test("6: events: removing notifies once, but a missing ID does not notify", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(tea());
  const sizes = [];
  group.subscribe((state) => sizes.push(state.expenses.length));
  assert.equal(group.removeExpense("tea"), true);
  assert.deepEqual(sizes, [0]);
  assert.equal(group.removeExpense("missing"), false);
  assert.deepEqual(sizes, [0]);
});

test("5: events: rejected additions do not change state or notify listeners", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.addExpense(tea());
  let calls = 0;
  group.subscribe(() => { calls += 1; });
  assert.throws(() => group.addExpense(tea()));
  for (const changes of [
    { payer: "Pat" },
    { participants: ["Alex", "Pat"] },
  ]) {
    const outsider = createExpense({ ...tea("outside").toJSON(), ...changes });
    assert.throws(() => group.addExpense(outsider));
  }
  const invalid = tea("invalid");
  invalid.description = " ";
  assert.throws(() => group.addExpense(invalid));
  assert.equal(calls, 0);
  assert.equal(group.getState().expenses.length, 1);
});

test("5: events: each listener gets a separate snapshot without access to saved data", () => {
  const group = createGroup(["Alex", "Sam"]);
  group.subscribe((state) => {
    state.members.push("Outside");
    state.expenses[0].amountCents = 900;
    state.expenses[0].participants.push("Outside");
    state.expenses[0].addTag("outside");
    state.expenses.length = 0;
  });
  let received;
  group.subscribe((state) => { received = state; });
  group.addExpense(tea());
  assert.deepEqual(received.members, ["Alex", "Sam"]);
  assert.equal(received.expenses.length, 1);
  assert.equal(received.expenses[0].amountCents, 100);
  assert.deepEqual(received.expenses[0].participants, ["Alex", "Sam"]);
  assert.deepEqual(received.expenses[0].getTags(), []);
  assert.deepEqual(group.getState().members, ["Alex", "Sam"]);
  assert.equal(group.findExpense("tea").amountCents, 100);
  assert.deepEqual(group.findExpense("tea").getTags(), []);
});
