import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMoney, allocateCents, formatMoney } from "../../src/money.js";
test("provided helper: convert dollars to cents; reject extra decimal places and amounts too large to store accurately", () => {
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
test("provided helper: splitting a very large amount does not lose or invent cents", () => {
  const amount = Number.MAX_SAFE_INTEGER;
  const result = allocateCents(amount, [
    Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
  ]);
  assert.equal(BigInt(result[0]) + BigInt(result[1]), BigInt(amount));
  assert.deepEqual(result, [4503599627370496, 4503599627370495]);
});
test("provided helper: display zero and negative balances as US dollars", () => {
  assert.equal(formatMoney(-1835), "-$18.35");
  assert.equal(formatMoney(0), "$0.00");
});
