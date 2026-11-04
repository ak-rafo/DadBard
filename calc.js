/* Cocktail calculator: ABV, dilution, sugar, acid.
   Dilution model follows Dave Arnold's published regression approach (Liquid Intelligence):
     shaken  dilution = 1.567*A^2 + 1.742*A + 0.203
     stirred dilution = -1.21*A^2 + 1.246*A + 0.145
   where A = starting ABV as a fraction and the result is water added as a fraction of starting volume.
   All other numbers (ingredient sugar/acid/ABV) are approximations. Validate with tests/calc.test.js. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CocktailCalc = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var ML_PER_OZ = 29.5735;
  // volume of non-oz units, in ml
  var UNIT_ML = { oz: ML_PER_OZ, dash: 0.8, drop: 0.05, tsp: 4.93, bsp: 4.0, white: 30, egg: 45 };
  var SOLID = { leaf: 1, leaves: 1, slice: 1, sprig: 1, whole: 1, pinch: 1, rinse: 1, handful: 1, piece: 1 };

  // Default coefficients [a, b, c] for d = a*A^2 + b*A + c.
  // VERIFY against your copy of Liquid Intelligence; secondary sources quote the stirred
  // middle term as 1.246 or 1.26. You can override these in-app (More > Calculator check).
  var DEFAULT_COEF = { shake: [1.567, 1.742, 0.203], stir: [-1.21, 1.246, 0.145] };
  var COEF = { shake: DEFAULT_COEF.shake.slice(), stir: DEFAULT_COEF.stir.slice() };
  function setCoefficients(c) {
    if (c && c.shake && c.shake.length === 3) COEF.shake = c.shake.map(Number);
    if (c && c.stir && c.stir.length === 3) COEF.stir = c.stir.map(Number);
  }
  function quad(k, A) { return k[0] * A * A + k[1] * A + k[2]; }
  function shakenDilution(A) { return quad(COEF.shake, A); }
  function stirredDilution(A) { return quad(COEF.stir, A); }
  // Measured dilution from weighing a drink before and after ice (grams).
  function measuredDilution(gBefore, gAfter) { return gBefore > 0 ? (gAfter - gBefore) / gBefore : 0; }

  // method -> {fn, note}
  function dilutionFor(method, A) {
    switch (method) {
      case 'shake': case 'dryshake': case 'whip':
        return { d: shakenDilution(A), model: 'shaken' };
      case 'swizzle': case 'blend':
        return { d: shakenDilution(A), model: 'shaken (approx.)', warn: 'Crushed/pebble ice and blending usually add more water than this estimate.' };
      case 'stir':
        return { d: stirredDilution(A), model: 'stirred' };
      case 'build':
        return { d: 0, model: 'built (no ice melt counted)', warn: 'Assumes chilled ingredients; real melt on the rocks keeps adding water.' };
      default:
        return { d: 0, model: 'none' };
    }
  }

  function itemMl(item) {
    var amt = item[0], unit = item[1], opts = item[3] || {};
    if (opts.side || unit === 'rinse' || SOLID[unit]) return 0;
    if (unit === 'top') return amt * ML_PER_OZ;
    var per = UNIT_ML[unit];
    return per ? amt * per : 0;
  }

  /* spec: array of [amount, unit, ingredientKey, opts]
     ING: ingredient table {key:{abv, sug (g/ml), acid (g/ml as fraction w/v)}}
     returns stats for ONE serve */
  function compute(spec, method, ING) {
    var pre = { v: 0, eth: 0, sug: 0, acid: 0 }, post = { v: 0, eth: 0, sug: 0, acid: 0 };
    var missing = [];
    spec.forEach(function (it) {
      var ml = itemMl(it);
      if (!ml) return;
      var ing = ING[it[2]];
      if (!ing) { missing.push(it[2]); return; }
      var opts = it[3] || {};
      var bucket = (opts.post || it[1] === 'top') ? post : pre;
      bucket.v += ml;
      bucket.eth += ml * (ing.abv || 0);
      bucket.sug += ml * (ing.sug || 0);
      bucket.acid += ml * (ing.acid || 0);
    });
    var A0 = pre.v ? pre.eth / pre.v : 0;
    var dil = dilutionFor(method, A0);
    var water = pre.v * dil.d;
    var total = pre.v + water + post.v;
    var startV = pre.v + post.v;
    return {
      startMl: startV,
      startAbv: startV ? (pre.eth + post.eth) / startV : 0,
      mixAbv: A0,                     // ABV of the portion that meets ice
      dilution: dil.d,                // fraction of that portion
      waterMl: water,
      finalMl: total,
      finalAbv: total ? (pre.eth + post.eth) / total : 0,
      sugarPer100: total ? (pre.sug + post.sug) / total * 100 : 0,   // g / 100 ml
      acidPct: total ? (pre.acid + post.acid) / total * 100 : 0,     // % w/v
      model: dil.model,
      warn: dil.warn || null,
      missing: missing
    };
  }

  function strengthLabel(abv) {
    if (abv < 0.12) return 'Light';
    if (abv < 0.20) return 'Medium';
    return 'Strong';
  }

  return {
    ML_PER_OZ: ML_PER_OZ, DEFAULT_COEF: DEFAULT_COEF, getCoefficients: function(){ return { shake: COEF.shake.slice(), stir: COEF.stir.slice() }; },
    setCoefficients: setCoefficients, measuredDilution: measuredDilution, UNIT_ML: UNIT_ML, SOLID: SOLID,
    shakenDilution: shakenDilution, stirredDilution: stirredDilution,
    dilutionFor: dilutionFor, itemMl: itemMl, compute: compute, strengthLabel: strengthLabel
  };
});
