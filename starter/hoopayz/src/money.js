// PROVIDED: money calculations. No learner tasks in this file.
// Use these helpers; you do not need to implement or explain their internals.
// Integer arithmetic avoids losing or creating cents. Ties follow participant order.
export const assertCents = (value) => {
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new RangeError("Amount must be positive safe integer cents.");
  return value;
};

export function parseMoney(text) {
  if (!/^\d+(\.\d{1,2})?$/.test(String(text)))
    throw new TypeError("Enter dollars with at most two decimal places.");
  const [dollars, decimals = ""] = String(text).split(".");
  const cents = BigInt(dollars) * 100n + BigInt(decimals.padEnd(2, "0"));
  return assertCents(Number(cents));
}

export const formatMoney = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );

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
