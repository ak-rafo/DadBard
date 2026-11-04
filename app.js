/* The Spec Book — app logic (vanilla JS, no build step) */
(function () {
  'use strict';
  var DATA = window.CC_DATA, Calc = window.CocktailCalc;
  var ING = DATA.ING, DRINKS = DATA.DRINKS, TECH = DATA.TECH;
  var STORE_KEY = 'specbook.v1';
  var ROOT_ORDER = ['Old-Fashioned', 'Martini', 'Daiquiri', 'Sidecar', 'Whiskey Highball', 'Flip'];

  var SOURCES = [
    { k: 'dc', n: 'Death & Co' }, { k: 'wh', n: 'Death & Co: Welcome Home' }, { k: 'codex', n: 'Cocktail Codex' },
    { k: 'sc', n: 'Smuggler’s Cove' }, { k: 'ss', n: 'Sippin’ Safari' }, { k: 'tm', n: 'Tiki: Modern Tropical Cocktails' },
    { k: 'ox', n: 'Oxford Companion' }, { k: 'lq', n: 'Liquor.com' }, { k: 'df', n: 'Difford’s Guide' }, { k: 'im', n: 'Imbibe' }
  ];
  var XLINKS = [
    { n: 'Difford’s Guide', site: 'diffordsguide.com' },
    { n: 'Liquor.com', site: 'liquor.com' },
    { n: 'Imbibe', site: 'imbibemagazine.com' }
  ];
  var EQUIP = { 'shake': 'Shaker', 'dry-shake': 'Shaker', 'whip-shake': 'Shaker', 'stir': 'Mixing glass', 'swizzle': 'Swizzle stick',
    'flash-blend': 'Blender', 'muddle': 'Muddler', 'fat-wash': 'Freezer', 'fluffy-juice': 'Juicer', 'infusion': 'Infusion jar', 'flamed-twist': 'Lighter' };

  /* ---------- persistence ---------- */
  function load() {
    try { var u = JSON.parse(localStorage.getItem(STORE_KEY)); if (u && u.drinks) return u; } catch (e) {}
    return { drinks: {}, tech: {}, settings: { unit: 'oz' } };
  }
  var user = load();
  user.tech = user.tech || {}; user.settings = user.settings || { unit: 'oz' };
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(user)); } catch (e) {} }
  function ud(id) { return user.drinks[id] || (user.drinks[id] = { notes: '', rating: 0, tried: false, verified: false, sources: {} }); }
  if (user.settings.coef) Calc.setCoefficients(user.settings.coef);

  /* ---------- derived data ---------- */
  var byId = {}, children = {};
  function derive() {
    DRINKS.forEach(function (d) {
      byId[d.id] = d;
      d.stats = Calc.compute(d.spec, d.m, ING);
      d.strength = Calc.strengthLabel(d.stats.finalAbv);
      var eq = {};
      d.tech.forEach(function (t) { if (EQUIP[t]) eq[EQUIP[t]] = 1; });
      if (/crushed|pebble|cone/i.test(d.ice)) eq['Crushed ice'] = 1;
      d.equip = Object.keys(eq);
      d.techLabel = { shake: 'Shake', dryshake: 'Dry shake', stir: 'Stir', build: 'Build', swizzle: 'Swizzle', blend: 'Flash blend' }[d.m];
      d.search = [d.name, d.base, d.fam, d.cat, d.prov.who, d.prov.where, d.flav.join(' '),
        d.spec.map(function (s) { return (s[3] && s[3].label) || (ING[s[2]] && ING[s[2]].n) || ''; }).join(' ')].join(' ').toLowerCase();
    });
    children = {};
    DRINKS.forEach(function (d) { if (d.parent) (children[d.parent] = children[d.parent] || []).push(d); });
  }
  derive();

  /* ---------- helpers ---------- */
  var $app = document.getElementById('app');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pct(x, dp) { return (x * 100).toFixed(dp == null ? 1 : dp) + '%'; }
  var FR = { 0: '', 0.125: '⅛', 0.25: '¼', 0.333: '⅓', 0.375: '⅜', 0.5: '½', 0.625: '⅝', 0.667: '⅔', 0.75: '¾', 0.875: '⅞' };
  function frac(x) {
    var w = Math.floor(x + 1e-9), r = x - w;
    for (var k in FR) { if (Math.abs(r - parseFloat(k)) < 0.02) return (w ? w : '') + FR[k] || '0'; }
    if (Math.abs(r - 1) < 0.02) return String(w + 1);
    return (Math.round(x * 100) / 100).toString();
  }
  function fmtVol(oz, unit) {
    if (unit === 'ml') { var ml = oz * 30; return (ml >= 20 ? Math.round(ml / 2.5) * 2.5 : Math.round(ml * 2) / 2) + ' ml'; }
    return frac(oz) + ' oz';
  }
  function plural(n, s, p) { return n === 1 ? s : (p || s + 'es'); }
  function fmtItem(it, serves, unit) {
    var a = it[0] * serves, u = it[1], o = it[3] || {};
    var name = o.label || (ING[it[2]] ? ING[it[2]].n : it[2]);
    var amt;
    switch (u) {
      case 'oz': amt = fmtVol(a, unit); break;
      case 'top': amt = 'Top · ' + fmtVol(a, unit); break;
      case 'dash': amt = a + ' ' + plural(a, 'dash'); break;
      case 'drop': amt = a + ' ' + plural(a, 'drop', 'drops'); break;
      case 'tsp': amt = frac(a) + ' tsp' + (unit === 'ml' ? ' (' + Math.round(a * 5) + ' ml)' : ''); break;
      case 'bsp': amt = frac(a) + ' barspoon' + (a > 1 ? 's' : ''); break;
      case 'white': amt = a === 1 ? '1' : frac(a); name = 'Egg white'; break;
      case 'egg': amt = a === 1 ? '1' : frac(a); name = 'Whole egg'; break;
      case 'leaf': amt = a + ' ' + (a === 1 ? 'leaf' : 'leaves'); break;
      case 'slice': amt = a + ' ' + plural(a, 'slice', 'slices'); break;
      case 'sprig': amt = a + ' ' + plural(a, 'sprig', 'sprigs'); break;
      case 'whole': amt = String(a); break;
      case 'pinch': amt = a + ' ' + plural(a, 'pinch'); break;
      case 'handful': amt = a + ' ' + plural(a, 'handful', 'handfuls'); break;
      case 'rinse': amt = 'Rinse'; break;
      default: amt = a + ' ' + u;
    }
    return { amt: amt, name: (o.side || o.post) ? clean(name) : name, note: o.note || '', tag: o.side ? 'side' : (o.post && u !== 'top' ? 'float' : '') };
  }
  function gl(g) { g = g.toLowerCase(); return /glass|mug|coupe|flute|nick/.test(g) ? g : g + ' glass'; }
  function clean(n) { return n.replace(/, (float|drizzled over|served on the side)$/i, ''); }
  function methodText(d) {
    var up = /^up$/i.test(d.ice), muddle = d.tech.indexOf('muddle') > -1;
    var tops = [], floats = [], sides = [], rinses = [];
    d.spec.forEach(function (it) {
      var o = it[3] || {}, nm = (o.label || ING[it[2]].n);
      if (o.side) sides.push(nm); else if (it[1] === 'rinse') rinses.push(nm);
      else if (it[1] === 'top') tops.push(nm); else if (o.post) floats.push(nm);
    });
    var into = up ? 'Fine-strain into a chilled ' + gl(d.glass) + '.' : 'Strain into a ' + gl(d.glass) + ' over ' + d.ice.toLowerCase() + '.';
    var s = [];
    if (rinses.length) s.push('Rinse the chilled glass with ' + rinses.join(', ') + ' and pour out the excess.');
    if (muddle) s.push('Gently muddle the fresh ingredients in the tin first.');
    switch (d.m) {
      case 'shake': s.push((muddle ? 'Add the rest' : 'Add everything') + ' with ice and shake hard for 10–12 seconds.', into); break;
      case 'dryshake': s.push('Shake without ice to build foam, then add ice and shake hard again.', into); break;
      case 'stir': s.push('Stir with ice for 20–30 seconds until cold and silky.', into); break;
      case 'build': s.push('Build in a chilled ' + gl(d.glass) + (up ? '' : ' over ' + d.ice.toLowerCase()) + '.'); break;
      case 'swizzle': s.push('Add to a ' + gl(d.glass) + ' with crushed ice and swizzle until the glass frosts. Top with more crushed ice.'); break;
      case 'blend': s.push('Flash-blend with crushed ice for about 5 seconds (or shake hard with crushed ice) and pour everything into a ' + gl(d.glass) + '.'); break;
    }
    if (tops.length) s.push('Top with ' + tops.map(clean).join(' and ') + ', then lift gently once.');
    if (floats.length) s.push('Float ' + floats.map(clean).join(', ') + ' on top.');
    if (sides.length) s.push('Serve ' + sides.map(clean).join(', ') + ' on the side.');
    if (d.garnish && !/^none/i.test(d.garnish)) s.push('Garnish: ' + d.garnish.charAt(0).toLowerCase() + d.garnish.slice(1) + '.');
    return s.join(' ');
  }
  function overlap(id) { var s = (user.drinks[id] || {}).sources || {}; return Object.keys(s).filter(function (k) { return s[k]; }).length; }
  function catClass(c) { return 'cat-' + c.toLowerCase(); }
  function link(href, html, cls) { return '<a href="' + href + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + html + '</a>'; }
  function confBadge(c) { return '<span class="conf conf-' + c + '">' + c + ' confidence</span>'; }

  /* ---------- browse ---------- */
  var FILTERS = [
    { k: 'cat', n: 'Category', get: function (d) { return [d.cat]; } },
    { k: 'base', n: 'Base spirit', get: function (d) { return [d.base]; } },
    { k: 'fam', n: 'Family', get: function (d) { return [d.fam]; }, order: ROOT_ORDER },
    { k: 'flav', n: 'Flavor', get: function (d) { return d.flav; } },
    { k: 'tech', n: 'Technique', get: function (d) { return d.tech.map(function (t) { return TECH[t].t; }); } },
    { k: 'strength', n: 'Strength', get: function (d) { return [d.strength]; }, order: ['Light', 'Medium', 'Strong'] },
    { k: 'equip', n: 'Equipment', get: function (d) { return d.equip; } }
  ];
  var state = { q: '', f: {}, sort: 'az', showFilters: false };
  FILTERS.forEach(function (g) { state.f[g.k] = {}; });
  function activeCount() { var n = 0; FILTERS.forEach(function (g) { n += Object.keys(state.f[g.k]).length; }); return n; }
  function matches(d) {
    if (state.q) {
      var toks = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < toks.length; i++) if (d.search.indexOf(toks[i]) < 0) return false;
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
    var l = list.slice();
    var by = {
      az: function (a, b) { return a.name.localeCompare(b.name); },
      strong: function (a, b) { return b.stats.finalAbv - a.stats.finalAbv; },
      light: function (a, b) { return a.stats.finalAbv - b.stats.finalAbv; },
      sources: function (a, b) { return overlap(b.id) - overlap(a.id) || a.name.localeCompare(b.name); }
    }[state.sort];
    return l.sort(by);
  }
  function renderBrowse() {
    var list = sorted(DRINKS.filter(matches));
    var ac = activeCount();
    var h = '<header class="top"><h1>The Spec Book</h1>' +
      '<div class="searchrow"><input id="q" type="search" placeholder="Search drinks, ingredients, creators" value="' + esc(state.q) + '" autocomplete="off">' +
      '<button id="ftoggle" class="btn ' + (ac ? 'on' : '') + '">Filters' + (ac ? ' · ' + ac : '') + '</button></div>' +
      '<div class="sortrow"><span class="muted">' + list.length + ' of ' + DRINKS.length + '</span>' +
      '<select id="sort"><option value="az">A–Z</option><option value="strong">Strongest</option><option value="light">Lightest</option><option value="sources">Most sources ticked</option></select></div></header>';
    if (state.showFilters) {
      h += '<section class="filters">';
      FILTERS.forEach(function (g) {
        var vals = {}; DRINKS.forEach(function (d) { g.get(d).forEach(function (v) { vals[v] = (vals[v] || 0) + 1; }); });
        var keys = g.order ? g.order.filter(function (k) { return vals[k]; }) : Object.keys(vals).sort();
        h += '<div class="fgroup"><div class="flabel">' + g.n + '</div><div class="chips">' +
          keys.map(function (v) { return '<button class="chip ' + (state.f[g.k][v] ? 'on' : '') + '" data-g="' + g.k + '" data-v="' + esc(v) + '">' + esc(v) + ' <span>' + vals[v] + '</span></button>'; }).join('') + '</div></div>';
      });
      if (ac) h += '<button id="fclear" class="btn ghost">Clear all filters</button>';
      h += '</section>';
    }
    h += '<ul class="cards">' + list.map(function (d) {
      var u = user.drinks[d.id] || {};
      return '<li><a class="card" href="#/d/' + d.id + '"><div class="cmain"><div class="cname">' + esc(d.name) +
        (u.notes ? ' <span class="dot" title="Has notes"></span>' : '') + (u.verified ? ' <span class="tick" title="Spec verified">✓</span>' : '') + '</div>' +
        '<div class="csub">' + esc(d.fam) + ' · ' + esc(d.base) + ' · ' + d.techLabel + '</div></div>' +
        '<div class="cside"><span class="pill ' + catClass(d.cat) + '">' + d.cat + '</span><span class="abv">' + pct(d.stats.finalAbv, 0) + '</span></div></a></li>';
    }).join('') + '</ul>';
    if (!list.length) h += '<p class="empty">No drinks match. Try clearing a filter.</p>';
    $app.innerHTML = h;
    var q = document.getElementById('q');
    q.addEventListener('input', function () { state.q = q.value; var pos = q.selectionStart; renderBrowse(); var n = document.getElementById('q'); n.focus(); n.setSelectionRange(pos, pos); });
    document.getElementById('sort').value = state.sort;
    document.getElementById('sort').onchange = function (e) { state.sort = e.target.value; renderBrowse(); };
    document.getElementById('ftoggle').onclick = function () { state.showFilters = !state.showFilters; renderBrowse(); };
    $app.querySelectorAll('.chip').forEach(function (c) {
      c.onclick = function () { var g = c.dataset.g, v = c.dataset.v; if (state.f[g][v]) delete state.f[g][v]; else state.f[g][v] = 1; renderBrowse(); };
    });
    var fc = document.getElementById('fclear'); if (fc) fc.onclick = function () { FILTERS.forEach(function (g) { state.f[g.k] = {}; }); renderBrowse(); };
  }

  /* ---------- detail ---------- */
  var serves = 1;
  function renderDrink(id) {
    var d = byId[id]; if (!d) return renderBrowse();
    var u = ud(id), unit = user.settings.unit, st = d.stats;
    var h = '<header class="top detail"><a href="#/" class="back">‹ All drinks</a>' +
      '<h1>' + esc(d.name) + '</h1><div class="badges"><span class="pill ' + catClass(d.cat) + '">' + d.cat + '</span>' +
      '<span class="pill">' + esc(d.fam) + ' family</span><span class="pill">' + esc(d.base) + '</span><span class="pill">' + d.strength + '</span></div>' +
      (d.famNote ? '<p class="muted small">' + esc(d.famNote) + '</p>' : '') + '</header>';

    // controls
    h += '<section class="panel controls"><div class="seg"><button data-u="oz" class="' + (unit === 'oz' ? 'on' : '') + '">oz</button><button data-u="ml" class="' + (unit === 'ml' ? 'on' : '') + '">ml</button></div>' +
      '<div class="scaler"><button id="sminus" aria-label="Fewer">−</button><span>' + serves + ' ' + (serves === 1 ? 'serve' : 'serves') + '</span><button id="splus" aria-label="More">+</button></div></section>';

    // spec
    h += '<section class="panel"><h2>Spec</h2><ul class="spec">' + d.spec.map(function (it) {
      var f = fmtItem(it, serves, unit);
      return '<li><span class="amt">' + esc(f.amt) + '</span><span class="ing">' + esc(f.name) + (f.tag ? ' <em class="tag">' + f.tag + '</em>' : '') +
        (f.note ? '<small>' + esc(f.note) + '</small>' : '') + '</span></li>';
    }).join('') + '</ul>' +
      '<div class="kv"><div><span>Glass</span>' + esc(d.glass) + '</div><div><span>Ice</span>' + esc(d.ice) + '</div><div><span>Garnish</span>' + esc(d.garnish) + '</div></div>' +
      '<h3>Method</h3><p>' + esc(methodText(d)) + '</p>' +
      '<div class="chips static">' + d.tech.map(function (t) { return link('#/t/' + t, esc(TECH[t].t), 'chip'); }).join('') + '</div></section>';

    // stats
    var vol = st.finalMl / Calc.ML_PER_OZ * serves;
    h += '<section class="panel"><h2>Calculated</h2><div class="stats">' +
      '<div><b>' + pct(st.finalAbv) + '</b><span>Final ABV</span></div>' +
      '<div><b>' + (unit === 'ml' ? Math.round(st.finalMl * serves) + ' ml' : vol.toFixed(1) + ' oz') + '</b><span>Final volume</span></div>' +
      '<div><b>' + pct(st.mixAbv) + '</b><span>ABV before ice</span></div>' +
      '<div><b>' + pct(st.dilution, 0) + '</b><span>Water added</span></div>' +
      '<div><b>' + st.sugarPer100.toFixed(1) + ' g</b><span>Sugar / 100 ml</span></div>' +
      '<div><b>' + st.acidPct.toFixed(2) + '%</b><span>Acid</span></div></div>' +
      '<p class="muted small">Model: ' + esc(st.model) + '. ' + (st.warn ? esc(st.warn) + ' ' : '') + link('#/t/dilution-math', 'How this is calculated') + '</p></section>';

    // lineage
    var par = d.parent ? byId[d.parent] : null, kids = children[d.id] || [];
    h += '<section class="panel"><h2>Lineage</h2>';
    if (d.root) h += '<p><span class="pill root">Root cocktail</span> One of the six Codex templates. ' + link('#/lineage', 'Open the family tree') + '</p>';
    if (par) h += '<div class="lin"><span class="muted">Parent</span> ' + link('#/d/' + par.id, esc(par.name)) + '</div>';
    else if (d.parentText) h += '<div class="lin"><span class="muted">Parent</span> ' + esc(d.parentText) + ' <em class="muted">(not in collection)</em></div>';
    if (d.changed) h += '<div class="lin"><span class="muted">What changed</span> ' + esc(d.changed) + '</div>';
    if (kids.length) h += '<div class="lin"><span class="muted">Riffs in your collection</span><ul class="kids">' + kids.map(function (k) { return '<li>' + link('#/d/' + k.id, esc(k.name)) + ' <small>' + esc(k.changed || '') + '</small></li>'; }).join('') + '</ul></div>';
    if (!par && !d.parentText && !kids.length && !d.root) h += '<p class="muted">Family member of the ' + esc(d.fam) + ' template. No parent or riffs linked yet.</p>';
    h += '</section>';

    // provenance
    var p = d.prov;
    h += '<section class="panel"><h2>Provenance ' + confBadge(p.conf) + '</h2><div class="kv">' +
      '<div><span>Creator</span>' + esc(p.who) + '</div><div><span>Where</span>' + esc(p.where) + '</div><div><span>When</span>' + esc(p.year) + '</div></div>' +
      (p.note ? '<p class="small">' + esc(p.note) + '</p>' : '') +
      '<p class="muted small">Confidence rates the creator/venue/date, not the recipe. Confirm in the Oxford Companion and tick it below.</p></section>';

    // sources
    h += '<section class="panel"><h2>Sources <span class="muted small">· ' + overlap(id) + ' ticked</span></h2><div class="srcs">' +
      SOURCES.map(function (s) { return '<label class="src"><input type="checkbox" data-s="' + s.k + '"' + (u.sources[s.k] ? ' checked' : '') + '> ' + esc(s.n) + '</label>'; }).join('') +
      '</div><div class="xlinks">' + XLINKS.map(function (x) {
        return '<a target="_blank" rel="noopener" href="https://www.google.com/search?q=' + encodeURIComponent('site:' + x.site + ' ' + d.name + ' cocktail') + '">Check on ' + x.n + ' ↗</a>';
      }).join('') + '</div></section>';

    // notes
    h += '<section class="panel"><h2>My notes</h2><div class="stars">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-r="' + n + '" class="' + (u.rating >= n ? 'on' : '') + '" aria-label="' + n + ' stars">★</button>'; }).join('') + '</div>' +
      '<div class="toggles"><label><input type="checkbox" id="tried"' + (u.tried ? ' checked' : '') + '> Made it</label>' +
      '<label><input type="checkbox" id="verified"' + (u.verified ? ' checked' : '') + '> Spec verified against my book</label></div>' +
      '<textarea id="notes" rows="5" placeholder="Tweaks, bottles used, what to try next…">' + esc(u.notes) + '</textarea><p class="muted small" id="saved"></p></section>';

    $app.innerHTML = h;
    window.scrollTo(0, 0);
    $app.querySelectorAll('.seg button').forEach(function (b) { b.onclick = function () { user.settings.unit = b.dataset.u; save(); renderDrink(id); }; });
    document.getElementById('sminus').onclick = function () { if (serves > 1) { serves--; renderDrink(id); } };
    document.getElementById('splus').onclick = function () { if (serves < 24) { serves++; renderDrink(id); } };
    $app.querySelectorAll('.src input').forEach(function (c) { c.onchange = function () { u.sources[c.dataset.s] = c.checked; save(); renderDrink(id); }; });
    $app.querySelectorAll('.stars button').forEach(function (b) { b.onclick = function () { var r = +b.dataset.r; u.rating = u.rating === r ? 0 : r; save(); renderDrink(id); }; });
    document.getElementById('tried').onchange = function (e) { u.tried = e.target.checked; save(); };
    document.getElementById('verified').onchange = function (e) { u.verified = e.target.checked; save(); };
    var t, n = document.getElementById('notes');
    n.oninput = function () { clearTimeout(t); t = setTimeout(function () { u.notes = n.value; save(); document.getElementById('saved').textContent = 'Saved on this device'; }, 400); };
  }

  /* ---------- lineage ---------- */
  function topAncestor(d) { var seen = {}; while (d.parent && byId[d.parent] && !seen[d.id]) { seen[d.id] = 1; d = byId[d.parent]; } return d; }
  function node(d, rootFam, depth) {
    var kids = (children[d.id] || []).slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    var cross = d.fam !== rootFam ? ' <span class="pill tiny">' + esc(d.fam) + '</span>' : '';
    return '<li>' + link('#/d/' + d.id, esc(d.name)) + cross + (d.changed && depth ? '<small>' + esc(d.changed) + '</small>' : (d.parentText && !d.parent ? '<small>via ' + esc(d.parentText) + '</small>' : '')) +
      (kids.length ? '<ul>' + kids.map(function (k) { return node(k, rootFam, depth + 1); }).join('') + '</ul>' : '') + '</li>';
  }
  function renderLineage() {
    var h = '<header class="top"><h1>Family tree</h1><p class="muted small">Anchored on Cocktail Codex’s six root cocktails. Links show the template relationship and what changed, not strict chronology.</p></header>';
    ROOT_ORDER.forEach(function (fam) {
      var root = DRINKS.filter(function (d) { return d.root && d.fam === fam; })[0];
      var members = DRINKS.filter(function (d) { return d.fam === fam; });
      var direct = (children[root.id] || []).slice();
      var loose = DRINKS.filter(function (d) { return !d.root && d.fam === fam && topAncestor(d) === d && direct.indexOf(d) < 0; });
      var tops = direct.concat(loose).sort(function (a, b) { return a.name.localeCompare(b.name); });
      h += '<section class="panel tree"><details' + (fam === 'Old-Fashioned' ? ' open' : '') + '><summary><b>' + esc(root.name) + '</b> <span class="muted">· ' + esc(fam) + ' family · ' + members.length + ' drinks</span></summary>' +
        '<p class="small">' + link('#/d/' + root.id, 'Open the root spec') + '</p><ul class="treeul">' + tops.map(function (d) { return node(d, fam, d.parent ? 1 : 0); }).join('') + '</ul></details></section>';
    });
    $app.innerHTML = h;
  }

  /* ---------- techniques ---------- */
  function renderTechIndex() {
    var keys = Object.keys(TECH);
    function group(tag, title) {
      return '<section class="panel"><h2>' + title + '</h2><ul class="tlist">' + keys.filter(function (k) { return TECH[k].tag === tag; }).map(function (k) {
        var n = DRINKS.filter(function (d) { return d.tech.indexOf(k) > -1; }).length;
        return '<li>' + link('#/t/' + k, esc(TECH[k].t)) + ' <span class="muted small">' + (n ? n + ' drinks' : '') + (TECH[k].infl && TECH[k].infl !== '—' ? ' · ' + esc(TECH[k].infl) : '') + '</span></li>';
      }).join('') + '</ul></section>';
    }
    $app.innerHTML = '<header class="top"><h1>Techniques</h1><p class="muted small">Short pages in my own words, plus your notes. Influences are credited, not paraphrased.</p></header>' +
      group('home', 'Home-feasible') + group('equipment', 'Equipment required');
  }
  function renderTech(k) {
    var t = TECH[k]; if (!t) return renderTechIndex();
    var used = DRINKS.filter(function (d) { return d.tech.indexOf(k) > -1; });
    var note = user.tech[k] || '';
    var h = '<header class="top detail"><a href="#/tech" class="back">‹ Techniques</a><h1>' + esc(t.t) + '</h1><div class="badges">' +
      '<span class="pill ' + (t.tag === 'home' ? 'home' : 'equip') + '">' + (t.tag === 'home' ? 'Home-feasible' : 'Equipment required') + '</span>' +
      (t.infl && t.infl !== '—' ? '<span class="pill">Influence: ' + esc(t.infl) + '</span>' : '') + '</div></header>';
    h += '<section class="panel">' + t.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      (t.eq.length ? '<h3>Equipment</h3><ul class="bul">' + t.eq.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>' : '') + '</section>';
    if (k === 'dilution-math') h += '<section class="panel"><p>' + link('#/check', 'Open Calculator check →') + '</p></section>';
    if (used.length) h += '<section class="panel"><h2>Used in</h2><div class="chips static">' + used.map(function (d) { return link('#/d/' + d.id, esc(d.name), 'chip'); }).join('') + '</div></section>';
    h += '<section class="panel"><h2>My notes</h2><textarea id="tnotes" rows="6" placeholder="Your method, ratios, timings…">' + esc(note) + '</textarea><p class="muted small" id="saved"></p></section>';
    $app.innerHTML = h; window.scrollTo(0, 0);
    var tm, ta = document.getElementById('tnotes');
    ta.oninput = function () { clearTimeout(tm); tm = setTimeout(function () { user.tech[k] = ta.value; save(); document.getElementById('saved').textContent = 'Saved on this device'; }, 400); };
  }

  /* ---------- more / settings ---------- */
  function renderMore() {
    var tried = 0, noted = 0, ver = 0;
    Object.keys(user.drinks).forEach(function (k) { var u = user.drinks[k]; if (u.tried) tried++; if (u.notes) noted++; if (u.verified) ver++; });
    var cats = {}; DRINKS.forEach(function (d) { cats[d.cat] = (cats[d.cat] || 0) + 1; });
    var h = '<header class="top"><h1>More</h1></header>' +
      '<section class="panel"><h2>Your progress</h2><div class="stats">' +
      '<div><b>' + tried + '</b><span>Made</span></div><div><b>' + noted + '</b><span>With notes</span></div><div><b>' + ver + '</b><span>Specs verified</span></div></div>' +
      '<p class="muted small">Collection: ' + cats.Modern + ' modern · ' + cats.Classic + ' classic · ' + cats.Tiki + ' tiki.</p></section>' +
      '<section class="panel"><h2>Default units</h2><div class="seg"><button data-u="oz" class="' + (user.settings.unit === 'oz' ? 'on' : '') + '">oz</button><button data-u="ml" class="' + (user.settings.unit === 'ml' ? 'on' : '') + '">ml</button></div>' +
      '<p class="muted small">ml uses the bar convention of 30 ml per oz.</p></section>' +
      '<section class="panel"><h2>Back up your notes</h2><p class="small">Notes live in this browser only. Export a backup now and then, and import it on a new phone.</p>' +
      '<div class="row"><button id="exp" class="btn">Export JSON</button><label class="btn">Import JSON<input id="imp" type="file" accept="application/json" hidden></label></div><p id="iomsg" class="muted small"></p></section>' +
      '<section class="panel"><h2>Calculator</h2><p>' + link('#/check', 'Calculator check & calibration →') + '</p></section>' +
      '<section class="panel"><h2>Sources & roles</h2><ul class="bul small">' +
      '<li><b>Modern core:</b> Death & Co, Death & Co: Welcome Home, Cocktail Codex</li>' +
      '<li><b>Taxonomy:</b> Cocktail Codex’s six roots</li>' +
      '<li><b>Tiki:</b> Smuggler’s Cove, Sippin’ Safari, Tiki: Modern Tropical Cocktails</li>' +
      '<li><b>History:</b> The Oxford Companion to Spirits and Cocktails</li>' +
      '<li><b>Online cross-checks:</b> Liquor.com, Difford’s Guide, Imbibe (link-outs only, nothing copied)</li>' +
      '<li><b>Technique influences:</b> Dave Arnold, Jeffrey Morgenthaler, Sam Ross</li></ul>' +
      '<p class="muted small">Specs are ingredient lists; all descriptive text is original. Tick a source on a drink only after you have checked it yourself.</p></section>';
    $app.innerHTML = h;
    $app.querySelectorAll('.seg button').forEach(function (b) { b.onclick = function () { user.settings.unit = b.dataset.u; save(); renderMore(); }; });
    document.getElementById('exp').onclick = function () {
      var blob = new Blob([JSON.stringify(user, null, 2)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'spec-book-notes-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    };
    document.getElementById('imp').onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try { var u = JSON.parse(r.result); if (!u.drinks) throw 0; user = u; user.tech = user.tech || {}; user.settings = user.settings || { unit: 'oz' }; save();
          if (user.settings.coef) Calc.setCoefficients(user.settings.coef); derive(); document.getElementById('iomsg').textContent = 'Imported.';
        } catch (x) { document.getElementById('iomsg').textContent = 'That file did not look like a Spec Book backup.'; }
      };
      r.readAsText(f);
    };
  }

  function renderCheck() {
    var res = window.runCalcTests(Calc, DATA), f = 0, w = 0;
    res.forEach(function (r) { if (r.status === 'FAIL') f++; if (r.status === 'WARN') w++; });
    var k = Calc.getCoefficients();
    var h = '<header class="top detail"><a href="#/more" class="back">‹ More</a><h1>Calculator check</h1>' +
      '<p class="small"><b class="' + (f ? 'bad' : 'good') + '">' + (res.length - f - w) + ' passed · ' + f + ' failed</b> · ' + w + ' plausibility warnings</p></header>';
    h += '<section class="panel"><h2>1 · Confirm the coefficients</h2><p class="small">Check these against <i>Liquid Intelligence</i>. Secondary sources disagree on the stirred middle term (1.246 vs 1.26). Edit, save, and every drink recalculates.</p>' +
      '<div class="coef"><span>Shaken</span>' + k.shake.map(function (v, i) { return '<input data-m="shake" data-i="' + i + '" inputmode="decimal" value="' + v + '">'; }).join('') +
      '<span>Stirred</span>' + k.stir.map(function (v, i) { return '<input data-m="stir" data-i="' + i + '" inputmode="decimal" value="' + v + '">'; }).join('') + '</div>' +
      '<p class="muted small">d = a·A² + b·A + c</p><div class="row"><button id="csave" class="btn">Save</button><button id="creset" class="btn ghost">Reset defaults</button></div></section>';
    h += '<section class="panel"><h2>2 · Weigh test (your real dilution)</h2><p class="small">Weigh the drink in the tin before ice, then weigh what you strain out. Compare against the model.</p>' +
      '<div class="weigh"><select id="wd">' + DRINKS.filter(function (d) { return d.m !== 'build'; }).sort(function (a, b) { return a.name.localeCompare(b.name); }).map(function (d) { return '<option value="' + d.id + '">' + esc(d.name) + '</option>'; }).join('') + '</select>' +
      '<input id="wb" inputmode="decimal" placeholder="Before (g)"><input id="wa" inputmode="decimal" placeholder="After (g)"><button id="wgo" class="btn">Compare</button></div><p id="wout" class="small"></p></section>';
    h += '<section class="panel"><h2>3 · Automated tests</h2><ul class="tests">' + res.map(function (r) {
      return '<li class="t-' + r.status.toLowerCase() + '"><b>' + r.status + '</b> ' + esc(r.name) + (r.detail ? ' <small>' + esc(r.detail) + '</small>' : '') + '</li>';
    }).join('') + '</ul><p class="muted small">Warnings flag drinks outside rough ABV bands. Long, low-proof or amaro-based drinks are expected to trip them.</p></section>';
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
      document.getElementById('wout').innerHTML = 'Measured <b>' + pct(m) + '</b> water vs model <b>' + pct(p) + '</b> (' + (m - p >= 0 ? '+' : '') + ((m - p) * 100).toFixed(1) + ' pts). Weight approximates volume closely enough for this check.';
    };
  }

  /* ---------- router ---------- */
  function setTab(t) { document.querySelectorAll('nav.tabs a').forEach(function (a) { a.classList.toggle('on', a.dataset.t === t); }); }
  function route() {
    var h = location.hash.replace(/^#/, '') || '/';
    var parts = h.split('/').filter(Boolean);
    if (parts[0] === 'd') { setTab('browse'); if (parts[1] !== route.last) serves = 1; route.last = parts[1]; return renderDrink(parts[1]); }
    route.last = null;
    if (parts[0] === 'lineage') { setTab('lineage'); return renderLineage(); }
    if (parts[0] === 'tech') { setTab('tech'); return renderTechIndex(); }
    if (parts[0] === 't') { setTab('tech'); return renderTech(parts[1]); }
    if (parts[0] === 'more') { setTab('more'); return renderMore(); }
    if (parts[0] === 'check') { setTab('more'); return renderCheck(); }
    setTab('browse'); renderBrowse();
  }
  window.addEventListener('hashchange', route);
  route();

  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');
})();
