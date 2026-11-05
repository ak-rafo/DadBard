# Dad Bard v5.8

Upload index.html, sw.js, manifest.webmanifest and the three icons to your existing GitHub repository, replacing the same filenames. Keep the same site URL so local notes and favorites remain available. Before updating, use Tavern > Export JSON as a backup.

## Changes
- Added Bamboo, Adonis, Sherry Cobbler, Hot Toddy, White Lady, Brown Derby, El Diablo, Rusty Nail, Godfather, Hotel Nacional Special, Mary Pickford, Jet Pilot and Cuba Libre.
- Added Bloody Maria, Red Snapper and Bloody Caesar styles; tequila and decaf Espresso Martini styles; Rum White Russian; Caipiroska; rum and brandy Toddies; aged-rum Cuba Libre. Boulevardier is now a Negroni style.
- Retained Ultimate Mai Tai, Corn n Oil, Pina Verde and Ray Gun as a Revolver style from the previous update.
- Renamed Andrew's category to Bard's, migrating saved category values without changing provenance.
- Favorite checkbox on each recipe/style and a Favorites button in Songbook. Ratings remain separate.
- Menu: Songbook, Apothecary, Bloodlines, Craft, Tavern. Fixed viewport anchoring and minimum page height for short search results.
- Apothecary ingredient finder: exact matches and one ingredient away, including styles and recipe versions. Optional ingredients ignored; required mixers, bitters and solids counted. Water/ice assumed. Hidden drinks excluded.
- Slushee planner: 1–10 L in 250 ml increments; target estimated sugar Brix 12–16; editable ABV cap, minimum water, ingredient sugar, density and volume. 1:1 or 2:1 adjustment syrup. Raw refractometer reading is verification only, not treated as true sugar in alcoholic mixtures.

## Calculation limits
This is an approximate sugar-mass and ethanol-volume balance, not a universal freezing predictor. Ingredient defaults are estimates, not measured brand specifications. Volume contraction, fat, fruit solids, acids and differing sugar types are not fully modeled. Follow machine limits and verify a small pre-chilled batch. A 10 L recipe may need multiple machine loads. Sources and house adaptations are labeled in recipe notes.

## Validation
67 built-in checks passed, zero failures. 16 broad ABV plausibility warnings remain (including deliberately lower-alcohol recipes); these are not code failures. Phone-sized Chromium interaction tests passed without page errors. 666 combinations of volume, target sugar Brix and adjustment syrup passed mass/volume/ABV checks. No physical iPhone or slush-machine test was performed.

## Real-iPhone checklist after upload
1. Open the site online in Safari, reload, then reopen the Home Screen app.
2. Search for Bloody Mary and a nonexistent name. With keyboard dismissed, menu stays at the screen bottom for one or zero results.
3. Confirm menu order in portrait and landscape.
4. Mark a recipe and a variant Favorite, then use Favorites in Songbook. Reload to check persistence.
5. In Apothecary, select white rum, lime and simple syrup; Daiquiri should be ready to make. Add cola for Cuba Libre.
6. Open Slushee, choose 1 L then 10 L, and targets 12, 14 and 16. Check ingredient edits and validation messages.
7. Reopen offline after first loading online. Notes, favorites and saved Apothecary settings should remain.
8. Export JSON, then import the backup to confirm notes and settings restore.
