/*
 * Nexus Daily Summary — data source of truth.
 *
 * Single live board (no dated history). Each team is updated independently
 * throughout the day and carries its own `updatedAt` timestamp so viewers can
 * see when that team was last touched.
 *
 * To post an update for one or more teams, see README.md — you paste the
 * update, Claude rewrites those teams' bullets and stamps `updatedAt` to now.
 * Teams you don't mention are left exactly as they were.
 *
 * `updatedAt` is Eastern wall-clock time (naive ISO, no offset) — it renders
 * verbatim as "Mon D, H:MM AM/PM ET" for every viewer regardless of their
 * browser timezone.
 *
 * Status and the one-line summary are DERIVED from the raw `bullets` at render
 * time (see app.js). Keep bullets raw; a bullet starting "Watch:" is a
 * monitoring note, "Blocked:" marks the team off-track.
 */
window.NEXUS_DATA = {
  // Launch target — the countdown ("N days to 7/20") is computed from `date`.
  launchDate: '2026-07-20',
  launchLabel: '7/20',

  // The day this board represents (header date + countdown anchor).
  date: '2026-06-23',

  // Teams. Order here is the display order. Each carries its own updatedAt.
  teams: [
    {
      name: 'Inventory Planning',
      updatedAt: '2026-06-23T15:58:00',
      bullets: [
        'SKU Table/View, SKU Table UI (with mock API), and back-end contracts all progressing; three milestones on track',
        'Stephen: PR merged making detail available; next step is S3 export linked to SQL Server',
        'Evan: WIP prototype of SKU table in progress; building base components for Nexus consistency, continuing to pick away at other prototype components',
        'Rex: Nexus crash-course complete, constellation set up in VAPE; refining back-end contracts with Stephen and Evan',
        'Gordy: small UI tweaks (de-nesting double-nested columns)',
        'Ned onboarding; Roey on vacation (returns July 6 — BE refinement work starts then); Mike rotating off team',
        'Watch: Data DRI ownership has shifted and needs formal clarification',
        'Watch: New Purchase Order system flagged by Whit Perkins — Nexus operations that add to order will populate POs, and the UI needs to close the loop',
        'Blocked: Snowflake → S3 → SQL Server pipeline not yet done — blocking final progress on the data layer. A global concern escalated to Eric Livergood, Chris Ostrowski, and Tom Wonneberger',
      ],
    },
    {
      name: 'Dex',
      updatedAt: '2026-06-23T12:19:00',
      bullets: [
        'Phase 1 scope locked at 5 use cases; workflows in active implementation',
        'Scott Dietrich: fully focused on Register AI Gamification today (working to move past it and get back to Dex); Slow Movers still at ~80%, unchanged',
        'Campbell: drafted capabilities layer for Nexus yesterday (per Chris request); today back to campaign flow — allowing campaigns to start from a template',
        'Katie Goodwin: brainstorming Day 2+ Dex use cases for Products & Inventory with Bilda + Contexta; mapping out triggers, invocation type, context Dex inherits, and access needs into a consumable doc — brief refinements to follow',
        'Driban out ~2 weeks on paternity leave; dropped 2 draft PRs before departing — scope held for his return',
        'Product decisions: Phase 1 invocation uses two existing pathways only (inline deferred to P2); free text allowed as build signal; auditing lean toward "done by Dex" flag + person in conversation',
        'Non-Dex build pattern: Campbell accepted establishing a standard for non-Dex teams to build Dex-consumable features (data/action/presentation layers)',
        'Watch: no performed-by field in the current audit flow — audit UX clunky; Chris investigating',
      ],
    },
    {
      name: 'Command Center',
      updatedAt: '2026-06-22T14:00:00',
      paused: true,
      pausedReason: 'On hold pending Reporting, Inventory Planning, and Signal Tower completion — small UI updates possible based on executive and customer feedback.',
      bullets: [
        'Roll-up surface — aggregates data from the other pages, so it resumes once Reporting, Inventory Planning, and Signal Tower are complete',
        'Resource shuffle: Mike Luon → Reports; Steven Morton → Inventory Insights; Rex → Inventory Planning (back-end)',
        'Scott on Register Copilot',
        'Small UI updates may happen in the interim based on executive and customer feedback',
        'Open question needing leadership input: can morning brief / today\'s pulse pieces be unblocked sooner so Reporting can piggyback on that work?',
      ],
    },
    {
      name: 'Reporting',
      updatedAt: '2026-06-23T15:55:00',
      bullets: [
        'Budtender performance report end-to-end demo for Friday\'s show-and-tell; serves as the reusable framework — remaining report pages copy the pattern and build in parallel once it lands',
        'Mack: refinement doc merged with architecture decisions; Budtender performance page spun up, addressing Evan\'s PR feedback (merge soon); next: individual budtender page view',
        'Seth: PR out shortly for semantic view + data model changes to capture missing budtender metrics; leaflogix controller endpoints started — targeting finish today/tomorrow',
        'Matt + Stephen: scoping a small report-layer change so reports read metric definitions from the semantic layer (not raw facts and dimensions); Stephen testing against a live report for a quick go/no-go',
        'Andrew: refinement doc posted for the sales & revenue module; addressing open design decisions before locking the architectural section and chunking out the work',
        'Marina: design review and updates complete across all reports; assessing morning brief feasibility, then provisioning and config checks',
        'Brands report design review still pending — scheduled with Whit Perkins',
        'Open question: should selectable date ranges be constrained (e.g., past 1 year only) to avoid performance issues from legacy reporting?',
        'Watch: report-layer architecture decision pending (Matt + Stephen) — resolving fast to lock consistent patterns before parallelizing',
      ],
    },
    {
      name: 'Customer Sentiment',
      updatedAt: '2026-06-23T12:20:00',
      bullets: [
        'Willian: all controllers + repositories in place with mocked data for the full app; all FE connected to controllers (Eric approved both PRs). Stretch goal: repos pointing to Snowflake where mock data is',
        'Sarah: survey implemented and posting real data through ecomm → Arma → public API → stored in LLx (accessible via URL; no purchase-flow integration required yet)',
        'Eric: develop configured to pull real Weedmaps data for a couple of customers — full flow pulling down and storing in LLx',
        'Eric + Matt: GoldDB loaded with a bunch of sample data this morning (process still running — Eric to flag when complete); Matt: data models into Snowflake importing from GoldDB',
        'Weedmaps partnership: Chris O. has sent a note to the Weedmaps CPO about data access — no response yet',
        'Watch: source type filtering flagged by Eric as a backend impact item — needs investigation',
        'Watch: Sarah hit auth issues testing the PAPI endpoint for survey submissions; Rspec workaround required to run CI on VAPE',
        'Watch: unresolved (16-reply thread) — should the survey display for ecomm dispensaries without a LeafLogix integration, and where does that data get stored?',
        'Watch: first-party review moderation approach still open — Marina working through dismiss/update flows',
      ],
    },
    {
      name: 'Signal Tower',
      updatedAt: '2026-06-22T13:28:00',
      bullets: [
        'Friday demo target: first two tabs demoable (settings + notifications) at the 1:30 PM ET show-and-tell',
        'Budtender modal design merged; API contracts updated for 3 Signal Tower endpoints (summary, alerts, budtender performance)',
        'Casey syncing with Ashley for click testing on alert configs and notification settings; Ashley merging PRs today + finalizing API contract with Casey',
        'Fraud discovery kicking off — getting time with Stacy & Co to validate fraud use cases and thresholds',
        'Coordination needed with Reporting (Mack) to avoid duplicating risk-related work on the budtender performance/risk modal',
        'Global permissions confirmed: org admins set thresholds + notifications at the highest level for the initial launch',
        'Compliance alerts (METRC sync errors, closeout discrepancies) will run nightly to manage cost; still investigating which sync errors are actionable vs. auto-resolving',
        'Watch: alert freshness lag up to 2 hours from action to alert (1hr evaluation + 1hr Snowflake) — stakeholders need to be aware of this latency',
        'Watch: architecture decision pending — a hard production deadline is needed to evaluate monolith vs. new service; no resolution yet',
        'Watch: fraud-domain validation in progress — getting time with Stacy & Co; Levi connecting with Sam Petrowski (ACH Ops) on initial signal list + costs',
      ],
    },
    {
      name: 'Menu Boards',
      updatedAt: '2026-06-18T17:18:00',
      bullets: [
        'Chris Ostrowski remains technical DRI; Cyril Van Dyke joining for e-commerce engineering representation',
        "Proposed approach (pending Chris's approval): finish building the feature in e-commerce first, then start the work to move it into Nexus — potentially with the same resources",
        'First users may access it through e-commerce, but it ultimately lands in Nexus on or shortly after Phase 1',
      ],
    },
    {
      name: 'Voice AI',
      updatedAt: '2026-06-18T17:18:00',
      bullets: [
        'Chris Ostrowski remains technical DRI; Cyril Van Dyke joining for e-commerce engineering representation',
        "Proposed approach (pending Chris's approval): finish building the feature in e-commerce first, then start the work to move it into Nexus — potentially with the same resources",
        'First users may access it through e-commerce, but it ultimately lands in Nexus on or shortly after Phase 1',
      ],
    },
  ],

  // Overarching DRI notes — cross-cutting decisions, risks, and actions from the
  // DRI sync. Rendered as its own section below the team list.
  driNotes: {
    title: 'DRI sync',
    updatedAt: '2026-06-23T16:00:00',
    decisions: [
      'Command Center open question (leadership input needed): can morning brief/today\'s pulse pieces be unblocked sooner so Reporting can piggyback on that work?',
      'QA resourcing resolved: Ben assigned as primary QA owner (automated e2e coverage + manual e2e as pieces come online). Cnochez added as backup — Ben goes on parental leave end of July. Ben and Don will coordinate with QIE for any testing-infra needs.',
      'Dex Phase 1 capped at 5 use cases to protect time for auditing, usability, and invocation (not adding more cases).',
      'Non-Dex build pattern: Chris O. requested a standard for non-Dex teams to build Dex-consumable features (separating data/action/presentation layers). Campbell accepted as a Phase 1 task.',
      'Inventory: Eric Livergood migrating off due to workload — Rex rotating in as back-end. Ned meeting with team today to set weekly goals.',
      'Friday show-and-tell at 1:30 PM ET — teams demo from the develop branch (merged work auto-deploys to dev). Budtender Reporting (Command Center/Reporting) is the lead demo.',
      'Command Center remains on hold until Reporting, Inventory Planning, and Signal Tower are complete.',
    ],
    watch: [
      'Consumer Pulse + ecomm dispensaries: unresolved question (16-reply thread) — should the survey display for dispensaries without a LeafLogix integration, and where does that data get stored?',
      'Signal Tower architecture decision: a hard production deadline is needed to evaluate monolith vs. new service approach — no resolution yet.',
      'Signal Tower + Reporting alignment: must coordinate on shared budtender performance/risk modal work to avoid duplicating effort.',
      'Inventory resourcing thin: Roey out until July 6; data DRI ownership unclear. BE refinement starts July 6.',
    ],
    actions: [
      'Chris O.: Weedmaps outreach — confirm data access for Customer Sentiment.',
      'Levi: Connect with Sam Petrowski (ACH Ops); define tight initial fraud signal list with costs and rollout plan.',
      'Gordy: Coordinate with PMs on Friday demo content (30-min slot); arrange Loom recordings of additional items for Tim.',
      'Chris Campbell: Clarify deploy behavior across repos (web API, database, services) for demo readiness.',
      'Ned: Meet with Inventory team today; set weekly goals.',
    ],
  },

  // Team roster — static, not per-day. Rendered on the Roster tab.
  // Columns: project, dri (Project DRI), pm, fe, be, de.
  roster: [
    { project: 'Command Center',  dri: 'Amanda',    pm: 'Gordy',     fe: '',        be: '',                      de: ''             },
    { project: 'Signal Tower',    dri: 'Levi',      pm: 'Marina',    fe: 'Ashley',  be: 'Casey',                 de: 'Cossin / Levi' },
    { project: 'Consumer Pulse',  dri: 'Eric R',    pm: 'Marina',    fe: 'Willian', be: 'Sarah / Hunter / Willian', de: 'Cossin'    },
    { project: 'Inventory',       dri: 'Ned',       pm: 'Gordy',     fe: 'Evan M',  be: 'Rex / Roey / Steven Morton', de: 'Cossin' },
    { project: 'Reports',         dri: 'Amanda',    pm: 'Marina',    fe: 'Mack',    be: 'Gardner / Seth / Luon', de: 'Cossin'       },
    { project: 'Menu Boards',     dri: 'Chris Ostrowski',            ecom: 'Cyril Van Dyke' },
    { project: 'Voice AI',        dri: 'Chris Ostrowski',            ecom: 'Cyril Van Dyke' },
    { project: 'Dex',             dri: 'Crispy',    pm: 'Gordy',     fe: 'Scott',   be: 'Driban',                de: 'Crispy'       },
    { project: 'Wayfinder',       dri: 'Livergood', pm: 'Livergood', fe: 'Roey',    be: 'Livergood / Roey',      de: 'Livergood'    },
  ],
};
