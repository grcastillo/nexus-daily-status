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
  date: '2026-06-22',

  // Teams. Order here is the display order. Each carries its own updatedAt.
  teams: [
    {
      name: 'Inventory Planning',
      updatedAt: '2026-06-22T13:40:00',
      bullets: [
        'SKU Table/View, SKU Table UI (with mock API), and back-end contracts / API all progressing this week',
        'Evan: reusable table UI component complete; working on SKU Table UI. Stephen: PR open for SKU view/table. Matt Cossin: S3→SQL dependency scoped and handed off to Stephen',
        'Rex and Ned onboarding this week; Rex working with Evan + Stephen on back-end contracts. Roey on vacation; Mike OOO today and rotating off the team',
        'Blocked: Snowflake → S3 → SQL Server pipeline not yet done — blocking final progress. A global concern, not just inventory. Escalated to Tim, Eric Livergood, Chris, and Tom',
      ],
    },
    {
      name: 'Dex',
      updatedAt: '2026-06-22T12:08:00',
      bullets: [
        'Phase 1 workflows in active implementation; scope locked at 5 use cases to preserve time for usability, invocation, and auditing',
        'Scott Dietrich: Slow-Movers ~80% done and working — reviewing code, then to Chris today; continuing Budtender Copilot threshold nudge with Gordy',
        'Campbell: finished observability improvements + dutchie-agent integration; reviewing Scott\'s code; investigating auditing capabilities',
        'Katie Goodwin: observability cards now per-item; adding invocation methods to prototype; mocking up "Dex in situ"',
        'Driban out ~2 weeks on paternity leave; his use case held for his return',
        'Product decisions: Phase 1 invocation uses two existing pathways only (in-context/inline deferred to Phase 2); free text allowed and captured as a build signal; auditing will lean toward a "done by Dex" flag per item + surfacing the person in conversation',
        'New ask from DRI sync: Chris O. requested an established pattern for non-Dex teams to build Dex-consumable features (separating data/action/presentation layers); Campbell accepted this as a Phase 1 task',
        'Watch: no performed-by field in the current audit flow — audit UX is clunky; Chris investigating',
      ],
    },
    {
      name: 'Command Center',
      updatedAt: '2026-06-18T15:58:00',
      paused: true,
      pausedReason: 'On hold — picked back up once Reporting, Inventory Planning, and Signal Tower are complete.',
      bullets: [
        'Roll-up surface — aggregates data from the other pages, so it resumes once Reporting, Inventory Planning, and Signal Tower are complete',
        'Resource shuffle: Mike Luon → Reports; Stephen Morton → Inventory Insights; Rex → Inventory Planning (back-end)',
        'Scott on Register Copilot',
      ],
    },
    {
      name: 'Reporting',
      updatedAt: '2026-06-22T13:28:00',
      bullets: [
        'Discount metrics (manual discount rate, average discount %) in flight; Matt and Casey pairing today to review PR and logic',
        'Friday demo target: first two tabs demoable for the 1:30 PM ET show-and-tell',
        'Fraud discovery kicking off — coordinating with Stacy & Co to validate fraud use cases and thresholds',
        'Coordination needed with Signal Tower + Mack to avoid duplicating risk-related work on the budtender performance/risk modal',
        'Watch: Snowflake stage DB is a demo risk — Don aligning with Luan on refresh scope',
      ],
    },
    {
      name: 'Customer Sentiment',
      updatedAt: '2026-06-22T13:52:00',
      bullets: [
        'Willian has two PRs ready for review (LeafLogix mock data + UI); Eric nearly done reviewing — flagged source type filtering as a backend impact item',
        'John has three consumer touchpoints prototyped (post-checkout survey, receipt QR code, order confirmation email); Marina reviewing language and UI',
        'Weedmaps data can be simulated internally via GoldDB for demo/dev — demo unblocked; production data access question remains open (Chris O. is DRI for outreach)',
        'Matt: V1 data modeling in GoldDB this week; Levi: Dagster enrichment job running every 8 hrs (cron until Ricardo returns), integrates once data flows to Snowflake',
        'Demo readiness: Willian finalizing UI with mock data for Friday; Sarah investigating retry mechanism for survey submission + confirming demo readiness; Eric beginning Google OAuth discovery',
        'Watch: source type filtering flagged by Eric as a backend impact item — needs investigation',
        'Watch: first-party review moderation approach still open — Marina working through dismiss/update flows',
      ],
    },
    {
      name: 'Signal Tower',
      updatedAt: '2026-06-22T13:28:00',
      bullets: [
        'Friday demo target: first two tabs demoable (settings + notifications) at the 1:30 PM ET show-and-tell',
        'Casey syncing with Ashley for click testing on alert configs and notification settings; Ashley merging PRs today + finalizing API contract with Casey',
        'Fraud discovery kicking off — getting time with Stacy & Co to validate fraud use cases and thresholds',
        'Coordination needed with Reporting (Mack) to avoid duplicating risk-related work on the budtender performance/risk modal',
        'Global permissions confirmed: org admins set thresholds + notifications at the highest level for the initial launch',
        'Compliance alerts (METRC sync errors, closeout discrepancies) will run nightly to manage cost; still investigating which sync errors are actionable vs. auto-resolving',
        'Watch: Snowflake stage DB is a demo risk — Don coordinating with Luan to assess scope',
        'Watch: fraud-domain validation in progress — getting time with Stacy & Co; Levi also connecting with Sam Petrowski (ACH Ops) on initial signal list + costs',
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
    updatedAt: '2026-06-22T14:00:00',
    decisions: [
      'QA resourcing resolved: Ben assigned as primary QA owner (automated e2e coverage + manual e2e as pieces come online). Cnochez added as backup — Ben goes on parental leave end of July. Ben and Don will coordinate with QIE for any testing-infra needs.',
      'Dex Phase 1 capped at 5 use cases to protect time for auditing, usability, and invocation (not adding more cases).',
      'Non-Dex build pattern: Chris O. requested a standard for non-Dex teams to build Dex-consumable features (separating data/action/presentation layers). Campbell accepted as a Phase 1 task.',
      'Inventory: Eric Livergood migrating off due to workload — Rex rotating in as back-end. Ned meeting with team today to set weekly goals.',
      'Friday show-and-tell at 1:30 PM ET — teams demo from the develop branch (merged work auto-deploys to dev). Budtender Reporting (Command Center/Reporting) is the lead demo.',
      'Command Center remains on hold until Reporting, Inventory Planning, and Signal Tower are complete.',
    ],
    watch: [
      'Weedmaps data access (biggest at-risk): Customer Sentiment is gated on whether Weedmaps data can be pulled — may require a commercial/permission agreement. Chris O. is DRI for outreach.',
      'Signal Tower fraud expertise: no SME yet to validate fraud use cases. Levi connecting with Sam Petrowski (ACH Ops) to define an initial signal list + confirm data availability and costs.',
      'Inventory resourcing thin: Roey out 2 weeks; Eric Livergood rotating off. Team still forming as Rex and Steven Morton ramp.',
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
