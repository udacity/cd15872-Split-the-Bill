// PROVIDED helper checks: run test:setup before learner work. No task to implement here.
// Large-number cases verify supplied helper internals, not extra learner requirements.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMoney, allocateCents, formatMoney, assertExpenseTotal } from "../../src/money.js";
test("provided helper: convert dollars to cents; reject invalid input and expenses over $10,000", () => {
  assert.equal(parseMoney("10.01"), 1001);
  assert.equal(parseMoney("0.1"), 10);
  for (const value of ["1.001", "-1", "", "0", "Infinity", "9007199254740992"])
    assert.throws(() => parseMoney(value));
});
test("provided helper: split amounts add up to the total, with leftover cents assigned consistently", () => {
  assert.deepEqual(allocateCents(100, [1, 1, 1]), [34, 33, 33]);
  assert.deepEqual(allocateCents(101, [1, 2, 1]), [25, 51, 25]);
  assert.deepEqual(allocateCents(1, [1, 1, 1]), [1, 0, 0]);
  for (let amount = 1; amount <= 200; amount++) {
    const result = allocateCents(amount, [1, 3, 7]);
    assert.equal(
      result.reduce((sum, cents) => sum + cents, 0),
      amount,
    );
    assert.ok(result.every(Number.isSafeInteger));
  }
});
test("provided helper: reject missing shares or share counts that are not positive whole numbers", () => {
  for (const weights of [[], [0, 1], [-1, 2], [0.5, 1], [NaN]])
    assert.throws(() => allocateCents(100, weights));
});
test("provided helper: large share counts do not lose or invent cents within the expense limit", () => {
  const amount = 999_999;
  const result = allocateCents(amount, [
    Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
  ]);
  assert.equal(BigInt(result[0]) + BigInt(result[1]), BigInt(amount));
  assert.deepEqual(result, [500_000, 499_999]);
});
test("provided helper: display zero and negative balances as US dollars", () => {
  assert.equal(formatMoney(-1835), "-$18.35");
  assert.equal(formatMoney(0), "$0.00");
});


test("provided helper: accept $10,000 per expense and reject the next cent", () => {
  assert.equal(parseMoney("9999.99"), 999_999);
  assert.equal(parseMoney("10000"), 1_000_000);
  assert.equal(parseMoney("10000.00"), 1_000_000);
  assert.deepEqual(allocateCents(1_000_000, [1, 1]), [500_000, 500_000]);
  assert.throws(() => parseMoney("10000.01"), {
    name: "RangeError", message: /expense.*\$10,000\.00/i,
  });
  assert.throws(() => allocateCents(1_000_001, [1]), RangeError);
});

test("provided helper: format whole group totals and retain exact safe-integer formatting", () => {
  assert.equal(formatMoney(1_000_000), "$10,000.00");
  assert.equal(formatMoney(9_999_999), "$99,999.99");
  assert.equal(formatMoney(10_000_000), "$100,000.00");
  assert.equal(formatMoney(-10_000_000), "-$100,000.00");
  assert.equal(formatMoney(1), "$0.01");
  assert.equal(formatMoney(-1), "-$0.01");
  for (let cents = 0; cents < 100; cents++) {
    const amount = 9007199254740800 + cents;
    const expected = "$90,071,992,547,408." + String(cents).padStart(2, "0");
    assert.equal(formatMoney(amount), expected);
    assert.equal(formatMoney(-amount), "-" + expected);
  }
  assert.equal(formatMoney(Number.MAX_SAFE_INTEGER), "$90,071,992,547,409.91");
  assert.equal(formatMoney(-Number.MAX_SAFE_INTEGER), "-$90,071,992,547,409.91");
  for (const value of [Number.MAX_SAFE_INTEGER + 1, NaN, Infinity, 0.5, "100"])
    assert.throws(() => formatMoney(value), RangeError);
});


test("provided helper: accept $100,000 for the group and reject the next cent", () => {
  const expenses = Array.from({ length: 10 }, () => ({ amountCents: 1_000_000 }));
  assert.equal(assertExpenseTotal([]), 0);
  assert.equal(assertExpenseTotal(expenses), 10_000_000);
  assert.equal(assertExpenseTotal([
    ...expenses.slice(0, 9), { amountCents: 999_999 },
  ]), 9_999_999);
  assert.throws(() => assertExpenseTotal([...expenses, { amountCents: 1 }]), {
    name: "RangeError", message: /Group spending.*\$100,000\.00/,
  });
  for (const value of [0, -1, 0.5, NaN, Infinity, 1_000_001, Number.MAX_SAFE_INTEGER + 1])
    assert.throws(() => assertExpenseTotal([{ amountCents: value }]), RangeError);
});
