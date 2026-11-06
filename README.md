# Split the Bill: HooPayz

You are a junior JavaScript developer at HooPayz Financial. Alex, Sam, and Jordan
are taking a weekend trip. Some expenses are shared equally; others use different
share counts. Build an app that tracks their expenses, tags, search results,
category totals, and balances as they add and remove spending.

Your tech lead has supplied the interface and money helpers. You will connect
those pieces with classes, reusable behaviors, and a private expense store.

## What is supplied, and what you build

All paths in this table are inside `starter/hoopayz`.

| File               | Your work                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `src/models.js`    | Expense constructor, private amount/accessors, and two subclasses.                                  |
| `src/behaviors.js` | Private tags and composition with an expense. Class selection and initial tag cleanup are supplied. |
| `src/group.js`     | Private expense/subscriber state and all six public methods.                                        |
| `src/filters.js`   | Arrow-function refactoring and category/person predicates.                                          |
| `src/analytics.js` | Category totals using `reduce`. Per-person balances are supplied.                                   |
| `src/view.js`      | Keep the correct `this` in the marked callback. Rendering is supplied.                              |
| `src/tags.js`      | Create this module by extracting your completed tag factory.                                        |

The static `Expense.currency` field, validation/copy helpers in `src/support.js`,
rounding in `src/money.js`, app startup, forms, HTML, CSS, sample data, tests, and
local server are supplied. Keep provided helpers and tests intact. You choose
how to implement the learner code within the contracts below.

The required scope is one group, USD, equal or weighted splits, and in-memory data
that resets on refresh. Accounts, payments, percentage splits, and recurrence
are not required. No framework, paid service, API key, or package installation
is needed. Complete the lessons on functions, arrays, closures, classes, and
modules before starting.

## A route through the project

Allow about 4½ hours: 
  - Setup: 20 minutes, 
  - Classes: 50 minutes, 
  - Tags: 35 minutes, 
  - Store: 70 minutes,
  - Filters/Totals: 40 minutes, 
  - View/Modules: 20 minutes,
  - Final checks: 35 minutes. 
These are planning estimates, not measured completion times. Take more time where you need it.

### Set up and run the preview

Use Node.js **24 LTS**, a current browser, and a code editor. Use Git if cloning
the repository, and a free GitHub account if submitting a public GitHub repository.
From the repository root:

```sh
cd starter/hoopayz
node --version
npm run test:setup
npm start
```

Open http://localhost:4175. Stop the server with Ctrl+C. If that port is busy,
run `npm start -- 4176` and open http://localhost:4176. Keep another terminal
open in `starter/hoopayz` for the checks below. Refresh the preview after edits.

The setup checks cover supplied money helpers and should pass before you begin.
The unfinished page can show an incomplete-task message. Learner checks are
expected to fail until you implement their tasks; this is not a setup failure.

### Milestone 1: Model expenses (Tasks 1–2)

In `src/models.js`, implement `Expense` with a constructor, a private amount
field, and an `amountCents` getter/setter. Each expense has `id`, `description`,
`payer`, `participants`, `category`, and `amountCents`. Category defaults to `Other`.
Use `prepareExpense(options)` for public fields and `assertCents(value)` for the
amount: a positive whole number of cents, up to **$10,000 per expense**.
Invalid amount changes must leave the previous amount intact. Ordinary property
assignment is enough to save the public fields returned by the helper; no
object-copying utility is required. Leave the supplied static currency,
`shares`, and `toJSON` behavior in place.

Replace both placeholders with subclasses of `Expense`:

- `EvenSplit`: expose a `type` getter returning `even`. Use `map` to give each
  participant one share, then pass those weights to the inherited `shares` helper.
- `ShareSplit`: expose a `type` getter returning `share`. Initialize inherited
  fields in its constructor. Call `prepareWeights(this.amountCents,
  this.participants, options.weights)` and save the returned copy as `this.weights`.
  This property name is required: the supplied `toJSON()` reads it when the store
  copies expenses. Its `split` method passes `this.weights` to the inherited helper.

Both types use the base class's amount validation. For 100 cents with weights
`[1, 2, 1]`, the shares are 25, 50, and 25 cents. Rounding is already implemented.

**Checkpoint:** `npm run test:models`.

### Milestone 2: Give each expense private tags (Tasks 3–4)

A **factory** is a function that creates and returns an object or function.
Implement `Taggable(initial = [])` in `src/behaviors.js` as a factory returning
`addTag(tag)` and `getTags()`.

Each call creates its own private tag list. The returned methods can still use
that list after the factory finishes: that is a **closure**. Copy the initial
and returned arrays using spread so callers cannot change the private list.
Use an arrow function for `getTags`. Adding a tag trims its text, rejects blank
or non-text values, and ignores duplicates.

