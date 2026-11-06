// TASK 7: refactor byText and its returned function into arrows.
// Keep the name, default query, and case-insensitive, trimmed search behavior.
// A predicate is a function that answers a true/false question about one expense.
// Run npm run test:search before and after the refactor. Both runs should pass.
export function byText(query = "") {
  const searchText = query.trim().toLowerCase();
  return function (expense) {
    return expense.description.toLowerCase().includes(searchText);
  };
}

// TASK 8: refactor composeFilters, its returned function, and the every callback
// into arrows. Keep rest syntax and the all-checks-must-pass behavior.
// Run npm run test:filter-refactor before and after. Both runs should pass.
// With no checks, every expense passes.
export function composeFilters(...checks) {
  return function (expense) {
    return checks.every(function (check) {
      return check(expense);
    });
  };
}

// These functions do not use this, so arrows preserve their behavior.
// Do not automatically convert class methods: their this behavior can differ.

// TASK 8: implement the category and person predicates from the README contract.
// After implementing both factories, run npm run test:filters.
export const byCategory = (category = "") => {
  throw new Error("Finish 8: filter expenses by category");
};
export const byMember = (member = "") => {
  throw new Error("Finish 8: find expenses involving a person");
};
