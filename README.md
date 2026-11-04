# Dad Bard 🪕

*Songs of the home bar, sung slightly off-key.*

A personal, offline cocktail songbook: the core 100 (70 modern, 20 classic, 10 tiki) plus your notes
(27 originals, 5 classics added, 13 Andrew's versions), your house prep recipes,
a technique layer, a lineage view anchored on Cocktail Codex's six root cocktails, and a
dilution/ABV/sugar/acid calculator. Plain HTML/JS. No build step and no dependencies.

## Publish on GitHub Pages
1. Create a repo (e.g. `dad-bard`) and upload **everything in this folder**, keeping `icons/`.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / root → Save.
3. Open `https://<you>.github.io/dad-bard/` in Safari → Share → **Add to Home Screen**.

## Updating
Edit the files, upload, then bump `VERSION` in `sw.js` (e.g. `dadbard-v2.0.1`) so phones
fetch the new copy. Your notes are stored on the device (localStorage) and are not touched by
updates. Use More → Export JSON for backups.

## Files
| File | What it is |
|---|---|
| `data.js` | Ingredients (ABV / sugar / acid), the core 100 drinks, technique pages |
| `variations.js` | Missing classics & tiki, plus variation groups (Dry/Wet/Dirty Martini, etc.) |
| `andrew.js` | **Your layer:** Andrew's versions, your originals, prep recipes, [?] flags |
| `calc.js` | Dilution + stats engine (coefficients can be changed in-app) |
| `tests.js` | Validation suite: `node tests.js` or More → Calculator check |
| `app.js` | UI: songbook + filter sheet, detail, Codex families, bar craft, tavern |
| `evolution.js` | Evolution tree: 34 styles from punch & the 1806 cocktail to today |
| `apothecary.js` | Super juice (Kevin Kos ratios), syrups, acid-adjust data + math |
| `views.js` | Evolution timeline/tree and Apothecary screens |
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

## Your notes layer (`andrew.js`)
- `av:` on a traditional drink = **Andrew's version**. The drink page opens on your version, with a
  Traditional tab and a "What changed" diff.
- `match:true` = your notes agree with the traditional spec (Last Word, Carajillo).
- `src:'andrew'` = your original; `exp:true` = experimental; `batch:true` = large format.
- `said:` = your line exactly as written, shown on the drink page.
- `flags:` = [?] items. They all collect in Tavern → Bard's to-do list. Delete a flag once it's resolved.
- Prep pages with `missing:true` are recipes used in specs but not written down yet.

## Apothecary sources
- Super juice: Kevin Kos (lime 0.66× citric + 0.33× malic, lemon 1× citric, orange 0.9× citric + 0.1× malic, water 16.66× peel weight).
- Acid adjust: published per-liter ratios for orange, grapefruit, pineapple; other fruits estimated from lime ≈ 4% citric + 2% malic, lemon ≈ 6% citric.
- Syrup starter recipes are my wording. "Save to my … page" writes your version into the matching prep page.

## Variations
Drinks named "<style> <Base>" are folded into one entry with a Style picker (e.g. Martini: Dry, Wet,
Fifty-Fifty, Perfect, Dirty, Gibson, Vesper). Each style keeps its own id, notes and rating, so old links
(e.g. `#/d/dirty-martini`) still open the right style. Andrew's originals are never folded.
Add a style in `variations.js` → `GROUPS`.
