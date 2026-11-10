import { assertCents, allocateCents } from "./money.js";
import { prepareExpense, prepareWeights } from "./support.js";

// TODO [Milestone 1, Task 1]: implement this class using the README's expense contract.
// Lessons: Build Objects with JavaScript Classes; Extend and Encapsulate JavaScript Classes.
export class Expense {
  // TODO [Milestone 1, Task 1]: declare a private amount field and a static currency property set to USD.
  // Currency belongs to the class, not to each expense.
  constructor(options) {
    // TODO [Milestone 1, Task 1]: initialize public fields with prepareExpense and the amount with its setter.
    throw new Error(
      "Finish Milestone 1, Task 1: create an expense with validated details and a private amount",
    );
  }
  get amountCents() {
    // TODO [Milestone 1, Task 1]: return the private amount.
    throw new Error("Finish Milestone 1, Task 1: read the saved amount");
  }
  set amountCents(value) {
    // TODO [Milestone 1, Task 1]: use assertCents before changing the private amount.
    throw new Error("Finish Milestone 1, Task 1: validate and save the new amount");
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

// TODO [Milestone 1, Task 2]: replace these placeholders with subclasses of Expense.
// Lesson: Extend and Encapsulate JavaScript Classes.
// Each needs a type getter and split method. ShareSplit also needs a constructor.
// Use the supplied shares and prepareWeights helpers; do not write rounding code.
// ShareSplit must store prepareWeights(...) as this.weights. The supplied toJSON()
// reads that property so the store can copy and reconstruct weighted expenses.
export class EvenSplit {
  constructor(options) {
    throw new Error("Finish Milestone 1, Task 2: build the equal-split subclass");
  }
}
export class ShareSplit {
  constructor(options) {
    throw new Error("Finish Milestone 1, Task 2: build the share-split subclass");
  }
}