Complete `createExpense` by attaching this behavior to the selected expense.
This is **composition**: combining an expense with tag behavior, rather than
creating another subclass for every combination. Preserve its class identity
and split methods. Functions can be assigned to object properties just like
other values. Choose an attachment approach that meets the contract, with
both tag methods sharing the same private list for that expense.

**Checkpoint:** `npm run test:tags`. Finish classes and tags before the store,
because its supplied copy helper recreates expenses through `createExpense`.

### Milestone 3: Build the private store (Tasks 5–6)

In `src/group.js`, `createGroup(initialMembers)` must keep expenses and subscribers
inside its closure. No public or global arrays should expose them. Every group
must be independent. The scaffold groups six unfinished method stubs into four
stages; you implement all six methods and the private state that supports them.

1. **Read state:** `getState()` returns `{ members, expenses }` with copied arrays
   and copied expenses. Run `npm run test:store:state`.
2. **Add safely:** `hasExpense(id)` uses `some` to check whether an ID exists.
   `addExpense(expense)` copies and validates the expense, rejects
   duplicate IDs and unknown group members, and saves it. Before saving, call
   `assertExpenseTotal` with the saved expenses plus the candidate to reject an
   group total above **$100,000**. Invalid additions must leave the store unchanged.
   Run `npm run test:store:add`.
3. **Find and remove:** `findExpense(id)` uses `find` and returns a copy or
   `undefined`. `removeExpense(id)` uses `filter` and returns `true` when it removes
   an expense, or `false` when the ID is missing. Run `npm run test:store:lookup`.
4. **Notify listeners:** `subscribe(callback)` rejects non-functions, registers
   a callback, and returns a function that stops only that subscription. The same
   callback may be registered more than once; each registration is independent.
   Calling an unsubscribe function repeatedly must not stop other registrations.
   Subscribing alone does not notify. Complete notification for successful additions and
   removals: call each active listener once with a fresh `getState()` result.
   Rejected additions and missing-ID removals do not notify. Run
   `npm run test:store:events`, then `npm run test:store`.

The earlier checkpoints focus on state changes; notification behavior must also
be complete before this milestone is done. Changes to input expenses, returned
snapshots, or found expenses must never change saved data. Use the supplied
`members`, `copy`, and validation helpers. Simple arrays and callbacks are enough.

### Milestone 4: Filter expenses and total categories (Tasks 7–9)

A **predicate** is a function that answers a true/false question about a value.
Here, a filter factory returns a predicate that checks one expense.

`byText` and `composeFilters` in `src/filters.js` start as working ordinary
functions. Run `npm run test:filter-refactor` before changing them. Convert both
outer functions, both returned functions, and the callback passed to `every`
into arrows. Keep the default search value, the rest parameter `...checks`, and
the behavior. Then run the same command again; it should still pass. These
behavior checks do not prove that you used arrows, so inspect your code too.

For an unrelated example, `function double(n) { return n * 2; }` can become
`const double = (n) => n * 2;`. An arrow with braces still needs `return` to return
a value. These filters do not use `this`; do not automatically convert class methods.

Implement two more filter factories:

- `byCategory(category = "")`: exact category match; empty selection includes all.
- `byMember(member = "")`: match the payer or any participant; empty selection includes all.

Search ignores capitalization and spaces around the query. `composeFilters`
uses `every` so every supplied predicate must pass; no predicates includes all
expenses. This is function composition: combining small checks into one check.

**Checkpoint:** `npm run test:filters` after implementing both additional
factories. Unlike the refactor-only check, this command is not expected to pass
on the fresh starter. `npm run test:search` isolates text-search behavior.

In `src/analytics.js`, implement `totalsByCategory(expenses)` using `reduce`.
Return category names mapped to total cents: Food amounts of 100 and 250 produce
`{ Food: 350 }`. Use the supplied empty dictionary and return it for empty input.
Keep the supplied `assertExpenseTotal` guard in place before your reduction.
Do not change input expenses. Filters affect the visible list, not group totals.

**Checkpoint:** `npm run test:analytics`.

### Milestone 5: Connect the view and extract a module (Tasks 10–11)

Complete the marked callback in `ExpenseView.connect` in `src/view.js`. When the
store calls `render` later, it must retain the view as `this`. Use `bind` or an
equivalent wrapper. Adding or removing expenses should update the page without
a reload. Run `npm run test:view`.

Move your completed `Taggable` factory into a new `src/tags.js` with a named
export. Import and re-export it from `behaviors.js` so existing consumers still
work. Keep `createExpense` as a default export. Use at least three modules and
both named and default exports. This is an actual extraction: do not leave a
second factory implementation behind. Run `npm run test:modules`.

