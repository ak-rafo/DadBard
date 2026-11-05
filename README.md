# Dad Bard v5.9

## This update
- Named variants and riffs, including Bard originals, are grouped under their main cocktail using recorded parent relationships. Main cocktail anchors remain distinct; recipes without a recorded parent remain standalone.
- Example: browse Old Fashioned, then choose Rosa Maria. Searching Rosa maria (with or without accents) shows Rosa Maria and opens its style directly.
- Search results show individual matching recipes and the parent cocktail. Browsing without search shows only main cocktails.
- Bard category and Favorites include main cocktails containing matching styles.
- Added an accessible X clear button to every existing search field: Songbook, Craft, Bloodlines and Apothecary ingredient search. Clears only search text and preserves other filters.
- New Bard recipes can be added as a style of a main cocktail in the editor.
- Recipe IDs, notes, ratings, favorites, versions and provenance are retained.

## Update
Back up using Tavern > Export JSON. Replace the six app files in your existing GitHub repository with the same filenames. Keep the site URL unchanged. Load online once to update the offline cache.

## Validation
67 built-in checks pass. Phone-sized browser tests confirm Rosa Maria is not a separate browse card, search opens the Rosa Maria style under Old Fashioned, and X clears search on all four searchable sections. No browser page errors. Physical iPhone testing remains necessary.

## iPhone checklist
1. Browse Old Fashioned and select Rosa Maria.
2. Search Rosa maria without accents; tap the result and verify the selected style.
3. Clear search with X. Check Bard category and Favorites still work.
4. Check X in Craft, Bloodlines and Apothecary ingredient search.
5. Verify your notes and favorites after reloading, and reopen offline after first loading online.
