// PROVIDED integration checks: combine completed learner tasks with supplied app code.
// These are final checks, not a setup check or instructions to change supplied code.
// Coverage: Milestone 1, Tasks 1–2; Milestone 2, Tasks 3–4;
// Milestone 3, Tasks 5–6; Milestone 4, Task 9.
import { test } from "node:test";
import assert from "node:assert/strict";
import sample from "../../data/sample-trip.js";
import createExpense from "../../src/behaviors.js";
import createGroup from "../../src/group.js";
import { summarize, totalsByCategory } from "../../src/analytics.js";

test("finished app: sample expenses total $390.01 and everyone balances correctly", () => {
  const result = summarize(sample.members, sample.expenses.map(createExpense));
  assert.equal(result.totalCents, 39001);
  assert.deepEqual(result.balances, { Alex: -1835, Sam: 7417, Jordan: -5582 });
});
test("finished app: changing a returned expense does not change the saved expense", () => {
  const group = createGroup(sample.members);
  group.addExpense(createExpense(sample.expenses[0]));
  const copy = group.findExpense("dinner");
  copy.amountCents = 1;
  copy.addTag("outside");
  assert.equal(group.findExpense("dinner").amountCents, 10000);
  assert.deepEqual(group.findExpense("dinner").getTags(), ["weekend"]);
});
test("finished app: reject unknown split names, including constructor", () => {
  for (const type of [
    "unknown",
    "constructor",
    "toString",
    "__proto__",
    "percent",
    null,
    [],
  ]) {
    assert.throws(
      () => createExpense({ ...sample.expenses[0], type }),
      "only even and share are supported",
    );
  }
});
test("finished app: category names such as constructor still have correct totals", () => {
  assert.equal(
    totalsByCategory([{ category: "constructor", amountCents: 100 }])
      .constructor,
    100,
  );
});


test("finished app: summaries keep exact totals and balances up to $100,000", () => {
  const expenses = Array.from({ length: 10 }, (_, index) => createExpense({
    id: `large-${index}`, description: "Large expense", payer: "Alex",
    participants: ["Sam"], amountCents: 1_000_000,
  }));
  const penny = createExpense({ ...expenses[0].toJSON(), id: "penny", amountCents: 1 });
  const result = summarize(["Alex", "Sam"], expenses);
  assert.equal(result.totalCents, 10_000_000);
  assert.deepEqual(result.paid, { Alex: 10_000_000, Sam: 0 });
  assert.deepEqual(result.owed, { Alex: 0, Sam: 10_000_000 });
  assert.deepEqual(result.balances, { Alex: 10_000_000, Sam: -10_000_000 });
  assert.throws(() => summarize(["Alex", "Sam"], [...expenses, penny]), {
    name: "RangeError", message: /Group spending.*\$100,000\.00/,
  });
  assert.throws(() => summarize(["Alex", "Sam"], [
    { ...expenses[0].toJSON(), amountCents: 1_000_001 },
  ]), RangeError);
});
