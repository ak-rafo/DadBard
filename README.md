# The Spec Book

A personal, offline-capable cocktail reference: 100 drinks (70 modern, 20 classic, 10 tiki),
a technique layer, a lineage view anchored on Cocktail Codex's six root cocktails, and a
dilution/ABV/sugar/acid calculator. Plain HTML/JS. No build step and no dependencies.

## Publish on GitHub Pages
1. Create a repo (e.g. `spec-book`) and upload **everything in this folder**, keeping `icons/`.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / root → Save.
3. Open `https://<you>.github.io/spec-book/` in Safari → Share → **Add to Home Screen**.

## Updating
Edit the files, upload, then bump `VERSION` in `sw.js` (e.g. `specbook-v1.0.1`) so phones
fetch the new copy. Your notes are stored on the device (localStorage) and are not touched by
updates. Use More → Export JSON for backups.

## Files
| File | What it is |
|---|---|
| `data.js` | Ingredients (ABV / sugar / acid), the 100 drinks, technique pages |
| `calc.js` | Dilution + stats engine (coefficients can be changed in-app) |
| `tests.js` | Validation suite: `node tests.js` or More → Calculator check |
| `app.js` | UI: browse, filters, detail, lineage, techniques, notes |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline + home-screen app |

## Adding a drink
Copy any `add({...})` block in `data.js`. Spec items are `[amount, unit, ingredientKey, {options}]`.
- Units: `oz`, `dash`, `drop`, `tsp`, `bsp`, `top` (oz, added after ice), `white`, `egg`, plus
  no-volume units `leaf`, `slice`, `sprig`, `whole`, `pinch`, `handful`, `rinse`.
- Options: `post:true` (float, added after ice), `side:true` (served on the side), `label`, `note`.
- Set `parent` to a drink id **or** `parentText` for an ancestor that isn't in the collection,
  and always fill in `changed`.
- Run `node tests.js` afterward. It catches missing ingredients, broken parent links and missing technique pages.

## Content rules (kept on purpose)
- Specs are ingredient lists. All descriptive text, method text and technique pages are original wording.
- Online sources are link-outs (search links) for manual cross-checks. Nothing is scraped.
- `prov.conf` rates confidence in creator/venue/date. Low means "verify before citing."
- Source checkboxes start unticked. Tick one only after you've confirmed the drink in that source;
  the "Most sources ticked" sort gives you the overlap count.

## v2 roadmap (data model is ready)
- "What can I make?": inventory = set of ingredient keys; a drink is makeable if every
  non-solid key is owned. Add a `subs` map (e.g. `rye → bourbon`) for substitution hints.
- Batching: `Calc.compute()` already returns water per serve. Batch = spec × N + water × N.
- Side-by-side compare and template view: group by `fam`, normalize specs to ratios.
- Tasting log: extend `user.drinks[id]` with dated entries.
