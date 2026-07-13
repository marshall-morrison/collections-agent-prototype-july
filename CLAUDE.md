# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Customer Collections Agent Prototype — V7

A low-to-mid fidelity clickable prototype for the Tabs Collections Agent, covering the single-customer detail page and the customer-first worklist that leads into it. Built iteratively in vanilla HTML/CSS/JS — no build step, no framework, no dependencies. There is nothing to install, lint, or test; verification is done by eye in the browser.

This is the active working version handed off for the next round of design iteration (superseding the earlier `V7 - July 22` snapshot elsewhere in this Downloads folder).

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

**Drawer thread is styled Gmail-like** (redesigned away from the earlier boxy stack of bordered/grey pill cards): full-width message rows separated by hairline dividers edge-to-edge (no per-message border/radius/background), each anchored by a circular entity-colored sender **avatar** (`.td-avatar`, initials; agent blue / customer warm-neutral / merchant purple / system grey). The redundant grey entity pill (`.ent-strip`) in the message head is gone — the sender name already carries it (e.g. "Dunning Reminder"). Collapsed = one line (avatar · sender · snippet · date); expanded = avatar + name/date + "to …" + body + delivery report / engagement badges. The agent draft reply is a softened light-blue card (`.td-draft`, thin `#cfe0fa` border, inset margins) with the same agent avatar in its head.

The `▾` chevron next to recipient names is the only clickable element in an email header. Clicking it opens a modal overlay with from/to/cc details and a per-recipient engagement grid (delivered/opened/clicked/bounced/failed).

**Email preview text wraps up to 3 lines** (both in the Agent Actions tab's related-event card and the Activity tab's email row) instead of hard-truncating at one line — sender/date/"Open" link moved to their own metadata row above the body so it has room.

An **expanded message shows the sender's raw email** next to their name, Gmail-style (`Dana Reed <finance@meridiangroup.com>`, muted `.td-who-email`) — from only, not to/cc (those already show truncated + the full detail is one chevron-click away via the header modal above). **Attachment chips are clickable** (`data-open-attachment`, `openMockAttachment()`) — there's no real file behind them, so clicking opens a new tab with a plain "preview unavailable in this prototype" placeholder rather than doing nothing, so the chip doesn't read as a dead decoration.

The delivery summary line reads **"Delivered to X of Y"** — tried "Sent to X of Y" briefly (`s.delivered` in `deliverySummary()` is really a not-bounced count, so "Sent" was arguably more accurate), reverted back per feedback.

### 4. Email thread drawer is resizable

The right-side email drawer has a drag handle on its left edge (cursor turns to a resize arrow). Drag to widen/narrow, clamped between 420px and 94% of viewport width. Implementation note: the drawer's open/close animation uses `transform: translateX()`, not a hardcoded `right` offset — this matters because a fixed-pixel offset would leave part of a resized (wider) drawer visibly on-screen when "closed."

### 5. Send email card: collapsed bird's-eye + expand to edit, with AI refine tools

The send-email action card shows a compact bird's-eye by default (description, attachment count, Edit/Reject/Approve). Editing happens in the thread drawer with a Gmail-style AI refinement bar: a "Describe your change" input plus four quick tools — **Polish, Serious, Friendly, Shorter** — and a **submit-arrow button** (`.cmp-ai-submit`, up-arrow in a solid dark-teal circle (`#0f5a5f`) matching the agent-chat submit) that sits at the end of the input, before the tool icons, and only appears once the user types (hidden via `.cmp-ai-input:placeholder-shown ~ .cmp-ai-submit`); Enter also works. ("Serious" replaced an earlier "Angry" button, which read as too strong; its icon is a neutral straight-mouth face, paired with "Friendly"'s smiling face — same circle-face shape.) Submit/tools wire in two places: `wireComposer` (drawer) and the main `wire()` (panel), via `data-ai-refine` / `data-ai-input` / `data-ai-submit`.

