# Dad Bard v5.29

Songbook search placeholder is now Search. Removed Swipe down to close wording from the filter popup; swipe dismissal and other filter behavior are unchanged. All v5.27 calculator and copy changes are retained.

Update: replace index.html and sw.js at the same site URL. Keep your existing manifest.webmanifest. Icons and grouping data are unchanged. Cache version: dadbard-v5.29.0.


## v5.29 update
Added Mezcal Negroni and 15 Handshake-inspired R&D reconstructions, with an R&D filter and linked preparation notes. These are user-supplied best guesses, not verified official recipes. Existing recipe specs are preserved. Optional pours, precise matcha weights, weighed yogurt, clarification-only milk and two-/four-serving batches are retained. R&D chemistry is unverified and is not used for slush calculations.

Ready-to-make text: Must have at least 2 lyrics to find a song.
Craft label: Home Techniques.
Bloodlines: requested copy removed; Search, Era, Style and Codex family controls collapse to save space.
Supplied icons included; offline cache updated.

## Deploy
Replace the corresponding repository files with the extracted files. Keep index.html named index.html. The app retains its embedded manifest mechanism. Personal browser notes are not included in this package.

## Test scope
Chromium checks at 320, 390 and 1280 px passed for recipe pages, precise weight conversion, batch scaling, Codex controls and horizontal overflow. R&D filter, Evolution search and preparation-page loading were also checked. No runtime errors in the final checks. This is not a physical iPhone/Safari test or verification of cocktail authenticity.

## Real-iPhone checklist
- Open the deployed app in Safari and from the home screen.
- Check the supplied icon and R&D filter.
- Open R&D recipes and preparation links.
- Double Matcha Yuzu from four to eight servings.
- Toggle oz/ml and confirm matcha remains a precise weight in grams.
- Expand/collapse Bloodlines filters and change selections.
- Check saved notes and offline loading after the update.
