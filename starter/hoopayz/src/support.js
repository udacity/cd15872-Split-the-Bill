// PROVIDED: validation and copying utilities. Read the README contracts; do not rewrite these.
import { allocateCents } from "./money.js";
export function prepareExpense({
  id,
  description,
  payer,
  participants,
  category = "Other",
}) {
  if (
    ![id, description, payer, category].every(
      (value) => typeof value === "string" && value.trim(),
    )
  )
    throw new TypeError("Enter nonempty expense details.");
  if (
    !Array.isArray(participants) ||
    !participants.length ||
    !participants.every((id) => typeof id === "string" && id.trim()) ||
    new Set(participants).size !== participants.length
  )
    throw new TypeError("Choose unique participants.");
  return {
    id,
    description: description.trim(),
    payer,
    category: category.trim(),
    participants: [...participants],
  };
}
export function prepareWeights(amountCents, participants, weights) {
  if (!Array.isArray(weights) || weights.length !== participants.length)
    throw new RangeError("Supply one share count per participant.");
  allocateCents(amountCents, weights);
  return [...weights];
}
export function prepareMembers(members) {
  if (
    !Array.isArray(members) ||
    !members.length ||
    !members.every((id) => typeof id === "string" && id.trim()) ||
    new Set(members).size !== members.length
  )
    throw new TypeError("Group members must be unique nonempty names.");
  return [...members];
}
export function assertBelongsToGroup(expense, members) {
  if (
    !members.includes(expense.payer) ||
    !expense.participants.every((id) => members.includes(id))
  )
    throw new RangeError("Unknown group member.");
}
