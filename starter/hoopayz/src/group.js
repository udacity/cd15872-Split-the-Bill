import createExpense from "./behaviors.js";
import { assertExpenseTotal } from "./money.js";
import { prepareMembers, assertBelongsToGroup } from "./support.js";

// Milestone 3, Tasks 5–6: follow the named checkpoints in the project README.
// Lessons: Build Private State with Closures; Compose Behavior with Higher-Order Functions.
export default function createGroup(initialMembers = []) {
  // PROVIDED utilities: use these without rewriting their internals.
  const members = prepareMembers(initialMembers);
  const copy = (expense) => createExpense(expense.toJSON());

  // TODO [Milestone 3, Task 5]: choose private collections for saved expenses and subscribers.
  // Keep them inside this factory so every group owns separate state.

  // Read state (Milestone 3, Task 5). Check with npm run test:store:state.
  function getState() {
    // TODO [Milestone 3, Task 5]: return copied member and expense arrays, including copied expenses.
    throw new Error("Finish Milestone 3, Task 5: return an independent snapshot of the group");
  }

  // Add safely (Milestone 3, Task 5). Check with npm run test:store:add.
  // Complete notifications in the Notify listeners checkpoint below.
  function hasExpense(id) {
    // TODO [Milestone 3, Task 5]: use some to check whether an expense has this ID.
    throw new Error("Finish Milestone 3, Task 5: check whether an expense is already saved");
  }

  function addExpense(expense) {
    // TODO [Milestone 3, Task 5]: copy and validate, then reject duplicate IDs. Use assertBelongsToGroup
    // to reject unknown payers/participants before saving the expense.
    // Call assertExpenseTotal with the saved expenses plus the candidate before saving.
    // Invalid additions, including an over-limit total, must leave the store unchanged.
    throw new Error("Finish Milestone 3, Task 5: save a valid expense without exposing its data");
  }

  // Find and remove (Milestone 3, Task 6). Check with npm run test:store:lookup.
  function findExpense(id) {
    // TODO [Milestone 3, Task 6]: use find; return an independent copy or undefined.
    throw new Error("Finish Milestone 3, Task 6: find an expense without exposing saved data");
  }

  function removeExpense(id) {
    // TODO [Milestone 3, Task 6]: use filter; return whether an expense was removed.
    throw new Error("Finish Milestone 3, Task 6: remove a matching expense");
  }

  // Notify listeners (Milestone 3, Tasks 5–6). Check with npm run test:store:events.
  // Also connect notifications to successful additions and removals above.
  // Give each listener a fresh state. Rejected/no-change actions do not notify.
  function subscribe(callback) {
    // TODO [Milestone 3, Task 5]: validate and register the callback; return an unsubscribe function.
    // Registering a callback does not call it immediately.
    // The same callback can have multiple subscriptions. Stop only this registration;
    // calling its unsubscribe function again must not stop any other registration.
    throw new Error("Finish Milestone 3, Task 5: register a listener and let it stop listening");
  }

  // PROVIDED public interface. You own the methods and any private helpers.
  return {
    getState,
    hasExpense,
    addExpense,
    findExpense,
    removeExpense,
    subscribe,
  };
}
