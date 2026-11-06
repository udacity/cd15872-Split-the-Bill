import { assertCents, allocateCents } from "./money.js";
import { prepareExpense, prepareWeights } from "./support.js";

// TASK 1: implement this class using the README's expense contract.
// Lessons: Build Objects with JavaScript Classes; Extend and Encapsulate JavaScript Classes.
export class Expense {
  // TODO: declare a private amount field.
  // PROVIDED static property; no implementation task here.
  static currency = "USD";
  constructor(options) {
    // prepareExpense validates and returns the public fields; assertCents validates amounts.
    throw new Error(
      "Finish 1: create an expense with validated details and a private amount",
    );
  }
  get amountCents() {
    throw new Error("Finish 1: read the saved amount");
  }
  set amountCents(value) {
    throw new Error("Finish 1: validate and save the new amount");
  }

  // PROVIDED: allocation and copying support. Leave these methods in place.
  split() {
    throw new Error("Subclasses must implement split().");
  }

  shares(weights) {
    const allocation = allocateCents(this.amountCents, weights);
    return Object.fromEntries(
      this.participants.map((id, index) => [id, allocation[index]]),
    );
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      payer: this.payer,
      participants: [...this.participants],
      amountCents: this.amountCents,
      category: this.category,
      type: this.type,
      weights: this.weights ? [...this.weights] : undefined,
      tags: this.getTags?.() ?? [],
    };
  }
}

// TASK 2: replace these placeholders with subclasses of Expense.
// Lesson: Extend and Encapsulate JavaScript Classes.
// Each needs a type getter and split method. ShareSplit also needs a constructor.
// Use the supplied shares and prepareWeights helpers; do not write rounding code.
export class EvenSplit {
  constructor(options) {
    throw new Error("Finish 2: build the equal-split subclass");
  }
}
export class ShareSplit {
  constructor(options) {
    throw new Error("Finish 2: build the share-split subclass");
  }
}
