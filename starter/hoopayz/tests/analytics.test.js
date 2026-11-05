import { test } from "node:test";
import assert from "node:assert/strict";
import { totalsByCategory } from "../src/analytics.js";

test("9: add up food and travel costs separately", () => {
  const expenses = [
    { category: "Food", amountCents: 100 },
    { category: "Travel", amountCents: 200 },
    { category: "Food", amountCents: 250 },
  ];
  assert.deepEqual(
    { ...totalsByCategory(expenses) },
    { Food: 350, Travel: 200 },
  );
  assert.equal(
    expenses[0].amountCents,
    100,
    "calculating totals should not change an expense",
  );
});
test("9: no expenses means no category totals", () => {
  assert.deepEqual({ ...totalsByCategory([]) }, {});
});
