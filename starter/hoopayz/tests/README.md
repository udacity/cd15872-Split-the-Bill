# How to read the project checks

These tests are supplied guidance, not extra code for you to implement. Each
learner test title ends with `[Milestone N, Task N]`, matching the project guide.
The leading number is also the task number. Multiple tests check different
parts of one task; those repeated numbers are intentional. Focused npm commands
select the existing prefixes, so keep test names and assertions intact.

Run commands from the application folder. Follow the project guide's task map
for source files and commands. Read the first error as well as the test title:
a failure in an earlier task can prevent a later test from reaching its check.
A `Finish Milestone ...` error identifies an unfinished starter implementation.

## Work through the checks

- Milestone 1, Task 1: `test:amount` checks the base class before subclasses.
  `test:models` covers Tasks 1–2; some checks need working subclasses.
- Milestone 2, Task 3: `test:private-tags` isolates the tag factory.
  `test:tags` covers Tasks 3–4 and uses the classes from Milestone 1.
- Milestone 3, Tasks 5–6: finish classes and tags first. In order, run
  `test:store:state` (Read state), `test:store:add` (Add safely),
  `test:store:lookup` (Find and remove), and `test:store:events` (Notify listeners).
  The first three do not require notifications. Event checks combine both tasks
  and can use lookup/removal even when their title focuses on subscriptions.
  `test:duplicates` is a focused Task 5 check; `test:store` runs the full set.
- Milestone 4, Tasks 7–8: `test:search` and `test:filter-refactor` should pass
  both before and after arrow conversion. Passing tests alone do not prove
  that you used arrows. `test:filters` also checks the unfinished selection
  predicates; those failures are expected until Task 8 is complete.
- Milestone 4, Task 9: `test:analytics` checks category totals and project limits.
- Milestone 5, Task 10: `test:view` checks the callback using a supplied stand-in
  for the page. You do not need to implement the test setup or change rendering.
- Milestone 5, Task 11: `test:modules` checks the real extraction and re-export.
  Complete Task 3 before this check; keep the same factory, not a second copy.

## Supplied helpers and final checks

`test:setup` checks `provided/money.test.js` and should pass on the fresh starter.
Its large-number cases test supplied helper internals, not additional learner work.
`provided/finished-app.test.js` combines completed tasks with the sample app,
so `test:provided` is not a setup-only check. Its sample/copy cases rely on
Milestones 1–3; its category case checks Milestone 4, Task 9.

`npm test` runs learner-task tests. `npm run test:all` includes supplied helpers
and integration checks too. The completed solution should pass them all; the
starter intentionally fails unfinished tasks. Also review required JavaScript
constructs and perform the browser checklist in the project guide. Automated
checks are not a substitute for those reviews.
