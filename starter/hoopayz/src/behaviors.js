import { EvenSplit, ShareSplit } from "./models.js";

// TASK 3: a factory creates a separate private list of tags for each expense.
// A tag is a short label such as "weekend" or "food".
export function Taggable(initial = []) {
  // TODO 3: implement independent private tags with addTag and getTags.
  // Follow the README contract for copies, trimming, invalid values, and duplicates.
  throw new Error("Finish 3: make a private tag list with addTag and getTags");
}

// PROVIDED: choose a supported class and clean up the initial tags.
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
  // TASK 4: add the tag behavior to this expense, keeping its class methods.
  // TODO 4: attach tag behavior while preserving the expense class and its methods.
  throw new Error(
    "Finish 4: combine the expense with Taggable(cleanTags) using Object.assign",
  );
}
