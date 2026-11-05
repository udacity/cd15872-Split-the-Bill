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
