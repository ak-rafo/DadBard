/* Dad Bard: Evolution tree + Apothecary views. Uses helpers exported by app.js as window.DB. */
(function () {
  'use strict';
  var A = window.Apothecary;
  function DB() { return window.DB; }
  function $app() { return document.getElementById('app'); }
  function r1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function r0(x) { return String(Math.round(x)); }
  function g(x) { return x < 10 ? r1(x) : r0(x); }

  /* =========================================================
     EVOLUTION
     ========================================================= */
  var evo = { view: 'timeline', era: {}, type: {}, root: {}, mine: false, q: '' };
  function E() { return window.CC_DATA.EVO; }
  function node(id) { var s = E().STYLES; for (var i = 0; i < s.length; i++) if (s[i].id === id) return s[i]; }
  function kids(id) { return E().STYLES.filter(function (s) { return s.parent === id; }).sort(function (a, b) { return (b.trunk ? 1 : 0) - (a.trunk ? 1 : 0); }); }
  function eraOf(k) { return E().ERAS.filter(function (e) { return e.k === k; })[0]; }
  function typeOf(k) { return E().TYPES.filter(function (e) { return e.k === k; })[0]; }
  function drinksOf(n) { var seen = {}; return n.ex.map(function (id) { return DB().byId[id]; }).filter(function (d) { if (!d || seen[d.id]) return false; seen[d.id] = 1; return true; }); }
  function isMine(d) { return d.src === 'andrew' || (d.av && !d.match) || d.fromNotes; }
  function evoMatch(n) {
    if (Object.keys(evo.era).length && !evo.era[n.era]) return false;
    if (Object.keys(evo.type).length && !evo.type[n.type]) return false;
    if (Object.keys(evo.root).length && !evo.root[n.root]) return false;
    if (evo.mine && !drinksOf(n).some(isMine)) return false;
    if (evo.q) {
      var hay = [n.n, n.formula, n.blurb, n.year].concat(drinksOf(n).map(function (d) { return d.name; })).join(' ').toLowerCase();
      if (evo.q.toLowerCase().split(/\s+/).some(function (t) { return t && hay.indexOf(t) < 0; })) return false;
    }
    return true;
  }
  function path(n) { var p = [], seen = {}; while (n && !seen[n.id]) { seen[n.id] = 1; p.unshift(n); n = n.parent ? node(n.parent) : null; } return p; }
  function drinkChips(list, max) {
    var D = DB(), out = list.slice(0, max).map(function (d) {
      return D.link('#/d/' + d.id, (isMine(d) ? '🎻 ' : '') + D.esc(d.name), 'chip' + (d.src === 'andrew' ? ' mine' : ''));
    }).join('');
    if (list.length > max) out += '<span class="chip more">+' + (list.length - max) + ' more</span>';
    return '<div class="chips static">' + out + '</div>';
  }
  function evoCard(n) {
    var D = DB(), t = typeOf(n.type), par = n.parent && node(n.parent), also = n.also && node(n.also), ds = drinksOf(n);
    var mineN = ds.filter(isMine).length, kidsN = kids(n.id);
    return '<article class="evo-card' + (n.trunk ? ' trunk' : '') + '" style="--c:' + D.ROOT_COLORS[n.root] + '">' +
      '<div class="evo-top"><span class="yr">' + D.esc(n.year) + '</span><span class="evo-type">' + t.icon + ' ' + D.esc(t.n) + '</span></div>' +
      '<h3 class="evo-name">' + D.link('#/evo/' + n.id, D.esc(n.n)) + (n.trunk ? ' <span class="trunk-badge">trunk</span>' : '') + '</h3>' +
      '<div class="formula">' + D.esc(n.formula) + '</div><p>' + D.esc(n.blurb) + '</p>' +
      ((par || also) ? '<div class="evo-from">Grew from ' + (par ? D.link('#/evo/' + par.id, D.esc(par.n)) : '') + (also ? (par ? ' + ' : '') + D.link('#/evo/' + also.id, D.esc(also.n)) : '') + '</div>' : '') +
      (kidsN.length ? '<div class="evo-from">Branches into ' + kidsN.map(function (k) { return D.link('#/evo/' + k.id, D.esc(k.n)); }).join(', ') + '</div>' : '') +
      (ds.length ? drinkChips(ds, 6) : '<p class="muted small">No drinks of this style in your songbook yet.</p>') +
      (mineN ? '<div class="mine-count">🎻 ' + mineN + ' from your notes</div>' : '') +
      '</article>';
  }
  function evoFilters() {
    var D = DB(), Ev = E();
    var cnt = function (f) { return Ev.STYLES.filter(f).length; };
    return '<input id="evoq" type="search" class="full" placeholder="Search styles, formulas, drinks" value="' + D.esc(evo.q) + '">' +
      '<div class="flabel">Era</div>' +
      D.tiles('era', Ev.ERAS.map(function (e) { return { v: e.k, label: e.n, icon: e.icon, sub: e.span, count: cnt(function (s) { return s.era === e.k; }) }; }), function (v) { return evo.era[v]; }, 'wide') +
      '<div class="flabel">Style</div>' +
      D.pills('etype', Ev.TYPES.map(function (t) { return { v: t.k, label: t.n, icon: t.icon }; }), function (v) { return evo.type[v]; }) +
      '<div class="flabel">Codex family</div>' +
      D.pills('eroot', Object.keys(D.ROOT_COLORS).map(function (r) { return { v: r, label: r, icon: '<em class="dotc"></em>', color: D.ROOT_COLORS[r] }; }), function (v) { return evo.root[v]; }) +
      '<div class="row tight">' + D.pills('emine', [{ v: 'mine', label: 'Only styles with my drinks', icon: '🎻' }], function () { return evo.mine; }) +
      (Object.keys(evo.era).length + Object.keys(evo.type).length + Object.keys(evo.root).length + (evo.mine ? 1 : 0) + (evo.q ? 1 : 0) ? '<button id="evoclear" class="btn ghost small">Clear</button>' : '') + '</div>';
  }
  function treeLi(n) {
    var D = DB(), on = evoMatch(n), ks = kids(n.id), e = eraOf(n.era), ds = drinksOf(n);
    return '<li class="' + (on ? '' : 'dim') + (n.trunk ? ' trunk' : '') + '" style="--c:' + D.ROOT_COLORS[n.root] + '"><a href="#/evo/' + n.id + '" class="tnode"><i class="dotc"></i>' +
      '<span class="tn">' + D.esc(n.n) + '</span><span class="ty">' + e.icon + ' ' + D.esc(n.year) + '</span>' + (ds.length ? '<b class="tc">' + ds.length + '</b>' : '') + '</a>' +
      (n.also ? '<small class="also">+ ' + D.esc(node(n.also).n) + '</small>' : '') +
      (ks.length ? '<ul>' + ks.map(treeLi).join('') + '</ul>' : '') + '</li>';
  }
  function evolution(header) {
    var D = DB(), Ev = E();
    var h = header + '<section class="callout">You’re right: the Old Fashioned is the original “cocktail” (spirit, sugar, water, bitters), the trunk of the tree. Punch and the flip are even older cousins. They feed the sour, tiki and creamy branches.</section>';
    h += D.pills('evoview', [{ v: 'timeline', label: 'Timeline', icon: '🕰️' }, { v: 'tree', label: 'Tree', icon: '🌳' }], function (v) { return evo.view === v; });
    h += '<section class="panel filterpanel">' + evoFilters() + '</section>';
    var shown = Ev.STYLES.filter(evoMatch);
    if (evo.view === 'tree') {
      var roots = ['sling', 'punch', 'flip-style'].map(node);
      h += '<section class="panel"><p class="muted small">Tap a style to see its path from the roots. Faded styles don’t match your filters. Numbers are drinks in your songbook.</p><ul class="evotree">' + roots.map(treeLi).join('') + '</ul></section>';
    } else {
      h += '<div class="timeline">';
      Ev.ERAS.forEach(function (e) {
        var ns = shown.filter(function (s) { return s.era === e.k; });
        if (!ns.length) return;
        h += '<div class="era"><div class="era-head"><span class="era-ico">' + e.icon + '</span><div><b>' + D.esc(e.n) + '</b><small>' + e.span + '</small></div></div>' + ns.map(evoCard).join('') + '</div>';
      });
      if (!shown.length) h += '<p class="empty">No styles match. Loosen a filter.</p>';
      h += '</div>';
    }
    $app().innerHTML = h;
    var q = document.getElementById('evoq');
    q.oninput = function () { evo.q = q.value; var p = q.selectionStart; D.keep(function () { evolution(header); }); var nq = document.getElementById('evoq'); nq.focus(); nq.setSelectionRange(p, p); };
    function tog(map, v) { if (map[v]) delete map[v]; else map[v] = 1; D.keep(function () { evolution(header); }); }
    D.onTap('era', function (v) { tog(evo.era, v); });
    D.onTap('etype', function (v) { tog(evo.type, v); });
    D.onTap('eroot', function (v) { tog(evo.root, v); });
    D.onTap('emine', function () { evo.mine = !evo.mine; D.keep(function () { evolution(header); }); });
    D.onTap('evoview', function (v) { evo.view = v; D.keep(function () { evolution(header); }); });
    var c = document.getElementById('evoclear'); if (c) c.onclick = function () { evo.era = {}; evo.type = {}; evo.root = {}; evo.mine = false; evo.q = ''; evolution(header); };
    D.bindLinMode();
  }
  function evoNode(id) {
    var D = DB(), n = node(id); if (!n) { location.hash = '#/lineage'; return; }
    var t = typeOf(n.type), e = eraOf(n.era), ds = drinksOf(n), ks = kids(n.id), also = n.also && node(n.also);
    var h = '<header class="top detail"><a href="#/lineage" class="back">‹ Bloodlines</a><h1>' + D.esc(n.n) + '</h1><div class="badges">' +
      '<span class="pill">' + e.icon + ' ' + D.esc(e.n) + '</span><span class="pill">' + t.icon + ' ' + D.esc(t.n) + '</span>' +
      '<span class="pill" style="color:' + D.ROOT_COLORS[n.root] + ';border-color:' + D.ROOT_COLORS[n.root] + '">' + D.esc(n.root) + ' family</span></div></header>';
    h += '<section class="panel"><h2>Path from the roots</h2><ol class="pathline">' + path(n).map(function (p) {
      return '<li style="--c:' + D.ROOT_COLORS[p.root] + '"' + (p.id === n.id ? ' class="here"' : '') + '>' + (p.id === n.id ? '<b>' + D.esc(p.n) + '</b>' : D.link('#/evo/' + p.id, D.esc(p.n))) + ' <small>' + D.esc(p.year) + '</small></li>';
    }).join('') + '</ol>' + (also ? '<p class="small">Also shaped by ' + D.link('#/evo/' + also.id, D.esc(also.n)) + '.</p>' : '') + '</section>';
    h += '<section class="panel" style="box-shadow:inset 3px 0 0 ' + D.ROOT_COLORS[n.root] + '"><div class="formula big">' + D.esc(n.formula) + '</div><p>' + D.esc(n.blurb) + '</p>' +
      (n.tech ? '<p>' + D.link('#/t/' + n.tech, 'Technique: ' + D.esc(D.TECH[n.tech].t) + ' →') + '</p>' : '') + '</section>';
    if (ks.length) h += '<section class="panel"><h2>Branches</h2><ul class="tlist">' + ks.map(function (k) { return '<li>' + D.link('#/evo/' + k.id, D.esc(k.n)) + ' <span class="muted small">' + D.esc(k.year) + ' · ' + D.esc(k.formula) + '</span></li>'; }).join('') + '</ul></section>';
    h += '<section class="panel"><h2>In your songbook · ' + ds.length + '</h2>' + (ds.length ? '<ul class="cards">' + ds.map(D.card).join('') + '</ul>' : '<p class="muted">None yet.</p>') + '</section>';
    $app().innerHTML = h; window.scrollTo(0, 0);
  }

  /* =========================================================
     APOTHECARY
     ========================================================= */
  function S() { var u = DB().user; u.settings.apo = u.settings.apo || {}; var a = u.settings.apo;
    a.sj = a.sj || { fruit: 'lime', mode: 'peel', peel: 100, target: 1000, juice: 0 };
    a.sy = a.sy || { cat: '', id: 'simple', ratio: null, basis: 'weight', target: 500, mult: 1 };
    a.aa = a.aa || { fruit: 'orange', target: 'lime', vol: 1000, unit: 'ml', cb: [0.5, 0.2] };
    return a; }
  var TOOLS = [{ v: 'super', label: 'Super juice', icon: '🍋', sub: 'Kevin Kos ratios' }, { v: 'syrups', label: 'Syrups', icon: '🍯', sub: 'Ratios & yield' }, { v: 'acid', label: 'Acid adjust', icon: '⚗️', sub: 'Juice → lime/lemon' }];
  function numIn(id, val, unit, step) {
    return '<div class="numin"><button data-step="-' + step + '" data-for="' + id + '" aria-label="Less">−</button><input id="' + id + '" inputmode="decimal" value="' + val + '"><span class="unit">' + unit + '</span><button data-step="' + step + '" data-for="' + id + '" aria-label="More">+</button></div>';
  }
  function bindNum(onChange) {
    $app().querySelectorAll('.numin input').forEach(function (i) { i.oninput = function () { onChange(i.id, parseFloat(i.value) || 0); }; });
    $app().querySelectorAll('.numin button').forEach(function (b) {
      b.onclick = function () { var i = document.getElementById(b.dataset.for), v = Math.max(0, (parseFloat(i.value) || 0) + parseFloat(b.dataset.step)); i.value = v; onChange(i.id, v); };
    });
  }
  function outGrid(items) { return '<div class="outgrid">' + items.map(function (x) { return '<div' + (x.hi ? ' class="hi"' : '') + '><b>' + x.v + '</b><span>' + x.l + '</span>' + (x.s ? '<small>' + x.s + '</small>' : '') + '</div>'; }).join('') + '</div>'; }
  function saveBtn(prep, text) {
    return prep ? '<button class="btn savebtn" data-prep="' + prep + '" data-text="' + DB().esc(text) + '">🎻 Save to my ' + DB().esc(DB().TECH[prep].t) + ' page</button><span class="muted small savemsg"></span>' : '';
  }
  function bindSave() {
    $app().querySelectorAll('.savebtn').forEach(function (b) {
      b.onclick = function () {
        var D = DB(), u = D.user, k = b.dataset.prep, cur = u.tech[k] || '';
        u.tech[k] = (cur ? cur.replace(/\s+$/, '') + '\n\n' : '') + b.dataset.text; D.save();
        b.nextElementSibling.textContent = 'Saved. ' ; b.nextElementSibling.innerHTML = 'Saved. ' + D.link('#/t/' + k, 'View page →');
      };
    });
  }
  function apothecary(tool, arg) {
    var D = DB(), st = S();
    tool = tool || st.tool || 'super'; st.tool = tool;
    if (tool === 'syrups' && arg && A.syrupById(arg)) { st.sy.id = arg; st.sy.ratio = null; }
    D.save();
    var h = '<header class="top"><h1>The Apothecary</h1><p class="tagline">Weigh it, pour it, fix it.</p></header>' +
      D.tiles('tool', TOOLS, function (v) { return v === tool; }, 'tools');
    h += '<div id="apo-body"></div>';
    $app().innerHTML = h;
    D.onTap('tool', function (v) { location.hash = '#/apothecary/' + v; });
    ({ super: superView, syrups: syrupView, acid: acidView })[tool]();
  }

  /* ---------- super juice ---------- */
  function superView() {
    var D = DB(), st = S().sj, f = A.SUPER[st.fruit];
    var h = '<section class="panel">' +
      D.tiles('sjfruit', Object.keys(A.SUPER).map(function (k) { var x = A.SUPER[k]; return { v: k, label: x.n, icon: '<span class="fruitdot" style="background:' + x.color + '"></span>', color: x.color }; }), function (v) { return v === st.fruit; }, 'fruits') +
      '<div class="ratio">' + f.src + ' · ' + (f.citric ? f.citric + '× citric' : '') + (f.malic ? ' · ' + f.malic + '× malic' : '') + ' · ' + f.water + '× water <span class="muted">(× peel weight)</span></div>' +
      (f.andrew ? '<div class="matchnote">✓ Same as the super juice recipe in your notes</div>' : '') +
      D.pills('sjmode', [{ v: 'peel', label: 'I have peels', icon: '⚖️' }, { v: 'target', label: 'I need a volume', icon: '🎯' }], function (v) { return v === st.mode; }) +
      (st.mode === 'peel' ? '<label class="inlabel">Peel weight</label>' + numIn('sjpeel', st.peel, 'g', 10) : '<label class="inlabel">Target yield (before juice)</label>' + numIn('sjtarget', st.target, 'ml', 100)) +
      (st.mode === 'peel' ? '<label class="inlabel">Juice of the peeled fruit <span class="muted">(optional)</span></label>' + numIn('sjjuice', st.juice, 'ml', 25) : '') +
      '<div id="sjout"></div></section>' +
      '<section class="panel"><h2>Method</h2><ol class="steps">' +
      '<li>Peel the fruit with a Y-peeler (skip the white pith) and weigh the peels.</li>' +
      '<li>Toss the peels with the acid' + (f.malic ? 's' : '') + ' in a jar and let them sit up to 2 hours. This makes an oleo citrate.</li>' +
      '<li>Move everything to a blender, rinse the jar with the measured water, then add the water and the peeled fruit’s juice.</li>' +
      '<li>Blend about 30 seconds and strain through cheesecloth.</li>' +
      '<li>Bottle, label with the date, refrigerate, and use within about a week.</li></ol>' +
      '<p class="muted small">Ratios: Kevin Kos (adapting Nickle Morris’s super juice with Dave Arnold’s acid numbers). His calculator also covers grapefruit and kumquat.</p></section>';
    document.getElementById('apo-body').innerHTML = h;
    function out() {
      var r = A.superJuice(st.fruit, { mode: st.mode, peel: st.peel, target: st.target, juice: st.mode === 'peel' ? st.juice : 0 });
      var text = f.n + ' super juice (' + new Date().toLocaleDateString() + '): ' + g(r.peel) + ' g peel, ' + g(r.citric) + ' g citric' + (f.malic ? ', ' + g(r.malic) + ' g malic' : '') + ', ' + r0(r.water) + ' g water' + (r.juice ? ', + ' + r0(r.juice) + ' ml juice' : '') + ' → about ' + r0(r.yieldMl) + ' ml.';
      document.getElementById('sjout').innerHTML = outGrid([
        st.mode === 'target' ? { v: g(r.peel) + ' g', l: 'Peels needed', hi: true } : null,
        { v: g(r.citric) + ' g', l: 'Citric acid', hi: true },
        f.malic ? { v: g(r.malic) + ' g', l: 'Malic acid', hi: true } : null,
        { v: r0(r.water) + ' g', l: 'Water', s: '= ' + r0(r.water) + ' ml · ' + r1(r.water / A.ML_PER_OZ) + ' oz' },
        { v: r0(r.yieldMl) + ' ml', l: 'Yield', s: r1(r.yieldMl / A.ML_PER_OZ) + ' oz · ~' + Math.floor(r.yieldMl / (0.75 * A.ML_PER_OZ)) + ' drinks at ¾ oz' },
        { v: '≈' + r1(r.acidPct) + '%', l: 'Acidity', s: st.fruit === 'orange' ? 'acid-adjusted orange' : 'fresh juice ≈ 6%' }
      ].filter(Boolean)) + saveBtn('super-juice', text);
      bindSave();
    }
    DB().onTap('sjfruit', function (v) { st.fruit = v; DB().save(); DB().keep(superView); });
    DB().onTap('sjmode', function (v) { st.mode = v; DB().save(); DB().keep(superView); });
    bindNum(function (id, v) { if (id === 'sjpeel') st.peel = v; if (id === 'sjtarget') st.target = v; if (id === 'sjjuice') st.juice = v; DB().save(); out(); });
    out();
  }

  /* ---------- syrups ---------- */
  var SY_CATS = [{ v: '', label: 'All', icon: '✦' }, { v: 'Basic', label: 'Basic', icon: '🧂' }, { v: 'Spiced', label: 'Spiced', icon: '🪵' }, { v: 'Fruit', label: 'Fruit', icon: '🍓' }, { v: 'Herbal', label: 'Herbal & tea', icon: '🌿' }, { v: 'Andrew’s', label: 'Andrew’s', icon: '🎻' }];
  function cups(x) { var q = Math.round(x * 4) / 4, w = Math.floor(q), fr = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' }[q - w]; return (w || !fr ? w : '') + (fr || '') + ' cup' + (q > 1 ? 's' : ''); }
  function syrupView() {
    var D = DB(), st = S().sy, p = A.syrupById(st.id) || A.SYRUPS[0];
    var list = A.SYRUPS.filter(function (s) { return !st.cat || s.cat === st.cat; });
    var unwritten = function (s) { return s.prep && D.TECH[s.prep] && D.TECH[s.prep].missing && !D.user.tech[s.prep]; };
    var h = '<section class="panel">' + D.pills('sycat', SY_CATS, function (v) { return v === st.cat; }) +
      '<div class="sygrid">' + list.map(function (s) {
        return '<button class="sytile' + (s.id === p.id ? ' on' : '') + (s.mine ? ' mine' : '') + '" data-sy="' + s.id + '"><i>' + s.icon + '</i><span>' + D.esc(s.n) + '</span>' + (unwritten(s) ? '<em title="Not in your notes yet">✍️</em>' : '') + '</button>';
      }).join('') + '</div></section>';
    h += '<section class="panel' + (p.mine ? ' mine' : '') + '"><h2>' + p.icon + ' ' + D.esc(p.n) + (p.mine ? ' · your recipe' : '') + '</h2>';
    if (p.kind === 'scaled') {
      h += '<label class="inlabel">Batch size</label>' + D.pills('symult', [0.5, 1, 2, 3, 4].map(function (m) { return { v: String(m), label: (m === 0.5 ? '½' : m) + '×' }; }), function (v) { return +v === st.mult; });
    } else {
      var opts = p.ratioOpts || [1, 1.5, 2];
      var ratio = st.ratio || p.ratio;
      h += '<label class="inlabel">' + (p.kind === 'honey' ? D.esc(A.SWEET[p.sweet].n) + ' : liquid' : 'Sugar : liquid') + '</label>' +
        D.pills('syratio', opts.map(function (r) { return { v: String(r), label: (r === 1.5 ? '1½' : r) + ' : 1' + (r === p.ratio ? ' ★' : '') }; }), function (v) { return +v === ratio; }) +
        D.pills('sybasis', [{ v: 'weight', label: 'By weight', icon: '⚖️' }, { v: 'volume', label: 'By volume (cups)', icon: '🥛' }], function (v) { return v === st.basis; }) +
        '<label class="inlabel">How much do you want?</label>' + numIn('sytarget', st.target, 'ml', 50) +
        D.pills('syquick', [250, 500, 750, 1000].map(function (x) { return { v: String(x), label: x < 1000 ? x + ' ml' : '1 L' }; }), function (v) { return +v === st.target; });
    }
    h += '<div id="syout"></div></section>';
    h += '<section class="panel"><h2>Method</h2><ol class="steps">' + p.method.map(function (m) { return '<li>' + D.esc(m) + '</li>'; }).join('') + '</ol>' +
      (p.kind === 'sugar' && !p.mine ? '<p class="muted small">Starter recipe in my wording. Tweak it, then save your version to your prep page.</p>' : '') + '</section>';
    document.getElementById('apo-body').innerHTML = h;

    function out() {
      var o = '', text = '';
      if (p.kind === 'scaled') {
        var m = st.mult;
        var rows = p.items.map(function (it) {
          var q = it.q * m, txt;
          if (it.unit === 'cup') txt = cups(q) + (/sugar/i.test(it.n) ? ' (' + r0(q * A.CUP_SUGAR_G) + ' g)' : ' (' + r0(q * A.CUP_ML) + ' ml)');
          else if (it.unit === 'tsp') txt = (q === 0.5 ? '½' : q === 0.25 ? '¼' : r1(q)) + ' tsp';
          else if (it.unit === '') txt = r1(q) + ' ' + (p.unitLabel || '');
          else if (it.unit === 'big handful') txt = r1(q) + ' big handful' + (q > 1 ? 's' : '');
          else txt = g(q) + ' ' + it.unit;
          return { n: it.n, t: txt };
        });
        o = '<ul class="spec">' + rows.map(function (r) { return '<li><span class="amt">' + D.esc(r.t) + '</span><span class="ing">' + D.esc(r.n) + '</span></li>'; }).join('') + '</ul>';
        if (p.id === 'orgeat') o += '<p class="muted small">Sugar converted at 200 g per cup.</p>';
      } else {
        var ratio = st.ratio || p.ratio, r, swName;
        if (p.kind === 'honey') { r = A.honeySyrup(p.sweet, ratio, st.target, st.basis); swName = A.SWEET[p.sweet].n; }
        else { r = A.sugarSyrup(ratio, st.target, st.basis); swName = p.sugarName; }
        var adds = (p.adds || []).map(function (a) {
          var q = a.per500 ? a.per500 * st.target / 500 : a.perSugar ? a.perSugar * r.sweetG : a.perLiquid ? a.perLiquid * r.liquidMl : a.pctTotal ? (r.sweetG + r.liquidMl) * a.pctTotal / 100 : 0;
          return { v: (a.unit === 'sprigs' ? Math.max(1, Math.round(q)) : g(q)) + ' ' + a.unit, l: a.n };
        });
        o = outGrid([
          { v: r0(r.sweetG) + ' g', l: swName, s: p.kind === 'honey' ? r0(r.sweetMl) + ' ml' : cups(r.sweetG / A.CUP_SUGAR_G), hi: true },
          { v: r0(r.liquidMl) + ' ml', l: p.liquid, s: cups(r.liquidMl / A.CUP_ML) + ' · ' + r1(r.liquidMl / A.ML_PER_OZ) + ' oz', hi: true }
        ].concat(adds).concat([
          { v: r0(r.yieldMl) + ' ml', l: 'Yield', s: r1(r.yieldMl / A.ML_PER_OZ) + ' oz' },
          { v: r1(r.brix) + '°', l: 'Brix (sugar %)' },
          { v: r1(r.gPerOz) + ' g', l: 'Sugar per oz', s: r1(r.gPerOz / 6) + ' g per barspoon' }
        ]));
        if (p.id === 'simple') o += '<p class="muted small">Your rule of thumb is about 15 g of sugar per oz. 1:1 by weight comes out nearer 18 g, and 1:1 by cups nearer 16 g.</p>';
        text = p.n + ' syrup (' + new Date().toLocaleDateString() + '): ' + (ratio === 1.5 ? '1½' : ratio) + ':1 ' + (st.basis === 'volume' ? 'by volume' : 'by weight') + '. ' + r0(r.sweetG) + ' g ' + swName.toLowerCase() + ' + ' + r0(r.liquidMl) + ' ml ' + p.liquid.toLowerCase() +
          (adds.length ? ' + ' + adds.map(function (a) { return a.v + ' ' + a.l.toLowerCase(); }).join(' + ') : '') + ' → about ' + r0(r.yieldMl) + ' ml.';
      }
      document.getElementById('syout').innerHTML = o + (p.mine ? '' : saveBtn(p.prep, text));
      bindSave();
    }
    $app().querySelectorAll('.sytile').forEach(function (b) { b.onclick = function () { st.id = b.dataset.sy; st.ratio = null; st.mult = 1; D.save(); D.keep(syrupView); }; });
    D.onTap('sycat', function (v) { st.cat = v; D.save(); D.keep(syrupView); });
    D.onTap('symult', function (v) { st.mult = +v; D.save(); D.keep(syrupView); });
    D.onTap('syratio', function (v) { st.ratio = +v; D.save(); D.keep(syrupView); });
    D.onTap('sybasis', function (v) { st.basis = v; D.save(); D.keep(syrupView); });
    D.onTap('syquick', function (v) { st.target = +v; D.save(); D.keep(syrupView); });
    bindNum(function (id, v) { st.target = v; D.save(); out(); });
    out();
  }

  /* ---------- acid adjust ---------- */
  var UNIT = { ml: 1, oz: A.ML_PER_OZ, L: 1000 };
  function acidView() {
    var D = DB(), st = S().aa, f = A.fruit(st.fruit);
    var h = '<section class="panel">' +
      '<div class="flabel">Juice you have</div>' +
      D.tiles('aafruit', A.FRUITS.map(function (x) { return { v: x.k, label: x.n, icon: x.icon, sub: x.pub ? 'published' : x.k === 'custom' ? 'your numbers' : 'estimate' }; }), function (v) { return v === st.fruit; }, 'fruits') +
      '<div class="flabel">Make it as sour as</div>' +
      D.pills('aatarget', [{ v: 'lime', label: 'Lime · 4% citric + 2% malic', icon: '🟢' }, { v: 'lemon', label: 'Lemon · 6% citric', icon: '🍋' }], function (v) { return v === st.target; }) +
      (st.fruit === 'custom' ? '<div class="flabel">Your juice’s acidity (%)</div><div class="duo"><label>Citric ' + numIn('aacc', st.cb[0], '%', 0.1) + '</label><label>Malic ' + numIn('aacm', st.cb[1], '%', 0.1) + '</label></div>' : '') +
      '<label class="inlabel">Juice volume</label>' + numIn('aavol', st.vol, st.unit, st.unit === 'L' ? 0.25 : st.unit === 'oz' ? 4 : 50) +
      D.pills('aaunit', ['ml', 'oz', 'L'].map(function (u) { return { v: u, label: u }; }), function (v) { return v === st.unit; }) +
      '<div id="aaout"></div></section>' +
      '<section class="panel"><h2>How to</h2><ol class="steps"><li>Measure the juice first, then weigh the acids. Use a 0.01 g scale for small batches.</li><li>Stir until the powder fully dissolves (a minute or two).</li><li>Taste. Sweeter juices may need a little less syrup in the drink.</li></ol>' +
      '<p class="muted small">Orange, grapefruit and pineapple use the widely published per-liter ratios. Others are estimated from typical fruit acidity: lime ≈ 4% citric + 2% malic, lemon ≈ 6% citric. Fruit varies, so treat estimates as a starting point.</p></section>';
    document.getElementById('apo-body').innerHTML = h;
    function out() {
      var ml = st.vol * UNIT[st.unit], r = A.acidAdjust(st.fruit, st.target, ml, st.cb);
      var badge = r.how === 'published' ? '<span class="conf conf-high">published ratio</span>' : r.how === 'estimate' ? '<span class="conf conf-medium">estimate · taste and adjust</span>' : '<span class="conf conf-own">your numbers</span>';
      var matches = f.andrew === st.target ? '<div class="matchnote">✓ Matches your acid-adjusted OJ note (1 L: 32 g citric, 20 g malic)</div>' : '';
      var tiny = (r.citric > 0 && r.citric < 1) || (r.malic > 0 && r.malic < 1);
      document.getElementById('aaout').innerHTML = '<div class="badgeline">' + badge + '</div>' + matches + outGrid([
        { v: (r.citric < 10 ? r.citric.toFixed(2) : r0(r.citric)) + ' g', l: 'Citric acid', hi: true },
        { v: (r.malic < 10 ? r.malic.toFixed(2) : r0(r.malic)) + ' g', l: 'Malic acid', hi: true },
        { v: r0(ml) + ' ml', l: f.n + ' juice', s: r1(ml / A.ML_PER_OZ) + ' oz' }
      ]) + '<p class="small muted">Per liter: ' + r1(r.perL[0]) + ' g citric' + (r.perL[1] ? ' + ' + r1(r.perL[1]) + ' g malic' : '') + '.</p>' +
        (tiny ? '<p class="warnline">Amounts under 1 g are hard to weigh on a kitchen scale. Make at least 250 ml, or use a 0.01 g scale.</p>' : '') +
        (st.fruit === 'orange' && st.target === 'lime' ? saveBtn('acid-adjusted-oj', 'Acid-adjusted OJ (' + new Date().toLocaleDateString() + '): ' + r0(ml) + ' ml orange juice + ' + r1(r.citric) + ' g citric + ' + r1(r.malic) + ' g malic.') : '');
      bindSave();
    }
    D.onTap('aafruit', function (v) { st.fruit = v; D.save(); D.keep(acidView); });
    D.onTap('aatarget', function (v) { st.target = v; D.save(); D.keep(acidView); });
    D.onTap('aaunit', function (v) { var ml = st.vol * UNIT[st.unit]; st.unit = v; st.vol = Math.round(ml / UNIT[v] * 100) / 100; D.save(); D.keep(acidView); });
    bindNum(function (id, v) { if (id === 'aavol') st.vol = v; if (id === 'aacc') st.cb[0] = v; if (id === 'aacm') st.cb[1] = v; D.save(); out(); });
    out();
  }

  window.DBViews = { evolution: evolution, evoNode: evoNode, apothecary: apothecary };
})();
