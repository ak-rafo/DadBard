/* ============================================================
   APOTHECARY: super juice, syrups, acid adjusting (data + math)
   Pure functions so tests.js can check them in Node.
   ============================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Apothecary = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var ML_PER_OZ = 29.5735;
  var SUCROSE_ML_PER_G = 0.63;     // volume sugar adds when dissolved (approx.)
  var CUP_SUGAR_G = 200, CUP_ML = 236.6;

  /* ---------- Super juice (Kevin Kos ratios, × peel weight) ---------- */
  var SUPER = {
    lime:   { n: 'Lime',   icon: '🟢', color: '#8fc04a', citric: 0.66, malic: 0.33, water: 16.66, juiceAcid: 0.06, src: 'Kevin Kos' },
    lemon:  { n: 'Lemon',  icon: '🍋', color: '#f2d14b', citric: 1.00, malic: 0,    water: 16.66, juiceAcid: 0.06, src: 'Kevin Kos', andrew: true },
    orange: { n: 'Orange', icon: '🍊', color: '#f39a3c', citric: 0.90, malic: 0.10, water: 16.66, juiceAcid: 0.009, src: 'Kevin Kos (acid-adjusted)' }
  };
  function superJuice(fruit, opts) {
    var f = SUPER[fruit]; opts = opts || {};
    var peel = opts.mode === 'target' ? (opts.target || 0) / (f.water + (opts.juicePerPeel || 0)) : (opts.peel || 0);
    var juice = opts.mode === 'target' ? peel * (opts.juicePerPeel || 0) : (opts.juice || 0);
    var citric = peel * f.citric, malic = peel * f.malic, water = peel * f.water;
    var yieldMl = water + juice;
    var acidPct = yieldMl ? (citric + malic + juice * f.juiceAcid) / yieldMl * 100 : 0;
    return { peel: peel, citric: citric, malic: malic, water: water, juice: juice, yieldMl: yieldMl, acidPct: acidPct };
  }

  /* ---------- Acid adjusting ---------- */
  var TARGETS = {
    lime:  { n: 'Lime strength',  citric: 4.0, malic: 2.0 },   // % w/v
    lemon: { n: 'Lemon strength', citric: 6.0, malic: 0 }
  };
  // published: grams per liter for each target (VinePair / Existing Conditions table)
  var FRUITS = [
    { k: 'orange',     n: 'Orange',     icon: '🍊', pub: { lime: [32, 20], lemon: [52, 0] }, andrew: 'lime' },
    { k: 'grapefruit', n: 'Grapefruit', icon: '🔴', pub: { lime: [27, 13], lemon: [40, 0] } },
    { k: 'pineapple',  n: 'Pineapple',  icon: '🍍', pub: { lime: [32, 20], lemon: [52, 0] } },
    // estimates: base acid % (citric, malic); taste and adjust
    { k: 'apple',      n: 'Apple',      icon: '🍏', base: [0, 0.5] },
    { k: 'strawberry', n: 'Strawberry', icon: '🍓', base: [0.7, 0.1] },
    { k: 'watermelon', n: 'Watermelon', icon: '🍉', base: [0.05, 0.1] },
    { k: 'mango',      n: 'Mango',      icon: '🥭', base: [0.3, 0.1] },
    { k: 'custom',     n: 'Custom',     icon: '✏️', base: [0, 0] }
  ];
  function fruit(k) { for (var i = 0; i < FRUITS.length; i++) if (FRUITS[i].k === k) return FRUITS[i]; }
  function acidAdjust(fk, tk, ml, customBase) {
    var f = fruit(fk), t = TARGETS[tk], perL, how;
    if (f.pub) { perL = f.pub[tk]; how = 'published'; }
    else {
      var b = fk === 'custom' && customBase ? customBase : f.base;
      perL = [Math.max(0, (t.citric - b[0]) * 10), Math.max(0, (t.malic - b[1]) * 10)];
      how = fk === 'custom' ? 'custom' : 'estimate';
    }
    return { citric: perL[0] * ml / 1000, malic: perL[1] * ml / 1000, perL: perL, how: how };
  }

  /* ---------- Syrups ----------
     kind: 'sugar'   sugar + liquid by ratio (sugar:liquid)
           'honey'   sweetener with its own density/sugar (honey, agave)
           'scaled'  fixed recipe scaled by a multiplier (your house recipes) */
  var SWEET = {
    honey: { n: 'Honey', dens: 1.42, sugar: 0.82 },
    agave: { n: 'Agave nectar', dens: 1.36, sugar: 0.75 }
  };
  var SYRUPS = [
    { id: 'simple', n: 'Simple', cat: 'Basic', icon: '🧂', kind: 'sugar', ratio: 1, sugarName: 'White sugar', liquid: 'Water', prep: 'simple-syrup',
      method: ['Stir sugar into water until fully dissolved. Warm water speeds it up; no need to boil.', 'Cool, bottle and refrigerate.'] },
    { id: 'rich', n: 'Rich simple', cat: 'Basic', icon: '💎', kind: 'sugar', ratio: 2, sugarName: 'White sugar', liquid: 'Water',
      method: ['Warm the water and stir in the sugar until clear. Rich syrup keeps longer than 1:1.', 'Cool, bottle and refrigerate.'] },
    { id: 'demerara', n: 'Demerara', cat: 'Basic', icon: '🟫', kind: 'sugar', ratio: 2, sugarName: 'Demerara sugar', liquid: 'Water',
      method: ['Warm the water and stir in the demerara until dissolved.', 'Great in Old Fashioneds and tiki.'] },
    { id: 'honey', n: 'Honey', cat: 'Basic', icon: '🍯', kind: 'honey', sweet: 'honey', ratio: 1, ratioOpts: [1, 2, 3], liquid: 'Warm water', prep: 'honey-syrup',
      method: ['Stir honey into warm water until smooth.', 'Your ratio isn’t in your notes yet. Pick one, then save it to your prep page.'] },
    { id: 'agave', n: 'Agave', cat: 'Basic', icon: '🌵', kind: 'honey', sweet: 'agave', ratio: 2, ratioOpts: [1, 2], liquid: 'Water',
      method: ['Stir agave nectar into water until combined. No heat needed.'] },
    { id: 'cinnamon', n: 'Cinnamon', cat: 'Spiced', icon: '🪵', kind: 'sugar', ratio: 1, sugarName: 'White or demerara sugar', liquid: 'Water', prep: 'cinnamon-syrup',
      adds: [{ n: 'Cinnamon sticks, broken', per500: 10, unit: 'g' }],
      method: ['Simmer the water with the broken cinnamon for about 5 minutes.', 'Stir in the sugar off the heat, steep 30–60 minutes (taste as you go), then strain.'] },
    { id: 'ginger', n: 'Ginger', cat: 'Spiced', icon: '🫚', kind: 'sugar', ratio: 1, sugarName: 'White sugar', liquid: 'Fresh ginger juice',
      method: ['Juice fresh ginger (or blend with a splash of water and press through a cloth).', 'Stir sugar into the juice cold. No heat keeps the bite.'] },
    { id: 'honey-ginger', n: 'Honey-ginger', cat: 'Spiced', icon: '🐝', kind: 'honey', sweet: 'honey', ratio: 1, ratioOpts: [1, 2], liquid: 'Fresh ginger juice',
      method: ['Stir honey into fresh ginger juice until combined. Used in the Penicillin.'] },
    { id: 'raspberry', n: 'Raspberry', cat: 'Fruit', icon: '🫐', kind: 'sugar', ratio: 1, sugarName: 'White sugar', liquid: 'Water', prep: 'raspberry-syrup',
      adds: [{ n: 'Raspberries (fresh or frozen)', perSugar: 1, unit: 'g' }],
      method: ['Warm water and sugar until dissolved, add the berries and lightly crush.', 'Hold below a simmer for 10 minutes, cool, and fine-strain without pressing hard.'] },
    { id: 'grenadine', n: 'Grenadine', cat: 'Fruit', icon: '🍒', kind: 'sugar', ratio: 1, sugarName: 'White sugar', liquid: 'Pomegranate juice (100%)',
      adds: [{ n: 'Orange blossom water (optional)', per500: 2, unit: 'ml' }],
      method: ['Stir sugar into pomegranate juice over low heat until dissolved. Don’t boil.', 'Add the orange blossom water off the heat.'] },
    { id: 'cherry', n: 'Cherry', cat: 'Fruit', icon: '🍒', kind: 'sugar', ratio: 1, sugarName: 'White sugar', liquid: 'Water', prep: 'cherry-syrup',
      adds: [{ n: 'Pitted cherries (fresh or frozen)', perSugar: 1, unit: 'g' }],
      method: ['Simmer cherries in the water about 10 minutes, crushing them as they soften.', 'Strain, then stir in the sugar while warm.'] },
    { id: 'passion', n: 'Passion fruit', cat: 'Fruit', icon: '💛', kind: 'sugar', ratio: 1, sugarName: 'White sugar', liquid: 'Passion fruit purée',
      method: ['Stir sugar into the purée cold until dissolved. Strain seeds if using fresh fruit.'] },
    { id: 'tomato', n: 'Salted tomato', cat: 'Fruit', icon: '🍅', kind: 'sugar', ratio: 1, sugarName: 'White sugar', liquid: 'Tomato water or strained juice', prep: 'salted-tomato-syrup',
      adds: [{ n: 'Salt', pctTotal: 1, unit: 'g' }],
      method: ['Blend ripe tomatoes and strain through a cloth for tomato water (or use strained juice).', 'Stir in sugar and salt cold. Start with salt at about 1% of the total and taste.'] },
    { id: 'green-tea', n: 'Green tea', cat: 'Herbal', icon: '🍵', kind: 'sugar', ratio: 1, sugarName: 'White sugar', liquid: 'Brewed green tea', prep: 'green-tea-syrup',
      adds: [{ n: 'Loose green tea', perLiquid: 0.03, unit: 'g' }],
      method: ['Brew the tea at about 80 °C (not boiling) for 3–4 minutes and strain. Hotter or longer turns it bitter.', 'Stir in the sugar while warm.'] },
    { id: 'rosemary', n: 'Rosemary', cat: 'Herbal', icon: '🌿', kind: 'sugar', ratio: 1, sugarName: 'White sugar', liquid: 'Water', prep: 'rosemary-syrup',
      adds: [{ n: 'Rosemary sprigs', per500: 4, unit: 'sprigs' }],
      method: ['Make a warm 1:1 syrup, then steep the rosemary off the heat for 20–30 minutes.', 'Taste and strain. It gets piney fast.'] },
    { id: 'orgeat', n: 'Orgeat', cat: 'Andrew’s', icon: '🌰', kind: 'scaled', prep: 'orgeat', mine: true,
      items: [{ n: 'Almond milk', q: 2, unit: 'cup' }, { n: 'Sugar', q: 3, unit: 'cup' }, { n: 'Almond extract', q: 0.5, unit: 'tsp' }, { n: 'Rose water', q: 0.5, unit: 'tsp' }, { n: 'Orange blossom water', q: 1, unit: 'tsp' }],
      method: ['Your recipe: warm the almond milk and dissolve the sugar, then add the extract and floral waters off the heat.'] },
    { id: 'banana-oleo', n: 'Banana oleo', cat: 'Andrew’s', icon: '🍌', kind: 'scaled', prep: 'banana-oleo', mine: true, unitLabel: 'peels',
      items: [{ n: 'Banana peels', q: 1, unit: '' }, { n: 'Sugar', q: 0.5, unit: 'cup' }],
      method: ['Your ratio: toss chopped peels with sugar, rest until syrupy, then strain.'] },
    { id: 'mojito-cordial', n: 'Mojito cordial', cat: 'Andrew’s', icon: '🌱', kind: 'scaled', prep: 'mojito-cordial', mine: true,
      items: [{ n: 'Mint', q: 1, unit: 'big handful' }, { n: 'Lime juice', q: 100, unit: 'ml' }, { n: 'Water', q: 150, unit: 'ml' }, { n: 'Sugar', q: 100, unit: 'g' }, { n: 'Lime peel', q: 3, unit: 'g' }],
      method: ['Your recipe. Used in the Slushy Mojito.'] },
    { id: 'coffee-liqueur', n: 'Coffee liqueur', cat: 'Andrew’s', icon: '☕', kind: 'scaled', prep: 'coffee-liqueur', mine: true,
      items: [{ n: 'Ground coffee', q: 50, unit: 'g' }, { n: 'Vodka', q: 250, unit: 'ml' }, { n: 'Cinnamon stick', q: 1, unit: 'g' }, { n: 'Organic orange peel', q: 4, unit: 'g' }, { n: 'Vanilla extract (after 24 h)', q: 1, unit: 'tsp' }, { n: 'Demerara sugar (after 24 h)', q: 100, unit: 'g' }, { n: 'Hot water (after 24 h)', q: 85, unit: 'ml' }],
      method: ['Your recipe: steep coffee, cinnamon and peel in vodka for 24 hours. Strain, then add vanilla, sugar and hot water.'] }
  ];
  function syrupById(id) { for (var i = 0; i < SYRUPS.length; i++) if (SYRUPS[i].id === id) return SYRUPS[i]; }

  /* sugar syrup. ratio = sugar:liquid. basis 'weight' | 'volume' (cups). target = yield ml.
     Returns grams + volumes. Liquid assumed ~1 g/ml. */
  function sugarSyrup(ratio, target, basis) {
    var sugarPerMlLiquid = basis === 'volume' ? ratio * CUP_SUGAR_G / CUP_ML : ratio;   // g sugar per ml liquid
    var mlPerMlLiquid = 1 + sugarPerMlLiquid * SUCROSE_ML_PER_G;
    var liquid = target / mlPerMlLiquid, sugar = liquid * sugarPerMlLiquid;
    return finish(sugar, liquid, sugar, target);
  }
  function honeySyrup(sw, ratio, target, basis) {
    var s = SWEET[sw];
    // ratio = sweetener:liquid; by volume or weight
    var swMlPerLiquidMl = basis === 'volume' ? ratio : ratio / s.dens;
    var liquid = target / (1 + swMlPerLiquidMl);
    var swMl = liquid * swMlPerLiquidMl, swG = swMl * s.dens;
    var r = finish(swG, liquid, swG * s.sugar, target);
    r.sweetMl = swMl; return r;
  }
  function finish(sweetG, liquidMl, sugarG, yieldMl) {
    var totalG = sweetG + liquidMl;
    return { sweetG: sweetG, liquidMl: liquidMl, sugarG: sugarG, yieldMl: yieldMl,
      brix: sugarG / totalG * 100, gPerOz: sugarG / yieldMl * ML_PER_OZ, gPerMl: sugarG / yieldMl };
  }

  return { ML_PER_OZ: ML_PER_OZ, CUP_SUGAR_G: CUP_SUGAR_G, CUP_ML: CUP_ML, SUPER: SUPER, superJuice: superJuice,
    TARGETS: TARGETS, FRUITS: FRUITS, fruit: fruit, acidAdjust: acidAdjust,
    SWEET: SWEET, SYRUPS: SYRUPS, syrupById: syrupById, sugarSyrup: sugarSyrup, honeySyrup: honeySyrup };
});
