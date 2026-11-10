import { test } from "node:test";
import assert from "node:assert/strict";
import ExpenseView from "../src/view.js";

// Supplied test setup stands in for the page. You do not need to build this setup.
// This test checks the callback connection without opening a browser.
test("10: the view remembers which object it belongs to when called later [Milestone 5, Task 10]", () => {
  let onChange;
  let calls = 0;
  const state = { members: [], expenses: [] };
  const group = {
    getState: () => state,
    subscribe(callback) {
      onChange = callback;
      return () => {};
    },
  };
  const nodes = Object.fromEntries(
    ["search", "category-filter", "member-filter"].map((id) => [
      id,
      { addEventListener() {} },
    ]),
  );
  const view = new ExpenseView(group, nodes);
  view.render = function (received) {
    assert.equal(
      this,
      view,
      "the render callback should keep the view as this",
    );
    assert.equal(received, state);
    calls += 1;
  };
  const stopListening = view.connect();
  onChange(state);
  assert.equal(calls, 2, "render once at startup and once after a change");
  assert.equal(typeof stopListening, "function");
});
