import { test } from "node:test";
import assert from "node:assert/strict";
import { byText, composeFilters } from "../src/filters.js";

test("7: searching for tea finds Tea, even with extra spaces", () => {
  const matches = byText("  tea  ");
  assert.equal(matches({ description: "Tea with friends" }), true);
  assert.equal(matches({ description: "Bus tickets" }), false);
});
test("7: an empty search includes every description", () => {
  assert.equal(byText()({ description: "Dinner" }), true);
});
test("8: an expense appears only when it passes every filter", () => {
  const isFood = (expense) => expense.category === "Food";
  const costsUnderFiveDollars = (expense) => expense.amountCents < 500;
  const matches = composeFilters(isFood, costsUnderFiveDollars);
  assert.equal(matches({ category: "Food", amountCents: 300 }), true);
  assert.equal(matches({ category: "Food", amountCents: 600 }), false);
  assert.equal(matches({ category: "Travel", amountCents: 300 }), false);
  assert.equal(
    composeFilters()({}),
    true,
    "with no filters, nothing is excluded",
  );
});
