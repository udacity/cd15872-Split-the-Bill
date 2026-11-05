import sample from "../data/sample-trip.js";
import mount, { element } from "../ui/mount.js";
import createExpense from "./behaviors.js";
import createGroup from "./group.js";
import { parseMoney } from "./money.js";
import ExpenseView from "./view.js";

const nodes = mount();

function start() {
  const group = createGroup(sample.members);

  sample.expenses.forEach((options) =>
    group.addExpense(createExpense(options)),
  );

  sample.members.forEach((name) => {
    nodes.payer.add(new Option(name, name));
    nodes["member-filter"].add(new Option(name, name));
    const label = element("label", "");
    const checkbox = document.createElement("input");
    Object.assign(checkbox, {
      type: "checkbox",
      name: "participants",
      value: name,
      checked: true,
      defaultChecked: true,
    });
    label.append(checkbox, document.createTextNode(name));
    nodes.participants.append(label);
  });

  const view = new ExpenseView(group, nodes);

  view.connect();

  nodes["split-type"].addEventListener("change", () => {
    nodes["weights-label"].hidden = nodes["split-type"].value === "even";
  });

  nodes["expense-form"].addEventListener("submit", (event) => {
    event.preventDefault();

    try {
      const values = new FormData(event.currentTarget);
      const type = values.get("type");

      const weights =
        type === "even"
          ? undefined
          : values
              .get("weights")
              .split(",")
              .map((value) => {
                const trimmed = value.trim();
                if (!/^\d+$/.test(trimmed))
                  throw new Error("Shares must be positive whole numbers.");
                return Number(trimmed);
              });

      group.addExpense(
        createExpense({
          id: crypto.randomUUID(),
          description: values.get("description"),
          payer: values.get("payer"),
          participants: values.getAll("participants"),
          amountCents: parseMoney(values.get("amount")),
          category: values.get("category"),
          type,
          weights,
          tags: values
            .get("tags")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      );

      event.currentTarget.reset();

      nodes["weights-label"].hidden = true;
      nodes.status.textContent = "Expense added.";
    } catch (error) {
      nodes.status.textContent = error.message;
    }
  });
}
try {
  start();
} catch (error) {
  nodes.status.textContent = error.message;
}
