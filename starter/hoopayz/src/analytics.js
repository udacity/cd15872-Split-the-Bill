import { composeFilters } from "./filters.js";
import { assertExpenseTotal } from "./money.js";
export { composeFilters, byText, byCategory, byMember } from "./filters.js";

// PROVIDED: apply the combined checks without changing the original list.
export const filterExpenses = (expenses, ...checks) =>
  expenses.filter(composeFilters(...checks));

// TASK 9: group amounts by category. Each value is in cents.
// The empty dictionary is supplied; it accepts any category name safely.
export const totalsByCategory = (expenses) => {
  // PROVIDED: leave this guard in place before calculating category totals.
  assertExpenseTotal(expenses);
  // TODO 9: use reduce to add each amountCents to its category total.
  // Start with the supplied empty dictionary. Empty input returns that dictionary.
  // Example: two Food expenses of 100 and 250 cents give { Food: 350 }.
  const startingTotals = Object.create(null);
  throw new Error("Finish 9: add up spending in each category");
};

// PROVIDED: per-person balance calculations. No implementation task here.
export function summarize(members, expenses) {
  assertExpenseTotal(expenses);
  return expenses.reduce(
    (summary, expense) => {
      summary.totalCents += expense.amountCents;
      summary.paid[expense.payer] += expense.amountCents;
      Object.entries(expense.split()).forEach(([id, cents]) => {
        summary.owed[id] += cents;
      });
      members.forEach((id) => {
        summary.balances[id] = summary.paid[id] - summary.owed[id];
      });
      return summary;
    },
    {
      totalCents: 0,
      paid: Object.fromEntries(members.map((id) => [id, 0])),
      owed: Object.fromEntries(members.map((id) => [id, 0])),
      balances: Object.fromEntries(members.map((id) => [id, 0])),
    },
  );
}
