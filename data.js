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
      updatedAt: '2026-06-23T16:44:00',
      bullets: [
        'Replication PRs completing today — data starts flowing to all environments; Matt begins modeling tomorrow and meeting with Levi on themes/tagging pipeline',
        'ARMA PR ready for review and testing — Sarah targeting morning release, then shifting to front-end prototype work; sharing data flow diagram with team',
        'Willian: controllers + repositories in place with mocked data; all FE connected (Eric approved both PRs)',
        'John\'s updated prototype designs pushed to next week (stretched across multiple AI projects); Sarah confirmed she can work with existing designs in the meantime',
        'Marina: prototype cleanup in progress — refining brands, pain points, and chip layout, incorporating permissioning',
        'Amanda potentially taking on briefs work (raw data + AI queries)',
        'Weedmaps: Chris O. sent note to Weedmaps CPO (no response yet); Eric already pulling real data on develop for a couple of customers',
        'Watch: source type filtering flagged by Eric as a backend impact item — needs investigation',
        'Watch: auth issues testing PAPI endpoint; Rspec workaround required to run CI on VAPE',
        'Watch: unresolved — should survey display for ecomm dispensaries without a LeafLogix integration, and where does that data get stored?',
      ],
    },
    {
      name: 'Signal Tower',
      updatedAt: '2026-06-23T16:40:00',
      bullets: [
        'Service vs. monolith decision being finalized this week — current direction is monolith first, build service in parallel; Casey flagged post-launch migration doubles the timeline (2→4 weeks)',
        'Email notifications confirmed for Phase 1; Marina updating prototypes with email samples',
        'Permissioning for Signal Tower undefined — Marina defining and documenting today to unblock Casey on threshold and alert configs',
        'Matt Cossin: walking through discount/metric business logic with Silverblatt today; moving to void rate queries after — goal: business logic reviewed and queried by EOD',
        'Ashley Long: consolidated FE PR out for review; syncing with Mack on budtender performance page and risk score breakdown',
        'Demo data problem addressed: Mike Luan looped in to create refreshable external-facing demo data in Snowflake',
        'Loyalty fraud alerting meeting tomorrow with loyalty and marketing stakeholders',
        'Watch: compliance tab scope (Phase 1 vs Phase 2) still open — Marina reviewing with Katie',
        'Watch: alert freshness lag up to 2 hours from action to alert (1hr evaluation + 1hr Snowflake) — stakeholders need to be aware',
        'Watch: service vs. monolith architecture — decision targeted for this week; resolution needed before build continues at scale',
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
