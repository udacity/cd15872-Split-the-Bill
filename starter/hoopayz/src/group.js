import createExpense from "./behaviors.js";
import { prepareMembers, assertBelongsToGroup } from "./support.js";

// TASKS 5–6: build the store in four checkpoints. See the project README.
// Lessons: Build Private State with Closures; Compose Behavior with Higher-Order Functions.
export default function createGroup(initialMembers = []) {
  // PROVIDED utilities: use these without rewriting their internals.
  const members = prepareMembers(initialMembers);
  const copy = (expense) => createExpense(expense.toJSON());

  // TODO: choose private collections for saved expenses and subscribers.
  // Keep them inside this factory so every group owns separate state.

  // A. Read state safely. Check with npm run test:store:state.
  function getState() {
    // TODO: return copied member and expense arrays, including copied expenses.
    throw new Error("Finish 5A: return an independent snapshot of the group");
  }

  // B. Add safely. Check with npm run test:store:add.
  // Notification behavior is completed in checkpoint D.
  function hasExpense(id) {
    // TODO: use some to check whether an expense has this ID.
    throw new Error("Finish 5B: check whether an expense is already saved");
  }

  function addExpense(expense) {
    // TODO: copy and validate, reject duplicate IDs, then save the expense.
    // Invalid additions must leave the store unchanged.
    throw new Error("Finish 5B: save a valid expense without exposing its data");
  }

  // C. Find and remove. Check with npm run test:store:lookup.
  function findExpense(id) {
    // TODO: use find; return an independent copy or undefined.
    throw new Error("Finish 6C: find an expense without exposing saved data");
  }

  function removeExpense(id) {
    // TODO: use filter; return whether an expense was removed.
    throw new Error("Finish 6C: remove a matching expense");
  }

  // D. Notify listeners. Check with npm run test:store:events.
  // Also connect notifications to successful additions and removals above.
  // Give each listener a fresh state. Rejected/no-change actions do not notify.
  function subscribe(callback) {
    // TODO: validate and register the callback; return an unsubscribe function.
    // Registering a callback does not call it immediately.
    throw new Error("Finish 5D: register a listener and let it stop listening");
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
