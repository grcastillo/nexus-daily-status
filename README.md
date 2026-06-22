# Nexus Daily Summary

A static page that hosts the live Nexus status board for executives. It replaces
the recurring Slack post: open it any time, scan every team at a glance, and see
exactly when each team was last updated.

It's a **single live board** — not a dated archive. You update teams as news comes
in throughout the day, and each team carries its own "last updated" timestamp.

**Open it:** [`index.html`](index.html) — plain HTML/CSS/JS, no build step.
Renders entirely from [`data.js`](data.js); works opened directly from disk or
served statically (it ships with the rest of `docs/` to the Nexus wiki).

## What's on the page

- **Header** — title, the board's date, and a countdown to the `7/20` launch
  (`N days to 7/20`), computed from the date — never hardcoded.
- **Status band** — health counts (`N on track`, `N with watch items`), the
  most-recent update time, and the monitoring items (watch / blocked) pulled to
  the top so risks are seen first.
- **Team list** — one collapsible row per team. Collapsed shows the one-line
  summary, status, and that team's own "Updated HH:MM". Expand for full bullets.
- **Roster tab** — static team ownership table (DRI / PM / FE / BE / DE).

The status indicator and one-line summary are **derived** from each team's
bullets (see [Inference rules](#inference-rules)); you don't write them.

## Posting an update

You update **only the teams that have news** — everything else stays as it was.

1. Copy the update text (one or more teams, Slack-style).
2. In Claude Code, paste it with a prompt like:

   > Update the Nexus Daily Summary:
   >
   > ```
   > Reporting
   > * Sales & revenue report shipped to staging
   > * No blockers
   >
   > Dex
   > * Workflow 2 in testing
   > ```

3. Claude rewrites those teams' `bullets` in [`data.js`](data.js) and stamps
   their `updatedAt` to the current time. Teams you didn't mention are untouched.
4. Reload the page — the updated teams show their new timestamp, and the banner's
   "Last updated" reflects the most recent change.

That's the whole loop: paste the changed teams → Claude updates `data.js` → reload.

**Other quick edits** (just ask Claude):
- *Add a team* — new entry in the `teams` array with bullets + `updatedAt`.
- *Remove a team* — delete its entry.
- *Change the board date* — update the top-level `date` (the countdown recomputes).

### How a team lands in `data.js`

`data.js` is the single source of truth — a top-level `date`, then a `teams`
array. Each team has raw bullets and its own timestamp:

```js
date: '2026-06-17',     // board date — header + countdown anchor
teams: [
  {
    name: 'Reporting',
    updatedAt: '2026-06-17T14:20:00',  // Eastern wall-clock; set to now (ET) on update
    bullets: [
      'Sales & revenue report shipped to staging',
      'Watch: Andrew/Mack coordination pending Marina prototypes',
    ],
  },
  // …
]
```

Bullets are stored **verbatim** (including any leading `Watch:` / `Blocked:`
tag). Status and summary are inferred at render time, so the inference rules
stay the single owner of classification.

`updatedAt` is **Eastern wall-clock** (a naive ISO timestamp, no offset). The
page renders it as `Mon D, H:MM AM/PM ET` for every viewer. When posting, set it
to the current Eastern time (`TZ=America/New_York date "+%Y-%m-%dT%H:%M:%S"`).

## Inference rules

Overall status and watch items are **separate** — a team can be on track and
still have items being monitored.

| Signal in a bullet | Effect |
| --- | --- |
| Starts with `Blocked:` (or "at risk", "stalled", …) | team **blocked** (red) — off track |
| Starts with `Watch:` | a **watch item** (amber) — monitored, does NOT change status |
| `No blockers` / plain progress | **on track** (green) |

A team is **on track** unless it has a `Blocked:` bullet. Watch items are
surfaced in the banner's "Monitoring" section and flagged with a gold accent on
the team row, but they don't demote the team's status. The one-line summary is
synthesized from the positive bullets (preferring a design-% or phase signal).

## Files

| File | Role |
| --- | --- |
| `index.html` | page shell |
| `styles.css` | styling (matches the vape-pages `nexus-kickoff` design) |
| `app.js` | render + inference: status, summary, countdown, timestamps, tabs |
| `data.js` | **the data** — board date + per-team bullets/timestamps + roster (edit this) |
| `README.md` | this file |

This directory is a self-contained static artifact, excluded from the VitePress
page graph (`srcExclude` in `docs/.vitepress/config.mts`) — the same pattern as
`docs/nexus-delta-report`.
