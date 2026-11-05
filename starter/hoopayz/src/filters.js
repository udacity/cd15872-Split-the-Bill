// TASK 7: refactor this working search into arrow functions.
// Lesson: Refactor Code with Arrow Functions.
// TODO 7a: replace the byText declaration with an exported const arrow function.
// Keep its name and the empty-string default parameter.
// TODO 7b: replace the returned function with an arrow function too.
// Keep the search behavior unchanged: ignore case and spaces around the query.
// Run npm run test:search before and after your changes. Both runs should pass.
export function byText(query = "") {
  const searchText = query.trim().toLowerCase();
  return function (expense) {
    return expense.description.toLowerCase().includes(searchText);
  };
}

// TASK 8: refactor this working filter combiner into arrow functions.
// Lessons: Refactor Code with Arrow Functions; Compose Behavior with Higher-Order Functions.
// TODO 8a: replace composeFilters with an exported const arrow function.
// Keep ...checks: rest gathers the filter functions into an array.
// TODO 8b: convert both the returned function and the every callback to arrows.
// Keep every: an expense must pass all checks. With no checks it passes.
// Run npm run test:filters before and after your changes. Both runs should pass.
export function composeFilters(...checks) {
  return function (expense) {
    return checks.every(function (check) {
      return check(expense);
    });
  };
}

// These functions do not use this, so arrows preserve their behavior.
// Do not automatically convert class methods: their this behavior can differ.

// TASK 8: implement two additional filter factories from the README contract.
export const byCategory = (category = "") => {
  throw new Error("Finish 8: filter expenses by category");
};
export const byMember = (member = "") => {
  throw new Error("Finish 8: find expenses involving a person");
};
