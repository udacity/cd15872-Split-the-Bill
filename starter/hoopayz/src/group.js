import createExpense from "./behaviors.js";
import { prepareMembers, assertBelongsToGroup } from "./support.js";

// TASKS 5–6: implement the README's store contract.
// Lessons: Build Private State with Closures; Compose Behavior with Higher-Order Functions.
export default function createGroup(initialMembers = []) {
  // PROVIDED utilities: use these without rewriting their internals.
  const members = prepareMembers(initialMembers);
  const copy = (expense) => createExpense(expense.toJSON());

  // TODO 5: create private expense and subscriber collections here.
  // TODO 5: implement getState, hasExpense, addExpense, subscribe, and change notification.
  // TODO 6: implement removeExpense and findExpense.
  // Expose only the six public methods named in the README.
  throw new Error(
    "Finish 5–6: build the private expense store and its public methods",
  );
}
