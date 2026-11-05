// PROVIDED: all HTML rendering and event wiring.
// YOUR WORK: the one callback-binding statement in connect().
import { element } from "../ui/mount.js";
import { formatMoney } from "./money.js";
import {
  summarize,
  totalsByCategory,
  filterExpenses,
  byText,
  byCategory,
  byMember,
} from "./analytics.js";

export default class ExpenseView {
  constructor(group, nodes) {
    this.group = group;
    this.nodes = nodes;
  }
  connect() {
    // TASK 10: keep this.render connected to this view when called later.
    // TODO 10: bind this.render to this view, or supply a wrapper with the same effect
    throw new Error(
      "Finish 10: bind this.render to this view, or supply a wrapper with the same effect",
    );
    const unsubscribe = this.group.subscribe(this.render);
    ["search", "category-filter", "member-filter"].forEach((id) =>
      this.nodes[id].addEventListener("input", () =>
        this.render(this.group.getState()),
      ),
    );
    this.render(this.group.getState());
    return unsubscribe;
  }
  render({ members, expenses }) {
    const summary = summarize(members, expenses);
    this.nodes.summary.replaceChildren(
      ...[
        ["Group spending", formatMoney(summary.totalCents)],
        ["Expenses", expenses.length],
        ["People", members.length],
      ].map(([title, value]) => {
        const card = element("div", "", "stat");
        card.append(element("p", title), element("strong", value));
        return card;
      }),
    );
    const visible = filterExpenses(
      expenses,
      byText(this.nodes.search.value),
      byCategory(this.nodes["category-filter"].value),
      byMember(this.nodes["member-filter"].value),
    );
    this.nodes["expense-count"].textContent =
      visible.length + " of " + expenses.length;
    this.nodes.ledger.replaceChildren(
      ...visible.map((expense) => {
        const row = element("article", "", "entry");
        const details = element("div", "");
        details.append(
          element("h3", expense.description),
          element(
            "p",
            expense.payer +
              " paid · " +
              expense.category +
              " · " +
              expense.type,
          ),
        );
        details.append(
          element(
            "p",
            Object.entries(expense.split())
              .map(([id, cents]) => id + " " + formatMoney(cents))
              .join(" / "),
          ),
        );
        const labels = expense.getTags();
        if (labels.length) details.append(element("p", labels.join(" · ")));
        const amount = element("div", "", "amount");
        const remove = element("button", "Remove", "remove");
        remove.type = "button";
        remove.setAttribute("aria-label", "Remove " + expense.description);
        remove.addEventListener("click", () =>
          this.group.removeExpense(expense.id),
        );
        amount.append(
          element("strong", formatMoney(expense.amountCents)),
          element("br", ""),
          remove,
        );
        row.append(details, amount);
        return row;
      }),
    );
    if (!visible.length)
      this.nodes.ledger.append(
        element("p", "No expenses match. Try changing your filters."),
      );
    this.nodes.categories.replaceChildren(
      ...Object.entries(totalsByCategory(expenses)).map(([name, cents]) => {
        const row = element("div", "", "category");
        row.append(
          element("span", name),
          element("strong", formatMoney(cents)),
        );
        return row;
      }),
    );
    this.nodes.balances.replaceChildren(
      ...members.map((id) => {
        const card = element("div", "", "balance");
        card.append(
          element("span", id),
          element("strong", formatMoney(summary.balances[id])),
          element(
            "p",
            "Paid " +
              formatMoney(summary.paid[id]) +
              " · Share " +
              formatMoney(summary.owed[id]),
          ),
        );
        return card;
      }),
    );
  }
}
