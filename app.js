/* ============================================================
   Collections Agent — v6
   Two views: Collections Agent worklist (customer table) + Customer detail
   ============================================================ */

// ============================================================
//  ICONS
// ============================================================
const SV = (p) => `<svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
// Lucide icons (https://lucide.dev) — 24px grid, 2px stroke, currentColor. Inlined so they survive the re-render loop.
const LU = (p) => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICON = {
  check:    LU('<path d="M20 6 9 17l-5-5"/>'),
  x:        LU('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'),
  clip:     LU('<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>'),
  user:     LU('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  flagOut:  LU('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>'),
  flagFill: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--critical)" stroke="var(--critical)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7" fill="none"/></svg>`,
};

// Left-nav icons — Lucide (https://lucide.dev), outline, currentColor.
const NAV_ICON = {
  overview:     LU('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>'),
  customers:    LU('<path d="M15 13a3 3 0 1 0-6 0"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><circle cx="12" cy="8" r="2"/>'),
  contracts:    LU('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'),
  invoicing:    LU('<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>'),
  usage:        LU('<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>'),
  revenue:      LU('<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>'),
  reporting:    LU('<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>'),
  data:         LU('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>'),
  developers:   LU('<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'),
  integrations: LU('<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m6.08 9.5-3.48 1.59a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.48-1.58"/><path d="m6.08 14.5-3.48 1.59a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.48-1.58"/>'),
  settings:     LU('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
  userc:        LU('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>'),
  logout:       LU('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>'),
  agent:        LU('<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>'),
  chev:         LU('<path d="m6 9 6 6 6-6"/>'),
  collapse:     LU('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>'),
};

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function mdToHtml(t){ return t.trim().split(/\n\n+/).map(p=>`<p>${p.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,' ')}</p>`).join(''); }
function mdInline(t){ return t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'); }
// Four copies of the same NAV_ICON.agent glyph pointing outward from a shared center —
// the "agent identity" mark for the worklist's status line (see .agent-voice below).
function agentClusterIcon(extraClass){
  const path = '<path fill="currentColor" d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/>';
  return `<span class="av-icon${extraClass?` ${extraClass}`:""}">
    <svg class="av-star av-n" viewBox="0 0 24 24">${path}</svg>
    <svg class="av-star av-e" viewBox="0 0 24 24">${path}</svg>
    <svg class="av-star av-s" viewBox="0 0 24 24">${path}</svg>
    <svg class="av-star av-w" viewBox="0 0 24 24">${path}</svg>
  </span>`;
}
// Recommendation → Why → Evidence: leads with the call to action, then the reasoning behind
// it, then the source facts — a "powerful TL;DR" meant to build trust in the agent's judgment
// rather than making the user re-derive it from a wall of narrative text.
// Flat bullets, not broken-out sections: 3-4 lines that give a reviewer just enough to click
// Approve without digging further — what was asked, the state of the invoice, and why
// approving is safe (no dispute, nothing outside what was requested).
function renderAgentSummary(s){
  const items = s.agentSummary.map(b=>`<li>${mdInline(b)}</li>`).join("");
  return `<ul class="as-bullets">${items}</ul>`;
}
function initials(n){ return n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); }
function entityClass(e){ return {customer:"customer",system:"system",dunning:"system",agent:"agent",merchant:"merchant"}[e]||"system"; }
function entityLabel(ec, override){ return override || {customer:"Customer",system:"System",dunning:"Dunning",agent:"Agent",merchant:"Merchant"}[ec]||"System"; }
// Engagement badge — same visual system as the drawer delivery report: positive states
// (opened/clicked/delivered) green, negative (bounced/failed) red, each with its own icon.
function engBadge(kind){
  const I = {
    delivered: LU('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
    opened:    LU('<path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>'),
    clicked:   LU('<path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>'),
    bounced:   LU('<path d="m9 9 6 6"/><path d="m15 9-6 6"/><circle cx="12" cy="12" r="10"/>'),
    failed:    LU('<path d="m9 9 6 6"/><path d="m15 9-6 6"/><circle cx="12" cy="12" r="10"/>'),
  };
  const label = { delivered:"Delivered", opened:"Opened", clicked:"Clicked", bounced:"Bounced", failed:"Failed" }[kind] || kind;
  const tone = (kind==="bounced"||kind==="failed") ? "neg" : "pos";
  return `<span class="eng-badge ${tone}"><span class="eb-ic">${I[kind]||""}</span>${esc(label)}</span>`;
}

// ============================================================
//  DATA
// ============================================================
const WORKLIST_REAL = [
  {
    id: "meridian",
    customer: "Meridian Group",
    invoices: ["INV-2241","INV-2243"],
    outstandingAmt: 15890,
    overdueAmt: 10890,
    eventSummary: "Dana requested a W-9 and billing contact update before processing payment",
    proposedActions: ["Send email","Update primary billing contact"],
    escalated: false,
    planStatus: "review",
    paused: false,
    mostOverdueDays: 21,
  },
  {
    id: "northwind",
    customer: "Northwind Traders",
    invoices: ["INV-3102","INV-3110","INV-3125"],
    outstandingAmt: 42300,
    overdueAmt: 28100,
    eventSummary: "Tom Reilly asked to update the billing contact and requested a resend of INV-3102",
    proposedActions: ["Update primary billing contact","Send email"],
    escalated: true,
    planStatus: "review",
    paused: false,
    mostOverdueDays: 35,
  },
  {
    id: "atlas",
    customer: "Atlas Robotics",
    invoices: ["INV-2988"],
    outstandingAmt: 7600,
    overdueAmt: 0,
    eventSummary: "Customer confirmed remittance details; agent matched $7,600 payment to INV-2988",
    proposedActions: ["Match transaction","Mark invoice paid"],
    escalated: false,
    planStatus: "executed",
    paused: false,
    mostOverdueDays: null,
  },
  {
    id: "riverside",
    customer: "Riverside Media",
    invoices: ["INV-4410"],
    outstandingAmt: 3200,
    overdueAmt: 3200,
    eventSummary: "Customer disputed the invoice; agent paused for this customer pending manual review",
    proposedActions: [],
    escalated: false,
    planStatus: "executed",
    paused: true,
    mostOverdueDays: 12,
  },
];

// Volume filler for the worklist so pagination/filtering/sorting can be exercised at realistic
// scale. None of these rows have a matching entry in SCENARIOS_BY_ID, so — like Atlas and
// Riverside above — clicking one does nothing; only Meridian and Northwind open a detail page.
// Deterministic (index-derived), not Math.random(), so the table looks the same on every reload.
const DUMMY_NAMES = ["Alderin","Brightwell","Cascade","Driftwood","Emberly","Fenwick","Granite","Hollow Creek","Ironclad","Juniper","Kestrel","Lattice","Meadowlark","Norwood","Oakmont","Pinegrove","Quarrystone","Ridgeline","Sablewood","Thistledown","Underhill","Vantage","Westmere","Yarrow","Zephyr","Amberfield","Birchgate","Copperline","Elmsworth","Foxglove"];
const DUMMY_SUFFIXES = ["Inc.","LLC","Group","Partners","Holdings","Co.","& Sons","Industries","Ventures","Supply Co."];
const DUMMY_STATUSES = ["review","executed","rejected"];
const DUMMY_EVENTS = [
  "Customer requested an updated copy of their invoice",
  "Payment attempt failed due to insufficient funds",
  "Customer asked about extended payment terms",
  "Invoice marked as disputed by customer",
  "Customer confirmed payment is in process",
  "No response after third reminder email",
  "Customer requested a consolidated statement of all open invoices",
];
const DUMMY_ACTIONS = [
  ["Send email"],
  ["Send email","Update primary billing contact"],
  ["Match transaction"],
  ["Match transaction","Mark invoice paid"],
  [],
];
function makeDummyRow(i){
  const name = DUMMY_NAMES[i % DUMMY_NAMES.length];
  const suffix = DUMMY_SUFFIXES[Math.floor(i / DUMMY_NAMES.length) % DUMMY_SUFFIXES.length];
  const outstandingAmt = 1200 + (i * 137) % 48000;
  const overdueAmt = (i % 3 === 0) ? 0 : Math.round(outstandingAmt * (0.2 + (i % 5) * 0.15));
  const status = DUMMY_STATUSES[i % DUMMY_STATUSES.length];
  return {
    id: `dummy-${i}`,
    customer: `${name} ${suffix}`,
    invoices: [`INV-${5000 + i}`],
    outstandingAmt,
    overdueAmt,
    eventSummary: DUMMY_EVENTS[i % DUMMY_EVENTS.length],
    proposedActions: status === "review" ? DUMMY_ACTIONS[i % DUMMY_ACTIONS.length] : [],
    escalated: i % 11 === 0,
    planStatus: status,
    paused: i % 13 === 0,
    mostOverdueDays: overdueAmt > 0 ? 1 + (i * 7) % 90 : null,
  };
}
const WORKLIST_DUMMY = Array.from({ length: 300 }, (_, i) => makeDummyRow(i));
const WORKLIST = [...WORKLIST_REAL, ...WORKLIST_DUMMY];

// Collections Agent worklist column config. "customer", "status" and "overdue" are pinned
// (always shown, not listed in the Configure columns picker); everything else is toggleable —
// visibleInboxCols below controls which of those render. Order here is display order.
const INBOX_COLUMNS = [
  { key:"customer", label:"Customer", pinned:true },
  { key:"status", label:"Status", pinned:true },
  { key:"event", label:"What happened" },
  { key:"actions", label:"Agent actions" },
  { key:"overdue", label:"Total overdue", sortable:true, align:"r", pinned:true },
  { key:"outstanding", label:"Total outstanding", sortable:true, align:"r" },
  { key:"oldestOverdue", label:"Oldest overdue", sortable:true, align:"r" },
  { key:"invoices", label:"Open invoices" },
];

// Worklist "Add filter" definitions — each maps to a predicate over a row. "Flag" (formerly
// "Escalate") reads the same `escalated` field as the detail-page flag control.
const FILTER_DEFS = {
  status:        { label:"Status", options:[
                    {value:"review", display:"Needs Review"},
                    {value:"executed", display:"Executed"},
                    {value:"rejected", display:"Rejected"},
                  ]},
  escalated:     { label:"Flag", options:[
                    {value:"true", display:"Flagged"},
                    {value:"false", display:"Not flagged"},
                  ]},
  paused:        { label:"Paused", options:[
                    {value:"true", display:"Paused"},
                    {value:"false", display:"Not paused"},
                  ]},
  outstanding:   { label:"Total outstanding", options:[
                    {value:"0", display:"> $0"},
                    {value:"10000", display:"> $10,000"},
                    {value:"25000", display:"> $25,000"},
                  ]},
  overdue:       { label:"Total overdue", options:[
                    {value:"0", display:"> $0"},
                    {value:"10000", display:"> $10,000"},
                    {value:"25000", display:"> $25,000"},
                  ]},
  oldestOverdue: { label:"Oldest overdue", options:[
                    {value:"0", display:"> 0 days"},
                    {value:"30", display:"> 30 days"},
                    {value:"60", display:"> 60 days"},
                  ]},
};
function filterMatches(r, f){
  switch(f.type){
    case "status": return r.planStatus === f.value;
    case "escalated": return String(!!r.escalated) === f.value;
    case "paused": return String(!!r.paused) === f.value;
    case "outstanding": return (r.outstandingAmt||0) > Number(f.value);
    case "overdue": return (r.overdueAmt||0) > Number(f.value);
    case "oldestOverdue": return (r.mostOverdueDays||0) > Number(f.value);
    default: return true;
  }
}
function sortValue(r, key){
  switch(key){
    case "outstanding": return r.outstandingAmt||0;
    case "overdue": return r.overdueAmt||0;
    case "oldestOverdue": return r.mostOverdueDays==null ? -1 : r.mostOverdueDays;
    default: return 0;
  }
}
function sortRows(rows){
  if(!inboxSort.key) return rows;
  const mul = inboxSort.dir==="asc" ? 1 : -1;
  return [...rows].sort((a,b)=>(sortValue(a,inboxSort.key)-sortValue(b,inboxSort.key))*mul);
}

const SCENARIO_MERIDIAN = {
  customer: "Meridian Group",
  agentSummary: [
    "Dana Reed asked for a signed W-9 and a contact update to **ap@meridiangroup.com** — both required before payment releases.",
    "INV-2241 (**$10,890**) is 21 days overdue; the last dunning reminder was opened but never answered.",
    "No dispute, no new terms — a paperwork gap, not a collections risk.",
  ],
  invoices: [
    { num:"INV-2241", due:"Jun 1, 2026",  amount:10890, od:21, status:"Overdue" },
    { num:"INV-2243", due:"Jun 15, 2026", amount:5000,  od:0,  status:"Sent" },
    { num:"INV-2250", due:"May 28, 2026", amount:1450,  od:25, status:"Overdue" },
    { num:"INV-2255", due:"Jun 20, 2026", amount:3200,  od:0,  status:"Sent" },
    { num:"INV-2260", due:"Jul 1, 2026",  amount:2800,  od:0,  status:"Pending" },
  ],
  // cat: "ai" = agent decided & executed · "user" = a human approved/took it · "system" = automated, no decision
  events: [
    { kind:"invoice_aged",    cat:"system", date:"Apr 25, 2026", time:"12:00 AM", text:"INV-2241 crossed 30 days past due — $10,890", agent:false },
    { kind:"update_po",       cat:"ai",     date:"May 5, 2026",  time:"10:30 AM", text:"Agent set PO 12345 on INV-2241", agent:true },
    { kind:"update_contacts", cat:"user",   date:"May 6, 2026",  time:"9:45 AM",  text:"Billing contact updated to ap@meridiangroup.com — approved by Priya Sharma", agent:true },
    { kind:"match_tx",        cat:"ai",     date:"May 20, 2026", time:"3:10 PM",  agent:true,
      html:`Agent matched payment $10,233.60 from Meridian Group to <a href="#" onclick="return false" style="color:var(--ink);text-decoration:underline">INV-22275</a> (<a href="#" onclick="return false" style="color:var(--ink);text-decoration:underline">→ transaction</a>)` },
    { kind:"ptp_logged",      cat:"customer", date:"May 28, 2026", time:"10:05 AM", text:"Customer promised to pay $10,890 by Jun 2 via ACH", agent:false },
    { kind:"invoice_pending", cat:"ai",     date:"May 30, 2026", time:"1:05 PM",  text:"INV-2241 moved to pending and dunning paused: customer says payment sent", agent:true },
    { kind:"invoice_resumed", cat:"ai",     date:"Jun 1, 2026",  time:"8:00 AM",  text:"INV-2241 moved back to overdue and dunning resumed: payment not confirmed", agent:true },
    { kind:"payment_failed",  cat:"system", date:"Jun 1, 2026",  time:"11:42 PM", text:"Payment failed — $10,890 on INV-2241 (R01 insufficient funds)", agent:false },
    { kind:"dunning_sent",    cat:"system", date:"Jun 2, 2026",  time:"8:05 AM",  text:"Dunning reminder 2 of 4 sent automatically to finance@meridiangroup.com", agent:false },
    { kind:"scheduled_task",  cat:"ai",     date:"Jun 2, 2026",  time:"9:00 AM",  text:"Agent confirmed INV-2241 hadn't been paid by the PTP date and drafted a follow-up", agent:true },
    { kind:"customer_paid",   cat:"customer", date:"Jun 2, 2026", time:"11:00 AM", text:"Customer paid $5,500 toward INV-2241 via ACH", agent:false },
    { kind:"payment_applied", cat:"system", date:"Jun 2, 2026",  time:"11:30 AM", text:"Payment applied — $5,500 to INV-2241 ($5,390 remaining)", agent:false },
    { kind:"ptp_broken",      cat:"system", date:"Jun 2, 2026",  time:"12:00 AM", text:"Promise to pay broken — $10,890 due Jun 2, not received", agent:false },
    { kind:"credit_memo",     cat:"user",   date:"Jun 3, 2026",  time:"10:00 AM", agent:true,
      html:`Credit memo $415 created and applied to <a href="#" onclick="return false" style="color:var(--ink);text-decoration:underline">INV-8826</a> (<a href="#" onclick="return false" style="color:var(--ink);text-decoration:underline">→ view memo</a>) — approved by Priya Sharma` },
    { kind:"escalated",       cat:"user",   date:"Jun 3, 2026",  time:"2:30 PM",  text:"Customer flagged: customer threatened to churn", agent:false },
    { kind:"invoice_voided",  cat:"ai",     date:"Jun 4, 2026",  time:"9:15 AM",  text:"INV-2242 voided (duplicate)", agent:true },
  ],
  scheduled: [
    { type:"agent_task", id:"st1", date:"Jun 10, 2026", time:"9:00 AM",
      prompt:"Re-check if INV-2241 has been paid. If not and there has been no customer reply, send the next dunning follow-up. If they replied, re-plan." },
    { type:"dunning", id:"d1", date:"Jun 12, 2026", time:"8:00 AM",
      step:"Reminder 2 of 4", to:"finance@meridiangroup.com", subject:"Following up: invoice INV-2241 still outstanding" },
    { type:"dunning", id:"d2", date:"Jun 19, 2026", time:"8:00 AM",
      step:"Reminder 3 of 4", to:"finance@meridiangroup.com", subject:"INV-2241: please remit" },
    { type:"dunning", id:"d3", date:"Jun 26, 2026", time:"8:00 AM",
      step:"Final notice", to:"finance@meridiangroup.com", subject:"Final notice: INV-2241" },
  ],

  // events that triggered these agent actions — email IDs or inline event objects
  // Every cited event must have a proposed action tied to it (via that action's own `cause`) —
  // no orphan "this happened too" entries. payment_failed was removed from here for exactly
  // that reason: neither proposed action below is caused by it.
  newEvents: [
    { type:"email", id:"e3a" },
    { type:"email", id:"e3b" },
  ],

  // "causes" is always an array — even a single-cause action — so downstream code (grouping,
  // hover highlighting) doesn't need to branch on shape. Update contact cites only Dana's first
  // email (the contact ask); the reply cites BOTH, since it answers the contact ask AND the
  // W-9 ask from her second email. See decision on multi-event citation in CLAUDE.md.
  proposed: [
    { kind:"update_contacts", desc:"Update primary billing contact → ap@meridiangroup.com", editableContact:"ap@meridiangroup.com",
      causes:[{ type:"email", id:"e3a" }] },
    { kind:"send_email", desc:"Reply to Dana Reed with signed W-9 attached, confirm billing contact update", invoice:"INV-2241",
      causes:[{ type:"email", id:"e3a" }, { type:"email", id:"e3b" }],
      attachments:[{name:"W-9_GeneralCatalyst.pdf"}],
      draft:{ to:"finance@meridiangroup.com", cc:"ap@meridiangroup.com", subject:"Re: INV-2241: W-9 + billing contact",
        body:"Hi Dana,\n\nThanks for flagging both. The signed W-9 is attached, and I've also updated the billing contact to ap@meridiangroup.com as requested.\n\nLet me know if anything else is needed.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
        attachments:[{name:"W-9_GeneralCatalyst.pdf"}] },
    },
  ],
};

const THREADS_MERIDIAN = [
  { id:"t1", subject:"INV-2241: W-9 + billing contact",
    emails:[
      // Invoice send — system/Postmark, engagement data available
      { id:"e1", dir:"out", entity:"system", entityLabel:"Invoice Sent",
        from:{name:"Invoice Sent",email:"billing@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:"opened"}], cc:[],
        date:"May 1, 2026", time:"10:31 AM",
        body:"Hi Dana,\n\nYour invoice INV-2241 for $10,890 is attached. Payment is due Jun 1, 2026. Please use the link below to pay securely online.\n\nThanks,\nGeneral Catalyst",
        attachments:[{name:"INV-2241.pdf",type:"PDF"}], badges:["opened"] },
      // Agent email — confirms PO applied + billing contact updated (multi-recipient: per-recipient delivery tracking)
      { id:"e_agent", dir:"out", entity:"agent",
        from:{name:"Collections Agent",email:"billing@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:"opened",
             eng:{delivered:"May 6, 2026 · 11:15 AM", opened:"May 6, 2026 · 2:11 PM", clicked:"May 7, 2026 · 9:01 AM"}}],
        cc:[
          {name:"James Hart",email:"ap@meridiangroup.com",       eng:{delivered:"May 6, 2026 · 11:15 AM", opened:"May 6, 2026 · 4:02 PM"}},
          {name:"Priya Nambiar",email:"controller@meridiangroup.com", eng:{delivered:"May 6, 2026 · 11:15 AM", opened:"May 7, 2026 · 8:40 AM"}},
          {name:"Tobi Okonkwo",email:"procurement@meridiangroup.com",  eng:{delivered:"May 6, 2026 · 11:15 AM", opened:"May 6, 2026 · 5:23 PM", clicked:"May 6, 2026 · 5:24 PM"}},
          {name:"Sarah Chen",email:"sarah.chen@meridiangroup.com",     eng:{bounced:true}},
          {name:"Dan Kowalski",email:"ar@meridiangroup.com",           eng:{delivered:"May 6, 2026 · 11:15 AM"}},
        ],
        date:"May 6, 2026", time:"11:15 AM",
        body:"Hi Dana,\n\nJust confirming: I've applied PO 12345 to INV-2241 and updated the primary billing contact to ap@meridiangroup.com as requested.\n\nA fresh copy of INV-2241 is attached.\n\nBest,\nGeneral Catalyst Collections",
        attachments:[{name:"INV-2241.pdf",type:"PDF"}], badges:["opened"] },
      // Dana's quick ack of the invoice — inbound, no engagement data (not Postmark-tracked)
      { id:"e_dana_ack", dir:"in", entity:"customer",
        from:{name:"Dana Reed",email:"finance@meridiangroup.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"May 2, 2026", time:"9:05 AM",
        body:"Got it, thanks — we'll process this by the due date.",
        attachments:[], badges:[] },
      // Dunning reminder 1 — Postmark dunning, engagement data available
      { id:"e2", dir:"out", entity:"dunning", entityLabel:"Dunning Reminder",
        from:{name:"Dunning Reminder",email:"billing@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:"opened"}], cc:[],
        date:"May 25, 2026", time:"8:00 AM",
        body:"Hi Dana,\n\nJust a reminder that invoice INV-2241 for $10,890 is due in one week on Jun 1. Please let us know if you have any questions.\n\nGeneral Catalyst",
        attachments:[], badges:["opened"] },
      // Priya's personal follow-up — merchant email, NOT via Postmark, no engagement data
      { id:"e_priya", dir:"out", entity:"merchant",
        from:{name:"Priya Sharma",email:"priya@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:null}], cc:[],
        date:"May 29, 2026", time:"3:20 PM",
        body:"Hi Dana,\n\nJust wanted to follow up personally — let me know if there's anything blocking payment on INV-2241. Happy to hop on a quick call.\n\nPriya",
        attachments:[], badges:[] },
      // Dana's thanks for the contact-update turnaround — inbound, no engagement data
      { id:"e_dana_thanks", dir:"in", entity:"customer",
        from:{name:"Dana Reed",email:"finance@meridiangroup.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"May 30, 2026", time:"10:20 AM",
        body:"Thanks for following up, Priya — this is still with our AP team, chasing it now.",
        attachments:[], badges:[] },
      // Dunning reminder 2 — Postmark dunning, engagement data available
      { id:"e2b", dir:"out", entity:"dunning", entityLabel:"Dunning Reminder",
        from:{name:"Dunning Reminder",email:"billing@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:"opened"}], cc:[],
        date:"Jun 2, 2026", time:"8:05 AM",
        body:"Hi Dana,\n\nInvoice INV-2241 for $10,890 was due yesterday and remains unpaid. Please remit at your earliest convenience or reach out if you need assistance.\n\nGeneral Catalyst",
        attachments:[], badges:["opened","clicked"] },
      // Dana email 1 — billing contact request
      { id:"e3a", dir:"in", entity:"customer",
        from:{name:"Dana Reed",email:"finance@meridiangroup.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"Jun 4, 2026", time:"2:14 PM",
        body:"Hi,\n\nPlease update our billing contact on file to ap@meridiangroup.com going forward. All invoices and correspondence should go there.\n\nThanks,\nDana",
        attachments:[], badges:[] },
      // Dana email 2 — W-9 request (follow-up on same thread a few minutes later)
      { id:"e3b", dir:"in", entity:"customer",
        from:{name:"Dana Reed",email:"finance@meridiangroup.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"Jun 4, 2026", time:"2:18 PM",
        body:"Also — before we can process payment we'll need a signed W-9 from your company. Can you send that over as well?\n\nDana",
        attachments:[], badges:[] },
    ],
    agentReplyDraft:"Hi Dana,\n\nThanks for flagging both. The signed W-9 is attached, and I've also updated the billing contact to ap@meridiangroup.com as requested.\n\nA fresh copy of INV-2241 is attached as well. Let me know if anything else is needed.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
  },
];

// Northwind Traders — demo scenario: ONE inbound email causes TWO proposed actions (both
// actions cite the same cause), one auto-executed (contact update), one pending review
// (send email). Meridian above is untouched; this is purely additive.
const THREADS_NORTHWIND = [
  { id:"nw_t1", subject:"INV-3102: billing contact + resend",
    emails:[
      { id:"nw_e1", dir:"out", entity:"system", entityLabel:"Invoice Sent",
        from:{name:"Invoice Sent",email:"billing@generalcatalyst.com"},
        to:[{name:"Tom Reilly",email:"finance@northwindtraders.com",badge:"opened"}], cc:[],
        date:"May 15, 2026", time:"9:00 AM",
        body:"Hi Tom,\n\nYour invoice INV-3102 for $28,100 is attached. Payment is due Jun 1, 2026. Please use the link below to pay securely online.\n\nThanks,\nGeneral Catalyst",
        attachments:[{name:"INV-3102.pdf",type:"PDF"}], badges:["opened"] },
      // The single trigger email — both proposed actions below cite this same email as cause.
      { id:"nw_e2", dir:"in", entity:"customer",
        from:{name:"Tom Reilly",email:"finance@northwindtraders.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"Jun 5, 2026", time:"11:20 AM",
        body:"Hi,\n\nCould you please update our billing contact to ap@northwindtraders.com going forward? Also, I can't find the original INV-3102 anywhere on our end — would you mind resending it?\n\nThanks,\nTom",
        attachments:[], badges:[] },
    ],
    agentReplyDraft:"Hi Tom,\n\nHappy to help. I've updated the billing contact to ap@northwindtraders.com, and a fresh copy of INV-3102 is attached as well.\n\nLet me know if there's anything else you need.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
  },
];

const SCENARIO_NORTHWIND = {
  customer: "Northwind Traders",
  agentSummary: [
    "Tom Reilly asked to update the billing contact to **ap@northwindtraders.com** and resend INV-3102, which he can't locate — no dispute, just a routine ask.",
    "Contact update already auto-executed per policy; the resend + reply just needs a look, as outbound email always does.",
    "INV-3102 (**$28,100**), 35 days overdue, is the oldest and largest of Northwind's 3 open invoices — clearing Tom's blocker is the priority.",
  ],
  invoices: [
    { num:"INV-3102", due:"Jun 1, 2026",  amount:28100, od:35, status:"Overdue" },
    { num:"INV-3110", due:"Jun 20, 2026", amount:9200,  od:0,  status:"Sent" },
    { num:"INV-3125", due:"Jul 5, 2026",  amount:5000,  od:0,  status:"Sent" },
  ],
  events: [
    { kind:"invoice_aged",   cat:"system", date:"May 2, 2026",  time:"12:00 AM", text:"INV-3102 crossed 30 days past due — $28,100", agent:false },
    { kind:"payment_failed", cat:"system", date:"May 28, 2026", time:"2:15 PM",  text:"Payment failed — $28,100 on INV-3102 (R01 insufficient funds)", agent:false },
    { kind:"dunning_sent",   cat:"system", date:"Jun 2, 2026",  time:"8:00 AM",  text:"Dunning reminder 1 of 4 sent automatically to finance@northwindtraders.com", agent:false },
  ],
  scheduled: [
    { type:"agent_task", id:"nw_st1", date:"Jun 12, 2026", time:"9:00 AM",
      prompt:"Check if INV-3102 has been paid following the resend. If not, send a follow-up." },
  ],
  // Both proposed actions cite the same email — the point of this scenario.
  newEvents: [
    { type:"email", id:"nw_e2" },
  ],
  proposed: [
    { kind:"update_contacts", desc:"Update primary billing contact → ap@northwindtraders.com", editableContact:"ap@northwindtraders.com",
      causes:[{ type:"email", id:"nw_e2" }] },
    { kind:"send_email", desc:"Reply to Tom Reilly with resent INV-3102, confirm billing contact update", invoice:"INV-3102",
      causes:[{ type:"email", id:"nw_e2" }],
      attachments:[{name:"INV-3102.pdf"}],
      draft:{ to:"finance@northwindtraders.com", cc:"ap@northwindtraders.com", subject:"Re: INV-3102: billing contact + resend",
        body:"Hi Tom,\n\nHappy to help. I've updated the billing contact to ap@northwindtraders.com, and a fresh copy of INV-3102 is attached as well.\n\nLet me know if there's anything else you need.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
        attachments:[{name:"INV-3102.pdf"}] },
    },
  ],
  // Pre-seeds actionState on load: action 0 (contact update) already auto-executed;
  // action 1 (send email) starts untouched, pending review.
  initialActionState: { 0: "auto" },
};

// Mutable — reassigned on navigation into a customer's detail page. Default = Meridian.
let SCENARIO = SCENARIO_MERIDIAN;
let THREADS = THREADS_MERIDIAN;
const SCENARIOS_BY_ID = {
  meridian:  { scenario: SCENARIO_MERIDIAN,  threads: THREADS_MERIDIAN },
  northwind: { scenario: SCENARIO_NORTHWIND, threads: THREADS_NORTHWIND },
};

// ============================================================
//  ROUTING STATE
// ============================================================
let view = "inbox";  // "inbox" | "detail" | "customer" | "billing"
let filterOpen = false;
let filterSubmenu = null;   // which filter type's value-list is showing in the Add-filter dropdown, if any
let activeFilters = [{ type:"status", value:"review", label:"Status", display:"Needs Review" }]; // default: worklist opens scoped to what needs a look
let colConfigOpen = false;
let inboxSearchQuery = "";
let inboxPage = 1;
const INBOX_PAGE_SIZE = 25;
let inboxSort = { key:"overdue", dir:"desc" }; // default: highest total overdue first, alongside the default Needs Review filter
let visibleInboxCols = new Set(INBOX_COLUMNS.map(c=>c.key)); // all columns visible by default
let drawerThreadId = null;       // thread shown in the right-side drawer (null = closed)
let drawerOpenEmails = new Set(); // which emails are expanded in the drawer (Gmail-style)
let drawerEditing = false;        // is the agent draft expanded into the editable composer in the drawer?
let drawerEditActionIdx = null;   // which proposed action's draft the drawer composer edits
let drawerDeliveryOpen = new Set(); // which sent emails have their per-recipient delivery details expanded
let activeTab = "actions";
// detail state
let actionState = {};
let editingCard = null;
let editValues = {};
let expandedCard = null;
let threadExpanded = false;
// AI draft refinement (Gmail-style "describe your change")
let draftHistory = {};   // actionIdx -> [previous body strings]  (undo stack)
let draftRedo = {};      // actionIdx -> [body strings]           (redo stack)
let aiGenerating = false;
// activity state
let selectedEmailId = null;
let threadOpenEmails = new Set();
let expandedHeaders = new Set();
let showBcc = false;
let attachPickerOpen = false;
let agentEscalated = false;
let agentPaused = false;
let activityFilter = "all";     // "all" | "email" — Activity tab
// scheduled tab state
let editingTask = null;       // task id being edited
let deletedTasks = new Set(); // task ids deleted this session
let recipientPills = {}; // {actionIdx: {to:[...], cc:[...]}}
let openNewEvents = new Set(); // which new-event email IDs are expanded

const AVAILABLE_ATTACHMENTS = [
  { name:"W-9_GeneralCatalyst.pdf", type:"PDF" },
  { name:"INV-2241.pdf", type:"PDF" },
  { name:"Contract_GC_Meridian_2026.pdf", type:"PDF" },
  { name:"Statement_of_Account_Jun2026.pdf", type:"PDF" },
];
let selectedAttachments = {};

// ============================================================
//  NAV
// ============================================================
let prevView = "inbox"; // to return from detail back to correct parent
let railCollapsed = false;
let navOpen = new Set(["invoicing"]); // which expandable sections are open

// Nav structure mirrors the Tabs/Balance left nav. `act` marks items wired to a real view.
const NAV = [
  {id:"overview",   icon:"overview",   label:"Overview"},
  {id:"customers",  icon:"customers",  label:"Customers", act:"customer"},
  {id:"contracts",  icon:"contracts",  label:"Contracts", subs:[
      {label:"All contracts"},{label:"Agent calibration"},{label:"Renewals"}]},
  {id:"invoicing",  icon:"invoicing",  label:"Invoicing", subs:[
      {label:"Billing", act:"billing"},
      {label:"Collections Agent", act:"inbox", badge:true},
      {label:"Credit memos"},
      {label:"Invoice Kanban"}]},
  {id:"usage",      icon:"usage",      label:"Usage", subs:[
      {label:"Events"},{label:"Usage Files"}]},
  {id:"revenue",    icon:"revenue",    label:"Revenue", subs:[
      {label:"Overview"},{label:"ARR waterfall"},{label:"Revenue recognition"},{label:"Close management"}]},
  {id:"reporting",  icon:"reporting",  label:"Reporting", subs:[
      {label:"Aging"},{label:"Cash forecast"},{label:"Days-to-pay"}]},
  {id:"data",       icon:"data",       label:"Data", subs:[{label:"Payments"}]},
  {id:"developers", icon:"developers", label:"Developers"},
];

function viewForAct(act){ return (act==="customer"&&view==="customer")||(act==="billing"&&view==="billing")||(act==="inbox"&&(view==="inbox"||view==="detail")); }

function navItemHTML(s, needsReview){
  const isParent = !!s.subs;
  const open = navOpen.has(s.id);
  const active = s.act && viewForAct(s.act) ? " active" : "";
  const chev = isParent ? `<span class="ni-chev${open?" open":""}">${NAV_ICON.chev}</span>` : "";
  const attrs = `${isParent?`data-nav-toggle="${s.id}"`:""} ${s.act?`data-nav-go="${s.act}"`:""}`;
  const badgedSub = isParent && s.subs.some(x=>x.badge);
  const dot = (needsReview>0 && (badgedSub || (!isParent && s.badge))) ? '<span class="ni-dot"></span>' : "";
  // show the count on the parent row too when it's collapsed, so a nested badged sub (e.g.
  // Invoicing → Collections Agent) still surfaces its review count without expanding.
  const topBadge = (needsReview>0 && ((!isParent && s.badge) || (badgedSub && !open))) ? `<span class="nav-badge">${needsReview}</span>` : "";
  let out = `<div class="nav-item${isParent?" parent":""}${open?" open":""}${active}" ${attrs} title="${esc(s.label)}">
      <span class="ni-ic">${NAV_ICON[s.icon]}${dot}</span><span class="ni-label">${esc(s.label)}</span>${topBadge}${chev}
    </div>`;
  if(isParent && open){
    out += s.subs.map(sub=>{
      const sa = sub.act && viewForAct(sub.act) ? " active" : "";
      const b = sub.badge && needsReview>0 ? `<span class="nav-badge">${needsReview}</span>` : "";
      return `<div class="nav-sub${sa}" ${sub.act?`data-nav-go="${sub.act}"`:""}>${esc(sub.label)}${b}</div>`;
    }).join("");
  }
  // wrap an expanded section (parent + its sub-items) in a tinted band
  if(isParent) return `<div class="nav-group${open?" open":""}">${out}</div>`;
  return out;
}

function renderNav(){
  const rail = $("rail");
  if(rail) rail.classList.toggle("collapsed", railCollapsed);
  const appEl = document.querySelector(".app");
  if(appEl) appEl.classList.toggle("rail-collapsed", railCollapsed);

  const needsReview = WORKLIST.filter(r=>r.planStatus==="review").length;
  $("rail-nav").innerHTML = NAV.map(s=>navItemHTML(s, needsReview)).join("");

  // footer: integrations / settings / user / agent
  const foot = $("rail-foot");
  if(foot){
    foot.innerHTML = `
      <div class="nav-item" title="Integrations"><span class="ni-ic">${NAV_ICON.integrations}</span><span class="ni-label">Integrations</span></div>
      <div class="nav-item" title="Settings"><span class="ni-ic">${NAV_ICON.settings}</span><span class="ni-label">Settings</span></div>
      <div class="nav-item" title="Marshall Morrison"><span class="ni-ic">${NAV_ICON.userc}</span><span class="ni-label">Marshall Morrison</span><span class="ni-trail">${NAV_ICON.logout}</span></div>`;
  }

  // wiring (applies to both nav + foot)
  document.querySelectorAll("[data-nav-toggle]").forEach(el=>el.onclick=()=>{
    const id = el.dataset.navToggle;
    if(railCollapsed) railCollapsed = false;            // expand rail when opening a section from collapsed
    if(navOpen.has(id)) navOpen.delete(id); else navOpen.add(id);
    renderNav();
  });
  document.querySelectorAll("[data-nav-go]").forEach(el=>el.onclick=()=>{
    view = el.dataset.navGo; render();
  });

  const collapse = $("navCollapse");
  if(collapse){
    collapse.innerHTML = NAV_ICON.collapse;
    collapse.title = railCollapsed ? "Expand" : "Collapse";
    collapse.onclick = ()=>{ railCollapsed=!railCollapsed; renderNav(); };
  }
}

// ============================================================
//  CUSTOMER PAGE
// ============================================================
function renderCustomer(){
  const link = (title, desc, isAgent=false) =>
    `<div class="cust-link">
      <span class="${isAgent?"cl-title agent":"cl-title"}" ${isAgent?'data-nav-to-detail':""}>${title}</span>
      <p>${desc}</p>
    </div>`;
  return `
    <div class="cust-page">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px">
        <div>
          <div class="cust-title">${esc(SCENARIO.customer)}</div>
          <div class="cust-meta">CREATED JAN 1, 2026 BY QBO &nbsp;|&nbsp; <a>EXTERNAL ID: MG-4412</a> &nbsp;|&nbsp; EXISTS IN QBO</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn" style="padding:7px 14px">↑ Upload contract</button>
          <button class="btn" style="padding:7px 14px">Settings &amp; more</button>
        </div>
      </div>

      <div class="cust-section">
        <div class="cust-section-title">Billing &amp; revenue — adjust line items and modify schedules</div>
        <div class="cust-grid">
          ${link("Billing terms","Billable terms and revenue recognition")}
          ${link("Credit Memos (0)","View credit memos for this customer")}
          ${link("Invoices (1)","Current service period invoices, historical invoices")}
          ${link("Contracts (1)","Contracts, amendments, MSAs, renewals")}
          ${link("Collections Agent","Collections agent status, proposed actions, activity log", true)}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        <div class="cust-section">
          <div class="cust-section-title">Obligations &amp; relationship management</div>
          <div>
            ${link("Key terms","Contract agreements that are not billed upon")}
            ${link("Renewal","AI-driven insights — Renewal types, dates, values and full audit logs")}
            ${link("Notes (0)","Store notes that help manage the relationship")}
          </div>
        </div>
        <div class="cust-section">
          <div class="cust-section-title">Profile — general invoice information</div>
          <div>
            ${link("Business information","Main contact name and email, additional contacts, billing address")}
            ${link("Additional fields","Department ID, Project name, Sales rep, etc.")}
            ${link("Taxes","Tax exemption status, VAT number, EIN")}
          </div>
        </div>
      </div>
    </div>`;
}

// ============================================================
//  BILLING / INVOICE PAGE
// ============================================================
function renderBilling(){
  const field = (label, val) =>
    `<div class="inv-field"><span class="if-label">${label}</span><span class="if-val">${val}</span></div>`;

  return `
    <div class="inv-page">
      <div class="inv-page-notice">Accounting period closed as of <strong>May 31, 2026</strong></div>

      <div style="display:flex;align-items:flex-start;margin-bottom:20px">
        <div style="flex:1">
          <div class="inv-page-title">
            <h1>Invoice #INV-2241</h1>
            <span class="inv-status-chip overdue">Overdue</span>
          </div>
          <div class="inv-page-id">⎘ INV-2241</div>
        </div>
        <div class="inv-page-actions">
          <button class="btn" id="collAgentBtn" style="padding:7px 14px;font-size:13px;display:inline-flex;align-items:center;gap:6px">Collections Agent${SCENARIO.proposed.length>0?`<span style="display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;border-radius:9px;background:#e8333a;color:#fff;font-size:11px;font-weight:700;padding:0 4px">${SCENARIO.proposed.length}</span>`:""}</button>
          <button class="btn" style="padding:7px 12px;font-size:15px">⋯</button>
          <button class="btn" style="padding:7px 14px;font-size:13px">Activity Feed</button>
          <button class="btn" style="padding:7px 14px;font-size:13px">✉ Send reminder</button>
          <button class="btn btn-primary" style="padding:7px 16px;font-size:13px">⊞ Record payment</button>
        </div>
      </div>

      <div class="inv-section">
        <h2>Summary</h2>
        <div style="display:flex;gap:0">
          <div style="flex:1">
            ${field("Customer","<a>Meridian Group</a>")}
            ${field("Invoice number","INV-2241")}
            ${field("Invoice date","May 16, 2026")}
            ${field("Net terms","Net 30")}
            ${field("Send date","May 16, 2026")}
            ${field("Due date","Jun 1, 2026")}
          </div>
          <div class="inv-divider"></div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700;margin-bottom:10px;color:var(--ink)">Billing info</div>
            ${field("Billing email(s)","finance@meridiangroup.com")}
            ${field("Address","Meridian Group, Inc.<br>500 Howard St<br>San Francisco, CA 94105<br>US")}
            ${field("CC email(s)","ap@meridiangroup.com")}
            <div style="margin-top:16px;font-size:14px;font-weight:700;margin-bottom:10px;color:var(--ink)">Shipping info</div>
            ${field("Shipping address","—")}
          </div>
        </div>
      </div>

      <div class="inv-section">
        <h2>Invoice line items</h2>
        <table class="inv-items-table">
          <thead>
            <tr>
              <th style="width:35%">Name</th>
              <th style="width:15%">Integration item</th>
              <th>Service period</th>
              <th class="r" style="width:60px">Qty</th>
              <th class="r" style="width:100px">Unit price</th>
              <th class="r" style="width:110px">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style="font-weight:600">Platform subscription — May 2026</div>
                <div style="font-size:12px;color:var(--helper);margin-top:2px">Recurring</div>
              </td>
              <td style="color:var(--helper)">SaaS</td>
              <td style="color:var(--helper)">May 16, 2026 – Jun 15, 2026</td>
              <td class="r">1</td>
              <td class="r">$10,890.00</td>
              <td class="r">$10,890.00</td>
            </tr>
          </tbody>
        </table>
        <div class="inv-totals">
          <span class="it-label">Subtotal:</span><span class="it-val">$10,890.00</span>
          <span class="it-label">Tax:</span><span class="it-val">$0.00</span>
          <span class="it-label it-total">Total:</span><span class="it-val it-total">$10,890.00</span>
        </div>
      </div>
    </div>`;
}

// ============================================================
//  INBOX VIEW
// ============================================================
function fmtMoney(n){ return "$"+n.toLocaleString("en-US",{minimumFractionDigits:2}); }

// Cell renderers keyed by column — used by both the header (label) and body (per-row markup).
function inboxCell(key, r){
  const statusLabel = {review:"Needs Review",executed:"Executed",rejected:"Rejected"};
  switch(key){
    case "customer": {
      const flagIcon = `<span style="display:inline-block;width:13px;height:13px;margin-right:6px;vertical-align:middle;opacity:${r.escalated?1:.2}">${r.escalated?ICON.flagFill:ICON.flagOut}</span>`;
      const pausedBadge = r.paused ? `<span class="paused-chip">Agent Paused</span>` : "";
      return `<td style="white-space:nowrap">${flagIcon}<span class="cust-name">${esc(r.customer)}</span>${pausedBadge}</td>`;
    }
    case "invoices":
      return `<td>${r.invoices.map(i=>`<span class="inv-tag">${esc(i)}</span>`).join("")}</td>`;
    case "outstanding":
      return `<td class="r"><span class="cell-amt">${fmtMoney(r.outstandingAmt||r.overdueAmt)}</span></td>`;
    case "overdue":
      return `<td class="r">${r.overdueAmt>0 ? `<span class="overdue-amt">${fmtMoney(r.overdueAmt)}</span>` : `<span style="color:var(--helper)">—</span>`}</td>`;
    case "oldestOverdue":
      return `<td class="r">${r.mostOverdueDays!=null ? `<span class="cell-amt">${r.mostOverdueDays}d</span>` : `<span style="color:var(--helper)">—</span>`}</td>`;
    case "event":
      return `<td style="font-size:12.5px;color:var(--helper);width:240px;min-width:200px;line-height:1.45">${esc(r.eventSummary)}</td>`;
    case "actions": {
      const actLine = r.proposedActions.length
        ? `<ul class="act-bullets">${r.proposedActions.map(a=>`<li>${esc(a)}</li>`).join("")}</ul>`
        : `<span style="color:var(--helper)">—</span>`;
      return `<td>${actLine}</td>`;
    }
    case "status":
      return `<td><span class="plan-chip ${r.planStatus}">${statusLabel[r.planStatus]||r.planStatus}</span></td>`;
    default: return "<td></td>";
  }
}

function renderInbox(){
  const needsReviewCount = WORKLIST.filter(r=>r.planStatus==="review").length;
  const cols = INBOX_COLUMNS.filter(c=>c.pinned || visibleInboxCols.has(c.key));
  const q = inboxSearchQuery.trim().toLowerCase();
  const searched = q ? WORKLIST.filter(r=>r.customer.toLowerCase().includes(q)) : WORKLIST;
  const filteredRows = sortRows(searched.filter(r=>activeFilters.every(f=>filterMatches(r, f))));

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / INBOX_PAGE_SIZE));
  inboxPage = Math.min(Math.max(1, inboxPage), totalPages);
  const pageStart = (inboxPage - 1) * INBOX_PAGE_SIZE;
  const pageRows = filteredRows.slice(pageStart, pageStart + INBOX_PAGE_SIZE);

  const rows = pageRows.length ? pageRows.map(r=>{
      // Only customers with a real detail-page scenario behind them are clickable.
      const clickable = !!SCENARIOS_BY_ID[r.id];
      return `<tr ${clickable?`data-customer="${r.id}" class="clickable"`:`class="row-inert"`} style="${r.escalated?"box-shadow:inset 3px 0 0 var(--warning)":""}">
      ${cols.map(c=>inboxCell(c.key, r)).join("")}
    </tr>`;
    }).join("") : `<tr><td colspan="${cols.length}" style="padding:28px;text-align:center;color:var(--helper)">No customers match ${activeFilters.length?"the current filters":`"${esc(inboxSearchQuery)}"`}</td></tr>`;

  const headerCells = cols.map(c=>{
    const active = c.sortable && inboxSort.key===c.key;
    const arrow = active ? (inboxSort.dir==="asc"?"↑":"↓") : "↕";
    return `<th class="${c.align==="r"?"r ":""}${c.sortable?"sortable":""}${active?" sorted":""}" ${c.sortable?`data-sort-key="${c.key}"`:""}>${esc(c.label)}${c.sortable?`<span class="th-sort">${arrow}</span>`:""}</th>`;
  }).join("");

  // "Add filter" — two-step: pick a dimension, then a value. Excludes Event, Agent actions,
  // Customer, and Open invoices — those aren't things you narrow the worklist by, they're
  // what you're triaging.
  const filterDropdown = filterOpen ? (
    filterSubmenu
      ? `<div class="filter-dropdown">
          <div class="filter-option filter-back" data-filter-back="1"><span>‹ ${esc(FILTER_DEFS[filterSubmenu].label)}</span></div>
          ${FILTER_DEFS[filterSubmenu].options.map(o=>`<div class="filter-option" data-filter-value="${filterSubmenu}:${o.value}:${esc(o.display)}"><span>${esc(o.display)}</span></div>`).join("")}
        </div>`
      : `<div class="filter-dropdown">
          ${Object.entries(FILTER_DEFS).map(([key,def])=>`<div class="filter-option" data-filter-type="${key}"><span>${esc(def.label)}</span><span class="fo-chev">›</span></div>`).join("")}
        </div>`
  ) : "";

  const chipsHtml = activeFilters.map((f,i)=>`<span class="filter-chip">${esc(f.label)} <b>${esc(f.display)}</b><span class="fc-x" data-remove-filter="${i}">×</span></span>`).join("");

  const colConfigDropdown = colConfigOpen ? `<div class="filter-dropdown col-config-dropdown">
    <div class="col-config-title">Configure columns</div>
    ${INBOX_COLUMNS.filter(c=>!c.pinned).map(c=>`
      <label class="col-config-item">
        <input type="checkbox" data-toggle-col="${c.key}" ${visibleInboxCols.has(c.key)?"checked":""}>
        <span>${esc(c.label)}</span>
      </label>`).join("")}
  </div>` : "";

  const rangeEnd = filteredRows.length ? Math.min(pageStart + INBOX_PAGE_SIZE, filteredRows.length) : 0;
  const pagination = `<div class="pagination-row">
    <span class="pagination-count">${filteredRows.length ? `${pageStart+1}–${rangeEnd}` : "0"} of ${filteredRows.length}</span>
    <div class="pagination-controls">
      <button class="btn-page" data-page-nav="prev" ${inboxPage<=1?"disabled":""}>‹ Prev</button>
      <span class="pagination-of">Page ${inboxPage} of ${totalPages}</span>
      <button class="btn-page" data-page-nav="next" ${inboxPage>=totalPages?"disabled":""}>Next ›</button>
    </div>
  </div>`;

  return `
    <div class="inbox-wrap">
      <div class="inbox-head">
        <h1>Collections Agent</h1>
      </div>
      <div class="agent-voice">
        ${agentClusterIcon()}
        <span class="av-text">${needsReviewCount>0
          ? `<strong>${needsReviewCount}</strong> action${needsReviewCount===1?"":"s"} ready for your review`
          : `Nothing needs your review right now`}</span>
      </div>
      <div class="filter-row">
        <div style="position:relative;display:inline-block">
          <button class="filter-btn" id="filterBtn">☰ Add filter</button>
          ${filterDropdown}
        </div>
        ${chipsHtml ? `<div class="filter-chips">${chipsHtml}</div>` : ""}
        <span class="sp"></span>
        <div class="inbox-search${inboxSearchQuery?" has-text":""}">
          <span class="is-icon">${LU('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>')}</span>
          <input type="text" id="inboxSearchInput" placeholder="Search in results" value="${esc(inboxSearchQuery)}">
          <button class="is-clear" id="inboxSearchClear" aria-label="Clear search" tabindex="-1"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg></button>
        </div>
        <span class="tbl-divider" aria-hidden="true"></span>
        <div style="position:relative;display:inline-block">
          <button class="col-btn${colConfigOpen?" open":""}" id="colConfigBtn" aria-label="Toggle column visibility">${LU('<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>')}<span class="icon-tip">Columns</span></button>
          ${colConfigDropdown}
        </div>
      </div>
      <div class="inbox-table-wrap">
      <table class="inbox-table">
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      </div>
      ${pagination}
    </div>`;
}

// ============================================================
//  DETAIL — helpers
// ============================================================
function threadForEmailId(id){ return THREADS.find(t=>t.emails.some(e=>e.id===id))||null; }
function toMs(d,ti){ return new Date(`${d} ${ti||"12:00 AM"}`).getTime()||0; }

function activityItems(){
  const emails = THREADS.flatMap(t=>t.emails.map(e=>({type:"email",...e,threadId:t.id,threadSubject:t.subject})));
  const events = (SCENARIO.events||[]).map(e=>({type:"event",...e}));
  return [...emails,...events].sort((a,b)=>toMs(b.date,b.time)-toMs(a.date,a.time));
}

function openThread(emailId){
  selectedEmailId = emailId;
  threadOpenEmails = new Set([emailId]);
}
function deepLinkToThread(threadId){
  activeTab = "activity";
  const t = THREADS.find(t=>t.id===threadId); if(!t) return;
  const target = [...t.emails].reverse().find(e=>e.dir==="in")||t.emails[t.emails.length-1];
  openThread(target.id);
}

// ----- Thread drawer (right slide-in; Gmail-style stacked thread) -----
function openThreadDrawer(threadId, focusId, editing){
  drawerThreadId = threadId;
  drawerEditing = !!editing;
  drawerDeliveryOpen = new Set();
  const t = THREADS.find(t=>t.id===threadId);
  const latest = t ? [...t.emails].sort((a,b)=>toMs(b.date,b.time)-toMs(a.date,a.time))[0] : null;
  drawerOpenEmails = new Set([focusId || (latest && latest.id)].filter(Boolean));
  renderEmailDrawer();
}
// router used from the Actions "Open email" causes (single email id) → opens its thread, that email expanded
function openEmailDrawer(emailId){
  const t = THREADS.find(t=>t.emails.some(e=>e.id===emailId));
  if(t) openThreadDrawer(t.id, emailId);
}
// No real files behind these attachments — opens a placeholder tab so the click still reads
// as "this goes somewhere" rather than a dead decorative chip.
function openMockAttachment(name){
  const w = window.open("", "_blank");
  if(!w) return;
  w.document.title = name;
  w.document.body.style.cssText = "margin:0;height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;font-size:15px;color:#75786f;background:#f3f3f2;";
  w.document.body.textContent = `Preview unavailable in this prototype — ${name}`;
}
// open the thread drawer straight into edit mode for a proposed email action (Edit-in-thread)
function openDraftEditorInDrawer(actionIdx){
  const a = SCENARIO.proposed[actionIdx];
  expandedCard = null;
  drawerEditActionIdx = actionIdx;
  let threadId = (THREADS[0] && THREADS[0].id) || "t1", focus = null;
  // When an action cites more than one event, its most immediate/recent cause is last in the
  // array — that's the one to jump to (see primaryCause() below).
  const primary = a && primaryCause(a);
  if(primary && primary.type==="email"){
    const t = THREADS.find(t=>t.emails.some(e=>e.id===primary.id));
    if(t){ threadId = t.id; focus = primary.id; }
  }
  openThreadDrawer(threadId, focus, true);
  // Deep-link straight into the draft input, not just the thread — no hunting for it.
  const ta = document.querySelector("#emailDrawer .cmp-body");
  if(ta){ ta.focus(); const len = ta.value.length; ta.setSelectionRange(len, len); ta.scrollIntoView({block:"center"}); }
}
function closeEmailDrawer(){ drawerThreadId = null; drawerEditing = false; drawerEditActionIdx = null; renderEmailDrawer(); }

// ----- Per-recipient delivery & engagement (Postmark-tracked outbound only) -----
function isTracked(em){ return ["system","dunning","agent"].includes(em.entity); }
// normalize a recipient into {delivered, opened, clicked, bounced} using explicit eng or email-level badges
function recipEng(em, r){
  if(r.eng) return r.eng;
  const has = s=>(em.badges||[]).includes(s);
  if(has("bounced")) return { bounced:true };
  const stamp = `${em.date} · ${em.time||""}`;
  return { delivered: stamp, opened: has("opened")?stamp:null, clicked: has("clicked")?stamp:null };
}
function deliverySummary(em){
  const recips = [...em.to, ...(em.cc||[])];
  const bounced = recips.filter(r=>recipEng(em,r).bounced).length;
  const delivered = recips.length - bounced;
  return { total:recips.length, delivered, bounced };
}
function renderRecipientRow(em, r){
  const e = recipEng(em, r);
  const mail   = LU('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
  const mailOpen = LU('<path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>');
  const click  = LU('<path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>');
  if(e.bounced){
    return `<div class="dr-recip"><div class="dr-email">${esc(r.email)}</div>
      <span class="dr-bounced"><span class="ic">${ICON.x}</span>Email bounced</span></div>`;
  }
  const line = (icon,label,ts)=>`<div class="dr-line ${ts?"on":"off"}"><span class="dr-ic">${icon}</span><span class="dr-label">${label}</span><span class="dr-ts">${ts?esc(ts):"—"}</span></div>`;
  return `<div class="dr-recip">
    <div class="dr-email">${esc(r.email)}</div>
    ${line(mail,"Delivered",e.delivered)}
    ${line(mailOpen,"Opened",e.opened)}
    ${line(click,"Link clicked",e.clicked)}
  </div>`;
}
function renderDeliveryDetails(em){
  if(!isTracked(em)) return "";
  const open = drawerDeliveryOpen.has(em.id);
  const s = deliverySummary(em);
  const chev = LU('<path d="m6 9 6 6 6-6"/>');
  const summaryText = `Delivered to ${s.delivered} of ${s.total}${s.bounced?` · <span class="dr-bounce-count">${s.bounced} bounced</span>`:""}`;
  if(!open){
    return `<div class="delivery-block">
      <button class="dr-toggle" data-delivery-toggle="${em.id}">
        <span class="dr-chev">${chev}</span>
        <span class="dr-summary">${summaryText}</span>
      </button>
    </div>`;
  }
  const ccCount = (em.cc||[]).length;
  const toRows = em.to.map(r=>renderRecipientRow(em,r)).join("");
  const ccRows = (em.cc||[]).map(r=>renderRecipientRow(em,r)).join("");
  return `<div class="delivery-block open">
    <button class="dr-toggle" data-delivery-toggle="${em.id}">
      <span class="dr-chev open">${chev}</span>
      <span class="dr-summary">${summaryText}</span>
    </button>
    <div class="dr-detail">
      <div class="dr-section">${em.to.length} Recipient${em.to.length>1?"s":""}</div>
      ${toRows}
      ${ccCount?`<div class="dr-section">${ccCount} CC${ccCount>1?"s":""}</div>${ccRows}`:""}
    </div>
  </div>`;
}
// Drawer resize — set up once, via delegation, so it survives every re-render of #emailDrawer's
// innerHTML (the handle itself is re-inserted into that markup on each render).
(function setupDrawerResize(){
  let dragging = false;
  document.addEventListener("mousedown", (e)=>{
    const handle = e.target.closest && e.target.closest(".drawer-resize-handle");
    if(!handle) return;
    dragging = true;
    handle.classList.add("dragging");
    const drawer = $("emailDrawer"); if(drawer) drawer.classList.add("resizing");
    document.body.style.userSelect = "none";
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e)=>{
    if(!dragging) return;
    const drawer = $("emailDrawer"); if(!drawer) return;
    const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 420), Math.round(window.innerWidth*0.94));
    drawer.style.width = newWidth + "px";
  });
  document.addEventListener("mouseup", ()=>{
    if(!dragging) return;
    dragging = false;
    document.body.style.userSelect = "";
    document.querySelectorAll(".drawer-resize-handle.dragging").forEach(h=>h.classList.remove("dragging"));
    const drawer = $("emailDrawer"); if(drawer) drawer.classList.remove("resizing");
  });
})();

function renderEmailDrawer(){
  const drawer = $("emailDrawer"), scrim = $("emailScrim");
  if(!drawer) return;
  if(!drawerThreadId){ drawer.classList.remove("open"); if(scrim) scrim.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); return; }
  const thread = THREADS.find(t=>t.id===drawerThreadId);
  if(!thread){ closeEmailDrawer(); return; }
  const sorted = [...thread.emails].sort((a,b)=>toMs(a.date,a.time)-toMs(b.date,b.time));

  const msgs = sorted.map(em=>{
    const open = drawerOpenEmails.has(em.id);
    const ec = entityClass(em.entity);
    const badges = (em.badges||[]).map(b=>engBadge(b)).join("");
    const avatar = `<span class="td-avatar ${ec}">${esc(initials(em.from.name))}</span>`;
    if(!open){
      const preview = em.body.replace(/\s+/g," ").trim();
      return `<div class="td-msg collapsed" data-drawer-expand="${em.id}">
        ${avatar}
        <span class="td-who">${esc(em.from.name)}</span>
        <span class="td-pre">${esc(preview)}</span>
        <span class="td-date">${esc(em.date)}</span>
      </div>`;
    }
    const atts = (em.attachments||[]).map(att=>`<span class="attach-chip" data-open-attachment="${esc(att.name)}">📎 ${esc(att.name)}</span>`).join("");
    return `<div class="td-msg open">
      <div class="td-msg-head" data-drawer-expand="${em.id}">
        ${avatar}
        <div class="td-msg-meta">
          <div class="td-msg-line1"><span class="td-who">${esc(em.from.name)} <span class="td-who-email">&lt;${esc(em.from.email)}&gt;</span></span><span class="td-date">${esc(em.date)} · ${esc(em.time||"")}</span></div>
          <div class="td-msg-to">to ${em.to.map(t=>esc(t.name)).join(", ")}${(em.cc||[]).length?`, +${em.cc.length} cc`:""}</div>
        </div>
      </div>
      <div class="td-msg-body">${esc(em.body)}</div>
      ${atts?`<div class="ed-attachments">${atts}</div>`:""}
      ${isTracked(em) ? renderDeliveryDetails(em) : (badges?`<div class="td-msg-badges">${badges}</div>`:"")}
    </div>`;
  }).join("");

  // which proposed action this thread's draft belongs to
  const editIdx = drawerEditActionIdx!=null ? drawerEditActionIdx : SCENARIO.proposed.findIndex(a=>a.kind==="send_email");
  const editAction = editIdx>=0 ? SCENARIO.proposed[editIdx] : null;
  const draftDone = editAction && actionState[editIdx];

  let draft = "";
  if(thread.agentReplyDraft){
    if(drawerEditing && editAction && editAction.draft && !draftDone){
      // editable composer, inline — same component + state as the Actions-tab card
      draft = `<div class="td-connector"></div>
        <div class="td-draft editing">
          <div class="td-draft-head"><span class="td-avatar agent">${initials("Collections Agent")}</span><span class="td-draft-name">Collections Agent</span><span class="td-draft-tag">Editing draft reply</span></div>
          ${renderDraftEditor(editAction.draft, editIdx, {inDrawer:true})}
        </div>`;
    } else {
      const doneTag = draftDone ? verdictHtml(actionState[editIdx], "margin-left:auto") : "";
      const foot = draftDone ? "" : `<div class="td-draft-foot"><button class="btn btn-tertiary" data-drawer-edit>Edit</button><button class="btn btn-primary" data-drawer-send><span class="ic">${ICON.check}</span>Approve &amp; send</button></div>`;
      draft = `<div class="td-connector"></div>
        <div class="td-draft">
          <div class="td-draft-head"><span class="td-avatar agent">${initials("Collections Agent")}</span><span class="td-draft-name">Collections Agent</span><span class="td-draft-tag">Draft reply</span>${doneTag}</div>
          <div class="td-draft-body">${esc(editAction&&editAction.draft?editAction.draft.body:thread.agentReplyDraft)}</div>
          ${foot}
        </div>`;
    }
  }

  drawer.innerHTML = `
    <div class="drawer-resize-handle" title="Drag to resize"></div>
    <div class="ed-head">
      <span class="ed-subject">${esc(thread.subject)} <span class="ed-count">${sorted.length} message${sorted.length>1?"s":""}</span></span>
      <button class="ed-close" id="emailDrawerClose" title="Close">×</button>
    </div>
    <div class="ed-body">${msgs}${draft}</div>`;
  drawer.classList.add("open"); if(scrim) scrim.classList.add("open"); drawer.setAttribute("aria-hidden","false");
  $("emailDrawerClose").onclick = ()=>closeEmailDrawer();
  drawer.querySelectorAll("[data-drawer-expand]").forEach(el=>el.onclick=()=>{ const id=el.dataset.drawerExpand; if(drawerOpenEmails.has(id)) drawerOpenEmails.delete(id); else drawerOpenEmails.add(id); renderEmailDrawer(); });
  drawer.querySelectorAll("[data-open-attachment]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openMockAttachment(el.dataset.openAttachment); });
  drawer.querySelectorAll("[data-delivery-toggle]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const id=el.dataset.deliveryToggle; if(drawerDeliveryOpen.has(id)) drawerDeliveryOpen.delete(id); else drawerDeliveryOpen.add(id); renderEmailDrawer(); });
  const sendBtn = drawer.querySelector("[data-drawer-send]");
  if(sendBtn) sendBtn.onclick = ()=>{ if(editIdx>=0){ actionState[editIdx]="approved"; expandedCard=null; } closeEmailDrawer(); activeTab="actions"; render(); };
  const editBtn = drawer.querySelector("[data-drawer-edit]");
  if(editBtn) editBtn.onclick = ()=>{ drawerEditActionIdx=editIdx; drawerEditing=true; renderEmailDrawer(); };
  if(drawerEditing && editAction) wireDrawerComposer(drawer, editIdx);
}

// Bind the shared composer's controls when it lives inside the drawer (re-renders the drawer, not #panel).
function wireDrawerComposer(drawer, idx){
  const rr = ()=>renderEmailDrawer();
  drawer.querySelectorAll("[data-cancel-draft]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); drawerEditing=false; rr(); });
  drawer.querySelectorAll("[data-save-draft]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); drawerEditing=false; rr(); });
  drawer.querySelectorAll("[data-app]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); actionState[+el.dataset.app]="approved"; expandedCard=null; closeEmailDrawer(); activeTab="actions"; render(); });
  drawer.querySelectorAll("[data-rej]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); actionState[+el.dataset.rej]="rejected"; expandedCard=null; closeEmailDrawer(); activeTab="actions"; render(); });
  drawer.querySelectorAll("[data-ai-refine]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [i,type]=el.dataset.aiRefine.split(":"); const inp=drawer.querySelector(`[data-ai-input="${i}"]`); if(inp) inp.value=""; aiRefineDraft(i, type); });
  drawer.querySelectorAll("[data-ai-input]").forEach(el=>el.onkeydown=(e)=>{ if(e.key==="Enter"){ e.preventDefault(); e.stopPropagation(); if(!el.value.trim()) return; const i=el.dataset.aiInput; el.value=""; aiRefineDraft(i, null); } });
  drawer.querySelectorAll("[data-ai-submit]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const i=el.dataset.aiSubmit; const inp=drawer.querySelector(`[data-ai-input="${i}"]`); if(!inp||!inp.value.trim()) return; inp.value=""; aiRefineDraft(i, null); });
  drawer.querySelectorAll("[data-ai-focus]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); drawer.querySelector(`[data-ai-input="${el.dataset.aiFocus}"]`)?.focus(); });
  drawer.querySelectorAll("[data-ai-undo]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); aiUndoRedo(el.dataset.aiUndo, false); });
  drawer.querySelectorAll("[data-ai-redo]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); aiUndoRedo(el.dataset.aiRedo, true); });
  drawer.querySelectorAll("[data-pill-input]").forEach(el=>el.onkeydown=(e)=>{
    if(e.key===" "||e.key===","||e.key==="Enter"){ e.preventDefault();
      const val=el.value.trim().replace(/,$/,""); if(!val) return;
      const [i,field]=el.dataset.pillInput.split(":");
      if(!recipientPills[i]) recipientPills[i]={to:[],cc:[]};
      recipientPills[i][field].push(val); el.value=""; rr();
    }
  });
  drawer.querySelectorAll("[data-rm-pill]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation();
    const [i,field,email]=el.dataset.rmPill.split(":");
    if(recipientPills[i]) recipientPills[i][field]=recipientPills[i][field].filter(x=>x!==email); rr();
  });
  drawer.querySelectorAll("[data-open-picker]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); attachPickerOpen=attachPickerOpen===el.dataset.openPicker?false:el.dataset.openPicker; rr(); });
  drawer.querySelectorAll("[data-pick-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [i,name]=el.dataset.pickAttach.split(":"); if(!selectedAttachments[i]) selectedAttachments[i]=new Set(); selectedAttachments[i].add(name); attachPickerOpen=false; rr(); });
  drawer.querySelectorAll("[data-rm-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [i,name]=el.dataset.rmAttach.split(":"); if(selectedAttachments[i]) selectedAttachments[i].delete(name); rr(); });
}

// ============================================================
//  SHARED EMAIL CARD
// ============================================================
function renderEmailCard(em, opts={}){
  const ec = entityClass(em.entity);
  const label = entityLabel(ec, em.entityLabel);
  const isHeaderOpen = expandedHeaders.has(em.id);
  const toNames = em.to.map(r=>r.name||r.email).join(", ");
  const ccNames = (em.cc||[]).map(r=>r.name||r.email).join(", ");

  const headerSummary = `<span class="em-to-summary">
    to <span class="to-names">${esc(toNames)}</span>
    ${ccNames?` cc <span class="to-names">${esc(ccNames)}</span>`:""}
    <span class="em-chevron" data-toggle-header="${em.id}">▾</span>
  </span>`;

  const engGrid = isHeaderOpen ? `<div class="eng-grid">
    <table>
      <thead><tr><th class="left">Recipient</th><th>Delivered</th><th>Opened</th><th>Clicked</th><th>Bounced</th><th>Failed</th></tr></thead>
      <tbody>${em.to.map(r=>{
        const o = !!(r.badge==="opened"||em.badges?.includes("opened"));
        const c = !!em.badges?.includes("clicked");
        const b = !!em.badges?.includes("bounced");
        const f = !!em.badges?.includes("failed");
        const chk = v=>v?`<span class="eng-yes">✓</span>`:`<span class="eng-no">—</span>`;
        return `<tr><td class="left">${esc(r.name||r.email)}</td><td>${chk(true)}</td><td>${chk(o)}</td><td>${chk(c)}</td><td>${chk(b)}</td><td>${chk(f)}</td></tr>`;
      }).join("")}</tbody>
    </table>
  </div>` : "";

  const headerDetail = isHeaderOpen ? `<div class="em-header-detail">
    <div class="em-header-grid">
      <span class="hg-label">from</span><span class="hg-val"><strong>${esc(em.from.name)}</strong> &lt;${esc(em.from.email)}&gt;</span>
      <span class="hg-label">to</span><span class="hg-val">${em.to.map(r=>`${esc(r.name)} &lt;${esc(r.email)}&gt;`).join("<br>")}</span>
      ${(em.cc||[]).length?`<span class="hg-label">cc</span><span class="hg-val">${em.cc.map(r=>`${esc(r.name||"")} &lt;${esc(r.email)}&gt;`).join("<br>")}</span>`:""}
      <span class="hg-label">date</span><span class="hg-val">${esc(em.date)} · ${esc(em.time)}</span>
    </div>${engGrid}
  </div>` : "";

  const attach = (em.attachments||[]).length
    ? `<div class="em-card-attach">${em.attachments.map(a=>`<span class="attach-pill">📎 ${esc(a.name)} · ${esc(a.type)}</span>`).join("")}</div>` : "";

  const footer = opts.showThreadLink
    ? `<div class="em-card-footer"><span class="thread-link" data-thread="${opts.threadId}" style="font-size:12.5px;color:var(--helper);cursor:pointer;text-decoration:underline">See entire thread →</span></div>` : "";

  return `<div class="em-card">
    <div class="em-card-head" style="cursor:default">
      <div class="em-head-left">
        <div class="em-name-row">
          <span class="ent-strip ${ec}" style="margin:0">${label}</span>
          <span class="em-name">${esc(em.from.name)}</span>
        </div>
        <span class="em-to-summary">
          to <span class="to-names">${esc(toNames)}</span>
          ${ccNames?` cc <span class="to-names">${esc(ccNames)}</span>`:""}
          <span class="em-chevron" data-header-modal="${em.id}">▾</span>
        </span>
      </div>
      <span class="em-date">${esc(em.date)} · ${esc(em.time)}</span>
    </div>
    <div class="em-card-body">${esc(em.body)}</div>
    ${attach}${footer}
  </div>`;
}

// ============================================================
//  DRAFT EDITOR
// ============================================================
function openComposeModal(){
  if(!recipientPills["compose"]) recipientPills["compose"]={to:[],cc:[]};
  const draft={to:"",cc:"",subject:"",body:"",attachments:[]};
  $("modal").innerHTML=`<div class="scrim" id="composeBg">
    <div class="modal" style="max-width:600px;padding:0;overflow:hidden;border-radius:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--line)">
        <span style="font-size:15px;font-weight:700">Send reminder</span>
        <button class="btn" id="composeClose" style="padding:4px 10px;font-size:13px">×</button>
      </div>
      <div style="padding:16px 18px">${renderDraftEditor(draft,"compose")}</div>
    </div>
  </div>`;
  $("composeClose").onclick=()=>{ $("modal").innerHTML=""; recipientPills["compose"]={to:[],cc:[]}; };
  $("composeBg").onclick=(e)=>{ if(e.target.id==="composeBg"){ $("modal").innerHTML=""; recipientPills["compose"]={to:[],cc:[]}; } };
  // re-wire draft interactions inside modal
  const m=$("modal");
  m.querySelectorAll("[data-pill-input]").forEach(el=>el.onkeydown=(e)=>{
    if(e.key===" "||e.key===","||e.key==="Enter"){ e.preventDefault();
      const val=el.value.trim().replace(/,$/,""); if(!val) return;
      const [idx,field]=el.dataset.pillInput.split(":");
      if(!recipientPills[idx]) recipientPills[idx]={to:[],cc:[]};
      recipientPills[idx][field].push(val); el.value=""; const p=$("panel"); renderPanel(); openComposeModal(); }
  });
  m.querySelectorAll("[data-open-picker]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); attachPickerOpen=attachPickerOpen===el.dataset.openPicker?false:el.dataset.openPicker; $("modal").innerHTML=""; openComposeModal(); });
  m.querySelectorAll("[data-pick-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [idx,name]=el.dataset.pickAttach.split(":"); if(!selectedAttachments[idx]) selectedAttachments[idx]=new Set(); selectedAttachments[idx].add(name); attachPickerOpen=false; $("modal").innerHTML=""; openComposeModal(); });
  m.querySelectorAll("[data-rm-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [idx,name]=el.dataset.rmAttach.split(":"); if(selectedAttachments[idx]) selectedAttachments[idx].delete(name); $("modal").innerHTML=""; openComposeModal(); });
}

function openEmailHeaderModal(emailId, triggerEl){
  // toggle: close if already open
  const existing = document.getElementById("hdrDropdown");
  if(existing){ existing.remove(); document.removeEventListener("click", window._hdrClose); return; }

  const allEmails = THREADS.flatMap(t=>t.emails);
  const em = allEmails.find(e=>e.id===emailId); if(!em) return;

  // engagement only for outbound system/dunning/agent emails
  const hasEngagement = ["system","dunning","agent"].includes(em.entity);
  const chk = v=>`<span style="color:${v?"var(--ink)":"#ccc"};font-size:14px;font-weight:${v?"600":"400"}">${v?"✓":"—"}</span>`;

  let engSection = "";
  if(hasEngagement){
    const o = (em.badges||[]).includes("opened");
    const c = (em.badges||[]).includes("clicked");
    const b = (em.badges||[]).includes("bounced");
    const f = (em.badges||[]).includes("failed");

    const recipRows = [...em.to,...(em.cc||[])].map(r=>{
      const pf = em.to.includes(r)?"To":"CC";
      return `<tr>
        <td style="padding:6px 12px 6px 0;color:var(--helper);font-size:12px;white-space:nowrap;vertical-align:middle">${pf}</td>
        <td style="padding:6px 16px 6px 0;font-size:13px;vertical-align:middle;white-space:nowrap">${esc(r.name||"")} <span style="color:var(--helper)">&lt;${esc(r.email)}&gt;</span></td>
        <td style="text-align:center;padding:6px 12px;vertical-align:middle">${chk(true)}</td>
        <td style="text-align:center;padding:6px 12px;vertical-align:middle">${chk(o)}</td>
        <td style="text-align:center;padding:6px 12px;vertical-align:middle">${chk(c)}</td>
        <td style="text-align:center;padding:6px 12px;vertical-align:middle">${chk(b)}</td>
        <td style="text-align:center;padding:6px 12px;vertical-align:middle">${chk(f)}</td>
      </tr>`;
    }).join("");

    engSection = `
      <div style="border-top:1px solid var(--line);margin-top:12px;padding-top:12px">
        <table style="border-collapse:collapse;font-size:12px;width:100%">
          <thead><tr>
            <th style="text-align:left;padding:0 12px 8px 0;color:var(--helper);font-weight:500;font-size:11px;white-space:nowrap"></th>
            <th style="text-align:left;padding:0 16px 8px 0;color:var(--helper);font-weight:500;font-size:11px"></th>
            <th style="text-align:center;padding:0 12px 8px;color:var(--helper);font-weight:500;font-size:11px">Delivered</th>
            <th style="text-align:center;padding:0 12px 8px;color:var(--helper);font-weight:500;font-size:11px">Opened</th>
            <th style="text-align:center;padding:0 12px 8px;color:var(--helper);font-weight:500;font-size:11px">Clicked</th>
            <th style="text-align:center;padding:0 12px 8px;color:var(--helper);font-weight:500;font-size:11px">Bounced</th>
            <th style="text-align:center;padding:0 12px 8px;color:var(--helper);font-weight:500;font-size:11px">Failed</th>
          </tr></thead>
          <tbody>${recipRows}</tbody>
        </table>
      </div>`;
  }

  const drop = document.createElement("div");
  drop.id = "hdrDropdown";
  drop.innerHTML = `
    <div style="display:grid;grid-template-columns:max-content 1fr;gap:5px 14px;font-size:13px">
      <span style="color:var(--helper);text-align:right">from:</span>
      <span><strong>${esc(em.from.name)}</strong> <span style="color:var(--helper)">&lt;${esc(em.from.email)}&gt;</span></span>
      <span style="color:var(--helper);text-align:right">date:</span>
      <span style="color:var(--ink)">${esc(em.date)} · ${esc(em.time)}</span>
    </div>
    ${engSection}
  `;
  Object.assign(drop.style, {
    position:"fixed", zIndex:"200",
    background:"#fff", borderRadius:"8px",
    boxShadow:"0 4px 24px rgba(0,0,0,.18), 0 1px 4px rgba(0,0,0,.08)",
    padding:"16px 18px",
    fontSize:"13px", whiteSpace:"nowrap"
  });

  document.body.appendChild(drop);

  // position below the chevron, clamp to viewport
  const rect = triggerEl.getBoundingClientRect();
  let left = rect.left;
  let top = rect.bottom + 6;
  drop.style.left = "0px"; drop.style.top = "-9999px"; // measure off-screen first
  const dropW = drop.offsetWidth || 420;
  if(left + dropW > window.innerWidth - 12) left = window.innerWidth - dropW - 12;
  if(left < 8) left = 8;
  drop.style.left = left + "px";
  drop.style.top = top + "px";

  window._hdrClose = (e)=>{
    if(!drop.contains(e.target) && e.target!==triggerEl){
      drop.remove();
      document.removeEventListener("click", window._hdrClose);
    }
  };
  setTimeout(()=>document.addEventListener("click", window._hdrClose), 0);
}

function renderDraftEditor(draft, actionIdx, opts){
  opts = opts || {};
  // init recipient pills from draft
  if(!recipientPills[actionIdx]){
    const toList = (draft.to||"").split(",").map(s=>s.trim()).filter(Boolean);
    const ccList = (draft.cc||"").split(",").map(s=>s.trim()).filter(Boolean);
    recipientPills[actionIdx] = {to: toList, cc: ccList};
  }
  const pills = recipientPills[actionIdx];

  // init attachments
  const selAttach = selectedAttachments[actionIdx] || new Set((draft.attachments||[]).map(a=>a.name));
  if(!selectedAttachments[actionIdx]) selectedAttachments[actionIdx] = selAttach;

  const isThread = draft.subject && draft.subject.startsWith("Re:");
  const isReply = actionIdx === "reply";

  // don't show "View thread" when already inside the thread (activity log / drawer)
  const threadLink = isThread && actionIdx !== "reply" && !opts.inDrawer
    ? `<span class="cmp-threadlink" data-open-thread="t1">View thread →</span>` : "";

  // recipient pill rows
  const pillsHtml = (list, field) => list.map(e=>
    `<span class="email-pill">${esc(e)}<span class="ep-rm" data-rm-pill="${actionIdx}:${field}:${esc(e)}">×</span></span>`
  ).join("") + `<input class="recip-input" placeholder="" data-pill-input="${actionIdx}:${field}">`;

  const subjectClass = isThread ? "subject-input greyed" : "subject-input";
  const subjectTitle = isThread ? 'title="Subject locked for thread replies"' : "";

  const attachPillsHtml = [...selAttach].map(name=>
    `<span class="attach-pill-tag" onclick="window.open('#','_blank')">📎 ${esc(name.split('/').pop())} <span class="ap-rm" data-rm-attach="${actionIdx}:${esc(name)}">×</span></span>`
  ).join("");

  const pickerItems = AVAILABLE_ATTACHMENTS.filter(a=>!selAttach.has(a.name));
  const pickerHtml = String(attachPickerOpen)===String(actionIdx) && pickerItems.length
    ? `<div class="attach-picker">${pickerItems.map(a=>
        `<div class="attach-picker-item" data-pick-attach="${actionIdx}:${esc(a.name)}">${esc(a.name)}</div>`
      ).join("")}</div>` : "";

  const footer = isReply
    ? `<button class="btn btn-primary">${LU('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>')}Send</button>`
    : `<button class="btn btn-danger" data-rej="${actionIdx}"><span class="ic">${ICON.x}</span>Reject</button>
       <button class="btn btn-primary" data-app="${actionIdx}"><span class="ic">${ICON.check}</span>Approve &amp; send</button>`;

  const tool = (p)=>`<button class="cmp-tool" tabindex="-1">${LU(p)}</button>`;
  const toolbar = [
    '<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',
    '<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>',
    '<path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/>',
    '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
  ].map(tool).join("");

  // Gmail-style AI refinement bar: describe-a-change input + quick refine tools + undo/redo
  const aiTool = (action,tip,paths)=>`<button class="cmp-ai-tool" data-ai-refine="${actionIdx}:${action}" data-tip="${tip}">${LU(paths)}</button>`;
  const histLen = (draftHistory[actionIdx]||[]).length;
  const redoLen = (draftRedo[actionIdx]||[]).length;
  const aiBar = `<div class="cmp-ai" data-ai-bar="${actionIdx}">
    <span class="cmp-ai-pencil" data-ai-focus="${actionIdx}">${LU('<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>')}</span>
    <input class="cmp-ai-input" placeholder="Describe your change" data-ai-input="${actionIdx}">
    <button class="cmp-ai-submit" data-ai-submit="${actionIdx}" data-tip="Submit" aria-label="Submit change">${LU('<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>')}</button>
    <div class="cmp-ai-actions">
      ${aiTool("polish","Polish",'<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>')}
      ${aiTool("serious","Serious",'<circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>')}
      ${aiTool("friendly","Friendly",'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>')}
      ${aiTool("shorter","Shorter",'<path d="m7 20 5-5 5 5"/><path d="m7 4 5 5 5-5"/>')}
      <span class="cmp-ai-div"></span>
      <button class="cmp-ai-tool" data-ai-undo="${actionIdx}" data-tip="Undo" ${histLen?"":"disabled"}>${LU('<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>')}</button>
      <button class="cmp-ai-tool" data-ai-redo="${actionIdx}" data-tip="Redo" ${redoLen?"":"disabled"}>${LU('<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>')}</button>
    </div>
  </div>`;

  return `<div class="composer">
    ${threadLink}
    <div class="cmp-field"><span class="cmp-label">To</span><div class="cmp-control">${pillsHtml(pills.to,"to")}</div></div>
    <div class="cmp-field"><span class="cmp-label">Cc</span><div class="cmp-control">${pillsHtml(pills.cc,"cc")}</div></div>
    <div class="cmp-field"><span class="cmp-label">Subject</span><div class="cmp-control"><input class="${subjectClass}" value="${esc(draft.subject||"")}" ${subjectTitle}${isThread?" readonly":""}></div></div>
    <div class="cmp-editor">
      <div class="cmp-toolbar">${toolbar}</div>
      <textarea class="cmp-body">${esc(draft.body||"")}</textarea>
      ${aiBar}
    </div>
    <div class="cmp-tiny">
      <button class="btn btn-tertiary" data-cancel-draft="${actionIdx}">Cancel</button>
      <button class="btn" data-save-draft="${actionIdx}">Save draft</button>
    </div>
    <div class="attach-row" style="position:relative">
      ${attachPillsHtml}
      <span class="attach-add-btn" data-open-picker="${actionIdx}">+ Attachments</span>
      ${pickerHtml}
    </div>
    <div class="draft-footer">${footer}</div>
  </div>`;
}

// ----- AI draft refinement (mock) -----
// Canned rewrites for the Meridian W-9 reply; a custom instruction falls back to "polish".
const AI_VARIANTS = {
  polish:    "Hi Dana,\n\nThanks for flagging both. The signed W-9 is attached, and I've updated the primary billing contact to ap@meridiangroup.com as requested.\n\nPlease let me know if anything else is needed.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
  serious:   "Dana,\n\nBefore we can move forward, we need the signed W-9 and confirmation of the billing contact. This has already delayed payment, so please send both today.\n\nThank you,\nPriya Sharma\nGeneral Catalyst",
  friendly:  "Hi Dana,\n\nThanks so much for flagging these! I've attached the signed W-9 for you, and I've gone ahead and updated your billing contact to ap@meridiangroup.com.\n\nJust give me a shout if there's anything else at all I can help with; I'm happy to sort it out.\n\nWarmly,\nPriya",
  shorter:   "Hi Dana,\n\nSigned W-9 attached, and I've updated the billing contact to ap@meridiangroup.com.\n\nBest,\nPriya",
};
function mockRefine(current, type){
  return (type && AI_VARIANTS[type]) ? AI_VARIANTS[type] : AI_VARIANTS.polish;
}
function setDraftBody(actionIdx, body){
  const a = SCENARIO.proposed[actionIdx];
  if(a && a.draft) a.draft.body = body;
}
function updateAiHistoryButtons(actionIdx){
  const u = document.querySelector(`[data-ai-undo="${actionIdx}"]`);
  const r = document.querySelector(`[data-ai-redo="${actionIdx}"]`);
  if(u) u.disabled = !((draftHistory[actionIdx]||[]).length);
  if(r) r.disabled = !((draftRedo[actionIdx]||[]).length);
}
function typeInto(ta, text, done){
  ta.value = "";
  let i = 0;
  const step = ()=>{
    if(i >= text.length){ done && done(); return; }
    i += 2 + Math.floor(Math.random()*3);    // 2–4 chars per tick
    ta.value = text.slice(0, i);
    ta.scrollTop = ta.scrollHeight;
    setTimeout(step, 13);
  };
  step();
}
function aiRefineDraft(actionIdx, type){
  if(aiGenerating) return;
  const ta = document.querySelector(".cmp-body"); if(!ta) return;
  const editor = document.querySelector(".cmp-editor");
  const bar = document.querySelector(".cmp-ai");
  const current = ta.value;
  const next = mockRefine(current, type);
  (draftHistory[actionIdx] = draftHistory[actionIdx]||[]).push(current);
  draftRedo[actionIdx] = [];
  aiGenerating = true;
  ta.readOnly = true;
  editor && editor.classList.add("generating");
  bar && bar.classList.add("busy");
  typeInto(ta, next, ()=>{
    aiGenerating = false;
    ta.readOnly = false;
    editor && editor.classList.remove("generating");
    bar && bar.classList.remove("busy");
    setDraftBody(actionIdx, next);
    updateAiHistoryButtons(actionIdx);
  });
}
function aiUndoRedo(actionIdx, isRedo){
  if(aiGenerating) return;
  const from = isRedo ? draftRedo[actionIdx] : draftHistory[actionIdx];
  if(!from || !from.length) return;
  const ta = document.querySelector(".cmp-body"); if(!ta) return;
  const to = isRedo ? (draftHistory[actionIdx]=draftHistory[actionIdx]||[]) : (draftRedo[actionIdx]=draftRedo[actionIdx]||[]);
  to.push(ta.value);
  const val = from.pop();
  ta.value = val;
  setDraftBody(actionIdx, val);
  updateAiHistoryButtons(actionIdx);
}

// ============================================================
//  DETAIL — header
// ============================================================
function renderDetailHeader(){
  const pendingCount = SCENARIO.proposed.filter((_,i)=>!actionState[i]).length;
  const invs = SCENARIO.invoices.slice(0,5);
  const totalOut = invs.reduce((s,i)=>s+i.amount,0);
  const invRows = invs.map(inv=>{
    const od = inv.od>0 ? ` <span class="inv-od">(${inv.od}d overdue)</span>` : "";
    return `<tr>
      <td><a>${esc(inv.num)}</a></td>
      <td>${esc(inv.due)}${od}</td>
      <td class="inv-status">${esc(inv.status||"")}</td>
      <td class="r">${fmtMoney(inv.amount)}</td>
    </tr>`;
  }).join("");
  return `
    <div style="padding:14px 22px 6px;display:flex;align-items:center;gap:12px">
      <span class="page-title">${esc(SCENARIO.customer)}</span>
      <div class="top-actions">
        <button class="btn-icon ${agentEscalated?"flagged":""}" id="flagBtn">
          ${agentEscalated?ICON.flagFill:ICON.flagOut}
          <span class="icon-tip">${agentEscalated?"Remove flag":"Flag this customer — makes your agent aware of the flag and filterable on the Collections Agent table"}</span>
        </button>
        <button class="btn-topbar ${agentPaused?"paused":""}" id="pauseBtn">
          ${agentPaused
            ? LU('<polygon points="6 3 20 12 6 21 6 3"/>')+"Resume Agent"
            : LU('<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>')+"Pause Agent"}
          <span class="icon-tip" style="right:0;left:auto">${agentPaused?"Resume: agent will start proposing actions":"Agent won't propose or take any actions on this customer"}</span>
        </button>
        <span class="perms-link" style="margin-left:4px">Agent permissions</span>
      </div>
    </div>
    <section class="finger">
      <div class="left">
        <div class="agent-summary">
          <div class="as-label">${agentClusterIcon("static")}Agent Summary</div>
          <div class="as-body">${renderAgentSummary(SCENARIO)}</div>
        </div>
      </div>
      <div class="right">
        <div class="inv-h">Outstanding Invoices</div>
        <table class="inv">
          <thead><tr><th>Invoice #</th><th>Due</th><th>Status</th><th class="r">Amount</th></tr></thead>
          <tbody>
            ${invRows}
            <tr class="tot"><td colspan="3">Total Outstanding</td><td class="r">${fmtMoney(totalOut)}</td></tr>
          </tbody>
        </table>
      </div>
    </section>
    <nav class="tabs">
      <button class="tab ${activeTab==="actions"?"active":""}" data-tab="actions">Actions${pendingCount>0?agentClusterIcon("tiny"):""}</button>
      <button class="tab ${activeTab==="activity"?"active":""}" data-tab="activity">Activity</button>
      <button class="tab ${activeTab==="scheduled"?"active":""}" data-tab="scheduled">Scheduled</button>
      <span class="tab-underline" aria-hidden="true"></span>
    </nav>`;
}

// ============================================================
//  DETAIL — actions panel
// ============================================================
// "auto" (pre-seeded via a scenario's initialActionState, never set by a click) means the
// agent already executed this with no human touch — distinct from a human clicking Approve.
function verdictHtml(st, extraStyle){
  if(!st) return "";
  const cls = st==="auto" ? "ok" : st==="approved" ? "approved" : "no";
  const label = st==="auto" ? "Auto-executed" : st==="approved" ? "✓ Approved" : "Rejected";
  return `<span class="verdict ${cls}"${extraStyle?` style="${extraStyle}"`:""}>${label}</span>`;
}

// One proposed action card (right/effect side). Reused for email / contact / generic.
function renderActionCard(a, i){
  const st = actionState[i];
  const isEmail = a.kind==="send_email";
  const isContact = a.kind==="update_contacts" && a.editableContact!=null;
  const isExpContact = expandedCard===i && isContact && !st;
  const isExpanded = expandedCard===i && isEmail && !st;
  const attachCount = (a.attachments||[]).length;

  if(isEmail){
    // Editing the email draft now happens in the thread drawer (with conversation context), not inline.
    return `<div class="card ${st?"done":""}" style="flex-direction:column;align-items:stretch">
      <div class="se-collapsed">
        <div class="body" style="flex:1;min-width:0">
          <span class="title">Send email</span>
          <span class="desc">${esc(a.desc)}</span>
          ${attachCount?`<span class="se-meta">${attachCount} attachment${attachCount>1?"s":""}</span>`:""}
        </div>
        ${st
          ? verdictHtml(st)
          : `<button class="btn btn-tertiary" data-edit-email="${i}">Edit in thread</button>
             <button class="btn btn-danger" data-rej="${i}"><span class="ic">${ICON.x}</span>Reject</button>
             <button class="btn btn-primary" data-app="${i}"><span class="ic">${ICON.check}</span>Approve</button>`}
      </div>
    </div>`;
  }
  if(isContact){
    const curVal = editValues[i]!==undefined ? editValues[i] : a.editableContact;
    const contactExpanded = isExpContact ? `
      <div class="contact-edit" style="margin-top:12px">
        <div class="field">
          <label class="field-label">Primary contact</label>
          <input class="field-input" id="ci${i}" value="${esc(curVal)}">
        </div>
        <div class="cmp-tiny">
          <button class="btn btn-tertiary" data-canceledit="${i}">Cancel</button>
          <button class="btn" data-save="${i}">Save</button>
        </div>
        <div class="draft-footer">
          <button class="btn btn-danger" data-rej="${i}"><span class="ic">${ICON.x}</span>Reject</button>
          <button class="btn btn-primary" data-app="${i}"><span class="ic">${ICON.check}</span>Approve</button>
        </div>
      </div>` : "";
    return `<div class="card ${st?"done":""}" style="flex-direction:column;align-items:stretch">
      <div class="se-collapsed">
        <div class="body" style="flex:1;min-width:0">
          <span class="title">Update billing contact</span>
          <span class="se-meta">→ ${esc(curVal)}</span>
        </div>
        ${st
          ? verdictHtml(st)
          : `<button class="btn btn-tertiary" data-expand="${i}">${isExpContact?"Close":"Edit"}</button>
             <button class="btn btn-danger" data-rej="${i}"><span class="ic">${ICON.x}</span>Reject</button>
             <button class="btn btn-primary" data-app="${i}"><span class="ic">${ICON.check}</span>Approve</button>`}
      </div>
      ${contactExpanded}
    </div>`;
  }
  const acts = st ? verdictHtml(st)
    : `<button class="btn btn-danger" data-rej="${i}"><span class="ic">${ICON.x}</span>Reject</button><button class="btn btn-primary" data-app="${i}"><span class="ic">${ICON.check}</span>Approve</button>`;
  return `<div class="card ${st?"done":""}" style="flex-direction:column;align-items:stretch">
    <div style="display:flex;align-items:center;gap:16px">
      <div class="body" style="flex:1"><span class="title">${esc(a.kind)}</span><span class="desc">${esc(a.desc)}</span></div>
      <div class="acts">${acts}</div>
    </div>
  </div>`;
}

// An action can cite more than one triggering event — "causes" is always an array, even for a
// single-cause action. Its *primary* cause (last in the array — the most immediate trigger) is
// what it nests under in the timeline; any earlier causes are still cited and highlight on
// hover, just without a static elbow line drawn all the way to them (see wireTimelineHover()).
function causeKey(c){ return c ? `${c.type}:${c.id}` : ""; }
function primaryCause(a){ const cs=a.causes||[]; return cs.length ? cs[cs.length-1] : null; }

// One timeline node: an inline "what happened" event, with its nested action(s) beneath.
function renderTimelineNode(o){
  const mail = LU('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
  const alert = LU('<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>');
  let dotCls = "", eventHtml = "";
  if(o.event){
    dotCls = "critical";
    eventHtml = `<div class="tl-event">
      <span class="tl-ev-icon crit">${alert}</span>
      <span class="tl-ev-text strong">${o.event.html||esc(o.event.text||"")}</span>
      <span class="tl-time">${esc(o.event.date)} · ${esc(o.event.time||"")}</span>
    </div>`;
  } else if(o.cause && o.cause.type==="email"){
    const em = THREADS.flatMap(t=>t.emails).find(e=>e.id===o.cause.id);
    const preview = em ? em.body.replace(/\s+/g," ").trim() : "";
    const time = em ? (em.time||"") : "";
    eventHtml = `<div class="tl-event email" data-open-email-drawer="${em?em.id:""}">
      <span class="tl-ev-icon">${mail}</span>
      <div class="tl-ev-main">
        <div class="tl-ev-top">
          <span class="tl-ev-who">${esc(em?em.from.name:"")}</span>
          <span class="tl-time">${esc(em?em.date:"")} · ${esc(time)}</span>
          <span class="tl-open">Open ›</span>
        </div>
        <div class="tl-ev-text">${esc(preview)}</div>
      </div>
    </div>`;
  } else {
    eventHtml = `<div class="tl-event"><span class="tl-ev-text">Agent-initiated</span></div>`;
  }
  // o.actions is a list of {action, idx} whose *primary* cause is this event — stacked together
  // under the one event instead of repeating the event once per action. data-cites carries
  // EVERY cause the action has (not just this primary one), for hover highlighting.
  const actionHtml = (o.actions||[]).map(({action,idx})=>
    `<div class="tl-action" data-action-idx="${idx}" data-cites="${(action.causes||[]).map(causeKey).join(",")}">${renderActionCard(action,idx)}</div>`
  ).join("");
  return `<div class="tl-node" data-event-key="${causeKey(o.cause)}">
    <span class="tl-dot ${dotCls}"></span>
    <div class="tl-node-main">${eventHtml}${actionHtml}</div>
  </div>`;
}

// Hover an action → highlight every event it cites (blue) and darken the rail segments that
// connect them, even when a cited event isn't the action's immediate parent node (e.g. Meridian's
// reply cites both Dana's contact-update email AND her follow-up W-9 email).
function wireTimelineHover(p){
  const nodes = Array.from(p.querySelectorAll(".tl-node"));
  p.querySelectorAll(".tl-action[data-cites]").forEach(el=>{
    const keys = el.dataset.cites.split(",").filter(Boolean);
    if(!keys.length) return;
    const ownIdx = nodes.indexOf(el.closest(".tl-node"));
    el.addEventListener("mouseenter", ()=>{
      let minIdx = ownIdx;
      keys.forEach(k=>{
        const n = p.querySelector(`.tl-node[data-event-key="${k}"]`);
        if(!n) return;
        n.classList.add("cited-hl");
        const idx = nodes.indexOf(n);
        if(idx>=0 && idx<minIdx) minIdx = idx;
      });
      for(let i=minIdx;i<ownIdx;i++) nodes[i].classList.add("rail-hl");
      el.classList.add("cited-hl");
    });
    el.addEventListener("mouseleave", ()=>{
      p.querySelectorAll(".cited-hl").forEach(n=>n.classList.remove("cited-hl"));
      p.querySelectorAll(".rail-hl").forEach(n=>n.classList.remove("rail-hl"));
    });
  });
}

function renderActionsPanel(){
  const p = SCENARIO.proposed;
  const pending = p.filter((_,i)=>!actionState[i]).length;
  const head = pending>0
    ? `<span class="as-count"><span>${pending}</span> action${pending>1?"s":""} awaiting review</span>`
    : `<span class="as-count" style="color:var(--good)">✓ All actions resolved</span>`;

  let content;
  if(!p.length){
    content = `<div class="empty">No actions pending.</div>`;
  } else {
    // Decision: an event only ever shows here if a proposed action is actually tied to it (via
    // causes) — no orphan events. Each action nests under its primary cause (see primaryCause);
    // when two+ actions share the same primary cause, they stack under one copy of that event
    // instead of repeating it. Multi-cause actions still cite their earlier causes — those just
    // surface via hover (wireTimelineHover) rather than a second static nesting.
    const groups = [];
    const groupByKey = new Map();
    p.forEach((a,i)=>{
      const primary = primaryCause(a);
      const key = primary ? causeKey(primary) : `none:${i}`;
      if(!groupByKey.has(key)){
        const g = { cause: primary, actions: [] };
        groupByKey.set(key, g);
        groups.push(g);
      }
      groupByKey.get(key).actions.push({ action:a, idx:i });
    });
    const nodes = groups.map(g=>renderTimelineNode({cause:g.cause, actions:g.actions}));
    content = `<div class="action-strip">${head}</div>
      <div class="tl">${nodes.join("")}</div>`;
  }

  // Paused agent → cover the Actions tab with a blurred overlay + Resume button, no copy.
  const overlay = agentPaused ? `
    <div class="agent-overlay">
      <div class="agent-overlay-inner">
        <button class="btn btn-primary agent-overlay-btn" data-resume-agent>${LU('<polygon points="6 3 20 12 6 21 6 3"/>')}Resume Agent</button>
      </div>
    </div>` : "";

  return `<div class="actions-wrap${agentPaused?" is-paused":""}">${content}${overlay}</div>`;
}

// ============================================================
//  DETAIL — activity panel
// ============================================================

// Filter buckets. "agent" cuts across both emails and events — anything Collections Agent
// touched, auto-executed or human-approved. Rejected proposals never appear here at all.
// Invoice chip for an email row — the INV-#### pulled from its thread subject, so you can see
// at a glance which invoice a message is tied to (full subject on hover).
function invoiceTag(subject){
  const m = subject && subject.match(/INV-\d+/i);
  return m ? `<span class="inv-tag-chip" title="${esc(subject)}">${esc(m[0].toUpperCase())}</span>` : "";
}

function renderActivityBody(){
  const mail = LU('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
  const items = activityItems().filter(item => activityFilter==="email" ? item.type==="email" : true);
  if(!items.length) return `<div class="act-list"><div class="empty">${activityFilter==="email"?"No emails yet.":"No activity yet."}</div></div>`;
  const rows = items.map(item=>{
    if(item.type==="email"){
      // Each message in a thread gets its own chronological row (no collapsing to the
      // latest message) — clicking any of them opens the same shared thread, scrolled/
      // expanded to that specific message. See PRD 2.0 open questions.
      const thread = threadForEmailId(item.id);
      const tid = thread ? thread.id : item.id;
      const count = thread ? thread.emails.length : 1;
      const preview = item.body.replace(/\s+/g," ").trim();
      const badges = (item.badges||[]).map(b=>engBadge(b)).join("");
      const draftBadge = (thread&&thread.agentReplyDraft&&item.id===thread.emails[thread.emails.length-1].id) ? `<span class="draft-badge">✎ Agent draft</span>` : "";
      const invTag = invoiceTag((thread&&thread.subject) || item.threadSubject || item.subject);
      const stacked = (count>1) ? `<div class="email-stack" data-open-thread="${tid}" data-focus-email="${item.id}">View thread (${count}) →</div>` : "";
      return `<div class="act-row email-row${count>1?" has-thread-link":""}" data-open-thread="${tid}" data-focus-email="${item.id}">
        <span class="er-icon">${mail}</span>
        <div class="er-main">
          <div class="email-row-top">
            <span class="email-row-who">${esc(item.from.name)}</span>${invTag}${draftBadge}
            <span class="email-row-date">${esc(item.date)} · ${esc(item.time||"")}</span>
          </div>
          <div class="email-row-body">${esc(preview)}</div>
          ${badges?`<div class="email-row-foot">${badges}</div>`:""}
          ${stacked}
        </div>
      </div>`;
    }
    // Actor attribution follows the real Tabs activity-log pattern: bold plain text inline
    // ("**Agent Actions** set PO 12345..."), not a pill. Only agent-driven events get an
    // actor prefix at all — a manual human action (e.g. escalated, agent:false) stays plain,
    // which is how we distinguish "agent did it" from "human did it directly" without a
    // separate filter bucket.
    const actorPrefix = item.agent ? `<strong>Collections Agent:</strong> ` : "";
    const suffix = item.agent
      ? (item.cat==="ai" ? ` <span class="act-auto">· Auto</span>` : item.cat==="user" ? ` <span class="act-approved">· Approved</span>` : "")
      : "";
    return `<div class="act-row event-row">
      <span class="ev-node"></span>
      <span class="ar-body">${actorPrefix}${item.html||esc(item.text||"")}${suffix}</span>
      <span class="ar-datestamp">${esc(item.date)} · ${esc(item.time||"")}</span>
    </div>`;
  }).join("");
  return `<div class="act-list">${rows}</div>`;
}

function renderActivityPanel(){
  const filterTabs = `<div class="act-filter-tabs">
    <button class="act-ftab ${activityFilter==="all"?"active":""}" data-activity-filter="all">All</button>
    <button class="act-ftab ${activityFilter==="email"?"active":""}" data-activity-filter="email">Email</button>
  </div>`;
  return `${filterTabs}<div class="act-body" id="actBody">${renderActivityBody()}</div>`;
}

function wireActivityBody(){
  const body = $("actBody"); if(!body) return;
  body.querySelectorAll("[data-open-thread]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openThreadDrawer(el.dataset.openThread, el.dataset.focusEmail); });
  body.querySelectorAll("[data-open-email-drawer]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openEmailDrawer(el.dataset.openEmailDrawer); });
}

// ============================================================
//  SCHEDULED PANEL
// ============================================================
function renderScheduledPanel(){
  const all = (SCENARIO.scheduled||[]).sort((a,b)=>toMs(a.date,a.time)-toMs(b.date,b.time));
  const tasks = all.filter(s=>s.type==="agent_task" && !deletedTasks.has(s.id));
  const nextDunning = all.find(s=>s.type==="dunning");

  const dunningNote = nextDunning
    ? `<span style="font-size:12px;color:var(--helper)">Next dunning reminder: <strong style="color:var(--ink)">${esc(nextDunning.date)}</strong> &nbsp;·&nbsp; <span class="sched-settings-link">Global dunning settings →</span></span>`
    : `<span class="sched-settings-link" style="font-size:12px">Global dunning settings →</span>`;

  let html = `<div class="sched-header">
    <h3>Scheduled</h3>
    <div>${dunningNote}</div>
  </div>`;

  if(!tasks.length){
    return `<div class="sched-body">${html}<div class="empty">No agent scheduled tasks.</div></div>`;
  }

  tasks.forEach(s=>{
    const isEditing = editingTask===s.id;
    const preview = s.prompt.replace(/\s+/g," ").trim();
    const editForm = isEditing ? `
      <div class="sched-task-form">
        <div class="field">
          <label class="field-label">Date / time</label>
          <input class="field-input" id="stf-date-${s.id}" value="${esc(s.date)} · ${esc(s.time)}">
        </div>
        <div class="field">
          <label class="field-label">Prompt</label>
          <textarea class="field-input" style="min-height:80px;resize:vertical;line-height:1.5" id="stf-prompt-${s.id}">${esc(s.prompt)}</textarea>
        </div>
        <div class="stf-actions">
          <span class="stf-delete" data-delete-task="${s.id}">Delete task</span>
          <div class="cmp-tiny">
            <button class="btn btn-tertiary" data-cancel-task="${s.id}">Cancel</button>
            <button class="btn" data-save-task="${s.id}">Save</button>
          </div>
        </div>
      </div>` : "";
    html+=`<div class="sched-tile">
      <div class="sched-tile-head">
        <div class="sched-tile-left">
          <div class="sched-tile-when">${esc(s.date)} · ${esc(s.time)}</div>
          <div class="sched-tile-title">Agent scheduled task</div>
          <div class="sched-tile-body" style="padding:4px 0 0;font-size:13px;color:var(--ink)">${esc(preview)}</div>
        </div>
        <span class="ent-strip agent" style="flex:0 0 auto;margin-top:2px">Agent</span>
      </div>
      <div class="sched-tile-foot">
        <span class="sf-note"></span>
        ${isEditing?"":
          `<button class="btn" data-edit-task="${s.id}" style="padding:5px 12px;font-size:12.5px">Edit</button>
           <button class="btn" data-delete-task="${s.id}" style="padding:5px 12px;font-size:12.5px;color:var(--warn)">Delete</button>`}
      </div>
      ${editForm}
    </div>`;
  });

  return `<div class="sched-body">${html}</div>`;
}

// ============================================================
//  PANEL + WIRING
// ============================================================
function renderPanel(){
  const p = $("panel"); if(!p) return;
  p.innerHTML = activeTab==="actions" ? renderActionsPanel()
    : activeTab==="activity" ? renderActivityPanel()
    : renderScheduledPanel();
  wire();
}

function wire(){
  const p = $("panel"); if(!p) return;
  wireTimelineHover(p);
  p.querySelectorAll("[data-toggle-ne]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const id=el.dataset.toggleNe; if(openNewEvents.has(id)) openNewEvents.delete(id); else openNewEvents.add(id); renderPanel(); });
  p.querySelectorAll("[data-open-email-drawer]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openEmailDrawer(el.dataset.openEmailDrawer); });
  p.querySelectorAll("[data-app]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); actionState[+el.dataset.app]="approved"; expandedCard=null; renderPanel(); });
  p.querySelectorAll("[data-rej]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); actionState[+el.dataset.rej]="rejected"; expandedCard=null; renderPanel(); });
  p.querySelectorAll("[data-expand]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const i=+el.dataset.expand; expandedCard=(expandedCard===i)?null:i; renderPanel(); });
  p.querySelectorAll("[data-edit-email]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openDraftEditorInDrawer(+el.dataset.editEmail); });
  p.querySelectorAll("[data-edit]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); editingCard=+el.dataset.edit; renderPanel(); });
  p.querySelectorAll("[data-save]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const i=+el.dataset.save; const inp=document.getElementById("ci"+i); if(inp) editValues[i]=inp.value; editingCard=null; renderPanel(); });
  p.querySelectorAll("[data-canceledit]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); editingCard=null; renderPanel(); });
  p.querySelectorAll("[data-resume-agent]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); agentPaused=false; render(); });
  p.querySelectorAll("[data-ai-refine]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [idx,type]=el.dataset.aiRefine.split(":"); const inp=p.querySelector(`[data-ai-input="${idx}"]`); if(inp) inp.value=""; aiRefineDraft(idx, type); });
  p.querySelectorAll("[data-ai-input]").forEach(el=>el.onkeydown=(e)=>{ if(e.key==="Enter"){ e.preventDefault(); e.stopPropagation(); if(!el.value.trim()) return; const idx=el.dataset.aiInput; el.value=""; aiRefineDraft(idx, null); } });
  p.querySelectorAll("[data-ai-submit]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const idx=el.dataset.aiSubmit; const inp=p.querySelector(`[data-ai-input="${idx}"]`); if(!inp||!inp.value.trim()) return; inp.value=""; aiRefineDraft(idx, null); });
  p.querySelectorAll("[data-ai-focus]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); p.querySelector(`[data-ai-input="${el.dataset.aiFocus}"]`)?.focus(); });
  p.querySelectorAll("[data-ai-undo]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); aiUndoRedo(el.dataset.aiUndo, false); });
  p.querySelectorAll("[data-ai-redo]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); aiUndoRedo(el.dataset.aiRedo, true); });
  p.querySelectorAll("[data-open-thread]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openThreadDrawer(el.dataset.openThread); });
  p.querySelectorAll("[data-back-activity]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); selectedEmailId=null; threadOpenEmails=new Set(); renderPanel(); });
  p.querySelectorAll("[data-expand-email]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const id=el.dataset.expandEmail; if(threadOpenEmails.has(id)) threadOpenEmails.delete(id); else threadOpenEmails.add(id); renderPanel(); });
  p.querySelectorAll("[data-header-modal]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openEmailHeaderModal(el.dataset.headerModal, el); });
  p.querySelectorAll("[data-activity-filter]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); activityFilter=el.dataset.activityFilter; renderPanel(); });
  // pill add on space/comma
  p.querySelectorAll("[data-pill-input]").forEach(el=>el.onkeydown=(e)=>{
    if(e.key===" "||e.key===","||e.key==="Enter"){ e.preventDefault();
      const val=el.value.trim().replace(/,$/,"");
      if(!val) return;
      const [idx,field]=el.dataset.pillInput.split(":");
      if(!recipientPills[idx]) recipientPills[idx]={to:[],cc:[]};
      recipientPills[idx][field].push(val); el.value=""; renderPanel();
    }
  });
  // pill remove
  p.querySelectorAll("[data-rm-pill]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation();
    const [idx,field,email]=el.dataset.rmPill.split(":");
    if(recipientPills[idx]) recipientPills[idx][field]=recipientPills[idx][field].filter(x=>x!==email);
    renderPanel();
  });
  p.querySelectorAll("[data-edit-task]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); editingTask=el.dataset.editTask; renderPanel(); });
  p.querySelectorAll("[data-cancel-task]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); editingTask=null; renderPanel(); });
  p.querySelectorAll("[data-save-task]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); editingTask=null; renderPanel(); });
  p.querySelectorAll("[data-delete-task]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); deletedTasks.add(el.dataset.deleteTask); editingTask=null; renderPanel(); });
  p.querySelectorAll("[data-cancel-draft]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); expandedCard=null; renderPanel(); });
  p.querySelectorAll("[data-save-draft]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); expandedCard=null; renderPanel(); });
  p.querySelectorAll("[data-open-picker]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); attachPickerOpen=attachPickerOpen===el.dataset.openPicker?false:el.dataset.openPicker; renderPanel(); });
  p.querySelectorAll("[data-pick-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [idx,name]=el.dataset.pickAttach.split(":"); if(!selectedAttachments[idx]) selectedAttachments[idx]=new Set(); selectedAttachments[idx].add(name); attachPickerOpen=false; renderPanel(); });
  p.querySelectorAll("[data-rm-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [idx,name]=el.dataset.rmAttach.split(":"); if(selectedAttachments[idx]) selectedAttachments[idx].delete(name); renderPanel(); });
  p.querySelectorAll(".thread-link[data-thread]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    deepLinkToThread(el.dataset.thread);
    activeTab="activity";
    document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab==="activity"));
    positionTabIndicator(true);
    renderPanel();
  });

}

// ============================================================
//  RENDER + INIT
// ============================================================
// Toretto top banner: sage header with breadcrumb (left) + global search (right)
function renderTopbar(crumbHtml){
  const search = LU('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>');
  return `<div class="topbar">
    <div class="tb-crumb">${crumbHtml}</div>
    <div class="tb-spacer"></div>
    <div class="tb-search">${search}<span class="tb-ph">Search customers, invoices, contracts</span><span class="tb-kbd">⌘K</span></div>
    <div class="tb-help">?</div>
  </div>`;
}
const TB = {
  inbox: `<b>Collections Agent</b>`,
  customer: ()=>`Customers <span class="tb-sep">›</span> <b>${esc(SCENARIO.customer)}</b>`,
  billing: `Invoicing <span class="tb-sep">›</span> Billing <span class="tb-sep">›</span> <b>Invoice</b>`,
  detail: ()=>`<span class="tb-link" data-crumb="inbox">Collections Agent</span> <span class="tb-sep">›</span> <b>${esc(SCENARIO.customer)}</b>`,
};

function render(){
  renderNav();
  const escrim = $("emailScrim"); if(escrim) escrim.onclick = ()=>closeEmailDrawer();
  const main = $("main-content");
  if(view==="billing"){
    main.innerHTML = renderTopbar(TB.billing) + renderBilling();
    const cab = $("collAgentBtn");
    if(cab) cab.onclick=()=>{ view="detail"; actionState={}; editingCard=null; editValues={}; expandedCard=null; threadExpanded=false; selectedEmailId=null; threadOpenEmails=new Set(); expandedHeaders=new Set(); selectedAttachments={}; showBcc=false; attachPickerOpen=false; openNewEvents=new Set(); recipientPills={}; draftHistory={}; draftRedo={}; aiGenerating=false; drawerThreadId=null; drawerEditing=false; drawerEditActionIdx=null; agentEscalated=false; agentPaused=false; activeTab="actions"; activityFilter="all"; render(); };
  } else if(view==="customer"){
    main.innerHTML = renderTopbar(TB.customer()) + renderCustomer();
    main.querySelectorAll("[data-nav-to-detail]").forEach(el=>el.onclick=()=>{
      view="detail"; actionState={}; editingCard=null; editValues={}; expandedCard=null;
      threadExpanded=false; selectedEmailId=null; threadOpenEmails=new Set();
      expandedHeaders=new Set(); selectedAttachments={}; showBcc=false; attachPickerOpen=false;
      openNewEvents=new Set(); recipientPills={}; draftHistory={}; draftRedo={}; aiGenerating=false; drawerThreadId=null; drawerEditing=false; drawerEditActionIdx=null; agentEscalated=false; agentPaused=false;
      activeTab="actions"; activityFilter="all"; render();
    });
    $("backBtn") && ($("backBtn").onclick=()=>{ view="inbox"; render(); });
  } else if(view==="inbox"){
    main.innerHTML = renderTopbar(TB.inbox) + renderInbox();
    const si=$("inboxSearchInput"); if(si) si.oninput=(e)=>{
      inboxSearchQuery = e.target.value;
      inboxPage = 1;
      const pos = e.target.selectionStart;
      render();
      const ni=$("inboxSearchInput"); if(ni){ ni.focus(); ni.setSelectionRange(pos, pos); }
    };
    const sc=$("inboxSearchClear"); if(sc) sc.onclick=(e)=>{ e.stopPropagation(); inboxSearchQuery=""; inboxPage=1; render(); const ni=$("inboxSearchInput"); if(ni) ni.focus(); };
    const fb=$("filterBtn"); if(fb) fb.onclick=(e)=>{ e.stopPropagation(); filterOpen=!filterOpen; filterSubmenu=null; colConfigOpen=false; render(); };
    const ccb=$("colConfigBtn"); if(ccb) ccb.onclick=(e)=>{ e.stopPropagation(); colConfigOpen=!colConfigOpen; filterOpen=false; render(); };
    main.querySelectorAll(".filter-dropdown").forEach(el=>el.onclick=(e)=>e.stopPropagation());
    main.querySelectorAll("[data-filter-type]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); filterSubmenu=el.dataset.filterType; render(); });
    main.querySelectorAll("[data-filter-back]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); filterSubmenu=null; render(); });
    main.querySelectorAll("[data-filter-value]").forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const [type,value,display] = el.dataset.filterValue.split(":");
      activeFilters = activeFilters.filter(f=>f.type!==type);
      activeFilters.push({ type, value, label:FILTER_DEFS[type].label, display });
      filterOpen=false; filterSubmenu=null; inboxPage=1; render();
    });
    main.querySelectorAll("[data-remove-filter]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); activeFilters.splice(+el.dataset.removeFilter,1); inboxPage=1; render(); });
    main.querySelectorAll("[data-toggle-col]").forEach(el=>el.onchange=()=>{
      const k=el.dataset.toggleCol;
      if(visibleInboxCols.has(k)) visibleInboxCols.delete(k); else visibleInboxCols.add(k);
      render();
    });
    main.querySelectorAll("[data-page-nav]").forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      inboxPage += el.dataset.pageNav==="next" ? 1 : -1;
      render();
    });
    main.querySelectorAll("th[data-sort-key]").forEach(el=>el.onclick=()=>{
      const k = el.dataset.sortKey;
      inboxSort = inboxSort.key===k ? { key:k, dir: inboxSort.dir==="asc"?"desc":"asc" } : { key:k, dir:"desc" };
      inboxPage = 1;
      render();
    });
    document.onclick=()=>{ if(filterOpen||colConfigOpen){filterOpen=false;filterSubmenu=null;colConfigOpen=false;render();} };
    main.querySelectorAll("[data-customer]").forEach(row=>row.onclick=()=>{
      const sc = SCENARIOS_BY_ID[row.dataset.customer];
      if(sc){ SCENARIO = sc.scenario; THREADS = sc.threads; }
      view="detail"; actionState = (SCENARIO.initialActionState ? {...SCENARIO.initialActionState} : {}); editingCard=null; editValues={}; expandedCard=null;
      threadExpanded=false; selectedEmailId=null; threadOpenEmails=new Set();
      expandedHeaders=new Set(); selectedAttachments={}; showBcc=false; attachPickerOpen=false;
      openNewEvents=new Set(); recipientPills={}; draftHistory={}; draftRedo={}; aiGenerating=false; drawerThreadId=null; drawerEditing=false; drawerEditActionIdx=null; agentEscalated=false; agentPaused=false;
      activeTab="actions"; activityFilter="all"; render();
    });
  } else {
    main.innerHTML = renderTopbar(TB.detail())+renderDetailHeader()+`<div class="panel" id="panel"></div>`;
    renderPanel();
    main.querySelectorAll("[data-crumb]").forEach(el=>el.onclick=()=>{ view=el.dataset.crumb; render(); });
    $("flagBtn").onclick=()=>{ agentEscalated=!agentEscalated; render(); };
    $("pauseBtn").onclick=()=>{ agentPaused=!agentPaused; render(); };
    main.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
      if(b.dataset.tab==="settings") return;
      activeTab=b.dataset.tab;
      main.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));
      positionTabIndicator(true);   // slide the underline to the clicked tab
      renderPanel();
    });
    positionTabIndicator(false);    // place underline on initial detail render
  }
}

// Slide the main tab underline to the active tab (instant when animate=false).
function positionTabIndicator(animate){
  const tabs = document.querySelector(".tabs"); if(!tabs) return;
  const u = tabs.querySelector(".tab-underline");
  const a = tabs.querySelector(".tab.active");
  if(!u || !a) return;
  if(!animate) u.style.transition = "none";
  u.style.transform = `translateX(${a.offsetLeft}px)`;
  u.style.width = a.offsetWidth + "px";
  if(!animate){ void u.offsetWidth; u.style.transition = ""; }
}

// Cursor-tracked button glow: point each hovered .btn's gradient (--gx/--gy) at the cursor.
document.addEventListener("pointermove", (e)=>{
  const btn = e.target.closest && e.target.closest(".btn");
  if(!btn) return;
  const r = btn.getBoundingClientRect();
  btn.style.setProperty("--gx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
  btn.style.setProperty("--gy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
}, {passive:true});

render();
