// PROVIDED: DOM setup and element helpers. No learner tasks in this file.
// The callback connection is Milestone 5, Task 10 in src/view.js.
export default function mount() {
  const ids = [
    "summary",
    "ledger",
    "categories",
    "balances",
    "expense-count",
    "status",
    "payer",
    "participants",
    "member-filter",
    "expense-form",
    "split-type",
    "weights-label",
    "search",
    "category-filter",
  ];
  return Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
}
export function element(tag, text, className = "") {
  const node = document.createElement(tag);
  node.textContent = text;
  node.className = className;
  return node;
}
