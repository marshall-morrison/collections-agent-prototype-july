# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Customer Collections Agent Prototype — V7

A low-to-mid fidelity clickable prototype for the Tabs Collections Agent, covering the single-customer detail page and the customer-first worklist that leads into it. Built iteratively in vanilla HTML/CSS/JS — no build step, no framework, no dependencies. There is nothing to install, lint, or test; verification is done by eye in the browser.

This is the active working version handed off for the next round of design iteration (superseding the earlier `V7 - July 22` snapshot elsewhere in this Downloads folder).

**Branches**: `main` is the **July descope** — a reduced-FE-lift build meant to ship sooner, with the AI-refine composer, multi-event citation + hover highlighting, and the agent-identity sparkle mark (worklist banner, animated tab indicator, Agent Summary logo) all cut to bring the build down in scope. `august` is the **full-featured snapshot** taken right before the descope — everything above is intact there. If a future ask is "bring back X," check whether `august` already has it before rebuilding from scratch.

## Running it

```bash
# from the Downloads folder (one level up), so any sibling vN folder is reachable the same way
python3 -m http.server 8742
```

Open **http://localhost:8742/v7/**.

## What this is

Tabs is an AR (accounts receivable) automation product. The Collections Agent is an AI that reads inbound customer emails, payment events, and billing history, then proposes actions (send a reply, update a contact, log a promise to pay, etc.) for a human to approve. This build ships **structured, click-based interaction only** — no chat surface, no natural-language plan editing. (Dunning, an LLM policy block, and NL chat/direction are Fast Follow — out of scope here by design, not by omission.)

The prototype has three views:
- **Collections Worklist** — one row per customer with open agent work; its own top-level nav item (not nested under Invoicing, since a customer-level worklist is a first-class object like Customers, not a billing sub-page). Click a row to navigate to that customer's detail page.
- **Customer detail page** — the main subject of this work, with three tabs: **Agent Actions**, **Activity**, **Scheduled**.
- **Customer page** (via "Customers" in the nav) — the standard Tabs customer profile, with a "Collections Agent" deep-link under Billing & revenue.

There's also an Invoice details page with its own "Collections Agent" deep-link (badged with the pending-action count).

### Two scenarios, real customer switching

This isn't one hardcoded customer — the worklist has two fully-built detail pages behind it, selected by which row you click:

- **Meridian Group** — Dana Reed asked for a signed W-9 and a billing contact update. Two proposed actions (send email, update contact), both pending review, each citing its own separate triggering email.
- **Northwind Traders** — Tom Reilly asked for a billing contact update *and* a resent invoice, both from the **same single email**. Demonstrates one event → two actions: the contact update is pre-seeded as **auto-executed** (shows "Auto-executed" verdict, no approve/reject needed), the email reply is pending review. Built specifically to stress-test the multi-action-per-event pattern and the auto-vs-review distinction.

Architecturally: `SCENARIO_MERIDIAN` / `THREADS_MERIDIAN` and `SCENARIO_NORTHWIND` / `THREADS_NORTHWIND` are the two fixed data sets; `SCENARIO` / `THREADS` are mutable `let` bindings reassigned via `SCENARIOS_BY_ID[customerId]` when a worklist row is clicked. A scenario can set `initialActionState` (e.g. `{0: "auto"}`) to pre-seed an action as already-executed on load. If you add a third customer, follow this pattern rather than hardcoding a new global.

## Design brief

The full functional requirements live in Notion:
**Customer Collections Agent Page Design Brief** — `37c17d4f80ce80d29a75cf2991030fbc`
**PRD 2.0: Customer Level Collections** — the current source of truth for scope, phasing, and open questions.

## Code architecture

Two files do everything: `index.html` (markup shell + the entire stylesheet in one inline `<style>` block, including the Toretto Library CSS custom properties) and `app.js` (all logic + mock data).

The app is a **single-page, string-template renderer driven by module-level mutable state** — no framework, no virtual DOM, no reactivity:

