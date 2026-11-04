/* Dad Bard: app logic (vanilla JS, no build step) */
(function () {
  'use strict';
  var DATA = window.CC_DATA, Calc = window.CocktailCalc;
  var ING = DATA.ING, DRINKS = DATA.DRINKS, TECH = DATA.TECH;
  var STORE_KEY = 'dadbard.v1', OLD_KEY = 'specbook.v1';
  var ROOT_ORDER = ['Old-Fashioned', 'Martini', 'Daiquiri', 'Sidecar', 'Whiskey Highball', 'Flip'];
  var CATS = ['Andrew’s', 'Modern', 'Classic', 'Tiki'];
  var AV_LABEL = 'Andrew’s version';

  var SOURCES = [
    { k: 'dc', n: 'Death & Co' }, { k: 'wh', n: 'Death & Co: Welcome Home' }, { k: 'codex', n: 'Cocktail Codex' },
    { k: 'sc', n: 'Smuggler’s Cove' }, { k: 'ss', n: 'Sippin’ Safari' }, { k: 'tm', n: 'Tiki: Modern Tropical Cocktails' },
    { k: 'ox', n: 'Oxford Companion' }, { k: 'lq', n: 'Liquor.com' }, { k: 'df', n: 'Difford’s Guide' }, { k: 'im', n: 'Imbibe' }
  ];
  var XLINKS = [{ n: 'Difford’s Guide', site: 'diffordsguide.com' }, { n: 'Liquor.com', site: 'liquor.com' }, { n: 'Imbibe', site: 'imbibemagazine.com' }];
  var EQUIP = { 'shake': 'Shaker', 'dry-shake': 'Shaker', 'whip-shake': 'Shaker', 'stir': 'Mixing glass', 'swizzle': 'Swizzle stick',
    'flash-blend': 'Blender', 'muddle': 'Muddler', 'fat-wash': 'Freezer', 'fluffy-juice': 'Juicer', 'infusion': 'Infusion jar',
    'flamed-twist': 'Lighter', 'freeze': 'Freezer', 'foam': 'Shaker' };
  var METHOD_LABEL = { shake: 'Shake', dryshake: 'Dry shake', stir: 'Stir', build: 'Build', swizzle: 'Swizzle', blend: 'Flash blend', freeze: 'Freeze' };

  /* ---------- persistence ---------- */
  function load() {
    try { var u = JSON.parse(localStorage.getItem(STORE_KEY) || localStorage.getItem(OLD_KEY)); if (u && u.drinks) return u; } catch (e) {}
    return { drinks: {}, tech: {}, settings: { unit: 'oz' } };
  }
  var user = load();
  user.tech = user.tech || {}; user.settings = user.settings || { unit: 'oz' }; user.vsel = user.vsel || {};
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(user)); } catch (e) {} }
  function ud(id) { return user.drinks[id] || (user.drinks[id] = { notes: '', rating: 0, tried: false, verified: false, sources: {} }); }
  if (user.settings.coef) Calc.setCoefficients(user.settings.coef);

  /* ---------- derived data ---------- */
  var byId = {}, children = {};
  function mkVersion(d, v, label, mine) {
    return { label: label, mine: mine, spec: v.spec, m: v.m || d.m, tech: v.tech || d.tech, note: v.note || '', base: v.base || d.base,
      stats: Calc.compute(v.spec, v.m || d.m, ING) };
  }
  function deriveOne(d) {
      var vs = [];
      if (d.src === 'andrew' || d.mineMain) {
        vs.push(mkVersion(d, d, d.mainLabel || 'Andrew’s spec', true));
        (d.alts || []).forEach(function (a) { vs.push(mkVersion(d, a, a.label, true)); });
      } else {
        vs.push(mkVersion(d, d, 'Traditional', false));
        if (d.av) vs.push(mkVersion(d, d.av, d.av.label || AV_LABEL, true));
      }
      d.versions = vs;
      d.vdef = d.av && !d.match ? 1 : 0;
      if (d.av && d.match) d.vdef = 1;
      d.stats = vs[d.vdef].stats;
      d.strength = d.stats.finalMl ? Calc.strengthLabel(d.stats.finalAbv) : '—';
      var eq = {}, techs = {};
      vs.forEach(function (v) { v.tech.forEach(function (t) { techs[t] = 1; if (EQUIP[t]) eq[EQUIP[t]] = 1; }); });
      if (/crushed|pebble|cone/i.test(d.ice)) eq['Crushed ice'] = 1;
      d.allTech = Object.keys(techs);
      d.equip = Object.keys(eq);
      d.status = [];
      if (d.av && !d.match) d.status.push('Has Andrew’s version');
      if (d.fromNotes) d.status.push('In my notes');
      if (d.exp) d.status.push('Experimental');
      if (d.batch) d.status.push('Batch');
      if (allFlags(d).length) d.status.push('Needs my check');
      var words = [d.name, d.base, d.fam, d.cat, d.prov.who, d.prov.where, d.flav.join(' '), d.said || ''];
      vs.forEach(function (v) { v.spec.forEach(function (s) { words.push((s[3] && s[3].label) || (ING[s[2]] && ING[s[2]].n) || ''); }); });
      d.search = words.join(' ').toLowerCase();
          d.baseList = d.versions.map(function (v) { return v.base; });
      d.strengthList = [d.strength];
  }
  var VAR = {};
  function derive() {
    Object.keys(byId).forEach(function (k) { delete byId[k]; }); VAR = {};
    DRINKS.forEach(function (d) {
      d.variants = [d].concat(d.vars || []);
      d.variants.forEach(function (v, i) { deriveOne(v); byId[v.id] = d; VAR[v.id] = { main: d, i: i }; });
      function u(k) { var m = {}; d.variants.forEach(function (v) { (v[k] || []).forEach(function (x) { m[x] = 1; }); }); return Object.keys(m); }
      d.aBase = u('baseList'); d.aFlav = u('flav'); d.aTech = u('allTech'); d.aEquip = u('equip'); d.aStatus = u('status'); d.aStrength = u('strengthList');
      d.aSearch = d.variants.map(function (v) { return v.search + ' ' + (v.vlabel || '').toLowerCase(); }).join(' ');
    });
    children = {};
    DRINKS.forEach(function (d) {
      var p = d.parent && VAR[d.parent] ? VAR[d.parent].main.id : d.parent;
      if (p && p !== d.id) (children[p] = children[p] || []).push(d);
    });
  }
  function allVariants() { var a = []; DRINKS.forEach(function (d) { a = a.concat(d.variants); }); return a; }

  function allFlags(d) { return (d.flags || []).concat(d.av && d.av.flags || []); }
  derive();

  /* ---------- helpers ---------- */
  var $app = document.getElementById('app');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pct(x, dp) { return (x * 100).toFixed(dp == null ? 1 : dp) + '%'; }
  var FR = { 0: '', 0.125: '⅛', 0.25: '¼', 0.333: '⅓', 0.375: '⅜', 0.5: '½', 0.625: '⅝', 0.667: '⅔', 0.75: '¾', 0.875: '⅞' };
  function frac(x) {
    var w = Math.floor(x + 1e-9), r = x - w;
    for (var k in FR) { if (Math.abs(r - parseFloat(k)) < 0.02) return ((w ? w : '') + FR[k]) || '0'; }
    if (Math.abs(r - 1) < 0.02) return String(w + 1);
    return (Math.round(x * 100) / 100).toString();
  }
  function mlNum(oz) { var ml = oz * 30; return ml >= 20 ? Math.round(ml / 2.5) * 2.5 : Math.round(ml * 2) / 2; }
  function rng(a, b, f) { return b != null ? f(a) + '–' + f(b) : f(a); }
  function n(x) { return String(Math.round(x * 100) / 100); }
  function plural(c, s, p) { return c === 1 ? s : (p || s + 'es'); }
  function clean(nm) { return nm.replace(/, (float|drizzled over|served on the side|on top)$/i, ''); }
  function fmtItem(it, serves, unit) {
    var o = it[3] || {}, a = it[0] * serves, b = o.to != null ? o.to * serves : null, u = it[1];
    var ing = ING[it[2]] || {}, name = o.label || ing.n || it[2], amt;
    switch (u) {
      case 'oz': amt = unit === 'ml' ? rng(a, b, mlNum) + ' ml' : rng(a, b, frac) + ' oz'; break;
      case 'ml': amt = rng(a, b, n) + ' ml' + (unit === 'oz' ? ' (≈' + rng(a / 29.57, b && b / 29.57, function (x) { return Math.round(x); }) + ' oz)' : ''); break;
      case 'top': amt = 'Top · ' + (unit === 'ml' ? mlNum(a) + ' ml' : frac(a) + ' oz'); break;
      case 'dash': amt = rng(a, b, n) + ' ' + plural(b || a, 'dash'); break;
      case 'drop': amt = rng(a, b, n) + ' ' + plural(b || a, 'drop', 'drops'); break;
      case 'tsp': amt = rng(a, b, frac) + ' tsp'; break;
      case 'tbsp': amt = rng(a, b, frac) + ' tbsp'; break;
      case 'bsp': amt = rng(a, b, frac) + ' barspoon' + ((b || a) > 1 ? 's' : ''); break;
      case 'white': amt = rng(a, b, frac); name = o.label || 'Egg white'; break;
      case 'egg': amt = rng(a, b, frac); name = o.label || 'Whole egg'; break;
      case 'leaf': amt = rng(a, b, n) + ' ' + ((b || a) === 1 ? 'leaf' : 'leaves'); break;
      case 'slice': amt = rng(a, b, n) + ' ' + plural(b || a, 'slice', 'slices'); break;
      case 'sprig': amt = rng(a, b, n) + ' ' + plural(b || a, 'sprig', 'sprigs'); break;
      case 'coin': amt = rng(a, b, n) + ' ' + plural(b || a, 'coin', 'coins'); break;
      case 'whole': case 'piece': amt = rng(a, b, n); break;
      case 'pinch': amt = rng(a, b, n) + ' ' + plural(a, 'pinch'); break;
      case 'handful': amt = rng(a, b, n) + ' ' + plural(a, 'handful', 'handfuls'); break;
      case 'rinse': amt = /mist/i.test(name) ? 'Mist' : 'Rinse'; break;
      case 'free': amt = 'From the heart'; break;
      case 'garnish': amt = 'Garnish'; break;
      default: amt = a + ' ' + u;
    }
    var tag = o.opt ? 'optional' : o.side ? 'side' : (o.post && u !== 'top' ? 'float' : '');
    return { amt: amt, name: (o.side || o.post) ? clean(name) : name, note: o.note || '', tag: tag, prep: ing.prep };
  }
  function gl(g) { if (!g) return 'your glass of choice'; g = g.toLowerCase(); return /glass|mug|coupe|flute|nick|bowl/.test(g) ? g : g + ' glass'; }
  function methodText(d, v) {
    if (d.method && v.label !== 'Traditional') return d.method;
    var up = /^up$/i.test(d.ice), muddle = v.tech.indexOf('muddle') > -1, ice = d.ice ? d.ice.toLowerCase() : 'ice';
    var tops = [], floats = [], sides = [], rinses = [];
    v.spec.forEach(function (it) {
      var o = it[3] || {}, nm = clean(o.label || ING[it[2]].n);
      if (o.side) sides.push(nm); else if (it[1] === 'rinse') rinses.push(nm);
      else if (it[1] === 'top') tops.push(nm); else if (o.post) floats.push(nm);
    });
    var into = up ? 'Fine-strain into a chilled ' + gl(d.glass) + '.' : d.glass ? 'Strain into a ' + gl(d.glass) + ' over ' + ice + '.' : 'Strain into your glass of choice.';
    var s = [];
    if (rinses.length) s.push('Coat the chilled glass with ' + rinses.join(', ') + ' and discard the excess.');
    if (muddle) s.push('Gently muddle the fresh ingredients in the tin first.');
    switch (v.m) {
      case 'shake': s.push((muddle ? 'Add the rest' : 'Add everything') + ' with ice and shake hard for 10–12 seconds.', into); break;
      case 'dryshake': s.push('Shake without ice to build foam, then add ice and shake hard again.', into); break;
      case 'stir': s.push('Stir with ice for 20–30 seconds until cold and silky.', into); break;
      case 'build': s.push('Build in a chilled ' + gl(d.glass) + (up ? '' : ' over ' + ice) + '.'); break;
      case 'swizzle': s.push('Add to a ' + gl(d.glass) + ' with crushed ice and swizzle until the glass frosts. Top with more crushed ice.'); break;
      case 'blend': s.push('Flash-blend with crushed ice for about 5 seconds (or shake hard with crushed ice) and pour everything into a ' + gl(d.glass) + '.'); break;
      case 'freeze': s.push('Combine and freeze.'); break;
    }
    if (tops.length) s.push('Top with ' + tops.join(' and ') + ', then lift gently once.');
    if (floats.length) s.push('Float ' + floats.join(', ') + ' on top.');
    if (sides.length) s.push('Serve ' + sides.join(', ') + ' on the side.');
    if (d.components) s.push('Finish with the ' + d.components.map(function (c) { return c.name.replace(/ \(.*\)$/, '').toLowerCase(); }).join(' and ') + '.');
    if (d.garnish && !/^none/i.test(d.garnish)) s.push('Garnish: ' + d.garnish.charAt(0).toLowerCase() + d.garnish.slice(1) + '.');
    return s.join(' ');
  }
  // what changed between two specs (by ingredient)
  function diffSpecs(a, b, unit) {
    function idx(spec) { var m = {}; spec.forEach(function (it) { var k = it[2] + '|' + ((it[3] || {}).label || ''); if (it[1] === 'white' || it[1] === 'egg') k = it[1]; if (!m[it[2]] ) m[it[2]] = it; }); return m; }
    var A = idx(a), B = idx(b), out = [];
    Object.keys(B).forEach(function (k) {
      var fb = fmtItem(B[k], 1, unit);
      if (!A[k]) out.push({ t: 'add', s: fb.name + ' (' + fb.amt + ')' });
      else { var fa = fmtItem(A[k], 1, unit); if (fa.amt !== fb.amt || !!(A[k][3] || {}).opt !== !!(B[k][3] || {}).opt) out.push({ t: 'chg', s: fb.name + ': ' + fa.amt + ' → ' + fb.amt + (fb.tag === 'optional' ? ' (optional)' : '') }); }
    });
    Object.keys(A).forEach(function (k) { if (!B[k]) out.push({ t: 'rem', s: fmtItem(A[k], 1, unit).name }); });
    return out;
  }
  function overlap(id) { var s = (user.drinks[id] || {}).sources || {}; return Object.keys(s).filter(function (k) { return s[k]; }).length; }
  function catClass(c) { return 'cat-' + (c === 'Andrew’s' ? 'andrew' : c.toLowerCase()); }
  function link(href, html, cls) { return '<a href="' + href + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + html + '</a>'; }
  function confBadge(c) { return c === 'own' ? '<span class="conf conf-own">house recipe</span>' : '<span class="conf conf-' + c + '">' + c + ' confidence</span>'; }
  function flagBox(list) { return list.length ? '<div class="flagbox"><b>⚑ Needs your check</b><ul>' + list.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>' : ''; }

  /* ---------- browse ---------- */
  var FILTERS = [
    { k: 'status', n: 'From my notes', get: function (d) { return d.aStatus; }, order: ['In my notes', 'Has Andrew’s version', 'Experimental', 'Batch', 'Needs my check'] },
    { k: 'base', n: 'Base spirit', get: function (d) { return d.aBase; } },
    { k: 'fam', n: 'Family', get: function (d) { return [d.fam]; }, order: ROOT_ORDER },
    { k: 'flav', n: 'Flavor', get: function (d) { return d.aFlav; } },
    { k: 'tech', n: 'Technique', get: function (d) { return d.aTech.map(function (t) { return TECH[t].t; }); } },
    { k: 'strength', n: 'Strength', get: function (d) { return d.aStrength; }, order: ['Light', 'Medium', 'Strong'] },
    { k: 'equip', n: 'Equipment', get: function (d) { return d.aEquip; } }
  ];
  var state = { q: '', cat: '', f: {}, sort: 'az', showFilters: false };
  FILTERS.forEach(function (g) { state.f[g.k] = {}; });
  function activeCount() { var c = 0; FILTERS.forEach(function (g) { c += Object.keys(state.f[g.k]).length; }); return c; }
  function matches(d) {
    if (state.cat && d.cat !== state.cat) return false;
    if (state.q) {
      var toks = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < toks.length; i++) if (d.aSearch.indexOf(toks[i]) < 0) return false;
    }
    for (var j = 0; j < FILTERS.length; j++) {
      var g = FILTERS[j], sel = Object.keys(state.f[g.k]);
      if (!sel.length) continue;
      var vals = g.get(d);
      if (!sel.some(function (s) { return vals.indexOf(s) > -1; })) return false;
    }
    return true;
  }
  function sorted(list) {
    var by = {
      az: function (a, b) { return a.name.localeCompare(b.name); },
      strong: function (a, b) { return b.stats.finalAbv - a.stats.finalAbv; },
      light: function (a, b) { return a.stats.finalAbv - b.stats.finalAbv; },
      rated: function (a, b) { return ((user.drinks[b.id] || {}).rating || 0) - ((user.drinks[a.id] || {}).rating || 0) || a.name.localeCompare(b.name); },
      sources: function (a, b) { return overlap(b.id) - overlap(a.id) || a.name.localeCompare(b.name); }
    }[state.sort];
    var q = state.q.trim().toLowerCase();
    if (!q) return list.slice().sort(by);
    function rank(d) { var n = d.name.toLowerCase(); if (n === q) return 0; if (n.indexOf(q) === 0) return 1; if (n.indexOf(q) > -1) return 2;
      if (d.variants.some(function (v) { return (v.name + ' ' + (v.vlabel || '')).toLowerCase().indexOf(q) > -1; })) return 3; return 4; }
    return list.slice().sort(function (a, b) { return rank(a) - rank(b) || by(a, b); });
  }
  var ROOT_COLORS = { 'Old-Fashioned': '#d6a24a', 'Martini': '#9bb7cf', 'Daiquiri': '#8fc04a', 'Sidecar': '#f39a3c', 'Whiskey Highball': '#74bfa1', 'Flip': '#c9a0dc' };
  var BASE_ICON = { Cachaça: '🇧🇷', Whiskey: '🥃', Gin: '🌲', Rum: '🏝️', Agave: '🌵', Brandy: '🍇', Vodka: '🧊', 'Amaro & Liqueur': '🌿', 'Wine & Sherry': '🍷', Aquavit: '🌾' };
  var FLAV_ICON = { citrusy: '🍋', refreshing: '💧', 'spirit-forward': '🥃', rich: '🍫', bitter: '🖤', herbal: '🌿', fruity: '🍓', tropical: '🍍', floral: '🌸', spicy: '🌶️', smoky: '🔥', nutty: '🌰', creamy: '🥛', coffee: '☕', sweet: '🍬', savory: '🧂' };
  var STATUS_ICON = { 'In my notes': '✍️', 'Has Andrew’s version': '🎻', 'Experimental': '🧪', 'Batch': '🛢️', 'Needs my check': '⚑' };
  var STRENGTH_ICON = { Light: '🪶', Medium: '⚖️', Strong: '🔥' };
  var CAT_ICON = { 'Andrew’s': '🎻', Modern: '✨', Classic: '🎩', Tiki: '🌺' };
  var GROUP_ICON = { status: STATUS_ICON, base: BASE_ICON, flav: FLAV_ICON, strength: STRENGTH_ICON };

  /* tiles: big icon tiles in a horizontal rail. pills: compact pill row. Both multi-purpose. */
  function tiles(name, items, isOn, cls) {
    return '<div class="rail ' + (cls || '') + '">' + items.map(function (it) {
      return '<button class="tile' + (isOn(it.v) ? ' on' : '') + '" data-tap="' + name + '" data-v="' + esc(it.v) + '"' + (it.color ? ' style="--c:' + it.color + '"' : '') + '>' +
        '<i>' + (it.icon || '') + '</i><span>' + esc(it.label) + '</span>' + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + (it.count != null ? '<b>' + it.count + '</b>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function pills(name, items, isOn) {
    return '<div class="pillbar">' + items.map(function (it) {
      return '<button class="' + (isOn(it.v) ? 'on' : '') + '" data-tap="' + name + '" data-v="' + esc(it.v) + '"' + (it.color ? ' style="--c:' + it.color + '"' : '') + '>' +
        (it.icon ? '<i>' + it.icon + '</i>' : '') + esc(it.label) + (it.count != null ? ' <span>' + it.count + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function onTap(name, fn) { $app.querySelectorAll('[data-tap="' + name + '"]').forEach(function (b) { b.onclick = function () { fn(b.dataset.v, b); }; }); }
  function card(d) {
    var u = user.drinks[d.id] || {};
    var marks = (d.variants.length > 1 ? '<span class="mk vars">' + d.variants.length + ' styles</span>' : '') +
      (d.aStatus.indexOf('Has Andrew’s version') > -1 ? '<span class="mk av" title="Andrew’s version">AV</span>' : '') + (d.exp ? '<span class="mk exp" title="Experimental">exp.</span>' : '') +
      (d.batch ? '<span class="mk">batch</span>' : '') + (d.aStatus.indexOf('Needs my check') > -1 ? '<span class="mk flag" title="Needs your check">⚑</span>' : '') +
      (u.rating ? '<span class="mk star">' + '★'.repeat(u.rating) + '</span>' : '');
    return '<li><a class="card" href="#/d/' + d.id + '" style="--c:' + ROOT_COLORS[d.fam] + '"><div class="cmain"><div class="cname">' + esc(d.name) +
      (u.notes ? ' <span class="dot" title="Has notes"></span>' : '') + (u.verified ? ' <span class="tick" title="Spec verified">✓</span>' : '') + '</div>' +
      '<div class="csub">' + (BASE_ICON[d.versions[d.vdef].base] || '') + ' ' + esc(d.aBase.length > 1 ? d.aBase.slice(0, 3).join(' / ') : d.versions[d.vdef].base) + ' · ' + esc(d.fam) + ' · ' + METHOD_LABEL[d.versions[d.vdef].m] + '</div>' + (marks ? '<div class="marks">' + marks + '</div>' : '') + '</div>' +
      '<div class="cside"><span class="pill ' + catClass(d.cat) + '">' + d.cat + '</span><span class="abv">' + (d.stats.finalMl ? pct(d.stats.finalAbv, 0) : '—') + '</span></div></a></li>';
  }

  function renderBrowse() {
    var list = sorted(DRINKS.filter(matches)), ac = activeCount();
    var inCat = DRINKS.filter(function (d) { return !state.cat || d.cat === state.cat; });
    var counts = {}; DRINKS.forEach(function (d) { counts[d.cat] = (counts[d.cat] || 0) + 1; });
    function vals(g) { var v = {}; inCat.forEach(function (d) { g.get(d).forEach(function (x) { v[x] = (v[x] || 0) + 1; }); }); return v; }
    var baseG = FILTERS.filter(function (g) { return g.k === 'base'; })[0], bv = vals(baseG);
    var h = '<header class="top hero"><div class="brand"><img src="icons/icon-192.png" alt="" class="logo"><div><h1>Dad Bard <span class="sym">🪕</span></h1><p class="tagline">Songs of the home bar, sung slightly off-key</p></div></div>' +
      '<div class="searchrow"><input id="q" type="search" placeholder="Search drinks, ingredients, creators" value="' + esc(state.q) + '" autocomplete="off">' +
      '<button id="ftoggle" class="btn filterbtn ' + (ac ? 'on' : '') + '">⚙︎ Filters' + (ac ? ' <b>' + ac + '</b>' : '') + '</button></div>' +
      pills('cat', [{ v: '', label: 'All', icon: '✦', count: DRINKS.length }].concat(CATS.map(function (c) { return { v: c, label: c, icon: CAT_ICON[c], count: counts[c] }; })), function (v) { return v === state.cat; }) +
      tiles('base', Object.keys(bv).sort(function (a, b) { return bv[b] - bv[a]; }).map(function (b) { return { v: b, label: b.replace(' & Liqueur', '').replace(' & Sherry', ' & sherry'), icon: BASE_ICON[b], count: bv[b] }; }), function (v) { return state.f.base[v]; }, 'spirits');
    // active filter chips
    var act = [];
    FILTERS.forEach(function (g) { Object.keys(state.f[g.k]).forEach(function (v) { act.push('<button class="achip" data-tap="achip" data-v="' + g.k + '|' + esc(v) + '">' + ((GROUP_ICON[g.k] || {})[v] || '') + ' ' + esc(v) + ' <b>×</b></button>'); }); });
    if (act.length) h += '<div class="achips">' + act.join('') + '<button class="achip clear" id="fclear2">Clear all</button></div>';
    h += '<div class="sortrow"><span class="muted">' + list.length + ' of ' + DRINKS.length + ' songs</span>' +
      '<select id="sort"><option value="az">A–Z</option><option value="rated">My rating</option><option value="strong">Strongest</option><option value="light">Lightest</option><option value="sources">Most sources ticked</option></select></div></header>';
    h += '<ul class="cards">' + list.map(card).join('') + '</ul>';
    if (!list.length) h += '<p class="empty">No ballad by that name. Try another verse, or clear a filter.</p>';
    // bottom sheet
    if (state.showFilters) {
      h += '<div class="sheet-bg" id="sheetbg"></div><div class="sheet" id="sheet"><div class="grab"></div><div class="sheet-head"><b>Filters</b>' + (ac ? '<button id="fclear" class="btn ghost small">Clear all</button>' : '') + '</div><div class="sheet-body">';
      FILTERS.forEach(function (g) {
        if (g.k === 'base') return;
        var v = vals(g), keys = g.order ? g.order.filter(function (k) { return v[k]; }) : Object.keys(v).sort();
        if (!keys.length) return;
        h += '<div class="fgroup"><div class="flabel">' + g.n + '</div>';
        if (g.k === 'fam') h += tiles('f-fam', keys.map(function (k) { return { v: k, label: k, icon: '<em class="dotc"></em>', color: ROOT_COLORS[k], count: v[k] }; }), function (x) { return state.f.fam[x]; }, 'fams');
        else h += pills('f-' + g.k, keys.map(function (k) { return { v: k, label: k, icon: (GROUP_ICON[g.k] || {})[k], count: v[k] }; }), function (x) { return state.f[g.k][x]; });
        h += '</div>';
      });
      h += '</div><button id="fdone" class="btn primary">Show ' + list.length + ' songs</button></div>';
    }
    var prevSheet = document.querySelector('.sheet-body'), sheetY = prevSheet ? prevSheet.scrollTop : 0;
    $app.innerHTML = h;
    var nb = document.querySelector('.sheet-body'); if (nb) nb.scrollTop = sheetY;
    document.body.classList.toggle('noscroll', !!state.showFilters);
    var q = document.getElementById('q');
    q.addEventListener('input', function () { state.q = q.value; var pos = q.selectionStart; keep(renderBrowse); var nq = document.getElementById('q'); nq.focus(); nq.setSelectionRange(pos, pos); });
    document.getElementById('sort').value = state.sort;
    document.getElementById('sort').onchange = function (e) { state.sort = e.target.value; renderBrowse(); };
    document.getElementById('ftoggle').onclick = function () { state.showFilters = true; keep(renderBrowse); };
    onTap('cat', function (v) { state.cat = v; keep(renderBrowse); });
    function tog(k, v) { if (state.f[k][v]) delete state.f[k][v]; else state.f[k][v] = 1; keep(renderBrowse); }
    onTap('base', function (v) { tog('base', v); });
    FILTERS.forEach(function (g) { onTap('f-' + g.k, function (v) { tog(g.k, v); }); });
    onTap('achip', function (v) { var i = v.indexOf('|'); tog(v.slice(0, i), v.slice(i + 1)); });
    function clearAll() { FILTERS.forEach(function (g) { state.f[g.k] = {}; }); keep(renderBrowse); }
    ['fclear', 'fclear2'].forEach(function (id) { var b = document.getElementById(id); if (b) b.onclick = clearAll; });
    function close() { state.showFilters = false; keep(renderBrowse); }
    var bg = document.getElementById('sheetbg'); if (bg) bg.onclick = close;
    var dn = document.getElementById('fdone'); if (dn) dn.onclick = close;
  }

  /* ---------- detail ---------- */
  var serves = 1;
  function specList(spec, unit, mult) {
    return '<ul class="spec">' + spec.map(function (it) {
      var f = fmtItem(it, mult, unit);
      var nm = f.prep ? link('#/t/' + f.prep, esc(f.name), 'preplink') : esc(f.name);
      return '<li' + (f.tag === 'optional' ? ' class="opt"' : '') + '><span class="amt">' + esc(f.amt) + '</span><span class="ing">' + nm + (f.tag ? ' <em class="tag">' + f.tag + '</em>' : '') +
        (f.note ? '<small>' + esc(f.note) + '</small>' : '') + '</span></li>';
    }).join('') + '</ul>';
  }
  function renderDrink(id) {
    var vm = VAR[id]; if (!vm) return renderBrowse();
    var main = vm.main, vIdx = vm.i, d = main.variants[vIdx];
    var u = ud(id), unit = user.settings.unit;
    var vi = user.vsel[id] != null && d.versions[user.vsel[id]] ? user.vsel[id] : d.vdef;
    var v = d.versions[vi], st = v.stats;
    var batchWord = d.batch ? (serves === 1 ? '1 batch' : serves + '× batch') : serves + ' ' + (serves === 1 ? 'serve' : 'serves');

    var h = '<header class="top detail"><a href="#/" class="back">‹ Songbook</a>' +
      '<h1>' + esc(main.name) + '</h1>' +
      (main.variants.length > 1 ? '<div class="varpick"><div class="flabel">Style · ' + main.variants.length + '</div>' +
        pills('variant', main.variants.map(function (v) { return { v: v.id, label: v.vlabel || v.name, icon: v.fromNotes ? '✍️' : '' }; }), function (v) { return v === d.id; }) +
        (vIdx ? '<p class="varname">' + esc(d.name) + (d.changed ? ' · <span class="muted">' + esc(d.changed) + '</span>' : '') + '</p>' : '') + '</div>' : '') +
      '<div class="badges"><span class="pill ' + catClass(d.cat) + '">' + d.cat + '</span>' +
      (d.exp ? '<span class="pill exp">Experimental</span>' : '') + (d.batch ? '<span class="pill">Batch</span>' : '') +
      '<span class="pill">' + esc(d.fam) + ' family</span><span class="pill">' + esc(v.base) + '</span>' + (st.finalMl ? '<span class="pill">' + Calc.strengthLabel(st.finalAbv) + '</span>' : '') + '</div>' +
      (d.famNote ? '<p class="muted small">' + esc(d.famNote) + '</p>' : '') + '</header>';

    h += flagBox(allFlags(d));

    h += '<section class="panel controls"><div class="seg"><button data-u="oz" class="' + (unit === 'oz' ? 'on' : '') + '">oz</button><button data-u="ml" class="' + (unit === 'ml' ? 'on' : '') + '">ml</button></div>' +
      '<div class="scaler"><button id="sminus" aria-label="Fewer">−</button><span>' + batchWord + '</span><button id="splus" aria-label="More">+</button></div></section>';

    // spec with version tabs
    h += '<section class="panel' + (v.mine ? ' mine' : '') + '">';
    if (d.versions.length > 1) {
      h += '<div class="vtabs">' + d.versions.map(function (x, i) { return '<button data-v="' + i + '" class="' + (i === vi ? 'on' : '') + (x.mine ? ' minev' : '') + '">' + (x.mine ? '🎻 ' : '') + esc(x.label) + '</button>'; }).join('') + '</div>';
    } else h += '<h2>' + (v.mine ? '🎻 ' + esc(v.label) : 'Spec') + '</h2>';
    if (d.match) h += '<p class="matchnote">✓ Your notes match the traditional spec' + (d.av && d.av.note ? '. ' + esc(d.av.note) : '.') + '</p>';
    else if (v.note) h += '<p class="vnote">' + esc(v.note) + '</p>';
    h += specList(v.spec, unit, serves);
    (d.components || []).forEach(function (c) {
      if (v.label === 'Traditional') return;
      h += '<h3>' + esc(c.name) + '</h3>' + specList(c.spec, unit, serves) + (c.note ? '<p class="muted small">' + esc(c.note) + '</p>' : '');
    });
    if (d.versions.length > 1 && !d.match) {
      var other = d.versions[vi === 0 ? 1 : 0], df = vi === 0 ? diffSpecs(v.spec, other.spec, unit) : diffSpecs(other.spec, v.spec, unit);
      if (df.length) h += '<details class="diff"><summary>What changed: ' + esc(d.versions[0].label) + ' → ' + esc(d.versions[1].label) + '</summary><ul>' +
        df.map(function (x) { return '<li class="d-' + x.t + '">' + (x.t === 'add' ? '+ ' : x.t === 'rem' ? '− ' : '~ ') + esc(x.s) + '</li>'; }).join('') + '</ul></details>';
    }
    h += '<div class="kv">' + (d.glass ? '<div><span>Glass</span>' + esc(d.glass) + '</div>' : '<div><span>Glass</span><i class="muted">Not in notes</i></div>') +
      (d.ice ? '<div><span>Ice</span>' + esc(d.ice) + '</div>' : '') + (d.garnish ? '<div><span>Garnish</span>' + esc(d.garnish) + '</div>' : '') + '</div>' +
      '<h3>Method</h3><p>' + esc(methodText(d, v)) + '</p>' +
      '<div class="chips static">' + v.tech.map(function (t) { return link('#/t/' + t, esc(TECH[t].t), 'chip'); }).join('') + '</div></section>';

    // stats
    h += '<section class="panel"><h2>The numbers' + (d.versions.length > 1 ? ' <span class="muted small">· ' + esc(v.label) + '</span>' : '') + '</h2>';
    if (!st.finalMl) h += '<p class="muted">No amounts in your notes, so there’s nothing to calculate. Pour from the heart.</p>';
    else {
      h += '<div class="stats">' +
        '<div><b>' + pct(st.finalAbv) + '</b><span>Final ABV</span></div>' +
        '<div><b>' + (unit === 'ml' ? Math.round(st.finalMl * serves) + ' ml' : (st.finalMl / Calc.ML_PER_OZ * serves).toFixed(1) + ' oz') + '</b><span>Final volume</span></div>' +
        '<div><b>' + pct(st.mixAbv) + '</b><span>ABV before ice</span></div>' +
        '<div><b>' + pct(st.dilution, 0) + '</b><span>Water added</span></div>' +
        '<div><b>' + st.sugarPer100.toFixed(1) + ' g</b><span>Sugar / 100 ml</span></div>' +
        '<div><b>' + st.acidPct.toFixed(2) + '%</b><span>Acid</span></div></div>' +
        '<p class="muted small">Model: ' + esc(st.model) + '. ' + (st.warn ? esc(st.warn) + ' ' : '') +
        (v.spec.some(function (s) { return s[3] && s[3].to != null; }) ? 'Ranges use the midpoint. ' : '') +
        (v.spec.some(function (s) { return s[3] && s[3].opt; }) ? 'Optional items aren’t counted. ' : '') +
        link('#/t/dilution-math', 'How this is calculated') + '</p>';
    }
    h += '</section>';

    // lineage
    var par = d.parent ? byId[d.parent] : null, kids = vIdx ? [] : (children[main.id] || []).slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    var isVarOfMain = vIdx && par === main;
    h += '<section class="panel"><h2>Bloodline</h2>';
    if (d.root) h += '<p><span class="pill root">Root cocktail</span> One of the six Codex templates. ' + link('#/lineage', 'Open the family tree') + '</p>';
    if (isVarOfMain) h += '<div class="lin"><span class="muted">Variation of</span> ' + link('#/d/' + main.id, esc(main.name) + ' (' + esc(main.vlabel) + ')') + '</div>';
    else if (par) h += '<div class="lin"><span class="muted">Parent</span> ' + link('#/d/' + par.id, esc(par.name)) + '</div>';
    else if (d.parentText) h += '<div class="lin"><span class="muted">Parent</span> ' + esc(d.parentText) + ' <em class="muted">(not in collection)</em></div>';
    if (d.changed) h += '<div class="lin"><span class="muted">What changed</span> ' + esc(d.changed) + '</div>';
    if (kids.length) h += '<div class="lin"><span class="muted">Riffs in your collection</span><ul class="kids">' + kids.map(function (k) { return '<li>' + link('#/d/' + k.id, esc(k.name)) + (k.src === 'andrew' ? ' <span class="mk av">yours</span>' : '') + ' <small>' + esc(k.changed || '') + '</small></li>'; }).join('') + '</ul></div>';
    if (!par && !d.parentText && !kids.length && !d.root) h += '<p class="muted">Member of the ' + esc(d.fam) + ' family. No parent or riffs linked yet.</p>';
    h += '</section>';

    // provenance
    var p = d.prov;
    h += '<section class="panel"><h2>Lore ' + confBadge(p.conf) + '</h2><div class="kv">' +
      '<div><span>Creator</span>' + esc(p.who) + '</div><div><span>Where</span>' + esc(p.where) + '</div><div><span>When</span>' + esc(p.year) + '</div></div>' +
      (p.note ? '<p class="small">' + esc(p.note) + '</p>' : '') +
      (p.conf !== 'own' ? '<p class="muted small">Confidence rates the creator, venue and date, not the recipe. Confirm in the Oxford Companion and tick it below.</p>' : '') + '</section>';

    // sources
    if (d.src !== 'andrew') {
      h += '<section class="panel"><h2>Sources <span class="muted small">· ' + overlap(id) + ' ticked</span></h2><div class="srcs">' +
        SOURCES.map(function (s) { return '<label class="src"><input type="checkbox" data-s="' + s.k + '"' + (u.sources[s.k] ? ' checked' : '') + '> ' + esc(s.n) + '</label>'; }).join('') +
        '</div><div class="xlinks">' + XLINKS.map(function (x) {
          return '<a target="_blank" rel="noopener" href="https://www.google.com/search?q=' + encodeURIComponent('site:' + x.site + ' ' + d.name + ' cocktail') + '">Check on ' + x.n + ' ↗</a>';
        }).join('') + '</div></section>';
    }

    // notes
    h += '<section class="panel"><h2>Bard’s notes</h2>' +
      (d.said ? '<div class="said"><span>As written in your notes</span>' + esc(d.said) + '</div>' : '') +
      '<div class="stars">' + [1, 2, 3, 4, 5].map(function (r) { return '<button data-r="' + r + '" class="' + (u.rating >= r ? 'on' : '') + '" aria-label="' + r + ' stars">★</button>'; }).join('') + '</div>' +
      '<div class="toggles"><label><input type="checkbox" id="tried"' + (u.tried ? ' checked' : '') + '> Made it</label>' +
      '<label><input type="checkbox" id="verified"' + (u.verified ? ' checked' : '') + '> ' + (d.src === 'andrew' ? 'Spec is final' : 'Spec verified against my book') + '</label></div>' +
      '<textarea id="notes" rows="5" placeholder="Tweaks, bottles used, what to try next…">' + esc(u.notes) + '</textarea><p class="muted small" id="saved"></p></section>';

    $app.innerHTML = h;
    $app.querySelectorAll('.seg button').forEach(function (b) { b.onclick = function () { user.settings.unit = b.dataset.u; save(); keep(renderDrink, id); }; });
    $app.querySelectorAll('.vtabs button').forEach(function (b) { b.onclick = function () { user.vsel[id] = +b.dataset.v; save(); keep(renderDrink, id); }; });
    onTap('variant', function (v) { if (v !== id) { route.keepY = window.scrollY; location.replace('#/d/' + v); } });
    document.getElementById('sminus').onclick = function () { if (serves > 1) { serves--; keep(renderDrink, id); } };
    document.getElementById('splus').onclick = function () { if (serves < 24) { serves++; keep(renderDrink, id); } };
    $app.querySelectorAll('.src input').forEach(function (c) { c.onchange = function () { u.sources[c.dataset.s] = c.checked; save(); keep(renderDrink, id); }; });
    $app.querySelectorAll('.stars button').forEach(function (b) { b.onclick = function () { var r = +b.dataset.r; u.rating = u.rating === r ? 0 : r; save(); keep(renderDrink, id); }; });
    document.getElementById('tried').onchange = function (e) { u.tried = e.target.checked; save(); };
    document.getElementById('verified').onchange = function (e) { u.verified = e.target.checked; save(); };
    var t, nt = document.getElementById('notes');
    nt.oninput = function () { clearTimeout(t); t = setTimeout(function () { u.notes = nt.value; save(); document.getElementById('saved').textContent = 'Inscribed on this device'; }, 400); };
  }
  function keep(fn, arg) { var y = window.scrollY; fn(arg); window.scrollTo(0, y); }

  /* ---------- lineage ---------- */
  var fam = { root: '', mine: false };
  function linHeader() {
    var mode = user.settings.linMode || 'evo';
    return '<header class="top"><h1>Bloodlines</h1><p class="muted small">How drinks grew up: the whole craft from 1806 to today, or your songbook sorted into Cocktail Codex’s six families.</p>' +
      pills('linmode', [{ v: 'evo', label: 'Evolution', icon: '🌳' }, { v: 'codex', label: 'Codex families', icon: '🧬' }], function (v) { return v === mode; }) + '</header>';
  }
  function bindLinMode() { onTap('linmode', function (v) { user.settings.linMode = v; save(); route(); }); }
  function topAncestor(d) { var seen = {}; while (d.parent && byId[d.parent] && !seen[d.id]) { seen[d.id] = 1; d = byId[d.parent]; } return d; }
  function subtreeHasMine(d) { if (d.src === 'andrew' || (d.av && !d.match)) return true; return (children[d.id] || []).some(subtreeHasMine); }
  function node(d, rootFam, depth) {
    var kids = (children[d.id] || []).slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (fam.mine) kids = kids.filter(subtreeHasMine);
    var cross = d.fam !== rootFam ? ' <span class="pill tiny">' + esc(d.fam) + '</span>' : '';
    var yours = d.src === 'andrew' ? ' <span class="mk av">yours</span>' : (d.av && !d.match ? ' <span class="mk av">AV</span>' : '');
    return '<li>' + link('#/d/' + d.id, esc(d.name)) + yours + cross + (d.changed && depth ? '<small>' + esc(d.changed) + '</small>' : (d.parentText && !d.parent ? '<small>via ' + esc(d.parentText) + '</small>' : '')) +
      (kids.length ? '<ul>' + kids.map(function (k) { return node(k, rootFam, depth + 1); }).join('') + '</ul>' : '') + '</li>';
  }
  function renderLineage() {
    var header = linHeader();
    if ((user.settings.linMode || 'evo') === 'evo') return window.DBViews.evolution(header);
    var h = header + '<section class="panel filterpanel"><div class="flabel">Family</div>' +
      tiles('famroot', ROOT_ORDER.map(function (f) { return { v: f, label: f, icon: '<em class="dotc"></em>', color: ROOT_COLORS[f], count: DRINKS.filter(function (d) { return d.fam === f; }).length }; }), function (v) { return v === fam.root; }, 'fams') +
      pills('fammine', [{ v: '1', label: 'Only branches with my drinks', icon: '🎻' }], function () { return fam.mine; }) + '</section>';
    ROOT_ORDER.forEach(function (f) {
      if (fam.root && fam.root !== f) return;
      var root = DRINKS.filter(function (d) { return d.root && d.fam === f; })[0];
      var members = DRINKS.filter(function (d) { return d.fam === f; });
      var mineN = members.filter(function (d) { return d.src === 'andrew'; }).length;
      var direct = (children[root.id] || []).slice();
      var loose = DRINKS.filter(function (d) { return !d.root && d.fam === f && topAncestor(d) === d && direct.indexOf(d) < 0; });
      var tops = direct.concat(loose).sort(function (a, b) { return a.name.localeCompare(b.name); });
      if (fam.mine) tops = tops.filter(subtreeHasMine);
      h += '<section class="panel tree" style="box-shadow:inset 3px 0 0 ' + ROOT_COLORS[f] + '"><details' + (fam.root || f === 'Old-Fashioned' ? ' open' : '') + '><summary><b>' + esc(root.name) + '</b> <span class="muted">· ' + esc(f) + ' · ' + members.length + ' drinks' + (mineN ? ', ' + mineN + ' yours' : '') + '</span></summary>' +
        '<p class="small">' + link('#/d/' + root.id, 'Open the root spec') + '</p><ul class="treeul">' + tops.map(function (d) { return node(d, f, d.parent ? 1 : 0); }).join('') + '</ul></details></section>';
    });
    $app.innerHTML = h;
    bindLinMode();
    onTap('famroot', function (v) { fam.root = fam.root === v ? '' : v; keep(renderLineage); });
    onTap('fammine', function () { fam.mine = !fam.mine; keep(renderLineage); });
  }

  /* ---------- craft (techniques + prep) ---------- */
  function usedIn(k) {
    var viaIng = Object.keys(ING).filter(function (i) { return ING[i].prep === k; });
    return DRINKS.filter(function (m) { return m.variants.some(function (d) {
      if (d.allTech.indexOf(k) > -1) return true;
      return d.versions.some(function (v) { return v.spec.some(function (s) { return viaIng.indexOf(s[2]) > -1; }); }) ||
        (d.components || []).some(function (c) { return c.spec.some(function (s) { return viaIng.indexOf(s[2]) > -1; }); });
    }); });
  }
  var craft = { cat: '', q: '' };
  var APO_LINK = { 'super-juice': '#/apothecary/super', 'acid-adjusted-oj': '#/apothecary/acid' };
  (window.Apothecary ? window.Apothecary.SYRUPS : []).forEach(function (s) { if (s.prep) APO_LINK[s.prep] = '#/apothecary/syrups/' + s.id; });
  function renderTechIndex() {
    var keys = Object.keys(TECH);
    var CAT = {
      prep: function (k) { return TECH[k].tag === 'prep' && !TECH[k].missing; },
      unwritten: function (k) { return TECH[k].missing && !user.tech[k]; },
      home: function (k) { return TECH[k].tag === 'home'; },
      equipment: function (k) { return TECH[k].tag === 'equipment'; }
    };
    var n = function (f) { return keys.filter(f).length; };
    var h = '<header class="top"><h1>Bar craft</h1><p class="muted small">Techniques in my own words, plus your prep recipes and notes. Influences are credited, not paraphrased.</p>' +
      '<input id="cq" type="search" class="full" placeholder="Search techniques & prep" value="' + esc(craft.q) + '">' +
      tiles('craftcat', [{ v: '', label: 'Everything', icon: '✦', count: keys.length }, { v: 'prep', label: 'House prep', icon: '🎻', count: n(CAT.prep) }, { v: 'unwritten', label: 'Unwritten', icon: '✍️', count: n(CAT.unwritten) },
        { v: 'home', label: 'Home technique', icon: '🏠', count: n(CAT.home) }, { v: 'equipment', label: 'Needs gear', icon: '🔧', count: n(CAT.equipment) }], function (v) { return v === craft.cat; }) + '</header>' +
      '<a class="apocard" href="#/apothecary"><i>⚖️</i><div><b>The Apothecary</b><span>Super juice, syrup and acid-adjust calculators</span></div><em>›</em></a>';
    function row(k) {
      var c = usedIn(k).length, t = TECH[k];
      return '<li>' + link('#/t/' + k, esc(t.t)) + (t.mine && t.mine.length && t.tag !== 'prep' ? ' <span class="mk av">your notes</span>' : '') + (t.flags ? ' <span class="mk flag">⚑</span>' : '') + (APO_LINK[k] ? ' <span class="mk calc">⚖️ calc</span>' : '') +
        ' <span class="muted small">' + (c ? c + (c === 1 ? ' drink' : ' drinks') : '') + (t.infl && t.infl !== '—' ? ' · ' + esc(t.infl) : '') + '</span></li>';
    }
    function qmatch(k) { if (!craft.q) return true; var t = TECH[k], hay = [t.t, (t.body || []).join(' '), (t.mine || []).join(' ')].join(' ').toLowerCase(); return craft.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; }); }
    function group(key, title, sub) {
      if (craft.cat && craft.cat !== key) return '';
      var ks = keys.filter(CAT[key]).filter(qmatch).sort(function (a, b) { return TECH[a].t.localeCompare(TECH[b].t); });
      if (!ks.length) return '';
      return '<section class="panel' + (key === 'prep' || key === 'unwritten' ? ' mine' : '') + '"><h2>' + title + '</h2>' + (sub ? '<p class="muted small">' + sub + '</p>' : '') + '<ul class="tlist">' + ks.map(row).join('') + '</ul></section>';
    }
    var body = group('prep', '🎻 Andrew’s house prep') + group('unwritten', '✍️ Unwritten verses', 'Used in your specs but not written down yet. The Apothecary has starter recipes you can save here.') +
      group('home', '🏠 Home-feasible technique') + group('equipment', '🔧 Equipment required');
    $app.innerHTML = h + (body || '<p class="empty">Nothing matches.</p>');
    var cq = document.getElementById('cq');
    cq.oninput = function () { craft.q = cq.value; var p = cq.selectionStart; keep(renderTechIndex); var nq = document.getElementById('cq'); nq.focus(); nq.setSelectionRange(p, p); };
    onTap('craftcat', function (v) { craft.cat = v; keep(renderTechIndex); });
  }
  function renderTech(k) {
    var t = TECH[k]; if (!t) return renderTechIndex();
    var used = usedIn(k), note = user.tech[k] || '';
    var tagPill = t.tag === 'prep' ? '<span class="pill cat-andrew">House prep</span>' : '<span class="pill ' + (t.tag === 'home' ? 'home' : 'equip') + '">' + (t.tag === 'home' ? 'Home-feasible' : 'Equipment required') + '</span>';
    var h = '<header class="top detail"><a href="#/tech" class="back">‹ Bar craft</a><h1>' + esc(t.t) + '</h1><div class="badges">' + tagPill +
      (t.infl && t.infl !== '—' ? '<span class="pill">Influence: ' + esc(t.infl) + '</span>' : '') + '</div></header>';
    h += flagBox(t.flags || []);
    if (APO_LINK[k]) h += '<a class="apocard" href="' + APO_LINK[k] + '"><i>⚖️</i><div><b>Open the calculator</b><span>Scale it in the Apothecary</span></div><em>›</em></a>';
    if (t.mine && t.mine.length) h += '<section class="panel mine"><h2>🎻 From your notes</h2><ul class="bul">' + t.mine.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
      (t.note ? '<p class="muted small">' + esc(t.note) + '</p>' : '') + '</section>';
    if (t.missing && !note) h += '<section class="panel mine"><h2>🎻 Not written down yet</h2><p>This shows up in your specs but there’s no recipe in your notes. Add it below.</p>' + (t.note ? '<p class="muted small">' + esc(t.note) + '</p>' : '') + '</section>';
    if (t.body.length || t.eq.length) h += '<section class="panel">' + (t.mine && t.mine.length ? '<h2>Technique</h2>' : '') + t.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      (t.eq.length ? '<h3>Equipment</h3><ul class="bul">' + t.eq.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>' : '') + '</section>';
    if (t.links) h += '<section class="panel"><h2>Reference</h2>' + t.links.map(function (l) { return '<p><a target="_blank" rel="noopener" href="' + esc(l.u) + '">' + esc(l.n) + ' ↗</a></p>'; }).join('') + '</section>';
    if (k === 'dilution-math') h += '<section class="panel"><p>' + link('#/check', 'Open Calculator check →') + '</p></section>';
    if (used.length) h += '<section class="panel"><h2>Used in</h2><div class="chips static">' + used.map(function (d) { return link('#/d/' + d.id, esc(d.name), 'chip'); }).join('') + '</div></section>';
    h += '<section class="panel"><h2>' + (t.missing ? 'Your recipe' : 'More notes') + '</h2><textarea id="tnotes" rows="6" placeholder="' + (t.missing ? 'Ratio, method, shelf life…' : 'Your method, ratios, timings…') + '">' + esc(note) + '</textarea><p class="muted small" id="saved"></p></section>';
    $app.innerHTML = h; window.scrollTo(0, 0);
    var tm, ta = document.getElementById('tnotes');
    ta.oninput = function () { clearTimeout(tm); tm = setTimeout(function () { user.tech[k] = ta.value; save(); document.getElementById('saved').textContent = 'Inscribed on this device'; }, 400); };
  }

  /* ---------- tavern (more) ---------- */
  function renderMore() {
    var tried = 0, noted = 0, ver = 0;
    Object.keys(user.drinks).forEach(function (k) { var u = user.drinks[k]; if (u.tried) tried++; if (u.notes) noted++; if (u.verified) ver++; });
    var cats = {}; DRINKS.forEach(function (d) { cats[d.cat] = (cats[d.cat] || 0) + 1; });
    var flagged = allVariants().filter(function (d) { return allFlags(d).length; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    var flaggedT = Object.keys(TECH).filter(function (k) { return TECH[k].flags; });
    var missing = Object.keys(TECH).filter(function (k) { return TECH[k].missing && !user.tech[k]; });
    var h = '<header class="top"><h1>The Tavern</h1><p class="muted small">Ledger, settings and housekeeping.</p></header>' +
      '<section class="panel"><h2>Your tab</h2><div class="stats">' +
      '<div><b>' + tried + '</b><span>Made</span></div><div><b>' + noted + '</b><span>With notes</span></div><div><b>' + ver + '</b><span>Verified / final</span></div></div>' +
      '<p class="muted small">' + DRINKS.length + ' songs (' + allVariants().length + ' with styles): ' + cats['Andrew’s'] + ' yours · ' + cats.Modern + ' modern · ' + cats.Classic + ' classic · ' + cats.Tiki + ' tiki.</p></section>';
    h += '<section class="panel"><h2>⚑ Bard’s to-do list</h2><p class="muted small">Things marked [?] or flagged in your notes.</p><ul class="todo">' +
      flagged.map(function (d) { return '<li>' + link('#/d/' + d.id, esc(d.name)) + '<small>' + allFlags(d).map(esc).join('<br>') + '</small></li>'; }).join('') +
      flaggedT.map(function (k) { return '<li>' + link('#/t/' + k, esc(TECH[k].t)) + '<small>' + TECH[k].flags.map(esc).join('<br>') + '</small></li>'; }).join('') +
      (missing.length ? '<li>Unwritten recipes (' + missing.length + ')<small>' + missing.map(function (k) { return link('#/t/' + k, esc(TECH[k].t)); }).join(' · ') + '</small></li>' : '') +
      '</ul><details class="diff"><summary>Name normalizations I made</summary><ul>' + (DATA.NORMALIZED || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></details></section>';
    h += '<section class="panel"><h2>Default units</h2><div class="seg"><button data-u="oz" class="' + (user.settings.unit === 'oz' ? 'on' : '') + '">oz</button><button data-u="ml" class="' + (user.settings.unit === 'ml' ? 'on' : '') + '">ml</button></div>' +
      '<p class="muted small">ml uses the bar convention of 30 ml per oz. Specs you wrote in ml stay in ml.</p></section>' +
      '<section class="panel"><h2>Back up your notes</h2><p class="small">Ratings, notes and recipes live in this browser only. Export a backup now and then, and import it on a new phone.</p>' +
      '<div class="row"><button id="exp" class="btn">Export JSON</button><label class="btn">Import JSON<input id="imp" type="file" accept="application/json" hidden></label></div><p id="iomsg" class="muted small"></p></section>' +
      '<section class="panel"><h2>Calculator</h2><p>' + link('#/check', 'Calculator check & calibration →') + '</p></section>' +
      '<section class="panel"><h2>Sources & roles</h2><ul class="bul small">' +
      '<li><b>Your notes:</b> Cocktail Notes, Organized (Andrew’s versions, originals, prep)</li>' +
      '<li><b>Modern core:</b> Death & Co, Death & Co: Welcome Home, Cocktail Codex</li>' +
      '<li><b>Taxonomy:</b> Cocktail Codex’s six roots</li>' +
      '<li><b>Tiki:</b> Smuggler’s Cove, Sippin’ Safari, Tiki: Modern Tropical Cocktails</li>' +
      '<li><b>History:</b> The Oxford Companion to Spirits and Cocktails</li>' +
      '<li><b>Online cross-checks:</b> Liquor.com, Difford’s Guide, Imbibe (link-outs only)</li>' +
      '<li><b>Technique influences:</b> Dave Arnold, Jeffrey Morgenthaler, Sam Ross</li></ul></section>';
    $app.innerHTML = h;
    $app.querySelectorAll('.seg button').forEach(function (b) { b.onclick = function () { user.settings.unit = b.dataset.u; save(); keep(renderMore); }; });
    document.getElementById('exp').onclick = function () {
      var blob = new Blob([JSON.stringify(user, null, 2)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'dad-bard-notes-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    };
    document.getElementById('imp').onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try { var x = JSON.parse(r.result); if (!x.drinks) throw 0; user = x; user.tech = user.tech || {}; user.settings = user.settings || { unit: 'oz' }; user.vsel = user.vsel || {}; save();
          if (user.settings.coef) Calc.setCoefficients(user.settings.coef); derive(); document.getElementById('iomsg').textContent = 'Imported.';
        } catch (z) { document.getElementById('iomsg').textContent = 'That file didn’t look like a Dad Bard backup.'; }
      };
      r.readAsText(f);
    };
  }

  function renderCheck() {
    var res = window.runCalcTests(Calc, DATA), f = 0, w = 0;
    res.forEach(function (r) { if (r.status === 'FAIL') f++; if (r.status === 'WARN') w++; });
    var k = Calc.getCoefficients();
    var h = '<header class="top detail"><a href="#/more" class="back">‹ Tavern</a><h1>Calculator check</h1>' +
      '<p class="small"><b class="' + (f ? 'bad' : 'good') + '">' + (res.length - f - w) + ' passed · ' + f + ' failed</b> · ' + w + ' plausibility warnings</p></header>';
    h += '<section class="panel"><h2>1 · Confirm the coefficients</h2><p class="small">Check these against <i>Liquid Intelligence</i>. Secondary sources disagree on the stirred middle term (1.246 vs 1.26). Edit, save, and every drink recalculates.</p>' +
      '<div class="coef"><span>Shaken</span>' + k.shake.map(function (v, i) { return '<input data-m="shake" data-i="' + i + '" inputmode="decimal" value="' + v + '">'; }).join('') +
      '<span>Stirred</span>' + k.stir.map(function (v, i) { return '<input data-m="stir" data-i="' + i + '" inputmode="decimal" value="' + v + '">'; }).join('') + '</div>' +
      '<p class="muted small">d = a·A² + b·A + c</p><div class="row"><button id="csave" class="btn">Save</button><button id="creset" class="btn ghost">Reset defaults</button></div></section>';
    h += '<section class="panel"><h2>2 · Weigh test (your real dilution)</h2><p class="small">Weigh the drink in the tin before ice, then weigh what you strain out. Compare with the model.</p>' +
      '<div class="weigh"><select id="wd">' + DRINKS.filter(function (d) { return ['shake', 'dryshake', 'stir'].indexOf(d.versions[d.vdef].m) > -1; }).sort(function (a, b) { return a.name.localeCompare(b.name); }).map(function (d) { return '<option value="' + d.id + '">' + esc(d.name) + '</option>'; }).join('') + '</select>' +
      '<input id="wb" inputmode="decimal" placeholder="Before (g)"><input id="wa" inputmode="decimal" placeholder="After (g)"><button id="wgo" class="btn">Compare</button></div><p id="wout" class="small"></p></section>';
    h += '<section class="panel"><h2>3 · Automated tests</h2><ul class="tests">' + res.map(function (r) {
      return '<li class="t-' + r.status.toLowerCase() + '"><b>' + r.status + '</b> ' + esc(r.name) + (r.detail ? ' <small>' + esc(r.detail) + '</small>' : '') + '</li>';
    }).join('') + '</ul><p class="muted small">Warnings flag traditional specs outside rough ABV bands. Long, low-proof or amaro-based drinks are expected to trip them.</p></section>';
    $app.innerHTML = h;
    document.getElementById('csave').onclick = function () {
      var c = { shake: [], stir: [] };
      $app.querySelectorAll('.coef input').forEach(function (i) { c[i.dataset.m][+i.dataset.i] = parseFloat(i.value); });
      if ([].concat(c.shake, c.stir).some(isNaN)) return alert('Enter numbers only.');
      user.settings.coef = c; save(); Calc.setCoefficients(c); derive(); renderCheck();
    };
    document.getElementById('creset').onclick = function () { delete user.settings.coef; save(); Calc.setCoefficients(Calc.DEFAULT_COEF); derive(); renderCheck(); };
    document.getElementById('wgo').onclick = function () {
      var d = byId[document.getElementById('wd').value], b = parseFloat(document.getElementById('wb').value), a = parseFloat(document.getElementById('wa').value);
      if (!(b > 0 && a > b)) { document.getElementById('wout').textContent = 'Enter a before weight and a larger after weight.'; return; }
      var m = Calc.measuredDilution(b, a), p = d.stats.dilution;
      document.getElementById('wout').innerHTML = 'Measured <b>' + pct(m) + '</b> water vs model <b>' + pct(p) + '</b> (' + (m - p >= 0 ? '+' : '') + ((m - p) * 100).toFixed(1) + ' pts) for ' + esc(d.versions[d.vdef].label) + '.';
    };
  }

  /* ---------- router ---------- */
  function setTab(t) { document.querySelectorAll('nav.tabs a').forEach(function (a) { a.classList.toggle('on', a.dataset.t === t); }); }
  function route() {
    var h = location.hash.replace(/^#/, '') || '/';
    var parts = h.split('/').filter(Boolean);
    if (parts[0] === 'd') {
      document.body.classList.remove('noscroll'); setTab('browse');
      var m = VAR[parts[1]] ? VAR[parts[1]].main.id : parts[1];
      if (m !== route.last) { serves = 1; window.scrollTo(0, 0); }
      route.last = m; renderDrink(parts[1]);
      if (route.keepY != null) { window.scrollTo(0, route.keepY); route.keepY = null; }
      return;
    }
    route.last = null; window.scrollTo(0, 0); document.body.classList.remove('noscroll');
    if (parts[0] === 'lineage') { setTab('lineage'); return renderLineage(); }
    if (parts[0] === 'evo') { setTab('lineage'); return window.DBViews.evoNode(parts[1]); }
    if (parts[0] === 'apothecary') { setTab('apo'); return window.DBViews.apothecary(parts[1], parts[2]); }
    if (parts[0] === 'tech') { setTab('tech'); return renderTechIndex(); }
    if (parts[0] === 't') { setTab('tech'); return renderTech(parts[1]); }
    if (parts[0] === 'more') { setTab('more'); return renderMore(); }
    if (parts[0] === 'check') { setTab('more'); return renderCheck(); }
    setTab('browse'); renderBrowse();
  }
  window.DB = {
    get user() { return user; }, save: save, keep: keep, esc: esc, link: link, tiles: tiles, pills: pills, onTap: onTap, card: card,
    bindLinMode: bindLinMode, ROOT_COLORS: ROOT_COLORS, TECH: TECH, ING: ING, DRINKS: DRINKS, byId: byId
  };
  window.addEventListener('hashchange', route);
  route();

  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');
})();