## Helper contracts

You are responsible for calling these supplied helpers where your code needs
them, not for rebuilding their internals.

| Helper                                          | Contract                                                                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `prepareExpense(options)`                       | Validate public details, trim description/category, and return fields with copied participants. Throws for invalid details. |
| `assertCents(value)`                            | Return positive whole-number cents up to $10,000 per expense, or throw.                                                              |
| `assertExpenseTotal(expenses)`                  | Return combined cents (zero for an empty list); reject invalid expenses or a total above $100,000. Call before saving additions. |
| `prepareWeights(amount, participants, weights)` | Validate the amount/allocation and return copied positive whole-number weights, one per participant, or throw.              |
| `this.shares(weights)`                          | Return person-to-cents allocations, including leftover cents.                                                               |
| `prepareMembers(members)`                       | Return a validated, copied, nonempty list of unique members.                                                                |
| `assertBelongsToGroup(expense, members)`        | Throw if payer or participants are outside the group.                                                                       |
| `copy(expense)` inside the store                | Recreate an independent expense, including tags and methods.                                                                |

The project allows at most **$10,000 per expense** (`1_000_000` cents) and
**$100,000 in combined group spending** (`10_000_000` cents). These inclusive
limits are practical project rules, not JavaScript's maximum values. Both matter:
many valid expenses can still exceed the group limit. An over-limit addition
throws a descriptive error before saving or notifying; removing an expense frees
capacity. Category totals and summaries check the same rules when called directly.
The supplied formatting helper also handles group totals, zero, and negative balances.

**Context, not an assignment:** JavaScript numbers can round decimal fractions,
and very large integers can lose precision. The supplied helpers handle money
precision and rounding; you do not need to implement or explain their internals.
For optional background, search for “JavaScript floating-point precision”,
“Number.MAX_SAFE_INTEGER”, or “money integer cents”.

Advanced helper internals are not assessed. Keep app startup synchronous; no
fetch, promises, external services, or async functions are needed.

## Final checks and submission

Run these commands from `starter/hoopayz`:

```sh
npm test
npm run test:all
```

`npm test` runs learner-task checks. `test:all` also includes supplied-helper and
sample-app integration checks. `test:provided` runs supplied/integration checks;
some need your learner code to be complete. Existing focused commands
`test:amount`, `test:private-tags`, and `test:duplicates` remain available.

Read the test title and first error. A “Finish” message points to an unfinished
task; a syntax/import error means a file cannot load yet. You do not need to
write tests or study the test runner internals. Passing examples are useful
feedback, but they do not replace checking the required constructs in your code.

Check the completed app in the browser:

- [ ] Sample spending is `$390.01`; balances are Alex `-$18.35`, Sam `$74.17`, Jordan `-$55.82`.
- [ ] Add `$1.00` equally among three people: shares are `$0.34`, `$0.33`, `$0.33`.
- [ ] Add `$1.01` with shares 1,2,1: shares are `$0.25`, `$0.51`, `$0.25`; an entered tag appears.
- [ ] Search for dinner, combine category/person filters, and try no matches. Group totals stay unchanged.
- [ ] Remove an expense: the list, category totals, and balances update without a reload.
- [ ] Try zero amount, no participants, or `$10,000.01`: feedback appears and no expense is added.
- [ ] In an empty group, ten `$10,000` expenses reach `$100,000`; one extra cent is rejected without changing the ledger. Remove an expense, then retry successfully.

Reviewers inspect eight skill areas as well as running the checks:

1. Modern function syntax: arrows, defaults, rest, and spread in the required tasks.
2. Higher-order functions and callbacks: filter factories, composition, and subscriptions.
3. Array methods: `map`, `filter`, `reduce`, `find`, `some`, and `every` in their assigned roles.
4. Closure-based private state: independent tags and stores with defensive copies.
5. Classes: inheritance, accessors, private amount state, and validated subclasses.
6. `this` binding: the view callback retains its receiver.
7. Behavior composition: tags attach without losing expense class behavior.
8. Modules: actual tag extraction, at least three modules, and named/default exports.

Follow the course **Submit Project** page for available submission methods: a
Zip File or a Public Github Repository. Include your completed `starter/hoopayz`
app, supplied tests, README, and license. Keep run instructions accurate if you
change setup. Do not include passwords, `node_modules`, or instructor solutions.

After completing the required work, optional ungraded ideas include personalizing
colors/sample data, adding a clear-filters button, or showing category expense counts.

## Built with

JavaScript ES modules, supplied HTML/CSS, and Node.js's built-in HTTP server and
test runner.

## License

[License](LICENSE.txt)
