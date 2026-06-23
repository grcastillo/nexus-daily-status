/*
 * Nexus Daily Summary — render + inference.
 */
(function () {
  'use strict';

  var DATA = window.NEXUS_DATA || { launchDate: '2026-07-20', launchLabel: '7/20', date: '', teams: [] };
  var MS_PER_DAY = 24 * 60 * 60 * 1000;

  // ── date helpers ──────────────────────────────────────────────────────────
  function parseDate(iso) {
    var p = String(iso).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function fmtFullDate(d) { return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); }
  function fmtShort(d)    { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function daysBetween(from, to) {
    var a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    var b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((b - a) / MS_PER_DAY);
  }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function fmtUpdated(iso) {
    if (!iso) return null;
    var m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!m) return null;
    var mo = +m[2] - 1, d = +m[3], h = +m[4], mi = +m[5];
    var ampm = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12 || 12;
    return MONTHS[mo] + ' ' + d + ', ' + h12 + ':' + pad2(mi) + ' ' + ampm + ' ET';
  }

  // ── status inference ──────────────────────────────────────────────────────
  var BLOCKER_RE = /\b(blocked|blocker|at risk|slipping|stalled)\b/i;

  function classifyBullet(text) {
    var t = text.trim();
    if (/^blocked\s*:/i.test(t))         return 'blocked';
    if (/^partial-blocked\s*:/i.test(t)) return 'partial-blocked';
    if (/^watch\s*:/i.test(t))           return 'watch';
    if (BLOCKER_RE.test(t) && !/\bno\s+blockers?\b/i.test(t)) return 'watch';
    return 'on-track';
  }

  function teamStatus(team) {
    if (team.paused) return 'paused';
    if (!team.bullets || !team.bullets.length) return 'pending';
    if (team.bullets.some(function (b) { return classifyBullet(b) === 'blocked'; })) return 'blocked';
    if (team.bullets.some(function (b) { return classifyBullet(b) === 'partial-blocked'; })) return 'partial-blocked';
    return 'on-track';
  }

  function hasWatchItems(team) {
    return (team.bullets || []).some(function (b) { return classifyBullet(b) === 'watch'; });
  }

  function watchBullets(team) {
    return team.bullets.filter(function (b) { return classifyBullet(b) === 'watch'; });
  }

  function blockedBullet(team) {
    for (var i = 0; i < team.bullets.length; i++) {
      if (classifyBullet(team.bullets[i]) === 'blocked') return team.bullets[i];
    }
    return null;
  }

  function stripTag(text) { return text.replace(/^\s*(partial-blocked|watch|blocked)\s*:\s*/i, '').trim(); }

  function summaryLine(team) {
    var pos = team.bullets.filter(function (b) { return classifyBullet(b) === 'on-track'; });
    var pool = pos.length ? pos : team.bullets.slice();
    var pick =
      pool.find(function (b) { return /design.*\d+\s*%|\d+\s*%.*design/i.test(b); }) ||
      pool.find(function (b) { return /\bphase\b|\bdesign\b|\bbuild\b|\btesting\b/i.test(b); }) ||
      pool[0] || '';
    return pick.split(/;|\. (?=[A-Z])/)[0].trim();
  }

  var STATUS_LABEL = { 'on-track': 'On track', 'partial-blocked': 'Partially blocked', blocked: 'Blocked', pending: 'No update yet', paused: 'On hold' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function statusChip(status) {
    return '<span class="status-chip ' + status + '">' + STATUS_LABEL[status] + '</span>';
  }

  // ── render program banner ─────────────────────────────────────────────────
  function renderBanner(teams) {
    var d      = parseDate(DATA.date);
    var launch = parseDate(DATA.launchDate);
    var n      = daysBetween(d, launch);

    var blockedTeams        = teams.filter(function (t) { return teamStatus(t) === 'blocked'; });
    var partialBlockedTeams = teams.filter(function (t) { return teamStatus(t) === 'partial-blocked'; });
    var pendingTeams        = teams.filter(function (t) { return teamStatus(t) === 'pending'; });
    var pausedTeams         = teams.filter(function (t) { return teamStatus(t) === 'paused'; });
    var watchingTeams       = teams.filter(function (t) { return teamStatus(t) !== 'paused' && hasWatchItems(t); });
    var onTrackCount        = teams.length - blockedTeams.length - partialBlockedTeams.length - pendingTeams.length - pausedTeams.length;

    var dateEl = document.getElementById('header-date');
    if (dateEl) dateEl.textContent = fmtFullDate(d);
    var ctdEl = document.getElementById('header-countdown');
    if (ctdEl) {
      if (n > 0)        ctdEl.textContent = n + ' days to ' + DATA.launchLabel;
      else if (n === 0) ctdEl.textContent = 'Launch day · ' + DATA.launchLabel;
      else              ctdEl.textContent = Math.abs(n) + ' days since ' + DATA.launchLabel;
    }

    var healthRows = '';
    healthRows +=
      '<div class="banner-health-row">' +
      '<span class="banner-health-dot on-track"></span>' +
      '<span class="banner-health-val">' + onTrackCount + '</span> ' +
      (onTrackCount === 1 ? 'team' : 'teams') + ' on track' +
      '</div>';
    if (blockedTeams.length) {
      healthRows +=
        '<div class="banner-health-row">' +
        '<span class="banner-health-dot blocked"></span>' +
        '<span class="banner-health-val">' + blockedTeams.length + '</span> blocked' +
        '</div>';
    }
    if (partialBlockedTeams.length) {
      healthRows +=
        '<div class="banner-health-row">' +
        '<span class="banner-health-dot partial-blocked"></span>' +
        '<span class="banner-health-val">' + partialBlockedTeams.length + '</span> partially blocked' +
        '</div>';
    }
    if (watchingTeams.length) {
      healthRows +=
        '<div class="banner-health-row">' +
        '<span class="banner-health-dot watch"></span>' +
        '<span class="banner-health-val">' + watchingTeams.length + '</span> with watch items' +
        '</div>';
    }
    if (pausedTeams.length) {
      healthRows +=
        '<div class="banner-health-row">' +
        '<span class="banner-health-dot paused"></span>' +
        '<span class="banner-health-val">' + pausedTeams.length + '</span> on hold' +
        '</div>';
    }
    if (pendingTeams.length) {
      healthRows +=
        '<div class="banner-health-row">' +
        '<span class="banner-health-dot pending"></span>' +
        '<span class="banner-health-val">' + pendingTeams.length + '</span> awaiting first update' +
        '</div>';
    }

    var latestIso = teams.reduce(function (max, t) {
      return (t.updatedAt && t.updatedAt > max) ? t.updatedAt : max;
    }, '');
    var latestStr = latestIso ? fmtUpdated(latestIso) : null;
    var updatedHtml = latestStr ? '<div class="banner-updated">Last updated ' + esc(latestStr) + '</div>' : '';

    var rightContent = '';

    if (blockedTeams.length) {
      var blockedRows = blockedTeams.map(function (t) {
        var b = blockedBullet(t);
        return (
          '<div class="banner-risk-row">' +
          '<div class="banner-risk-team">' + esc(t.name) +
          ' <span class="banner-risk-tag blocked">Blocked</span></div>' +
          (b ? '<div class="banner-risk-text">' + esc(stripTag(b)) + '</div>' : '') +
          '</div>'
        );
      }).join('');
      rightContent +=
        '<span class="banner-risks-label blocked">Action required</span>' + blockedRows;
    }

    if (partialBlockedTeams.length) {
      if (rightContent) rightContent += '<div class="banner-section-divider"></div>';
      var pbRows = partialBlockedTeams.map(function (t) {
        var pb = null;
        for (var i = 0; i < t.bullets.length; i++) {
          if (classifyBullet(t.bullets[i]) === 'partial-blocked') { pb = t.bullets[i]; break; }
        }
        return (
          '<div class="banner-risk-row">' +
          '<div class="banner-risk-team">' + esc(t.name) +
          ' <span class="banner-risk-tag partial-blocked">Partial block</span></div>' +
          (pb ? '<div class="banner-risk-text">' + esc(stripTag(pb)) + '</div>' : '') +
          '</div>'
        );
      }).join('');
      rightContent +=
        '<span class="banner-risks-label partial-blocked">Partially blocked</span>' + pbRows;
    }

    if (pausedTeams.length) {
      if (rightContent) rightContent += '<div class="banner-section-divider"></div>';
      var pausedRows = pausedTeams.map(function (t) {
        return (
          '<div class="banner-risk-row">' +
          '<div class="banner-risk-team">' + esc(t.name) +
          ' <span class="banner-risk-tag paused">On hold</span></div>' +
          (t.pausedReason ? '<div class="banner-risk-text">' + esc(t.pausedReason) + '</div>' : '') +
          '</div>'
        );
      }).join('');
      rightContent +=
        '<span class="banner-risks-label paused">On hold</span>' + pausedRows;
    }

    if (watchingTeams.length) {
      if (rightContent) rightContent += '<div class="banner-section-divider"></div>';
      var watchRows = watchingTeams.map(function (t) {
        var wb = watchBullets(t);
        var firstWatch = wb[0] ? stripTag(wb[0]) : '';
        var moreCount  = wb.length > 1 ? wb.length - 1 : 0;
        return (
          '<div class="banner-risk-row">' +
          '<div class="banner-risk-team">' + esc(t.name) +
          ' <span class="banner-risk-tag">Watch</span>' +
          (moreCount ? ' <span class="banner-risk-more">+' + moreCount + ' more</span>' : '') +
          '</div>' +
          (firstWatch ? '<div class="banner-risk-text">' + esc(firstWatch) + '</div>' : '') +
          '</div>'
        );
      }).join('');
      rightContent +=
        '<span class="banner-risks-label">Monitoring</span>' + watchRows;
    }

    if (!rightContent) {
      rightContent =
        '<span class="banner-risks-label all-clear">All clear</span>' +
        '<p class="all-clear-line">No blockers or watch items today.</p>';
    }

    var leftHtml =
      '<div class="banner-col">' +
      '<div class="banner-summary-label">Program health</div>' +
      '<div class="banner-health">' + healthRows + '</div>' +
      updatedHtml +
      '</div>';
    var rightHtml = '<div class="banner-col">' + rightContent + '</div>';

    var el = document.getElementById('day-lead');
    el.className = 'program-banner';
    el.innerHTML = leftHtml + '<div class="banner-divider"></div>' + rightHtml;

    document.title = 'Nexus Daily Summary · ' + fmtShort(d);
  }

  // ── render teams list ─────────────────────────────────────────────────────
  function renderTeams(teams) {
    var wrap = document.getElementById('teams-list');
    wrap.innerHTML = teams.map(function (team) {
      var status = teamStatus(team);

      if (status === 'pending') {
        return (
          '<details class="team pending">' +
          '<summary>' +
          '<div class="team-summary-body">' +
          '<span class="team-name">' + esc(team.name) + '</span>' +
          '<span class="team-oneliner">No status update posted yet.</span>' +
          '</div>' +
          '<div class="team-summary-meta">' + statusChip(status) + '</div>' +
          '</summary>' +
          '<div class="team-body"><p class="team-empty">This team has not posted an update yet.</p></div>' +
          '</details>'
        );
      }

      var line = (status === 'paused' && team.pausedReason) ? team.pausedReason : summaryLine(team);
      var items = team.bullets.map(function (b) {
        var c = classifyBullet(b);
        if (c === 'on-track') return '<li>' + esc(b) + '</li>';
        var tag = c === 'blocked' ? 'Blocked' : 'Watch';
        var cls = c === 'blocked' ? 'is-risk is-blocked' : 'is-risk';
        return (
          '<li class="' + cls + '">' +
          '<span class="bullet-risk-tag">' + tag + '</span>' +
          '<span>' + esc(stripTag(b)) + '</span>' +
          '</li>'
        );
      }).join('');

      var updatedStr = fmtUpdated(team.updatedAt);
      var updatedHtml = updatedStr
        ? '<span class="team-updated">Updated ' + esc(updatedStr) + '</span>'
        : '';

      var jiraChip = team.jiraUrl
        ? ' <a href="' + esc(team.jiraUrl) + '" target="_blank" rel="noopener" class="team-jira-chip">' +
          team.jiraUrl.split('/browse/')[1] + ' ↗</a>'
        : '';

      var detailsClass = 'team ' + status + (status !== 'paused' && hasWatchItems(team) ? ' has-watch' : '');
      return (
        '<details class="' + detailsClass + '">' +
        '<summary>' +
        '<div class="team-summary-body">' +
        '<div class="team-name-row"><span class="team-name">' + esc(team.name) + '</span>' + jiraChip + '</div>' +
        '<span class="team-oneliner">' + esc(line) + '</span>' +
        '</div>' +
        '<div class="team-summary-meta">' +
        statusChip(status) +
        updatedHtml +
        '</div>' +
        '</summary>' +
        '<div class="team-body"><ul class="bullets">' + items + '</ul></div>' +
        '</details>'
      );
    }).join('');
  }

  // ── render DRI notes ──────────────────────────────────────────────────────
  function renderDriNotes() {
    var n = DATA.driNotes;
    var el = document.getElementById('dri-notes');
    if (!n) { if (el) el.innerHTML = ''; return; }
    function group(title, cls, items) {
      var lis = (items || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
      return (
        '<div class="dri-group">' +
        '<h4 class="dri-group-title ' + cls + '">' + title + '</h4>' +
        '<ul>' + lis + '</ul>' +
        '</div>'
      );
    }
    var updated = fmtUpdated(n.updatedAt);
    el.innerHTML =
      '<div class="dri-card">' +
      '<div class="dri-head">' +
      '<span class="dri-title">' + esc(n.title || 'DRI notes') + '</span>' +
      (updated ? '<span class="dri-updated">Updated ' + esc(updated) + '</span>' : '') +
      '</div>' +
      (n.summary ? '<p class="dri-summary">' + esc(n.summary) + '</p>' : '') +
      '<div class="dri-grid">' +
      group('Decisions', 'decisions', n.decisions) +
      group('Watch &amp; risks', 'watch', n.watch) +
      group('Actions', 'actions', n.actions) +
      '</div>' +
      '</div>';
  }

  // ── render Phase 2 scope log ──────────────────────────────────────────────
  function renderScope() {
    var log = DATA.phase2Log || [];
    var el = document.getElementById('scope-content');
    if (!el) return;
    if (!log.length) {
      el.innerHTML = '<p class="empty-state">No Phase 2 scope decisions recorded yet.</p>';
      return;
    }

    var deferred = log.filter(function (e) { return e.decision === 'deferred'; });
    var restored = log.filter(function (e) { return e.decision === 'restored'; });
    var totalDeferred = deferred.reduce(function (n, e) { return n + (e.features || []).length; }, 0);
    var totalRestored = restored.reduce(function (n, e) { return n + (e.features || []).length; }, 0);

    var summaryHtml =
      '<div class="scope-summary">' +
      '<div class="scope-summary-item deferred">' +
      '<span class="scope-summary-count">' + totalDeferred + '</span>' +
      '<span class="scope-summary-label">features deferred to Phase 2</span>' +
      '</div>' +
      '<div class="scope-summary-divider"></div>' +
      '<div class="scope-summary-item restored">' +
      '<span class="scope-summary-count">' + totalRestored + '</span>' +
      '<span class="scope-summary-label">items restored to Phase 1</span>' +
      '</div>' +
      '<div class="scope-summary-divider"></div>' +
      '<div class="scope-summary-item neutral">' +
      '<span class="scope-summary-count">' + log.length + '</span>' +
      '<span class="scope-summary-label">scope decisions logged</span>' +
      '</div>' +
      '</div>';

    var sorted = log.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });

    var entriesHtml = sorted.map(function (entry) {
      var isRestored = entry.decision === 'restored';
      var decisionCls = isRestored ? 'restored' : 'deferred';
      var decisionLabel = isRestored ? 'Restored to Phase 1' : 'Deferred to Phase 2';
      var prUrl = 'https://github.com/GetDutchie/dutchie-nexus-prototype/pull/' + entry.pr;
      var dateStr = entry.date ? fmtShort(parseDate(entry.date)) : '';
      var featuresHtml = (entry.features || []).map(function (f) {
        return '<li>' + esc(f) + '</li>';
      }).join('');

      var jiraHtml = entry.jiraUrl
        ? '<a href="' + esc(entry.jiraUrl) + '" target="_blank" rel="noopener" class="scope-jira-link">' +
          entry.jiraUrl.split('/browse/')[1] + ' ↗</a>'
        : '';

      return (
        '<div class="scope-entry ' + decisionCls + '">' +
        '<div class="scope-entry-head">' +
        '<div class="scope-entry-left">' +
        '<span class="scope-area">' + esc(entry.area) + '</span>' +
        jiraHtml +
        '<span class="scope-decision-chip ' + decisionCls + '">' + esc(decisionLabel) + '</span>' +
        '</div>' +
        '<div class="scope-entry-meta">' +
        '<a href="' + esc(prUrl) + '" target="_blank" rel="noopener" class="scope-pr-link">PR #' + entry.pr + '</a>' +
        '<span class="scope-meta-sep">·</span>' +
        '<span class="scope-author">' + esc(entry.author) + '</span>' +
        '<span class="scope-meta-sep">·</span>' +
        '<span class="scope-date">' + esc(dateStr) + '</span>' +
        '</div>' +
        '</div>' +
        '<ul class="scope-features">' + featuresHtml + '</ul>' +
        (entry.note ? '<p class="scope-note">' + esc(entry.note) + '</p>' : '') +
        '</div>'
      );
    }).join('');

    el.innerHTML =
      summaryHtml +
      '<div class="sec-label" style="margin-top:20px">All scope decisions</div>' +
      entriesHtml;
  }

  // ── roster ────────────────────────────────────────────────────────────────
  var AV_COLORS = [
    '#7c3aed', '#db2777', '#0891b2', '#d97706', '#b45309', '#0284c7',
    '#065f46', '#0f766e', '#0369a1', '#15803d', '#6d28d9', '#be185d',
    '#4b5563', '#1d4ed8', '#9333ea', '#047857', '#374151', '#1e40af',
  ];
  function avColor(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return AV_COLORS[h % AV_COLORS.length];
  }
  function renderPeople(value) {
    if (!value) return '';
    return String(value).split('/').map(function (raw) {
      var name = raw.trim();
      if (!name) return '';
      var initial = name.charAt(0).toUpperCase();
      return '<span class="av" style="background:' + avColor(name) + '">' + esc(initial) + '</span>' + esc(name);
    }).filter(Boolean).join(' · ');
  }
  function roleChip(cls, label, value) {
    var people = renderPeople(value);
    if (!people) return '';
    return (
      '<span class="role-chip ' + cls + '">' +
      '<span class="role-lbl">' + label + '</span>' +
      people +
      '</span>'
    );
  }

  var ICON_ATTRS = 'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a7355" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var TEAM_ICONS = {
    'Command Center': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    'Signal Tower':   '<path d="M1.5 8.5A11 11 0 0 1 12 3a11 11 0 0 1 10.5 5.5"/><path d="M5 12a8 8 0 0 1 7-4 8 8 0 0 1 7 4"/><path d="M8.5 15.5A4 4 0 0 1 12 14a4 4 0 0 1 3.5 1.5"/><circle cx="12" cy="19" r="1" fill="#8a7355"/>',
    'Consumer Pulse': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/><polyline points="3 12 7 8 10 14 14 10 17 16 21 12" stroke-width="1.5"/>',
    'Inventory':      '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    'Reports':        '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>',
    'Dex':            '<path d="M12 2l2.4 6.9L21 9.3l-5.2 4 1.6 6.7L12 16.8 6.6 20l1.6-6.7-5.2-4 6.6-.4z"/>',
    'Wayfinder':      '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    'Menu Boards':    '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/><rect x="17" y="14" width="5" height="7" rx="1"/>',
    'Voice AI':       '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
  };
  function teamIcon(name) {
    var paths = TEAM_ICONS[name] || '<circle cx="12" cy="12" r="9"/>';
    return '<svg ' + ICON_ATTRS + '>' + paths + '</svg>';
  }
  function teamCategory(name) {
    return (name === 'Dex' || name === 'Voice AI') ? 'AI Surface' : 'Surface';
  }

  function renderRoster() {
    var roster = DATA.roster || [];
    var el = document.getElementById('roster-content');
    if (!roster.length) {
      el.innerHTML = '<p class="empty-state">No roster in <code>data.js</code>.</p>';
      return;
    }
    var cards = roster.map(function (r) {
      var topChips    = roleChip('r-dri', 'DRI', r.dri) + roleChip('r-pm', 'PM', r.pm);
      var bottomChips = roleChip('r-fe', 'FE', r.fe) + roleChip('r-be', 'BE', r.be) +
                        roleChip('r-de', 'DE', r.de) + roleChip('r-ecom', 'ECOM', r.ecom);
      return (
        '<div class="roster-grid-card">' +
        '<div class="roster-card-head">' +
        '<div class="icon-container">' + teamIcon(r.project) + '</div>' +
        '<div>' +
        '<div class="card-category">' + esc(teamCategory(r.project)) + '</div>' +
        '<div class="roster-card-name">' + esc(r.project) + '</div>' +
        '</div>' +
        '</div>' +
        (topChips ? '<div class="roles-top">' + topChips + '</div>' : '') +
        (bottomChips ? '<div class="roles-bottom">' + bottomChips + '</div>' : '') +
        '</div>'
      );
    }).join('');
    el.innerHTML = '<div class="roster-grid">' + cards + '</div>';
  }

  // ── tab switching ─────────────────────────────────────────────────────────
  function initTabs() {
    var links  = document.querySelectorAll('.nav-link');
    var panels = document.querySelectorAll('.tab-panel');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var tab = link.getAttribute('data-tab');
        links.forEach(function (l) { l.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        link.classList.add('active');
        var panel = document.getElementById('tab-' + tab);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ── init ──────────────────────────────────────────────────────────────────
  function init() {
    var teams = DATA.teams || [];
    if (!teams.length) {
      document.getElementById('day-lead').innerHTML =
        '<p class="empty-state">No teams yet — add them to <code>data.js</code>.</p>';
    } else {
      renderBanner(teams);
      renderTeams(teams);
    }
    renderDriNotes();
    renderScope();
    initTabs();
    renderRoster();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
