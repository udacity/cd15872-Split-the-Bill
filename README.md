# Split the Bill: HooPayz

You are a junior JavaScript developer at HooPayz Financial. Three friends need an
app to track a weekend trip. Some expenses are shared equally; others use different
share counts. They need tags, search, category totals, and balances that update
when they add or remove an expense.

Your tech lead has supplied the interface, money helpers, and tests. You own the
expense classes, private store, reusable behaviors, filters, and module refactor.
Build the working app. **No essays, written concept explanations, or reflection
questions are required.**

## Getting Started

### Dependencies

- Node.js 24 LTS (verified with 24.18.0).
- A current browser and a code editor.
- Git and a free GitHub account for submission.

No framework, paid service, API key, or package installation is needed. Complete
the course lessons on functions, arrays, closures, classes, and modules first.

### Installation

Download or clone the project, open it in your editor, and run these commands
from the repository root:

```sh
cd starter
node --version
npm run test:setup
npm start
```

Open http://localhost:4175. This edition uses port **4175** so it is separate from
older previews on 4173. Stop the server with Ctrl+C. If needed, use
`npm start -- 4176` and open http://localhost:4176 instead.

The five setup checks should pass. The unfinished page displays a message about
an incomplete task; this is expected. Keep the preview running and use another
terminal in `starter` to run tests. Refresh the browser after saving code.

## Testing

All commands below run inside `starter`.

```sh
npm run test:setup   # Check the provided helpers before starting
npm test            # Check the learner tasks
npm run test:all     # Run every check when the app is complete
```

The fresh starter passes three task examples because the ordinary search/filter
functions already work; 26 task examples remain unfinished. A passing test only
checks its example. Tasks 7–8 also require the arrow-function conversions, which
are checked in your code. The completed project should pass all 38 checks.

### Break Down Tests

| Command                  | What it checks                                                                   |
| ------------------------ | -------------------------------------------------------------------------------- |
| `npm run test:models`    | Expense details, amount changes, inheritance, and equal/weighted splits.         |
| `npm run test:tags`      | Private tags, copies, and tags combined with an expense.                         |
| `npm run test:store`     | Private group state, add/find/remove, duplicate rejection, and listener updates. |
| `npm run test:search`    | Search behavior before and after arrow refactoring.                              |
| `npm run test:filters`   | Combined search, category, and person checks.                                    |
| `npm run test:analytics` | Category totals, including an empty list.                                        |
| `npm run test:view`      | The view retains the correct `this` when called later.                           |
| `npm run test:modules`   | The extracted tags module still connects to the app.                             |
| `npm run test:all`       | All tasks plus provided helpers and sample-app integration.                      |

Read the test title and first error message. “Finish 2” means that task is still
unfinished. A missing import or syntax error means the file cannot load yet.
You do not need to write tests or study the test runner internals. Finish classes
and tags before testing the store; search, filters, and category totals can be
worked on independently.

## Project Instructions

### What you build and what is provided

| File                                                         | Your responsibility                                                                                  |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `src/models.js`                                              | Build the base constructor, private amount/accessors, and two subclasses.                            |
| `src/behaviors.js`                                           | Build private tags and compose them with an expense. Selection and initial tag cleanup are supplied. |
| `src/group.js`                                               | Build private expense state and the six public methods below.                                        |
| `src/filters.js`                                             | Refactor working functions into arrows; implement category and person filters.                       |
| `src/analytics.js`                                           | Implement category totals; per-person balance calculations are provided.                             |
| `src/view.js`                                                | Preserve `this` in the marked callback. Rendering is provided.                                       |
| `src/tags.js`                                                | Create this file by extracting the tags factory in Task 11.                                          |
| `src/support.js`, `src/money.js`                             | Provided validation, copying of input fields, and rounding helpers.                                  |
| `src/app.js`, `ui/`, `index.html`, `styles.css`              | Provided startup, form handling, page structure, and styling.                                        |
| `data/sample-trip.js`, `tests/`, `server.js`, `package.json` | Provided example data, checks, and local tools.                                                      |

Use the documented names so the interface and tests can call your code. You choose
the implementation within these contracts. Keep provided helpers and tests intact.

### 1. Build the Expense class

Implement the constructor, a private amount field, and the `amountCents` getter
and setter. An expense contains `id`, `description`, `payer`, `participants`,
`category`, and `amountCents`. The category defaults to `Other`.

Use `prepareExpense(options)` to validate and obtain the public fields. Save those
fields on the instance. It trims descriptions/categories and copies participants.
Use `assertCents(value)` when setting an amount; invalid changes must leave the
previous amount intact. Leave the supplied `shares` and `toJSON` methods in place.

### 2. Implement two subclasses

Replace the placeholder classes with subclasses of `Expense`:

- `EvenSplit`: its `type` is `even`. Use `map` to give each participant one share
  and pass those weights to the inherited `shares` helper.
- `ShareSplit`: its `type` is `share`. Its constructor initializes the inherited
  fields and saves validated share counts using `prepareWeights`. Its split
  method passes the saved weights to the inherited helper.

Both types use the same amount validation. For 100 cents and weights `[1, 2, 1]`,
the shares are 25, 50, and 25 cents. Rounding is provided, not an implementation task.

### 3–4. Build private tags and compose behaviors

`Taggable(initial = [])` returns an object with `addTag(tag)` and `getTags()`.
Each call owns a private list retained by its returned functions. Copy initial
and returned arrays using spread. Adding a tag trims text, rejects blank/non-text
values, and ignores duplicates. Use an arrow function for `getTags`.

