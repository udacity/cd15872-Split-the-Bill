// PROVIDED: money calculations. No learner tasks in this file.
// Use these helpers; you do not need to implement or explain their internals.
// Integer arithmetic avoids losing or creating cents. Ties follow participant order.
// These are practical project rules, not JavaScript's numeric maximums.
export const MAX_EXPENSE_CENTS = 1_000_000; // $10,000.00 per expense.
export const MAX_GROUP_TOTAL_CENTS = 10_000_000; // $100,000.00 for the group.

export const assertCents = (value) => {
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new RangeError("Amount must be positive safe integer cents.");
  if (value > MAX_EXPENSE_CENTS)
    throw new RangeError("Each expense must be $10,000.00 or less.");
  return value;
};

export function parseMoney(text) {
  if (!/^\d+(\.\d{1,2})?$/.test(String(text)))
    throw new TypeError("Enter dollars with at most two decimal places.");
  const [dollars, decimals = ""] = String(text).split(".");
  const cents = BigInt(dollars) * 100n + BigInt(decimals.padEnd(2, "0"));
  return assertCents(Number(cents));
}

// Validate both project limits before saving or totaling expenses.
// Several valid expenses can still exceed the group limit together.
export function assertExpenseTotal(expenses) {
  return expenses.reduce((total, expense) => {
    const amount = assertCents(expense.amountCents);
    if (amount > MAX_GROUP_TOTAL_CENTS - total)
      throw new RangeError("Group spending cannot exceed $100,000.00.");
    return total + amount;
  }, 0);
}

const wholeDollars = new Intl.NumberFormat("en-US");
export function formatMoney(cents) {
  if (!Number.isSafeInteger(cents))
    throw new RangeError("Display amounts must be safe integer cents.");
  // Display totals, zero, and negative balances without the per-expense limit.
  // Do not divide a Number by 100: near its safe-integer ceiling that can lose a cent.
  const amount = BigInt(Math.abs(cents));
  const dollars = wholeDollars.format(amount / 100n);
  const decimals = String(amount % 100n).padStart(2, "0");
  return `${cents < 0 ? "-" : ""}$${dollars}.${decimals}`;
}

export function allocateCents(amount, weights) {
  assertCents(amount);
  if (
    !Array.isArray(weights) ||
    !weights.length ||
    !weights.every((value) => Number.isSafeInteger(value) && value > 0)
  ) {
    throw new RangeError("Use positive integer weights for every participant.");
  }
  const total = weights.reduce((sum, weight) => sum + BigInt(weight), 0n);
  const rows = weights.map((weight, index) => {
    const numerator = BigInt(amount) * BigInt(weight);
    return {
      index,
      cents: Number(numerator / total),
      remainder: numerator % total,
    };
  });
  const leftover = amount - rows.reduce((sum, row) => sum + row.cents, 0);
  const ranked = [...rows].sort((a, b) =>
    a.remainder === b.remainder
      ? a.index - b.index
      : a.remainder > b.remainder
        ? -1
        : 1,
  );
  ranked.slice(0, leftover).forEach((row) => {
    row.cents += 1;
  });
  return rows.map((row) => row.cents);
}
