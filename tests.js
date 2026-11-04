/* Validation suite — runs in the browser (More > Calculator check) and in Node:
     node tests.js
   PASS/FAIL = math and data integrity. WARN = plausibility bands (informational). */
(function (root) {
  function runTests(Calc, DATA) {
    var out = [];
    function check(name, ok, detail) { out.push({ name: name, status: ok ? 'PASS' : 'FAIL', detail: detail || '' }); }
    function warn(name, detail) { out.push({ name: name, status: 'WARN', detail: detail }); }
    function near(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-6); }
    var ING = DATA.ING, D = DATA.DRINKS, OZ = Calc.ML_PER_OZ;
    var k = Calc.getCoefficients();

    // 1. Formula plumbing (independent evaluation of the quadratic)
    [0, 0.2, 0.25, 0.3].forEach(function (A) {
      var exp = k.shake[0] * A * A + k.shake[1] * A + k.shake[2];
      check('Shaken curve at A=' + A, near(Calc.shakenDilution(A), exp), 'got ' + Calc.shakenDilution(A).toFixed(4));
      var exs = k.stir[0] * A * A + k.stir[1] * A + k.stir[2];
      check('Stirred curve at A=' + A, near(Calc.stirredDilution(A), exs), 'got ' + Calc.stirredDilution(A).toFixed(4));
    });
    check('Shaken adds more water than stirred at A=0.25', Calc.shakenDilution(0.25) > Calc.stirredDilution(0.25));

    // 2. Hand-worked Daiquiri: 2 oz rum 40%, 0.75 lime, 0.75 simple
    (function () {
      var rum = 2 * OZ, lime = 0.75 * OZ, syr = 0.75 * OZ;
      var V = rum + lime + syr, eth = rum * 0.40, A = eth / V;
      var d = k.shake[0] * A * A + k.shake[1] * A + k.shake[2];
      var Vf = V * (1 + d);
      var expAbv = eth / Vf, expSug = (syr * 0.615 + lime * 0.016) / Vf * 100, expAcid = lime * 0.06 / Vf * 100;
      var r = Calc.compute([[2, 'oz', 'whiterum'], [0.75, 'oz', 'lime'], [0.75, 'oz', 'simple']], 'shake', ING);
      check('Daiquiri start ABV (hand calc ' + (A * 100).toFixed(2) + '%)', near(r.mixAbv, A, 1e-9));
      check('Daiquiri final ABV (hand calc ' + (expAbv * 100).toFixed(2) + '%)', near(r.finalAbv, expAbv, 1e-9), 'app ' + (r.finalAbv * 100).toFixed(2) + '%');
      check('Daiquiri sugar g/100 ml (hand ' + expSug.toFixed(2) + ')', near(r.sugarPer100, expSug, 1e-9));
      check('Daiquiri acid % (hand ' + expAcid.toFixed(3) + ')', near(r.acidPct, expAcid, 1e-9));
    })();

    // 3. Toppers skip the ice: French 75
    (function () {
      var pre = 1 * OZ + 0.5 * OZ + 0.5 * OZ, eth = 1 * OZ * ING.gin.abv, A = eth / pre;
      var d = k.shake[0] * A * A + k.shake[1] * A + k.shake[2];
      var top = 3 * OZ, Vf = pre * (1 + d) + top, ethT = eth + top * ING.champagne.abv;
      var r = Calc.compute(D.filter(function (x) { return x.id === 'french-75'; })[0].spec, 'shake', ING);
      check('Topper added after dilution (French 75)', near(r.finalMl, Vf, 1e-6) && near(r.finalAbv, ethT / Vf, 1e-9));
    })();

    // 4. Zero-volume items (solids, rinse, side) are ignored
    (function () {
      var a = Calc.compute([[2, 'oz', 'rye'], [1, 'rinse', 'absinthe'], [8, 'leaf', 'mint'], [2, 'oz', 'prosecco', { side: true }]], 'stir', ING);
      var b = Calc.compute([[2, 'oz', 'rye']], 'stir', ING);
      check('Rinse, solids and side pours excluded', near(a.finalMl, b.finalMl) && near(a.finalAbv, b.finalAbv));
    })();

    // 5. Scaling invariance and ethanol conservation across the whole collection
    var conserveFail = [], scaleFail = [];
    D.forEach(function (dr) {
      var r = Calc.compute(dr.spec, dr.m, ING);
      var eth = 0;
      dr.spec.forEach(function (it) { var ml = Calc.itemMl(it); if (ml && ING[it[2]]) eth += ml * (ING[it[2]].abv || 0); });
      if (!near(r.finalAbv * r.finalMl, eth, 1e-6)) conserveFail.push(dr.id);
      var dbl = dr.spec.map(function (it) { return [it[0] * 2, it[1], it[2], it[3]]; });
      var r2 = Calc.compute(dbl, dr.m, ING);
      if (!near(r2.finalAbv, r.finalAbv, 1e-9) || !near(r2.finalMl, r.finalMl * 2, 1e-6)) scaleFail.push(dr.id);
    });
    check('Ethanol conserved for all ' + D.length + ' drinks', !conserveFail.length, conserveFail.join(', '));
    check('Doubling a spec keeps ABV and doubles volume', !scaleFail.length, scaleFail.join(', '));

    // 6. Data integrity
    var ids = {}, dup = [], badIng = [], badParent = [], badTech = [];
    D.forEach(function (d) { if (ids[d.id]) dup.push(d.id); ids[d.id] = 1; });
    D.forEach(function (d) {
      d.spec.forEach(function (it) { if (!ING[it[2]]) badIng.push(d.id + ':' + it[2]); });
      if (d.parent && !ids[d.parent]) badParent.push(d.id);
      d.tech.forEach(function (t) { if (!DATA.TECH[t]) badTech.push(d.id + ':' + t); });
    });
    check('Unique drink ids', !dup.length, dup.join(', '));
    check('Every ingredient is defined', !badIng.length, badIng.join(', '));
    check('Every parent link resolves', !badParent.length, badParent.join(', '));
    check('Every technique tag has a page', !badTech.length, badTech.join(', '));
    var roots = D.filter(function (d) { return d.root; }).map(function (d) { return d.fam; }).sort().join('|');
    check('Six Codex roots present', roots === 'Daiquiri|Flip|Martini|Old-Fashioned|Sidecar|Whiskey Highball', roots);
    var cats = {}; D.forEach(function (d) { cats[d.cat] = (cats[d.cat] || 0) + 1; });
    check('Collection mix', true, 'Modern ' + (cats.Modern || 0) + ' · Classic ' + (cats.Classic || 0) + ' · Tiki ' + (cats.Tiki || 0));

    // 7. Plausibility bands (WARN only; tune to your book)
    var bands = { stir: [0.18, 0.32], shake: [0.11, 0.22], dryshake: [0.10, 0.20] };
    D.forEach(function (d) {
      var b = bands[d.m]; if (!b) return;
      var r = Calc.compute(d.spec, d.m, ING);
      if (r.finalAbv < b[0] || r.finalAbv > b[1]) warn(d.name + ' outside ' + d.m + ' band', (r.finalAbv * 100).toFixed(1) + '% (band ' + b[0] * 100 + '–' + b[1] * 100 + '%)');
    });
    return out;
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = runTests;
    if (require.main === module) {
      global.self = global;
      var Calc = require('./calc.js'); require('./data.js');
      var res = runTests(Calc, global.CC_DATA), f = 0, w = 0;
      res.forEach(function (r) { if (r.status === 'FAIL') f++; if (r.status === 'WARN') w++; console.log(r.status.padEnd(5), r.name, r.detail ? '— ' + r.detail : ''); });
      console.log('\n' + (res.length - f - w) + ' passed, ' + f + ' failed, ' + w + ' warnings');
      process.exit(f ? 1 : 0);
    }
  } else root.runCalcTests = runTests;
})(typeof self !== 'undefined' ? self : this);