**"Edit in thread" deep-links straight to the draft input**: clicking it (`openDraftEditorInDrawer()`) doesn't just open the thread drawer in edit mode — it also focuses the `.cmp-body` textarea, places the cursor at the end, and scrolls it into view, so you land directly in the editable draft instead of having to find and click into it after the drawer opens.

**Em-dash convention:** agent-generated copy (draft bodies, agent-sent email bodies, agent subjects, `agentSummary`, dunning subjects, and every `AI_VARIANTS` entry in `app.js`) deliberately **avoids em-dashes** — they read as an AI tell — using semicolons, commas, colons, or separate sentences instead. Human-authored inbound mail (customer Dana/Tom, merchant Priya's personal note) and system activity-log event `text` intentionally keep em-dashes, so keep that split if you add data.

**Known limitation:** the canned AI-refine rewrite text (`AI_VARIANTS` in `app.js`) is currently hardcoded to Meridian's Dana Reed / W-9 content. Using these tools on Northwind's draft will show the wrong customer name — not yet fixed, flagged here so it isn't mistaken for a real bug in the pattern itself.

### 6. Scheduled tab: agent tasks + dunning as a computed line

Shows agent scheduled tasks (editable: datetime + prompt, deletable) and computes the next dunning reminder date from the customer's dunning sequence — no individual dunning tiles, since we can't reliably enumerate them from the current data model (and dunning itself is Fast Follow, out of scope for this build).

**Open design question, not yet reflected in this build:** whether `schedule_task` should exist as a generic tool at all. Every real use of it in this prototype is actually a payment-status check, which arguably belongs to a dedicated Promise-to-Pay entity (with its own logged/due/broken lifecycle emitting events) rather than a freeform natural-language scheduled prompt. If that change lands, the Scheduled tab likely narrows to "pending PTPs awaiting their due date" + the dunning line, and `schedule_task` may not survive as a distinct tool. Not built yet — call this out to Marshall if it's relevant to what you're reviewing.

### 7. Collections Worklist

Nav item under Invoicing, alongside Billing / Credit memos / Invoice Kanban. The pre-existing invoice-status Kanban board (real product name: "Collections" — Sent/Overdue/Paid columns) is relabeled **"Invoice Kanban"** here to avoid colliding with this new "Collections Agent" item, and is intentionally inert (no click behavior) — it's a placeholder for the pre-existing page, not part of this build.

No summary stat cards above the table anymore (an earlier "Needs review" / "Last 30 days" tile strip was tried, then removed as noise the table itself already communicates). In their place: a single quiet **agent identity line** (`.agent-voice`, built in `agentClusterIcon()`/`renderInbox()`) — first-person, not a stat: *"I have 12 actions ready for your review"* (or "Nothing needs your review right now" at zero). The mark is four copies of the same `NAV_ICON.agent` glyph already used in the left rail and chat header, arranged pointing outward from a shared center, each pulsing on a stagger — deliberately not a card, not a badge, not a loading spinner; the brief was "my agent is telling me it has actions it wants me to review," and the goal was an identity cue subtle enough not to read as another dashboard stat.

**Worklist status (`planStatus`) has exactly three values: Needs Review, Executed, Rejected.** There's no "Executing" (nothing in this prototype models an in-flight/async execution state) and no "Approved" as a worklist-level status — once a plan is approved it's executed, so the row status reflects that end state directly rather than the intermediate approval. (This is distinct from `actionState`, the per-action verdict on the detail page, which still uses "approved"/"rejected"/"auto" — that's about a human approving one action, not the worklist's summary of a customer's overall plan.)

- **Columns, in display order**: Customer (pinned, carries flag icon + "Agent Paused" badge), Status (pinned), What happened, Agent actions, Total overdue (pinned), Total outstanding, Oldest overdue (days), Open invoices. Only **Customer**, **Status**, and **Total overdue** are permanent; everything else (What happened, Agent actions, Total outstanding, Oldest overdue, Open invoices) is user-configurable via the Columns picker (small icon button, tooltip "Columns") but **defaults to visible** — the picker lets you hide columns, not opt into them. A zero Total overdue renders as an em dash, not "$0.00" in red — same empty-state treatment as Oldest overdue when there's no overdue invoice to date.
- **Search** sits immediately left of the Columns icon — live-filters rows by customer name as you type.
- **Filters are real**, not decorative: "Add filter" is a two-step dropdown (pick a dimension — Status, Flag, Paused, Total outstanding, Total overdue, Oldest overdue — then a value for it), each selection becomes a removable chip (`.filter-chip`), and chips AND together against the row set (`activeFilters` + `filterMatches()` in `app.js`). Deliberately excludes What happened, Agent actions, Customer, and Open invoices as filter dimensions — those are what you're triaging, not axes you narrow by. **The worklist opens with a default "Status: Needs Review" chip already applied** (`activeFilters` initial value) rather than showing everything.
- **Sorting is real** on the three amount/day columns (Total outstanding, Total overdue, Oldest overdue): click a header to sort by it (toggles asc/desc on repeat clicks), via `inboxSort` + `sortRows()`/`sortValue()`. **Defaults to Total overdue, descending**, paired with the default Needs Review filter — so the worklist opens sorted to the most-overdue customer needing a look first.
- **Pagination**: 25 rows per page (`INBOX_PAGE_SIZE`), simple Prev/Next controls under the table, respecting the current search + filters. The table ships **300 generated filler rows** (`WORKLIST_DUMMY` / `makeDummyRow()`, deterministic index-derived data, not `Math.random()`, so it looks the same on every reload) alongside the 4 hand-built rows, to exercise real scale. **Only Meridian and Northwind are clickable** — those are the only two with a real detail-page scenario behind them (`SCENARIOS_BY_ID`); Atlas, Riverside, and all 300 filler rows render with `.row-inert` (no pointer cursor, no click) since they have nothing to navigate to.
- The table wrapper scrolls horizontally (`overflow-x:auto`) rather than clipping when columns don't fit the viewport.
- **Why Agent actions/What happened are two columns, not one**: mixing them ("Dana asked for X so agent will do Y") in one cell loses the cause→effect distinction and makes the table hard to scan. What happened = what the customer did; Agent actions = what the agent is proposing to do about it.

### 8. Additional affordances on the customer detail page

Always visible in the title row regardless of active tab: a **Flag** toggle (outline/filled, `#flagBtn`; still backed by the `agentEscalated`/`escalated` state and field names internally — only the user-facing label and copy changed from "Escalate" to "Flag"), Pause/Resume Agent, and an "Agent permissions" text link. The Flag button's hover tooltip explains what flagging does rather than just naming the action: "Flag this customer — makes your agent aware of the flag and filterable on the Collections Agent table." The permissions link currently has nowhere real to route to, since the LLM policy block it would open is Fast Follow — left in place as a placeholder, not wired to a stub.

### 9. Agent Summary: flat convince-to-approve bullets, static

Went through a Recommendation/Why/Evidence broken-out-sections version and then **back to a flat bullet list** — the sections read as "blue on blue" and added structure without adding clarity. `SCENARIO.agentSummary` is a plain array of 3-4 strings (bold via `**...**`), rendered by `renderAgentSummary()` as a single `<ul class="as-bullets">`, no sub-labels or cards.

The bullets themselves are written to a specific brief: **the minimum a reviewer needs to click Approve without digging further** — what the customer actually asked for, the invoice's dollar/overdue state, and why approving is safe (nothing outside what was asked, no dispute). The framing question when writing these for a new scenario: *how do I convince a user to just click approve, fast?* — not "summarize everything that happened." **Default to 3 bullets, not 4** — a 4th tends to read as padding (a separate "no dispute" closer, once tried, felt like restating what the other bullets already implied — it got folded into another bullet instead of cut outright, since "no dispute" is still worth saying, just not as its own line). Only reach for a 4th bullet if there's a genuinely distinct fact that doesn't fit in the other three and would otherwise get lost (e.g. Northwind's "the contact update already auto-executed" — real, load-bearing information, not filler restating the other bullets).

Tried a real-time character-by-character typing effect on open (matching the AI-refine composer's "Polish" streaming, plus a sweep/pulse glow on the box) — reverted per feedback back to fully static: bullets render complete the instant the page opens, no motion, no delay. `renderAgentSummary()` is back to a pure function of `SCENARIO.agentSummary`, no `agentSummaryLive`/typing state involved. The label now carries a small **static** copy of the agent cluster mark (`agentClusterIcon("static")`, `.av-icon.static` disables the petal animation and shrinks the mark slightly) — identity without motion, the counterpart to the animated version on the worklist banner and Actions tab.

### 10. Multi-event citation: an action can cite more than one triggering event

An action's `causes` field is **always an array**, even for a single-cause action (e.g. Northwind's two actions both have `causes:[{type:"email",id:"nw_e2"}]`) — this was renamed from a singular `cause` object specifically so downstream code (grouping, hover highlighting) never has to branch on shape. Meridian's reply action is the multi-cause case: Dana's first email asks for a contact update (event A), her second, four minutes later, asks for a W-9 (event B). `update_contacts` cites only event A; `send_email` cites **both** A and B, since the reply answers both asks.

An action nests in the timeline under its **primary cause** — `primaryCause(a)`, the *last* entry in `causes`, i.e. its most immediate trigger — via `causeKey()`/`primaryCause()` in `app.js`. Events are deduped and rendered once each (`renderActionsPanel`'s grouping), same as before; what's new is that an action can cite an *earlier* event too without a second static nesting for it.

That earlier citation surfaces on **hover**, not as static text: hovering an action (`wireTimelineHover()`, wired into every `wire()` pass) reads its `data-cites` list (every cause, not just primary), finds each cited event's `.tl-node[data-event-key]`, and toggles `.cited-hl` on it (dot + label turn blue, `--hi-200`) plus `.rail-hl` on every `.tl-node` between the earliest cited event and the action's own node (darkens the connecting rail segments, `--n500`) plus `.cited-hl` on the action's own elbow (`.tl-action::before`, also darkens). Concretely: hovering "Update primary billing contact" only lights up event A (its sole citation, no rail segment since there's nothing between it and itself); hovering the reply lights up **both** events A and B and darkens the rail segment connecting them. All CSS transitions are on the base rule (`.tl-dot`, `.tl-node::before`, `.tl-action::before`) so both the hover-in and hover-out animate.

**Rail rendering: one continuous spine, not per-node segments stitched end to end.** The original approach drew the vertical connector as a `::before` on each `.tl-node`, relying on one node's box ending in exactly the right place for the next node's segment to pick up with no gap — it looked disjointed as soon as Meridian split into two separate `.tl-node`s (a single node with two nested actions, like Northwind, never exposed the bug). Fixed by giving `.tl` itself one continuous `::before` spine (anchored to the first dot's center, running to the container's bottom, which lines up with the last node's dot since that node has no trailing padding) that alone renders the default line. The per-node `::before` still exists but is transparent by default — it's now purely a hover overlay for `.rail-hl` to darken a specific segment, painted on top of the always-intact base spine.

## Mock data

Two scenarios, each a `SCENARIO_*` object + matching `THREADS_*` array (see "Two scenarios" above for the narrative). Each `SCENARIO_*` holds:
- `agentSummary` — `{recommendation, why, evidence: [...]}` (bold via `**...**` in any field), rendered in the blue "Agent Summary" callout via `renderAgentSummary()`. See decision #9.
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