1. **Data** — `WORKLIST`, `SCENARIO_MERIDIAN`/`SCENARIO_NORTHWIND` (+ their `THREADS_*` pairs), `SCENARIOS_BY_ID`, `INBOX_COLUMNS`, `ACT_CATS`, `AVAILABLE_ATTACHMENTS` are the fixed data/config.
2. **State** — a block of module-level `let` variables is the entire app state: `view` (`"inbox"|"detail"|"customer"|"billing"`), `SCENARIO`/`THREADS` (current customer, reassigned on navigation), `activeTab`, `activityFilter` (Activity tab's All/Email toggle), `visibleInboxCols`, `inboxSearchQuery`, `activeFilters`/`filterSubmenu` (worklist Add-filter chips), `inboxPage`, plus detail-page UI flags (`actionState`, `expandedCard`, `selectedEmailId`, `threadOpenEmails`, `agentPaused`, `drawerThreadId`, etc.).
3. **`render()`** — the top-level entry. Switches on `view`, writes `main.innerHTML` from a `renderX()` function, then attaches `.onclick`/`.onkeydown`/`.onchange` handlers to the freshly-created elements. Detail view delegates the tab body to `renderPanel()`.
4. **`renderPanel()` + `wire()`** — the detail page's inner loop. `renderPanel()` picks `renderActionsPanel`/`renderActivityPanel`/`renderScheduledPanel` by `activeTab`, sets `innerHTML`, then calls `wire()`.

**The core convention to follow when editing:** every `renderX()` function returns an HTML **string**, and interactivity is wired by tagging elements with `data-*` attributes. `wire()` (or the relevant local wiring block) then `querySelectorAll`s each `data-*` attribute and binds a handler that **mutates a state variable and re-renders** — there is no diffing, the whole panel/table re-renders every time. So adding an interaction = (a) emit the element with a new `data-foo` in a render function, (b) add a binding that reads `el.dataset.foo`, mutates state, re-renders. Always `esc()` interpolated user/data strings unless the value is trusted inline markup (see Agent Summary below), and `e.stopPropagation()` in handlers since rows nest.

Navigating into the detail view (from a worklist row, customer page, or billing page) **resets the entire detail-state block to defaults**, including reassigning `SCENARIO`/`THREADS` and seeding `actionState` from `SCENARIO.initialActionState`. If you add a new piece of detail state, reset it in those handlers too or it will leak across customers.

## Key design decisions and why

### 1. Related events → Agent proposes, grouped by shared cause (Agent Actions tab)

The Agent Actions tab shows the event(s) that triggered a proposal before the proposal itself. Rules:
- Every proposed action cites exactly one event via its `cause` field. An event only ever renders here if a real proposed action is tied to it — no orphan "this also happened" entries with nothing attached.
- When two or more actions share the *exact same* cause, they're grouped under one copy of that event instead of repeating it (see Northwind: one email, two action cards nested beneath it). Actions with different causes each get their own event above them, unchanged from the original 1:1 pattern.

**Why**: Pooling *all* events above *all* actions (tried and reverted) lost the direct cause→effect link. Strict 1:1-per-action duplicated the event when multiple actions shared it, which looked redundant. Grouping by shared cause gets both: still one event per distinct cause, but no duplication when several actions stem from the same trigger.

### 2. Activity tab: minimal All/Email filter, continuous timeline rail, actor-colored nodes

The Activity tab previously had a two-orthogonal-axis filter system (content-type × actor, with cross-filtered counts and a sliding-pill segmented control). That was killed entirely per feedback that it was more filter chrome than the tab needed, then **deliberately reintroduced in minimal form**: two pill buttons, **All** and **Email** (`.act-filter-tabs` / `.act-ftab`, state `activityFilter`, reset to `"all"` on detail-view entry). "Email" shows only the email-type items in `activityItems()`; there's no per-actor filtering and no search box anymore — if either turns out to be needed again, treat it as a fresh ask rather than restoring the old two-axis system wholesale.

Actor attribution in the row text still follows the **real Tabs activity-log pattern**: plain bold inline prefix (`**Collections Agent:** set PO 12345…`) only on `agent:true` rows, plus a colored text suffix — green "· Auto" (`cat:"ai"`) / blue "· Approved" (`cat:"user"`). The event **timeline is one continuous rail** (`.act-list::before`, a single vertical line spanning the list) rather than per-row segments. Email cards are **full-width and sit on top of the rail** (opaque white, `z-index:1`, no node of their own — the mail icon occupies the gutter and the rail is simply occluded behind them); their body text is inset (`padding-left:6px` + icon + gap) so it lines up with the event-row text at the same x. Events sit on the visible rail as a **plain blue dot** (`.ev-node`, 10px solid circle, `--hi-200`) — a per-event-kind icon treatment (a 32px tinted circle holding a Lucide glyph chosen by `kind`, colored by actor) was tried and reverted back to this simpler uniform dot, so `EVENT_ICON` and `actorOf()` no longer exist. The dot masks the rail. This followed two earlier tries before the icon version: a per-event-row connector that left dangling stubs, and an email-cards-inset-with-hollow-marker variant that read as confusingly indented.

Email rows also carry an **invoice tag** (`.inv-tag`, mono) — the `INV-####` pulled from the thread subject by `invoiceTag()` — so you can see at a glance which invoice a message ties to.

Engagement badges use one shared system across the Activity list and the drawer delivery report (`engBadge()` → `.eng-badge`): positive states (opened/clicked/delivered) green, negative (bounced/failed) red, each with its own Lucide icon.

### 3. Full thread view (Activity tab) is full-width, not a split pane

Clicking an email in the Activity list opens the thread full-width. Emails oldest-first, Gmail-style: collapsed emails are grey/muted, the most recent is open. The agent draft reply (if any) is wrapped in an email card tile with a darker connector line separating it from the thread history. Each message in a multi-email thread renders as its **own row**, in its own chronological position in the Activity list — threads are never collapsed into one row with a count; a discrete "View thread (N) →" text link sits bottom-right of each card in the thread (not a full-width block) so it doesn't add height. Clicking any message in a thread opens the drawer scrolled to that specific message.

**Drawer thread is styled Gmail-like** (redesigned away from the earlier boxy stack of bordered/grey pill cards): full-width message rows separated by hairline dividers edge-to-edge (no per-message border/radius/background). The redundant grey entity pill (`.ent-strip`) in the message head is gone — the sender name already carries it (e.g. "Dunning Reminder"). Collapsed = one line (sender · snippet · date); expanded = name/date + "to …" + body + delivery report / engagement badges. The agent draft reply is a softened light-blue card (`.td-draft`, thin `#cfe0fa` border, inset margins). **No circular sender avatars** — `.td-avatar` (initials, entity-colored) was tried on every message row and the draft head, then removed for a cleaner text-first look; `entityClass()` is still used elsewhere (the header-modal entity pill) so it wasn't deleted, just its avatar usage.

The `▾` chevron next to recipient names is the only clickable element in an email header. Clicking it opens a modal overlay with from/to/cc details and a per-recipient engagement grid (delivered/opened/clicked/bounced/failed).

**Email preview text wraps up to 3 lines** (both in the Agent Actions tab's related-event card and the Activity tab's email row) instead of hard-truncating at one line — sender/date/"Open" link moved to their own metadata row above the body so it has room.

An **expanded message shows the sender's raw email** next to their name, Gmail-style (`Dana Reed <finance@meridiangroup.com>`, muted `.td-who-email`) — from only, not to/cc (those already show truncated + the full detail is one chevron-click away via the header modal above). **Attachment chips are clickable** (`data-open-attachment`, `openMockAttachment()`) — there's no real file behind them, so clicking opens a new tab with a plain "preview unavailable in this prototype" placeholder rather than doing nothing, so the chip doesn't read as a dead decoration.

The delivery summary line reads **"Delivered to X of Y"** — tried "Sent to X of Y" briefly (`s.delivered` in `deliverySummary()` is really a not-bounced count, so "Sent" was arguably more accurate), reverted back per feedback.

### 4. Email thread drawer is resizable

The right-side email drawer has a drag handle on its left edge (cursor turns to a resize arrow). Drag to widen/narrow, clamped between 420px and 94% of viewport width. Implementation note: the drawer's open/close animation uses `transform: translateX()`, not a hardcoded `right` offset — this matters because a fixed-pixel offset would leave part of a resized (wider) drawer visibly on-screen when "closed."

### 5. Send email card: collapsed bird's-eye + expand to edit, plain composer

The send-email action card shows a compact bird's-eye by default (description, attachment count, Edit/Reject/Approve). Editing happens in the thread drawer via `renderDraftEditor()` — To/Cc pills, subject, and a plain textarea, nothing else above it. **No AI-refine tools and no formatting toolbar here on `main`**: both the Gmail-style "describe your change" bar (Polish/Serious/Friendly/Shorter quick tools, undo/redo, streaming rewrite) and the decorative bold/italic/strike/link/list toolbar (`.cmp-toolbar`/`.cmp-tool`, never wired to anything) were cut — the AI tools in the July descope to reduce FE lift, the formatting toolbar as a follow-up simplification. Both are intact on the `august` branch (`AI_VARIANTS`, `mockRefine()`, `aiRefineDraft()`, `aiUndoRedo()`, `typeInto()`, `.cmp-ai*`/`.cmp-toolbar` CSS) if either needs to come back.

**"Edit in thread" deep-links straight to the draft input**: clicking it (`openDraftEditorInDrawer()`) doesn't just open the thread drawer in edit mode — it also focuses the `.cmp-body` textarea, places the cursor at the end, and scrolls it into view, so you land directly in the editable draft instead of having to find and click into it after the drawer opens.

**Em-dash convention:** agent-generated copy (draft bodies, agent-sent email bodies, agent subjects, `agentSummary`, dunning subjects) deliberately **avoids em-dashes** — they read as an AI tell — using semicolons, commas, colons, or separate sentences instead. Human-authored inbound mail (customer Dana/Tom, merchant Priya's personal note) and system activity-log event `text` intentionally keep em-dashes, so keep that split if you add data.

### 6. Scheduled tab: agent tasks + dunning as a computed line

Shows agent scheduled tasks (editable: datetime + prompt, deletable) and computes the next dunning reminder date from the customer's dunning sequence — no individual dunning tiles, since we can't reliably enumerate them from the current data model (and dunning itself is Fast Follow, out of scope for this build).

**Open design question, not yet reflected in this build:** whether `schedule_task` should exist as a generic tool at all. Every real use of it in this prototype is actually a payment-status check, which arguably belongs to a dedicated Promise-to-Pay entity (with its own logged/due/broken lifecycle emitting events) rather than a freeform natural-language scheduled prompt. If that change lands, the Scheduled tab likely narrows to "pending PTPs awaiting their due date" + the dunning line, and `schedule_task` may not survive as a distinct tool. Not built yet — call this out to Marshall if it's relevant to what you're reviewing.

### 7. Collections Worklist

Nav item under Invoicing, alongside Billing / Credit memos / Invoice Kanban. The pre-existing invoice-status Kanban board (real product name: "Collections" — Sent/Overdue/Paid columns) is relabeled **"Invoice Kanban"** here to avoid colliding with this new "Collections Agent" item, and is intentionally inert (no click behavior) — it's a placeholder for the pre-existing page, not part of this build.

No summary stat cards above the table (an earlier "Needs review" / "Last 30 days" tile strip was tried, then removed as noise the table itself already communicates). A follow-up "agent identity" status line (`.agent-voice`, four small pulsing marks + "N actions ready for your review") was also tried and then cut in the July descope along with the rest of the agent-identity sparkle treatment — it's on `august` if it comes back into scope.

**Worklist status (`planStatus`) has exactly three values: Needs Review, Executed, Rejected.** There's no "Executing" (nothing in this prototype models an in-flight/async execution state) and no "Approved" as a worklist-level status — once a plan is approved it's executed, so the row status reflects that end state directly rather than the intermediate approval. (This is distinct from `actionState`, the per-action verdict on the detail page, which still uses "approved"/"rejected"/"auto" — that's about a human approving one action, not the worklist's summary of a customer's overall plan.)

- **Columns, in display order**: Customer (pinned, carries flag icon + "Agent Paused" badge), Status (pinned), What happened, Agent actions (wider — `width:230px`, min 210px — since action descriptions run longer than most columns), Total overdue (pinned), Total outstanding, Oldest overdue (days), Open invoices (a plain right-aligned **count**, `r.invoices.length` — was per-invoice pill tags, changed since a customer's exact invoice numbers aren't useful at a glance in this column). Only **Customer**, **Status**, and **Total overdue** are permanent; everything else (What happened, Agent actions, Total outstanding, Oldest overdue, Open invoices) is user-configurable via the Columns picker (small icon button, tooltip "Columns") but **defaults to visible** — the picker lets you hide columns, not opt into them. A zero Total overdue renders as an em dash, not "$0.00" in red — same empty-state treatment as Oldest overdue when there's no overdue invoice to date.
- **Rows are a fixed height** (`.inbox-table tbody tr{height:72px}`) regardless of content — "What happened" clamps to 2 lines (`.event-text`, `-webkit-line-clamp`) and Agent actions caps at 2 single-line bullets (`.act-bullets li` truncates with ellipsis, cell renderer slices to `.slice(0,2)`), so no row grows taller than the fixed height even with longer text.
- **Search** sits immediately left of the Columns icon — live-filters rows by customer name as you type.
- **Filters are real**, not decorative: "Add filter" is a two-step dropdown (pick a dimension — Status, Flag, Paused, Total outstanding, Total overdue, Oldest overdue — then a value for it), each selection becomes a removable chip (`.filter-chip`), and chips AND together against the row set (`activeFilters` + `filterMatches()` in `app.js`). Deliberately excludes What happened, Agent actions, Customer, and Open invoices as filter dimensions — those are what you're triaging, not axes you narrow by. **The worklist opens with a default "Status: Needs Review" chip already applied** (`activeFilters` initial value) rather than showing everything.
- **Sorting is real** on the three amount/day columns (Total outstanding, Total overdue, Oldest overdue): click a header to sort by it (toggles asc/desc on repeat clicks), via `inboxSort` + `sortRows()`/`sortValue()`. **Defaults to Total overdue, descending**, paired with the default Needs Review filter — so the worklist opens sorted to the most-overdue customer needing a look first.
- **Pagination**: 25 rows per page (`INBOX_PAGE_SIZE`), simple Prev/Next controls under the table, respecting the current search + filters. The table ships **300 generated filler rows** (`WORKLIST_DUMMY` / `makeDummyRow()`, deterministic index-derived data, not `Math.random()`, so it looks the same on every reload) alongside the 4 hand-built rows, to exercise real scale. **Only Meridian and Northwind are clickable** — those are the only two with a real detail-page scenario behind them (`SCENARIOS_BY_ID`); Atlas, Riverside, and all 300 filler rows render with `.row-inert` (no pointer cursor, no click) since they have nothing to navigate to.
- The table wrapper scrolls horizontally (`overflow-x:auto`) rather than clipping when columns don't fit the viewport.
- **Why Agent actions/What happened are two columns, not one**: mixing them ("Dana asked for X so agent will do Y") in one cell loses the cause→effect distinction and makes the table hard to scan. What happened = what the customer did; Agent actions = what the agent is proposing to do about it.

### 8. Additional affordances on the customer detail page

Always visible in the title row regardless of active tab: a **Flag** toggle (outline/filled, `#flagBtn`; still backed by the `agentEscalated`/`escalated` state and field names internally — only the user-facing label and copy changed from "Escalate" to "Flag"), Pause/Resume Agent, and an "Agent permissions" text link. The Flag button's hover tooltip explains what flagging does rather than just naming the action: "Flag this customer — makes your agent aware of the flag and filterable on the Collections Agent table." The permissions link currently has nowhere real to route to, since the LLM policy block it would open is Fast Follow — left in place as a placeholder, not wired to a stub.

**Clicking Flag (in either direction) doesn't toggle it directly** — it opens a small inline popover (`.flag-popover`, state `flagPopoverOpen`) anchored right under the button asking why, with a textarea and Cancel/Confirm. Only Confirm actually flips `agentEscalated`; Cancel or a click outside just closes the popover with no change. Deliberately a small anchored popover, not a full modal overlay — matches the app's other small popovers (`.filter-dropdown` etc.) rather than introducing a new heavier pattern. The typed reason isn't persisted or shown anywhere yet (no activity-log entry, no tooltip) — that's a reasonable next step if this needs to feel more real, not built since it wasn't asked for.

### 9. Agent Summary: three fixed slots, 3-4 lines (Key facts can be 1 or 2), no bullet marks, no conditional flag

Went through a Recommendation/Why/Evidence broken-out-**sections** version (each its own labeled block/card) and reverted — that read as "blue on blue" and added structure without adding clarity. Also tried a bulleted list with a small caption below/above each bullet's dot — the dot itself added nothing (there's no comparison being made between items) and fought with the caption for attention. Landed on: no bullet marks at all, just a small mono-uppercase slot label (`.as-slot`) followed directly by its plain text (`.as-line`) underneath, stacked. `SCENARIO.agentSummary` is a plain array of strings (bold via `**...**`), rendered by `renderAgentSummary()` as a single `<ul class="as-bullets">` (kept as a `<ul>`/`<li>` for structure/spacing only — `list-style:none`, no marker renders).

Each entry's label is derived from position, not a parallel array: first is always Trigger, last is always Recommendation, everything between is Key facts. When `agentSummary` has two consecutive strings for the same slot (Northwind's two Key facts), `renderAgentSummary()` groups them into one `<li>` and joins the strings with a space rather than rendering two separate lines — it's one fact continuing into a second sentence under one label, not two list entries with a gap between them. That grouping is also what lets the list flex between 3 and 4 source strings without any per-scenario bookkeeping of which slot is which.

**Why open-ended LLM generation for this was unreliable in practice**: a single unconstrained generation has to simultaneously (a) figure out what *kind* of situation it's looking at and (b) pick the right facts for that specific kind, every time, from scratch. Decoupling those into a classify-then-fill-template step is what actually fixed it. Validated by reconstructing 9 real triggers from production data (AirOps, Meter, Attentive — disputes, claimed-paid conflicts, non-response escalations, and routine closeouts) and drafting this shape of summary against the real email threads: it held up read-only, without needing to click into the thread, across all of them.

**Three fixed slots, in this order, 3-4 bullets total:**
1. **Trigger** (exactly 1 bullet) — what the customer actually said/asked, stated plainly. This one is close to deterministic: it's describing an event that already happened, not summarizing a judgment call.
2. **Key facts** (1-2 bullets) — the narrow, scoped facts a reviewer needs: the invoice's dollar/overdue state, plus any other single fact that's load-bearing enough to change the read if left out (e.g. Northwind's "the contact update already auto-executed"). **Split into two bullets rather than cramming** when there are two genuinely separate facts (Northwind: one bullet for the auto-executed contact update, a second for the invoice's overdue state) — don't force a second Key facts bullet when there's only one fact worth stating (Meridian stays at 3 total).
3. **Recommendation** (exactly 1 bullet) — why approving the proposed action(s) is safe (nothing outside what was asked, no dispute), or, for a genuine dispute/conflict, what's actually being asked for rather than an assumption either way.

The framing question when writing these for a new scenario is still *how do I convince a user to just click approve, fast?* — not "summarize everything that happened."

**No 4th "flag" bullet for escalation.** An earlier version of this framework added a conditional bullet that fired only when a customer was flagged/escalated, to call that out in the summary text. Cut it: the product already has a real, first-class control for exactly that (the Flag button + reason popover, decision #8) — a bullet that says "this is escalated" would just be restating in prose what the Flag badge on the row already shows. The only thing that varies bullet count is a second Key facts bullet, never escalation state.

Tried a real-time character-by-character typing effect on open (matching the AI-refine composer's "Polish" streaming, plus a sweep/pulse glow on the box), and a small static agent-mark next to the label — both reverted/cut in the July descope. `renderAgentSummary()` is a pure function of `SCENARIO.agentSummary`, bullets render complete the instant the page opens, no motion, no delay, no icon.

### 10. Multi-event citation + hover highlighting: tried, descoped to `august`

For a while, an action's `cause` field became `causes` (always an array), so a reply could cite more than one triggering event — e.g. Meridian's reply cited both Dana's contact-update email and her follow-up W-9 email — with hovering an action highlighting every event it cited (blue dot/text) and darkening the rail segments connecting them (`wireTimelineHover()`, `.cited-hl`/`.rail-hl`). It's a real, working pattern (still intact on `august`), but a lot of bespoke state/CSS for a subtle payoff, so it was cut in the July descope back to decision #1's simpler single-`cause`-per-action model. If it comes back: `causeKey()`/`primaryCause()`, `wireTimelineHover()`, and the `.cited-hl`/`.rail-hl` CSS on `august` are the starting point, not a rebuild.

**Rail rendering is still one continuous spine, not per-node segments stitched end to end** (this part wasn't reverted — it's a correctness fix, not part of the hover feature). The original approach drew the vertical connector as a `::before` on each `.tl-node`, relying on one node's box ending in exactly the right place for the next node's segment to pick up with no gap — it looked disjointed as soon as Meridian split into two separate `.tl-node`s (a single node with two nested actions, like Northwind, never exposed the bug). Fixed by giving `.tl` itself one continuous `::before` spine (anchored to the first dot's center, running to the container's bottom, which lines up with the last node's dot since that node has no trailing padding) that alone renders the line — no per-node segments involved anymore now that hover is gone too.

## Mock data

Two scenarios, each a `SCENARIO_*` object + matching `THREADS_*` array (see "Two scenarios" above for the narrative). Each `SCENARIO_*` holds:
- `agentSummary` — a plain array of 3-4 strings across 3 fixed slots (Trigger, Key facts x1-2, Recommendation; bold via `**...**`), rendered in the blue "Agent Summary" callout via `renderAgentSummary()`. See decision #9.
- `invoices` — outstanding invoice data for that customer.
- `proposed` — the action cards, each with a `cause` tying it to a triggering email.
- `scheduled` — agent tasks and dunning data.
- `newEvents` — the events cited by this plan (email IDs only, currently — no orphan bare-event entries; see decision #1).
- `events` — all non-email Activity-log events for this customer, each tagged `cat` (`"ai"`/`"user"`/`"system"`) and `agent` (bool) to drive the Activity tab's actor attribution and Auto/Approved suffix.
- `initialActionState` (optional) — pre-seeds `actionState` on load, e.g. `{0: "auto"}` for Northwind's auto-executed contact update.

`WORKLIST = [...WORKLIST_REAL, ...WORKLIST_DUMMY]` — `WORKLIST_REAL` is the four hand-built rows (Meridian, Northwind, Atlas Robotics, Riverside Media), `WORKLIST_DUMMY` is 300 deterministically-generated filler rows (`makeDummyRow()`) added to exercise pagination/filtering at scale. Only Meridian and Northwind have full detail-page scenarios (`SCENARIOS_BY_ID`) and are clickable; every other row, real or generated, is inert. See decision #7.

## Palette (Toretto Library tokens)

```
--primary / --ink:  #1c1c1a   (primary text, warm-black nav)
--n500 / --helper:  #75786f   (secondary/muted)
--border / --line:  #d3d4d0   (borders)
--n50 / --soft:     #f3f3f2   (hover / background)
--hi-200 / --blue:  #2476d8   ("jolly" blue — interactive / links / accent)
--critical / --warn:#e52834   (destructive / overdue)
--positive / --good:#15ac3f   (success / auto-executed)
--insight:          #8652ff   (purple, used sparingly)
--header:           #d3d6c2   (sage top-banner)
```