Complete `createExpense` by attaching the tag behavior to the selected expense.
Preserve its class identity and split methods. Use composition so both split types
can have tags without creating additional tagged subclasses.

### 5–6. Build the private expense store

`createGroup(initialMembers)` returns the six methods below. Expenses and
subscribers stay inside the factory, not in global variables or public arrays.
The supplied `members`, `copy`, and validation helpers are available to use.

| Method                | Expected behavior                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `getState()`          | Return `{ members, expenses }` with copied arrays and copied expenses.                                                              |
| `hasExpense(id)`      | Use `some` to return whether an ID exists.                                                                                          |
| `addExpense(expense)` | Copy and validate the expense, reject duplicate IDs, save it, and notify listeners once.                                            |
| `findExpense(id)`     | Use `find`; return a copy of the match or `undefined`.                                                                              |
| `removeExpense(id)`   | Use `filter`; return `true` and notify once if removed, otherwise return `false` without notifying.                                 |
| `subscribe(callback)` | Reject non-functions, register the callback, and return a function that stops that subscription. Registering alone does not notify. |

Each listener receives a fresh `getState()` result after a successful change.
Invalid additions must not change the store or notify listeners. Changing an
input expense or a returned copy must not change saved data. Multiple groups must
remain independent. Simple arrays and callbacks are enough; no event library is needed.

### 7–8. Refactor functions and build filters

`byText` and `composeFilters` start as working ordinary functions. Convert both
outer functions, both returned functions, and the callback passed to `every`
into arrows. Preserve the default search value, rest parameter, and behavior.

For example, in an unrelated calculation:

```js
function double(number) {
  return number * 2;
}
const doubleAsArrow = (number) => number * 2;
```

Arrows with braces still need `return` to return a value. These filter functions
do not use `this`; do not automatically convert class methods the same way.

Also implement two factories that return a function checking one expense:

- `byCategory(category = "")`: exact category match; empty selection includes all.
- `byMember(member = "")`: match the payer or any participant; empty selection includes all.

Combine checks with `composeFilters`: every check must pass; no checks includes
all expenses. Search ignores capitalization and spaces around the query.

### 9. Calculate category totals

Use `reduce` in `totalsByCategory(expenses)`. Return an object whose keys are
categories and values are total cents. Food amounts of 100 and 250 produce
`{ Food: 350 }`. Use the supplied empty dictionary, return it for empty input,
and do not change the input expenses. Filters affect the visible expense list,
not overall group totals.

### 10. Connect the view callback

Complete the marked statement in `ExpenseView.connect` so `render` retains the
view as `this` when the store calls it. Use `bind` or an equivalent wrapper.
Adding or removing an expense should update the page without a reload.

### 11. Extract a module

Move your completed `Taggable` factory from `behaviors.js` into a new `src/tags.js`
file with a named export. Import it into `behaviors.js` and re-export it there so
existing consumers continue to work. Keep `createExpense` as a default export.
The app must use at least three modules and both named and default exports.
Do not leave a second copy of the factory behind.

### Helper reference

| Provided helper                                 | Contract                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| `prepareExpense(options)`                       | Return validated public fields with copied participants; throws for invalid details. |
| `assertCents(value)`                            | Return a positive safe whole-number amount in cents or throw.                        |
| `prepareWeights(amount, participants, weights)` | Return copied positive whole-number weights, one per participant, or throw.          |
| `this.shares(weights)`                          | Return person-to-cents allocations, including any leftover cents.                    |
| `prepareMembers(members)`                       | Return a validated, copied nonempty member list.                                     |
| `assertBelongsToGroup(expense, members)`        | Throw if payer or participants are outside the group.                                |
| `copy(expense)` inside the store                | Return an independent expense including tags and methods.                            |

Advanced internals in supplied helpers are not assessed. Keep app startup
synchronous; no fetch, promises, external services, or async functions are needed.

### Check the working app

- [ ] Sample spending shows `$390.01`; balances are Alex `-$18.35`, Sam `$74.17`, Jordan `-`$55.82`.
- [ ] Add `$1.00` equally among three people: shares are `$0.34`, `$0.33`, `$0.33`.
- [ ] Add `$1.01` with shares 1,2,1: shares are `$0.25`, `$0.51`, `$0.25`; a supplied tag appears.
- [ ] Search for dinner, combine category/person filters, and try no matching results. Group totals stay unchanged.
- [ ] Remove an expense: the list, category totals, and balances update without reload.
- [ ] Try zero amount or no participants: feedback appears and no expense is added.

### Submit

Submit the repository link with the completed `starter` app, supplied tests,
README, and license. Keep the setup commands accurate if you change how it runs.
Do not include passwords, `node_modules`, or instructor solutions.

Reviewers run the app/tests and inspect your code for all eight skills: modern
function syntax; higher-order functions/callbacks; the six array methods;
closure-based private state; class inheritance/accessors/private fields;
correct `this` binding; behavior composition; and named/default module exports.
Tests alone do not establish that the required JavaScript constructs are used.

Plan around five hours after completing the lessons, including debugging and final
checks. This is a target, not a guaranteed completion time. Work through classes,
tags, store, filters/totals, and integration in that order if you need a starting point.

Optional, ungraded ideas after finishing: personalize colors and sample data;
add a clear-filters button; show an expense count beside each category total.
One group, USD, equal or weighted splits, and no saved data after refresh are the
required scope. Accounts, payments, percentage splits, and recurrence are not required.

## Built With

- JavaScript ES modules — application code without a framework.
- HTML and CSS — supplied responsive interface.
- Node.js built-in HTTP server and test runner — local preview and automated checks.

## License

[License](
