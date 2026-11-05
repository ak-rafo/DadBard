# Dad Bard v5.26

Removed subtitles from the five Apothecary tool buttons: What can I make?, Slushee, Super juice, Syrups and Acid adjust. Buttons use centered icons and names with compact, consistent spacing. The Apothecary heading and tagline are unchanged.

Added global horizontal button-row continuity for rails, pill bars and icon pickers. Scrolling position is retained when selections rerender the row or navigate between calculator tabs. The clicked option is kept visible with minimal horizontal adjustment. Applies to Apothecary tool/category rows, Craft categories and other matching horizontal selector rows. Positions are in-memory and do not alter recipe data. Search-focus preservation remains intact.

Validation: 70 built-in checks passed, zero failures, six informational plausibility warnings. Tests at 320, 390 and 1280 px verified subtitle removal, Acid adjust selection retaining the row position and selected-button visibility, syrup-category and Craft-row selection, and search focus/Enter dismissal. No page errors. Physical iPhone/Safari testing not performed.

Update: Export JSON backup in Tavern first. Replace index.html, sw.js, manifest.webmanifest and the three icons with the same filenames and site URL. Open online once to refresh cache v5.26.0.
