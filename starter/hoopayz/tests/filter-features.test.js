import { test } from "node:test";
import assert from "node:assert/strict";
import {
  byCategory,
  byMember,
  byText,
  composeFilters,
} from "../src/filters.js";
const expense = {
  description: "Tea",
  category: "Food",
  payer: "Alex",
  participants: ["Sam"],
};
test("8: choosing a category includes matching expenses and excludes other categories [Milestone 4, Task 8]", () => {
  assert.equal(byCategory("Food")(expense), true);
  assert.equal(byCategory("Travel")(expense), false);
  assert.equal(byCategory()(expense), true);
});
test("8: choosing a person finds expenses they paid or share [Milestone 4, Task 8]", () => {
  assert.equal(byMember("Alex")(expense), true);
  assert.equal(byMember("Sam")(expense), true);
  assert.equal(byMember("Jordan")(expense), false);
  assert.equal(byMember()(expense), true);
});
test("8: search, category, and person checks work together [Milestone 4, Task 8]", () => {
  assert.equal(
    composeFilters(byText("tea"), byCategory("Food"), byMember("Sam"))(expense),
    true,
  );
  assert.equal(
    composeFilters(
      byText("tea"),
      byCategory("Travel"),
      byMember("Sam"),
    )(expense),
    false,
  );
});
