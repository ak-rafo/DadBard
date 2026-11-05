# Dad Bard v5.13

Removed the redundant Songbook results count. Favorites now sits below the style tiles on the left, opposite the sort selector, with mobile spacing and no duplicate Favorites button.

Fixed search focus: active search input and its ancestors remain in the DOM while results update, avoiding keyboard dismissal caused by replacing/refocusing the field. Applied to Songbook, Craft and Bloodlines; Apothecary ingredient search remains stable. Clear-search buttons still work.

Validation: continuous typing tests at 320, 390 and 1280 pixel widths passed in all four search sections, with zero blur events, retained input identity and no page errors. Favorites and sort controls did not overlap. Physical iPhone keyboard testing not performed.

Update: back up through Tavern > Export JSON. Replace the six app files with the same filenames, then open online once to update offline cache.
