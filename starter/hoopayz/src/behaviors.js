import { EvenSplit, ShareSplit } from "./models.js";

// A factory creates a separate private list of tags for each expense.
// A tag is a short label such as "weekend" or "food".
// TODO [Milestone 5, Task 11]: after Milestone 4, move Taggable to a new src/tags.js as a named export.
// Import and re-export it here so existing imports keep working.
export function Taggable(initial = []) {
  // TODO [Milestone 2, Task 3]: implement independent private tags with addTag and getTags.
  // Follow the README contract for copies, trimming, invalid values, and duplicates.
  throw new Error("Finish Milestone 2, Task 3: make a private tag list with addTag and getTags");
}

// PROVIDED setup: class selection and initial tag cleanup below.
// The marked composition step belongs to Milestone 2, Task 4.
export default function createExpense(options) {
  const models = { even: EvenSplit, share: ShareSplit };
  const type = options.type === undefined ? "even" : options.type;
  if (typeof type !== "string" || !Object.hasOwn(models, type))
    throw new Error("Choose equal splits or shares.");
  const initialTags = options.tags ?? [];
  if (
    !Array.isArray(initialTags) ||
    !initialTags.every((tag) => typeof tag === "string" && tag.trim())
  ) {
    throw new Error("Tags must be a list of nonempty words.");
  }
  const cleanTags = [...new Set(initialTags.map((tag) => tag.trim()))];
  const expense = new models[type](options);
  // TODO [Milestone 2, Task 4]: attach tag behavior while preserving the expense class and its methods.
  throw new Error(
    "Finish Milestone 2, Task 4: connect tag behavior while keeping the expense class and split methods",
  );
}
